# 🚀 Deploy to Azure NOW - Step by Step

## ⚡ Quick Deploy (3 Steps)

### Step 1: Commit the Fixes (1 minute)

```bash
cd /Users/r0s0fw2/Desktop/capersports-web

# Add all the fixes
git add .

# Commit with descriptive message
git commit -m "Fix Azure deployment: correct package structure and add connection validation"

# Push to trigger deployment
git push origin main
```

### Step 2: Set Environment Variables (2 minutes)

**Option A - Automated (Recommended)**:
```bash
./fix-azure-env.sh
```

**Option B - Manual (Azure Portal)**:
1. Go to https://portal.azure.com
2. Navigate to your App Service (`capersports-api`)
3. Click **Configuration** → **Application settings**
4. Add/Update these settings:

| Name | Value | Where to Get It |
|------|-------|-----------------|
| `AZURE_COSMOS_CONNECTION_STRING` | `mongodb://...` | Cosmos DB → Connection strings |
| `AZURE_COSMOS_DATABASE_NAME` | `capersports` | (type this) |
| `AZURE_STORAGE_CONNECTION_STRING` | `DefaultEndpointsProtocol=https;...` | Storage Account → Access keys |
| `AZURE_STORAGE_ACCOUNT_NAME` | `capersportsstorage` | (your storage account name) |
| `NODE_ENV` | `production` | (type this) |
| `JWT_SECRET` | (generate random 64-char string) | Use: `openssl rand -hex 32` |
| `FRONTEND_URL` | `https://your-frontend.azurestaticapps.net` | (your frontend URL) |

5. Click **Save** → **Continue** to restart

### Step 3: Verify Deployment (2 minutes)

```bash
# Wait 2 minutes for GitHub Actions to complete, then test:
curl https://capersports-api.azurewebsites.net/api/health
```

**Expected Response**:
```json
{
  "status": "healthy",
  "azure": {
    "configured": true,
    "cosmosConnected": "initialized"
  }
}
```

✅ **If you see this, deployment is successful!**

---

## 📋 Detailed Steps

### Before You Start

Make sure you have:
- [ ] Azure account with active subscription
- [ ] Azure resources created (Cosmos DB, Storage, App Service)
- [ ] GitHub repository connected to Azure
- [ ] Azure CLI installed (for automated fix)

---

### Step 1: Commit and Push Fixes

The fixes include:
- ✅ Corrected GitHub Actions workflow
- ✅ Proper deployment package structure
- ✅ Connection string validation
- ✅ Enhanced error messages
- ✅ Automated fix scripts

```bash
# Check what's changed
git status

# You should see:
# - .github/workflows/main_capersports-api.yml (modified)
# - server/services/azureCosmosService.js (modified)
# - server/server.js (modified)
# - README.md (modified)
# - Multiple new .md files (documentation)
# - fix-azure-env.sh (new script)

# Stage all changes
git add .

# Commit
git commit -m "Fix Azure deployment structure and add connection validation

- Fix GitHub Actions workflow to create proper deployment package
- Add connection string validation with clear error messages
- Create automated fix script for environment variables
- Add comprehensive troubleshooting documentation
- Update README with deployment guides"

# Push to trigger GitHub Actions
git push origin main
```

---

### Step 2: Monitor GitHub Actions

1. Go to your GitHub repository
2. Click **Actions** tab
3. You should see a new workflow run starting
4. Click on it to watch progress

**What happens**:
1. **Build job** (2-3 minutes):
   - Installs dependencies
   - Builds React client
   - Creates deployment package with correct structure
   - Uploads artifact

2. **Deploy job** (2-3 minutes):
   - Downloads artifact
   - Logs into Azure
   - Deploys to App Service
   - Runs health check

**Look for**:
- ✅ Green checkmarks for each step
- ✅ "Deployment completed" message
- ✅ Health check passes

---

### Step 3: Set Environment Variables

#### Option A: Automated Script (Easiest)

