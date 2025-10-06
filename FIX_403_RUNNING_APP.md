# Fix 403 Error When App Service is Running

## Problem
Your App Service shows as **Running** but deployment fails with:
```
Site Disabled (CODE: 403)
Error: Failed to deploy web package to App Service.
```

## Root Causes

When the app is running but deployment fails with 403, it's usually:

1. **Service Principal permissions issue** (most common)
2. **Deployment credentials expired or invalid**
3. **App Service authentication/authorization blocking deployment**
4. **IP restrictions blocking GitHub Actions**
5. **App Service in "Read-Only" mode**

## Solution 1: Check Service Principal Permissions

Your GitHub workflow uses Service Principal authentication. Verify permissions:

```bash
# Login to Azure
az login

# Get your subscription ID
SUBSCRIPTION_ID=$(az account show --query id -o tsv)

# Check Service Principal permissions
az role assignment list \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/capersports-rg" \
  --query "[?principalType=='ServicePrincipal'].{Name:principalName, Role:roleDefinitionName}" \
  -o table
```

The Service Principal needs **Contributor** or **Website Contributor** role.

### Fix: Grant Proper Permissions

```bash
# Get the Service Principal Object ID from your GitHub secrets
# (This is the client ID from your workflow)
CLIENT_ID="<your-client-id-from-github-secrets>"

# Grant Contributor role to the resource group
az role assignment create \
  --assignee $CLIENT_ID \
  --role "Contributor" \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/capersports-rg"

# Or grant Website Contributor role (more restrictive)
az role assignment create \
  --assignee $CLIENT_ID \
  --role "Website Contributor" \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/capersports-rg/providers/Microsoft.Web/sites/capersports-api"
```

## Solution 2: Switch to Publish Profile (Easier)

Publish profiles are simpler and more reliable for basic deployments.

### Step 1: Get Publish Profile

```bash
az webapp deployment list-publishing-profiles \
  --name capersports-api \
  --resource-group capersports-rg \
  --xml > publish-profile.xml

# Display the content
cat publish-profile.xml
```

### Step 2: Add to GitHub Secrets

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
5. Value: Paste the entire XML content from above
6. Click "Add secret"

### Step 3: Update Workflow File

Update `.github/workflows/main_capersports-api.yml`:

Replace the deploy job (lines 84-123) with:

```yaml
  deploy:
    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: Download artifact from build job
        uses: actions/download-artifact@v4
        with:
          name: node-app
      
      - name: Unzip deployment package
        run: |
          mkdir -p package
          unzip deployment.zip -d package
          echo "Package contents:"
          ls -la package/
          
      - name: 'Deploy to Azure Web App'
        uses: azure/webapps-deploy@v3
        with:
          app-name: 'capersports-api'
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: package
          
      - name: 'Check deployment status'
        run: |
          echo "Deployment completed. Checking application health..."
          sleep 30
          curl -f https://capersports-api.azurewebsites.net/api/health || echo "Health check failed - app may still be starting"
```

## Solution 3: Check App Service Configuration

### Disable Authentication (if enabled)

```bash
# Check if authentication is enabled
az webapp auth show --name capersports-api --resource-group capersports-rg

# Disable authentication for deployment
az webapp auth update --name capersports-api --resource-group capersports-rg --enabled false
```

### Check IP Restrictions

```bash
# List IP restrictions
az webapp config access-restriction show --name capersports-api --resource-group capersports-rg

# Remove all IP restrictions (be careful in production!)
az webapp config access-restriction remove --name capersports-api --resource-group capersports-rg --rule-name AllowAll --action Allow
```

### Check if App is in Read-Only Mode

```bash
# Check app settings
az webapp config appsettings list --name capersports-api --resource-group capersports-rg --query "[?name=='WEBSITE_RUN_FROM_PACKAGE'].value" -o tsv

# If it returns a URL, the app might be in read-only mode
# Remove it to allow deployments
az webapp config appsettings delete --name capersports-api --resource-group capersports-rg --setting-names WEBSITE_RUN_FROM_PACKAGE
```

## Solution 4: Reset Deployment Credentials

