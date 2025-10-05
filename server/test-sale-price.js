const { MongoClient } = require('mongodb');

// Connection string from .env
const COSMOS_CONNECTION_STRING = 'mongodb+srv://capersports:Ritesh%400611@capersports-cosmos.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000';

async function testSalePriceInDB() {
  console.log('🔍 Testing sale price in Azure Cosmos DB...');
  
  let client = null;
  
  try {
    client = new MongoClient(COSMOS_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    await client.connect();
    console.log('✅ Connected to Azure Cosmos DB');
    
    const db = client.db('capersports');
    const collection = db.collection('products');
    
    // Get all products and their sale prices
    const products = await collection.find({}, {
      projection: {
        name: 1,
        price: 1,
        salePrice: 1,
        _id: 1
      }
    }).toArray();
    
    console.log('\n📊 Products in database:');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Price: ₹${product.price}`);
      console.log(`   Sale Price: ${product.salePrice ? '₹' + product.salePrice : 'null/undefined'}`);
      console.log(`   ID: ${product._id}`);
      console.log('');
    });
    
    // Test updating a specific product with sale price
    const firstProduct = products[0];
    if (firstProduct) {
      console.log(`🔄 Testing update on: ${firstProduct.name}`);
      
      const updateResult = await collection.updateOne(
        { _id: firstProduct._id },
        { 
          $set: { 
            salePrice: 299,
            updatedAt: new Date()
          }
        }
      );
      
      console.log(`Update result: ${updateResult.modifiedCount} document(s) modified`);
      
      // Verify the update
      const updatedProduct = await collection.findOne({ _id: firstProduct._id });
      console.log(`✅ After update - Sale Price: ${updatedProduct.salePrice}`);
    }
    
  } catch (error) {
    console.error('❌ Error testing sale price:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

testSalePriceInDB();
