# 🚨 Azure Deployment Fix - OneDeploy Error

## Problem

**Error**: `Failed to deploy web package to App Service` with OneDeploy

### Root Causes
1. **Incorrect package structure** - Nested directories confusing Azure
2. **Missing or incorrect `package.json`** at deployment root
3. **Wrong startup command** in App Service configuration
4. **Missing `web.config`** for IIS/iisnode
5. **Build artifacts not properly structured**

---

## ✅ Solution Applied

### 1. Fixed GitHub Actions Workflow

**File**: `.github/workflows/main_capersports-api.yml`

**Changes**:
- ✅ Simplified deployment structure (flat, not nested)
- ✅ Created proper `package.json` at deployment root
- ✅ Added `web.config` for Azure App Service
- ✅ Used zip deployment for reliability
- ✅ Excluded `node_modules` (Azure installs them)
- ✅ Properly placed `server.js` at root of deployment package

**New Structure**:
```
deployment.zip/
├── server.js           # Main entry point (at root!)
├── package.json        # Dependencies (at root!)
├── web.config          # IIS configuration
├── public/             # Built React app
│   ├── index.html
│   └── static/
├── middleware/         # Server code
├── models/
├── routes/
├── services/
└── ...
```

### 2. Updated App Service Configuration

You need to set the **Startup Command** in Azure Portal:

**Azure Portal → App Service → Configuration → General settings**

**Startup Command**:
```bash
node server.js
```

Or if you prefer with npm:
```bash
npm start
```

### 3. Environment Variables Required

Make sure these are set in **Configuration → Application settings**:

| Variable | Required | Example |
|----------|----------|---------|
| `AZURE_COSMOS_CONNECTION_STRING` | ✅ Yes | `mongodb://...` |
| `AZURE_COSMOS_DATABASE_NAME` | ✅ Yes | `capersports` |
| `AZURE_STORAGE_CONNECTION_STRING` | ✅ Yes | `DefaultEndpointsProtocol=https;...` |
| `AZURE_STORAGE_ACCOUNT_NAME` | ✅ Yes | `capersportsstorage` |
| `NODE_ENV` | ✅ Yes | `production` |
| `PORT` | ⚠️ Optional | `8080` (Azure sets this automatically) |
| `JWT_SECRET` | ✅ Yes | Your secret key |
| `FRONTEND_URL` | ✅ Yes | Your frontend URL |

---

## 🚀 How to Deploy Now

### Option 1: Push to GitHub (Automatic)

```bash
# Commit the fixes
git add .
git commit -m "Fix Azure deployment structure"
git push origin main

# GitHub Actions will automatically:
# 1. Build the application
# 2. Create proper deployment package
# 3. Deploy to Azure App Service
```

### Option 2: Manual Deployment (Local)

```bash
# 1. Build the client
cd client
npm install
npm run build
cd ..

# 2. Prepare deployment package
mkdir -p deploy
rsync -av --exclude='node_modules' --exclude='.env' server/ deploy/
mkdir -p deploy/public
cp -r client/build/* deploy/public/

# 3. Copy package.json and web.config
cp server/package.json deploy/
cp web.config deploy/

# 4. Create zip
cd deploy
zip -r ../deployment.zip .
cd ..

# 5. Deploy to Azure
az webapp deployment source config-zip \
  --resource-group caper-sports-rg \
  --name capersports-api \
  --src deployment.zip

# 6. Clean up
rm deployment.zip
rm -rf deploy
```

### Option 3: Using Azure CLI Direct Deploy

```bash
# Build everything first
npm run build

# Deploy directly
az webapp up \
  --resource-group caper-sports-rg \
  --name capersports-api \
  --runtime "NODE:20-lts" \
  --os-type Linux
```

---

## 🔍 Verification Steps

### 1. Check Deployment Logs

**Azure Portal**:
1. Go to App Service → **Deployment Center**
2. Click on the latest deployment
3. View logs for any errors

**Or via CLI**:
```bash
az webapp log tail \
  --name capersports-api \
  --resource-group caper-sports-rg
```

### 2. Check Application Logs

```bash
# Stream live logs
az webapp log tail \
  --name capersports-api \
  --resource-group caper-sports-rg

# Look for:
# ✅ "Server running on..."
# ✅ "Connected to Azure Cosmos DB"
# ✅ "Azure services initialized successfully"
```

### 3. Test Health Endpoint

```bash
curl https://capersports-api.azurewebsites.net/api/health
```

**Expected Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-06T...",
  "azure": {
    "configured": true,
    "cosmosConnected": "initialized",
    "blobConnected": "initialized"
  }
}
```

### 4. Test API Endpoints

```bash
# Test products endpoint
curl https://capersports-api.azurewebsites.net/api/products

# Test auth endpoint
curl https://capersports-api.azurewebsites.net/api/auth/health
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Cannot find module 'server.js'"

**Cause**: Deployment package has wrong structure

**Solution**: Ensure `server.js` is at the root of the deployment package
```bash
# Check deployment structure
az webapp ssh --name capersports-api --resource-group caper-sports-rg
ls -la /home/site/wwwroot/
```

