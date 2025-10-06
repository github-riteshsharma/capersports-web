#!/bin/bash

# Azure Environment Variables Fix Script
# This script retrieves and sets the correct environment variables for Azure App Service

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration - UPDATE THESE VALUES
APP_NAME="${AZURE_APP_NAME:-capersports-web}"
RESOURCE_GROUP="${AZURE_RESOURCE_GROUP:-caper-sports-rg}"
COSMOS_ACCOUNT="${AZURE_COSMOS_ACCOUNT:-capersports-cosmos}"
STORAGE_ACCOUNT="${AZURE_STORAGE_ACCOUNT:-capersportsstorage}"
DATABASE_NAME="${AZURE_DATABASE_NAME:-capersports}"

echo -e "${BLUE}🔧 Azure Environment Variables Fix Script${NC}"
echo "=========================================="
echo ""
echo "Configuration:"
echo "  App Service: $APP_NAME"
echo "  Resource Group: $RESOURCE_GROUP"
echo "  Cosmos DB: $COSMOS_ACCOUNT"
echo "  Storage Account: $STORAGE_ACCOUNT"
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI is not installed${NC}"
    echo "Install it from: https://docs.microsoft.com/cli/azure/install-azure-cli"
    exit 1
fi

# Check if logged in
echo -e "${BLUE}🔐 Checking Azure login...${NC}"
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Azure${NC}"
    echo "Logging in..."
    az login
fi

echo -e "${GREEN}✅ Logged in to Azure${NC}"
echo ""

# Get current subscription
SUBSCRIPTION=$(az account show --query name -o tsv)
echo -e "${BLUE}📋 Using subscription: $SUBSCRIPTION${NC}"
echo ""

# Check if resource group exists
echo -e "${BLUE}🔍 Checking resource group...${NC}"
if ! az group show --name $RESOURCE_GROUP &> /dev/null; then
    echo -e "${RED}❌ Resource group '$RESOURCE_GROUP' not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Resource group exists${NC}"

# Check if Cosmos DB exists
echo -e "${BLUE}🔍 Checking Cosmos DB account...${NC}"
if ! az cosmosdb show --name $COSMOS_ACCOUNT --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${RED}❌ Cosmos DB account '$COSMOS_ACCOUNT' not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Cosmos DB account exists${NC}"

# Check if Storage Account exists
echo -e "${BLUE}🔍 Checking Storage account...${NC}"
if ! az storage account show --name $STORAGE_ACCOUNT --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${RED}❌ Storage account '$STORAGE_ACCOUNT' not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Storage account exists${NC}"

# Check if App Service exists
echo -e "${BLUE}🔍 Checking App Service...${NC}"
if ! az webapp show --name $APP_NAME --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${RED}❌ App Service '$APP_NAME' not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ App Service exists${NC}"
echo ""

# Get Cosmos DB connection string
echo -e "${BLUE}📡 Retrieving Cosmos DB connection string...${NC}"
COSMOS_CONN=$(az cosmosdb keys list \
  --name $COSMOS_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --type connection-strings \
  --query 'connectionStrings[0].connectionString' \
  -o tsv)

if [ -z "$COSMOS_CONN" ]; then
    echo -e "${RED}❌ Failed to get Cosmos DB connection string${NC}"
    exit 1
fi

# Validate connection string format
if [[ ! "$COSMOS_CONN" =~ ^mongodb ]]; then
    echo -e "${RED}❌ Invalid connection string format (doesn't start with 'mongodb')${NC}"
    echo "Connection string: ${COSMOS_CONN:0:50}..."
    exit 1
fi

echo -e "${GREEN}✅ Retrieved Cosmos DB connection string (${#COSMOS_CONN} characters)${NC}"
echo "   Host: $(echo $COSMOS_CONN | grep -oP '(?<=@)[^/]+' || echo 'N/A')"

# Get Storage connection string
echo -e "${BLUE}📡 Retrieving Storage connection string...${NC}"
STORAGE_CONN=$(az storage account show-connection-string \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --query 'connectionString' \
  -o tsv)

if [ -z "$STORAGE_CONN" ]; then
    echo -e "${RED}❌ Failed to get Storage connection string${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Retrieved Storage connection string${NC}"
echo ""

# Get Storage account key
echo -e "${BLUE}🔑 Retrieving Storage account key...${NC}"
STORAGE_KEY=$(az storage account keys list \
  --resource-group $RESOURCE_GROUP \
  --account-name $STORAGE_ACCOUNT \
  --query '[0].value' \
  -o tsv)

if [ -z "$STORAGE_KEY" ]; then
    echo -e "${RED}❌ Failed to get Storage account key${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Retrieved Storage account key${NC}"
echo ""

# Prompt for JWT secret
echo -e "${YELLOW}🔐 JWT Secret Configuration${NC}"
echo "Current JWT_SECRET will be updated. Press Enter to generate a random one,"
echo "or type your own secret (minimum 32 characters):"
read -r JWT_INPUT

