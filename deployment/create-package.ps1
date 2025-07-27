# PowerShell script untuk setup deployment di cPanel
Write-Host "Setting up deployment package..."

# Create deployment directory if not exists
if (!(Test-Path "deployment\cpanel-package")) {
    New-Item -ItemType Directory -Path "deployment\cpanel-package" -Force
}

# Copy essential files
Write-Host "Copying files..."
Copy-Item -Path ".next" -Destination "deployment\cpanel-package\" -Recurse -Force
Copy-Item -Path "node_modules" -Destination "deployment\cpanel-package\" -Recurse -Force
Copy-Item -Path "prisma" -Destination "deployment\cpanel-package\" -Recurse -Force
Copy-Item -Path "public" -Destination "deployment\cpanel-package\" -Recurse -Force
Copy-Item -Path "package.json" -Destination "deployment\cpanel-package\" -Force
Copy-Item -Path "server.js" -Destination "deployment\cpanel-package\" -Force
Copy-Item -Path "next.config.ts" -Destination "deployment\cpanel-package\" -Force

# Copy environment template
Copy-Item -Path ".env.production" -Destination "deployment\cpanel-package\.env" -Force

Write-Host "Deployment package created in deployment\cpanel-package\"
Write-Host "Instructions:"
Write-Host "1. Upload all files from deployment\cpanel-package\ to your cPanel directory"
Write-Host "2. Set environment variables in cPanel Node.js App:"
Write-Host "   - DATABASE_URL=mysql://username:password@localhost/database"
Write-Host "   - NEXTAUTH_URL=https://forms.msdmiki.my.id"
Write-Host "   - NEXTAUTH_SECRET=63e9572da8a3fe653060dcf912b361335acb0985165377549936cbee9d9dc873c"
Write-Host "3. Run the MySQL init script in phpMyAdmin"
Write-Host "4. Set Application Startup File to: server.js"
Write-Host "5. Start the application"