```bash
# Reset deployment user credentials
az webapp deployment user set --user-name <new-username> --password <new-password>

# Or reset publish profile
az webapp deployment list-publishing-profiles \
  --name capersports-api \
  --resource-group capersports-rg \
  --xml
```

## Solution 5: Enable Basic Auth for Deployments

Azure recently changed deployment authentication. Ensure Basic Auth is enabled:

### Via Azure Portal:
1. Go to Azure Portal → App Services → capersports-api
2. Click **Configuration** → **General settings**
3. Scroll to **Platform settings**
4. Set **SCM Basic Auth Publishing Credentials** to **On**
5. Set **FTP Basic Auth Publishing Credentials** to **On** (if using FTP)
6. Click **Save**

### Via Azure CLI:
```bash
# Enable basic auth for SCM
az resource update \
  --resource-group capersports-rg \
  --name scm \
  --resource-type basicPublishingCredentialsPolicies \
  --parent sites/capersports-api \
  --set properties.allow=true

# Enable basic auth for FTP
az resource update \
  --resource-group capersports-rg \
  --name ftp \
  --resource-type basicPublishingCredentialsPolicies \
  --parent sites/capersports-api \
  --set properties.allow=true
```

## Solution 6: Manual Deployment Test

Test deployment manually to isolate the issue:

```bash
cd /Users/r0s0fw2/Desktop/capersports-web/server

# Create deployment package
zip -r deploy.zip . -x "node_modules/*" -x ".env" -x ".git/*"

# Deploy using Azure CLI
az webapp deployment source config-zip \
  --resource-group capersports-rg \
  --name capersports-api \
  --src deploy.zip

# Clean up
rm deploy.zip
```

If this works, the issue is with your GitHub Actions authentication.

## Recommended Approach

**For simplicity and reliability, I recommend using Publish Profile (Solution 2).**

Here's a quick script to set it up:

```bash
#!/bin/bash

echo "Setting up Publish Profile for GitHub Actions"

# Get publish profile
az webapp deployment list-publishing-profiles \
  --name capersports-api \
  --resource-group capersports-rg \
  --xml > publish-profile.xml

echo ""
echo "✅ Publish profile saved to: publish-profile.xml"
echo ""
echo "Next steps:"
echo "1. Copy the contents of publish-profile.xml"
echo "2. Go to GitHub: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions"
echo "3. Create new secret: AZURE_WEBAPP_PUBLISH_PROFILE"
echo "4. Paste the XML content"
echo "5. Update your workflow file (see FIX_403_RUNNING_APP.md)"
echo ""
echo "Then commit and push to trigger deployment"
```

## Verify the Fix

After applying any solution:

1. **Trigger deployment**:
   ```bash
   git add .
   git commit -m "Fix deployment authentication"
   git push origin main
   ```

2. **Monitor in GitHub**:
   - Go to your repo → Actions tab
   - Watch the workflow run
   - Check for successful deployment

3. **Test the app**:
   ```bash
   curl https://capersports-api.azurewebsites.net/api/health
   ```

## Still Not Working?

If none of these solutions work:

1. **Check Azure Status**: https://status.azure.com/
2. **View detailed logs**:
   ```bash
   az webapp log tail --name capersports-api --resource-group capersports-rg
   ```
3. **Check GitHub Actions logs** for specific error messages
4. **Contact Azure Support** with:
   - Subscription ID
   - Resource Group name
   - App Service name
   - Deployment timestamp
   - Error message

## Prevention

To avoid this in the future:

1. Use Publish Profile for simpler authentication
2. Set up monitoring alerts for deployment failures
3. Document your deployment credentials
4. Regularly test your deployment pipeline
5. Keep Azure CLI and GitHub Actions updated

---

**Quick Reference Commands**:

```bash
# Check app status
az webapp show --name capersports-api --resource-group capersports-rg --query "state"

# Get publish profile
az webapp deployment list-publishing-profiles --name capersports-api --resource-group capersports-rg --xml

# Enable basic auth
az resource update --resource-group capersports-rg --name scm --resource-type basicPublishingCredentialsPolicies --parent sites/capersports-api --set properties.allow=true

# Manual deployment
az webapp deployment source config-zip --resource-group capersports-rg --name capersports-api --src deploy.zip

# View logs
az webapp log tail --name capersports-api --resource-group capersports-rg
```
