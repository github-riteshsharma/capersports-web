const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

// Load environment variables
dotenv.config({ path: './.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

const fixDefaultImages = async () => {
  try {
    console.log('🖼️ Fixing default product images...\n');
    
    const products = await Product.find({});
    console.log(`Found ${products.length} products to update\n`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      let needsUpdate = false;
      
      // Check if product has base64 images
      if (product.images && product.images.length > 0) {
        const hasBase64Images = product.images.some(img => 
          img && img.startsWith('data:image/')
        );
        
        if (hasBase64Images) {
          console.log(`🔄 Updating "${product.name}" - replacing base64 images with file paths`);
          
          // Create proper image paths
          const productSlug = product.name.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
          
          // Use the existing showcase images as default product images
          const defaultImages = [
            '/images/showcase/showcase1.jpg',
            '/images/showcase/showcase2.jpg',
            '/images/showcase/showcase3.jpg',
            '/images/showcase/showcase4.jpg'
          ];
          
          await Product.findByIdAndUpdate(product._id, {
            images: defaultImages
          });
          
          needsUpdate = true;
          updatedCount++;
        } else {
          console.log(`✅ "${product.name}" already has proper image paths`);
        }
      } else {
        console.log(`⚠️ "${product.name}" has no images - adding default images`);
        
        const defaultImages = [
          '/images/showcase/showcase1.jpg',
          '/images/showcase/showcase2.jpg'
        ];
        
        await Product.findByIdAndUpdate(product._id, {
          images: defaultImages
        });
        
        updatedCount++;
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} products!`);
    console.log('\n📊 Summary:');
    console.log(`   Total products: ${products.length}`);
    console.log(`   Updated products: ${updatedCount}`);
    console.log(`   Already correct: ${products.length - updatedCount}`);
    
    console.log('\n✅ All products now use proper image file paths instead of base64 data');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing default images:', error);
    process.exit(1);
  }
};

fixDefaultImages();
