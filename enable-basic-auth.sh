#!/bin/bash

# Enable Basic Auth for Azure App Service Deployments
# This fixes the 403 error when deploying to Azure

set -e

echo "🔧 Enabling Basic Auth for Azure App Service"
echo "============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Configuration
RESOURCE_GROUP="${AZURE_RESOURCE_GROUP:-capersports-rg}"
APP_NAME="${AZURE_APP_NAME:-capersports-api}"

print_info "Resource Group: $RESOURCE_GROUP"
print_info "App Service: $APP_NAME"
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    print_error "Azure CLI not installed"
    exit 1
fi

# Check if logged in
if ! az account show &> /dev/null; then
    print_error "Not logged in to Azure"
    echo "Run: az login"
    exit 1
fi

print_success "Logged in to Azure"
echo ""

# Enable SCM Basic Auth
print_info "Enabling SCM Basic Auth..."
az resource update \
  --resource-group $RESOURCE_GROUP \
  --name scm \
  --resource-type basicPublishingCredentialsPolicies \
  --parent sites/$APP_NAME \
  --set properties.allow=true \
  --output none

print_success "SCM Basic Auth enabled"

# Enable FTP Basic Auth
print_info "Enabling FTP Basic Auth..."
az resource update \
  --resource-group $RESOURCE_GROUP \
  --name ftp \
  --resource-type basicPublishingCredentialsPolicies \
  --parent sites/$APP_NAME \
  --set properties.allow=true \
  --output none

print_success "FTP Basic Auth enabled"

echo ""
print_success "Basic Auth enabled successfully!"
echo ""
print_info "You can now deploy to your App Service"
print_info "Try deploying again with GitHub Actions or Azure CLI"
echo ""
