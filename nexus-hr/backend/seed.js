/**
 * Seed script — creates a default super_admin user.
 * Run once: node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI;
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;

const DEFAULT_ADMIN = {
  name: 'Super Admin',
  email: 'admin@nexushr.com',
  password: 'Admin@123456',
  role: 'super_admin',
  isActive: true,
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await User.findOne({ email: DEFAULT_ADMIN.email });
    if (existing) {
      console.log('⚠️  Admin user already exists — deleting and recreating...');
      await User.deleteOne({ email: DEFAULT_ADMIN.email });
    }
    await User.create(DEFAULT_ADMIN);
    console.log('✅ Super admin created successfully!');
    console.log('   Email   :', DEFAULT_ADMIN.email);
    console.log('   Password:', DEFAULT_ADMIN.password);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seed();
