# Azure Deployment Guide for CaperSports

This guide provides step-by-step instructions for deploying the CaperSports MERN stack application to Microsoft Azure.

## 🏗️ Architecture Overview

The application is configured for deployment using:
- **Frontend**: Azure Static Web Apps
- **Backend**: Azure App Service (Node.js)
- **Database**: MongoDB Atlas (Azure-compatible)
- **CI/CD**: GitHub Actions or Azure DevOps

## 📋 Prerequisites

1. **Azure Account**: Active Azure subscription
2. **GitHub Account**: For source code and CI/CD
3. **MongoDB Atlas**: Database cluster (already configured)
4. **Azure CLI**: Installed locally (optional)

## 🚀 Deployment Options

### Option 1: Azure Static Web Apps + App Service (Recommended)

#### Step 1: Deploy Backend to Azure App Service

1. **Create Azure App Service**:
   ```bash
   # Using Azure CLI
   az webapp create \
     --resource-group your-resource-group \
     --plan your-app-service-plan \
     --name capersports-api \
     --runtime "NODE|18-lts"
   ```

2. **Configure Environment Variables**:
   Go to Azure Portal → App Service → Configuration → Application Settings:
   ```
   NODE_ENV=production
   PORT=80
   WEBSITE_PORT=80
   MONGODB_URI=mongodb+srv://capersports:Caper2703@cluster0.g81nojp.mongodb.net/capersports?retryWrites=true&w=majority
   JWT_SECRET=capersports_jwt_secret_key_2024_super_secure_token
   JWT_EXPIRE=30d
   CLOUDINARY_CLOUD_NAME=ddkzcgmvs
   CLOUDINARY_API_KEY=698371742377455
   CLOUDINARY_API_SECRET=sqTU4cTZR4VUUWH35kqw-iFPeI8
   STRIPE_SECRET_KEY=sk_test_51ME6bpSFKFDfE6SYo8XcVHR6hZDZTIyCHdAtrLTmyI5HSkyKMnmD7YwTkLLFHELLiOqvdeRrMwpguBDWcOQAXegJ00BZfIquIJ
   STRIPE_PUBLISHABLE_KEY=pk_test_51ME6bpSFKFDfE6SYf0mxpIZu5KZLWPvMdB18l6H0ak86Vu3DQLBwaySsgY0rQ4T1mQwINrHkYss4ahTmUTNJ9OvN00nut0Ye08
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_EMAIL=riteshsharma1210@gmail.com
   SMTP_PASSWORD=your_smtp_password_here
   FRONTEND_URL=https://your-static-web-app.azurestaticapps.net
   WEBSITES_ENABLE_APP_SERVICE_STORAGE=false
   WEBSITE_NODE_DEFAULT_VERSION=18.17.0
   ```

3. **Deploy using GitHub Actions**:
   - Push code to GitHub
   - GitHub Actions will automatically deploy using `.github/workflows/azure-deploy.yml`

#### Step 2: Deploy Frontend to Azure Static Web Apps

1. **Create Static Web App**:
   ```bash
   az staticwebapp create \
     --name capersports-frontend \
     --resource-group your-resource-group \
     --source https://github.com/yourusername/capersports \
     --location "Central US" \
     --branch main \
     --app-location "/client" \
     --api-location "/server" \
     --output-location "build"
   ```

2. **Configure Environment Variables**:
   Go to Azure Portal → Static Web Apps → Configuration:
   ```
   REACT_APP_API_URL=https://capersports-api.azurewebsites.net/api
   REACT_APP_NAME=CaperSports
   REACT_APP_VERSION=1.0.0
   REACT_APP_ENV=production
   REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_51ME6bpSFKFDfE6SYf0mxpIZu5KZLWPvMdB18l6H0ak86Vu3DQLBwaySsgY0rQ4T1mQwINrHkYss4ahTmUTNJ9OvN00nut0Ye08
   ```

### Option 2: Azure DevOps Pipeline

1. **Import Repository** to Azure DevOps
2. **Create Pipeline** using `azure-pipelines.yml`
3. **Configure Variables**:
   - `azureSubscription`: Your Azure service connection
   - `appName`: Your App Service name
   - `REACT_APP_API_URL`: Backend URL

## 🔧 Configuration Files

### Key Files Created:
- `web.config`: IIS configuration for Azure App Service
- `.deployment`: Kudu deployment configuration
- `deploy.cmd`: Custom deployment script
- `staticwebapp.config.json`: Static Web Apps routing
- `azure-pipelines.yml`: Azure DevOps pipeline
- `.github/workflows/azure-deploy.yml`: GitHub Actions workflow

### Environment Files:
- `server/.env`: Backend environment variables
- `client/.env`: Frontend environment variables

## 🔐 Security Considerations

1. **Environment Variables**: Never commit `.env` files to version control
2. **CORS Configuration**: Updated to allow Azure domains
3. **Rate Limiting**: Configured for production traffic
4. **Security Headers**: Helmet.js configured for Azure

## 📊 Monitoring & Logging

1. **Application Insights**: Enable in Azure Portal
2. **Log Stream**: Available in Azure Portal → App Service → Log stream
3. **Health Check**: Available at `/api/health`

## 🚨 Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Update `FRONTEND_URL` in backend environment variables
   - Check CORS configuration in `server.js`

2. **Database Connection**:
   - Verify MongoDB Atlas connection string
   - Check network access settings in MongoDB Atlas

3. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are listed in `package.json`

4. **Static Files Not Loading**:
   - Ensure build artifacts are copied correctly
   - Check `staticwebapp.config.json` routing rules

### Debug Commands:

```bash
# Check deployment logs
az webapp log tail --name capersports-api --resource-group your-rg

# Test API health
curl https://capersports-api.azurewebsites.net/api/health

# Check Static Web App
curl https://your-app.azurestaticapps.net
```

## 📈 Performance Optimization

1. **CDN**: Enable Azure CDN for static assets
2. **Compression**: Gzip enabled in server configuration
3. **Caching**: Static assets cached with appropriate headers
4. **Database**: MongoDB Atlas provides automatic scaling

## 🔄 CI/CD Pipeline

The application includes automated deployment pipelines:

### GitHub Actions:
- Triggers on push to `main` branch
- Builds and tests the application
- Deploys to Azure automatically

### Azure DevOps:
- Multi-stage pipeline (Build → Deploy)
- Artifact management
- Environment-specific deployments

## 📝 Post-Deployment Checklist

- [ ] Verify API health endpoint responds
- [ ] Test user authentication
- [ ] Check product listings load
- [ ] Verify cart functionality
- [ ] Test order placement
- [ ] Confirm admin dashboard access
- [ ] Validate email notifications
- [ ] Test payment processing (Stripe)

## 🆘 Support

For deployment issues:
1. Check Azure Portal logs
2. Review GitHub Actions/DevOps pipeline logs
3. Verify environment variable configuration
4. Test database connectivity

## 🔗 Useful Links

- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [MongoDB Atlas Azure Integration](https://docs.atlas.mongodb.com/reference/microsoft-azure/)
- [GitHub Actions for Azure](https://docs.microsoft.com/en-us/azure/developer/github/github-actions)

---

**Note**: Remember to update the placeholder URLs and credentials with your actual Azure resource names and secure values.
