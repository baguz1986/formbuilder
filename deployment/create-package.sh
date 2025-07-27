#!/bin/bash

# Script untuk setup deployment di cPanel
echo "Setting up deployment package..."

# Create deployment directory if not exists
mkdir -p deployment/cpanel-package

# Copy essential files
echo "Copying files..."
cp -r .next deployment/cpanel-package/
cp -r node_modules deployment/cpanel-package/
cp -r prisma deployment/cpanel-package/
cp -r public deployment/cpanel-package/
cp package.json deployment/cpanel-package/
cp server.js deployment/cpanel-package/
cp next.config.ts deployment/cpanel-package/

# Copy environment template
cp .env.production deployment/cpanel-package/.env

echo "Deployment package created in deployment/cpanel-package/"
echo "Instructions:"
echo "1. Upload all files from deployment/cpanel-package/ to your cPanel directory"
echo "2. Set environment variables in cPanel Node.js App:"
echo "   - DATABASE_URL=mysql://username:password@localhost/database"
echo "   - NEXTAUTH_URL=https://forms.msdmiki.my.id"
echo "   - NEXTAUTH_SECRET=63e9572da8a3fe653060dcf912b361335acb0985165377549936cbee9d9dc873c"
echo "3. Run the MySQL init script in phpMyAdmin"
echo "4. Set Application Startup File to: server.js"
echo "5. Start the application"
