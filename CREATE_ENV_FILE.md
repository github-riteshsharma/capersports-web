# 📝 Create Your .env File

## Step 1: Create the .env file

In your `server` directory, create a file named `.env` with the following content:

```env
# ============================================================================
# AZURE SERVICES CONFIGURATION
# ============================================================================

# Azure Cosmos DB (MongoDB API)
# ⚠️  IMPORTANT: Your connection string is missing the password!
# Get the complete string from: Azure Portal → Cosmos DB → Connection strings
AZURE_COSMOS_CONNECTION_STRING=mongodb+srv://capersports:YOUR_PASSWORD_HERE@capersports-cosmos.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
AZURE_COSMOS_DATABASE_NAME=capersports

# Azure Blob Storage (these are correct)
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

NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:3001
JWT_SECRET=caper-sports-super-secret-jwt-key-for-production-make-it-even-longer-and-more-random-2024
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3001
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

## Step 2: Fix the Cosmos DB Connection String

**Problem**: Your connection string is missing the password after `capersports:`

**Solution**: 
1. Go to **Azure Portal**
2. Navigate to **Azure Cosmos DB** → **Your Account** (`capersports-cosmos`)
3. Left menu → **Connection strings**
4. Copy the **Primary Connection String** (it will have the actual password)
5. Replace the `AZURE_COSMOS_CONNECTION_STRING` value in your .env file

## Step 3: Enable Storage Public Access

**Problem**: Storage account doesn't allow public access for images

**Solution**:
1. Go to **Azure Portal**
2. Navigate to **Storage accounts** → **capersportsstorage**
3. Left menu → **Configuration**
4. Find **"Allow Blob public access"** → Change to **Enabled**
5. Click **Save**

## Step 4: Create Blob Containers

1. Go to **Azure Portal** → **Storage accounts** → **capersportsstorage**
2. Left menu → **Containers**
3. Click **+ Container** and create:
   - `product-images` with **Blob** public access
   - `user-avatars` with **Blob** public access  
   - `general-assets` with **Blob** public access

## Step 5: Test Your Setup

```bash
# Install dotenv if not already installed
npm install dotenv

# Run the Azure setup test
node setup-azure-services.js

# If successful, start your app with Azure
npm run dev:azure
```

## Expected Success Output

```
🚀 Setting up Azure Services for Caper Sports
✅ Connected to Cosmos DB successfully!
✅ Connected to Blob Storage successfully!
✅ All Azure services configured successfully!
```

## If You See Errors

- **Cosmos DB timeout**: Missing password in connection string
- **Public access not permitted**: Enable blob public access in storage settings
- **Container creation failed**: Create containers manually in Azure Portal

After creating the .env file and fixing the Azure Portal settings, run:
```bash
node setup-azure-services.js
```
