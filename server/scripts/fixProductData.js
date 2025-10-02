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

const fixProductData = async () => {
  try {
    console.log('🔍 Checking for products with corrupted data...\n');
    
    const products = await Product.find({});
    console.log(`Found ${products.length} products to check\n`);
    
    let fixedCount = 0;
    
    for (const product of products) {
      let needsUpdate = false;
      let updates = {};
      
      // Check colors
      if (product.colors && Array.isArray(product.colors)) {
        const hasInvalidColors = product.colors.some(color => {
          if (typeof color === 'string') {
            // Check if it's an ObjectId string
            return color.length === 24 && /^[0-9a-f]{24}$/i.test(color);
          }
          return false;
        });
        
        if (hasInvalidColors) {
          console.log(`⚠️  Product "${product.name}" has invalid color data`);
          // Filter out invalid colors
          updates.colors = product.colors.filter(color => {
            if (typeof color === 'string') {
              return !(color.length === 24 && /^[0-9a-f]{24}$/i.test(color));
            }
            return true;
          });
          needsUpdate = true;
        }
      }
      
      // Check sizes
      if (product.sizes && Array.isArray(product.sizes)) {
        const hasInvalidSizes = product.sizes.some(size => {
          const sizeName = typeof size === 'string' ? size : size.size;
          if (typeof sizeName === 'string') {
            // Check if it's an ObjectId string
            return sizeName.length === 24 && /^[0-9a-f]{24}$/i.test(sizeName);
          }
          return false;
        });
        
        if (hasInvalidSizes) {
          console.log(`⚠️  Product "${product.name}" has invalid size data`);
          // Filter out invalid sizes
          updates.sizes = product.sizes.filter(size => {
            const sizeName = typeof size === 'string' ? size : size.size;
            if (typeof sizeName === 'string') {
              return !(sizeName.length === 24 && /^[0-9a-f]{24}$/i.test(sizeName));
            }
            return true;
          });
          needsUpdate = true;
        }
      }
      
      // Update product if needed
      if (needsUpdate) {
        await Product.findByIdAndUpdate(product._id, updates);
        console.log(`✅ Fixed product: ${product.name}\n`);
        fixedCount++;
      }
    }
    
    if (fixedCount === 0) {
      console.log('✅ No corrupted data found. All products are clean!');
    } else {
      console.log(`\n✅ Fixed ${fixedCount} product(s) with corrupted data`);
    }
    
    console.log('\n📊 Summary:');
    console.log(`   Total products: ${products.length}`);
    console.log(`   Fixed products: ${fixedCount}`);
    console.log(`   Clean products: ${products.length - fixedCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing product data:', error);
    process.exit(1);
  }
};

fixProductData();
