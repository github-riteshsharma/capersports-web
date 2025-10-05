const dotenv = require('dotenv');
const AzureCosmosService = require('../services/azureCosmosService');
const AzureBlobService = require('../services/azureBlobService');

// Load environment variables
dotenv.config({ path: './.env' });

async function migrateToAzure() {
  console.log('🚀 Starting migration to Azure...');
  
  try {
    // Initialize Azure services
    const cosmosService = new AzureCosmosService();
    const blobService = new AzureBlobService();
    
    // Step 1: Initialize Azure Blob Storage containers
    console.log('\n📦 Step 1: Initializing Azure Blob Storage...');
    await blobService.initializeContainers();
    
    // Step 2: Migrate database from MongoDB to Cosmos DB
    console.log('\n🗄️  Step 2: Migrating database to Cosmos DB...');
    const sourceMongoUri = process.env.MONGODB_URI;
    
    if (!sourceMongoUri) {
      console.log('⚠️  No source MongoDB URI found. Skipping database migration.');
      console.log('   Set MONGODB_URI in .env to migrate existing data.');
    } else {
      await cosmosService.migrateFromMongoDB(sourceMongoUri);
    }
    
    // Step 3: Test connections
    console.log('\n🔍 Step 3: Testing Azure connections...');
    
    // Test Cosmos DB
    const cosmosHealth = await cosmosService.healthCheck();
    console.log('Cosmos DB Health:', cosmosHealth);
    
    if (cosmosHealth.status === 'healthy') {
      const stats = await cosmosService.getStats();
      console.log('Cosmos DB Stats:', stats);
    }
    
    // Test Blob Storage
    try {
      const containers = ['products', 'users', 'assets'];
      for (const container of containers) {
        const files = await blobService.listFiles(container);
        console.log(`Blob Storage - ${container} container: ${files.length} files`);
      }
    } catch (error) {
      console.log('Blob Storage test:', error.message);
    }
    
    console.log('\n🎉 Azure migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Update your .env file with Azure connection strings');
    console.log('2. Install Azure dependencies: npm install @azure/storage-blob @azure/cosmos');
    console.log('3. Update your server.js to use Azure services');
    console.log('4. Test your application thoroughly');
    console.log('5. Update deployment configuration');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    // Cleanup
    try {
      const cosmosService = new AzureCosmosService();
      await cosmosService.disconnect();
    } catch (error) {
      // Ignore cleanup errors
    }
  }
  
  process.exit(0);
}

// Run migration if called directly
if (require.main === module) {
  migrateToAzure();
}

module.exports = { migrateToAzure };
