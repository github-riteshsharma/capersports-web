
# CaperSports - MERN Stack E-commerce Platform

A full-stack e-commerce platform for premium sports clothing built with **React**, **Node.js 20/22 LTS**, **Express**, and **MongoDB**.

## 🏗️ Clean Project Structure

```
capersports/
├── client/                    # React Frontend
│   ├── src/                  # React source code
│   ├── public/               # Static assets
│   └── package.json         # Frontend dependencies
├── routes/                   # Express API Routes
├── models/                   # MongoDB Models
├── middleware/               # Express Middleware
├── uploads/                  # File upload directory
├── server.js                # Express Backend
├── package.json             # Backend Dependencies
├── seedData.js              # Database seeding script
├── .env                     # Environment Variables (gitignored)
├── .gitignore               # Git ignore file
└── README.md                # This documentation
```

## 🚀 **Tech Stack**

- **Backend**: Node.js 20/22 LTS + Express.js
- **Frontend**: React 18 + Redux Toolkit
- **Database**: MongoDB with Mongoose
- **Styling**: Tailwind CSS
- **Authentication**: JWT
- **File Upload**: Cloudinary
- **Payments**: Stripe
- **Email**: Nodemailer
- **Cloud**: Microsoft Azure

## ☁️ Azure Deployment Guide

### Prerequisites

- **Azure Account** with active subscription
- **GitHub Account** for source code and CI/CD
- **MongoDB Atlas** database
- **Node.js 20 or 22 LTS** installed locally

### 🎯 Deployment Architecture

- **Frontend**: Azure Static Web Apps
- **Backend**: Azure App Service (Node.js 20/22 LTS)
- **Database**: MongoDB Atlas
- **CI/CD**: GitHub Actions

---

## 🚀 **Azure Deployment Steps**

### **Step 1: Prepare Your Project**

1. **Clean Install Dependencies:**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client && npm install && cd ..
   ```

2. **Create Environment Files:**
   ```bash
   # Copy environment templates
   cp .env.azure.template .env
   cp client/.env.azure.template client/.env
   
   # Edit with your actual values
   ```

3. **Test Locally:**
   ```bash
   # Seed database
   npm run seed
   
   # Start backend
   npm start
   
   # Start frontend (in new terminal)
   cd client && npm start
   ```

### **Step 2: Deploy Backend to Azure App Service**

1. **Create Azure App Service:**
   - Go to **Azure Portal** → **Create Resource** → **Web App**
   - **Runtime Stack**: **Node.js 20 LTS** or **Node.js 22 LTS**
   - **Operating System**: **Linux**
   - **Name**: `capersports-backend` (must be unique)

2. **Configure Deployment:**
   - **Deployment Center** → **GitHub**
   - **Build Provider**: **GitHub Actions**
   - **Repository**: Your GitHub repo
   - **Branch**: `main`

3. **Set Environment Variables:**
   Go to **Configuration** → **Application Settings**:
   ```
   NODE_ENV=production
   PORT=8080
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
   WEBSITE_NODE_DEFAULT_VERSION=20-lts
   ```

### **Step 3: Deploy Frontend to Azure Static Web Apps**

1. **Create Static Web App:**
   - Go to **Azure Portal** → **Create Resource** → **Static Web App**
   - **Source**: **GitHub**
   - **Repository**: Your GitHub repo
   - **Branch**: `main`
   - **Build Presets**: **React**
   - **App location**: `/client`
   - **Output location**: `build`

2. **Configure Environment Variables:**
   Go to **Configuration** → **Environment variables**:
   ```
   REACT_APP_API_URL=https://your-backend-app.azurewebsites.net/api
   REACT_APP_NAME=CaperSports
   REACT_APP_VERSION=1.0.0
   REACT_APP_ENV=production
   REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

### **Step 4: GitHub Actions Setup (Automated)**

The repository includes pre-configured GitHub Actions workflows. Add these **GitHub Secrets**:

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**:

**Required Secrets:**
- `AZURE_BACKEND_PUBLISH_PROFILE` - Download from Azure Portal → App Service → Get publish profile
- `AZURE_STATIC_WEB_APPS_API_TOKEN` - Found in Static Web App → Manage deployment token
- `REACT_APP_API_URL` - Your backend URL (https://your-backend.azurewebsites.net/api)
- `REACT_APP_STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key

### **Step 5: Deploy and Test**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit for Azure deployment"
   git push origin main
   ```

2. **Monitor Deployment:**
   - Check **GitHub Actions** tab for build status
   - Check **Azure Portal** for deployment logs

3. **Test Your Application:**
   - **Backend**: `https://your-backend.azurewebsites.net/api/health`
   - **Frontend**: `https://your-frontend.azurestaticapps.net`

---

## 🛠️ Local Development

### Quick Start

1. **Clone and install:**
   ```bash
   git clone https://github.com/yourusername/capersports.git
   cd capersports
   npm run install-all
   ```

2. **Environment Setup:**
   ```bash
   # Copy and configure backend environment
   cp .env.azure.template .env
   # Edit .env with your local/development values
   
   # Copy and configure frontend environment
   cp client/.env.azure.template client/.env
   # Edit client/.env with your values
   ```

3. **Run the application:**
   ```bash
   npm run dev:full
   ```

### Available Scripts

#### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

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

---

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Update `FRONTEND_URL` in backend environment variables
   - Check CORS configuration in `server.js`

2. **Build Failures**:
   - Verify Node.js version is 20 or 22 LTS in Azure
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

**🚀 Built with ❤️ using React, Node.js 20/22 LTS, Express, MongoDB and deployed on Microsoft Azure**
