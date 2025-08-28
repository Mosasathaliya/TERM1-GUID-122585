const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  buildDir: 'out',
  excludeDirs: ['.next', 'node_modules', '.git'],
  maxFileSize: 25 * 1024 * 1024, // 25MB
};

// Helper function to get human-readable file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Main deployment function
async function deploy() {
  try {
    console.log('🚀 Starting deployment to Cloudflare Pages...');
    
    // 1. Clean previous build
    if (fs.existsSync(CONFIG.buildDir)) {
      console.log(`🧹 Cleaning previous build in ${CONFIG.buildDir}...`);
      fs.rmSync(CONFIG.buildDir, { recursive: true, force: true });
    }

    // 2. Build the project
    console.log('🏗️  Building Next.js application...');
    execSync('pnpm run build', { stdio: 'inherit' });

    // 3. Verify build output
    if (!fs.existsSync(CONFIG.buildDir)) {
      throw new Error(`Build failed: ${CONFIG.buildDir} directory not found`);
    }

    // 4. Check for large files
    console.log('🔍 Checking for large files...');
    checkLargeFiles(CONFIG.buildDir);

    // 5. Deploy to Cloudflare Pages
    console.log('🚀 Deploying to Cloudflare Pages...');
    execSync(`npx wrangler pages deploy ${CONFIG.buildDir} --project-name=al-dalil-guide`, { stdio: 'inherit' });

    console.log('✅ Deployment completed successfully!');
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Check for large files
function checkLargeFiles(dir) {
  const files = fs.readdirSync(dir);
  let hasLargeFiles = false;

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!CONFIG.excludeDirs.includes(file)) {
        checkLargeFiles(filePath);
      }
    } else if (stat.size > CONFIG.maxFileSize) {
      console.warn(`⚠️  Warning: File exceeds ${formatFileSize(CONFIG.maxFileSize)} limit: ${filePath} (${formatFileSize(stat.size)})`);
      hasLargeFiles = true;
    }
  });

  if (hasLargeFiles) {
    throw new Error('Build contains files that exceed the 25MB limit. Please optimize your assets.');
  }
}

// Run the deployment
deploy();
