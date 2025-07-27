# Troubleshooting Guide untuk forms.msdmiki.my.id

## 🚨 Masalah: Hanya muncul "It works! NodeJS 20.19.2"

Ini artinya Node.js sudah berjalan, tapi aplikasi Next.js belum ter-load dengan benar.

## 🔧 Langkah Perbaikan:

### 1. Install Dependencies
```bash
cd /home/msdmikm/forms.msdmiki.my.id
npm install
```

### 2. Setup Environment Variables
```bash
# Copy template environment
cp env.local.example .env.local

# Edit file .env.local dan update:
# NEXTAUTH_URL=https://forms.msdmiki.my.id
# NEXTAUTH_SECRET=forms-msdmiki-secret-key-change-this-to-something-secure-min-32-chars
# DATABASE_URL="file:./dev.db"  # atau MySQL/PostgreSQL connection string
```

### 3. Build Application
```bash
npm run build
```

### 4. Generate Prisma Client
```bash
npx prisma generate
npx prisma db push
```

### 5. Restart Node.js App di cPanel
- Go to cPanel → Node.js Apps
- Find "FORMS.MSDMIKI.MY.ID"
- Click "RESTART"

## 🔍 Diagnostic Commands

Jalankan script diagnostic untuk mengecek status:
```bash
node diagnostic.js
```

Atau jalankan setup otomatis:
```bash
bash setup.sh
```

## 📋 Checklist Verifikasi

- [ ] File `node_modules` exists
- [ ] File `.next` exists (production build)
- [ ] File `.env.local` exists dan terisi
- [ ] Database connection working
- [ ] Node.js app restarted
- [ ] Application startup file = `server.js`
- [ ] Application mode = Production

## 🗃️ Database Setup

### Untuk MySQL di cPanel:
1. Buat database di cPanel → MySQL Databases
2. Buat user dan assign ke database
3. Update DATABASE_URL di .env.local:
   ```
   DATABASE_URL="mysql://username:password@localhost:3306/database_name"
   ```

### Untuk SQLite (temporary):
```
DATABASE_URL="file:./dev.db"
```

## 📞 Common Issues & Solutions

### Issue: "Cannot find module 'next'"
**Solution:** Run `npm install`

### Issue: "Prisma Client not generated"
**Solution:** Run `npx prisma generate`

### Issue: "Database connection error"
**Solution:** 
1. Check DATABASE_URL format
2. Verify database exists
3. Test connection

### Issue: "NEXTAUTH_URL mismatch"
**Solution:** Ensure .env.local has `NEXTAUTH_URL=https://forms.msdmiki.my.id`

### Issue: "Port already in use"
**Solution:** Restart Node.js app in cPanel

## 🎯 Expected Result

Setelah setup berhasil, akses https://forms.msdmiki.my.id akan menampilkan:
- Homepage Form Builder
- Login/Register forms
- Dashboard setelah login

## 📊 Monitoring

Check logs di cPanel → Node.js Apps → View Logs untuk error messages.

## 🆘 Emergency Fallback

Jika masih bermasalah, coba:
1. Stop Node.js app
2. Delete node_modules: `rm -rf node_modules`
3. Delete .next: `rm -rf .next`
4. Reinstall: `npm install`
5. Rebuild: `npm run build`
6. Restart Node.js app
