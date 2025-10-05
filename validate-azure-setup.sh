#!/bin/bash

# Azure Portal Setup Validator
# This script helps validate your Azure setup after completing the portal configuration

echo "🔍 Azure Portal Setup Validator"
echo "==============================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}This script will help you validate your Azure Portal setup${NC}"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo "Please create a .env file with your Azure connection strings"
    echo ""
    echo "Required variables:"
    echo "- AZURE_COSMOS_CONNECTION_STRING"
    echo "- AZURE_STORAGE_CONNECTION_STRING"
    echo "- AZURE_COSMOS_DATABASE_NAME"
    echo "- AZURE_STORAGE_ACCOUNT_NAME"
    echo ""
    echo "See AZURE_PORTAL_SETUP.md for detailed instructions"
    exit 1
fi

echo -e "${GREEN}✅ .env file found${NC}"

# Load environment variables
source .env

# Check Cosmos DB connection string
if [ -z "$AZURE_COSMOS_CONNECTION_STRING" ]; then
    echo -e "${RED}❌ AZURE_COSMOS_CONNECTION_STRING not set${NC}"
    echo "Get this from: Azure Portal → Your Cosmos DB → Connection strings"
    exit 1
else
    echo -e "${GREEN}✅ Cosmos DB connection string configured${NC}"
fi

# Check Storage connection string
if [ -z "$AZURE_STORAGE_CONNECTION_STRING" ]; then
    echo -e "${RED}❌ AZURE_STORAGE_CONNECTION_STRING not set${NC}"
    echo "Get this from: Azure Portal → Your Storage Account → Access keys"
    exit 1
else
    echo -e "${GREEN}✅ Storage connection string configured${NC}"
fi

# Check database name
if [ -z "$AZURE_COSMOS_DATABASE_NAME" ]; then
    echo -e "${YELLOW}⚠️  AZURE_COSMOS_DATABASE_NAME not set, using default: capersports${NC}"
else
    echo -e "${GREEN}✅ Database name configured: $AZURE_COSMOS_DATABASE_NAME${NC}"
fi

# Check storage account name
if [ -z "$AZURE_STORAGE_ACCOUNT_NAME" ]; then
    echo -e "${YELLOW}⚠️  AZURE_STORAGE_ACCOUNT_NAME not set${NC}"
else
    echo -e "${GREEN}✅ Storage account name configured: $AZURE_STORAGE_ACCOUNT_NAME${NC}"
fi

echo ""
echo -e "${BLUE}🔧 Checking Azure dependencies...${NC}"

# Check if Azure packages are installed
if [ -f "server/package.json" ]; then
    cd server
    if npm list @azure/storage-blob > /dev/null 2>&1; then
        echo -e "${GREEN}✅ @azure/storage-blob installed${NC}"
    else
        echo -e "${RED}❌ @azure/storage-blob not installed${NC}"
        echo "Run: cd server && npm install @azure/storage-blob"
        exit 1
    fi

    if npm list @azure/cosmos > /dev/null 2>&1; then
        echo -e "${GREEN}✅ @azure/cosmos installed${NC}"
    else
        echo -e "${RED}❌ @azure/cosmos not installed${NC}"
        echo "Run: cd server && npm install @azure/cosmos"
        exit 1
    fi

    if npm list uuid > /dev/null 2>&1; then
        echo -e "${GREEN}✅ uuid installed${NC}"
    else
        echo -e "${RED}❌ uuid not installed${NC}"
        echo "Run: cd server && npm install uuid"
        exit 1
    fi
    cd ..
else
    echo -e "${RED}❌ server/package.json not found${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🧪 Testing Azure connections...${NC}"

# Test if server can start with Azure configuration
if [ -f "server/server-azure.js" ]; then
    echo "Testing Azure server startup..."
    cd server
    timeout 10s node -e "
        require('dotenv').config();
        const AzureCosmosService = require('./services/azureCosmosService');
        const AzureBlobService = require('./services/azureBlobService');
        
        async function test() {
            try {
                console.log('Testing Cosmos DB connection...');
                const cosmosService = new AzureCosmosService();
                const health = await cosmosService.healthCheck();
                console.log('✅ Cosmos DB:', health.status);
                
                console.log('Testing Blob Storage...');
                const blobService = new AzureBlobService();
                await blobService.initializeContainers();
                console.log('✅ Blob Storage: containers initialized');
                
                process.exit(0);
            } catch (error) {
                console.error('❌ Connection test failed:', error.message);
                process.exit(1);
            }
        }
        
        test();
    " 2>/dev/null

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Azure connections working${NC}"
    else
        echo -e "${RED}❌ Azure connection test failed${NC}"
        echo ""
        echo "Common issues:"
        echo "1. Check connection strings are correct"
        echo "2. Ensure Cosmos DB allows all networks (Firewall settings)"
        echo "3. Verify storage account access keys are enabled"
        echo ""
        echo "Debug by running: npm run dev:azure"
    fi
    cd ..
else
    echo -e "${RED}❌ server-azure.js not found${NC}"
    echo "Please ensure all Azure service files are in place"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Azure Portal Setup Validation Complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Start your application: cd server && npm run dev:azure"
echo "2. Test the health endpoint: http://localhost:5001/api/health"
echo "3. Check Azure Portal for resource usage"
echo "4. Set up cost monitoring and alerts"
echo ""
echo -e "${BLUE}📊 Monitor Your Setup:${NC}"
echo "• Azure Portal → Cost Management + Billing"
echo "• Azure Portal → Your Resource Group → Overview"
echo "• Application logs for connection status"
echo ""
echo -e "${GREEN}✨ Your Azure migration is ready!${NC}"
