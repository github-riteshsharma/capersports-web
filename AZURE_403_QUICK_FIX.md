# Azure 403 Error - Quick Fix Guide

## Immediate Actions

### Option 1: Fix via Azure Portal (Fastest)

1. **Go to Azure Portal**: https://portal.azure.com
2. **Navigate to your App Service**:
   - Search for "App Services" in the top search bar
   - Click on your app (e.g., `capersports-api`)
3. **Check the status**:
   - Look at the top of the Overview page
   - If it says "Stopped" or shows a red indicator, click **Start**
4. **Wait 2-3 minutes** for the app to start
5. **Try deploying again**

### Option 2: Fix via Azure CLI (Automated)

Run the automated fix script:

```bash
cd /Users/r0s0fw2/Desktop/capersports-web
./fix-azure-403.sh
```

This script will:
- ✅ Check your Azure subscription status
- ✅ Verify the App Service exists
- ✅ Start the App Service if stopped
- ✅ Restart the App Service
- ✅ Test the health endpoint
- ✅ Check for missing environment variables

### Option 3: Manual CLI Commands

```bash
# Login to Azure
az login

# Start the App Service
az webapp start --name capersports-api --resource-group capersports-rg

# Check the status
az webapp show --name capersports-api --resource-group capersports-rg --query "state" -o tsv

# Should return "Running"
```

## Why This Happens

The "Site Disabled (CODE: 403)" error typically occurs when:

1. **App Service is Stopped**: Someone manually stopped it or it auto-stopped
2. **Billing Issues**: Your Azure subscription has billing problems
3. **First Deployment**: The app hasn't been started yet after creation
4. **Resource Limits**: You've hit your subscription or plan limits

## Verify the Fix

After starting the app service, test it:

```bash
# Test the health endpoint
curl https://capersports-api.azurewebsites.net/api/health

# Expected response: {"status":"healthy",...}
```

## If the Problem Persists

### Check 1: Subscription Status

```bash
az account show --query "state" -o tsv
```

Should return: `Enabled`

If it returns `Disabled` or `Warned`:
- Go to Azure Portal → Subscriptions
- Check your billing status
- Update payment method if needed

### Check 2: App Service Plan

```bash
az appservice plan show --name capersports-rg-plan --resource-group capersports-rg --query "status" -o tsv
```

Should return: `Ready`

### Check 3: View Logs

```bash
# View real-time logs
az webapp log tail --name capersports-api --resource-group capersports-rg

# Or download logs
az webapp log download --name capersports-api --resource-group capersports-rg --log-file logs.zip
```

## Alternative Deployment Method

If the standard deployment continues to fail, try deploying via ZIP:

```bash
cd /Users/r0s0fw2/Desktop/capersports-web/server

# Install dependencies
npm install --production

# Create deployment package
zip -r ../deploy.zip . -x "node_modules/*" -x ".env" -x ".git/*"

cd ..

# Deploy the ZIP file
az webapp deployment source config-zip \
  --resource-group capersports-rg \
  --name capersports-api \
  --src deploy.zip

# Clean up
rm deploy.zip
```

## Use GitHub Actions Instead

For more reliable deployments, set up GitHub Actions:

1. **Get Publish Profile**:
   ```bash
   az webapp deployment list-publishing-profiles \
     --name capersports-api \
     --resource-group capersports-rg \
     --xml
   ```

2. **Add to GitHub Secrets**:
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Create new secret: `AZURE_WEBAPP_PUBLISH_PROFILE`
   - Paste the XML content

3. **Create workflow file**: `.github/workflows/azure-deploy.yml`

See `AZURE_GITHUB_ACTIONS_SETUP.md` for complete instructions.

## Contact Information

If none of these solutions work:

1. **Azure Support**: Open a ticket in Azure Portal
2. **Check Azure Status**: https://status.azure.com/
3. **Azure Documentation**: https://docs.microsoft.com/azure/app-service/

## Next Steps After Fix

Once your app is running:

1. ✅ Set up monitoring and alerts
2. ✅ Configure auto-scaling if needed
3. ✅ Set up continuous deployment
4. ✅ Enable Application Insights
5. ✅ Configure custom domain (optional)

---

**Quick Command Reference**:

```bash
# Start app
az webapp start --name capersports-api --resource-group capersports-rg

# Stop app
az webapp stop --name capersports-api --resource-group capersports-rg

# Restart app
az webapp restart --name capersports-api --resource-group capersports-rg

# Check status
az webapp show --name capersports-api --resource-group capersports-rg --query "state" -o tsv

# View logs
az webapp log tail --name capersports-api --resource-group capersports-rg
```
