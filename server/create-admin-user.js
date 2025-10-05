const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Connection string from .env
const COSMOS_CONNECTION_STRING = 'mongodb+srv://capersports:Ritesh%400611@capersports-cosmos.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000';

async function createAdminUser() {
  console.log('👤 Creating admin user for Azure Cosmos DB...');
  
  let client = null;
  
  try {
    client = new MongoClient(COSMOS_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    await client.connect();
    console.log('✅ Connected to Azure Cosmos DB');
    
    const db = client.db('capersports');
    const usersCollection = db.collection('users');
    
    // Check if admin user already exists
    const existingAdmin = await usersCollection.findOne({ 
      $or: [
        { email: 'admin@capersports.com' },
        { role: 'admin' }
      ]
    });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.firstName} ${existingAdmin.lastName}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log(`   Created: ${existingAdmin.createdAt}`);
      return;
    }
    
    // Hash the password
    const password = 'Admin@123456';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create admin user data
    const adminUser = {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@capersports.com',
      password: hashedPassword,
      role: 'admin',
      isActive: true,
      isEmailVerified: true,
      permissions: [
        'manage_products',
        'manage_orders', 
        'manage_users',
        'view_analytics',
        'manage_settings',
        'manage_invoices',
        'manage_payments',
        'full_access'
      ],
      profilePicture: '/images/capersports-logo.png',
      phone: '+91-9876543210',
      address: {
        street: 'Caper Sports HQ',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India'
      },
      preferences: {
        notifications: {
          email: true,
          sms: true,
          push: true
        },
        theme: 'light',
        language: 'en'
      },
      loginHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: null
    };
    
    const result = await usersCollection.insertOne(adminUser);
    console.log('✅ Admin user created successfully!');
    console.log(`   User ID: ${result.insertedId}`);
    
    // Verify the user was created
    const userCount = await usersCollection.countDocuments({ role: 'admin' });
    console.log(`📊 Total admin users in database: ${userCount}`);
    
    console.log('\n🎉 Admin user created successfully!');
    console.log('📋 Login Credentials:');
    console.log('   📧 Email: admin@capersports.com');
    console.log('   🔐 Password: Admin@123456');
    console.log('   👑 Role: admin');
    console.log('   🔑 Permissions: Full Access');
    
    console.log('\n🔗 Admin Dashboard:');
    console.log('   Login: http://localhost:3000/login');
    console.log('   Dashboard: http://localhost:3000/admin/dashboard');
    
    console.log('\n⚠️  SECURITY NOTE:');
    console.log('   Please change the default password after first login!');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

createAdminUser();
