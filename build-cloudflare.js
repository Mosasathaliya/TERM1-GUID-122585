const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔨 Building for Cloudflare Pages...');

// Clean previous builds
console.log('🧹 Cleaning previous builds...');
if (fs.existsSync(path.join(__dirname, 'out'))) {
  fs.rmSync(path.join(__dirname, 'out'), { recursive: true, force: true });
}

// Run Next.js build
console.log('🏗️  Building Next.js application...');
try {
  execSync('pnpm run build', { stdio: 'inherit' });
  
  // Verify build output
  const outDir = path.join(__dirname, 'out');
  if (!fs.existsSync(outDir)) {
    throw new Error('Build failed: out directory not found');
  }

  console.log('✅ Build completed successfully!');
  console.log('📁 Build output directory:', outDir);
  
  // List files in the out directory for verification
  console.log('\n📋 Build contents:');
  const listFiles = (dir, prefix = '') => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      const size = (stat.size / 1024).toFixed(2) + ' KB';
      console.log(`  ${prefix}${file} (${size})`);
      if (stat.isDirectory()) {
        listFiles(filePath, prefix + '  ');
      }
    });
  };
  
  listFiles(outDir);
  
  // Check for large files
  console.log('\n🔍 Checking for large files...');
  const checkLargeFiles = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        checkLargeFiles(filePath);
      } else if (stat.size > 25 * 1024 * 1024) { // 25MB
        console.warn(`⚠️  Warning: File exceeds 25MB limit: ${filePath} (${(stat.size / 1024 / 1024).toFixed(2)} MB)`);
      }
    });
  };
  
  checkLargeFiles(outDir);
  
  console.log('\n🚀 Ready to deploy to Cloudflare Pages!');
  console.log('Run: npx wrangler pages deploy out');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
