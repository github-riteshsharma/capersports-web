# Azure Deployment Checklist

Use this checklist to ensure your Azure deployment is properly configured and successful.

## Pre-Deployment Checklist

### Azure Resources

- [ ] Azure subscription is active and billing is current
- [ ] Resource group created (`capersports-rg`)
- [ ] App Service Plan created (B1 or higher recommended)
- [ ] App Service created (`capersports-api`)
- [ ] Azure Cosmos DB account created with MongoDB API
- [ ] Azure Blob Storage account created
- [ ] All services are in the same region (recommended: `eastus`)

### Azure App Service Configuration

- [ ] App Service is **Running** (not stopped)
- [ ] Runtime stack set to Node.js 18 LTS
- [ ] Platform is set to Linux
- [ ] Always On is enabled (for production)
- [ ] HTTP version set to 2.0
- [ ] Web sockets enabled (if using real-time features)

### Environment Variables in Azure

Navigate to: **Azure Portal → App Services → capersports-api → Configuration → Application settings**

Required variables:

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `8080` (or leave empty for default)
- [ ] `AZURE_COSMOS_CONNECTION_STRING` = Your Cosmos DB connection string
- [ ] `AZURE_COSMOS_DATABASE_NAME` = `capersports`
- [ ] `AZURE_STORAGE_CONNECTION_STRING` = Your Blob Storage connection string
- [ ] `AZURE_STORAGE_CONTAINER_NAME` = `capersports-assets`
- [ ] `JWT_SECRET` = Strong random string (generate with: `openssl rand -base64 32`)
- [ ] `JWT_EXPIRE` = `7d`
- [ ] `FRONTEND_URL` = Your frontend URL (e.g., `https://capersports-web.azurestaticapps.net`)
- [ ] `CORS_ORIGIN` = Same as FRONTEND_URL
- [ ] `RATE_LIMIT_WINDOW_MS` = `900000` (15 minutes)
- [ ] `RATE_LIMIT_MAX_REQUESTS` = `1000`

Optional but recommended:

- [ ] `WEBSITE_NODE_DEFAULT_VERSION` = `18-lts`
- [ ] `WEBSITE_RUN_FROM_PACKAGE` = `1` (for better performance)
- [ ] `SCM_DO_BUILD_DURING_DEPLOYMENT` = `false` (we build before deployment)

### Database Setup

- [ ] Cosmos DB connection string obtained from Azure Portal
- [ ] Connection string format verified: `mongodb://...` or `mongodb+srv://...`
- [ ] Database name set to `capersports`
- [ ] Collections will be created automatically on first use

### Storage Setup

- [ ] Blob Storage connection string obtained from Azure Portal
- [ ] Container `capersports-assets` created (or will be auto-created)
- [ ] Public access level set appropriately (Blob or Container)

### Local Development

- [ ] Code tested locally with Azure services
- [ ] All dependencies installed (`npm install` in both root and server)
- [ ] No linting errors
- [ ] Environment variables tested locally

### Deployment Method

Choose one:

#### Option A: Manual Deployment via Azure CLI
- [ ] Azure CLI installed and logged in
- [ ] Run `./fix-azure-403.sh` to verify app is running
- [ ] Run `./deploy-azure.sh` to deploy

#### Option B: GitHub Actions (Recommended)
- [ ] GitHub repository created and code pushed
- [ ] Publish profile obtained from Azure
- [ ] `AZURE_WEBAPP_PUBLISH_PROFILE` secret added to GitHub
- [ ] `.github/workflows/azure-deploy.yml` file created
- [ ] Workflow tested with a push to main branch

## Deployment Steps

### Step 1: Verify App Service is Running

```bash
# Check status
az webapp show --name capersports-api --resource-group capersports-rg --query "state" -o tsv

# Start if stopped
az webapp start --name capersports-api --resource-group capersports-rg
```

- [ ] App Service status is "Running"

### Step 2: Verify Environment Variables

```bash
# List all app settings
az webapp config appsettings list --name capersports-api --resource-group capersports-rg -o table
```

- [ ] All required environment variables are set
- [ ] No sensitive data in plain text (use Key Vault for production)

### Step 3: Deploy Application

#### Using GitHub Actions:
```bash
git add .
git commit -m "Deploy to Azure"
git push origin main
```

- [ ] GitHub Action triggered
- [ ] Build completed successfully
- [ ] Deployment completed successfully
- [ ] Health check passed

#### Using Azure CLI:
```bash
cd /Users/r0s0fw2/Desktop/capersports-web
./fix-azure-403.sh  # Verify and fix any issues
./deploy-azure.sh   # Deploy
```

