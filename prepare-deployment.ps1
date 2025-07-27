# PowerShell Deployment Preparation Script for cPanel
# This script creates a deployment-ready package

Write-Host "🚀 Preparing Form Builder for cPanel deployment..." -ForegroundColor Green

# Create deployment directory
New-Item -ItemType Directory -Force -Path "deployment" | Out-Null

# Copy necessary files and directories
Write-Host "📁 Copying files..." -ForegroundColor Yellow
Copy-Item -Recurse -Force ".next" "deployment\"
Copy-Item -Recurse -Force "src" "deployment\"
Copy-Item -Recurse -Force "prisma" "deployment\"
Copy-Item -Recurse -Force "public" "deployment\"
Copy-Item -Force "package.json" "deployment\"
Copy-Item -Force "package-lock.json" "deployment\"
Copy-Item -Force "next.config.ts" "deployment\"
Copy-Item -Force "tailwind.config.ts" "deployment\"
Copy-Item -Force "postcss.config.mjs" "deployment\"
Copy-Item -Force "tsconfig.json" "deployment\"
Copy-Item -Force "eslint.config.mjs" "deployment\"
Copy-Item -Force "server.js" "deployment\"
Copy-Item -Force ".env.production.template" "deployment\"
Copy-Item -Force "DEPLOYMENT_GUIDE.md" "deployment\"

# Create a zip file for easy upload
Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow
Compress-Archive -Path "deployment\*" -DestinationPath "formbuilder-deployment.zip" -Force

Write-Host "✅ Deployment package created: formbuilder-deployment.zip" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Upload formbuilder-deployment.zip to your cPanel File Manager"
Write-Host "2. Extract the zip file in your domain root directory"
Write-Host "3. Copy .env.production.template to .env.local and update values"
Write-Host "4. Follow the DEPLOYMENT_GUIDE.md for complete setup"
Write-Host ""
Write-Host "🔍 Files included in deployment package:" -ForegroundColor Cyan
Get-ChildItem -Path "deployment" | Format-Table Name, Length
