#!/bin/bash

# Azure Environment Setup Script
# This script helps you create the correct .env file for Azure integration

echo "🔧 Azure Environment Configuration Helper"
echo "========================================"

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Creating backup..."
    cp .env .env.backup.$(date +%s)
    echo "✅ Backup created"
fi

echo "📝 Creating .env file with Azure configuration..."

# Prompt for Cosmos DB password
echo ""
echo "🔑 Your Cosmos DB connection string is missing the password."
echo "Please get the complete Primary Connection String from:"
echo "Azure Portal → Your Cosmos DB → Connection strings"
echo ""
read -p "Enter your complete Cosmos DB connection string: " COSMOS_CONNECTION_STRING

# Create .env file
cat > .env << EOF
# ============================================================================
# AZURE SERVICES CONFIGURATION
# ============================================================================

# Azure Cosmos DB (MongoDB API)
AZURE_COSMOS_CONNECTION_STRING=$COSMOS_CONNECTION_STRING
AZURE_COSMOS_DATABASE_NAME=capersports

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=capersportsstorage;AccountKey=4UHK40ASN1RndIpQfg0ezrzVj6fkqPrFbvvWMaqVl8IKxEblbDQvCW4XA8FmN/txR6wom4YSY6wg+AStoNxhaQ==;EndpointSuffix=core.windows.net
AZURE_STORAGE_ACCOUNT_NAME=capersportsstorage
AZURE_STORAGE_ACCOUNT_KEY=4UHK40ASN1RndIpQfg0ezrzVj6fkqPrFbvvWMaqVl8IKxEblbDQvCW4XA8FmN/txR6wom4YSY6wg+AStoNxhaQ==

# Azure Blob Storage Containers
AZURE_BLOB_CONTAINER_PRODUCTS=product-images
AZURE_BLOB_CONTAINER_USERS=user-avatars
AZURE_BLOB_CONTAINER_ASSETS=general-assets

# ============================================================================
# APPLICATION CONFIGURATION
# ============================================================================

# Environment
NODE_ENV=development

# Server
PORT=5001
FRONTEND_URL=http://localhost:3001

# Security
JWT_SECRET=caper-sports-super-secret-jwt-key-for-production-make-it-even-longer-and-more-random-$(date +%s)
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

EOF

echo "✅ .env file created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Fix Azure Portal settings (see AZURE_SETUP_FIXES.md)"
echo "2. Test connections: node test-azure-connections.js"
echo "3. Start your app: npm run dev:azure"
echo ""
echo "🔍 To verify your .env file:"
echo "cat .env"
