# Real-time Backend System - Complete Documentation

## Overview
Complete real-time backend infrastructure with Socket.IO for instant updates across all features.

## Architecture

### Components
1. **Socket.IO Server** (`server.js`) - Real-time WebSocket server
2. **Notification System** (`lib/notifications.ts`) - Centralized notification management
3. **API Routes** - REST endpoints with real-time event emission
4. **Database** - Prisma ORM with SQLite/PostgreSQL

## Real-time Features

### 1. Follow System
**Endpoint**: `POST /api/follow`
- Creates/removes follow relationship
- Sends real-time notification to followed user
- **Socket Event**: `new_notification`
- **Notification Type**: `follow`

**Flow**:
```
User A follows User B
  → Database: Create Follow record
  → Notification: Create follow notification
  → Socket.IO: Emit to user_B room
  → User B: Receives instant notification
```

### 2. Like System
**Endpoint**: `POST /api/posts/[id]/like`
- Toggles like on post
- Notifies post owner (if not self-like)
- **Socket Event**: `new_notification`
- **Notification Type**: `like`

**Flow**:
```
User A likes User B's post
  → Database: Create/Delete Like record
  → Notification: Create like notification
  → Socket.IO: Emit to user_B room
  → User B: Receives instant notification
```

### 3. Comment System
**Endpoint**: `POST /api/posts/[id]/comments`
- Creates comment on post
- Notifies post owner
- Broadcasts to all users viewing the post
- **Socket Events**: `new_notification`, `new_comment`
- **Notification Type**: `comment`

**Flow**:
```
User A comments on User B's post
  → Database: Create Comment record
  → Notification: Create comment notification
  → Socket.IO: Emit to user_B room (notification)
  → Socket.IO: Emit to post_[id] room (comment)
  → All viewers: See new comment instantly
```

### 4. Messaging System
**Endpoint**: `POST /api/messages`
- Sends message between users
- Real-time message delivery
- Notifies receiver
- **Socket Events**: `new_message`, `new_notification`
- **Notification Type**: `message`

**Flow**:
```
User A sends message to User B
  → Database: Create Message record
  → Socket.IO: Emit to user_B room (message)
  → Notification: Create message notification
  → Socket.IO: Emit to user_B room (notification)
  → User B: Receives message + notification instantly
```

### 5. Post Creation
**Endpoint**: `POST /api/posts`
- Creates new post
- Broadcasts to all connected users
- **Socket Event**: `new_post`

**Flow**:
```
User A creates post
  → Database: Create Post record
  → Socket.IO: Broadcast to all users
  → Feed: Updates with new post
```

### 6. Typing Indicators
**Socket Events**: `typing`, `stop_typing`
- Shows when user is typing in chat
- Real-time typing status updates

### 7. Online/Offline Status
**Socket Events**: `user_online`, `user_offline`
- Tracks user connection status
- Updates friend list in real-time

## Socket.IO Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join` | `userId: string` | Join user's personal room |
| `join_post` | `postId: string` | Join post room for live comments |
| `leave_post` | `postId: string` | Leave post room |
| `typing` | `{ receiverId: string }` | Notify typing status |
| `stop_typing` | `{ receiverId: string }` | Stop typing notification |
| `send_message` | `{ receiverId, content }` | Send chat message |
| `send_notification` | `{ userId, type, title, content }` | Send notification |
| `mark_notification_read` | `notificationId: string` | Mark notification as read |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `new_notification` | `Notification` | New notification received |
| `new_message` | `Message` | New chat message |
| `new_comment` | `Comment` | New comment on post |
| `new_post` | `Post` | New post created |
| `user_online` | `userId: string` | User came online |
| `user_offline` | `userId: string` | User went offline |
| `user_typing` | `{ userId: string }` | User is typing |
| `user_stop_typing` | `{ userId: string }` | User stopped typing |
| `notification_marked_read` | `notificationId: string` | Notification marked as read |

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration with validation
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Posts
- `GET /api/posts` - Fetch posts feed
- `POST /api/posts` - Create post (broadcasts via Socket.IO)
- `PUT /api/posts/[id]` - Edit post (2-minute window)
- `DELETE /api/posts/[id]` - Delete post
- `POST /api/posts/[id]/like` - Toggle like (notifies owner)
- `GET /api/posts/[id]/comments` - Get comments
- `POST /api/posts/[id]/comments` - Create comment (notifies + broadcasts)

### Follow System
- `POST /api/follow` - Follow/unfollow user (notifies)
- `GET /api/users/[userId]/followers` - Get followers list
- `GET /api/users/[userId]/following` - Get following list

### Messages
- `GET /api/messages` - Get conversation
- `POST /api/messages` - Send message (real-time delivery)
- `POST /api/messages/requests` - Accept/reject message request

### Notifications
- `GET /api/notifications` - Get all notifications
- `POST /api/notifications/[id]` - Accept/reject follow notification

### Search
- `GET /api/search` - Search users

