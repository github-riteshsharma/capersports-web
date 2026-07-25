const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const invoiceRoutes = require('./routes/invoices');
const clientRoutes = require('./routes/clients');

// Create Express app
const app = express();

app.locals.cloudinary = cloudinary;

// Security middleware (disable CSP so React assets load smoothly)
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3001',
      'http://localhost:3000',
      'https://capersports-web.onrender.com',
      process.env.FRONTEND_URL,
      process.env.CORS_ORIGIN
    ].filter(Boolean);

    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin === origin) return true;
      if (origin && origin.includes('.onrender.com')) return true;
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked origin: ${origin}`);
      callback(null, true); // Permissive callback during hosting migration
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder
app.use('/uploads', express.static('uploads'));

// -------------------------------------------------------------
// SERVE REACT FRONTEND PRODUCTION BUILD
// -------------------------------------------------------------
const clientBuildPath = path.join(__dirname, '../client/build');
app.use(express.static(clientBuildPath));

// Database connection setup
async function initializeDatabase() {
  if (!process.env.MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI is not set in environment variables. Skipping DB connection.');
    return;
  }

  try {
    console.log('🟢 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 50,
      minPoolSize: 10,
      maxIdleTimeMS: 30000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      retryReads: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('⚠️ Server will start WITHOUT database connection for debugging');
  }
}

// Mount Routes
console.log('🔧 Mounting routes...');
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/invoices', invoiceRoutes);
app.use('/api/clients', clientRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy';
    const storageStatus = (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) ? 'healthy' : 'unhealthy';

    res.status(200).json({
      status: 'success',
      message: 'Caper Sports API is running!',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          type: 'MongoDB',
          status: dbStatus
        },
        storage: {
          type: 'Cloudinary',
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
});

// -------------------------------------------------------------
// REACT SPA CATCH-ALL ROUTE (Fixes 404 on GET /)
// -------------------------------------------------------------
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  } else {
    console.error(`❌ 404 - Unmatched API route: ${req.method} ${req.path}`);
    res.status(404).json({
      status: 'error',
      message: 'API route not found',
      path: req.path,
      method: req.method
    });
  }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
  }
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || '0.0.0.0';

async function startServer() {
  try {
    await initializeDatabase();

    const server = app.listen(PORT, HOST, () => {
      console.log('='.repeat(60));
      console.log(`🚀 Server started successfully!`);
      console.log(`   - Address: http://${HOST}:${PORT}`);
      console.log(`   - Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   - Database: MongoDB`);
      console.log(`   - Storage: Cloudinary`);
      console.log('='.repeat(60));
    });

    server.on('error', (error) => {
      console.error(`❌ Server error:`, error);
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
}

startServer();

module.exports = app;
