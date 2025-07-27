# cPanel Deployment Guide for Form Builder Application

## Prerequisites
- cPanel hosting with Node.js support
- Domain name configured
- Database (MySQL/PostgreSQL) created in cPanel

## Step 1: Build the Application
The application has been successfully built. The `.next` folder contains the production build.

## Step 2: Prepare Files for Upload

### Files to Upload to cPanel:
1. **Entire project directory** except:
   - `node_modules/` (will be installed on server)
   - `.git/` (not needed for production)
   - `dev.db` (local SQLite database)

### Required Files:
- `package.json` and `package-lock.json`
- `.next/` folder (production build)
- `src/` folder
- `prisma/` folder
- `public/` folder
- All config files: `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, etc.

## Step 3: Upload to cPanel

1. **Compress the project:**
   ```bash
   # Create a zip file excluding unnecessary files
   zip -r formbuilder.zip . -x "node_modules/*" ".git/*" "dev.db" "*.log"
   ```

2. **Upload via cPanel File Manager:**
   - Go to cPanel → File Manager
   - Navigate to your domain's root directory (usually `public_html`)
   - Upload `formbuilder.zip`
   - Extract the zip file

## Step 4: Environment Configuration

1. **Create `.env.local` file on the server:**
   ```env
   NEXTAUTH_URL=https://yourdomain.com
   NEXTAUTH_SECRET=your-secret-key-here
   DATABASE_URL="mysql://username:password@localhost:3306/database_name"
   ```

2. **Database Setup:**
   - Replace SQLite with MySQL/PostgreSQL
   - Update `prisma/schema.prisma`:
   ```prisma
   generator client {
     provider = "prisma-client-js"
   }

   datasource db {
     provider = "mysql"  // or "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

## Step 5: Install Dependencies and Setup

1. **SSH into your cPanel or use Terminal in cPanel:**
   ```bash
   cd /path/to/your/domain
   npm install
   ```

2. **Setup Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## Step 6: Configure Node.js in cPanel

1. **Go to cPanel → Node.js Apps**
2. **Create New App:**
   - Node.js Version: Choose latest LTS (18.x or 20.x)
   - Application Mode: Production
   - Application Root: Your domain directory
   - Application URL: Your domain
   - Application Startup File: `server.js` (create this file)

3. **Create `server.js` file:**
   ```javascript
   const { createServer } = require('http')
   const { parse } = require('url')
   const next = require('next')

   const dev = process.env.NODE_ENV !== 'production'
   const hostname = 'localhost'
   const port = process.env.PORT || 3000

   const app = next({ dev, hostname, port })
   const handle = app.getRequestHandler()

   app.prepare().then(() => {
     createServer(async (req, res) => {
       try {
         const parsedUrl = parse(req.url, true)
         const { pathname, query } = parsedUrl

         await handle(req, res, parsedUrl)
       } catch (err) {
         console.error('Error occurred handling', req.url, err)
         res.statusCode = 500
         res.end('internal server error')
       }
     })
       .once('error', (err) => {
         console.error(err)
         process.exit(1)
       })
       .listen(port, () => {
         console.log(`> Ready on http://${hostname}:${port}`)
       })
   })
   ```

## Step 7: Update package.json Scripts

Add these scripts to `package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "next build",
    "postbuild": "prisma generate"
  }
}
```

## Step 8: Final Steps

1. **Restart Node.js App** in cPanel
2. **Test the application** by visiting your domain
3. **Monitor logs** in cPanel Node.js section for any errors

## Important Notes

### Database Migration
- The application currently uses SQLite (`dev.db`)
- For production, you MUST migrate to MySQL or PostgreSQL
- Update the `DATABASE_URL` in your environment variables

### File Permissions
- Ensure the `uploads/` directory (if exists) has write permissions
- Set appropriate permissions for the application files

### SSL Certificate
- Install SSL certificate in cPanel for HTTPS
- Update `NEXTAUTH_URL` to use `https://`

### Troubleshooting

1. **Application won't start:**
   - Check Node.js version compatibility
   - Verify all environment variables are set
   - Check error logs in cPanel

2. **Database connection errors:**
   - Verify DATABASE_URL format
   - Ensure database exists and user has permissions
   - Run `npx prisma db push` to sync schema

3. **NextAuth errors:**
   - Verify NEXTAUTH_URL matches your domain
   - Ensure NEXTAUTH_SECRET is set
   - Check that the domain supports cookies

## Current Application Status
✅ Production build successful
✅ TypeScript compilation complete
✅ All dependencies resolved
✅ ESLint warnings addressed (non-blocking)
✅ Suspense boundary added for client-side navigation
✅ Authentication system properly configured
✅ Dynamic metadata and favicon system implemented

The application is ready for deployment to cPanel!
