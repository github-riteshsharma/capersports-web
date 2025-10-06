# Caper Sports - Premium Athletic Wear E-commerce Platform

A full-stack MERN e-commerce platform for premium sports clothing, featuring modern UI/UX, admin dashboard, payment processing, and Azure cloud deployment.

![Caper Sports](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![Azure](https://img.shields.io/badge/Deploy-Azure-blue)

---

## 📚 Table of Contents

- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Local Development](#-local-development)
- [Azure Deployment](#-azure-deployment)
- [Azure Migration Guide](#-azure-migration-mongodb-to-cosmos-db--blob-storage)
- [Troubleshooting](#-troubleshooting)
- [API Endpoints](#-api-endpoints)
- [GitHub Actions CI/CD](#-github-actions-cicd)
- [Security](#-security)
- [Performance](#-performance)
- [Cost Optimization](#-cost-optimization)
- [Contributing](#-contributing)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- MongoDB or Azure Cosmos DB
- Azure account (for cloud deployment)
- Stripe account (for payments)

### Local Installation

```bash
# Clone repository
git clone https://github.com/yourusername/capersports-web.git
cd capersports-web

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment Setup

**Server (.env in server folder):**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/capersports
JWT_SECRET=your-super-secure-jwt-secret-at-least-32-characters
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

**Client (.env in client folder):**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_NAME=CaperSports
REACT_APP_ENV=development
```

### Run the Application

```bash
# Start backend (from server folder)
cd server
npm run dev

# Start frontend (from client folder - in new terminal)
cd client
npm start
```

Visit: `http://localhost:3000`

---

## 🏗️ Project Structure

```
capersports-web/
├── client/                         # React Frontend
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── admin/            # Admin dashboard components
│   │   │   ├── auth/             # Authentication components
│   │   │   ├── common/           # Shared components (loaders, buttons)
│   │   │   ├── layout/           # Layout components (navbar, footer)
│   │   │   └── products/         # Product-related components
│   │   ├── pages/                # Page components
│   │   │   ├── admin/           # Admin dashboard pages
│   │   │   └── auth/            # Authentication pages
│   │   ├── services/            # API services
│   │   ├── store/               # Redux store and slices
│   │   └── App.js               # Main app component
│   ├── public/
│   │   └── images/              # Static assets
│   └── package.json
├── server/                         # Node.js/Express Backend
│   ├── middleware/               # Express middleware
│   ├── models/                  # MongoDB/Cosmos DB models
│   ├── routes/                  # API routes
│   ├── services/                # Azure services integration
│   ├── scripts/                 # Database scripts
│   ├── server.js               # Server entry point
│   └── package.json
└── README.md                     # This file
```

---

## 🎨 Features

### Frontend Features
- ✨ **Modern UI/UX** - Tailwind CSS with Framer Motion animations
- 📱 **Responsive Design** - Mobile-first approach
- 🎭 **Premium Navigation** - Animated navigation with smooth transitions
- 🛍️ **Product Catalog** - Advanced filtering and search
- 🛒 **Shopping Cart** - Real-time cart management
- 🔐 **User Authentication** - JWT-based auth with protected routes
- 👑 **Admin Dashboard** - Comprehensive admin panel
- 💳 **Payment Integration** - Stripe payment processing
- 📸 **Instagram Integration** - Dynamic Instagram feed
- 🖼️ **Image Management** - Cloudinary/Azure Blob Storage integration

### Backend Features
- 🚀 **RESTful API** - Express.js with proper error handling
- 🔒 **Authentication** - JWT tokens with refresh mechanism
- 💾 **Database** - MongoDB/Azure Cosmos DB with Mongoose ODM
- 📤 **File Upload** - Cloudinary or Azure Blob Storage
- 📧 **Email Service** - Nodemailer for notifications
- 🛡️ **Security** - Helmet, CORS, rate limiting
- 👨‍💼 **Admin Features** - User management, product CRUD, order tracking

### Admin Dashboard
- 📊 **Dashboard Analytics** - Sales, orders, and user metrics
- 🛍️ **Product Management** - CRUD operations with image upload
- 📦 **Order Management** - Order tracking and status updates
- 👥 **User Management** - Customer data and admin controls
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Collapsible Sidebar** - Space-efficient navigation

---

## 📦 Tech Stack

### Frontend
- **React 18** - Latest React with hooks
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB/Cosmos DB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Cloudinary/Azure Blob** - Image management
- **Stripe** - Payment processing

### DevOps & Deployment
- **Azure App Service** - Backend hosting
- **Azure Static Web Apps** - Frontend hosting
- **Azure Cosmos DB** - Cloud database (MongoDB API)
- **Azure Blob Storage** - File storage
- **GitHub Actions** - CI/CD pipeline

---

## 🛠️ Local Development

### Database Setup

**Option 1: Local MongoDB**
```bash
# Install MongoDB
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Connect
mongosh
```

**Option 2: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `.env` with connection string

### Running Development Servers

```bash
# Backend with hot reload
cd server
npm run dev

# Frontend with hot reload
cd client
npm start
```

### Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

---

## ☁️ Azure Deployment

### Why Azure?

**Cost Savings**: 20-40% reduction in monthly costs
- MongoDB Atlas + Cloudinary: ~$50-100/month
- Azure Cosmos DB + Blob Storage: ~$30-65/month

**Benefits**:
- Unified Azure ecosystem
- Better integration with Azure services
- Global distribution with Cosmos DB
- CDN integration for blob storage
- Single billing and management

### Azure Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Client  │    │  Express Server  │    │  Azure Cosmos   │
│                 │────│                  │────│  DB (MongoDB)   │
│  (Static Web    │    │  (App Service)   │    │                 │
│   Apps)         │    │                  │    └─────────────────┘
└─────────────────┘    │                  │    
                       │                  │    ┌─────────────────┐
                       │                  │────│  Azure Blob     │
                       │                  │    │  Storage        │
                       └──────────────────┘    │  (Images)       │
                                               └─────────────────┘
```

### Quick Azure Setup (Automated)

```bash
# Run the automated setup script
./setup-azure.sh

# This will create:
# - Azure Resource Group
# - Cosmos DB with MongoDB API
# - Blob Storage with containers
# - Environment configuration
```

### Manual Azure Setup

#### Step 1: Create Resource Group
```bash
az group create --name capersports-rg --location eastus
```

#### Step 2: Create Azure Cosmos DB (MongoDB API)
```bash
az cosmosdb create \
  --name capersports-db \
  --resource-group capersports-rg \
  --kind MongoDB \
  --locations regionName=eastus \
  --default-consistency-level Session
```

**Get Connection String:**
```bash
az cosmosdb keys list \
  --name capersports-db \
  --resource-group capersports-rg \
  --type connection-strings \
  --query "connectionStrings[0].connectionString" -o tsv
```

#### Step 3: Create Storage Account
```bash
az storage account create \
  --name capersportsstorage \
  --resource-group capersports-rg \
  --location eastus \
  --sku Standard_LRS
```

**Create Blob Containers:**
```bash
az storage container create --name product-images --account-name capersportsstorage --public-access blob
az storage container create --name user-avatars --account-name capersportsstorage --public-access blob
az storage container create --name general-assets --account-name capersportsstorage --public-access blob
```

#### Step 4: Create App Service
```bash
# Create App Service Plan
az appservice plan create \
  --name capersports-plan \
  --resource-group capersports-rg \
  --sku B1 \
  --is-linux

# Create App Service
az webapp create \
  --name capersports-api \
  --resource-group capersports-rg \
  --plan capersports-plan \
  --runtime "NODE:18-lts"
```

#### Step 5: Configure Environment Variables
```bash
az webapp config appsettings set \
  --name capersports-api \
  --resource-group capersports-rg \
  --settings \
    NODE_ENV=production \
    AZURE_COSMOS_CONNECTION_STRING="<your-connection-string>" \
    AZURE_COSMOS_DATABASE_NAME=capersports \
    AZURE_STORAGE_CONNECTION_STRING="<your-storage-connection>" \
    AZURE_STORAGE_ACCOUNT_NAME=capersportsstorage \
    JWT_SECRET="$(openssl rand -base64 32)" \
    JWT_EXPIRE=30d \
    FRONTEND_URL="https://your-frontend.azurestaticapps.net"
```

#### Step 6: Deploy
```bash
cd server
zip -r deploy.zip . -x "node_modules/*" -x ".env" -x ".git/*"
az webapp deployment source config-zip \
  --resource-group capersports-rg \
  --name capersports-api \
  --src deploy.zip
rm deploy.zip
```

### Azure Environment Variables

Add these to your Azure App Service Configuration:

```env
# Azure Cosmos DB (MongoDB API)
AZURE_COSMOS_CONNECTION_STRING=mongodb://...
AZURE_COSMOS_DATABASE_NAME=capersports

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...
AZURE_STORAGE_ACCOUNT_NAME=capersportsstorage
AZURE_STORAGE_ACCOUNT_KEY=...

# Container names
AZURE_BLOB_CONTAINER_PRODUCTS=product-images
AZURE_BLOB_CONTAINER_USERS=user-avatars
AZURE_BLOB_CONTAINER_ASSETS=general-assets

# Application config
NODE_ENV=production
PORT=8080
JWT_SECRET=<generate-random-64-character-string>
JWT_EXPIRE=30d
FRONTEND_URL=https://your-frontend.azurestaticapps.net
CORS_ORIGIN=https://your-frontend.azurestaticapps.net
```

---

## 🔄 Azure Migration: MongoDB to Cosmos DB + Blob Storage

### Migration Process

#### 1. Install Azure Dependencies
```bash
cd server
npm install @azure/storage-blob @azure/cosmos uuid
```

#### 2. Configure Environment
Create `.env.azure` file:
```env
AZURE_COSMOS_CONNECTION_STRING=mongodb://...
AZURE_COSMOS_DATABASE_NAME=capersports
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...
AZURE_STORAGE_ACCOUNT_NAME=capersportsstorage
```

#### 3. Run Migration
```bash
# Migrate existing data from MongoDB to Cosmos DB
npm run migrate:azure

# Start server with Azure services
npm run dev:azure
```

### Available Scripts

**Azure-specific scripts:**
```bash
npm run dev:azure              # Development with Azure services
npm run start:azure            # Production with Azure services
npm run migrate:azure          # Migrate from MongoDB to Azure
```

**Traditional scripts:**
```bash
npm run dev                    # Development with MongoDB/Cloudinary
npm run start                  # Production with MongoDB/Cloudinary
```

The server automatically detects which services are configured and uses them accordingly.

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Backend Not Starting
**Symptoms**: Server crashes on startup

**Solutions**:
- Check MongoDB/Cosmos DB connection string
- Verify all environment variables are set
- Check server logs for specific errors
```bash
# Check logs
az webapp log tail --name capersports-api --resource-group capersports-rg
```

#### 2. CORS Errors
**Symptoms**: Frontend can't connect to backend

**Solutions**:
- Ensure `FRONTEND_URL` matches your frontend URL exactly
- Verify CORS configuration in `server.js`
- Check both HTTP and HTTPS protocols match
```javascript
// server.js
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

#### 3. Database Connection Failed
**Symptoms**: "URI must include hostname, domain name, and tld"

**Solutions**:
- Verify connection string format
- Check if password is included in connection string
- Test connection string locally first
```bash
# Get correct connection string
az cosmosdb keys list \
  --name capersports-db \
  --resource-group capersports-rg \
  --type connection-strings
```

#### 4. Azure 403 Site Disabled
**Symptoms**: Deployment fails with 403 error

**Solutions**:
```bash
# Check if app is running
az webapp show --name capersports-api --resource-group capersports-rg --query "state"

# Start the app if stopped
az webapp start --name capersports-api --resource-group capersports-rg

# Enable basic auth for deployments
az resource update \
  --resource-group capersports-rg \
  --name ftp \
  --resource-type basicPublishingCredentialsPolicies \
  --parent sites/capersports-api \
  --set properties.allow=true
```

#### 5. Build Failures
**Symptoms**: GitHub Actions build fails

**Solutions**:
- Verify Node.js version (18.x)
- Check all dependencies in package.json
- Review GitHub Actions logs for specific errors
- Clear cache and rebuild:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 6. Blob Storage Access Issues
**Symptoms**: Images not loading, 403 on blob URLs

**Solutions**:
- Enable public access on storage account
- Set containers to "Blob" public access level
- Verify connection string is correct
```bash
# Enable public access
az storage account update \
  --name capersportsstorage \
  --resource-group capersports-rg \
  --allow-blob-public-access true
```

### Debug Commands

```bash
# Check Azure App Service logs
az webapp log tail --name capersports-api --resource-group capersports-rg

# Check app status
az webapp show --name capersports-api --resource-group capersports-rg

# List all app settings
az webapp config appsettings list --name capersports-api --resource-group capersports-rg

# Test API health
curl https://capersports-api.azurewebsites.net/api/health

# Download all logs
az webapp log download --name capersports-api --resource-group capersports-rg
```

---

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `POST /api/products/:id/review` - Add product review (protected)

### Orders
- `GET /api/orders` - Get user orders (protected)
- `POST /api/orders` - Create new order (protected)
- `GET /api/orders/:id` - Get single order (protected)
- `PUT /api/orders/:id` - Update order status (admin)
- `GET /api/orders/:id/invoice` - Download invoice (protected)

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics (admin)
- `GET /api/admin/users` - Get all users (admin)
- `PUT /api/admin/users/:id` - Update user (admin)
- `DELETE /api/admin/users/:id` - Delete user (admin)
- `GET /api/admin/orders` - Get all orders (admin)

### Utility
- `GET /api/health` - Health check endpoint
- `GET /api/debug` - Debug information (development only)

---

## 🔄 GitHub Actions CI/CD

### Setup GitHub Actions

#### Step 1: Get Publish Profile
```bash
az webapp deployment list-publishing-profiles \
  --name capersports-api \
  --resource-group capersports-rg \
  --xml
```

#### Step 2: Add GitHub Secret
1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
4. Value: Paste the XML from Step 1

#### Step 3: Workflow File
Create `.github/workflows/azure-deploy.yml`:

```yaml
name: Deploy to Azure App Service

on:
  push:
    branches:
      - main
  workflow_dispatch:

env:
  AZURE_WEBAPP_NAME: capersports-api
  NODE_VERSION: '18.x'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: 'Checkout code'
      uses: actions/checkout@v3
    
    - name: 'Set up Node.js'
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        cache-dependency-path: server/package-lock.json
    
    - name: 'Install dependencies'
      run: |
        cd server
        npm ci --production
    
    - name: 'Deploy to Azure Web App'
      uses: azure/webapps-deploy@v2
      with:
        app-name: ${{ env.AZURE_WEBAPP_NAME }}
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: server
```

#### Step 4: Push and Deploy
```bash
git add .github/workflows/azure-deploy.yml
git commit -m "Add GitHub Actions deployment"
git push origin main
```

---

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt encryption
- **Rate Limiting** - API request throttling
- **CORS Protection** - Cross-origin request security
- **Input Validation** - Mongoose schema validation
- **Security Headers** - Helmet.js implementation
- **Environment Variables** - Secure configuration management
- **XSS Protection** - Cross-site scripting prevention
- **SQL Injection Protection** - NoSQL injection prevention

### Security Best Practices

```javascript
// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Helmet security headers
const helmet = require('helmet');
app.use(helmet());

// Password hashing
const bcrypt = require('bcryptjs');
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
```

---

## ⚡ Performance Optimizations

### Frontend
- **Code Splitting** - Lazy loading of components
- **Image Optimization** - Cloudinary/Azure transformations
- **Caching** - Redux persist for state
- **Bundle Analysis** - Webpack bundle optimization
- **Compression** - Gzip compression for assets

### Backend
- **Database Indexing** - MongoDB/Cosmos DB indexes for queries
- **Compression** - Gzip compression enabled
- **Caching** - Response caching for static data
- **Connection Pooling** - Database connection optimization
- **Query Optimization** - Efficient database queries

### Performance Monitoring

```javascript
// Application Insights integration
const appInsights = require('applicationinsights');
appInsights.setup('YOUR_INSTRUMENTATION_KEY').start();

// Custom metrics
const { TelemetryClient } = require('applicationinsights');
const client = new TelemetryClient();
client.trackMetric({ name: 'API Response Time', value: duration });
```

---

## 💰 Cost Optimization

### Development/Testing
- **Static Web App**: Free (100GB bandwidth/month)
- **App Service**: ~$13/month (B1 Basic)
- **Cosmos DB**: ~$24/month (400 RU/s)
- **Blob Storage**: ~$2/month (10GB)
- **Total**: ~$39/month

### Production
- **Static Web App**: Free
- **App Service**: ~$55/month (S1 Standard)
- **Cosmos DB**: ~$24/month (Serverless or 400 RU/s)
- **Blob Storage**: ~$5/month (with CDN)
- **Total**: ~$84/month

### Cost Savings Tips
1. Use Azure free tier when available
2. Set up budget alerts
3. Use serverless Cosmos DB for variable workloads
4. Implement CDN for blob storage
5. Monitor and optimize RU/s consumption
6. Use LRS redundancy for non-critical data
7. Clean up unused resources regularly

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint configuration
- Write unit tests for new features
- Update documentation for API changes
- Use conventional commit messages
- Keep code DRY and maintainable

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🆘 Support

### Quick Commands Reference

```bash
# Azure Commands
az webapp start --name capersports-api --resource-group capersports-rg
az webapp stop --name capersports-api --resource-group capersports-rg
az webapp restart --name capersports-api --resource-group capersports-rg
az webapp log tail --name capersports-api --resource-group capersports-rg

# Local Development
npm run dev          # Backend development server
npm start           # Frontend development server
npm test            # Run tests
npm run build       # Build for production

# Azure Deployment
./setup-azure.sh    # Automated Azure setup
git push origin main # Trigger GitHub Actions deployment
```

### Resources
- **Azure Portal**: https://portal.azure.com
- **Azure Status**: https://status.azure.com
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **GitHub Issues**: Report bugs and feature requests

---

## 🎉 Acknowledgments

Built with ❤️ using:
- **React** - Facebook's UI library
- **Node.js** - JavaScript runtime
- **MongoDB/Cosmos DB** - Modern database
- **Azure** - Microsoft's cloud platform
- **Stripe** - Payment processing
- **Cloudinary/Azure Blob** - Image management

**Status**: 🚀 Production Ready | ⚡ High Performance | 🔒 Secure | 📱 Mobile First

---

**© 2024 Caper Sports. All rights reserved.**
