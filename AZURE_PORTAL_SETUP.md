# Azure Portal Setup Guide for Caper Sports

Complete step-by-step guide to set up Azure Cosmos DB and Blob Storage through the Azure Portal web interface.

## 🎯 Overview

This guide will help you set up:
- **Azure Cosmos DB** (with MongoDB API) for database storage
- **Azure Blob Storage** for image and file storage
- **Resource Group** to organize all resources

**Estimated Time**: 15-20 minutes  
**Estimated Cost**: $27-33/month

---

## 📋 Prerequisites

- [ ] Azure account with active subscription ([Create free account](https://azure.microsoft.com/free/))
- [ ] Access to [Azure Portal](https://portal.azure.com)

---

## 🚀 Step 1: Create Resource Group

A resource group is a container that holds related resources for your application.

### 1.1 Navigate to Resource Groups
1. Go to [Azure Portal](https://portal.azure.com)
2. Sign in with your Azure account
3. In the left sidebar, click **"Resource groups"**
4. Click **"+ Create"** button

![Resource Groups](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/media/manage-resource-groups-portal/manage-resource-groups-add-group.png)

### 1.2 Configure Resource Group
1. **Subscription**: Select your subscription
2. **Resource group name**: `caper-sports-rg`
3. **Region**: Choose a region close to you (e.g., `East US`, `West Europe`)
4. Click **"Review + create"**
5. Click **"Create"**

✅ **Result**: Resource group `caper-sports-rg` is created

---

## 🗄️ Step 2: Create Azure Cosmos DB

Cosmos DB will replace MongoDB for data storage.

### 2.1 Navigate to Cosmos DB
1. In Azure Portal, click **"+ Create a resource"**
2. Search for **"Azure Cosmos DB"**
3. Click **"Azure Cosmos DB"** from results
4. Click **"Create"**

### 2.2 Choose API
1. Select **"Azure Cosmos DB for MongoDB"**
2. Click **"Create"**

![Cosmos DB API Selection](https://docs.microsoft.com/en-us/azure/cosmos-db/media/create-cosmosdb-resources-portal/choose-api.png)

### 2.3 Configure Cosmos DB Account
**Basics Tab:**
1. **Subscription**: Select your subscription
2. **Resource Group**: Select `caper-sports-rg`
3. **Account Name**: `caper-sports-cosmos` (must be globally unique)
4. **Location**: Same as your resource group
5. **Capacity mode**: `Provisioned throughput`
6. **Apply Free Tier Discount**: `Apply` (if available)
7. **Limit total account throughput**: ✅ Check this box

**Global Distribution Tab:**
1. **Geo-Redundancy**: `Disable` (to save costs)
2. **Multi-region Writes**: `Disable`

**Networking Tab:**
1. **Connectivity method**: `All networks` (for development)
   - For production, choose "Selected networks" and add your IP

**Backup Policy Tab:**
1. **Backup Policy**: `Periodic` (default)

**Encryption Tab:**
1. Keep default settings

### 2.4 Create the Account
1. Click **"Review + create"**
2. Review your settings
3. Click **"Create"**

⏱️ **Wait**: This takes 5-10 minutes to complete

### 2.5 Create Database and Collections
After deployment completes:

1. Go to your Cosmos DB account
2. In the left menu, click **"Data Explorer"**
3. Click **"New Database"**
4. **Database id**: `capersports`
5. **Provision database throughput**: ✅ Check
6. **Throughput**: `400` RU/s (minimum for cost savings)
7. Click **"OK"**

**Create Collections:**
For each collection, click **"New Collection"**:

**Collection 1 - Users:**
- **Database id**: `capersports` (use existing)
- **Collection id**: `users`
- **Shard key**: `/email`
- Click **"OK"**

**Collection 2 - Products:**
- **Database id**: `capersports` (use existing)
- **Collection id**: `products`
- **Shard key**: `/category`
- Click **"OK"**

**Collection 3 - Orders:**
- **Database id**: `capersports` (use existing)
- **Collection id**: `orders`
- **Shard key**: `/user`
- Click **"OK"**

### 2.6 Get Connection String
1. In your Cosmos DB account, click **"Connection strings"** (left menu)
2. Copy the **"Primary Connection String"**
3. Save it securely - you'll need this for your application

✅ **Result**: Cosmos DB is ready with database and collections

---

## 📁 Step 3: Create Storage Account

Azure Storage will replace Cloudinary for image storage.

### 3.1 Navigate to Storage Accounts
1. In Azure Portal, click **"+ Create a resource"**
2. Search for **"Storage account"**
3. Click **"Storage account"** from results
4. Click **"Create"**

### 3.2 Configure Storage Account
**Basics Tab:**
1. **Subscription**: Select your subscription
2. **Resource group**: Select `caper-sports-rg`
3. **Storage account name**: `capersportsstorage` (must be globally unique, lowercase only)
4. **Region**: Same as your resource group
5. **Performance**: `Standard`
6. **Redundancy**: `Locally-redundant storage (LRS)` (cost-effective)

**Advanced Tab:**
1. **Security**: Keep defaults
2. **Blob access tier**: `Hot` (for frequently accessed images)

**Networking Tab:**
1. **Network connectivity**: `Enable public access from all networks`

**Data protection Tab:**
1. Keep defaults (you can disable some features to save costs)

**Encryption Tab:**
1. Keep defaults

### 3.3 Create Storage Account
1. Click **"Review + create"**
2. Review settings
3. Click **"Create"**

⏱️ **Wait**: This takes 2-3 minutes to complete

### 3.4 Create Blob Containers
After deployment completes:

1. Go to your Storage Account
2. In the left menu, click **"Containers"**
3. Click **"+ Container"** to create each container:

**Container 1 - Product Images:**
- **Name**: `product-images`
- **Public access level**: `Blob (anonymous read access for blobs only)`
- Click **"Create"**

**Container 2 - User Avatars:**
- **Name**: `user-avatars`
- **Public access level**: `Blob (anonymous read access for blobs only)`
- Click **"Create"**

**Container 3 - General Assets:**
- **Name**: `general-assets`
- **Public access level**: `Blob (anonymous read access for blobs only)`
- Click **"Create"**

### 3.5 Get Storage Connection String
1. In your Storage Account, click **"Access keys"** (left menu)
2. Under **"key1"**, click **"Show"** next to Connection string
3. Copy the **"Connection string"**
4. Save it securely - you'll need this for your application

✅ **Result**: Storage account is ready with containers

---

## ⚙️ Step 4: Configure Your Application

### 4.1 Install Azure Dependencies
```bash
cd server
npm install @azure/storage-blob @azure/cosmos uuid
```

### 4.2 Update Environment Variables
Create or update your `.env` file in the `server` directory:

```env
# Azure Cosmos DB (MongoDB API)
AZURE_COSMOS_CONNECTION_STRING=mongodb://caper-sports-cosmos:YOUR_KEY@caper-sports-cosmos.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@caper-sports-cosmos@
AZURE_COSMOS_DATABASE_NAME=capersports

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=capersportsstorage;AccountKey=YOUR_KEY;EndpointSuffix=core.windows.net
AZURE_STORAGE_ACCOUNT_NAME=capersportsstorage
AZURE_STORAGE_ACCOUNT_KEY=YOUR_STORAGE_KEY

# Azure Blob Storage Containers
AZURE_BLOB_CONTAINER_PRODUCTS=product-images
AZURE_BLOB_CONTAINER_USERS=user-avatars
AZURE_BLOB_CONTAINER_ASSETS=general-assets

# Server Configuration
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:3001

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random
JWT_EXPIRE=7d
```

**Important**: Replace the connection strings with the actual values you copied from Azure Portal.

### 4.3 Start Your Application
```bash
# Start with Azure services
npm run dev:azure

# Or migrate existing data first
npm run migrate:azure
npm run dev:azure
```

---

## 🔍 Step 5: Verify Setup

### 5.1 Test Cosmos DB Connection
1. In Azure Portal, go to your Cosmos DB account
2. Click **"Data Explorer"**
3. Expand `capersports` database
4. You should see your collections: `users`, `products`, `orders`

### 5.2 Test Blob Storage
1. In Azure Portal, go to your Storage Account
2. Click **"Containers"**
3. You should see: `product-images`, `user-avatars`, `general-assets`

### 5.3 Test Application
1. Start your application: `npm run dev:azure`
2. Check the console for: "✅ Connected to Azure Cosmos DB"
3. Visit your health endpoint: `http://localhost:5001/api/health`
4. Should show Azure services as healthy

---

## 💰 Cost Management

### Monitor Costs
1. In Azure Portal, search for **"Cost Management + Billing"**
2. Click **"Cost analysis"**
3. Filter by Resource Group: `caper-sports-rg`
4. Set up budget alerts if needed

### Expected Monthly Costs
- **Cosmos DB** (400 RU/s): ~$25-30/month
- **Blob Storage** (10GB): ~$2-3/month
- **Total**: ~$27-33/month

### Cost Optimization Tips
1. **Cosmos DB**: Use shared throughput at database level
2. **Storage**: Use Cool tier for infrequently accessed data
3. **Monitoring**: Set up cost alerts at $40/month
4. **Cleanup**: Delete unused resources regularly

---

## 🔧 Troubleshooting

### Common Issues

**Connection String Format:**
- Cosmos DB: Must start with `mongodb://`
- Storage: Must start with `DefaultEndpointsProtocol=https`

**Firewall Issues:**
- Cosmos DB: Check "Firewall and virtual networks" settings
- Storage: Check "Networking" settings

**Permission Issues:**
- Ensure containers have correct public access level
- Check storage account access keys are enabled

### Getting Help
1. **Azure Portal**: Use the "Help + support" option
2. **Documentation**: [Azure Cosmos DB Docs](https://docs.microsoft.com/en-us/azure/cosmos-db/)
3. **Community**: [Azure Community Support](https://azure.microsoft.com/en-us/support/community/)

---

## ✅ Next Steps

After completing this setup:

1. **Test thoroughly** with your application
2. **Migrate existing data** using `npm run migrate:azure`
3. **Set up monitoring** and alerts
4. **Configure backup policies** for production
5. **Implement security best practices** for production deployment

Your Azure services are now ready to replace MongoDB and Cloudinary! 🎉

---

## 📞 Support

If you need help with this setup:
- Check the troubleshooting section above
- Refer to the main README.md for additional information
- Use Azure Portal's built-in help system