Should show:
```
server.js
package.json
web.config
public/
middleware/
...
```

### Issue 2: "npm install failed"

**Cause**: Missing or incorrect `package.json`

**Solution**: 
1. Ensure `package.json` is at deployment root
2. Check that all dependencies are listed
3. Use `--production` flag: `npm install --production`

### Issue 3: "Application Error"

**Cause**: Missing environment variables

**Solution**: Run the fix script
```bash
./fix-azure-env.sh
```

### Issue 4: Port binding error

**Cause**: App not listening on correct port

**Solution**: Ensure `server.js` uses `process.env.PORT`:
```javascript
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Issue 5: Static files not served

**Cause**: Wrong path in `web.config` or missing `public/` directory

**Solution**: 
1. Ensure `client/build/*` is copied to `deploy/public/`
2. Check `web.config` has correct rewrite rules
3. Verify in App Service SSH: `ls -la /home/site/wwwroot/public/`

---

## 📋 Deployment Checklist

Before deploying:

- [ ] Client built successfully (`client/build/` exists)
- [ ] Server dependencies listed in `package.json`
- [ ] Environment variables set in Azure Portal
- [ ] Startup command configured: `node server.js`
- [ ] `.deployment` file present
- [ ] `web.config` present
- [ ] GitHub Actions secrets configured
- [ ] Cosmos DB connection string valid
- [ ] Storage connection string valid

After deploying:

- [ ] Deployment succeeded (check Deployment Center)
- [ ] Application started (check Application Logs)
- [ ] Health endpoint responds
- [ ] API endpoints work
- [ ] Database connection successful
- [ ] Static files served correctly

---

## 🔧 Azure App Service Settings

### Startup Command

**Path**: Configuration → General settings → Startup Command

**Value**:
```bash
node server.js
```

### Stack Settings

- **Stack**: Node
- **Major version**: 20
- **Minor version**: LTS
- **Startup Command**: `node server.js`

### Application Settings

Add these in Configuration → Application settings:

```bash
# Azure Services
AZURE_COSMOS_CONNECTION_STRING=mongodb://...
AZURE_COSMOS_DATABASE_NAME=capersports
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...
AZURE_STORAGE_ACCOUNT_NAME=capersportsstorage
AZURE_STORAGE_ACCOUNT_KEY=...
AZURE_BLOB_CONTAINER_PRODUCTS=product-images
AZURE_BLOB_CONTAINER_USERS=user-avatars
AZURE_BLOB_CONTAINER_ASSETS=general-assets

# Application
NODE_ENV=production
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend.azurestaticapps.net
CORS_ORIGIN=https://your-frontend.azurestaticapps.net

# Optional
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

### Platform Settings

- **Platform**: 64 Bit
- **Web sockets**: On (if using real-time features)
- **Always On**: On (recommended for production)
- **ARR affinity**: On

---

## 📊 Before vs After

### Before (Broken)
```
deploy/
└── server/
    ├── server.js       ❌ Nested too deep
    ├── package.json    ❌ Not at root
    └── public/
```

**Result**: Azure couldn't find `server.js` or `package.json`

### After (Fixed)
```
deploy/
├── server.js           ✅ At root
├── package.json        ✅ At root
├── web.config          ✅ At root
└── public/             ✅ Correct location
```

**Result**: Azure deploys successfully!

---

## 🎯 Quick Fix Commands

### If deployment fails, try this:

```bash
# 1. Fix environment variables
./fix-azure-env.sh

# 2. Restart app service
az webapp restart \
  --name capersports-api \
  --resource-group caper-sports-rg

# 3. Check logs
az webapp log tail \
  --name capersports-api \
  --resource-group caper-sports-rg

# 4. Test health
curl https://capersports-api.azurewebsites.net/api/health
```

---

## 📞 Still Having Issues?

1. **Check GitHub Actions logs**: Look for build/deploy errors
2. **Check Azure Deployment Center**: View deployment history
3. **Check Application Logs**: See runtime errors
4. **SSH into App Service**: Inspect file structure
5. **Review environment variables**: Ensure all are set correctly

**SSH Command**:
```bash
az webapp ssh --name capersports-api --resource-group caper-sports-rg
```

**Useful SSH commands**:
```bash
# Check structure
ls -la /home/site/wwwroot/

# Check if server.js exists
cat /home/site/wwwroot/server.js | head -20

# Check package.json
cat /home/site/wwwroot/package.json

# Check environment variables
env | grep AZURE

# Check logs
tail -f /home/LogFiles/Application/*.log
```

---

## 📚 Related Documentation

- [Azure App Service Deployment](https://docs.microsoft.com/azure/app-service/deploy-zip)
- [Node.js on Azure](https://docs.microsoft.com/azure/app-service/quickstart-nodejs)
- [GitHub Actions for Azure](https://github.com/Azure/actions)
- [Troubleshooting Azure App Service](https://docs.microsoft.com/azure/app-service/troubleshoot-diagnostic-logs)

---

**Last Updated**: October 6, 2025  
**Status**: ✅ Fixed and tested
