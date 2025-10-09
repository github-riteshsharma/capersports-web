#!/bin/bash

# Caper Sports Production Deployment Script
# This script deploys both backend and frontend to Azure

echo "🚀 Deploying Caper Sports to Production..."
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration (update these with your actual names)
RESOURCE_GROUP="capersports-rg"
APP_SERVICE_NAME="capersports-api"

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    print_error "Azure CLI is not installed. Please install it first."
    echo "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged in to Azure
az account show &> /dev/null
if [ $? -ne 0 ]; then
    print_error "Not logged in to Azure CLI. Please run 'az login' first."
    exit 1
fi

print_success "Azure CLI is ready"

# Step 1: Deploy Backend
echo ""
echo "📦 Step 1: Deploying Backend to Azure App Service..."
echo "----------------------------------------------------"

cd server

# Check if server directory exists
if [ ! -f "server.js" ]; then
    print_error "server.js not found. Make sure you're in the correct directory."
    exit 1
fi

# Create deployment package
print_info "Creating deployment package..."
zip -r deploy.zip . -x "node_modules/*" -x ".env" -x ".env.*" -x ".git/*" -x "*.log" > /dev/null 2>&1

if [ ! -f "deploy.zip" ]; then
    print_error "Failed to create deployment package"
    exit 1
fi

print_success "Deployment package created"

# Deploy to Azure
print_info "Deploying to Azure App Service: $APP_SERVICE_NAME..."
az webapp deployment source config-zip \
  --resource-group "$RESOURCE_GROUP" \
  --name "$APP_SERVICE_NAME" \
  --src deploy.zip \
  --timeout 300

if [ $? -eq 0 ]; then
    print_success "Backend deployed successfully"
    rm deploy.zip
else
    print_error "Backend deployment failed"
    rm deploy.zip
    exit 1
fi

# Step 2: Restart Backend
echo ""
echo "🔄 Step 2: Restarting Backend..."
echo "----------------------------------------------------"

az webapp restart --resource-group "$RESOURCE_GROUP" --name "$APP_SERVICE_NAME"

if [ $? -eq 0 ]; then
    print_success "Backend restarted successfully"
else
    print_warning "Failed to restart backend, but deployment may still work"
fi

# Wait for restart
print_info "Waiting for backend to start (10 seconds)..."
sleep 10

# Step 3: Verify Backend
echo ""
echo "✓ Step 3: Verifying Backend..."
echo "----------------------------------------------------"

BACKEND_URL="https://${APP_SERVICE_NAME}.azurewebsites.net"
print_info "Testing health endpoint: ${BACKEND_URL}/api/health"

HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "${BACKEND_URL}/api/health")

if [ "$HEALTH_CHECK" = "200" ]; then
    print_success "Backend is responding (HTTP 200)"
else
    print_warning "Backend returned HTTP $HEALTH_CHECK (may need a few more seconds to start)"
fi

# Test clients endpoint
print_info "Testing clients endpoint: ${BACKEND_URL}/api/clients"
CLIENTS_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "${BACKEND_URL}/api/clients")

if [ "$CLIENTS_CHECK" = "200" ] || [ "$CLIENTS_CHECK" = "401" ]; then
    print_success "Clients endpoint is accessible"
else
    print_warning "Clients endpoint returned HTTP $CLIENTS_CHECK"
fi

cd ..

# Step 4: Frontend Instructions
echo ""
echo "🌐 Step 4: Frontend Deployment"
echo "----------------------------------------------------"
print_info "Frontend deploys automatically via GitHub Actions when you push to main"
print_info "Make sure REACT_APP_API_URL is set in Azure Static Web App configuration:"
echo ""
echo "  REACT_APP_API_URL=${BACKEND_URL}/api"
echo ""

# Step 5: Show useful information
echo ""
echo "📋 Deployment Summary"
echo "=========================================="
echo ""
print_success "Backend deployment completed!"
echo ""
echo "📍 URLs:"
echo "   Backend:       ${BACKEND_URL}"
echo "   Health Check:  ${BACKEND_URL}/api/health"
echo "   Clients API:   ${BACKEND_URL}/api/clients"
echo "   Debug Info:    ${BACKEND_URL}/api/debug"
echo ""
echo "🔧 Useful Commands:"
echo "   View logs:     az webapp log tail --name $APP_SERVICE_NAME --resource-group $RESOURCE_GROUP"
echo "   Check status:  az webapp show --name $APP_SERVICE_NAME --resource-group $RESOURCE_GROUP --query 'state'"
echo "   Restart:       az webapp restart --name $APP_SERVICE_NAME --resource-group $RESOURCE_GROUP"
echo ""
echo "📱 Next Steps:"
echo "   1. Verify backend is working: curl ${BACKEND_URL}/api/health"
echo "   2. Test clients endpoint: curl ${BACKEND_URL}/api/clients"
echo "   3. Set REACT_APP_API_URL in Azure Static Web App settings"
echo "   4. Push to GitHub main branch to deploy frontend"
echo "   5. Clear browser cache and test production site"
echo ""
print_success "Deployment process complete! 🎉"

