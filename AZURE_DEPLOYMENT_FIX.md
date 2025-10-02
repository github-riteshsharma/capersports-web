# Azure Deployment Fix - CaperSports

## Problem
Deployment was failing with 56,719 files being uploaded, including all `node_modules`, causing rsync to fail.

## Solution Implemented

### 1. Optimized Deployment Package
The GitHub Actions workflow now creates a minimal deployment package containing only:
- Server code (`server/`)
- Built React app (copied to `server/public/`)
- Deployment configuration files
- **NO node_modules** (installed on Azure)

### 2. Files Created/Updated

#### `.deployment`
```
[config]
SCM_DO_BUILD_DURING_DEPLOYMENT=true
```

#### `.deploymentignore`
Excludes unnecessary files from deployment:
- node_modules
- Source files (client/src, client/public)
- Development files (.git, .github, .vscode, .idea)
- Logs and temporary files

#### `web.config`
IIS configuration for Azure App Service to properly route requests.

#### `deploy.sh`
Simple deployment script that installs server dependencies.

#### Updated `server/server.js`
Added production static file serving:
- Serves React build from `server/public/`
- Routes non-API requests to React app
- API routes remain at `/api/*`

### 3. GitHub Actions Workflow Changes

**Prepare Deployment Package** step now:
1. Creates a `deploy/` directory
2. Copies only server files
3. Copies built React app to `server/public/`
4. Removes all node_modules
5. Creates a minimal package.json with startup command

**Startup Command**:
```json
"start": "cd server && npm install --production && node server.js"
```

This ensures dependencies are installed fresh on Azure.

### 4. Azure App Service Configuration

#### Required Environment Variables
Set these in Azure Portal → Configuration → Application settings:

```
NODE_ENV=production
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
FRONTEND_URL=https://capersports-api-<your-app>.azurewebsites.net
CORS_ORIGIN=https://capersports-api-<your-app>.azurewebsites.net
PORT=8080
```

#### Startup Command (Azure Portal)
Go to Configuration → General settings:
```bash
cd server && npm install --production && node server.js
```

Or let the package.json handle it (recommended).

### 5. Deployment Size Reduction

**Before**: 56,719 files (including node_modules)
**After**: ~200-300 files (server code + React build only)

This dramatically reduces:
- Upload time
- Deployment time
- Chance of rsync failures
- Storage usage

### 6. How It Works

1. **Build Phase** (GitHub Actions):
   - Install dependencies
   - Build React app
   - Create optimized deployment package
   - Upload artifact

2. **Deploy Phase** (Azure):
   - Download artifact
   - Deploy to Azure App Service
   - Azure runs `npm install --production` in server directory
   - Starts the server

3. **Runtime**:
   - Server serves API at `/api/*`
   - Server serves React app for all other routes
   - React app makes API calls to same domain

### 7. Testing Deployment

After deployment, test these endpoints:

1. **Health Check**:
   ```
   https://capersports-api-<your-app>.azurewebsites.net/api/health
   ```

2. **React App**:
   ```
   https://capersports-api-<your-app>.azurewebsites.net/
   ```

3. **API Endpoints**:
   ```
   https://capersports-api-<your-app>.azurewebsites.net/api/products
   ```

### 8. Troubleshooting

#### If deployment still fails:

1. **Check Azure Logs**:
   - Azure Portal → Deployment Center → Logs
   - Look for specific error messages

2. **Check Application Logs**:
   - Azure Portal → Log stream
   - See real-time server logs

3. **Verify Startup Command**:
   - Configuration → General settings
   - Should be: `cd server && npm install --production && node server.js`

4. **Check Environment Variables**:
   - Configuration → Application settings
   - Ensure all required variables are set

#### Common Issues:

- **MongoDB Connection**: Ensure MONGODB_URI is correct and MongoDB Atlas allows Azure IPs
- **CORS Errors**: Update CORS_ORIGIN to match your Azure URL
- **Port Issues**: Azure uses PORT=8080 by default, ensure server uses `process.env.PORT`

### 9. Next Deployment

Simply commit and push to main branch:
```bash
git add .
git commit -m "Fix Azure deployment"
git push origin main
```

GitHub Actions will automatically:
1. Build the app
2. Create deployment package
3. Deploy to Azure

No manual intervention needed!

## Summary

The deployment is now optimized to:
- ✅ Upload only necessary files
- ✅ Install dependencies on Azure
- ✅ Serve both API and React app from single server
- ✅ Handle routing correctly
- ✅ Complete in reasonable time
