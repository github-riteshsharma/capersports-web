# Fix Azure App Service 403 - Site Disabled Error

## Problem
Your deployment is failing with:
```
Site Disabled (CODE: 403)
Error: Failed to deploy web package to App Service.
```

## Common Causes

1. **App Service is manually stopped/disabled**
2. **Billing/subscription issues**
3. **App Service Plan quota exceeded**
4. **Resource group locked**
5. **Deployment credentials expired**
6. **App Service in stopped state**

## Solution Steps

### Step 1: Check App Service Status in Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your App Service (e.g., `capersports-api`)
3. Check the **Overview** page for the status
4. If it shows "Stopped" or "Disabled", click **Start**

### Step 2: Enable App Service via Azure CLI

Run the following commands:

```bash
# Login to Azure
az login

# Set your subscription (if you have multiple)
az account set --subscription "YOUR_SUBSCRIPTION_ID"

# Start the App Service
az webapp start --name capersports-api --resource-group capersports-rg

# Check the status
az webapp show --name capersports-api --resource-group capersports-rg --query "state" -o tsv
```

### Step 3: Check Subscription and Billing

```bash
# Check your subscription status
az account show --query "state" -o tsv

# Should return "Enabled"
# If it returns "Disabled" or "Warned", you have billing issues
```

### Step 4: Verify App Service Plan

```bash
# Check App Service Plan status
az appservice plan show --name capersports-rg-plan --resource-group capersports-rg

# Check quota usage
az appservice plan list --resource-group capersports-rg --query "[].{Name:name, Status:status, Sku:sku.name}" -o table
```

### Step 5: Check Resource Locks

```bash
# List any locks on the resource group
az lock list --resource-group capersports-rg -o table

# If there are locks preventing deployment, remove them (if you have permission)
# az lock delete --name LOCK_NAME --resource-group capersports-rg
```

### Step 6: Reset Deployment Credentials

```bash
# Get publishing credentials
az webapp deployment list-publishing-credentials --name capersports-api --resource-group capersports-rg

# Reset deployment credentials if needed
az webapp deployment user set --user-name YOUR_USERNAME --password YOUR_PASSWORD
```

### Step 7: Verify App Service Configuration

```bash
# Check if the app is configured correctly
az webapp config show --name capersports-api --resource-group capersports-rg

# Ensure the app is not in "read-only" mode
az webapp config appsettings list --name capersports-api --resource-group capersports-rg --query "[?name=='WEBSITE_RUN_FROM_PACKAGE'].value" -o tsv
```

## Quick Fix Script

Use the provided `fix-azure-403.sh` script to automatically diagnose and fix the issue:

```bash
chmod +x fix-azure-403.sh
./fix-azure-403.sh
```

## Manual Portal Fix

If CLI doesn't work, use Azure Portal:

1. **Navigate to App Service**
   - Portal → App Services → capersports-api

2. **Check Overview Tab**
   - Status should be "Running"
   - If stopped, click "Start"

3. **Check Configuration**
   - Configuration → Application settings
   - Ensure all required environment variables are set

4. **Check Deployment Center**
   - Deployment Center → Logs
   - Check for any deployment errors

5. **Restart the App Service**
   - Overview → Restart
   - Wait 2-3 minutes for the app to fully restart

## After Fixing

Once the app service is enabled and running:

```bash
# Test the health endpoint
curl https://capersports-api.azurewebsites.net/api/health

# Redeploy your application
cd /Users/r0s0fw2/Desktop/capersports-web
./deploy-azure.sh
```

## Prevention

To prevent this from happening again:

1. **Set up monitoring alerts** for app service status
2. **Enable auto-scaling** if needed
3. **Monitor your Azure subscription billing**
4. **Use deployment slots** for zero-downtime deployments
5. **Set up continuous deployment** via GitHub Actions

## Common Error Messages and Solutions

### "Site Disabled (CODE: 403)"
- **Cause**: App Service is stopped or disabled
- **Fix**: Start the app service using Azure Portal or CLI

### "Subscription is disabled"
- **Cause**: Billing issues or expired trial
- **Fix**: Update payment method in Azure Portal

### "Resource group is locked"
- **Cause**: A lock is preventing modifications
- **Fix**: Remove the lock (requires appropriate permissions)

### "Deployment credentials invalid"
- **Cause**: Expired or incorrect credentials
- **Fix**: Reset deployment credentials

## Need More Help?

Check these Azure documentation pages:
- [Troubleshoot App Service](https://docs.microsoft.com/azure/app-service/troubleshoot-deployment)
- [App Service Diagnostics](https://docs.microsoft.com/azure/app-service/overview-diagnostics)
- [Deployment Best Practices](https://docs.microsoft.com/azure/app-service/deploy-best-practices)

## Contact Support

If none of these solutions work:
1. Open a support ticket in Azure Portal
2. Provide the deployment logs
3. Include your subscription ID and resource group name
