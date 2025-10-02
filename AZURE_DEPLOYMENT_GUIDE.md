# CaperSports - Azure Deployment Guide

This guide provides step-by-step instructions for deploying the CaperSports MERN application to Azure Cloud using Azure Portal.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Azure Services Setup](#azure-services-setup)
4. [Deployment Steps](#deployment-steps)
5. [Environment Configuration](#environment-configuration)
6. [Post-Deployment](#post-deployment)

---

## Prerequisites

### Required Accounts & Tools
- Azure Account (with active subscription)
- MongoDB Atlas account (or Azure Cosmos DB)
- GitHub account (for code repository)
- Node.js 16+ installed locally
- Git installed locally

### Azure Services Needed
- **Azure App Service** (for backend)
- **Azure Static Web Apps** or **Azure App Service** (for frontend)
- **Azure Cosmos DB for MongoDB** or **MongoDB Atlas** (database)
- **Azure Key Vault** (optional, for secrets management)

---

## Project Structure

```
capersports/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   └── package.json
├── server/                 # Node.js/Express backend
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── scripts/
│   ├── server.js
│   └── package.json
├── .gitignore
├── README.md
└── AZURE_DEPLOYMENT_GUIDE.md
```

---

## Azure Services Setup

### Step 1: Create Resource Group

1. Log in to [Azure Portal](https://portal.azure.com)
2. Click **"Create a resource"** → **"Resource group"**
3. Configure:
   - **Subscription**: Select your subscription
   - **Resource group name**: `capersports-rg`
   - **Region**: Choose closest region (e.g., East US, West Europe)
4. Click **"Review + create"** → **"Create"**

### Step 2: Setup MongoDB Database

#### Option A: Azure Cosmos DB for MongoDB (Recommended)

1. In Azure Portal, click **"Create a resource"** → Search **"Azure Cosmos DB"**
2. Select **"Azure Cosmos DB for MongoDB"**
3. Configure:
   - **Resource group**: `capersports-rg`
   - **Account name**: `capersports-db`
   - **API**: MongoDB
   - **Location**: Same as resource group
   - **Capacity mode**: Serverless (for cost-effective start)
4. Click **"Review + create"** → **"Create"**
5. After deployment, go to **"Connection String"** and copy the connection string

#### Option B: MongoDB Atlas (Alternative)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Configure network access (allow Azure IPs)
4. Get connection string from **"Connect"** → **"Connect your application"**

### Step 3: Create Backend App Service

1. In Azure Portal, click **"Create a resource"** → **"Web App"**
2. Configure **Basics**:
   - **Resource group**: `capersports-rg`
   - **Name**: `capersports-api` (must be globally unique)
   - **Publish**: Code
   - **Runtime stack**: Node 18 LTS
   - **Operating System**: Linux
   - **Region**: Same as resource group
   - **Pricing plan**: B1 (Basic) or higher
3. Click **"Review + create"** → **"Create"**

### Step 4: Create Frontend App Service

#### Option A: Azure Static Web Apps (Recommended for React)

1. Click **"Create a resource"** → **"Static Web App"**
2. Configure:
   - **Resource group**: `capersports-rg`
   - **Name**: `capersports-web`
   - **Plan type**: Free
   - **Region**: Choose closest
   - **Deployment source**: GitHub (connect your repository)
   - **Build Details**:
     - **Build Presets**: React
     - **App location**: `/client`
     - **Output location**: `build`
3. Click **"Review + create"** → **"Create"**

#### Option B: Azure App Service (Alternative)

1. Create another Web App similar to backend
2. Configure:
   - **Name**: `capersports-web`
   - **Runtime stack**: Node 18 LTS
   - **Publish**: Code

---

## Deployment Steps

### Part 1: Deploy Backend to Azure App Service

#### Step 1: Configure Deployment Center

1. Go to your backend App Service (`capersports-api`)
2. Navigate to **"Deployment Center"** in left menu
3. Choose deployment source:
   - **GitHub**: Connect your repository
   - **Branch**: `main` or `master`
   - **Build provider**: GitHub Actions (recommended)
4. Configure build:
   - **Root folder**: `/server`
   - **Node version**: 18.x
5. Click **"Save"** - This creates a GitHub Actions workflow

#### Step 2: Configure Environment Variables

1. In App Service, go to **"Configuration"** → **"Application settings"**
2. Add the following environment variables:

```
NODE_ENV=production
PORT=8080
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<generate-strong-secret>
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
STRIPE_SECRET_KEY=<your-stripe-secret>
STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable>
FRONTEND_URL=https://capersports-web.azurestaticapps.net
CORS_ORIGIN=https://capersports-web.azurestaticapps.net
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10000
HELMET_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=<your-email>
SMTP_PASSWORD=<your-email-password>
```

3. Click **"Save"** → **"Continue"**
4. App Service will restart automatically

#### Step 3: Configure Startup Command

1. Go to **"Configuration"** → **"General settings"**
2. Set **Startup Command**: `node server.js`
3. Click **"Save"**

### Part 2: Deploy Frontend

#### For Static Web Apps:

1. The deployment happens automatically via GitHub Actions
2. Check **"GitHub Actions"** tab in your repository
3. Wait for workflow to complete
4. Your app will be available at: `https://capersports-web.azurestaticapps.net`

#### For App Service:

1. Go to frontend App Service (`capersports-web`)
2. Configure **Deployment Center** similar to backend
3. Set **Root folder**: `/client`
4. Configure environment variables in **Configuration**:

```
REACT_APP_API_URL=https://capersports-api.azurewebsites.net/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable>
REACT_APP_NAME=CaperSports
REACT_APP_VERSION=1.0.0
REACT_APP_ENV=production
GENERATE_SOURCEMAP=false
```

5. Set **Startup Command**: `pm2 serve /home/site/wwwroot/build --no-daemon --spa`

---

## Environment Configuration

### Backend Environment Variables (.env)

Create these in Azure App Service Configuration:

```env
# Server
NODE_ENV=production
PORT=8080
WEBSITE_PORT=8080

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/capersports?retryWrites=true&w=majority

# JWT
JWT_SECRET=<generate-a-very-strong-random-secret-key>
JWT_EXPIRE=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# Stripe
STRIPE_SECRET_KEY=<your-stripe-secret-key>
STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=<your-email>
SMTP_PASSWORD=<your-app-password>

# Frontend URL
FRONTEND_URL=https://capersports-web.azurestaticapps.net
CORS_ORIGIN=https://capersports-web.azurestaticapps.net

# Security
HELMET_ENABLED=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10000
```

### Frontend Environment Variables

Add these to Static Web App configuration or App Service:

```env
REACT_APP_API_URL=https://capersports-api.azurewebsites.net/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
REACT_APP_NAME=CaperSports
REACT_APP_VERSION=1.0.0
REACT_APP_ENV=production
GENERATE_SOURCEMAP=false
DISABLE_ESLINT_PLUGIN=true
```

---

## Post-Deployment

### 1. Verify Backend Deployment

Test your API endpoints:
```bash
curl https://capersports-api.azurewebsites.net/api/health
```

Expected response:
```json
{
  "status": "success",
  "message": "CaperSports API is running!",
  "timestamp": "2025-10-02T10:00:00.000Z"
}
```

### 2. Verify Frontend Deployment

1. Open browser and navigate to your Static Web App URL
2. Test key features:
   - Homepage loads correctly
   - Products page displays items
   - Login/Register works
   - Cart functionality
   - Admin dashboard (if admin user)

### 3. Configure Custom Domain (Optional)

#### For Static Web Apps:
1. Go to **"Custom domains"** in Static Web App
2. Click **"Add"** → **"Custom domain on other DNS"**
3. Follow instructions to add DNS records
4. Verify and activate

#### For App Service:
1. Go to **"Custom domains"** in App Service
2. Click **"Add custom domain"**
3. Add your domain and verify ownership
4. Configure SSL certificate (free with App Service)

### 4. Setup Monitoring

1. Enable **Application Insights**:
   - Go to App Service → **"Application Insights"**
   - Click **"Turn on Application Insights"**
   - Create new resource or use existing

2. Configure **Alerts**:
   - Go to **"Alerts"** in left menu
   - Create alert rules for:
     - High CPU usage
     - Memory usage
     - Response time
     - Error rate

### 5. Configure Scaling (Optional)

1. Go to **"Scale up (App Service plan)"**
2. Choose appropriate tier based on traffic
3. Go to **"Scale out (App Service plan)"**
4. Configure auto-scaling rules

### 6. Setup Backup (Recommended)

1. Go to **"Backups"** in App Service
2. Configure automated backups:
   - Backup frequency
   - Retention period
   - Storage account

---

## Troubleshooting

### Common Issues

#### 1. Backend Not Starting
- Check **"Log stream"** in App Service
- Verify environment variables are set correctly
- Ensure MongoDB connection string is valid
- Check startup command is correct

#### 2. CORS Errors
- Verify `FRONTEND_URL` and `CORS_ORIGIN` match your frontend URL
- Check CORS configuration in `server.js`
- Ensure both HTTP and HTTPS are handled

#### 3. Database Connection Failed
- Verify MongoDB connection string
- Check if Azure IP is whitelisted in MongoDB Atlas
- Test connection from Azure Cloud Shell

#### 4. Frontend Build Fails
- Check Node version compatibility
- Verify all dependencies are in `package.json`
- Check build logs in GitHub Actions
- Ensure environment variables are set

#### 5. 502 Bad Gateway
- Check if backend is running (Log stream)
- Verify PORT environment variable
- Check if application is listening on correct port

### Useful Azure CLI Commands

```bash
# Login to Azure
az login

# List resource groups
az group list

# View App Service logs
az webapp log tail --name capersports-api --resource-group capersports-rg

# Restart App Service
az webapp restart --name capersports-api --resource-group capersports-rg

# View environment variables
az webapp config appsettings list --name capersports-api --resource-group capersports-rg
```

---

## Cost Optimization Tips

1. **Use Free Tier** for Static Web Apps (includes 100GB bandwidth/month)
2. **Use Serverless** Cosmos DB for variable workloads
3. **Enable Auto-scaling** only when needed
4. **Use Azure CDN** for static assets
5. **Monitor costs** regularly in Azure Cost Management
6. **Use Reserved Instances** for predictable workloads (save up to 72%)

---

## Security Best Practices

1. **Never commit** `.env` files to Git
2. **Use Azure Key Vault** for sensitive secrets
3. **Enable HTTPS** only (disable HTTP)
4. **Configure** Web Application Firewall (WAF)
5. **Enable** Azure DDoS Protection
6. **Use** Managed Identities for Azure resources
7. **Implement** rate limiting and request throttling
8. **Regular** security updates for dependencies
9. **Enable** Azure Security Center recommendations
10. **Configure** proper CORS policies

---

## Continuous Deployment

### GitHub Actions Workflow

The deployment is automated via GitHub Actions. The workflow file is created automatically when you configure Deployment Center.

**Backend workflow** (`.github/workflows/azure-backend.yml`):
- Triggers on push to main branch
- Builds Node.js application
- Deploys to Azure App Service

**Frontend workflow** (`.github/workflows/azure-static-web-apps.yml`):
- Triggers on push to main branch
- Builds React application
- Deploys to Azure Static Web Apps

---

## Support & Resources

- [Azure App Service Documentation](https://docs.microsoft.com/azure/app-service/)
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps/)
- [Azure Cosmos DB Documentation](https://docs.microsoft.com/azure/cosmos-db/)
- [Azure DevOps Documentation](https://docs.microsoft.com/azure/devops/)

---

## Deployment Checklist

- [ ] Azure account created and subscription active
- [ ] Resource group created
- [ ] MongoDB database setup (Cosmos DB or Atlas)
- [ ] Backend App Service created and configured
- [ ] Frontend Static Web App or App Service created
- [ ] Environment variables configured for backend
- [ ] Environment variables configured for frontend
- [ ] GitHub repository connected
- [ ] Deployment workflows configured
- [ ] Backend API tested and working
- [ ] Frontend application tested and working
- [ ] Custom domain configured (optional)
- [ ] SSL certificate configured
- [ ] Application Insights enabled
- [ ] Alerts configured
- [ ] Backup configured
- [ ] Security best practices implemented

---

**Congratulations!** Your CaperSports MERN application is now deployed to Azure Cloud! 🎉
