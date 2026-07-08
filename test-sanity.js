const { execSync } = require('child_process');

console.log('🔍 Running Capstone Project Sanity Tests...');

try {
  console.log('\n1. Checking Client Linting...');
  execSync('npm run lint --prefix client', { stdio: 'inherit' });
  console.log('✅ Client Linting Passed!');

  console.log('\n2. Checking Client Production Build...');
  execSync('npm run build --prefix client', { stdio: 'inherit' });
  console.log('✅ Client Production Build Passed!');

  console.log('\n3. Checking Backend API Integration and MongoDB Storage...');
  execSync('node test-backend-api.js', { 
    env: { ...process.env, NODE_PATH: './server/node_modules' }, 
    stdio: 'inherit' 
  });
  console.log('✅ Backend API Integration Passed!');

  console.log('\n🎉 All sanity checks passed successfully!');
} catch (error) {
  console.error('\n❌ Test execution failed.');
  process.exit(1);
}
