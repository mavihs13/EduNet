# EduNet Database Setup Guide

## 🗄️ Database Overview

Your EduNet project uses **SQLite** as the database with **Prisma ORM** for data management.

### Database Models (16 Total)

1. **User** - User accounts and authentication
2. **Profile** - Extended user information
3. **Post** - User posts with content/code
4. **PostMedia** - Media attachments for posts
5. **Comment** - Post comments
6. **Like** - Post likes
7. **FriendRequest** - Friend request system
8. **Friendship** - Established friendships
9. **Message** - Direct messaging
10. **Notification** - User notifications
11. **Save** - Saved posts
12. **Story** - 24-hour stories
13. **StoryView** - Story view tracking
14. **Follow** - Follow/follower system
15. **CodingProfile** - Coding platform profiles
16. **Achievement** - User achievements
17. **Analytics** - Platform analytics
18. **Account** - OAuth accounts (NextAuth)
19. **Session** - User sessions (NextAuth)
20. **VerificationToken** - Email verification

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)

Run the setup script:
```bash
setup-database.bat
```

This will:
1. Generate Prisma Client
2. Create database and tables
3. Seed with sample data

### Option 2: Manual Setup

```bash
# Step 1: Generate Prisma Client
npx prisma generate

# Step 2: Create database
npx prisma db push

# Step 3: Seed database (optional)
node seed-database.js
```

## 📊 Database Schema Details

### Core User System
```
User
├── Profile (1:1)
├── Posts (1:Many)
├── Comments (1:Many)
├── Likes (1:Many)
├── Friendships (Many:Many)
├── Messages (1:Many)
├── Notifications (1:Many)
├── Follows (Many:Many)
├── CodingProfile (1:1)
└── Achievements (1:Many)
```

### Post System
```
Post
├── PostMedia (1:Many)
├── Comments (1:Many)
├── Likes (1:Many)
└── Saves (1:Many)
```

### Social Features
```
User ←→ Follow ←→ User (Followers/Following)
User ←→ Friendship ←→ User (Friends)
User ←→ FriendRequest ←→ User (Pending)
User ←→ Message ←→ User (Chat)
```

## 🌱 Sample Data

After seeding, you'll have:

### Users (3)
- **John Doe** (@johndoe)
  - Email: john@example.com
  - Skills: JavaScript, React, Node.js
  
- **Jane Smith** (@janesmith)
  - Email: jane@example.com
  - Skills: Python, Machine Learning
  
- **Alex Chen** (@alexchen)
  - Email: alex@example.com
  - Skills: Flutter, React Native

### Posts (4)
- Next.js development post
- JavaScript code snippet
- Python ML code
- Flutter tip

### Relationships
- John ↔ Jane (mutual follow)
- Alex → John (following)

### Login Credentials
All users have the same password: `password123`

## 🔧 Database Management

### View Database
```bash
npx prisma studio
```
Opens a GUI at http://localhost:5555

### Reset Database
```bash
npx prisma db push --force-reset
node seed-database.js
```

### Generate New Migration
```bash
npx prisma migrate dev --name your_migration_name
```

## 📁 Database Location

SQLite database file: `prisma/dev.db`

## 🔍 Useful Prisma Commands

```bash
# View current schema
npx prisma format

# Validate schema
npx prisma validate

# Generate client after schema changes
npx prisma generate

# Push schema changes
npx prisma db push

# Create migration
npx prisma migrate dev

# View database in browser
npx prisma studio
```

## 🛠️ Troubleshooting

### Error: "Can't reach database server"
- Check if database file exists: `prisma/dev.db`
- Run: `npx prisma db push`

### Error: "Prisma Client not generated"
- Run: `npx prisma generate`

### Error: "Table does not exist"
- Run: `npx prisma db push --accept-data-loss`

### Reset Everything
```bash
# Delete database
del prisma\dev.db

# Recreate
npx prisma db push
node seed-database.js
```

## 📈 Database Statistics

After setup, your database will have:
- ✅ 3 Users
- ✅ 3 Profiles
- ✅ 4 Posts
- ✅ 3 Follow relationships
- ✅ 1 Analytics record

## 🔐 Security Notes

- Passwords are hashed with bcrypt (12 rounds)
- JWT tokens for authentication
- HTTP-only cookies for session management
- Input validation with Zod
- SQL injection prevention via Prisma

## 🎯 Next Steps

1. Run `setup-database.bat`
2. Start the dev server: `npm run dev`
3. Login with sample credentials
4. Explore the platform!

## 📝 Environment Variables Required

Make sure your `.env.local` has:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"
```

## 🆘 Need Help?

- Check `TROUBLESHOOTING.md`
- View Prisma docs: https://www.prisma.io/docs
- Open an issue on GitHub
