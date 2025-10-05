const { MongoClient } = require('mongodb');
const { BlobServiceClient } = require('@azure/storage-blob');

// URL encode the password to handle special characters
const password = encodeURIComponent('Ritesh@0611');
const COSMOS_CONNECTION_STRING = `mongodb+srv://capersports:${password}@capersports-cosmos.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`;
const STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=capersportsstorage;AccountKey=4UHK40ASN1RndIpQfg0ezrzVj6fkqPrFbvvWMaqVl8IKxEblbDQvCW4XA8FmN/txR6wom4YSY6wg+AStoNxhaQ==;EndpointSuffix=core.windows.net';

async function testAzureWithEncodedPassword() {
  console.log('🚀 Testing Azure Services with URL-Encoded Password');
  console.log('====================================================');
  console.log('🔑 Using password:', 'Ritesh@0611', '→ URL encoded:', password);

  let cosmosSuccess = false;
  let storageSuccess = false;

  // Test Cosmos DB Connection with URL-encoded password
  console.log('\n📊 Testing Cosmos DB (MongoDB API)...');
  let mongoClient = null;
  
  try {
    console.log('🔗 Connecting to Cosmos DB with encoded password...');
    console.log('📋 Connection string:', COSMOS_CONNECTION_STRING.replace(password, '***PASSWORD***'));
    
    mongoClient = new MongoClient(COSMOS_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    
    await mongoClient.connect();
    console.log('✅ Connected to Cosmos DB successfully!');
    cosmosSuccess = true;
    
    // Test database operations
    const db = mongoClient.db('capersports');
    console.log('📋 Testing database: capersports');
    
    // List existing collections
    const collections = await db.listCollections().toArray();
    console.log(`Found ${collections.length} existing collections:`, collections.map(c => c.name));
    
    // Create required collections if they don't exist
    const requiredCollections = ['users', 'products', 'orders'];
    for (const collectionName of requiredCollections) {
      const existingNames = collections.map(c => c.name);
      if (!existingNames.includes(collectionName)) {
        await db.createCollection(collectionName);
        console.log(`✅ Created collection: ${collectionName}`);
      } else {
        console.log(`✅ Collection exists: ${collectionName}`);
      }
    }
    
    // Test insert/read operation
    const testCollection = db.collection('connection_test');
    const testDoc = {
      service: 'caper-sports',
      test: 'azure-cosmos-connection',
      timestamp: new Date(),
      status: 'connected'
    };
    
    const insertResult = await testCollection.insertOne(testDoc);
    console.log('✅ Test document inserted');
    
    const foundDoc = await testCollection.findOne({ _id: insertResult.insertedId });
    if (foundDoc) {
      console.log('✅ Test document retrieved successfully');
    }
    
    // Clean up
    await testCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('✅ Test document cleaned up');
    
  } catch (error) {
    console.error('❌ Cosmos DB connection failed:', error.message);
    
    if (error.message.includes('hostname')) {
      console.log('💡 Connection string format issue detected');
      console.log('   Try getting a fresh connection string from Azure Portal');
    } else if (error.message.includes('authentication failed')) {
      console.log('💡 Authentication issue - check username/password');
    } else if (error.message.includes('Server selection timed out')) {
      console.log('💡 Network/firewall issue - check Azure Portal settings');
    }
  } finally {
    if (mongoClient) {
      await mongoClient.close();
    }
  }

  // Test Blob Storage
  console.log('\n📁 Testing Azure Blob Storage...');
  
  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(STORAGE_CONNECTION_STRING);
    
    // Test connection
    const accountInfo = await blobServiceClient.getAccountInfo();
    console.log('✅ Connected to Blob Storage successfully!');
    console.log('📊 Account type:', accountInfo.accountKind);
    storageSuccess = true;
    
    // Try to list existing containers
    const existingContainers = [];
    for await (const container of blobServiceClient.listContainers()) {
      existingContainers.push(container.name);
    }
    console.log(`📦 Found ${existingContainers.length} existing containers:`, existingContainers);
    
    // Try to create containers (will show if public access is enabled)
    const requiredContainers = ['product-images', 'user-avatars', 'general-assets'];
    
    for (const containerName of requiredContainers) {
      const containerClient = blobServiceClient.getContainerClient(containerName);
      
      try {
        const exists = await containerClient.exists();
        if (!exists) {
          await containerClient.create({ access: 'blob' });
          console.log(`✅ Created container: ${containerName}`);
        } else {
          console.log(`✅ Container exists: ${containerName}`);
        }
      } catch (containerError) {
        if (containerError.message.includes('Public access is not permitted')) {
          console.log(`⚠️  Container ${containerName}: Public access disabled`);
          console.log('   Fix: Azure Portal → Storage Account → Configuration → Enable "Allow Blob public access"');
        } else {
          console.log(`❌ Container ${containerName} error:`, containerError.message);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Blob Storage failed:', error.message);
  }

  // Final Summary
  console.log('\n🎯 Final Azure Setup Results');
  console.log('=============================');
  
  if (cosmosSuccess && storageSuccess) {
    console.log('🎉 Both Azure services are working!');
    
    console.log('\n📝 Add these to your .env file:');
    console.log('');
    console.log('# Azure Cosmos DB (with URL-encoded password)');
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
    
    console.log('\n🚀 Next steps:');
    console.log('1. Update your .env file with the strings above');
    console.log('2. Enable public access for Storage Account (if needed)');
    console.log('3. Start your app: npm run dev:azure');
    
  } else {
    console.log('⚠️  Setup incomplete:');
    console.log(`   Cosmos DB: ${cosmosSuccess ? '✅ Working' : '❌ Needs fix'}`);
    console.log(`   Blob Storage: ${storageSuccess ? '✅ Working' : '❌ Needs fix'}`);
    
    if (!cosmosSuccess) {
      console.log('\n🔧 Cosmos DB fixes:');
      console.log('1. Get fresh connection string from Azure Portal');
      console.log('2. Check firewall settings');
      console.log('3. Verify credentials');
    }
    
    if (!storageSuccess) {
      console.log('\n🔧 Storage fixes:');
      console.log('1. Enable public access in Azure Portal');
      console.log('2. Check access keys');
    }
  }
}

// Run the test
testAzureWithEncodedPassword().catch(console.error);
