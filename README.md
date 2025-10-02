<<<<<<< HEAD
=======


Cleaning up temp folders from previous zip deployments and extracting pushed zip file C:\local\Temp\zipdeploy\zvu4hjma.zip (10.97 MB) to C:\local\Temp\zipdeploy\extracted

P***ck***ge deployment using ZIP Deploy initi***ted.
Fetching ch***nges.
Cle***ning up temp folders from previous zip deployments ***nd extr***cting pushed zip file C:\loc***l\Temp\zipdeploy\qyxcvsd2.zip (9.48 MB) to C:\loc***l\Temp\zipdeploy\extr***cted
Error: F***iled to deploy web p***ck***ge to App Service.
Error: Deployment F***iled, P***ck***ge deployment using ZIP Deploy f***iled. Refer logs for more det***ils.

>>>>>>> parent of 56485b0 (clean: remove unnecessary deployment files and clean project structure)
# CaperSports - MERN Stack E-commerce Platform

A full-stack e-commerce platform for premium sports clothing built with React, Node.js, Express, and MongoDB. **Ready for Azure deployment!**

## 🏗️ Project Structure

```
capersports/
<<<<<<< HEAD
├── client/                           # React Frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.azure.template          # Frontend Azure env template
├── .github/workflows/               # GitHub Actions for CI/CD
│   └── azure-deploy.yml            # Azure deployment workflow
├── server.js                       # Express Backend Entry Point
├── package.json                    # Backend Dependencies
├── routes/                         # API Routes
├── models/                         # MongoDB Models
├── middleware/                     # Express Middleware
├── uploads/                        # File Uploads
├── web.config                      # IIS configuration for Azure
├── staticwebapp.config.json        # Azure Static Web Apps config
├── .env                           # Backend Environment Variables
├── .env.azure.template            # Backend Azure env template
└── README.md                      # This file
=======
├── client/                         # React Frontend
│   ├── src/                       # React source code
│   ├── public/                    # Static assets
│   ├── package.json              # Frontend dependencies
│   └── .env.azure.template       # Frontend environment template
├── .github/workflows/             # GitHub Actions for CI/CD
│   └── azure-deploy.yml          # Azure deployment workflow
├── routes/                        # Express API Routes
├── models/                        # MongoDB Models
├── middleware/                    # Express Middleware
├── uploads/                       # File upload directory
├── server.js                     # Express Backend Entry Point
├── package.json                  # Backend Dependencies
├── web.config                    # IIS configuration for Azure
├── staticwebapp.config.json      # Azure Static Web Apps config
├── .env                         # Backend Environment Variables
├── .env.azure.template          # Backend environment template
├── seedData.js                  # Database seeding script
└── README.md                    # This documentation
>>>>>>> parent of dc8a83f (clean: update to Node.js 22, remove unnecessary files, add simple deployment guide)
```

## ☁️ Azure Deployment Guide

### Prerequisites

- **Azure Account** with active subscription
- **GitHub Account** for source code and CI/CD
- **MongoDB Atlas** database
- **Node.js 18+** installed locally

### 🎯 Deployment Architecture

- **Frontend**: Azure Static Web Apps
- **Backend**: Azure App Service (Node.js)
- **Database**: MongoDB Atlas
- **CI/CD**: GitHub Actions

---

## 📋 Step-by-Step Azure Deployment

### 1. Prepare Your Environment

1. **Fork/Clone this repository** to your GitHub account

2. **Set up MongoDB Atlas**:
   - Create a MongoDB Atlas account
   - Create a new cluster
   - Get your connection string
   - Add your IP to the whitelist

3. **Get required API keys**:
   - Cloudinary account (for image uploads)
   - Stripe account (for payments)
   - Email service credentials

### 2. Deploy Backend to Azure App Service

#### Option A: Using Azure Portal (Recommended)

1. **Create App Service**:
   - Go to Azure Portal → Create Resource → Web App
   - Choose **Node.js 18 LTS** runtime
   - Select your resource group and region
   - Choose a unique name (e.g., `capersports-backend`)

2. **Configure Deployment**:
   - Go to **Deployment Center** → **GitHub**
   - Connect your repository
   - Select **GitHub Actions** as build provider
   - Choose your repository and `main` branch

3. **Set Environment Variables**:
   Go to **Configuration** → **Application Settings** and add:
   ```
   NODE_ENV=production
   PORT=80
   WEBSITE_PORT=80
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secure_jwt_secret
   JWT_EXPIRE=30d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_EMAIL=your_email@gmail.com
   SMTP_PASSWORD=your_email_app_password
   FRONTEND_URL=https://your-frontend-app.azurestaticapps.net
   WEBSITES_ENABLE_APP_SERVICE_STORAGE=false
   WEBSITE_NODE_DEFAULT_VERSION=18.17.0
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

#### Option B: Using Azure CLI

```bash
# Create App Service
az webapp create \
  --resource-group your-resource-group \
  --plan your-app-service-plan \
  --name capersports-backend \
  --runtime "NODE|18-lts"

# Configure deployment from GitHub
az webapp deployment source config \
  --name capersports-backend \
  --resource-group your-resource-group \
  --repo-url https://github.com/yourusername/capersports \
  --branch main \
  --manual-integration
