const dotenv = require('dotenv');
const AzureBlobService = require('./services/azureBlobService');

// Load environment variables
dotenv.config();

async function initializeAzureBlob() {
  try {
    console.log('🔵 Initializing Azure Blob Service...');
    const azureBlobService = new AzureBlobService();
    
    console.log('📦 Initializing containers...');
    await azureBlobService.initializeContainers();
    
    console.log('✅ Azure Blob Service initialized successfully!');
    console.log('📋 Available containers:');
    console.log('  - product-images (for product photos)');
    console.log('  - user-avatars (for profile pictures)');
    console.log('  - general-assets (for other files)');
    
  } catch (error) {
    console.error('❌ Error initializing Azure Blob Service:', error);
    console.error('💡 Make sure AZURE_STORAGE_CONNECTION_STRING is set in .env');
  }
}

initializeAzureBlob();
