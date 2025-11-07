# EduNet Setup Instructions

## Quick Setup (SQLite - No Database Server Required)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup database:**
   ```bash
   npm run setup
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

## What's Included

✅ **SQLite Database** - No PostgreSQL server required
✅ **Authentication System** - Login/Register with JWT
✅ **Landing Page** - Professional home page
✅ **User Profiles** - Create and edit profiles
✅ **Posts & Feed** - Share content and view feed
✅ **Real-time Chat** - Messaging system
✅ **Friend System** - Add and manage friends
✅ **Search** - Find users and content

## Troubleshooting

If you get database errors:
```bash
rm -f prisma/dev.db
npm run setup
```

If you get module errors:
```bash
rm -rf node_modules
npm install
npm run setup
```