```bash
# Make sure you're logged into Azure CLI
az login

# Run the fix script
./fix-azure-env.sh

# Follow the prompts:
# - Confirm your resource names
# - Enter JWT secret (or let it generate one)
# - Enter frontend URL

# Script will:
# ✅ Retrieve connection strings from Azure
# ✅ Set all environment variables
# ✅ Restart the app
# ✅ Verify configuration
```

#### Option B: Azure CLI (Manual)

```bash
# Set your variables
APP_NAME="capersports-api"
RESOURCE_GROUP="caper-sports-rg"
COSMOS_ACCOUNT="capersports-cosmos"
STORAGE_ACCOUNT="capersportsstorage"

# Get connection strings
COSMOS_CONN=$(az cosmosdb keys list \
  --name $COSMOS_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --type connection-strings \
  --query 'connectionStrings[0].connectionString' \
  -o tsv)

STORAGE_CONN=$(az storage account show-connection-string \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --query 'connectionString' \
  -o tsv)

# Set environment variables
az webapp config appsettings set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings \
    AZURE_COSMOS_CONNECTION_STRING="$COSMOS_CONN" \
    AZURE_COSMOS_DATABASE_NAME="capersports" \
    AZURE_STORAGE_CONNECTION_STRING="$STORAGE_CONN" \
    AZURE_STORAGE_ACCOUNT_NAME="$STORAGE_ACCOUNT" \
    NODE_ENV="production" \
    JWT_SECRET="$(openssl rand -hex 32)" \
    FRONTEND_URL="https://your-frontend.azurestaticapps.net"

# Restart
az webapp restart --name $APP_NAME --resource-group $RESOURCE_GROUP
```

#### Option C: Azure Portal (Manual)

1. **Get Cosmos DB Connection String**:
   - Azure Portal → Search "Cosmos DB"
   - Click your Cosmos DB account
   - Left menu → **Connection strings**
   - Click **Show** next to Primary Connection String
   - Click copy icon

2. **Get Storage Connection String**:
   - Azure Portal → Search "Storage accounts"
   - Click your storage account
   - Left menu → **Access keys**
   - Under key1, click **Show**
   - Copy Connection string

3. **Set in App Service**:
   - Azure Portal → Search "App Services"
   - Click your App Service (`capersports-api`)
   - Left menu → **Configuration**
   - Click **+ New application setting** for each:

   | Name | Value |
   |------|-------|
   | `AZURE_COSMOS_CONNECTION_STRING` | (paste from step 1) |
   | `AZURE_COSMOS_DATABASE_NAME` | `capersports` |
   | `AZURE_STORAGE_CONNECTION_STRING` | (paste from step 2) |
   | `AZURE_STORAGE_ACCOUNT_NAME` | `capersportsstorage` |
   | `NODE_ENV` | `production` |
   | `JWT_SECRET` | (generate: `openssl rand -hex 32`) |
   | `FRONTEND_URL` | `https://your-frontend.azurestaticapps.net` |
   | `CORS_ORIGIN` | `https://your-frontend.azurestaticapps.net` |

4. Click **Save** at top
5. Click **Continue** to restart

---

### Step 4: Verify Deployment

#### A. Check GitHub Actions

```bash
# In your browser:
# https://github.com/YOUR_USERNAME/capersports-web/actions

# Should show:
# ✅ Build and deploy Node.js app to Azure Web App - capersports-api
# ✅ All steps completed successfully
```

#### B. Check Application Logs

```bash
# Stream logs in real-time
az webapp log tail \
  --name capersports-api \
  --resource-group caper-sports-rg

# Look for these success messages:
# ✅ "Connection string validation passed for host: ..."
# ✅ "Connected to Azure Cosmos DB"
# ✅ "Azure services initialized successfully"
# ✅ "Server running on 0.0.0.0:8080 in production mode"
```

#### C. Test Health Endpoint

```bash
curl https://capersports-api.azurewebsites.net/api/health
```

**Success Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-06T...",
  "environment": "production",
  "azure": {
    "configured": true,
    "cosmosConnected": "initialized",
    "blobConnected": "initialized"
  }
}
```

#### D. Test API Endpoints

```bash
# Test products endpoint
curl https://capersports-api.azurewebsites.net/api/products

