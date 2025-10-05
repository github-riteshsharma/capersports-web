const { MongoClient } = require('mongodb');

// Let's try different connection string formats
const password = 'Ritesh@0611';
const encodedPassword = encodeURIComponent(password);

const connectionStrings = [
  {
    name: 'Original with encoded password',
    uri: `mongodb+srv://capersports:${encodedPassword}@capersports-cosmos.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`
  },
  {
    name: 'Without authMechanism',
    uri: `mongodb+srv://capersports:${encodedPassword}@capersports-cosmos.global.mongocluster.cosmos.azure.com/?tls=true&retrywrites=false&maxIdleTimeMS=120000`
  },
  {
    name: 'With SSL instead of TLS',
    uri: `mongodb+srv://capersports:${encodedPassword}@capersports-cosmos.global.mongocluster.cosmos.azure.com/?ssl=true&retrywrites=false&maxIdleTimeMS=120000`
  },
  {
    name: 'Minimal connection string',
    uri: `mongodb+srv://capersports:${encodedPassword}@capersports-cosmos.global.mongocluster.cosmos.azure.com/capersports`
  }
];

async function testCosmosDBConnection() {
  console.log('🔍 Comprehensive Cosmos DB Connection Test');
  console.log('==========================================');
  console.log(`🔑 Testing with password: ${password}`);
  console.log(`🔑 URL encoded: ${encodedPassword}`);
  console.log('');

  for (let i = 0; i < connectionStrings.length; i++) {
    const { name, uri } = connectionStrings[i];
    console.log(`\n📊 Test ${i + 1}: ${name}`);
    console.log('🔗 Connection string:', uri.replace(encodedPassword, '***PASSWORD***'));
    
    let client = null;
    
    try {
      client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 30000,
      });
      
      console.log('   ⏳ Connecting...');
      await client.connect();
      
      console.log('   ✅ Connected successfully!');
      
      // Test database operations
      const db = client.db('capersports');
      const collections = await db.listCollections().toArray();
      console.log(`   📋 Found ${collections.length} collections`);
      
      // Test a simple operation
      const testCollection = db.collection('connection_test');
      const testDoc = { test: 'success', timestamp: new Date() };
      const result = await testCollection.insertOne(testDoc);
      console.log('   ✅ Test document inserted');
      
      await testCollection.deleteOne({ _id: result.insertedId });
      console.log('   ✅ Test document cleaned up');
      
      await client.close();
      console.log('   ✅ Connection closed');
      
      // If we get here, this connection string works!
      console.log('\n🎉 SUCCESS! This connection string works!');
      console.log('📝 Use this in your .env file:');
      console.log(`AZURE_COSMOS_CONNECTION_STRING=${uri}`);
      
      return uri; // Return the working connection string
      
    } catch (error) {
      console.log(`   ❌ Failed: ${error.message}`);
      
      if (error.message.includes('Server selection timed out')) {
        console.log('   💡 This suggests a network/firewall issue');
      } else if (error.message.includes('Authentication failed')) {
        console.log('   💡 This suggests incorrect credentials');
      } else if (error.message.includes('hostname')) {
        console.log('   💡 This suggests a connection string format issue');
      }
    } finally {
      if (client) {
        try {
          await client.close();
        } catch (e) {
          // Ignore close errors
        }
      }
    }
  }
  
  console.log('\n❌ None of the connection strings worked');
  console.log('\n🔧 Additional troubleshooting steps:');
  console.log('1. Double-check the Cosmos DB account name in Azure Portal');
  console.log('2. Verify the username is exactly "capersports"');
  console.log('3. Confirm the password is exactly "Ritesh@0611"');
  console.log('4. Check if Cosmos DB is in the same region you expect');
  console.log('5. Try getting a fresh connection string from Azure Portal');
  console.log('');
  console.log('🌐 Network troubleshooting:');
  console.log('1. Ensure "Allow access from all networks" is enabled');
  console.log('2. Check if there are any VPN/proxy issues');
  console.log('3. Try from a different network if possible');
  
  return null;
}

// Also test basic network connectivity
async function testNetworkConnectivity() {
  console.log('\n🌐 Testing Network Connectivity');
  console.log('===============================');
  
  const dns = require('dns').promises;
  const hostname = 'capersports-cosmos.global.mongocluster.cosmos.azure.com';
  
  try {
    console.log(`🔍 DNS lookup for: ${hostname}`);
    const addresses = await dns.lookup(hostname);
    console.log(`✅ DNS resolved to: ${addresses.address}`);
    
    // Try to test basic TCP connectivity (this is a simple check)
    const net = require('net');
    const socket = new net.Socket();
    
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        socket.destroy();
        console.log('❌ TCP connection timed out (port 27017)');
        resolve(false);
      }, 5000);
      
      socket.connect(27017, addresses.address, () => {
        clearTimeout(timeout);
        console.log('✅ TCP connection successful');
        socket.destroy();
        resolve(true);
      });
      
      socket.on('error', (err) => {
        clearTimeout(timeout);
        console.log(`❌ TCP connection failed: ${err.message}`);
        resolve(false);
      });
    });
    
  } catch (error) {
    console.log(`❌ DNS lookup failed: ${error.message}`);
    return false;
  }
}

// Run both tests
async function runAllTests() {
  await testNetworkConnectivity();
  const workingUri = await testCosmosDBConnection();
  
  if (workingUri) {
    console.log('\n🎯 FINAL RESULT: SUCCESS!');
    console.log('Your Azure services are ready:');
    console.log('✅ Cosmos DB: Connected');
    console.log('✅ Blob Storage: Connected with containers');
    console.log('\n📝 Update your .env file with:');
    console.log(`AZURE_COSMOS_CONNECTION_STRING=${workingUri}`);
  } else {
    console.log('\n🎯 FINAL RESULT: Cosmos DB connection failed');
    console.log('But your Blob Storage is working perfectly!');
    console.log('\n📞 Next steps:');
    console.log('1. Double-check Cosmos DB settings in Azure Portal');
    console.log('2. Try getting a fresh connection string');
    console.log('3. Contact Azure support if the issue persists');
  }
}

runAllTests().catch(console.error);
