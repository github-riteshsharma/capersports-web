# Azure Environment Variables Configuration Guide

## Problem: Deployed App Calling Localhost APIs

If your deployed application is still calling `http://localhost:5002/api` instead of your Azure backend, follow this guide.

---

## Understanding the Issue

React apps bake environment variables into the build at **build time**, not runtime. This means:
- The `.env` file values are embedded in the JavaScript bundle during `npm run build`
- Changing environment variables after deployment requires a **rebuild**
- Azure Static Web Apps needs environment variables configured in its settings

---

## Solution: Configure Environment Variables in Azure

### Step 1: Update Your Backend URL

**IMPORTANT**: First, get your actual Azure App Service backend URL:
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your App Service (e.g., `capersports-api`)
3. Copy the URL from the Overview page (e.g., `https://capersports-api.azurewebsites.net`)

### Step 2: Configure Azure Static Web App Environment Variables

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your **Static Web App** (e.g., `capersports-web`)
3. Click on **"Configuration"** in the left menu
4. Click **"+ Add"** to add application settings
5. Add the following environment variables:

```
Name: REACT_APP_API_URL
Value: https://YOUR-APP-SERVICE-NAME.azurewebsites.net/api

Name: REACT_APP_STRIPE_PUBLISHABLE_KEY
Value: your_stripe_publishable_key

Name: REACT_APP_NAME
Value: CaperSports

Name: REACT_APP_ENV
Value: production

Name: GENERATE_SOURCEMAP
Value: false

Name: DISABLE_ESLINT_PLUGIN
Value: true
```

6. Click **"Save"**

### Step 3: Update .env.production File

The `.env.production` file has been created in `/client/.env.production`. Update it with your actual Azure URLs:

```bash
# Update this line with your actual Azure App Service URL
REACT_APP_API_URL=https://YOUR-APP-SERVICE-NAME.azurewebsites.net/api
```

### Step 4: Trigger a Rebuild

After configuring environment variables in Azure, you need to trigger a rebuild:

**Option A: Push a commit to GitHub**
```bash
cd /Users/r0s0fw2/Desktop/capersports-web
git add .
git commit -m "Update production environment variables"
git push origin main
```

**Option B: Manually trigger GitHub Actions**
1. Go to your GitHub repository
2. Click on **"Actions"** tab
3. Select the workflow for Static Web App
4. Click **"Run workflow"**

**Option C: Redeploy from Azure Portal**
1. Go to your Static Web App in Azure Portal
2. Click on **"GitHub Actions"** in the left menu
3. Click **"Re-run"** on the latest workflow

### Step 5: Verify the Deployment

After the rebuild completes (5-10 minutes):

1. Open your Static Web App URL in a browser
2. Open browser DevTools (F12)
3. Go to the **Network** tab
4. Refresh the page
5. Check that API calls are going to `https://YOUR-APP-SERVICE-NAME.azurewebsites.net/api` instead of `localhost`

---

## Environment Files Explained

### `.env` (Local Development)
- Used when running `npm start` locally
- Contains `REACT_APP_API_URL=http://localhost:5002/api`
- **NOT** deployed to Azure

### `.env.production` (Production Build)
- Used when running `npm run build`
- Contains production Azure URLs
- Values can be overridden by Azure Static Web App configuration

### `.env.azure.template` (Template)
- Template file showing all required variables
- Copy and customize for your deployment

---

## How React Environment Variables Work

1. **Build Time**: Environment variables are read from `.env.production` during `npm run build`
2. **Embedded**: Values are embedded into the JavaScript bundle
3. **Immutable**: Cannot be changed without rebuilding the app
4. **Azure Override**: Azure Static Web App configuration overrides `.env.production` values

---

## Troubleshooting

### Still seeing localhost URLs?

1. **Clear browser cache**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. **Check build logs**: Go to GitHub Actions and check if the build succeeded
3. **Verify environment variables**: In Azure Portal, confirm all variables are set correctly
4. **Check network tab**: In browser DevTools, verify the actual API URLs being called

### CORS Errors?

If you see CORS errors after fixing the API URL:

1. Go to your **App Service** (backend) in Azure Portal
2. Navigate to **"Configuration"** → **"Application settings"**
3. Update these variables:
```
FRONTEND_URL = https://YOUR-STATIC-WEB-APP.azurestaticapps.net
CORS_ORIGIN = https://YOUR-STATIC-WEB-APP.azurestaticapps.net
```
4. Click **"Save"** and restart the App Service

### Build Fails?

Check GitHub Actions logs:
1. Go to your GitHub repository
2. Click **"Actions"** tab
3. Click on the failed workflow
4. Review the logs for errors

Common issues:
- Missing environment variables
- Incorrect build configuration
- Node version mismatch

---

## Best Practices

### 1. Never Commit Secrets
- Add `.env` and `.env.production` to `.gitignore`
- Use Azure Key Vault for sensitive data
- Keep `.env.azure.template` as a reference

### 2. Use Different URLs for Different Environments
```
Development: http://localhost:5002/api
Staging: https://capersports-api-staging.azurewebsites.net/api
Production: https://capersports-api.azurewebsites.net/api
```

### 3. Document Your Environment Variables
- Keep this guide updated
- Document all required variables
- Include example values

### 4. Test After Every Deployment
- Verify API calls in browser DevTools
- Test all major features
- Check for console errors

---

## Quick Reference Commands

### Build locally with production config:
```bash
cd client
npm run build
```

### Test production build locally:
```bash
cd client
npm install -g serve
serve -s build
```

### Check environment variables in build:
```bash
cd client/build/static/js
grep -r "localhost" .
# Should return no results if configured correctly
```

---

## Azure Static Web App Configuration Locations

### Method 1: Azure Portal (Recommended)
1. Portal → Static Web App → Configuration → Application settings

### Method 2: Azure CLI
```bash
az staticwebapp appsettings set \
  --name capersports-web \
  --setting-names REACT_APP_API_URL=https://your-api.azurewebsites.net/api
```

### Method 3: GitHub Actions Workflow
Add to `.github/workflows/azure-static-web-apps.yml`:
```yaml
env:
  REACT_APP_API_URL: https://your-api.azurewebsites.net/api
```

---

## Summary

To fix the localhost API issue:

1. ✅ Create `.env.production` with production URLs
2. ✅ Configure environment variables in Azure Static Web App
3. ✅ Update backend CORS settings with frontend URL
4. ✅ Trigger a rebuild by pushing to GitHub
5. ✅ Verify in browser DevTools that API calls use production URLs

**Remember**: Every time you change environment variables in Azure, you must trigger a rebuild!

---

## Need Help?

- Check Azure Static Web Apps logs in Azure Portal
- Review GitHub Actions workflow logs
- Check browser console for errors
- Verify network requests in DevTools

For more details, see:
- `AZURE_DEPLOYMENT_GUIDE.md` - Complete deployment guide
- `AZURE_QUICKSTART.md` - Quick deployment steps
- `DEPLOYMENT_CHECKLIST.md` - Pre-deployment checklist
