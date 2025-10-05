# Azure Environment Configuration Template

## 🔧 Copy to .env and Configure

This template shows you exactly what environment variables you need for Azure integration.

### Required Azure Variables

```env
# Azure Cosmos DB (MongoDB API)
AZURE_COSMOS_CONNECTION_STRING=mongodb://caper-sports-cosmos:YOUR_KEY@caper-sports-cosmos.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@caper-sports-cosmos@
AZURE_COSMOS_DATABASE_NAME=capersports

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=capersportsstorage;AccountKey=YOUR_KEY;EndpointSuffix=core.windows.net
AZURE_STORAGE_ACCOUNT_NAME=capersportsstorage
AZURE_STORAGE_ACCOUNT_KEY=YOUR_STORAGE_KEY

# Container names
AZURE_BLOB_CONTAINER_PRODUCTS=product-images
AZURE_BLOB_CONTAINER_USERS=user-avatars
AZURE_BLOB_CONTAINER_ASSETS=general-assets
```

### How to Get Connection Strings

#### Cosmos DB Connection String
1. Azure Portal → Your Cosmos DB Account
2. Left menu → **Connection strings**
3. Copy **Primary Connection String**

#### Storage Connection String
1. Azure Portal → Your Storage Account
2. Left menu → **Access keys**
3. Under key1 → Click **Show**
4. Copy **Connection string**

### Application Configuration

```env
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:3001
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3001
```

### Validation

After setting up your .env file:

```bash
# Validate configuration
./validate-azure-setup.sh

# Install dependencies
cd server && npm install @azure/storage-blob @azure/cosmos uuid

# Start with Azure
npm run dev:azure
```

### Fallback Configuration (Optional)

Keep these for backward compatibility:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/capersports

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

The server automatically detects which services are configured and uses them accordingly.
