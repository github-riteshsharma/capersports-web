const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

// Load environment variables
dotenv.config({ path: '../.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

const deleteAllProducts = async () => {
  try {
    // Option 1: Soft delete (set isActive to false)
    const result = await Product.updateMany({}, { isActive: false });
    console.log(`✅ Soft deleted ${result.modifiedCount} products (set isActive to false)`);
    
    // Option 2: Hard delete (uncomment to permanently delete)
    // const result = await Product.deleteMany({});
    // console.log(`✅ Permanently deleted ${result.deletedCount} products`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting products:', error);
    process.exit(1);
  }
};

deleteAllProducts();
