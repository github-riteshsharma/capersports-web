# CaperSports - Azure Quick Start Guide

## 🚀 Deploy to Azure in 10 Steps

This is a simplified guide to get your CaperSports application running on Azure quickly.

---

## Prerequisites

- [ ] Azure account with active subscription
- [ ] MongoDB Atlas account (or use Azure Cosmos DB)
- [ ] GitHub account
- [ ] Cloudinary account (for image storage)
- [ ] Stripe account (for payments)

---

## Step-by-Step Deployment

### 1. Prepare Your Database

**Option A: MongoDB Atlas (Recommended for beginners)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user
4. Whitelist all IPs (0.0.0.0/0) for Azure
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/capersports`

**Option B: Azure Cosmos DB**
1. In Azure Portal, create "Azure Cosmos DB for MongoDB"
2. Choose Serverless capacity mode
3. Get connection string from "Connection String" section

### 2. Push Code to GitHub

```bash
cd /Users/r0s0fw2/Desktop/capersports
git init
git add .
git commit -m "Initial commit for Azure deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/capersports.git
git push -u origin main
```

### 3. Create Resource Group

1. Login to [Azure Portal](https://portal.azure.com)
2. Click "Resource groups" → "Create"
3. Name: `capersports-rg`
4. Region: Choose closest to you
5. Click "Review + create" → "Create"

### 4. Deploy Backend (5 minutes)

1. Click "Create a resource" → Search "Web App"
2. Fill in:
   - **Resource group**: `capersports-rg`
   - **Name**: `capersports-api-YOUR_NAME` (must be unique)
   - **Publish**: Code
   - **Runtime**: Node 18 LTS
   - **OS**: Linux
   - **Region**: Same as resource group
   - **Plan**: B1 Basic
3. Click "Review + create" → "Create"
4. Wait for deployment (2-3 minutes)

### 5. Configure Backend Environment

1. Go to your App Service → "Configuration" → "Application settings"
2. Click "New application setting" and add these (one by one):

```
NODE_ENV = production
PORT = 8080
MONGODB_URI = <your-mongodb-connection-string>
JWT_SECRET = <generate-random-64-character-string>
JWT_EXPIRE = 30d
CLOUDINARY_CLOUD_NAME = <your-cloudinary-name>
CLOUDINARY_API_KEY = <your-cloudinary-key>
CLOUDINARY_API_SECRET = <your-cloudinary-secret>
STRIPE_SECRET_KEY = <your-stripe-secret>
FRONTEND_URL = https://capersports-web-YOUR_NAME.azurestaticapps.net
CORS_ORIGIN = https://capersports-web-YOUR_NAME.azurestaticapps.net
RATE_LIMIT_MAX_REQUESTS = 10000
```

3. Click "Save" → "Continue"

### 6. Deploy Backend Code

1. In App Service, go to "Deployment Center"
2. Choose "GitHub" → Authorize and select your repository
3. Configure:
   - **Organization**: Your GitHub username
   - **Repository**: capersports
   - **Branch**: main
4. Click "Save"
5. GitHub Actions will automatically deploy your code

### 7. Set Backend Startup Command

1. Go to "Configuration" → "General settings"
2. **Startup Command**: `cd server && npm install && node server.js`
3. Click "Save"
4. Wait for app to restart

### 8. Test Backend

1. Go to "Overview" and copy your URL
2. Open in browser: `https://capersports-api-YOUR_NAME.azurewebsites.net/api/health`
3. You should see: `{"status":"success","message":"CaperSports API is running!"}`

### 9. Deploy Frontend (3 minutes)

1. Click "Create a resource" → Search "Static Web App"
2. Fill in:
   - **Resource group**: `capersports-rg`
   - **Name**: `capersports-web-YOUR_NAME`
   - **Plan**: Free
   - **Region**: Choose closest
   - **Source**: GitHub
   - **Organization**: Your GitHub username
   - **Repository**: capersports
   - **Branch**: main
   - **Build Presets**: React
   - **App location**: `/client`
   - **Output location**: `build`
3. Click "Review + create" → "Create"
4. Wait for deployment (5-10 minutes)

### 10. Configure Frontend Environment

1. Go to your Static Web App → "Configuration"
2. Add these environment variables:

```
REACT_APP_API_URL = https://capersports-api-YOUR_NAME.azurewebsites.net/api
REACT_APP_STRIPE_PUBLISHABLE_KEY = <your-stripe-publishable-key>
REACT_APP_NAME = CaperSports
REACT_APP_ENV = production
GENERATE_SOURCEMAP = false
```

3. Click "Save"
4. Go to "GitHub Actions" tab and wait for redeployment

---

## ✅ Verify Deployment

### Test Backend
```bash
curl https://capersports-api-YOUR_NAME.azurewebsites.net/api/health
```

### Test Frontend
1. Open: `https://capersports-web-YOUR_NAME.azurestaticapps.net`
2. Check:
   - [ ] Homepage loads
   - [ ] Products page works
   - [ ] Can register/login
   - [ ] Cart functionality works
   - [ ] Admin dashboard accessible (if admin)

---

## 🔧 Common Issues & Fixes

### Backend shows "Application Error"
- Check "Log stream" in App Service
- Verify all environment variables are set
- Check MongoDB connection string is correct
- Ensure startup command is correct

### Frontend shows blank page
- Check browser console for errors
- Verify `REACT_APP_API_URL` is correct
- Check if backend is running
- Look at GitHub Actions logs for build errors

### CORS errors
- Verify `FRONTEND_URL` and `CORS_ORIGIN` in backend match your Static Web App URL
- Make sure to include `https://` in the URLs
- Restart backend App Service after changing

### Database connection failed
- Check MongoDB Atlas network access (whitelist 0.0.0.0/0)
- Verify connection string format
- Test connection string locally first

---

## 📊 Monitor Your App

### View Logs
1. Go to App Service → "Log stream"
2. See real-time logs of your application

### Enable Application Insights
1. Go to App Service → "Application Insights"
2. Click "Turn on Application Insights"
3. Create new resource
4. View metrics, errors, and performance

---

## 💰 Cost Estimate

**Free Tier (Suitable for testing)**
- Static Web App: Free (100GB bandwidth/month)
- App Service: ~$13/month (B1 Basic)
- MongoDB Atlas: Free (512MB storage)
- **Total: ~$13/month**

**Production Tier**
- Static Web App: Free
- App Service: ~$55/month (S1 Standard)
- Azure Cosmos DB: ~$24/month (Serverless)
- **Total: ~$79/month**

---

## 🎉 Next Steps

1. **Custom Domain**: Add your own domain name
2. **SSL Certificate**: Automatically provided by Azure
3. **CI/CD**: Already configured via GitHub Actions
4. **Monitoring**: Enable Application Insights
5. **Scaling**: Configure auto-scaling rules
6. **Backup**: Set up automated backups

---

## 📚 Helpful Links

- [Azure Portal](https://portal.azure.com)
- [Azure Documentation](https://docs.microsoft.com/azure)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Cloudinary Dashboard](https://cloudinary.com/console)
- [Stripe Dashboard](https://dashboard.stripe.com)

---

## 🆘 Need Help?

- Check the detailed guide: `AZURE_DEPLOYMENT_GUIDE.md`
- Azure Support: [Azure Support Portal](https://azure.microsoft.com/support)
- Community: [Stack Overflow - Azure Tag](https://stackoverflow.com/questions/tagged/azure)

---

**Congratulations! Your CaperSports app is now live on Azure!** 🎊