```

### 3. Deploy Frontend to Azure Static Web Apps

#### Option A: Using Azure Portal (Recommended)

1. **Create Static Web App**:
   - Go to Azure Portal → Create Resource → Static Web App
   - Connect to your **GitHub repository**
   - **Build Details**:
     - App location: `/client`
     - API location: `` (leave empty)
     - Output location: `build`

2. **Configure Environment Variables**:
   Go to **Configuration** and add:
   ```
   REACT_APP_API_URL=https://your-backend-app.azurewebsites.net/api
   REACT_APP_NAME=CaperSports
   REACT_APP_VERSION=1.0.0
   REACT_APP_ENV=production
   REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

#### Option B: Using Azure CLI

```bash
az staticwebapp create \
  --name capersports-frontend \
  --resource-group your-resource-group \
  --source https://github.com/yourusername/capersports \
  --location "Central US" \
  --branch main \
  --app-location "/client" \
  --output-location "build"
```

### 4. Set up GitHub Actions (Automated)

The repository includes a pre-configured GitHub Actions workflow. You need to add these **GitHub Secrets**:

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**:

**Required Secrets:**
- `AZURE_BACKEND_APP_NAME` - Your App Service name
- `AZURE_BACKEND_PUBLISH_PROFILE` - Download from Azure Portal → App Service → Get publish profile
- `AZURE_STATIC_WEB_APPS_API_TOKEN` - Found in Static Web App → Manage deployment token
- `REACT_APP_API_URL` - Your backend URL (https://your-backend.azurewebsites.net/api)
- `REACT_APP_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key

### 5. Update URLs

After deployment, update the URLs in your Azure configuration:

1. **Backend Environment Variables**:
   - Update `FRONTEND_URL` to your Static Web App URL

2. **Frontend Environment Variables**:
   - Update `REACT_APP_API_URL` to your App Service URL

---

## 🚀 Local Development

### Quick Start

1. **Clone and install**:
   ```bash
   git clone https://github.com/yourusername/capersports.git
   cd capersports
   npm run install-all
   ```

2. **Environment Setup**:
   ```bash
   # Copy and configure backend environment
   cp .env.azure.template .env
   # Edit .env with your local/development values
   
   # Copy and configure frontend environment
   cp client/.env.azure.template client/.env
   # Edit client/.env with your values
   ```

3. **Run the application**:
   ```bash
   npm run dev:full
   ```

### Available Scripts

#### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data
- `npm run deploy:azure` - Build and start for Azure

#### Frontend Scripts
- `npm run client` - Start React development server
- `npm run client:build` - Build React app for production
- `npm run client:install` - Install client dependencies

#### Full Stack Scripts
- `npm run install-all` - Install all dependencies
- `npm run dev:full` - Run both backend and frontend
- `npm run build:production` - Build frontend and copy to backend

---

## 🔧 Features

- **User Authentication** - JWT-based authentication
- **Product Management** - CRUD operations for products
- **Shopping Cart** - Add, remove, update cart items
- **Order Management** - Place and track orders
- **Payment Integration** - Stripe payment processing
- **Image Upload** - Cloudinary integration
- **Email Notifications** - Order confirmations and updates
- **Admin Dashboard** - Manage products, orders, and users
- **Responsive Design** - Mobile-friendly UI

## 📦 Tech Stack

### Frontend
- React 18
- Redux Toolkit
- React Router
- Tailwind CSS
- Framer Motion
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary
- Stripe
- Nodemailer

### Azure Services
- Azure App Service (Backend)
- Azure Static Web Apps (Frontend)
- GitHub Actions (CI/CD)

---

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection (Azure domains included)
- Security headers with Helmet
- Input validation and sanitization

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get single order

---

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure `FRONTEND_URL` in backend matches your Static Web App URL
   - Check CORS configuration in `server.js`

2. **Build Failures**:
   - Verify Node.js version is 18.x in Azure
   - Check all dependencies are listed in `package.json`

3. **Database Connection**:
   - Verify MongoDB Atlas connection string
   - Check network access settings in MongoDB Atlas
   - Ensure IP whitelist includes Azure IPs

4. **Environment Variables**:
   - Double-check all required variables are set in Azure
   - Ensure no typos in variable names

### Debug Commands

```bash
# Check Azure App Service logs
az webapp log tail --name your-app-name --resource-group your-rg

# Test API health
curl https://your-backend.azurewebsites.net/api/health

# Check Static Web App
curl https://your-frontend.azurestaticapps.net
```

---

## 📝 Post-Deployment Checklist

- [ ] Backend API health check responds
- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Product listings load
- [ ] Shopping cart functions
- [ ] Order placement works
- [ ] Payment processing works (Stripe)
- [ ] Email notifications send
- [ ] Admin dashboard accessible
- [ ] Image uploads work (Cloudinary)
- [ ] All environment variables configured
- [ ] CORS properly configured
- [ ] SSL certificates active

---

## 🎉 Your App is Live!

After successful deployment:

- **Frontend**: `https://your-frontend-app.azurestaticapps.net`
- **Backend API**: `https://your-backend-app.azurewebsites.net/api`
- **Health Check**: `https://your-backend-app.azurewebsites.net/api/health`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**🚀 Built with ❤️ using React, Node.js, Express, MongoDB and deployed on Microsoft Azure**
