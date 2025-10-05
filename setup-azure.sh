#!/bin/bash

# Caper Sports - Azure Setup Script
# This script helps set up Azure services for the Caper Sports application

set -e

echo "🚀 Caper Sports - Azure Setup Script"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo -e "${RED}❌ Azure CLI is not installed${NC}"
    echo "Please install Azure CLI: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

echo -e "${GREEN}✅ Azure CLI is installed${NC}"

# Check if user is logged in
if ! az account show &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Azure${NC}"
    echo "Please login to Azure..."
    az login
fi

echo -e "${GREEN}✅ Logged in to Azure${NC}"

# Configuration
RESOURCE_GROUP="caper-sports-rg"
LOCATION="eastus"
COSMOS_ACCOUNT="caper-sports-cosmos"
STORAGE_ACCOUNT="capersportsstorage"
DATABASE_NAME="capersports"

echo -e "${BLUE}📋 Configuration:${NC}"
echo "   Resource Group: $RESOURCE_GROUP"
echo "   Location: $LOCATION"
echo "   Cosmos DB Account: $COSMOS_ACCOUNT"
echo "   Storage Account: $STORAGE_ACCOUNT"
echo "   Database Name: $DATABASE_NAME"
echo ""

read -p "Do you want to continue with this configuration? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Setup cancelled."
    exit 1
fi

echo -e "${BLUE}🔧 Step 1: Creating Resource Group${NC}"
if az group show --name $RESOURCE_GROUP &> /dev/null; then
    echo -e "${YELLOW}⚠️  Resource group $RESOURCE_GROUP already exists${NC}"
else
    az group create --name $RESOURCE_GROUP --location $LOCATION
    echo -e "${GREEN}✅ Created resource group: $RESOURCE_GROUP${NC}"
fi

echo -e "${BLUE}🔧 Step 2: Creating Azure Cosmos DB${NC}"
if az cosmosdb show --name $COSMOS_ACCOUNT --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${YELLOW}⚠️  Cosmos DB account $COSMOS_ACCOUNT already exists${NC}"
else
    echo "Creating Cosmos DB account (this may take a few minutes)..."
    az cosmosdb create \
        --resource-group $RESOURCE_GROUP \
        --name $COSMOS_ACCOUNT \
        --kind MongoDB \
        --server-version 4.2 \
        --default-consistency-level Eventual \
        --locations regionName=$LOCATION failoverPriority=0 isZoneRedundant=false
    echo -e "${GREEN}✅ Created Cosmos DB account: $COSMOS_ACCOUNT${NC}"
fi

echo -e "${BLUE}🔧 Step 3: Creating Cosmos DB Database${NC}"
az cosmosdb mongodb database create \
    --account-name $COSMOS_ACCOUNT \
    --resource-group $RESOURCE_GROUP \
    --name $DATABASE_NAME \
    --throughput 400 || echo -e "${YELLOW}⚠️  Database may already exist${NC}"

echo -e "${BLUE}🔧 Step 4: Creating Cosmos DB Collections${NC}"
# Create collections
collections=("users" "products" "orders")
for collection in "${collections[@]}"; do
    az cosmosdb mongodb collection create \
        --account-name $COSMOS_ACCOUNT \
        --resource-group $RESOURCE_GROUP \
        --database-name $DATABASE_NAME \
        --name $collection || echo -e "${YELLOW}⚠️  Collection $collection may already exist${NC}"
done

echo -e "${GREEN}✅ Created Cosmos DB collections${NC}"

echo -e "${BLUE}🔧 Step 5: Creating Azure Storage Account${NC}"
if az storage account show --name $STORAGE_ACCOUNT --resource-group $RESOURCE_GROUP &> /dev/null; then
    echo -e "${YELLOW}⚠️  Storage account $STORAGE_ACCOUNT already exists${NC}"
else
    az storage account create \
        --name $STORAGE_ACCOUNT \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --sku Standard_LRS \
        --kind StorageV2
    echo -e "${GREEN}✅ Created storage account: $STORAGE_ACCOUNT${NC}"