- [ ] Deployment script completed without errors

### Step 4: Verify Deployment

```bash
# Test health endpoint
curl https://capersports-api.azurewebsites.net/api/health

# Test debug endpoint
curl https://capersports-api.azurewebsites.net/api/debug
```

- [ ] Health endpoint returns 200 OK
- [ ] Response shows "healthy" status
- [ ] Azure services are connected

### Step 5: Test API Endpoints

```bash
# Test products endpoint
curl https://capersports-api.azurewebsites.net/api/products

# Test auth endpoint
curl -X POST https://capersports-api.azurewebsites.net/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123!"}'
```

- [ ] Products endpoint returns data or empty array
- [ ] Auth endpoints are accessible
- [ ] No 500 errors

## Post-Deployment Checklist

### Monitoring

- [ ] Application Insights enabled
- [ ] Log streaming working
- [ ] Alerts configured for:
  - [ ] App Service down
  - [ ] High response time
  - [ ] High error rate
  - [ ] High CPU/memory usage

### Security

- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Helmet.js security headers configured
- [ ] Sensitive data not exposed in logs
- [ ] Environment variables not in source code

### Performance

- [ ] Always On enabled (prevents cold starts)
- [ ] Compression enabled
- [ ] CDN configured for static assets (optional)
- [ ] Database indexes created
- [ ] Response times acceptable (<500ms for most endpoints)

### Backup & Recovery

- [ ] Database backup strategy in place
- [ ] Blob storage redundancy configured
- [ ] Deployment slots configured (for zero-downtime updates)
- [ ] Rollback plan documented

### Documentation

- [ ] API documentation updated
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Troubleshooting guide available

## Troubleshooting

### Issue: 403 Site Disabled

**Solution:**
```bash
./fix-azure-403.sh
```

Or manually:
```bash
az webapp start --name capersports-api --resource-group capersports-rg
```

### Issue: 500 Internal Server Error

**Check logs:**
```bash
az webapp log tail --name capersports-api --resource-group capersports-rg
```

**Common causes:**
- Missing environment variables
- Invalid connection strings
- Database connection failed
- Missing dependencies

### Issue: Deployment Fails

**Verify:**
1. App Service is running
2. Publish profile is valid
3. Package size is under limits
4. No file permission issues

**Re-deploy:**
```bash
# Clean and redeploy
rm -rf server/node_modules
cd server && npm install --production && cd ..
./deploy-azure.sh
```

### Issue: Health Check Fails

**Debug:**
```bash
# Check detailed status
curl https://capersports-api.azurewebsites.net/api/debug

# View logs
az webapp log tail --name capersports-api --resource-group capersports-rg
```

**Common causes:**
- App still starting (wait 2-3 minutes)
- Database connection failed
- Missing environment variables
- Port configuration issue

## Maintenance

### Regular Tasks

- [ ] Monitor application logs weekly
- [ ] Review Application Insights metrics weekly
- [ ] Update dependencies monthly
- [ ] Review and rotate secrets quarterly
- [ ] Test backup restoration quarterly
- [ ] Review and optimize costs monthly

### Updates

When updating the application:

1. [ ] Test changes locally
2. [ ] Deploy to staging slot (if configured)
3. [ ] Test staging deployment
4. [ ] Swap staging to production
5. [ ] Monitor for issues
6. [ ] Rollback if needed

## Resources

- **Azure Portal**: https://portal.azure.com
- **Azure Status**: https://status.azure.com
- **Documentation**: See `AZURE_*.md` files in project root
- **Support**: Open ticket in Azure Portal

## Quick Commands Reference

```bash
# Start app
az webapp start --name capersports-api --resource-group capersports-rg

# Stop app
az webapp stop --name capersports-api --resource-group capersports-rg

# Restart app
az webapp restart --name capersports-api --resource-group capersports-rg

# View logs
az webapp log tail --name capersports-api --resource-group capersports-rg

# Download logs
az webapp log download --name capersports-api --resource-group capersports-rg

# List app settings
az webapp config appsettings list --name capersports-api --resource-group capersports-rg

# Set app setting
az webapp config appsettings set --name capersports-api --resource-group capersports-rg --settings KEY=VALUE

# Check status
az webapp show --name capersports-api --resource-group capersports-rg --query "state"

# Get URL
az webapp show --name capersports-api --resource-group capersports-rg --query "defaultHostName" -o tsv
```

---

**Last Updated**: October 6, 2025
**Version**: 1.0
