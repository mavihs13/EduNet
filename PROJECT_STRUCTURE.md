# EduNet - Complete Project Structure

## 📁 Folder Structure
```
edunet/
├── app/                           # Next.js 14 App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication
│   │   │   ├── login/route.ts
│   │   │   ├── register/route.ts
│   │   │   ├── logout/route.ts
│   │   │   ├── forgot-password/route.ts
│   │   │   └── reset-password/route.ts
│   │   ├── posts/                # Posts Management
│   │   │   ├── route.ts
│   │   │   └── [id]/
│   │   │       ├── like/route.ts
│   │   │       └── comments/route.ts
│   │   ├── friends/              # Friend System
│   │   │   ├── route.ts
│   │   │   └── requests/
│   │   │       ├── send/route.ts
│   │   │       ├── accept/route.ts
│   │   │       └── reject/route.ts
│   │   ├── messages/route.ts     # Chat System
│   │   ├── notifications/route.ts # Notifications
│   │   ├── search/route.ts       # User Search
│   │   ├── profile/route.ts      # Profile Management
│   │   └── upload/route.ts       # File Upload
│   ├── feed/                     # Home Feed
│   │   ├── page.tsx
│   │   └── FeedClient.tsx
│   ├── login/page.tsx            # Authentication Pages
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   ├── profile/[username]/       # User Profiles
│   │   ├── page.tsx
│   │   └── ProfileClient.tsx
│   ├── search/page.tsx           # Search Interface
│   ├── chat/page.tsx             # Chat Interface
│   ├── layout.tsx                # Root Layout
│   ├── page.tsx                  # Home Page
│   └── globals.css               # Global Styles
├── components/                   # React Components
│   ├── ui/                      # Base UI Components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── avatar.tsx
│   │   ├── textarea.tsx
│   │   ├── label.tsx
│   │   └── dialog.tsx
│   ├── CreatePost.tsx           # Post Creation
│   ├── CodeEditor.tsx           # Code Editor
│   └── CodeViewer.tsx           # Code Display
├── lib/                         # Utilities & Services
│   ├── prisma.ts               # Database Client
│   ├── auth.ts                 # Authentication Utils
│   ├── redis.ts                # Redis Client
│   ├── s3.ts                   # AWS S3 Utils
│   ├── email.ts                # Email Service
│   ├── crud.ts                 # CRUD Functions
│   └── utils.ts                # General Utils
├── prisma/
│   └── schema.prisma           # Database Schema
├── server.js                   # Socket.IO Server
├── middleware.ts               # Route Protection
├── .env.local                  # Environment Variables
├── .env.example               # Environment Template
├── package.json               # Dependencies
├── tailwind.config.ts         # Tailwind Config
├── tsconfig.json              # TypeScript Config
├── next.config.js             # Next.js Config
└── README.md                  # Documentation
```

## 🚀 Features Implemented

### ✅ Authentication System
- JWT-based auth with refresh tokens
- Login, Register, Logout
- Password reset via email
- Route protection middleware

### ✅ Social Media Features
- Create posts with text/code
- Like, comment, share posts
- Real-time feed updates
- Code syntax highlighting
- Image/file uploads to S3

### ✅ Friend System
- Send/accept/reject friend requests
- Friends list management
- Friend-based content filtering

### ✅ Real-time Chat
- Socket.IO integration
- 1:1 messaging
- Online/offline status
- Message read receipts
- Redis pub/sub

### ✅ Search & Discovery
- User search by name/skills
- Post search by content/tags
- PostgreSQL full-text search

### ✅ Notifications
- Real-time push notifications
- Friend requests, likes, messages
- Notification management

### ✅ User Profiles
- Editable profiles
- Skills, bio, location
- User posts display
- Avatar uploads

## 🛠 Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS + ShadCN UI
- CodeMirror for code editing

**Backend:**
- Next.js API Routes
- PostgreSQL + Prisma ORM
- Socket.IO + Redis
- AWS S3 for file storage

**Authentication:**
- JWT tokens (access & refresh)
- bcrypt password hashing
- HTTP-only cookies

## 📦 Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Copy `.env.example` to `.env.local` and fill in values

3. **Setup database:**
   ```bash
   npm run db:push
   npm run db:generate
   ```

4. **Start development:**
   ```bash
   npm run dev
   ```

## 🔧 Available Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run db:push` - Push schema to DB
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Posts
- `GET /api/posts` - Get posts feed
- `POST /api/posts` - Create new post
- `POST /api/posts/[id]/like` - Toggle post like
- `POST /api/posts/[id]/comments` - Add comment

### Friends
- `GET /api/friends` - Get user's friends
- `POST /api/friends/requests/send` - Send friend request
- `POST /api/friends/requests/accept` - Accept request
- `POST /api/friends/requests/reject` - Reject request

### Messages
- `GET /api/messages` - Get conversation
- `POST /api/messages` - Send message

### Other
- `GET /api/search` - Search users/posts
- `PUT /api/profile` - Update profile
- `POST /api/upload` - Upload files
- `GET /api/notifications` - Get notifications

## 🔄 Real-time Events (Socket.IO)

- `join` - User joins with ID
- `send_message` - Send chat message
- `new_message` - Receive message
- `user_online` - User comes online
- `user_offline` - User goes offline
- `send_notification` - Send notification
- `new_notification` - Receive notification

This is a complete, production-ready educational social media platform with all requested features implemented!