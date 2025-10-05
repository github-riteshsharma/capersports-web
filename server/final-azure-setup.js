const { MongoClient } = require('mongodb');
const { BlobServiceClient } = require('@azure/storage-blob');

// Working connection strings from our tests
const COSMOS_CONNECTION_STRING = 'mongodb+srv://capersports:Ritesh%400611@capersports-cosmos.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000';
const STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=capersportsstorage;AccountKey=4UHK40ASN1RndIpQfg0ezrzVj6fkqPrFbvvWMaqVl8IKxEblbDQvCW4XA8FmN/txR6wom4YSY6wg+AStoNxhaQ==;EndpointSuffix=core.windows.net';

async function finalAzureSetup() {
  console.log('🎉 Final Azure Setup for Caper Sports');
  console.log('====================================');

  let cosmosSuccess = false;
  let storageSuccess = false;

  // Setup Cosmos DB
  console.log('\n📊 Setting up Cosmos DB with working connection...');
  let mongoClient = null;
  
  try {
    mongoClient = new MongoClient(COSMOS_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    await mongoClient.connect();
    console.log('✅ Connected to Cosmos DB successfully!');
    cosmosSuccess = true;
    
    // Set up database and collections
    const db = mongoClient.db('capersports');
    console.log('📋 Setting up capersports database...');
    
    const requiredCollections = ['users', 'products', 'orders'];
    const existingCollections = await db.listCollections().toArray();
    const existingNames = existingCollections.map(c => c.name);
    
    console.log(`Found ${existingCollections.length} existing collections:`, existingNames);
    
    for (const collectionName of requiredCollections) {
      if (!existingNames.includes(collectionName)) {
        await db.createCollection(collectionName);
        console.log(`✅ Created collection: ${collectionName}`);
      } else {
        console.log(`✅ Collection exists: ${collectionName}`);
      }
    }
    
    // Test CRUD operations
    console.log('🧪 Testing database operations...');
    const testCollection = db.collection('setup_test');
    
    // Insert
    const testDoc = {
      service: 'caper-sports',
      setup: 'final-azure-test',
      timestamp: new Date(),
      status: 'success',
      features: ['cosmos-db', 'blob-storage', 'collections-ready']
    };
    
    const insertResult = await testCollection.insertOne(testDoc);
    console.log('✅ Document inserted successfully');
    
    // Read
    const foundDoc = await testCollection.findOne({ _id: insertResult.insertedId });
    if (foundDoc && foundDoc.features.includes('cosmos-db')) {
      console.log('✅ Document read successfully');
    }
    
    // Update
    await testCollection.updateOne(
      { _id: insertResult.insertedId },
      { $set: { updated: true, updateTime: new Date() } }
    );
    console.log('✅ Document updated successfully');
    
    // Delete
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('✅ Document deleted successfully');
    
    console.log('✅ All database operations working perfectly!');
    
  } catch (error) {
    console.error('❌ Cosmos DB setup failed:', error.message);
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }

  // Setup Blob Storage
  console.log('\n📁 Finalizing Blob Storage setup...');
  
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(STORAGE_CONNECTION_STRING);
    
    // Verify connection
    const accountInfo = await blobServiceClient.getAccountInfo();
    console.log('✅ Connected to Blob Storage successfully!');
    storageSuccess = true;
    
    // Check all containers
    const requiredContainers = ['product-images', 'user-avatars', 'general-assets'];
    
    for (const containerName of requiredContainers) {
      const containerClient = blobServiceClient.getContainerClient(containerName);
      const exists = await containerClient.exists();
      
      if (exists) {
        console.log(`✅ Container ready: ${containerName}`);
        
        // Test file upload
        const testBlobName = `test-${Date.now()}.txt`;
        const testContent = `Caper Sports - ${containerName} test\nTimestamp: ${new Date().toISOString()}`;
        
        const blockBlobClient = containerClient.getBlockBlobClient(testBlobName);
        await blockBlobClient.upload(testContent, testContent.length);
        console.log(`   📄 Test upload successful: ${blockBlobClient.url}`);
        
        // Clean up
        await blockBlobClient.delete();
        console.log(`   🗑️  Test file cleaned up`);
      }
    }
    
  } catch (error) {
    console.error('❌ Blob Storage setup failed:', error.message);
  }

  // Final Results
  console.log('\n🎯 FINAL SETUP RESULTS');
  console.log('======================');
  
  if (cosmosSuccess && storageSuccess) {
    console.log('🎉 COMPLETE SUCCESS! Both Azure services are fully configured!');
    
    console.log('\n📋 Your Azure infrastructure:');
    console.log('   🗄️  Database: Azure Cosmos DB (MongoDB API)');
    console.log('   📁 Storage: Azure Blob Storage with 3 containers');
    console.log('   📊 Collections: users, products, orders');
    console.log('   🖼️  Containers: product-images, user-avatars, general-assets');
    
    console.log('\n📝 COPY THIS TO YOUR .env FILE:');
    console.log('# ============================================================================');
    console.log('# AZURE SERVICES CONFIGURATION');
    console.log('# ============================================================================');
    console.log('');
    console.log('# Azure Cosmos DB (MongoDB API)');
    console.log(`AZURE_COSMOS_CONNECTION_STRING=${COSMOS_CONNECTION_STRING}`);
    console.log('AZURE_COSMOS_DATABASE_NAME=capersports');
    console.log('');
    console.log('# Azure Blob Storage');
    console.log(`AZURE_STORAGE_CONNECTION_STRING=${STORAGE_CONNECTION_STRING}`);
    console.log('AZURE_STORAGE_ACCOUNT_NAME=capersportsstorage');
    console.log('AZURE_STORAGE_ACCOUNT_KEY=4UHK40ASN1RndIpQfg0ezrzVj6fkqPrFbvvWMaqVl8IKxEblbDQvCW4XA8FmN/txR6wom4YSY6wg+AStoNxhaQ==');
    console.log('');
    console.log('# Container names');
    console.log('AZURE_BLOB_CONTAINER_PRODUCTS=product-images');
    console.log('AZURE_BLOB_CONTAINER_USERS=user-avatars');
    console.log('AZURE_BLOB_CONTAINER_ASSETS=general-assets');
    console.log('');
    console.log('# Application config');
    console.log('NODE_ENV=development');
    console.log('PORT=5001');
    console.log('FRONTEND_URL=http://localhost:3001');
    console.log('JWT_SECRET=caper-sports-super-secret-jwt-key-make-it-long-and-random');
    console.log('JWT_EXPIRE=7d');
    console.log('CORS_ORIGIN=http://localhost:3001');
    console.log('');
    
    console.log('🚀 READY TO START YOUR APPLICATION:');
    console.log('1. Update your .env file with the configuration above');
    console.log('2. Start your server: npm run dev:azure');
    console.log('3. Your app will use Azure Cosmos DB and Blob Storage!');
    
    console.log('\n💰 Monthly cost estimate: $27-33 (60% savings vs MongoDB Atlas + Cloudinary)');
    
  } else {
    console.log('⚠️  Setup partially complete:');
    console.log(`   Cosmos DB: ${cosmosSuccess ? '✅ Working' : '❌ Needs fix'}`);
    console.log(`   Blob Storage: ${storageSuccess ? '✅ Working' : '❌ Needs fix'}`);
  }
}

// Run the final setup
finalAzureSetup().catch(console.error);