# Test auth health
curl https://capersports-api.azurewebsites.net/api/auth/health

# Test with browser
open https://capersports-api.azurewebsites.net/api/health
```

---

## ✅ Success Checklist

Your deployment is successful when:

- [ ] GitHub Actions workflow completed without errors
- [ ] Application logs show "Server running on..."
- [ ] Application logs show "Connected to Azure Cosmos DB"
- [ ] Health endpoint returns `{"status": "healthy"}`
- [ ] API endpoints respond (even if empty data)
- [ ] No errors in Azure Portal → App Service → Log stream
- [ ] Deployment Center shows "Success" status

---

## ❌ If Something Goes Wrong

### Issue: GitHub Actions Fails

**Check**:
```bash
# View workflow logs on GitHub
# Look for which step failed
```

**Common fixes**:
- Ensure all secrets are set in GitHub repository settings
- Check that Azure credentials are valid
- Verify repository has correct structure

### Issue: Deployment Succeeds but App Won't Start

**Check logs**:
```bash
az webapp log tail --name capersports-api --resource-group caper-sports-rg
```

**Common causes**:
1. Missing environment variables → Run `./fix-azure-env.sh`
2. Invalid connection string → Check format in Azure Portal
3. Port binding issue → App should use `process.env.PORT`

### Issue: "URI must include hostname..." Error

**Fix**:
```bash
# Run the automated fix
./fix-azure-env.sh

# Or manually set AZURE_COSMOS_CONNECTION_STRING in Azure Portal
```

### Issue: "Cannot find module 'server.js'"

**Fix**:
```bash
# The deployment structure is wrong
# Push the updated workflow:
git push origin main

# This will redeploy with correct structure
```

---

## 🆘 Emergency Rollback

If deployment breaks your app:

```bash
# 1. Check previous deployments
az webapp deployment list \
  --name capersports-api \
  --resource-group caper-sports-rg

# 2. Rollback to previous version (if needed)
# In Azure Portal:
# App Service → Deployment Center → Logs → Click previous deployment → Redeploy

# 3. Or restart the app
az webapp restart \
  --name capersports-api \
  --resource-group caper-sports-rg
```

---

## 📞 Get Help

If you're still stuck:

1. **Check the detailed guides**:
   - [AZURE_DEPLOYMENT_FIX.md](./AZURE_DEPLOYMENT_FIX.md)
   - [AZURE_DEPLOYMENT_TROUBLESHOOTING.md](./AZURE_DEPLOYMENT_TROUBLESHOOTING.md)
   - [DEPLOYMENT_ISSUES_RESOLVED.md](./DEPLOYMENT_ISSUES_RESOLVED.md)

2. **Check Azure logs**:
   ```bash
   az webapp log tail --name capersports-api --resource-group caper-sports-rg
   ```

3. **SSH into App Service**:
   ```bash
   az webapp ssh --name capersports-api --resource-group caper-sports-rg
   
   # Then check:
   ls -la /home/site/wwwroot/
   cat /home/site/wwwroot/package.json
   env | grep AZURE
   ```

---

## 🎉 After Successful Deployment

Once everything is working:

1. **Update your frontend** to use the API URL:
   ```javascript
   // In your frontend .env
   REACT_APP_API_URL=https://capersports-api.azurewebsites.net
   ```

2. **Test the full application**:
   - User registration/login
   - Product browsing
   - Cart functionality
   - Order placement

3. **Set up monitoring**:
   - Enable Application Insights
   - Configure alerts for errors
   - Monitor performance

4. **Optional enhancements**:
   - Configure custom domain
   - Set up SSL certificate
   - Enable auto-scaling
   - Configure CDN for static assets

---

## 🚀 You're Ready!

Everything is now fixed and ready to deploy. Just run:

```bash
git add .
git commit -m "Fix Azure deployment issues"
git push origin main
```

Then run:
```bash
./fix-azure-env.sh
```

And you're live! 🎉

---

**Need help?** Check the documentation files in this repository.  
**Still stuck?** Review the Azure Portal logs for specific error messages.
