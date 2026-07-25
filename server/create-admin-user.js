/**
 * One-off utility to create (or verify) an admin user in MongoDB.
 *
 * Usage:
 *   MONGODB_URI=... ADMIN_EMAIL=... ADMIN_PASSWORD=... node create-admin-user.js
 *
 * Falls back to `.env` values (MONGODB_URI) and sensible defaults for the
 * admin email/password if the corresponding env vars are not provided.
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function createAdminUser() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('❌ MONGODB_URI is not set. Please set it in your .env file or environment.');
    process.exit(1);
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@capersports.com';
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('❌ ADMIN_PASSWORD is not set. Please provide one via the ADMIN_PASSWORD env var.');
    process.exit(1);
  }

  console.log('👤 Creating admin user...');

  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const existingAdmin = await User.findOne({
      $or: [{ email: adminEmail }, { role: 'admin' }],
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists:');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.firstName} ${existingAdmin.lastName}`);
      console.log(`   Role: ${existingAdmin.role}`);
      return;
    }

    const admin = await User.create({
      firstName: process.env.ADMIN_FIRST_NAME || 'Admin',
      lastName: process.env.ADMIN_LAST_NAME || 'User',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isActive: true,
      isEmailVerified: true,
    });

    console.log('✅ Admin user created successfully!');
    console.log(`   User ID: ${admin._id}`);
    console.log(`   Email: ${admin.email}`);
    console.log('\n⚠️  SECURITY NOTE: Please rotate/change the password after first login.');
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

createAdminUser();
