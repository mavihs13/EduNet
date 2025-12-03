# 🚀 EduNet - Quick Start Guide

## ⚡ 30-Second Setup

```bash
# 1. Setup database
setup-database.bat

# 2. Start server
npm run dev

# 3. Open browser
http://localhost:3000
```

## 🔑 Login Credentials

```
Username: johndoe
Password: password123
```

## 📚 Documentation

- **DATABASE_SETUP.md** - Full setup guide
- **DATABASE_SCHEMA.md** - Schema reference
- **DATABASE_READY.md** - Feature overview
- **FIXES_APPLIED.md** - Bug fixes log

## 🎯 What Works

✅ User registration & login  
✅ Create posts with code  
✅ Like & comment  
✅ Follow users  
✅ Direct messaging  
✅ Real-time notifications  
✅ Stories (24h)  
✅ Search users  
✅ Profile management  

## 🛠️ Common Commands

```bash
# View database
npx prisma studio

# Reset database
del prisma\dev.db && setup-database.bat

# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push
```

## 📊 Database Stats

- 20 Tables
- 3 Sample Users
- 4 Sample Posts
- All Features Ready

## 🎨 Tech Stack

- Next.js 14
- React 18
- TypeScript
- Prisma ORM
- SQLite
- Tailwind CSS
- Socket.IO

## 🔗 Quick Links

- Dev Server: http://localhost:3000
- Prisma Studio: http://localhost:5555
- API Docs: /api/*

## 💡 Tips

1. Use Prisma Studio to view data
2. Check console for errors
3. Sample users already follow each other
4. All passwords are "password123"

## 🆘 Help

If something breaks:
```bash
# Full reset
del prisma\dev.db
npx prisma generate
npx prisma db push
node seed-database.js
npm run dev
```

---

**Ready to code!** 🎉