fi

echo -e "${BLUE}🔧 Step 6: Creating Blob Storage Containers${NC}"
# Get storage account key
STORAGE_KEY=$(az storage account keys list --resource-group $RESOURCE_GROUP --account-name $STORAGE_ACCOUNT --query '[0].value' -o tsv)

# Create containers
containers=("product-images" "user-avatars" "general-assets")
for container in "${containers[@]}"; do
    az storage container create \
        --name $container \
        --account-name $STORAGE_ACCOUNT \
        --account-key $STORAGE_KEY \
        --public-access blob || echo -e "${YELLOW}⚠️  Container $container may already exist${NC}"
done

echo -e "${GREEN}✅ Created blob storage containers${NC}"

echo -e "${BLUE}🔧 Step 7: Getting Connection Strings${NC}"

# Get Cosmos DB connection string
COSMOS_CONNECTION_STRING=$(az cosmosdb keys list --name $COSMOS_ACCOUNT --resource-group $RESOURCE_GROUP --type connection-strings --query 'connectionStrings[0].connectionString' -o tsv)

# Get Storage connection string
STORAGE_CONNECTION_STRING=$(az storage account show-connection-string --name $STORAGE_ACCOUNT --resource-group $RESOURCE_GROUP --query 'connectionString' -o tsv)

echo -e "${GREEN}✅ Retrieved connection strings${NC}"

echo -e "${BLUE}🔧 Step 8: Creating Environment Configuration${NC}"

# Create .env file
cat > .env.azure << EOF
# Azure Configuration - Generated by setup script
# Generated on: $(date)

# Azure Cosmos DB (MongoDB API)
AZURE_COSMOS_CONNECTION_STRING=$COSMOS_CONNECTION_STRING
AZURE_COSMOS_DATABASE_NAME=$DATABASE_NAME

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=$STORAGE_CONNECTION_STRING
AZURE_STORAGE_ACCOUNT_NAME=$STORAGE_ACCOUNT
AZURE_STORAGE_ACCOUNT_KEY=$STORAGE_KEY

# Azure Blob Storage Containers
AZURE_BLOB_CONTAINER_PRODUCTS=product-images
AZURE_BLOB_CONTAINER_USERS=user-avatars
AZURE_BLOB_CONTAINER_ASSETS=general-assets

# Server Configuration
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:3001

# JWT Configuration (CHANGE THESE IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random-$(date +%s)
JWT_EXPIRE=7d

# Security Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
CORS_ORIGIN=http://localhost:3001
EOF

echo -e "${GREEN}✅ Created .env.azure file${NC}"

echo ""
echo -e "${GREEN}🎉 Azure Setup Complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Copy .env.azure to .env (or rename it)"
echo "2. Update JWT_SECRET and other sensitive values"
echo "3. Install Azure dependencies:"
echo "   cd server && npm install @azure/storage-blob @azure/cosmos uuid"
echo "4. Test the Azure setup:"
echo "   npm run dev:azure"
echo "5. Migrate existing data (if any):"
echo "   npm run migrate:azure"
echo ""
echo -e "${BLUE}💰 Estimated Monthly Costs:${NC}"
echo "• Cosmos DB (400 RU/s): ~$25-30/month"
echo "• Blob Storage (10GB): ~$2-3/month"
echo "• Total: ~$27-33/month"
echo ""
echo -e "${BLUE}🔗 Azure Portal Links:${NC}"
echo "• Resource Group: https://portal.azure.com/#@/resource/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP"
echo "• Cosmos DB: https://portal.azure.com/#@/resource/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.DocumentDB/databaseAccounts/$COSMOS_ACCOUNT"
echo "• Storage Account: https://portal.azure.com/#@/resource/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Storage/storageAccounts/$STORAGE_ACCOUNT"
echo ""
echo -e "${GREEN}✨ Happy coding with Azure!${NC}"