if [ -z "$JWT_INPUT" ]; then
    JWT_SECRET="caper-sports-jwt-$(openssl rand -hex 32)-$(date +%s)"
    echo -e "${GREEN}✅ Generated random JWT secret${NC}"
else
    if [ ${#JWT_INPUT} -lt 32 ]; then
        echo -e "${YELLOW}⚠️  Warning: JWT secret is shorter than recommended (32 characters)${NC}"
    fi
    JWT_SECRET="$JWT_INPUT"
fi
echo ""

# Prompt for Frontend URL
echo -e "${YELLOW}🌐 Frontend URL Configuration${NC}"
echo "Enter your frontend URL (e.g., https://your-app.azurestaticapps.net):"
read -r FRONTEND_INPUT

if [ -z "$FRONTEND_INPUT" ]; then
    FRONTEND_URL="https://${APP_NAME}.azurewebsites.net"
    echo -e "${YELLOW}⚠️  Using default: $FRONTEND_URL${NC}"
else
    FRONTEND_URL="$FRONTEND_INPUT"
fi
echo ""

# Set environment variables
echo -e "${BLUE}⚙️  Setting environment variables in App Service...${NC}"
az webapp config appsettings set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings \
    AZURE_COSMOS_CONNECTION_STRING="$COSMOS_CONN" \
    AZURE_COSMOS_DATABASE_NAME="$DATABASE_NAME" \
    AZURE_STORAGE_CONNECTION_STRING="$STORAGE_CONN" \
    AZURE_STORAGE_ACCOUNT_NAME="$STORAGE_ACCOUNT" \
    AZURE_STORAGE_ACCOUNT_KEY="$STORAGE_KEY" \
    AZURE_BLOB_CONTAINER_PRODUCTS="product-images" \
    AZURE_BLOB_CONTAINER_USERS="user-avatars" \
    AZURE_BLOB_CONTAINER_ASSETS="general-assets" \
    NODE_ENV="production" \
    PORT="8080" \
    JWT_SECRET="$JWT_SECRET" \
    JWT_EXPIRE="7d" \
    FRONTEND_URL="$FRONTEND_URL" \
    CORS_ORIGIN="$FRONTEND_URL" \
    RATE_LIMIT_WINDOW_MS="900000" \
    RATE_LIMIT_MAX_REQUESTS="1000" \
  --output none

echo -e "${GREEN}✅ Environment variables set successfully${NC}"
echo ""

# Verify settings
echo -e "${BLUE}🔍 Verifying configuration...${NC}"
VERIFY_COSMOS=$(az webapp config appsettings list \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query "[?name=='AZURE_COSMOS_CONNECTION_STRING'].value" \
  -o tsv)

if [ -z "$VERIFY_COSMOS" ]; then
    echo -e "${RED}❌ Failed to verify AZURE_COSMOS_CONNECTION_STRING${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Configuration verified${NC}"
echo "   AZURE_COSMOS_CONNECTION_STRING: SET (${#VERIFY_COSMOS} characters)"
echo ""

# Restart app service
echo -e "${BLUE}🔄 Restarting App Service...${NC}"
az webapp restart --name $APP_NAME --resource-group $RESOURCE_GROUP --output none

echo -e "${GREEN}✅ App Service restarted${NC}"
echo ""

# Summary
echo -e "${GREEN}=========================================="
echo "🎉 Configuration Complete!"
echo "==========================================${NC}"
echo ""
echo "Environment variables set:"
echo "  ✅ AZURE_COSMOS_CONNECTION_STRING"
echo "  ✅ AZURE_COSMOS_DATABASE_NAME"
echo "  ✅ AZURE_STORAGE_CONNECTION_STRING"
echo "  ✅ AZURE_STORAGE_ACCOUNT_NAME"
echo "  ✅ AZURE_STORAGE_ACCOUNT_KEY"
echo "  ✅ Container names (products, users, assets)"
echo "  ✅ NODE_ENV, PORT, JWT_SECRET"
echo "  ✅ FRONTEND_URL, CORS_ORIGIN"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo ""
echo "1. Check application logs (wait 30 seconds for restart):"
echo -e "   ${YELLOW}az webapp log tail --name $APP_NAME --resource-group $RESOURCE_GROUP${NC}"
echo ""
echo "2. Test health endpoint:"
echo -e "   ${YELLOW}curl https://${APP_NAME}.azurewebsites.net/api/health${NC}"
echo ""
echo "3. View in Azure Portal:"
echo -e "   ${YELLOW}https://portal.azure.com/#@/resource/subscriptions/.../resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Web/sites/$APP_NAME${NC}"
echo ""
echo -e "${GREEN}✨ Your application should now be running successfully!${NC}"
