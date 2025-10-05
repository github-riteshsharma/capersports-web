# Azure Migration Guide: MongoDB to Azure Cosmos DB + Blob Storage

## 🎯 Migration Overview

This guide covers migrating from MongoDB Atlas + Cloudinary to Azure Cosmos DB + Azure Blob Storage.

### Architecture Changes
- **Database**: MongoDB Atlas → Azure Cosmos DB (MongoDB API)
- **Images**: Cloudinary → Azure Blob Storage
- **Benefits**: Unified Azure ecosystem, cost optimization, better integration

## 🔧 Step 1: Azure Services Setup

### 1.1 Azure Cosmos DB Setup
```bash
# Create resource group
az group create --name caper-sports-rg --location eastus

# Create Cosmos DB account with MongoDB API
az cosmosdb create \
  --resource-group caper-sports-rg \
  --name caper-sports-cosmos \
  --kind MongoDB \
  --server-version 4.2 \
  --default-consistency-level Eventual \
  --locations regionName=eastus failoverPriority=0 isZoneRedundant=false

# Create database
az cosmosdb mongodb database create \
  --account-name caper-sports-cosmos \
  --resource-group caper-sports-rg \
  --name capersports

# Create collections
az cosmosdb mongodb collection create \
  --account-name caper-sports-cosmos \
  --resource-group caper-sports-rg \
  --database-name capersports \
  --name users

az cosmosdb mongodb collection create \
  --account-name caper-sports-cosmos \
  --resource-group caper-sports-rg \
  --database-name capersports \
  --name products

az cosmosdb mongodb collection create \
  --account-name caper-sports-cosmos \
  --resource-group caper-sports-rg \
  --database-name capersports \
  --name orders
```

### 1.2 Azure Blob Storage Setup
```bash
# Create storage account
az storage account create \
  --name capersportsstorage \
  --resource-group caper-sports-rg \
  --location eastus \
  --sku Standard_LRS \
  --kind StorageV2

# Create containers
az storage container create \
  --name product-images \
  --account-name capersportsstorage \
  --public-access blob

az storage container create \
  --name user-avatars \
  --account-name capersportsstorage \
  --public-access blob

az storage container create \
  --name general-assets \
  --account-name capersportsstorage \
  --public-access blob
```

## 🔑 Step 2: Get Connection Strings

### 2.1 Cosmos DB Connection String
```bash
az cosmosdb keys list \
  --name caper-sports-cosmos \
  --resource-group caper-sports-rg \
  --type connection-strings
```

### 2.2 Blob Storage Connection String
```bash
az storage account show-connection-string \
  --name capersportsstorage \
  --resource-group caper-sports-rg
```

## 📝 Step 3: Environment Variables

Add to `.env`:
```env
# Azure Cosmos DB (MongoDB API)
AZURE_COSMOS_CONNECTION_STRING=mongodb://caper-sports-cosmos:...
AZURE_COSMOS_DATABASE_NAME=capersports

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=capersportsstorage;...
AZURE_STORAGE_ACCOUNT_NAME=capersportsstorage
AZURE_STORAGE_ACCOUNT_KEY=...

# Container names
AZURE_BLOB_CONTAINER_PRODUCTS=product-images
AZURE_BLOB_CONTAINER_USERS=user-avatars
AZURE_BLOB_CONTAINER_ASSETS=general-assets
```

## 📦 Step 4: Install Azure SDKs

```bash
npm install @azure/storage-blob @azure/cosmos
```

## 🔄 Step 5: Data Migration Process

1. **Export existing MongoDB data**
2. **Transform data for Cosmos DB**
3. **Upload images to Azure Blob Storage**
4. **Update image URLs in data**
5. **Import data to Cosmos DB**
6. **Update application code**
7. **Test and validate**

## 💰 Cost Considerations

### Cosmos DB Pricing
- **Request Units (RU/s)**: Pay per throughput
- **Storage**: Pay per GB stored
- **Estimated**: $25-50/month for small-medium apps

### Blob Storage Pricing
- **Hot tier**: $0.0184/GB/month
- **Bandwidth**: $0.087/GB egress
- **Estimated**: $5-15/month for image storage

### Total Estimated Savings
- **Current**: MongoDB Atlas + Cloudinary ≈ $50-100/month
- **Azure**: Cosmos DB + Blob Storage ≈ $30-65/month
- **Savings**: 20-40% cost reduction

## 🚀 Benefits of Azure Migration

### Performance
- **Global distribution** with Cosmos DB
- **CDN integration** for blob storage
- **Low latency** worldwide

### Integration
- **Unified Azure ecosystem**
- **Single billing and management**
- **Azure AD integration**

### Scalability
- **Automatic scaling** with Cosmos DB
- **Unlimited blob storage**
- **Pay-as-you-grow** model

## ⚠️ Migration Considerations

### Data Consistency
- **MongoDB API compatibility** ensures smooth transition
- **Document structure** remains the same
- **Indexes** need to be recreated

### Image Migration
- **Bulk upload** to blob storage
- **URL transformation** required
- **CDN setup** for performance

### Testing Strategy
- **Parallel environments** during migration
- **Data validation** scripts
- **Performance testing**
- **Rollback plan** if needed
