# Fix Localhost API Issue - Complete Solution

## The Problem
Your deployed app is calling `localhost:5001/api` because the `REACT_APP_API_URL` environment variable isn't being used during the build.

## The Root Cause
Azure Static Web Apps configuration variables don't always get picked up during the build. The **correct way** is to add the environment variable directly to the GitHub Actions workflow.

---

## ✅ Solution: Add GitHub Secret

I've updated the workflow file to use `${{ secrets.REACT_APP_API_URL }}`. Now you need to add this secret to your GitHub repository.

### Step 1: Get Your Azure App Service URL

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your **App Service** (backend)
3. In the **Overview** page, copy the URL
4. It should look like: `https://capersports-api-XXXXX.azurewebsites.net`

### Step 2: Add GitHub Secret

1. Go to your GitHub repository
2. Click **Settings** tab
3. In left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret** button
5. Fill in:
   - **Name**: `REACT_APP_API_URL`
   - **Secret**: `https://YOUR-APP-SERVICE-NAME.azurewebsites.net/api`
   
   **Example**: `https://capersports-api-abc123.azurewebsites.net/api`
   
   **IMPORTANT**: 
   - ✅ Use `https://` (not `http://`)
   - ✅ End with `/api` (no trailing slash)
   - ✅ Use your actual Azure App Service URL

6. Click **Add secret**

### Step 3: Trigger Rebuild

After adding the secret, push a commit to trigger rebuild:

```bash
cd /Users/r0s0fw2/Desktop/capersports-web

# Stage the workflow file change
git add .

# Commit
git commit -m "Add REACT_APP_API_URL to GitHub Actions workflow"

# Push to trigger rebuild
git push origin main
```

### Step 4: Wait and Verify

1. **Wait 5-10 minutes** for GitHub Actions to complete
2. Go to **GitHub → Actions** tab to monitor progress
3. After completion, **hard refresh** your browser: `Ctrl+Shift+R` or `Cmd+Shift+R`
4. Open **DevTools** (F12) → **Network** tab
5. Verify API calls now go to: `https://YOUR-APP-SERVICE.azurewebsites.net/api`

---

## Alternative: Hardcode the URL (Quick Fix)

If you want a quick fix without using secrets:

### Option A: Edit the workflow file directly

Open `.github/workflows/azure-static-web-apps-polite-hill-006e20e00.yml` and change line 38 to:

```yaml
REACT_APP_API_URL: https://YOUR-ACTUAL-APP-SERVICE-URL.azurewebsites.net/api
```

Replace `YOUR-ACTUAL-APP-SERVICE-URL` with your real URL.

Then commit and push:
```bash
git add .
git commit -m "Hardcode API URL in workflow"
git push origin main
```

---

## Verify Your Azure App Service URL

Not sure what your App Service URL is? Check these places:

### Method 1: Azure Portal
1. Portal → App Services → Your backend app
2. Overview page → URL field
3. Copy the full URL

### Method 2: Test the backend directly
Try opening in browser:
```
https://YOUR-APP-SERVICE-NAME.azurewebsites.net/api/health
```

If it returns a JSON response, that's your correct URL!

---

## Common Mistakes to Avoid

❌ **Wrong**: `http://localhost:5001/api`
❌ **Wrong**: `http://capersports-api.azurewebsites.net/api` (http instead of https)
❌ **Wrong**: `https://capersports-api.azurewebsites.net/api/` (trailing slash)
❌ **Wrong**: `https://capersports-api.azurewebsites.net` (missing /api)

✅ **Correct**: `https://capersports-api.azurewebsites.net/api`

---

## Still Not Working?

### Check 1: Verify the secret was added
1. GitHub → Settings → Secrets and variables → Actions
2. You should see `REACT_APP_API_URL` in the list

### Check 2: Check GitHub Actions logs
1. GitHub → Actions → Latest workflow run
2. Expand the "Build And Deploy" step
3. Look for environment variables in the logs
4. Should show `REACT_APP_API_URL` being set

### Check 3: Verify backend is running
1. Open: `https://YOUR-APP-SERVICE.azurewebsites.net/api/health`
2. Should return a success response
3. If not, your backend might not be running

### Check 4: Check CORS settings
If API calls are being blocked by CORS:
1. Azure Portal → App Service (backend) → Configuration
2. Add/update these variables:
   ```
   FRONTEND_URL = https://polite-hill-006e20e00.azurestaticapps.net
   CORS_ORIGIN = https://polite-hill-006e20e00.azurestaticapps.net
   ```
3. Save and restart the App Service

---

## Summary

**What I changed**:
- ✅ Updated GitHub Actions workflow to use `REACT_APP_API_URL` from secrets

**What you need to do**:
1. ✅ Get your Azure App Service URL from Azure Portal
2. ✅ Add `REACT_APP_API_URL` secret to GitHub (Settings → Secrets → Actions)
3. ✅ Commit and push the workflow file change
4. ✅ Wait for rebuild to complete
5. ✅ Hard refresh browser and verify

**This will fix the localhost issue permanently!** 🎯
