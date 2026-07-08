const { execSync, spawn } = require('child_process');
const http = require('http');

console.log('🔍 Running Capstone Project Sanity Tests...');

let serverProcess = null;

function waitOnServer(url, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const interval = setInterval(() => {
      if (Date.now() - start > timeoutMs) {
        clearInterval(interval);
        reject(new Error('Backend server start timed out. Make sure MongoDB is running.'));
      }
      http.get(url, (res) => {
        clearInterval(interval);
        resolve();
      }).on('error', () => {
        // Keep waiting
      });
    }, 500);
  });
}

async function run() {
  try {
    console.log('\n1. Checking Client Linting...');
    execSync('npm run lint --prefix client', { stdio: 'inherit' });
    console.log('✅ Client Linting Passed!');

    console.log('\n2. Checking Client Production Build...');
    execSync('npm run build --prefix client', { stdio: 'inherit' });
    console.log('✅ Client Production Build Passed!');

    console.log('\n3. Starting Backend Server for API Integration Tests...');
    serverProcess = spawn('node', ['server/src/server.js'], {
      stdio: 'ignore', // Keep server logs hidden to avoid polluting the test run
      detached: false
    });

    console.log('⏳ Waiting for server to become healthy...');
    await waitOnServer('http://localhost:5000/');
    console.log('✅ Backend Server is live!');

    console.log('\n4. Checking Backend API Integration and MongoDB Storage...');
    execSync('node test-backend-api.js', { 
      env: { ...process.env, NODE_PATH: './server/node_modules' }, 
      stdio: 'inherit' 
    });
    console.log('✅ Backend API Integration Passed!');

    console.log('\n🎉 All sanity checks passed successfully!');
  } catch (error) {
    console.error('\n❌ Test execution failed:', error.message);
    process.exit(1);
  } finally {
    if (serverProcess) {
      console.log('\nStopping backend test server...');
      serverProcess.kill();
      console.log('✅ Backend test server stopped.');
    }
  }
}

run();
