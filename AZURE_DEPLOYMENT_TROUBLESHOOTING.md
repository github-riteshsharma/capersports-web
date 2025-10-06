# Azure Deployment Troubleshooting Guide

## 🚨 Common Error: "URI must include hostname, domain name, and tld"

This error occurs when the Azure Cosmos DB connection string is missing or malformed.

### Root Causes

1. **Environment variable not set in Azure App Service**
2. **Connection string is incomplete or malformed**
3. **Connection string contains only the account name without full URI**
4. **Whitespace or encoding issues in the connection string**

---

## ✅ Solution: Fix Azure App Service Configuration

### Step 1: Get the Correct Connection String

1. Go to **Azure Portal** (https://portal.azure.com)
2. Navigate to your **Cosmos DB account** (e.g., `capersports-cosmos`)
3. In the left menu, click **"Connection strings"** (under Settings)
4. Copy the **"Primary Connection String"**

The connection string should look like one of these formats:

**Format 1 (Standard MongoDB):**
```
mongodb://account-name:BASE64_KEY@account-name.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@account-name@
```

**Format 2 (MongoDB+srv):**
```
mongodb+srv://account-name:PASSWORD@account-name.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
```

### Step 2: Set Environment Variables in Azure App Service

#### Option A: Using Azure Portal (Recommended)

1. Go to **Azure Portal**
2. Navigate to your **App Service** (e.g., `capersports-web`)
3. In the left menu, click **"Configuration"** (under Settings)
4. Click **"+ New application setting"**
5. Add the following settings:

| Name | Value | Example |
|------|-------|---------|
| `AZURE_COSMOS_CONNECTION_STRING` | Your full connection string from Step 1 | `mongodb://capersports:abc123...@capersports.mongo.cosmos.azure.com:10255/?ssl=true...` |
| `AZURE_COSMOS_DATABASE_NAME` | `capersports` | `capersports` |
| `AZURE_STORAGE_CONNECTION_STRING` | Your storage connection string | `DefaultEndpointsProtocol=https;AccountName=...` |
| `AZURE_STORAGE_ACCOUNT_NAME` | Your storage account name | `capersportsstorage` |
| `NODE_ENV` | `production` | `production` |
| `JWT_SECRET` | Your JWT secret | `your-long-random-secret-key` |
| `FRONTEND_URL` | Your frontend URL | `https://your-app.azurestaticapps.net` |

6. Click **"Save"** at the top
7. Click **"Continue"** to confirm restart

#### Option B: Using Azure CLI

```bash
# Set your app service name and resource group
APP_NAME="capersports-web"
RESOURCE_GROUP="caper-sports-rg"

# Get Cosmos DB connection string
COSMOS_CONN=$(az cosmosdb keys list \
  --name capersports-cosmos \
  --resource-group $RESOURCE_GROUP \
  --type connection-strings \
  --query 'connectionStrings[0].connectionString' \
  -o tsv)

# Get Storage connection string
STORAGE_CONN=$(az storage account show-connection-string \
  --name capersportsstorage \
  --resource-group $RESOURCE_GROUP \
  --query 'connectionString' \
  -o tsv)

# Set environment variables
az webapp config appsettings set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings \
    AZURE_COSMOS_CONNECTION_STRING="$COSMOS_CONN" \
    AZURE_COSMOS_DATABASE_NAME="capersports" \
    AZURE_STORAGE_CONNECTION_STRING="$STORAGE_CONN" \
    AZURE_STORAGE_ACCOUNT_NAME="capersportsstorage" \
    NODE_ENV="production" \
    JWT_SECRET="your-super-secret-jwt-key" \
    FRONTEND_URL="https://your-app.azurestaticapps.net"
```

### Step 3: Restart Your App Service

```bash
az webapp restart --name $APP_NAME --resource-group $RESOURCE_GROUP
```

Or in Azure Portal:
1. Go to your App Service
2. Click **"Restart"** at the top

---

## 🔍 Verification

### Check Application Logs

```bash
# Stream logs in real-time
az webapp log tail --name $APP_NAME --resource-group $RESOURCE_GROUP

# Or download logs
az webapp log download --name $APP_NAME --resource-group $RESOURCE_GROUP
```

In Azure Portal:
1. Go to your App Service
2. Click **"Log stream"** (under Monitoring)
3. Look for these messages:
   - ✅ `Connection string validation passed for host: ...`
   - ✅ `Connected to Azure Cosmos DB`
   - ✅ `Azure services initialized successfully`

### Test Health Endpoint

```bash
curl https://your-app.azurewebsites.net/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-06T...",
  "azure": {
    "configured": true,
    "cosmosConnected": "initialized",
    "blobConnected": "initialized"
  }
}
```

---

## 🐛 Still Having Issues?

### Issue 1: Connection String Contains Special Characters

If your connection string contains special characters (like `@`, `?`, `&`), ensure they are properly encoded:

```bash
# URL encode the connection string if needed
# In Azure Portal, paste it directly - Azure handles encoding
# In CLI, wrap in single quotes: 'mongodb://...'
```

### Issue 2: Connection String is Truncated

Check the length of your connection string:
```bash
az webapp config appsettings list \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query "[?name=='AZURE_COSMOS_CONNECTION_STRING'].value" \
  -o tsv | wc -c
```

Should be 200-400 characters. If it's much shorter, it's truncated.

### Issue 3: Wrong Connection String Type

Cosmos DB has multiple connection string types:
- ✅ **Primary Connection String** (use this)
- ❌ Primary Key (not a full connection string)
- ❌ Secondary Connection String (backup)

### Issue 4: Firewall Rules

Check if Cosmos DB firewall is blocking connections:

1. Go to **Cosmos DB** → **Networking**
2. Ensure one of these is enabled:
   - **Allow access from Azure services** (recommended)
   - Add your App Service's outbound IP addresses

To get App Service IPs:
```bash
az webapp show \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query "outboundIpAddresses" \
  -o tsv
```

---

## 📋 Quick Checklist

- [ ] Connection string copied from Azure Portal → Cosmos DB → Connection strings
- [ ] Connection string starts with `mongodb://` or `mongodb+srv://`
- [ ] Connection string includes `@hostname.domain.com`
- [ ] Environment variable set in App Service Configuration
- [ ] App Service restarted after setting variables
- [ ] Firewall allows Azure services
- [ ] Logs show successful connection

---

## 🆘 Emergency Fallback

If Azure Cosmos DB continues to fail, you can temporarily fall back to MongoDB Atlas:

1. Remove or comment out Azure environment variables
2. Set MongoDB Atlas connection:
```bash
az webapp config appsettings set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings \
    MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/capersports"
```

The application will automatically detect and use MongoDB + Cloudinary instead.

---

## 📞 Support Resources

- **Azure Cosmos DB Documentation**: https://docs.microsoft.com/azure/cosmos-db/
- **Connection String Format**: https://docs.microsoft.com/azure/cosmos-db/mongodb/connect-account
- **App Service Configuration**: https://docs.microsoft.com/azure/app-service/configure-common

---

## 🔧 Automated Fix Script

Save this as `fix-azure-env.sh`:

```bash
#!/bin/bash

# Configuration
APP_NAME="capersports-web"
RESOURCE_GROUP="caper-sports-rg"
COSMOS_ACCOUNT="capersports-cosmos"
STORAGE_ACCOUNT="capersportsstorage"

echo "🔧 Fixing Azure Environment Variables..."

# Get connection strings
echo "📡 Retrieving connection strings..."
COSMOS_CONN=$(az cosmosdb keys list \
  --name $COSMOS_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --type connection-strings \
  --query 'connectionStrings[0].connectionString' \
  -o tsv)

STORAGE_CONN=$(az storage account show-connection-string \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --query 'connectionString' \
  -o tsv)

# Validate
if [ -z "$COSMOS_CONN" ]; then
  echo "❌ Failed to get Cosmos DB connection string"
  exit 1
fi

if [ -z "$STORAGE_CONN" ]; then
  echo "❌ Failed to get Storage connection string"
  exit 1
fi

echo "✅ Retrieved connection strings"

# Set environment variables
echo "⚙️  Setting environment variables..."
az webapp config appsettings set \
  --name $APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --settings \
    AZURE_COSMOS_CONNECTION_STRING="$COSMOS_CONN" \
    AZURE_COSMOS_DATABASE_NAME="capersports" \
    AZURE_STORAGE_CONNECTION_STRING="$STORAGE_CONN" \
    AZURE_STORAGE_ACCOUNT_NAME="$STORAGE_ACCOUNT" \
    NODE_ENV="production" \
    PORT="8080" \
  > /dev/null

echo "✅ Environment variables set"

# Restart app
echo "🔄 Restarting app service..."
az webapp restart --name $APP_NAME --resource-group $RESOURCE_GROUP

echo "✅ Done! Check logs in 30 seconds:"
echo "   az webapp log tail --name $APP_NAME --resource-group $RESOURCE_GROUP"
```

Run it:
```bash
chmod +x fix-azure-env.sh
./fix-azure-env.sh
```
