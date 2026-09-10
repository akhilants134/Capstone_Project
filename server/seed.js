/**
 * Seed Script — creates default users for all roles
 * Run: node seed.js  (from server/ directory)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/userModel');

const DB =
  process.env.MONGODB_URI ||
  process.env.DATABASE_URL ||
  'mongodb://127.0.0.1:27017/resourcematcher';

const seedUsers = [
  {
    name: 'Admin',
    email: 'admin@resourcematch.com',
    password: 'Admin@123',
    role: 'admin',
    category: 'tech',
    bio: 'Platform administrator',
    location: 'System',
  },
  {
    name: 'Donor User',
    email: 'donor@demo.com',
    password: 'demo1234',
    role: 'donor',
    category: 'tech',
    bio: 'Demo donor account',
    location: 'Demo City',
  },
  {
    name: 'Recipient User',
    email: 'recipient@demo.com',
    password: 'demo1234',
    role: 'recipient',
    category: 'medical',
    bio: 'Demo recipient account',
    location: 'Demo City',
  },
  {
    name: 'Community User',
    email: 'community@demo.com',
    password: 'demo1234',
    role: 'community',
    category: 'education',
    bio: 'Demo community account',
    location: 'Demo City',
  },
];

async function seed() {
  try {
    await mongoose.connect(DB);
    console.log('✅ Connected to MongoDB');

    for (const userData of seedUsers) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`⏭  Skipped (already exists): ${userData.email} [${userData.role}]`);
      } else {
        await User.create(userData);
        console.log(`✅ Created: ${userData.email} [${userData.role}]`);
      }
    }

    console.log('\n📋 All users:');
    console.log('┌─────────────────────────────────┬─────────────┐');
    console.log('│ Email                           │ Role        │');
    console.log('├─────────────────────────────────┼─────────────┤');
    console.log('│ admin@resourcematch.com         │ admin       │');
    console.log('│ donor@demo.com                  │ donor       │');
    console.log('│ recipient@demo.com              │ recipient   │');
    console.log('│ community@demo.com              │ community   │');
    console.log('└─────────────────────────────────┴─────────────┘');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Done.');
  }
}

seed();
