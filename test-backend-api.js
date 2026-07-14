require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');
const User = require('./server/src/models/userModel');

const API_URL = 'http://localhost:5000/api/v1';

async function runApiTests() {
  console.log('📡 Starting Backend API Route Integration Tests...');
  const testEmail = `testrunner_${Date.now()}@example.com`;
  const signupData = {
    name: 'Sanity Test User',
    email: testEmail,
    password: 'initialpassword123',
    role: 'donor',
    location: 'Mumbai, IN'
  };

  let token = '';

  try {
    // 1. Basic Health Check
    console.log('- Checking base endpoint...');
    const health = await fetch('http://localhost:5000/');
    const healthRes = await health.json();
    if (!healthRes.message || !healthRes.message.includes('running')) {
      throw new Error('API server not responding');
    }
    console.log('✅ Base endpoint responded');

    // 2. Signup Test
    console.log('- Testing user signup...');
    const signup = await fetch(`${API_URL}/users/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signupData)
    });
    const signupRes = await signup.json();
    if (signup.status !== 201 || signupRes.status !== 'success') {
      throw new Error(`Signup failed: ${signupRes.message}`);
    }
    token = signupRes.token;
    console.log('✅ Signup endpoint successful');

    // 3. Login Test
    console.log('- Testing user login...');
    const login = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'initialpassword123' })
    });
    const loginRes = await login.json();
    if (login.status !== 200 || loginRes.status !== 'success') {
      throw new Error(`Login failed: ${loginRes.message}`);
    }
    console.log('✅ Login endpoint successful');

    // 4. Update Profile (updateMe) Test
    console.log('- Testing profile update (updateMe)...');
    const updateMeData = {
      name: 'Sanity Redesigned Name',
      bio: 'This is a bio updated by the test runner.',
      website: 'https://testrunner.org',
      phone: '9876543210',
      location: 'New Mumbai, IN'
    };
    const update = await fetch(`${API_URL}/users/updateMe`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateMeData)
    });
    const updateRes = await update.json();
    if (update.status !== 200 || updateRes.status !== 'success') {
      throw new Error(`UpdateMe failed: ${updateRes.message}`);
    }
    console.log('✅ UpdateMe endpoint successful');

    // 5. Verify Database Fetch (getMe) Test
    console.log('- Verifying profile updates from MongoDB...');
    const me = await fetch(`${API_URL}/users/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const meRes = await me.json();
    if (me.status !== 200 || meRes.data.user.name !== 'Sanity Redesigned Name') {
      throw new Error('Database updates not correctly stored or returned');
    }
    console.log('✅ MongoDB data retrieval and validation verified!');

    // 6. Update Password Test
    console.log('- Testing updatePassword endpoint...');
    const pwUpdate = await fetch(`${API_URL}/users/updatePassword`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPassword: 'initialpassword123',
        newPassword: 'newsecurepassword123'
      })
    });
    const pwRes = await pwUpdate.json();
    if (pwUpdate.status !== 200 || pwRes.status !== 'success') {
      throw new Error(`UpdatePassword failed: ${pwRes.message}`);
    }
    console.log('✅ Password update successful');

    // 7. Verify Login with New Password
    console.log('- Verifying login with updated password...');
    const checkLogin = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'newsecurepassword123' })
    });
    if (checkLogin.status !== 200) {
      throw new Error('Login with updated password failed');
    }
    console.log('✅ Auth credential validation verified!');

    console.log('🎉 All Backend API checks passed successfully!');
  } finally {
    // Cleanup: Connect to MongoDB and delete the test user
    console.log('- Cleaning up test data from MongoDB...');
    const DB =
      process.env.MONGODB_URI ||
      process.env.DATABASE_URL ||
      'mongodb://127.0.0.1:27017/resourcematcher';
    await mongoose.connect(DB);
    await User.deleteOne({ email: testEmail });
    await mongoose.disconnect();
    console.log('✅ Cleanup completed!');
  }
}

runApiTests().catch(err => {
  console.error('\n❌ API Tests failed:', err.message);
  process.exit(1);
});
