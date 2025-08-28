#!/bin/bash

# Configuration
PROJECT_NAME="al-dalil-guide"
BUILD_DIR="out"

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf $BUILD_DIR

# Build the application
echo "🏗️  Building Next.js application..."
pnpm run build

# Check if build was successful
if [ ! -d "$BUILD_DIR" ]; then
  echo "❌ Build failed: $BUILD_DIR directory not found"
  exit 1
fi

# Check for large files
echo "🔍 Checking for large files..."
find $BUILD_DIR -type f -size +25M | while read file; do
  size=$(du -h "$file" | cut -f1)
  echo "❌ File too large: $file ($size)"
done

# Deploy to Cloudflare Pages
echo "🚀 Deploying to Cloudflare Pages..."
npx wrangler pages deploy $BUILD_DIR --project-name=$PROJECT_NAME

echo "✅ Deployment completed!"