## Notification System

### Notification Types
1. **follow** - Someone followed you
2. **like** - Someone liked your post
3. **comment** - Someone commented on your post
4. **message** - Someone sent you a message

### Notification Structure
```typescript
{
  id: string
  userId: string          // Recipient
  type: string           // follow, like, comment, message
  title: string          // "New Follower"
  content: string        // "John started following you"
  metadata: string       // JSON: { followerId, followerUsername }
  read: boolean
  createdAt: Date
}
```

### Helper Functions (`lib/notifications.ts`)
- `createNotification()` - Create and emit notification
- `notifyFollow()` - Follow notification
- `notifyLike()` - Like notification
- `notifyComment()` - Comment notification
- `notifyMessage()` - Message notification

## Database Schema Updates

### Notification Model
```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String
  title     String
  content   String
  metadata  String?  // JSON for additional data
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Client Integration

### Socket.IO Connection
```typescript
import { io } from 'socket.io-client'

const socket = io('http://localhost:3000', {
  auth: { token: 'your-jwt-token' }
})

// Join user room
socket.emit('join', userId)

// Listen for notifications
socket.on('new_notification', (notification) => {
  // Update UI
})

// Listen for messages
socket.on('new_message', (message) => {
  // Update chat
})

// Listen for comments
socket.on('new_comment', (comment) => {
  // Update post comments
})
```

### React Hook Example
```typescript
useEffect(() => {
  const socket = io('http://localhost:3000', {
    auth: { token: getToken() }
  })
  
  socket.emit('join', user.id)
  
  socket.on('new_notification', (notification) => {
    setNotifications(prev => [notification, ...prev])
    showToast(notification.title)
  })
  
  return () => socket.disconnect()
}, [user.id])
```

## Security Features

1. **JWT Authentication** - All Socket.IO connections require valid token
2. **User Validation** - Input validation on all events
3. **Rate Limiting** - Prevent spam (to be implemented)
4. **Private Accounts** - Message requests for private accounts
5. **Self-notification Prevention** - No notifications for own actions

## Performance Optimizations

1. **Room-based Broadcasting** - Only emit to relevant users
2. **Redis Pub/Sub** - For horizontal scaling (configured)
3. **Connection Pooling** - Efficient database connections
4. **Lazy Loading** - Paginated data fetching
5. **Debouncing** - Typing indicators debounced

## Testing

### Test Real-time Features
1. Open two browser windows with different users
2. User A performs action (follow, like, comment, message)
3. User B should see instant update without refresh

### Socket.IO Events Testing
```javascript
// Test notification
socket.emit('send_notification', {
  userId: 'target-user-id',
  type: 'test',
  title: 'Test',
  content: 'Testing real-time'
})

// Test message
socket.emit('send_message', {
  receiverId: 'target-user-id',
  content: 'Hello!'
})
```

## Deployment Considerations

### Environment Variables
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"
REDIS_URL="redis://localhost:6379"
NODE_ENV="production"
```

### Production Setup
1. Use PostgreSQL instead of SQLite
2. Enable Redis for Socket.IO adapter
3. Configure CORS properly
4. Use HTTPS for secure WebSocket
5. Set up load balancer with sticky sessions

### Scaling
```javascript
// Redis adapter for multiple servers
const { createAdapter } = require('@socket.io/redis-adapter')
const { createClient } = require('redis')

const pubClient = createClient({ url: process.env.REDIS_URL })
const subClient = pubClient.duplicate()

io.adapter(createAdapter(pubClient, subClient))
```

## Monitoring

### Metrics to Track
- Active WebSocket connections
- Message delivery rate
- Notification delivery time
- Database query performance
- Error rates

### Logging
```javascript
io.on('connection', (socket) => {
  console.log(`[${new Date().toISOString()}] User connected: ${socket.id}`)
  
  socket.on('disconnect', () => {
    console.log(`[${new Date().toISOString()}] User disconnected: ${socket.id}`)
  })
})
```

## Future Enhancements

1. **Voice/Video Calls** - WebRTC integration
2. **File Sharing** - Real-time file upload progress
3. **Read Receipts** - Message read status
4. **Presence System** - Last seen, online status
5. **Push Notifications** - Mobile push via FCM
6. **Story Updates** - Real-time story notifications
7. **Live Reactions** - Real-time emoji reactions
8. **Collaborative Editing** - Real-time code collaboration

## Troubleshooting

### Common Issues

**Socket not connecting**
- Check if server is running on correct port
- Verify JWT token is valid
- Check CORS configuration

**Notifications not received**
- Ensure user joined their room (`socket.emit('join', userId)`)
- Check if `global.io` is available in API routes
- Verify notification is created in database

**Messages not delivered**
- Check mutual follow status
- Verify message request logic
- Check Socket.IO room membership

## Support

For issues or questions:
1. Check server logs
2. Verify database connections
3. Test Socket.IO events in browser console
4. Review API endpoint responses
