

# Caper Sports - Premium Athletic Wear E-commerce Platform

A full-stack MERN e-commerce platform for premium sports clothing, featuring modern UI/UX, admin dashboard, payment processing, and cloud deployment ready for Azure.

![Caper Sports](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![Azure](https://img.shields.io/badge/Deploy-Azure-blue)

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
│   │   └── utils/               # Utility functions
│   ├── public/
│   │   └── images/              # Static assets
│   └── package.json
├── server/                         # Node.js/Express Backend
│   ├── middleware/               # Express middleware
│   ├── models/                  # MongoDB models
│   ├── routes/                  # API routes
│   ├── scripts/                 # Database scripts
│   ├── server.js               # Server entry point
│   └── package.json
├── .github/workflows/             # GitHub Actions CI/CD
└── README.md                     # This file
```

## 🚨 Azure Deployment Issues? Start Here!

### Issue 1: "Failed to deploy web package" (OneDeploy Error)

**Fixed!** The GitHub Actions workflow has been updated with the correct deployment structure.

**What to do**:
```bash
# Commit and push the fixes
git add .
git commit -m "Fix Azure deployment structure"
git push origin main
```

GitHub Actions will automatically deploy with the correct structure.

📖 **Details**: See [AZURE_DEPLOYMENT_FIX.md](./AZURE_DEPLOYMENT_FIX.md)

---

### Issue 2: "URI must include hostname, domain name, and tld"

This means your Azure Cosmos DB connection string is not properly configured.

**Quick Fix (Automated)**:
```bash
./fix-azure-env.sh
```

This script will:
1. ✅ Retrieve the correct connection strings from Azure
2. ✅ Set all required environment variables in App Service
3. ✅ Restart your application
4. ✅ Verify the configuration

**Manual Fix**:
1. **Get Connection String**: Azure Portal → Cosmos DB → Connection strings → Copy "Primary Connection String"
2. **Set in App Service**: Azure Portal → App Service → Configuration → New application setting
   - Name: `AZURE_COSMOS_CONNECTION_STRING`
   - Value: (paste the connection string)
3. **Save and Restart**: Click Save → Restart

📖 **Full guides**:
- [AZURE_DEPLOYMENT_FIX.md](./AZURE_DEPLOYMENT_FIX.md) - Deployment issues
- [AZURE_DEPLOYMENT_TROUBLESHOOTING.md](./AZURE_DEPLOYMENT_TROUBLESHOOTING.md) - Connection issues
- [AZURE_PORTAL_FIX.md](./AZURE_PORTAL_FIX.md) - Quick portal fix

---

## 🔄 Azure Migration: MongoDB → Cosmos DB + Blob Storage

### Why Migrate to Azure?

**Cost Savings**: 20-40% reduction in monthly costs
- MongoDB Atlas + Cloudinary: ~$50-100/month
- Azure Cosmos DB + Blob Storage: ~$30-65/month

**Benefits**:
- Unified Azure ecosystem
- Better integration with Azure services
- Global distribution with Cosmos DB
- CDN integration for blob storage
- Single billing and management

### Automated Azure Setup

**Quick Setup (Recommended)**:
```bash
# Run the automated setup script
./setup-azure.sh

# This will create:
# - Azure Resource Group
# - Cosmos DB with MongoDB API
# - Blob Storage with containers
# - Environment configuration
```

**Manual Setup**:
```bash
# 1. Create Resource Group
az group create --name caper-sports-rg --location eastus

# 2. Create Cosmos DB (MongoDB API)
az cosmosdb create \
  --resource-group caper-sports-rg \
  --name caper-sports-cosmos \
  --kind MongoDB \
  --server-version 4.2

# 3. Create Storage Account
az storage account create \
  --name capersportsstorage \
  --resource-group caper-sports-rg \
  --location eastus \
  --sku Standard_LRS

# 4. Create Blob Containers
az storage container create --name product-images --account-name capersportsstorage --public-access blob
az storage container create --name user-avatars --account-name capersportsstorage --public-access blob
az storage container create --name general-assets --account-name capersportsstorage --public-access blob
```

### Migration Process

**1. Install Azure Dependencies**:
```bash
cd server
npm install @azure/storage-blob @azure/cosmos uuid
```

**2. Configure Environment**:
```bash
# Copy the generated Azure configuration
cp .env.azure .env

# Or manually add to your .env:
AZURE_COSMOS_CONNECTION_STRING=mongodb://your-cosmos-account:key@your-cosmos-account.mongo.cosmos.azure.com:10255/...
AZURE_COSMOS_DATABASE_NAME=capersports
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...
AZURE_STORAGE_ACCOUNT_NAME=capersportsstorage
AZURE_STORAGE_ACCOUNT_KEY=your-key
```

**3. Run Migration**:
```bash
# Migrate existing data from MongoDB to Cosmos DB
npm run migrate:azure

# Start server with Azure services
npm run dev:azure
```

**4. Update Routes (Optional)**:
The server automatically detects Azure configuration and uses appropriate services. No code changes needed!

### Azure Services Architecture

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

### Environment Configuration

**Azure Services (.env)**:
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
```

**Fallback (MongoDB + Cloudinary)**:
```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
   ```

### Available Scripts

**Azure-specific scripts**:
```bash
npm run dev:azure              # Development with Azure services
npm run start:azure            # Production with Azure services
npm run migrate:azure          # Migrate from MongoDB to Azure
```

**Traditional scripts**:
```bash
npm run dev                    # Development with MongoDB/Cloudinary
npm run start                  # Production with MongoDB/Cloudinary
```

The server automatically detects which services are configured and uses them accordingly.

## 🚀 Quick Start - Azure Deployment (10 Steps)

### Prerequisites
- [ ] Azure account with active subscription
- [ ] MongoDB Atlas account (or use Azure Cosmos DB)
- [ ] GitHub account
- [ ] Cloudinary account (for image storage)
- [ ] Stripe account (for payments)

### 1. Prepare Your Database

**MongoDB Atlas (Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user
4. Whitelist all IPs (0.0.0.0/0) for Azure
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/capersports`

### 2. Push Code to GitHub

```bash
git clone https://github.com/yourusername/capersports-web.git
cd capersports-web
git add .
git commit -m "Initial commit for Azure deployment"
git push origin main
```

### 3. Create Azure Resource Group

1. Login to [Azure Portal](https://portal.azure.com)
2. Click "Resource groups" → "Create"
3. Name: `capersports-rg`
4. Region: Choose closest to you
5. Click "Review + create" → "Create"

### 4. Deploy Backend (App Service)

1. Click "Create a resource" → Search "Web App"
2. Configure:
   - **Resource group**: `capersports-rg`
   - **Name**: `capersports-api-YOUR_NAME` (must be unique)
   - **Runtime**: Node 18 LTS
   - **OS**: Linux
   - **Plan**: B1 Basic
3. Go to "Configuration" → "Application settings" and add:

```env
NODE_ENV=production
PORT=8080
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<generate-random-64-character-string>
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
STRIPE_SECRET_KEY=<your-stripe-secret>
FRONTEND_URL=https://capersports-web-YOUR_NAME.azurestaticapps.net
CORS_ORIGIN=https://capersports-web-YOUR_NAME.azurestaticapps.net
```

4. Configure Deployment Center → GitHub → Connect repository
5. Set Startup Command: `cd server && npm install && node server.js`

### 5. Deploy Frontend (Static Web App)

1. Click "Create a resource" → Search "Static Web App"
2. Configure:
   - **Resource group**: `capersports-rg`
   - **Name**: `capersports-web-YOUR_NAME`
   - **Source**: GitHub
   - **Build Presets**: React
   - **App location**: `/client`
   - **Output location**: `build`
3. Add environment variables in Configuration:

```env
REACT_APP_API_URL=https://capersports-api-YOUR_NAME.azurewebsites.net/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
REACT_APP_NAME=CaperSports
REACT_APP_ENV=production
GENERATE_SOURCEMAP=false
```

### 6. Verify Deployment

**Test Backend:**
```bash
curl https://capersports-api-YOUR_NAME.azurewebsites.net/api/health
```

**Test Frontend:**
Open: `https://capersports-web-YOUR_NAME.azurestaticapps.net`

## 🛠️ Local Development

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/capersports-web.git
cd capersports-web

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Environment Setup

**Backend (.env in server folder):**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/capersports
JWT_SECRET=your-super-secure-jwt-secret
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
STRIPE_SECRET_KEY=your-stripe-secret-key
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env in client folder):**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
REACT_APP_NAME=CaperSports
REACT_APP_ENV=development
```

### Running the Application

```bash
# Start backend (from server folder)
cd server
npm run dev

# Start frontend (from client folder)
cd client
npm start
```

## 🎨 Features

### Frontend Features
- **Modern UI/UX** - Tailwind CSS with Framer Motion animations
- **Responsive Design** - Mobile-first approach
- **Premium Navigation** - Animated navigation with smooth transitions
- **Product Catalog** - Advanced filtering and search
- **Shopping Cart** - Real-time cart management
- **User Authentication** - JWT-based auth with protected routes
- **Admin Dashboard** - Comprehensive admin panel
- **Payment Integration** - Stripe payment processing
- **Instagram Integration** - Dynamic Instagram feed
- **Image Management** - Cloudinary integration with fallbacks

### Backend Features
- **RESTful API** - Express.js with proper error handling
- **Authentication** - JWT tokens with refresh mechanism
- **Database** - MongoDB with Mongoose ODM
- **File Upload** - Cloudinary integration
- **Email Service** - Nodemailer for notifications
- **Security** - Helmet, CORS, rate limiting
- **Admin Features** - User management, product CRUD, order tracking

### Admin Dashboard
- **Collapsible Sidebar** - Space-efficient navigation
- **Dashboard Analytics** - Sales, orders, and user metrics
- **Product Management** - CRUD operations with image upload
- **Order Management** - Order tracking and status updates
- **User Management** - Customer data and admin controls
- **Responsive Design** - Works on all devices

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
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Cloudinary** - Image management
- **Stripe** - Payment processing
- **Nodemailer** - Email service

### DevOps & Deployment
- **Azure App Service** - Backend hosting
- **Azure Static Web Apps** - Frontend hosting
- **GitHub Actions** - CI/CD pipeline
- **MongoDB Atlas** - Cloud database

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt encryption
- **Rate Limiting** - API request throttling
- **CORS Protection** - Cross-origin request security
- **Input Validation** - Mongoose schema validation
- **Security Headers** - Helmet.js implementation
- **Environment Variables** - Secure configuration management

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id` - Update order status (admin)

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders

## 🚨 Troubleshooting

### Common Issues

**Backend Not Starting:**
- Check MongoDB connection string
- Verify all environment variables are set
- Check server logs in Azure App Service

**CORS Errors:**
- Ensure `FRONTEND_URL` matches your Static Web App URL
- Verify CORS configuration in server.js
- Check both HTTP and HTTPS protocols

**Build Failures:**
- Verify Node.js version (18.x)
- Check all dependencies in package.json
- Review GitHub Actions logs

**Database Connection:**
- Whitelist Azure IPs in MongoDB Atlas
- Test connection string format
- Check network access settings

### Debug Commands

```bash
# Check Azure App Service logs
az webapp log tail --name capersports-api --resource-group capersports-rg

# Test API health
curl https://your-backend.azurewebsites.net/api/health

# Local development debug
npm run dev # Backend with nodemon
npm start   # Frontend with hot reload
```

## 🎯 Instagram Integration

The website includes a dynamic Instagram feed that fetches the latest posts from `@caper_sports9`.

### Setup Instagram API (Optional)

1. Create Facebook Developer App
2. Add Instagram Basic Display product
3. Generate long-lived access token
4. Add to environment variables:
   ```env
   REACT_APP_INSTAGRAM_ACCESS_TOKEN=your_token_here
   ```

### Fallback System
When Instagram API is not configured, the system uses curated fallback posts that match your brand style.

## 📊 Performance Optimizations

### Frontend
- **Code Splitting** - Lazy loading of components
- **Image Optimization** - Cloudinary transformations
- **Caching** - Redux persist for state
- **Bundle Analysis** - Webpack bundle optimization

### Backend
- **Database Indexing** - MongoDB indexes for queries
- **Compression** - Gzip compression enabled
- **Caching** - Response caching for static data
- **Connection Pooling** - MongoDB connection optimization

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow
- **Automated Testing** - Run tests on push
- **Build Process** - Compile and optimize code
- **Deployment** - Deploy to Azure on successful build
- **Environment Management** - Separate staging and production

### Deployment Triggers
- **Backend** - Deploys on changes to `/server` folder
- **Frontend** - Deploys on changes to `/client` folder
- **Manual Deploy** - Can be triggered manually from GitHub

## 💰 Cost Estimation

### Development/Testing
- **Static Web App**: Free (100GB bandwidth/month)
- **App Service**: ~$13/month (B1 Basic)
- **MongoDB Atlas**: Free (512MB storage)
- **Total**: ~$13/month

### Production
- **Static Web App**: Free
- **App Service**: ~$55/month (S1 Standard)
- **Azure Cosmos DB**: ~$24/month (Serverless)
- **Total**: ~$79/month

## 📈 Monitoring & Analytics

### Application Insights
- **Performance Monitoring** - Response times and throughput
- **Error Tracking** - Exception logging and alerts
- **User Analytics** - Page views and user behavior
- **Custom Events** - Business metric tracking

### Alerts Configuration
- **CPU Usage** - Alert when >80% for 5 minutes
- **Memory Usage** - Alert when >85% for 5 minutes
- **Response Time** - Alert when >2 seconds
- **Error Rate** - Alert when >5% error rate

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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- **Detailed Deployment Guide** - Step-by-step Azure deployment
- **API Documentation** - Complete endpoint reference
- **Component Library** - Frontend component documentation

### Community Support
- **GitHub Issues** - Bug reports and feature requests
- **Stack Overflow** - Tag questions with `capersports`
- **Azure Support** - Azure-specific deployment issues

### Professional Support
For enterprise support and custom development:
- Email: support@capersports.com
- Website: https://capersports.com

---

## 🎉 Acknowledgments

Built with ❤️ using:
- **React** - Facebook's UI library
- **Node.js** - JavaScript runtime
- **MongoDB** - Modern database
- **Azure** - Microsoft's cloud platform
- **Stripe** - Payment processing
- **Cloudinary** - Image management

**Status**: 🚀 Production Ready | ⚡ High Performance | 🔒 Secure | 📱 Mobile First

---

**© 2024 Caper Sports. All rights reserved.**