#!/bin/bash

# CaperSports Azure Deployment Script
# This script helps prepare and deploy the application to Azure

set -e  # Exit on error

echo "🚀 CaperSports Azure Deployment Script"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${NC}ℹ $1${NC}"
}

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    print_error "Azure CLI is not installed"
    print_info "Install from: https://docs.microsoft.com/cli/azure/install-azure-cli"
    exit 1
fi

print_success "Azure CLI is installed"

# Check if logged in to Azure
if ! az account show &> /dev/null; then
    print_warning "Not logged in to Azure"
    print_info "Logging in..."
    az login
fi

print_success "Logged in to Azure"

# Get current subscription
SUBSCRIPTION=$(az account show --query name -o tsv)
print_info "Current subscription: $SUBSCRIPTION"

# Configuration
RESOURCE_GROUP="capersports-rg"
LOCATION="eastus"
BACKEND_APP_NAME="capersports-api"
FRONTEND_APP_NAME="capersports-web"
DB_ACCOUNT_NAME="capersports-db"

echo ""
print_info "Deployment Configuration:"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  Location: $LOCATION"
echo "  Backend App: $BACKEND_APP_NAME"
echo "  Frontend App: $FRONTEND_APP_NAME"
echo "  Database: $DB_ACCOUNT_NAME"
echo ""

read -p "Continue with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Deployment cancelled"
    exit 0
fi

# Step 1: Create Resource Group
print_info "Step 1: Creating Resource Group..."
if az group exists --name $RESOURCE_GROUP | grep -q "true"; then
    print_warning "Resource group already exists"
else
    az group create --name $RESOURCE_GROUP --location $LOCATION
    print_success "Resource group created"
fi

# Step 2: Create App Service Plan
print_info "Step 2: Creating App Service Plan..."
PLAN_NAME="${RESOURCE_GROUP}-plan"
if az appservice plan show --name $PLAN_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    print_warning "App Service Plan already exists"
else
    az appservice plan create \
        --name $PLAN_NAME \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --is-linux \
        --sku B1
    print_success "App Service Plan created"
fi

# Step 3: Create Backend Web App
print_info "Step 3: Creating Backend Web App..."
if az webapp show --name $BACKEND_APP_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    print_warning "Backend Web App already exists"
else
    az webapp create \
        --name $BACKEND_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --plan $PLAN_NAME \
        --runtime "NODE:18-lts"
    print_success "Backend Web App created"
fi

# Step 4: Configure Backend App Settings
print_info "Step 4: Configuring Backend App Settings..."
print_warning "Please configure environment variables manually in Azure Portal"
print_info "Go to: https://portal.azure.com → $BACKEND_APP_NAME → Configuration"
print_info "Use the template from: server/.env.azure.template"

# Step 5: Deploy Backend Code
print_info "Step 5: Deploying Backend Code..."
print_info "Building backend..."
cd server
npm install --production
cd ..

print_info "Deploying to Azure..."
cd server
zip -r ../deploy.zip . -x "node_modules/*" -x ".env"
cd ..

az webapp deployment source config-zip \
    --resource-group $RESOURCE_GROUP \
    --name $BACKEND_APP_NAME \
    --src deploy.zip

rm deploy.zip
print_success "Backend deployed"

# Step 6: Create Frontend Static Web App
print_info "Step 6: Creating Frontend Static Web App..."
print_warning "Static Web Apps are best created through Azure Portal with GitHub integration"
print_info "Go to: https://portal.azure.com → Create Static Web App"
print_info "Connect your GitHub repository and configure:"
print_info "  - App location: /client"
print_info "  - Output location: build"
print_info "  - Build preset: React"

# Step 7: Build Frontend
print_info "Step 7: Building Frontend..."
cd client
print_warning "Make sure to set REACT_APP_API_URL in Azure Static Web App configuration"
print_info "Use the template from: client/.env.azure.template"
npm install
npm run build
cd ..
print_success "Frontend built successfully"

echo ""
print_success "Deployment script completed!"
echo ""
print_info "Next steps:"
echo "  1. Configure environment variables in Azure Portal"
echo "  2. Set up GitHub Actions for continuous deployment"
echo "  3. Configure custom domain (optional)"
echo "  4. Enable Application Insights for monitoring"
echo "  5. Test your application"
echo ""
print_info "Backend URL: https://$BACKEND_APP_NAME.azurewebsites.net"
print_info "Test API: https://$BACKEND_APP_NAME.azurewebsites.net/api/health"
echo ""
print_success "Deployment complete! 🎉"
