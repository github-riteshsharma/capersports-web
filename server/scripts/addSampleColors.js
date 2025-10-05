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

const addSampleColors = async () => {
  try {
    console.log('🎨 Adding sample color data to products...\n');
    
    const products = await Product.find({});
    console.log(`Found ${products.length} products to update\n`);
    
    let updatedCount = 0;
    
    for (const product of products) {
      // Skip if product already has colors
      if (product.colors && product.colors.length > 0) {
        console.log(`⏭️  Skipping "${product.name}" - already has colors`);
        continue;
      }
      
      // Sample color data based on product type
      let sampleColors = [];
      
      if (product.name.toLowerCase().includes('polo') || product.name.toLowerCase().includes('t-shirt')) {
        sampleColors = [
          {
            name: 'Navy Blue',
            hex: '#1E3A8A',
            images: [
              '/images/products/polo-navy-1.jpg',
              '/images/products/polo-navy-2.jpg'
            ]
          },
          {
            name: 'White',
            hex: '#FFFFFF',
            images: [
              '/images/products/polo-white-1.jpg',
              '/images/products/polo-white-2.jpg'
            ]
          },
          {
            name: 'Black',
            hex: '#000000',
            images: [
              '/images/products/polo-black-1.jpg',
              '/images/products/polo-black-2.jpg'
            ]
          },
          {
            name: 'Red',
            hex: '#DC2626',
            images: [
              '/images/products/polo-red-1.jpg'
            ]
          }
        ];
      } else if (product.name.toLowerCase().includes('hoodie')) {
        sampleColors = [
          {
            name: 'Gray',
            hex: '#6B7280',
            images: [
              '/images/products/hoodie-gray-1.jpg',
              '/images/products/hoodie-gray-2.jpg'
            ]
          },
          {
            name: 'Black',
            hex: '#000000',
            images: [
              '/images/products/hoodie-black-1.jpg'
            ]
          },
          {
            name: 'Navy Blue',
            hex: '#1E3A8A',
            images: [
              '/images/products/hoodie-navy-1.jpg'
            ]
          }
        ];
      } else if (product.name.toLowerCase().includes('jacket')) {
        sampleColors = [
          {
            name: 'Black',
            hex: '#000000',
            images: [
              '/images/products/jacket-black-1.jpg',
              '/images/products/jacket-black-2.jpg'
            ]
          },
          {
            name: 'Navy Blue',
            hex: '#1E3A8A',
            images: [
              '/images/products/jacket-navy-1.jpg'
            ]
          }
        ];
      } else {
        // Default colors for other products
        sampleColors = [
          {
            name: 'Black',
            hex: '#000000',
            images: []
          },
          {
            name: 'White',
            hex: '#FFFFFF',
            images: []
          },
          {
            name: 'Gray',
            hex: '#6B7280',
            images: []
          }
        ];
      }
      
      // Update the product with sample colors
      await Product.findByIdAndUpdate(product._id, {
        colors: sampleColors
      });
      
      console.log(`✅ Added ${sampleColors.length} colors to "${product.name}"`);
      updatedCount++;
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} products with color data!`);
    console.log('\n📊 Summary:');
    console.log(`   Total products: ${products.length}`);
    console.log(`   Updated products: ${updatedCount}`);
    console.log(`   Skipped products: ${products.length - updatedCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample colors:', error);
    process.exit(1);
  }
};

addSampleColors();
