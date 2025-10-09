const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Client = require('../models/Client');
const User = require('../models/User');

// Load environment variables
dotenv.config();

const sampleClients = [
  {
    name: 'Abu Halifa Blasters',
    program: 'Cricket Team Kit',
    avatar: '/images/testimonials/testimonials1.png',
    clientSince: 'January 2023',
    status: 'active',
    photos: [
      '/images/testimonials/testimonials1.png',
      '/images/showcase/showcase1.jpg',
      '/images/showcase/showcase2.jpg',
      '/images/showcase/showcase3.jpg',
      '/images/products/polo-t-shirt/white/front.jpg',
      '/images/products/polo-t-shirt/black/front.jpg'
    ]
  },
  {
    name: 'Champions United',
    program: 'Team Sportswear',
    avatar: '/images/testimonials/testimonials2.png',
    clientSince: 'March 2023',
    status: 'active',
    photos: [
      '/images/testimonials/testimonials2.png',
      '/images/showcase/showcase4.jpg',
      '/images/showcase/showcase5.jpg',
      '/images/products/polo-t-shirt/navy-blue/front.jpg',
      '/images/products/polo-t-shirt/red/front.jpg'
    ]
  },
  {
    name: 'Elite Sports Club',
    program: 'Custom Athletics',
    avatar: '/images/showcase/showcase1.jpg',
    clientSince: 'June 2023',
    status: 'active',
    photos: [
      '/images/showcase/showcase1.jpg',
      '/images/showcase/showcase2.jpg',
      '/images/products/polo-t-shirt/white/side.jpg'
    ]
  },
  {
    name: 'Victory Warriors',
    program: 'Football Kit',
    avatar: '/images/showcase/showcase3.jpg',
    clientSince: 'August 2023',
    status: 'active',
    photos: [
      '/images/showcase/showcase3.jpg',
      '/images/showcase/showcase4.jpg',
      '/images/products/polo-t-shirt/black/side.jpg'
    ]
  },
  {
    name: 'Thunder Strikers',
    program: 'Cricket Whites',
    avatar: '/images/showcase/showcase5.jpg',
    clientSince: 'September 2023',
    status: 'active',
    photos: [
      '/images/showcase/showcase5.jpg',
      '/images/products/polo-t-shirt/white/back.jpg'
    ]
  },
  {
    name: 'Phoenix Rising',
    program: 'Marathon Gear',
    avatar: '/images/showcase/showcase1.jpg',
    clientSince: 'October 2023',
    status: 'active',
    photos: [
      '/images/showcase/showcase1.jpg',
      '/images/products/polo-t-shirt/navy-blue/back.jpg'
    ]
  },
  {
    name: 'Lightning Bolts',
    program: 'Basketball Kit',
    avatar: '/images/showcase/showcase2.jpg',
    clientSince: 'November 2023',
    status: 'active',
    photos: [
      '/images/showcase/showcase2.jpg',
      '/images/products/polo-t-shirt/red/back.jpg'
    ]
  },
  {
    name: 'Golden Eagles',
    program: 'Training Wear',
    avatar: '/images/showcase/showcase3.jpg',
    clientSince: 'December 2023',
    status: 'active',
    photos: [
      '/images/showcase/showcase3.jpg',
      '/images/products/polo-t-shirt/black/detail.jpg'
    ]
  }
];

async function seedClients() {
  try {
    // Connect to MongoDB or Azure Cosmos DB
    const mongoUri = process.env.AZURE_COSMOS_CONNECTION_STRING || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('❌ No database connection string found!');
      console.error('Please set either AZURE_COSMOS_CONNECTION_STRING or MONGODB_URI in your .env file');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Database connected successfully');

    // Find an admin user to associate with clients
    let adminUser = await User.findOne({ isAdmin: true });
    
    if (!adminUser) {
      console.log('⚠️  No admin user found, trying to find any user...');
      adminUser = await User.findOne();
      
      if (!adminUser) {
        console.error('❌ No users found in database!');
        console.error('💡 Please create an admin user first using: node create-admin-user.js');
        console.error('   Or sign up through the website first.');
        process.exit(1);
      }
      
      console.log(`⚠️  Using regular user: ${adminUser.email} (consider creating an admin user)`);
    } else {
      console.log(`✅ Found admin user: ${adminUser.email}`);
    }

    // Delete existing clients
    await Client.deleteMany({});
    console.log('🗑️  Deleted existing clients');

    // Add createdBy to each client
    const clientsWithCreator = sampleClients.map(client => ({
      ...client,
      createdBy: adminUser._id
    }));

    // Insert sample clients
    const insertedClients = await Client.insertMany(clientsWithCreator);
    console.log(`✅ Successfully seeded ${insertedClients.length} clients`);

    // Display seeded clients
    insertedClients.forEach(client => {
      console.log(`   - ${client.name} (${client.program})`);
    });

    console.log('\n🎉 Client seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding clients:', error);
    process.exit(1);
  }
}

// Run the seed function
seedClients();

