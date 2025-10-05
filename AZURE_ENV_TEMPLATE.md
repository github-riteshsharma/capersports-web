# Caper Sports - Azure Environment Configuration Template

# ====================================
# AZURE CONFIGURATION (Recommended)
# ====================================

# Azure Cosmos DB (MongoDB API)
AZURE_COSMOS_CONNECTION_STRING=mongodb://your-cosmos-account:your-key@your-cosmos-account.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@your-cosmos-account@
AZURE_COSMOS_DATABASE_NAME=capersports

# Azure Blob Storage
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=your-storage-account;AccountKey=your-key;EndpointSuffix=core.windows.net
AZURE_STORAGE_ACCOUNT_NAME=your-storage-account
AZURE_STORAGE_ACCOUNT_KEY=your-storage-key

# Azure Blob Storage Containers
AZURE_BLOB_CONTAINER_PRODUCTS=product-images
AZURE_BLOB_CONTAINER_USERS=user-avatars
AZURE_BLOB_CONTAINER_ASSETS=general-assets

# ====================================
# FALLBACK CONFIGURATION (MongoDB + Cloudinary)
# ====================================

# MongoDB Configuration (fallback if Azure not configured)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/capersports?retryWrites=true&w=majority

# Cloudinary Configuration (fallback if Azure not configured)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# ====================================
# COMMON CONFIGURATION
# ====================================

# Server Configuration
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:3001

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-make-it-long-and-random
JWT_EXPIRE=7d

# Email Configuration (Optional)
EMAIL_FROM=noreply@capersports.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Stripe Configuration (Optional)
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Security Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
CORS_ORIGIN=http://localhost:3001
