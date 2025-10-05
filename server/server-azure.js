const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Initialize Azure services if configured
let azureCosmosService = null;
let azureBlobService = null;
let cloudinary = null;

// Check if Azure is configured
const isAzureConfigured = process.env.AZURE_COSMOS_CONNECTION_STRING && process.env.AZURE_STORAGE_CONNECTION_STRING;

if (isAzureConfigured) {
  console.log('🔵 Azure configuration detected - initializing Azure services...');
  const AzureCosmosService = require('./services/azureCosmosService');
  const AzureBlobService = require('./services/azureBlobService');
  
  azureCosmosService = new AzureCosmosService();
  azureBlobService = new AzureBlobService();
} else {
  console.log('🟠 Using MongoDB + Cloudinary configuration...');
  // Configure Cloudinary for non-Azure setup
  cloudinary = require('cloudinary').v2;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
    api_key: process.env.CLOUDINARY_API_KEY || 'demo',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'demo',
  });
}

// Import routes
const authRoutes = require('./routes/auth-azure'); // Use Azure-compatible auth routes
const productRoutes = require('./routes/products-azure'); // Use Azure-compatible routes
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users-azure'); // Use Azure-compatible user routes
const adminRoutes = require('./routes/admin-azure'); // Use Azure-compatible admin routes
const invoiceRoutes = require('./routes/invoices');

// Create Express app
const app = express();

// Make Azure services available to routes
app.locals.azureCosmosService = azureCosmosService;
app.locals.azureBlobService = azureBlobService;
app.locals.cloudinary = cloudinary;
app.locals.isAzureConfigured = isAzureConfigured;

// Security middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000, // limit each IP to requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3001',
      process.env.CORS_ORIGIN
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving
app.use('/uploads', express.static('uploads'));

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, 'public')));
}

// Database connection setup
async function initializeDatabase() {
  if (isAzureConfigured) {
    // Initialize Azure Cosmos DB
    try {
      console.log('🔵 Connecting to Azure Cosmos DB...');
      await azureCosmosService.connect();
      
      // Initialize blob storage containers
      console.log('🔵 Initializing Azure Blob Storage...');
      await azureBlobService.initializeContainers();
      
      console.log('✅ Azure services initialized successfully');
    } catch (error) {
      console.error('❌ Azure initialization error:', error);
      process.exit(1);
    }
  } else {
    // Connect to MongoDB
    try {
      console.log('🟠 Connecting to MongoDB...');
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('✅ MongoDB connected successfully');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      process.exit(1);
    }
  }
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/invoices', invoiceRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    let dbStatus = 'unknown';
    let storageStatus = 'unknown';
    
    if (isAzureConfigured) {
      // Check Azure services
      const cosmosHealth = await azureCosmosService.healthCheck();
      dbStatus = cosmosHealth.status;
      
      try {
        await azureBlobService.listFiles('assets');
        storageStatus = 'healthy';
      } catch (error) {
        storageStatus = 'unhealthy';
      }
    } else {
      // Check MongoDB
      dbStatus = mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy';
      storageStatus = cloudinary ? 'healthy' : 'unhealthy';
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Caper Sports API is running!',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          type: isAzureConfigured ? 'Azure Cosmos DB' : 'MongoDB',
          status: dbStatus
        },
        storage: {
          type: isAzureConfigured ? 'Azure Blob Storage' : 'Cloudinary',
          status: storageStatus
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Azure migration endpoint (development only)
if (process.env.NODE_ENV === 'development') {
  app.post('/api/admin/migrate-to-azure', async (req, res) => {
    try {
      if (!isAzureConfigured) {
        return res.status(400).json({
          status: 'error',
          message: 'Azure services not configured'
        });
      }
      
      const { migrateToAzure } = require('./scripts/migrateToAzure');
      await migrateToAzure();
      
      res.json({
        status: 'success',
        message: 'Migration to Azure completed successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Migration failed',
        error: error.message
      });
    }
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
});

// Serve React app for all non-API routes in production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.get('*', (req, res) => {
    // Only serve index.html for non-API routes
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
      res.status(404).json({
        status: 'error',
        message: 'API route not found',
      });
    }
  });
} else {
  // 404 handler for development
  app.use('*', (req, res) => {
    res.status(404).json({
      status: 'error',
      message: 'Route not found',
    });
  });
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  
  if (isAzureConfigured && azureCosmosService) {
    await azureCosmosService.disconnect();
  } else if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
  
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0';

async function startServer() {
  try {
    // Initialize database first
    await initializeDatabase();
    
    // Start server
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on ${HOST}:${PORT} in ${process.env.NODE_ENV} mode`);
      console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
      console.log(`🔗 API Health Check: http://${HOST}:${PORT}/api/health`);
      console.log(`💾 Database: ${isAzureConfigured ? 'Azure Cosmos DB' : 'MongoDB'}`);
      console.log(`🖼️  Storage: ${isAzureConfigured ? 'Azure Blob Storage' : 'Cloudinary'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
