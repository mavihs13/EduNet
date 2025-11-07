# EduNet - Educational Social Media Platform

A complete educational social media platform combining LinkedIn + Instagram + LeetCode features, built with Next.js 14, PostgreSQL, and Socket.IO.

## Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt

### 📱 Social Features
- Create posts with text and code snippets
- Like, comment, and share posts
- Real-time friend system (send/accept/reject requests)
- User profiles with skills and bio
- Search users by name, username, or skills

### 💬 Real-time Chat
- 1:1 messaging with Socket.IO
- Online/offline status indicators
- Message read status
- Real-time notifications

### 🔍 Discovery
- Search functionality
- User recommendations
- Skill-based filtering

### 📝 Code Sharing
- Syntax-highlighted code editor (CodeMirror)
- Multiple programming language support
- Code snippet sharing in posts

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **ShadCN UI** components
- **CodeMirror** for code editing

### Backend
- **Next.js API Routes**
- **PostgreSQL** database
- **Prisma ORM**
- **Socket.IO** for real-time features
- **Redis** for pub/sub and caching

### Authentication & Security
- **JWT** tokens (access & refresh)
- **bcrypt** password hashing
- HTTP-only cookies

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Redis server

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd edunet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/edunet"
   JWT_SECRET="your-super-secret-jwt-key-here"
   JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"
   REDIS_URL="redis://localhost:6379"
   NEXTAUTH_SECRET="your-nextauth-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:generate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## Database Schema

### Core Models
- **User**: Authentication and basic user data
- **Profile**: Extended user information (bio, skills, avatar)
- **Post**: User posts with optional code content
- **Comment**: Post comments
- **Like**: Post likes
- **Friendship**: Friend relationships
- **FriendRequest**: Pending friend requests
- **Message**: Chat messages
- **Notification**: System notifications

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Posts
- `GET /api/posts` - Fetch posts feed
- `POST /api/posts` - Create new post
- `POST /api/posts/[id]/like` - Toggle post like

### Friends
- `GET /api/friends` - Get user's friends
- `POST /api/friends/requests/send` - Send friend request
- `POST /api/friends/requests/accept` - Accept friend request

### Messages
- `GET /api/messages` - Get chat messages
- `POST /api/messages` - Send message

### Search
- `GET /api/search` - Search users

## Real-time Features

The application uses Socket.IO for real-time functionality:

### Events
- `join` - User joins with their ID
- `send_message` - Send chat message
- `new_message` - Receive chat message
- `user_online` - User comes online
- `user_offline` - User goes offline
- `send_notification` - Send notification
- `new_notification` - Receive notification

## Project Structure

```
edunet/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── feed/              # Home feed page
│   ├── login/             # Authentication pages
│   ├── chat/              # Chat interface
│   └── search/            # User search
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── CreatePost.tsx    # Post creation
│   ├── CodeEditor.tsx    # Code editor
│   └── CodeViewer.tsx    # Code display
├── lib/                   # Utilities
│   ├── prisma.ts         # Database client
│   ├── auth.ts           # Authentication helpers
│   ├── redis.ts          # Redis client
│   └── utils.ts          # General utilities
├── prisma/               # Database schema
└── server.js             # Socket.IO server
```

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema to database
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.