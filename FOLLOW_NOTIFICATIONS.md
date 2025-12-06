# Real-time Follow Notifications Implementation

## Features Implemented

### 1. Real-time Follow Notifications
- When a user follows another user, a real-time notification is sent via Socket.IO
- Notification appears instantly in the notifications page without page refresh
- Includes follower's name and username

### 2. Accept/Reject Follow Actions
- Users can accept follow notifications (marks as read)
- Users can reject follow notifications (unfollows and deletes notification)
- Actions are processed via API endpoint `/api/notifications/[id]`

## Files Modified

### Database Schema
- **prisma/schema.prisma**: Added `metadata` field to Notification model for storing additional JSON data (follower info)

### API Routes
- **app/api/follow/route.ts**: 
  - Creates notification when user follows someone
  - Emits real-time notification via Socket.IO
  - Stores follower metadata (ID and username)

- **app/api/notifications/[id]/route.ts** (NEW):
  - Handles accept/reject actions for follow notifications
  - Accept: Marks notification as read
  - Reject: Unfollows user and deletes notification

### Frontend Components
- **app/notifications/NotificationsClient.tsx**:
  - Added Socket.IO connection for real-time notifications
  - Displays follow notifications with accept/reject buttons
  - Real-time updates when new notifications arrive
  - Handles notification actions (accept/reject)

- **app/notifications/page.tsx**:
  - Fetches notifications from database
  - Passes notifications to client component

### Backend
- **server.js**: Added `global.io` to make Socket.IO instance available across API routes
- **lib/crud.ts**: Updated notificationCrud.create to accept metadata parameter
- **lib/socket.ts** (NEW): Socket.IO singleton (for future use)

## How It Works

### Follow Flow
1. User A follows User B
2. API creates Follow record in database
3. API creates Notification for User B with metadata containing User A's info
4. Socket.IO emits 'new_notification' event to User B's socket room
5. User B's notifications page receives event and displays notification in real-time

### Accept Flow
1. User B clicks "Accept" button
2. API marks notification as read
3. Notification remains visible but marked as accepted
4. User A remains as follower

### Reject Flow
1. User B clicks "Reject" button
2. API unfollows User A from User B
3. API deletes the notification
4. Notification disappears from list

## Socket.IO Events

### Client Emits
- `join`: User joins their socket room with userId

### Server Emits
- `new_notification`: Sent when new notification is created
  - Payload: Notification object with id, type, title, content, metadata, read, createdAt

## API Endpoints

### POST /api/follow
- Creates/removes follow relationship
- Sends real-time notification on follow

### POST /api/notifications/[id]
- Body: `{ action: 'accept' | 'reject' }`
- Accept: Marks notification as read
- Reject: Unfollows and deletes notification

### GET /api/notifications
- Fetches all notifications for current user

## Database Changes

```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String
  title     String
  content   String
  metadata  String?  // NEW: JSON string for additional data
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Testing

1. Open two browser windows with different users
2. User A follows User B
3. User B's notifications page should instantly show the notification
4. User B can accept (marks as read) or reject (unfollows)

## Future Enhancements

- Add notification badge count in header
- Add notification sound/toast
- Add notification for likes, comments, mentions
- Add notification settings (enable/disable types)
- Add notification history/archive
