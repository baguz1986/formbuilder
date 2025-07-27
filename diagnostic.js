// Diagnostic script untuk cPanel deployment
// Jalankan dengan: node diagnostic.js

console.log('🔍 Form Builder Diagnostic Script');
console.log('=====================================');

// Check environment
console.log('📊 Environment Information:');
console.log('- Node.js version:', process.version);
console.log('- Platform:', process.platform);
console.log('- Architecture:', process.arch);
console.log('- Working directory:', process.cwd());
console.log('- NODE_ENV:', process.env.NODE_ENV || 'not set');

// Check files
const fs = require('fs');
const path = require('path');

console.log('\n📁 File System Check:');

const requiredFiles = [
  'package.json',
  'next.config.ts',
  'server.js',
  '.next',
  'src',
  'prisma',
  'public'
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`- ${file}: ${exists ? '✅ Found' : '❌ Missing'}`);
});

// Check environment variables
console.log('\n🔐 Environment Variables Check:');
const requiredEnvVars = [
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'DATABASE_URL'
];

requiredEnvVars.forEach(envVar => {
  const exists = process.env[envVar];
  console.log(`- ${envVar}: ${exists ? '✅ Set' : '❌ Missing'}`);
});

// Check .env files
console.log('\n📄 Environment Files Check:');
const envFiles = ['.env', '.env.local', '.env.production'];
envFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`- ${file}: ${exists ? '✅ Found' : '❌ Missing'}`);
});

// Check package.json
console.log('\n📦 Package.json Check:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('- Name:', packageJson.name);
  console.log('- Version:', packageJson.version);
  console.log('- Scripts:', Object.keys(packageJson.scripts || {}));
  console.log('- Dependencies count:', Object.keys(packageJson.dependencies || {}).length);
} catch (error) {
  console.log('❌ Error reading package.json:', error.message);
}

// Check node_modules
console.log('\n📚 Dependencies Check:');
const nodeModulesExists = fs.existsSync('node_modules');
console.log(`- node_modules: ${nodeModulesExists ? '✅ Found' : '❌ Missing - Run npm install'}`);

if (nodeModulesExists) {
  const nextExists = fs.existsSync('node_modules/next');
  const reactExists = fs.existsSync('node_modules/react');
  const prismaExists = fs.existsSync('node_modules/prisma');
  
  console.log(`- Next.js: ${nextExists ? '✅ Installed' : '❌ Missing'}`);
  console.log(`- React: ${reactExists ? '✅ Installed' : '❌ Missing'}`);
  console.log(`- Prisma: ${prismaExists ? '✅ Installed' : '❌ Missing'}`);
}

// Test Next.js
console.log('\n⚡ Next.js Test:');
try {
  const next = require('next');
  console.log('✅ Next.js module can be loaded');
} catch (error) {
  console.log('❌ Next.js module error:', error.message);
}

console.log('\n🎯 Recommendations:');
console.log('1. If node_modules is missing: Run "npm install"');
console.log('2. If environment variables are missing: Create .env.local file');
console.log('3. If database errors occur: Run "npx prisma generate" and "npx prisma db push"');
console.log('4. Check cPanel Node.js app configuration');
console.log('5. Restart the Node.js application after fixes');

console.log('\n✅ Diagnostic complete!');
