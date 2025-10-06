# Immediate Steps to Fix 403 Deployment Error

## Your Situation
- ✅ App Service is **Running**
- ❌ Deployment fails with **403 Site Disabled** error

## Most Likely Cause
Azure recently changed deployment authentication requirements. Basic Auth for deployments is probably disabled.

---

## Quick Fix (5 minutes)

### Step 1: Run Diagnostic Script

```bash
cd /Users/r0s0fw2/Desktop/capersports-web
./diagnose-403.sh
```

This will identify the exact issue.

### Step 2: Enable Basic Auth

```bash
./enable-basic-auth.sh
```

This enables the authentication required for deployments.

### Step 3: Retry Deployment

Push a commit to trigger GitHub Actions:

```bash
git add .
git commit -m "Enable deployment auth" --allow-empty
git push origin main
```

Or deploy manually:

```bash
cd server
zip -r deploy.zip . -x "node_modules/*" -x ".env" -x ".git/*"
az webapp deployment source config-zip \
  --resource-group capersports-rg \
  --name capersports-api \
  --src deploy.zip
rm deploy.zip
```

---

## Alternative: Switch to Publish Profile (Recommended)

If the above doesn't work, switch to publish profile authentication:

### 1. Get Publish Profile

```bash
az webapp deployment list-publishing-profiles \
  --name capersports-api \
  --resource-group capersports-rg \
  --xml
```

Copy the entire XML output.

### 2. Add to GitHub Secrets

1. Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions
2. Click "New repository secret"
3. Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
4. Value: Paste the XML
5. Click "Add secret"

### 3. Update Workflow

Edit `.github/workflows/main_capersports-api.yml`

Find the deploy job (around line 111-117) and replace:

```yaml
      - name: Login to Azure
        uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZUREAPPSERVICE_CLIENTID_8B18964CB13D4CC1AEDB0B122ED7F4BD }}
          tenant-id: ${{ secrets.AZUREAPPSERVICE_TENANTID_88DA22FE4AD3433C8EF6FC67FB297F06 }}
          subscription-id: ${{ secrets.AZUREAPPSERVICE_SUBSCRIPTIONID_5F0B14B753FA4C809D0A0958C713F958 }}

      - name: 'Deploy to Azure Web App'
        id: deploy-to-webapp
        uses: azure/webapps-deploy@v3
        with:
          app-name: 'capersports-api'
          slot-name: 'Production'
          package: package
```

With:

```yaml
      - name: 'Deploy to Azure Web App'
        id: deploy-to-webapp
        uses: azure/webapps-deploy@v3
        with:
          app-name: 'capersports-api'
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: package
```

### 4. Commit and Push

```bash
git add .github/workflows/main_capersports-api.yml
git commit -m "Switch to publish profile authentication"
git push origin main
```

---

## Verify Success

After deployment completes:

```bash
# Check health
curl https://capersports-api.azurewebsites.net/api/health

# Expected response:
# {"status":"healthy",...}
```

---

## Troubleshooting

### Still getting 403?

1. **Check app is running**:
   ```bash
   az webapp show --name capersports-api --resource-group capersports-rg --query "state"
   ```

2. **View deployment logs**:
   ```bash
   az webapp log tail --name capersports-api --resource-group capersports-rg
   ```

3. **Check GitHub Actions logs**:
   - Go to your repo → Actions tab
   - Click on the failed workflow
   - Look for specific error messages

### Need more help?

See detailed documentation:
- `FIX_403_RUNNING_APP.md` - Comprehensive troubleshooting
- `FIX_AZURE_403_DISABLED.md` - If app is stopped
- `DEPLOYMENT_CHECKLIST.md` - Complete deployment guide

---

## Summary of Available Scripts

```bash
./diagnose-403.sh          # Identify the issue
./enable-basic-auth.sh     # Enable deployment authentication
./check-azure-status.sh    # Check overall Azure status
./fix-azure-403.sh         # Comprehensive fix (if app is stopped)
```

---

## Contact Support

If nothing works:
1. Open Azure Portal → Support → New support request
2. Provide:
   - Subscription ID
   - Resource Group: `capersports-rg`
   - App Service: `capersports-api`
   - Error: "403 Site Disabled during deployment"
   - Timestamp of failed deployment

---

**Quick Command Reference**:

```bash
# Diagnose issue
./diagnose-403.sh

# Enable basic auth
./enable-basic-auth.sh

# Manual deployment test
cd server && zip -r deploy.zip . -x "node_modules/*" -x ".env" && \
az webapp deployment source config-zip --resource-group capersports-rg --name capersports-api --src deploy.zip && \
rm deploy.zip

# Check logs
az webapp log tail --name capersports-api --resource-group capersports-rg

# Restart app
az webapp restart --name capersports-api --resource-group capersports-rg
```
