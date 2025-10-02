# Azure Configuration Checklist

## Before Pushing to GitHub

### ✅ Files Ready for Deployment
- [x] `.deployment` - Azure build configuration
- [x] `.deploymentignore` - Excludes unnecessary files
- [x] `web.config` - IIS configuration
- [x] `deploy.sh` - Deployment script
- [x] Updated `server/server.js` - Serves React app in production
- [x] Updated GitHub Actions workflow - Optimized deployment package

## Azure Portal Configuration

### 1. Application Settings (Environment Variables)

Go to: **Azure Portal → Your App Service → Configuration → Application settings**

Add these variables:

```
NODE_ENV = production
MONGODB_URI = <your-mongodb-atlas-connection-string>
JWT_SECRET = <your-secret-key>
FRONTEND_URL = https://capersports-api.azurewebsites.net
CORS_ORIGIN = https://capersports-api.azurewebsites.net
PORT = 8080
```

**Optional** (if using):
```
CLOUDINARY_CLOUD_NAME = <your-cloudinary-name>
CLOUDINARY_API_KEY = <your-cloudinary-key>
CLOUDINARY_API_SECRET = <your-cloudinary-secret>
STRIPE_SECRET_KEY = <your-stripe-key>
```

Click **Save** after adding all variables.

### 2. General Settings

Go to: **Configuration → General settings**

**Startup Command**:
```bash
cd server && npm install --production && node server.js
```

**Stack settings**:
- Stack: Node
- Major version: 20 LTS
- Minor version: 20 LTS

Click **Save**.

### 3. Deployment Center

Already configured via GitHub Actions. Verify:
- Source: GitHub
- Organization: Your GitHub username
- Repository: capersports-web
- Branch: main

### 4. CORS Settings (Optional)

If you need to allow external origins:

Go to: **API → CORS**

Add allowed origins or use `*` for testing (not recommended for production).

## MongoDB Atlas Configuration

### Allow Azure IP Addresses

1. Go to MongoDB Atlas → Network Access
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add specific Azure datacenter IPs for your region

## Deployment Process

### 1. Commit and Push
```bash
git add .
git commit -m "Optimize Azure deployment"
git push origin main
```

### 2. Monitor Deployment

**GitHub Actions**:
- Go to: GitHub → Actions tab
- Watch the workflow progress

**Azure Deployment**:
- Go to: Azure Portal → Deployment Center → Logs
- Monitor deployment status

### 3. Check Logs

**Application Logs**:
```bash
# Azure Portal → Log stream
# Or use Azure CLI:
az webapp log tail --name capersports-api --resource-group <your-resource-group>
```

## Testing After Deployment

### 1. Health Check
```
https://capersports-api.azurewebsites.net/api/health
```
Expected: `{"status":"success","message":"CaperSports API is running!"}`

### 2. React App
```
https://capersports-api.azurewebsites.net/
```
Expected: CaperSports homepage loads

### 3. API Endpoints
```
https://capersports-api.azurewebsites.net/api/products
```
Expected: Product list or appropriate response

## Troubleshooting

### Deployment Fails
1. Check GitHub Actions logs for build errors
2. Check Azure Deployment Center logs
3. Verify all environment variables are set
4. Check MongoDB connection string

### App Not Starting
1. Check Azure Log stream for errors
2. Verify startup command is correct
3. Check if PORT environment variable is set
4. Verify MongoDB connection

### 500 Errors
1. Check application logs in Azure
2. Verify all required environment variables
3. Check MongoDB Atlas network access
4. Verify JWT_SECRET is set

### CORS Errors
1. Update CORS_ORIGIN in Azure configuration
2. Check CORS settings in Azure Portal
3. Verify server.js CORS configuration

## File Size Comparison

**Before Optimization**: 56,719 files
**After Optimization**: ~200-300 files

This reduces deployment time from timeout to ~2-3 minutes.

## Important Notes

- ✅ node_modules are NOT deployed (installed on Azure)
- ✅ Only server code and built React app are deployed
- ✅ Environment variables must be set in Azure Portal
- ✅ MongoDB must allow Azure IP addresses
- ✅ Startup command handles dependency installation

## Next Steps

1. ✅ Commit all changes
2. ✅ Push to GitHub
3. ✅ Configure Azure environment variables
4. ✅ Monitor deployment
5. ✅ Test endpoints
6. ✅ Check logs if issues occur
