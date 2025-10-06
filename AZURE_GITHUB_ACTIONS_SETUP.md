# GitHub Actions Setup for Azure Deployment

This guide will help you set up automated deployments to Azure using GitHub Actions, which is more reliable than manual deployments.

## Benefits

- ✅ Automated deployments on every push
- ✅ No manual deployment steps needed
- ✅ Built-in error handling and retries
- ✅ Deployment history and logs
- ✅ No local Azure CLI required

## Prerequisites

1. GitHub repository for your project
2. Azure App Service created
3. Azure CLI installed (for initial setup only)

## Step 1: Get Azure Publish Profile

Run this command to get your publish profile:

```bash
az webapp deployment list-publishing-profiles \
  --name capersports-api \
  --resource-group capersports-rg \
  --xml
```

Copy the entire XML output.

## Step 2: Add GitHub Secret

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `AZURE_WEBAPP_PUBLISH_PROFILE`
5. Value: Paste the XML from Step 1
6. Click **Add secret**

## Step 3: Create Workflow File

Create the directory structure:

```bash
mkdir -p .github/workflows
```

Create the file `.github/workflows/azure-deploy.yml` with the following content:

```yaml
name: Deploy to Azure App Service

on:
  push:
    branches:
      - main
  workflow_dispatch:

env:
  AZURE_WEBAPP_NAME: capersports-api
  NODE_VERSION: '18.x'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: 'Checkout code'
      uses: actions/checkout@v3
    
    - name: 'Set up Node.js'
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        cache-dependency-path: server/package-lock.json
    
    - name: 'Install dependencies'
      run: |
        cd server
        npm ci --production
    
    - name: 'Create deployment package'
      run: |
        cd server
        zip -r ../deploy.zip . -x "node_modules/*" -x ".env" -x ".git/*" -x "*.log"
        cd ..
    
    - name: 'Deploy to Azure Web App'
      uses: azure/webapps-deploy@v2
      with:
        app-name: ${{ env.AZURE_WEBAPP_NAME }}
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: deploy.zip
    
    - name: 'Clean up'
      run: rm -f deploy.zip
    
    - name: 'Test deployment'
      run: |
        sleep 30
        curl -f https://${{ env.AZURE_WEBAPP_NAME }}.azurewebsites.net/api/health || exit 1
```

## Step 4: Commit and Push

```bash
git add .github/workflows/azure-deploy.yml
git commit -m "Add GitHub Actions deployment workflow"
git push origin main
```

## Step 5: Monitor Deployment

1. Go to your GitHub repository
2. Click **Actions** tab
3. You should see your workflow running
4. Click on the workflow to see detailed logs

## Advanced Configuration

### Deploy on Pull Request

To test deployments before merging:

```yaml
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  workflow_dispatch:
```

### Multiple Environments

Create separate workflows for staging and production:

**.github/workflows/deploy-staging.yml**:
```yaml
name: Deploy to Staging

on:
  push:
    branches:
      - develop

env:
  AZURE_WEBAPP_NAME: capersports-api-staging
  NODE_VERSION: '18.x'

# ... rest of the workflow
```

**.github/workflows/deploy-production.yml**:
```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

env:
  AZURE_WEBAPP_NAME: capersports-api
  NODE_VERSION: '18.x'

# ... rest of the workflow
```

### Add Build Step for Client

If you want to deploy both client and server:

```yaml
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: 'Checkout code'
      uses: actions/checkout@v3
    
    - name: 'Set up Node.js'
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
    
    - name: 'Build client'
      run: |
        cd client
        npm ci
        npm run build
        cd ..
    
    - name: 'Copy client build to server'
      run: |
        mkdir -p server/public
        cp -r client/build/* server/public/
    
    - name: 'Install server dependencies'
      run: |
        cd server
        npm ci --production
    
    - name: 'Create deployment package'
      run: |
        cd server
        zip -r ../deploy.zip . -x ".env" -x ".git/*" -x "*.log"
        cd ..
    
    - name: 'Deploy to Azure Web App'
      uses: azure/webapps-deploy@v2
      with:
        app-name: ${{ env.AZURE_WEBAPP_NAME }}
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: deploy.zip
```

### Add Environment Variables

To set environment variables during deployment:

```yaml
    - name: 'Deploy to Azure Web App'
      uses: azure/webapps-deploy@v2
      with:
        app-name: ${{ env.AZURE_WEBAPP_NAME }}
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: deploy.zip
      env:
        NODE_ENV: production
```

## Troubleshooting

### Deployment Fails with 403

1. Check that your App Service is running:
   ```bash
   az webapp show --name capersports-api --resource-group capersports-rg --query "state" -o tsv
   ```

2. Start it if stopped:
   ```bash
   az webapp start --name capersports-api --resource-group capersports-rg
   ```

3. Re-run the GitHub Action

### Publish Profile Expired

If you get authentication errors:

1. Get a new publish profile:
   ```bash
   az webapp deployment list-publishing-profiles \
     --name capersports-api \
     --resource-group capersports-rg \
     --xml
   ```

2. Update the GitHub secret with the new profile

### Workflow Not Triggering

1. Check the branch name in the workflow file matches your branch
2. Ensure the workflow file is in `.github/workflows/` directory
3. Check the Actions tab for any errors

## Alternative: Service Principal Authentication

For more secure deployments, use a Service Principal instead of publish profile:

### Step 1: Create Service Principal

```bash
az ad sp create-for-rbac \
  --name "capersports-github-actions" \
  --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/capersports-rg \
  --sdk-auth
```

Copy the JSON output.

### Step 2: Add GitHub Secrets

Add these secrets to GitHub:
- `AZURE_CREDENTIALS`: The JSON from Step 1
- `AZURE_SUBSCRIPTION_ID`: Your subscription ID
- `AZURE_RESOURCE_GROUP`: `capersports-rg`
- `AZURE_WEBAPP_NAME`: `capersports-api`

### Step 3: Update Workflow

```yaml
name: Deploy to Azure App Service

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: 'Checkout code'
      uses: actions/checkout@v3
    
    - name: 'Login to Azure'
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    
    - name: 'Set up Node.js'
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
    
    - name: 'Install dependencies'
      run: |
        cd server
        npm ci --production
    
    - name: 'Deploy to Azure Web App'
      uses: azure/webapps-deploy@v2
      with:
        app-name: ${{ secrets.AZURE_WEBAPP_NAME }}
        package: server
    
    - name: 'Logout from Azure'
      run: az logout
```

## Best Practices

1. **Use deployment slots** for zero-downtime deployments
2. **Add tests** before deployment
3. **Use caching** to speed up builds
4. **Monitor deployments** with Application Insights
5. **Set up alerts** for failed deployments
6. **Use secrets** for sensitive data
7. **Version your deployments** with tags

## Next Steps

After setting up GitHub Actions:

1. ✅ Test the workflow by pushing a commit
2. ✅ Set up deployment slots for staging
3. ✅ Add automated tests to the workflow
4. ✅ Configure Application Insights
5. ✅ Set up monitoring and alerts

## Resources

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Azure Web Apps Deploy Action](https://github.com/Azure/webapps-deploy)
- [Azure Login Action](https://github.com/Azure/login)
- [Azure App Service Documentation](https://docs.microsoft.com/azure/app-service/)
