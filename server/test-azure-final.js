const { MongoClient } = require('mongodb');
const { BlobServiceClient } = require('@azure/storage-blob');

// Updated connection strings with your password
const COSMOS_CONNECTION_STRING = 'mongodb+srv://capersports:Ritesh@0611@capersports-cosmos.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000';
const STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=capersportsstorage;AccountKey=4UHK40ASN1RndIpQfg0ezrzVj6fkqPrFbvvWMaqVl8IKxEblbDQvCW4XA8FmN/txR6wom4YSY6wg+AStoNxhaQ==;EndpointSuffix=core.windows.net';

async function testAzureWithCorrectCredentials() {
  console.log('🚀 Testing Azure Services with Updated Credentials');
  console.log('==================================================');

  let allSuccess = true;

  // Test Cosmos DB Connection with correct password
  console.log('\n📊 Testing Cosmos DB (MongoDB API) with password...');
  let mongoClient = null;
  
  try {
    console.log('🔗 Connecting to Cosmos DB...');
    mongoClient = new MongoClient(COSMOS_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000, // Increased timeout
      socketTimeoutMS: 45000,
    });
    
    await mongoClient.connect();
    console.log('✅ Connected to Cosmos DB successfully!');
    
    // Set up database and collections
    const db = mongoClient.db('capersports');
    console.log('📋 Setting up database: capersports');
    
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
    
    // Test database operations
    console.log('🧪 Testing database operations...');
    const testCollection = db.collection('test_connection');
    
    // Insert test document
    const testDoc = {
      service: 'caper-sports',
      test: 'azure-cosmos-connection',
      timestamp: new Date(),
      status: 'connected',
      message: 'Successfully connected to Azure Cosmos DB!'
    };
    
    const insertResult = await testCollection.insertOne(testDoc);
    console.log('✅ Test document inserted successfully');
    
    // Read test document
    const foundDoc = await testCollection.findOne({ _id: insertResult.insertedId });
    if (foundDoc) {
      console.log('✅ Test document retrieved:', foundDoc.message);
    }
    
    // Clean up
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('✅ Test document cleaned up');
    
  } catch (error) {
    console.error('❌ Cosmos DB connection failed:', error.message);
    allSuccess = false;
    
    if (error.message.includes('Server selection timed out')) {
      console.log('💡 Possible fixes:');
      console.log('   1. Check firewall settings in Azure Portal');
      console.log('   2. Ensure "Allow access from all networks" is enabled');
      console.log('   3. Verify the connection string is correct');
    }
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }

  // Test Blob Storage Connection
  console.log('\n📁 Testing Azure Blob Storage...');
  
  try {
    console.log('🔗 Connecting to Blob Storage...');
    const blobServiceClient = BlobServiceClient.fromConnectionString(STORAGE_CONNECTION_STRING);
    
    // Test connection
    const accountInfo = await blobServiceClient.getAccountInfo();
    console.log('✅ Connected to Blob Storage successfully!');
    console.log('📊 Account type:', accountInfo.accountKind);
    
    // Set up required containers
    const requiredContainers = [
      { name: 'product-images', access: 'blob' },
      { name: 'user-avatars', access: 'blob' },
      { name: 'general-assets', access: 'blob' }
    ];
    
    console.log('📦 Setting up blob containers...');
    
    for (const container of requiredContainers) {
      const containerClient = blobServiceClient.getContainerClient(container.name);
      
      try {
        const exists = await containerClient.exists();
        
        if (!exists) {
          await containerClient.create({
            access: container.access
          });
          console.log(`✅ Created container: ${container.name} (public: ${container.access})`);
        } else {
          console.log(`✅ Container exists: ${container.name}`);
          
          // Check access level
          const properties = await containerClient.getProperties();
          console.log(`   Access level: ${properties.publicAccess || 'private'}`);
        }
      } catch (containerError) {
        console.error(`❌ Error with container ${container.name}:`, containerError.message);
        allSuccess = false;
        
        if (containerError.message.includes('Public access is not permitted')) {
          console.log('💡 Fix required for Storage Account:');
          console.log('   1. Go to Azure Portal → Storage Account → Configuration');
          console.log('   2. Enable "Allow Blob public access"');
          console.log('   3. Save and try again');
        }
      }
    }
    
    // Test file operations if containers are working
    try {
      console.log('🧪 Testing file upload...');
      
      const testContainerClient = blobServiceClient.getContainerClient('general-assets');
      const testBlobName = `test-${Date.now()}.txt`;
      const testContent = `Caper Sports Azure Setup Test\nTimestamp: ${new Date().toISOString()}\nCosmos DB: Connected\nBlob Storage: Connected\nStatus: Success!`;
      
      const blockBlobClient = testContainerClient.getBlockBlobClient(testBlobName);
      
      await blockBlobClient.upload(testContent, testContent.length, {
        blobHTTPHeaders: { 
          blobContentType: 'text/plain' 
        }
      });
      
      console.log('✅ Test file uploaded successfully');
      console.log('🔗 File URL:', blockBlobClient.url);
      
      // Clean up test file
      await blockBlobClient.delete();
      console.log('✅ Test file cleaned up');
      
    } catch (uploadError) {
      console.log('⚠️  File upload test skipped:', uploadError.message);
    }
    
  } catch (error) {
    console.error('❌ Blob Storage setup failed:', error.message);
    allSuccess = false;
  }

  // Summary
  console.log('\n🎯 Azure Setup Summary');
  console.log('======================');
  
  if (allSuccess) {
    console.log('🎉 All Azure services configured successfully!');
    console.log('\n📋 Your services are ready:');
    console.log('   • Cosmos DB: Connected with capersports database');
    console.log('   • Blob Storage: Connected with containers');
    console.log('   • Collections: users, products, orders');
    console.log('   • Containers: product-images, user-avatars, general-assets');
    
    console.log('\n🔧 Update your .env file with:');
    console.log('AZURE_COSMOS_CONNECTION_STRING=' + COSMOS_CONNECTION_STRING);
    console.log('AZURE_STORAGE_CONNECTION_STRING=' + STORAGE_CONNECTION_STRING);
    
    console.log('\n🚀 Next steps:');
    console.log('1. Update your .env file with the connection strings above');
    console.log('2. Start your application: npm run dev:azure');
    console.log('3. Test the health endpoint: http://localhost:5001/api/health');
    
  } else {
    console.log('⚠️  Some issues need to be resolved:');
    console.log('\n🔧 Remaining fixes needed:');
    console.log('1. Enable public access for Storage Account (if containers failed)');
    console.log('2. Check firewall settings in Azure Portal (if Cosmos DB failed)');
    console.log('\nSee AZURE_SETUP_FIXES.md for detailed instructions');
  }
  
  return allSuccess;
}

// Run the test
testAzureWithCorrectCredentials().catch(console.error);
