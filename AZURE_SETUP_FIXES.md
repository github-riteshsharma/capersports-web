# 🔧 Azure Configuration Fixes Required

## Issues Found in Your Setup

### ❌ Issue 1: Cosmos DB Connection String Missing Password
Your connection string: 
```
mongodb+srv://capersports:@capersports-cosmos.global.mongocluster.cosmos.azure.com/...
```

**Problem**: Missing password after `capersports:`

**Fix**: Get the complete connection string from Azure Portal:
1. Go to Azure Portal → Your Cosmos DB Account
2. Left menu → **Connection strings**
3. Copy the **Primary Connection String** (it should have a password)

### ❌ Issue 2: Storage Account Public Access Disabled
**Problem**: "Public access is not permitted on this storage account"

**Fix**: Enable public access in Azure Portal:
1. Go to Azure Portal → Your Storage Account (`capersportsstorage`)
2. Left menu → **Configuration**
3. Find **"Allow Blob public access"**
4. Change to **"Enabled"**
5. Click **"Save"**

### ❌ Issue 3: Missing Blob Containers
**Problem**: No containers exist yet

**Fix**: Create containers in Azure Portal:
1. Go to Azure Portal → Your Storage Account
2. Left menu → **Containers**
3. Click **"+ Container"** for each:
   - Name: `product-images`, Public access: **Blob**
   - Name: `user-avatars`, Public access: **Blob**  
   - Name: `general-assets`, Public access: **Blob**

## 🚀 Step-by-Step Fix Process

### Step 1: Fix Cosmos DB Connection String
1. **Azure Portal** → **Azure Cosmos DB** → **Your Account**
2. **Connection strings** → Copy **Primary Connection String**
3. It should look like:
   ```
   mongodb+srv://capersports:ACTUAL_PASSWORD_HERE@capersports-cosmos.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
   ```

### Step 2: Enable Storage Public Access
1. **Azure Portal** → **Storage accounts** → **capersportsstorage**
2. **Settings** → **Configuration**
3. **Allow Blob public access** → **Enabled**
4. **Save**

### Step 3: Create Blob Containers
1. **Azure Portal** → **Storage accounts** → **capersportsstorage**
2. **Data storage** → **Containers**
3. **+ Container** → Create each:

| Container Name | Public Access Level |
|----------------|-------------------|
| `product-images` | **Blob (anonymous read access for blobs only)** |
| `user-avatars` | **Blob (anonymous read access for blobs only)** |
| `general-assets` | **Blob (anonymous read access for blobs only)** |

### Step 4: Update Your .env File
Create a `.env` file in your `server` directory with:

```env
# Azure Cosmos DB (with correct password)
AZURE_COSMOS_CONNECTION_STRING=mongodb+srv://capersports:YOUR_ACTUAL_PASSWORD@capersports-cosmos.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
AZURE_COSMOS_DATABASE_NAME=capersports

# Azure Blob Storage (this is correct)
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=capersportsstorage;AccountKey=4UHK40ASN1RndIpQfg0ezrzVj6fkqPrFbvvWMaqVl8IKxEblbDQvCW4XA8FmN/txR6wom4YSY6wg+AStoNxhaQ==;EndpointSuffix=core.windows.net
AZURE_STORAGE_ACCOUNT_NAME=capersportsstorage
AZURE_STORAGE_ACCOUNT_KEY=4UHK40ASN1RndIpQfg0ezrzVj6fkqPrFbvvWMaqVl8IKxEblbDQvCW4XA8FmN/txR6wom4YSY6wg+AStoNxhaQ==

# Container names
AZURE_BLOB_CONTAINER_PRODUCTS=product-images
AZURE_BLOB_CONTAINER_USERS=user-avatars
AZURE_BLOB_CONTAINER_ASSETS=general-assets

# Application config
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:3001
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3001
```

### Step 5: Test Again
```bash
node test-azure-connections.js
```

## 🎯 Expected Results After Fixes

✅ **Cosmos DB**: Connected successfully  
✅ **Blob Storage**: Connected successfully  
✅ **Containers**: Created successfully  
✅ **File Upload**: Test file uploaded  

## 🔍 Troubleshooting

### If Cosmos DB Still Fails:
1. Check **Firewall and virtual networks** in Cosmos DB settings
2. Ensure **"Allow access from Azure Portal"** is enabled
3. Add **"Allow access from all networks"** temporarily for testing

### If Blob Storage Still Fails:
1. Verify **Access keys** are enabled in Storage Account settings
2. Check **Networking** → **Public network access** is **"Enabled from all networks"**

### If Containers Can't Be Created:
1. Ensure you have **Storage Blob Data Contributor** role
2. Try creating containers manually in Azure Portal first

## 📞 Need Help?

After making these changes, run the test again:
```bash
node test-azure-connections.js
```

If you still see errors, share the new error messages and I'll help you fix them!
