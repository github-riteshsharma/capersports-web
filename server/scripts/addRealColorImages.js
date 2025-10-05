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

const addRealColorImages = async () => {
  try {
    console.log('📸 Adding real color-specific images to products...\n');
    
    const products = await Product.find({});
    console.log(`Found ${products.length} products to update\n`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      // Skip if product doesn't have colors
      if (!product.colors || product.colors.length === 0) {
        console.log(`⏭️  Skipping "${product.name}" - no colors defined`);
        continue;
      }
      
      let needsUpdate = false;
      const updatedColors = product.colors.map(color => {
        // Only update if color doesn't already have real images
        if (!color.images || color.images.length === 0 || 
            color.images.some(img => img.includes('polo-'))) {
          
          needsUpdate = true;
          
          // Create realistic image paths based on product and color
          const productSlug = product.name.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
          
          const colorSlug = color.name.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
          
          // Generate multiple image paths for each color
          const colorImages = [
            `/images/products/${productSlug}/${colorSlug}/front.jpg`,
            `/images/products/${productSlug}/${colorSlug}/back.jpg`,
            `/images/products/${productSlug}/${colorSlug}/side.jpg`,
            `/images/products/${productSlug}/${colorSlug}/detail.jpg`
          ];
          
          return {
            ...color.toObject(),
            images: colorImages
          };
        }
        
        return color;
      });
      
      if (needsUpdate) {
        await Product.findByIdAndUpdate(product._id, {
          colors: updatedColors
        });
        
        console.log(`✅ Updated "${product.name}" with real color-specific image paths`);
        console.log(`   Colors updated: ${updatedColors.map(c => c.name).join(', ')}`);
        updatedCount++;
      } else {
        console.log(`⏭️  Skipping "${product.name}" - already has real color images`);
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} products with real color-specific image paths!`);
    console.log('\n📸 Image Structure Created:');
    console.log('   /images/products/[product-slug]/[color-slug]/front.jpg');
    console.log('   /images/products/[product-slug]/[color-slug]/back.jpg');
    console.log('   /images/products/[product-slug]/[color-slug]/side.jpg');
    console.log('   /images/products/[product-slug]/[color-slug]/detail.jpg');
    console.log('\n📊 Summary:');
    console.log(`   Total products: ${products.length}`);
    console.log(`   Updated products: ${updatedCount}`);
    console.log(`   Skipped products: ${products.length - updatedCount}`);
    
    console.log('\n📝 Next Steps:');
    console.log('1. Upload actual product photos to the image paths shown above');
    console.log('2. Organize photos by product and color in the public/images/products/ directory');
    console.log('3. Each color should have front, back, side, and detail photos');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding real color images:', error);
    process.exit(1);
  }
};

addRealColorImages();
