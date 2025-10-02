const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected for seeding'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Sample users
const users = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@capersports.com',
    password: 'admin123',
    role: 'admin',
    phone: '9876543210',
    isActive: true,
    isEmailVerified: true,
  },
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    phone: '9876543211',
    isActive: true,
    isEmailVerified: true,
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
    phone: '9876543212',
    isActive: true,
    isEmailVerified: true,
  },
];

// Sample products
const products = [
  {
    name: 'Premium Running Shoes',
    description: 'High-performance running shoes with advanced cushioning and breathable mesh upper. Perfect for long-distance running and daily training.',
    price: 4999,
    originalPrice: 5999,
    discount: 17,
    category: 'Shoes',
    subCategory: 'Running',
    brand: 'CaperSports',
    colors: [
      { name: 'Black', hex: '#000000', images: ['/uploads/products/running-shoes-black.svg'] },
      { name: 'White', hex: '#ffffff', images: ['/uploads/products/running-shoes-white.svg'] },
      { name: 'Blue', hex: '#3b82f6', images: ['/uploads/products/running-shoes-blue.svg'] },
    ],
    sizes: [
      { size: '7', stock: 10 },
      { size: '8', stock: 15 },
      { size: '9', stock: 20 },
      { size: '10', stock: 12 },
      { size: '11', stock: 8 },
    ],
    images: [
      '/uploads/products/running-shoes-1.svg',
      '/uploads/products/running-shoes-2.svg',
    ],
    gender: 'Unisex',
    ageGroup: 'Adult',
    material: 'Synthetic mesh with rubber sole',
    careInstructions: 'Wipe clean with damp cloth. Air dry.',
    features: ['Breathable mesh upper', 'Cushioned sole', 'Lightweight design', 'Durable construction'],
    tags: ['running', 'sports', 'fitness', 'comfort'],
    isFeatured: true,
    isOnSale: true,
    totalStock: 65,
    weight: 300,
    dimensions: { length: 30, width: 12, height: 10 },
    sku: 'CS-RUN-001',
    seoTitle: 'Premium Running Shoes - CaperSports',
    seoDescription: 'High-performance running shoes with advanced cushioning. Perfect for athletes and fitness enthusiasts.',
    seoKeywords: ['running shoes', 'sports shoes', 'athletic footwear'],
  },
  {
    name: 'Athletic Performance T-Shirt',
    description: 'Moisture-wicking athletic t-shirt made from premium blend fabric. Designed for maximum comfort during intense workouts.',
    price: 1299,
    originalPrice: 1699,
    discount: 24,
    category: 'T-Shirts',
    subCategory: 'Athletic',
    brand: 'CaperSports',
    colors: [
      { name: 'Navy', hex: '#1e40af', images: ['/uploads/products/tshirt-navy.svg'] },
      { name: 'Red', hex: '#dc2626', images: ['/uploads/products/tshirt-red.svg'] },
      { name: 'Gray', hex: '#6b7280', images: ['/uploads/products/tshirt-gray.svg'] },
    ],
    sizes: [
      { size: 'S', stock: 25 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 35 },
      { size: 'XL', stock: 20 },
      { size: 'XXL', stock: 15 },
    ],
    images: [
      '/uploads/products/athletic-tshirt-1.svg',
      '/uploads/products/athletic-tshirt-2.svg',
    ],
    gender: 'Men',
    ageGroup: 'Adult',
    material: '100% Polyester with moisture-wicking technology',
    careInstructions: 'Machine wash cold. Tumble dry low.',
    features: ['Moisture-wicking', 'Quick-dry', 'Breathable', 'Odor-resistant'],
    tags: ['t-shirt', 'athletic', 'workout', 'fitness'],
    isFeatured: true,
    isOnSale: true,
    totalStock: 125,
    weight: 150,
    dimensions: { length: 70, width: 50, height: 1 },
    sku: 'CS-TSH-001',
    seoTitle: 'Athletic Performance T-Shirt - CaperSports',
    seoDescription: 'Moisture-wicking athletic t-shirt for maximum comfort during workouts.',
    seoKeywords: ['athletic t-shirt', 'workout shirt', 'performance wear'],
  },
  {
    name: 'Training Shorts',
    description: 'Lightweight training shorts with elastic waistband and side pockets. Perfect for gym sessions and outdoor activities.',
    price: 999,
    originalPrice: 1299,
    discount: 23,
    category: 'Shorts',
    subCategory: 'Training',
    brand: 'CaperSports',
    colors: [
      { name: 'Black', hex: '#000000', images: ['/uploads/products/shorts-black.svg'] },
      { name: 'Navy', hex: '#1e40af', images: ['/uploads/products/shorts-navy.svg'] },
      { name: 'Gray', hex: '#6b7280', images: ['/uploads/products/shorts-gray.svg'] },
    ],
    sizes: [
      { size: 'S', stock: 20 },
      { size: 'M', stock: 25 },
      { size: 'L', stock: 30 },
      { size: 'XL', stock: 15 },
      { size: 'XXL', stock: 10 },
    ],
    images: [
      '/uploads/products/training-shorts-1.svg',
      '/uploads/products/training-shorts-2.svg',
    ],
    gender: 'Men',
    ageGroup: 'Adult',
    material: '100% Polyester with stretch',
    careInstructions: 'Machine wash cold. Tumble dry low.',
    features: ['Elastic waistband', 'Side pockets', 'Lightweight', 'Quick-dry'],
    tags: ['shorts', 'training', 'gym', 'workout'],
    isFeatured: true,
    isOnSale: true,
    totalStock: 100,
    weight: 120,
    dimensions: { length: 40, width: 35, height: 1 },
    sku: 'CS-SHT-001',
    seoTitle: 'Training Shorts - CaperSports',
    seoDescription: 'Lightweight training shorts perfect for gym sessions and outdoor activities.',
    seoKeywords: ['training shorts', 'gym shorts', 'workout wear'],
  },
  {
    name: 'Women\'s Sports Bra',
    description: 'High-support sports bra with moisture-wicking fabric. Designed for maximum comfort and support during intense workouts.',
    price: 1899,
    originalPrice: 2499,
    discount: 24,
    category: 'Sportswear',
    subCategory: 'Sports Bra',
    brand: 'CaperSports',
    colors: [
      { name: 'Black', hex: '#000000', images: ['/uploads/products/bra-black.svg'] },
      { name: 'Pink', hex: '#ec4899', images: ['/uploads/products/bra-pink.svg'] },
      { name: 'White', hex: '#ffffff', images: ['/uploads/products/bra-white.svg'] },
    ],
    sizes: [
      { size: 'XS', stock: 15 },
      { size: 'S', stock: 20 },
      { size: 'M', stock: 25 },
      { size: 'L', stock: 20 },
      { size: 'XL', stock: 10 },
    ],
    images: [
      '/uploads/products/sports-bra-1.svg',
      '/uploads/products/sports-bra-2.svg',
    ],
    gender: 'Women',
    ageGroup: 'Adult',
    material: '90% Polyester, 10% Spandex',
    careInstructions: 'Machine wash cold. Air dry.',
    features: ['High support', 'Moisture-wicking', 'Breathable', 'Comfortable fit'],
    tags: ['sports bra', 'women', 'fitness', 'support'],
    isFeatured: true,
    isOnSale: true,
    totalStock: 90,
    weight: 100,
    dimensions: { length: 25, width: 20, height: 1 },
    sku: 'CS-BRA-001',
    seoTitle: 'Women\'s Sports Bra - CaperSports',
    seoDescription: 'High-support sports bra with moisture-wicking fabric for intense workouts.',
    seoKeywords: ['sports bra', 'women\'s fitness', 'athletic wear'],
  },
  {
    name: 'Compression Leggings',
    description: 'High-performance compression leggings with four-way stretch fabric. Perfect for yoga, running, and all fitness activities.',
    price: 2299,
    originalPrice: 2999,
    discount: 23,
    category: 'Pants',
    subCategory: 'Leggings',
    brand: 'CaperSports',
    colors: [
      { name: 'Black', hex: '#000000', images: ['/uploads/products/leggings-black.svg'] },
      { name: 'Navy', hex: '#1e40af', images: ['/uploads/products/leggings-navy.svg'] },
      { name: 'Gray', hex: '#6b7280', images: ['/uploads/products/leggings-gray.svg'] },
    ],
    sizes: [
      { size: 'XS', stock: 18 },
      { size: 'S', stock: 25 },
      { size: 'M', stock: 30 },
      { size: 'L', stock: 22 },
      { size: 'XL', stock: 15 },
    ],
    images: [
      '/uploads/products/compression-leggings-1.svg',
      '/uploads/products/compression-leggings-2.svg',
    ],
    gender: 'Women',
    ageGroup: 'Adult',
    material: '75% Nylon, 25% Spandex',
    careInstructions: 'Machine wash cold. Air dry.',
    features: ['Compression fit', 'Four-way stretch', 'Moisture-wicking', 'High waistband'],
    tags: ['leggings', 'compression', 'yoga', 'running'],
    isFeatured: true,
    isOnSale: true,
    totalStock: 110,
    weight: 200,
    dimensions: { length: 95, width: 30, height: 1 },
    sku: 'CS-LEG-001',
    seoTitle: 'Compression Leggings - CaperSports',
    seoDescription: 'High-performance compression leggings with four-way stretch for all fitness activities.',
    seoKeywords: ['compression leggings', 'yoga pants', 'fitness wear'],
  },
  {
    name: 'Performance Hoodie',
    description: 'Comfortable performance hoodie with moisture-wicking technology. Perfect for pre and post-workout wear.',
    price: 3499,
    originalPrice: 4299,
    discount: 19,
    category: 'Hoodies',
    subCategory: 'Performance',
    brand: 'CaperSports',
    colors: [
      { name: 'Gray', hex: '#6b7280', images: ['/uploads/products/hoodie-gray.svg'] },
      { name: 'Navy', hex: '#1e40af', images: ['/uploads/products/hoodie-navy.svg'] },
      { name: 'Black', hex: '#000000', images: ['/uploads/products/hoodie-black.svg'] },
    ],
    sizes: [
      { size: 'S', stock: 12 },
      { size: 'M', stock: 18 },
      { size: 'L', stock: 22 },
      { size: 'XL', stock: 15 },
      { size: 'XXL', stock: 8 },
    ],
    images: [
      '/uploads/products/performance-hoodie-1.svg',
      '/uploads/products/performance-hoodie-2.svg',
    ],
    gender: 'Unisex',
    ageGroup: 'Adult',
    material: '80% Cotton, 20% Polyester',
    careInstructions: 'Machine wash cold. Tumble dry low.',
    features: ['Moisture-wicking', 'Comfortable fit', 'Kangaroo pocket', 'Adjustable hood'],
    tags: ['hoodie', 'performance', 'casual', 'comfort'],
    isFeatured: true,
    isOnSale: true,
    totalStock: 75,
    weight: 500,
    dimensions: { length: 70, width: 55, height: 2 },
    sku: 'CS-HOD-001',
    seoTitle: 'Performance Hoodie - CaperSports',
    seoDescription: 'Comfortable performance hoodie with moisture-wicking technology for pre and post-workout wear.',
    seoKeywords: ['performance hoodie', 'athletic wear', 'workout clothes'],
  },
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create admin user first
    const adminUser = await User.create(users[0]);
    console.log('✅ Created admin user');

    // Create other users
    const otherUsers = await User.create(users.slice(1));
    console.log('✅ Created regular users');

    // Add createdBy field to products
    const productsWithCreator = products.map(product => ({
      ...product,
      createdBy: adminUser._id,
    }));

    // Create products
    await Product.create(productsWithCreator);
    console.log('✅ Created products');

    console.log('🎉 Database seeding completed successfully!');
    console.log(`
    📊 Summary:
    - Users: ${users.length}
    - Products: ${products.length}
    
    🔑 Login Credentials:
    Admin: admin@capersports.com / admin123
    User: john@example.com / password123
    `);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit(0);
  }
};

// Run seeding
seedDatabase();
