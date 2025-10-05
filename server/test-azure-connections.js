const { MongoClient } = require('mongodb');
const { BlobServiceClient } = require('@azure/storage-blob');

// Your Azure connection strings
const COSMOS_CONNECTION_STRING = 'mongodb+srv://capersports:@capersports-cosmos.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000';
const STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=capersportsstorage;AccountKey=4UHK40ASN1RndIpQfg0ezrzVj6fkqPrFbvvWMaqVl8IKxEblbDQvCW4XA8FmN/txR6wom4YSY6wg+AStoNxhaQ==;EndpointSuffix=core.windows.net';

async function testAzureConnections() {
  console.log('🔍 Testing Azure Connections...');
  console.log('================================');

  // Test Cosmos DB Connection
  console.log('\n📊 Testing Cosmos DB (MongoDB API)...');
  let mongoClient = null;
  
  try {
    mongoClient = new MongoClient(COSMOS_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    await mongoClient.connect();
    console.log('✅ Connected to Cosmos DB successfully!');
    
    // Test database operations
    const db = mongoClient.db('capersports');
    const collections = await db.listCollections().toArray();
    console.log(`📋 Found ${collections.length} collections:`, collections.map(c => c.name));
    
    // Try to create a test collection if none exist
    if (collections.length === 0) {
      console.log('📝 Creating test collections...');
      await db.createCollection('users');
      await db.createCollection('products');
      await db.createCollection('orders');
      console.log('✅ Created test collections successfully!');
    }
    
    // Test a simple write/read operation
    const testCollection = db.collection('test');
    const testDoc = { 
      message: 'Azure connection test', 
      timestamp: new Date(),
      source: 'caper-sports-test'
    };
    
    const insertResult = await testCollection.insertOne(testDoc);
    console.log('✅ Test document inserted:', insertResult.insertedId);
    
    const foundDoc = await testCollection.findOne({ _id: insertResult.insertedId });
    console.log('✅ Test document retrieved:', foundDoc.message);
    
    // Clean up test document
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('✅ Test document cleaned up');
    
  } catch (error) {
    console.error('❌ Cosmos DB connection failed:', error.message);
    console.error('   Check your connection string and network access');
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }

  // Test Blob Storage Connection
  console.log('\n📁 Testing Azure Blob Storage...');
  
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(STORAGE_CONNECTION_STRING);
    
    // Test connection by listing containers
    const containers = [];
    for await (const container of blobServiceClient.listContainers()) {
      containers.push(container.name);
    }
    
    console.log('✅ Connected to Blob Storage successfully!');
    console.log(`📦 Found ${containers.length} containers:`, containers);
    
    // Create required containers if they don't exist
    const requiredContainers = ['product-images', 'user-avatars', 'general-assets'];
    
    for (const containerName of requiredContainers) {
      const containerClient = blobServiceClient.getContainerClient(containerName);
      
      try {
        const exists = await containerClient.exists();
        if (!exists) {
          await containerClient.create({
            access: 'blob' // Public read access for blobs
          });
          console.log(`✅ Created container: ${containerName}`);
        } else {
          console.log(`✅ Container exists: ${containerName}`);
        }
      } catch (error) {
        console.error(`❌ Error with container ${containerName}:`, error.message);
      }
    }
    
    // Test file upload
    const testContainerClient = blobServiceClient.getContainerClient('general-assets');
    const testBlobName = 'test-connection.txt';
    const testContent = `Azure connection test from Caper Sports\nTimestamp: ${new Date().toISOString()}`;
    
    const blockBlobClient = testContainerClient.getBlockBlobClient(testBlobName);
    await blockBlobClient.upload(testContent, testContent.length, {
      blobHTTPHeaders: { blobContentType: 'text/plain' }
    });
    
    console.log('✅ Test file uploaded successfully');
    console.log('📎 Test file URL:', blockBlobClient.url);
    
    // Clean up test file
    await blockBlobClient.delete();
    console.log('✅ Test file cleaned up');
    
  } catch (error) {
    console.error('❌ Blob Storage connection failed:', error.message);
    console.error('   Check your connection string and access keys');
  }

  console.log('\n🎉 Azure Connection Test Complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Copy the connection strings to your .env file');
  console.log('2. Add the following to your .env:');
  console.log('');
  console.log('AZURE_COSMOS_CONNECTION_STRING=' + COSMOS_CONNECTION_STRING);
  console.log('AZURE_COSMOS_DATABASE_NAME=capersports');
  console.log('AZURE_STORAGE_CONNECTION_STRING=' + STORAGE_CONNECTION_STRING);
  console.log('AZURE_STORAGE_ACCOUNT_NAME=capersportsstorage');
  console.log('AZURE_STORAGE_ACCOUNT_KEY=4UHK40ASN1RndIpQfg0ezrzVj6fkqPrFbvvWMaqVl8IKxEblbDQvCW4XA8FmN/txR6wom4YSY6wg+AStoNxhaQ==');
  console.log('');
  console.log('3. Start your application with: npm run dev:azure');
}

// Run the test
testAzureConnections().catch(console.error);
