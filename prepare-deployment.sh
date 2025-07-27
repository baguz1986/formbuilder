#!/bin/bash

# Deployment Preparation Script for cPanel
# This script creates a deployment-ready package

echo "🚀 Preparing Form Builder for cPanel deployment..."

# Create deployment directory
mkdir -p deployment

# Copy necessary files and directories
echo "📁 Copying files..."
cp -r .next deployment/
cp -r src deployment/
cp -r prisma deployment/
cp -r public deployment/
cp package.json deployment/
cp package-lock.json deployment/
cp next.config.ts deployment/
cp tailwind.config.ts deployment/
cp postcss.config.mjs deployment/
cp tsconfig.json deployment/
cp eslint.config.mjs deployment/
cp server.js deployment/
cp .env.production.template deployment/
cp DEPLOYMENT_GUIDE.md deployment/

# Create a zip file for easy upload
echo "📦 Creating deployment package..."
cd deployment
zip -r ../formbuilder-deployment.zip . -x "*.log" ".DS_Store"
cd ..

echo "✅ Deployment package created: formbuilder-deployment.zip"
echo "📋 Next steps:"
echo "1. Upload formbuilder-deployment.zip to your cPanel File Manager"
echo "2. Extract the zip file in your domain's root directory"
echo "3. Copy .env.production.template to .env.local and update values"
echo "4. Follow the DEPLOYMENT_GUIDE.md for complete setup"
echo ""
echo "🔍 Files included in deployment package:"
ls -la deployment/
