# Force Rebuild After Environment Variable Changes

## Problem
Your deployed app is still calling `localhost:5001/api` because:
1. Environment variables are baked into the React build at **build time**
2. Adding/changing variables in Azure requires a **new build**
3. The old build with localhost URLs is still deployed

## Solution: Force a Rebuild

### Method 1: Push a Commit (Recommended)

This triggers GitHub Actions to rebuild and redeploy:

```bash
cd /Users/r0s0fw2/Desktop/capersports-web

# Make a small change to force rebuild
echo "# Force rebuild $(date)" >> README.md

# Commit and push
git add .
git commit -m "Force rebuild with updated environment variables"
git push origin main
```

### Method 2: Manually Trigger GitHub Actions

1. Go to your GitHub repository
2. Click **"Actions"** tab
3. Select **"Azure Static Web Apps CI/CD"** workflow
4. Click **"Run workflow"** dropdown
5. Click **"Run workflow"** button

### Method 3: Redeploy from Azure Portal

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your **Static Web App**
3. Click **"GitHub Actions"** in left menu
4. Find the latest run
5. Click **"Re-run"** or **"Re-run jobs"**

---

## Verify Environment Variables Are Set

### In Azure Portal:

1. Go to your **Static Web App** (NOT App Service)
2. Click **"Configuration"** in left menu
3. Verify these variables exist:

```
REACT_APP_API_URL = https://YOUR-APP-SERVICE-NAME.azurewebsites.net/api
REACT_APP_STRIPE_PUBLISHABLE_KEY = your_stripe_key
REACT_APP_ENV = production
DISABLE_ESLINT_PLUGIN = true
```

**IMPORTANT**: Make sure `REACT_APP_API_URL` has:
- ✅ Your actual Azure App Service URL
- ✅ Starts with `https://`
- ✅ Ends with `/api`
- ✅ NO trailing slash after `/api`

Example: `https://capersports-api.azurewebsites.net/api`

---

## After Rebuild: Verify It Worked

### 1. Wait for Build to Complete
- Go to GitHub → Actions tab
- Wait for workflow to show green checkmark (5-10 minutes)

### 2. Clear Browser Cache
```
Chrome/Edge: Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
Or: Hard refresh with Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

### 3. Check Network Requests
1. Open your deployed site
2. Press F12 to open DevTools
3. Go to **Network** tab
4. Refresh the page
5. Look for API calls - they should go to:
   - ✅ `https://YOUR-APP-SERVICE-NAME.azurewebsites.net/api/products`
   - ❌ NOT `http://localhost:5001/api/products`

### 4. Check Console for API URL
Add this temporarily to verify (in browser console):
```javascript
console.log('API URL:', process.env.REACT_APP_API_URL);
```

---

## Common Issues

### Issue 1: Variables Not Taking Effect
**Cause**: Variables set in Azure but no rebuild triggered
**Fix**: Use Method 1 above to force rebuild

### Issue 2: Still Seeing Localhost
**Cause**: Browser cached old build
**Fix**: Hard refresh (Ctrl+Shift+R) or clear browser cache

### Issue 3: CORS Errors After Fix
**Cause**: Backend CORS not configured for frontend URL
**Fix**: Update backend App Service environment variables:
```
FRONTEND_URL = https://YOUR-STATIC-WEB-APP.azurestaticapps.net
CORS_ORIGIN = https://YOUR-STATIC-WEB-APP.azurestaticapps.net
```
Then restart the App Service.

### Issue 4: Environment Variables Not in Azure
**Cause**: Forgot to add them in Azure Portal
**Fix**: 
1. Go to Static Web App → Configuration
2. Add all required `REACT_APP_*` variables
3. Click Save
4. Force rebuild (Method 1)

---

## Quick Checklist

Before forcing rebuild, verify:

- [ ] Azure Static Web App has `REACT_APP_API_URL` configured
- [ ] The URL is your actual Azure App Service URL (not localhost)
- [ ] The URL starts with `https://` and ends with `/api`
- [ ] Backend App Service has `CORS_ORIGIN` set to your Static Web App URL
- [ ] Backend App Service is running (check in Azure Portal)

After forcing rebuild:

- [ ] GitHub Actions workflow completed successfully
- [ ] Cleared browser cache / hard refresh
- [ ] Checked Network tab in DevTools
- [ ] API calls go to Azure URL (not localhost)

---

## Example: Complete URLs

Replace these with your actual URLs:

**Frontend (Static Web App)**:
```
https://polite-hill-006e20e00.azurestaticapps.net
```

**Backend (App Service)**:
```
https://capersports-api.azurewebsites.net
```

**Environment Variables in Static Web App**:
```
REACT_APP_API_URL = https://capersports-api.azurewebsites.net/api
```

**Environment Variables in App Service (Backend)**:
```
FRONTEND_URL = https://polite-hill-006e20e00.azurestaticapps.net
CORS_ORIGIN = https://polite-hill-006e20e00.azurestaticapps.net
```

---

## Need Your Actual URLs?

### Get Static Web App URL:
1. Azure Portal → Your Static Web App → Overview
2. Copy the URL (e.g., `https://polite-hill-006e20e00.azurestaticapps.net`)

### Get App Service URL:
1. Azure Portal → Your App Service → Overview
2. Copy the URL (e.g., `https://capersports-api.azurewebsites.net`)

---

**Next Step**: Use Method 1 to force a rebuild now!
