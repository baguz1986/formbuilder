#!/bin/bash

# Setup script untuk cPanel deployment
# Jalankan dengan: bash setup.sh

echo "🚀 Form Builder cPanel Setup Script"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the application root directory."
    exit 1
fi

print_status "Starting setup process..."

# Step 1: Install dependencies
echo ""
echo "📦 Installing dependencies..."
if npm install; then
    print_status "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 2: Check environment file
echo ""
echo "🔐 Checking environment configuration..."
if [ ! -f ".env.local" ]; then
    if [ -f ".env.production.template" ]; then
        cp .env.production.template .env.local
        print_warning "Created .env.local from template. Please update it with your actual values:"
        echo "  - NEXTAUTH_URL=https://forms.msdmiki.my.id"
        echo "  - NEXTAUTH_SECRET=your-secret-key-here"
        echo "  - DATABASE_URL=your-database-connection-string"
    else
        print_error ".env.local file is missing and no template found"
        echo "Please create .env.local with required environment variables"
    fi
else
    print_status "Environment file found"
fi

# Step 3: Generate Prisma client
echo ""
echo "🗃️  Setting up database..."
if npx prisma generate; then
    print_status "Prisma client generated successfully"
else
    print_warning "Prisma generate failed. This might be expected if DATABASE_URL is not set yet."
fi

# Step 4: Build the application
echo ""
echo "🔨 Building application..."
if npm run build; then
    print_status "Application built successfully"
else
    print_error "Build failed. Check the error messages above."
    exit 1
fi

# Step 5: Check required files
echo ""
echo "📁 Verifying installation..."
required_files=(".next" "node_modules" "server.js" "package.json")
for file in "${required_files[@]}"; do
    if [ -e "$file" ]; then
        print_status "$file exists"
    else
        print_error "$file is missing"
    fi
done

echo ""
print_status "Setup completed!"
echo ""
echo "🎯 Next steps:"
echo "1. Update .env.local with your actual values"
echo "2. Run 'npx prisma db push' after setting DATABASE_URL"
echo "3. Restart your Node.js application in cPanel"
echo "4. Your app should be available at: https://forms.msdmiki.my.id"
echo ""
echo "🔧 If you encounter issues:"
echo "- Run: node diagnostic.js"
echo "- Check cPanel Node.js app logs"
echo "- Verify environment variables are set correctly"
