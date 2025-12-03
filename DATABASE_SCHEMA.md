# EduNet Database Schema Reference

## 📋 Complete Schema Overview

### 1. User Table
```sql
User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  username      String?   @unique
  phone         String?   @unique
  password      String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```
**Purpose**: Core user authentication and account data  
**Relationships**: Has one Profile, many Posts, Comments, Likes, Messages, etc.

### 2. Profile Table
```sql
Profile {
  id        String  @id @default(cuid())
  userId    String  @unique
  name      String?
  bio       String?
  avatar    String?
  skills    String?
  links     String?
  location  String?
  isPrivate Boolean @default(false)
}
```
**Purpose**: Extended user profile information  
**Relationships**: Belongs to one User

### 3. Post Table
```sql
Post {
  id           String   @id @default(cuid())
  userId       String
  content      String?
  code         String?
  language     String?
  tags         String?
  pollQuestion String?
  pollOptions  String?
  pollDuration Int?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```
**Purpose**: User posts with text, code, or polls  
**Relationships**: Belongs to User, has many Comments, Likes, PostMedia

### 4. PostMedia Table
```sql
PostMedia {
  id     String @id @default(cuid())
  postId String
  url    String
  type   String
}
```
**Purpose**: Media attachments (images/videos) for posts  
**Relationships**: Belongs to Post

### 5. Comment Table
```sql
Comment {
  id        String   @id @default(cuid())
  postId    String
  userId    String
  content   String
  createdAt DateTime @default(now())
}
```
**Purpose**: Comments on posts  
**Relationships**: Belongs to Post and User

### 6. Like Table
```sql
Like {
  id     String @id @default(cuid())
  postId String
  userId String
  @@unique([postId, userId])
}
```
**Purpose**: Post likes (one per user per post)  
**Relationships**: Belongs to Post and User

### 7. FriendRequest Table
```sql
FriendRequest {
  id         String   @id @default(cuid())
  senderId   String
  receiverId String
  status     String   @default("pending")
  createdAt  DateTime @default(now())
  @@unique([senderId, receiverId])
}
```
**Purpose**: Pending friend requests  
**Relationships**: Sender and Receiver are Users

### 8. Friendship Table
```sql
Friendship {
  id        String   @id @default(cuid())
  user1Id   String
  user2Id   String
  createdAt DateTime @default(now())
  @@unique([user1Id, user2Id])
}
```
**Purpose**: Established friendships  
**Relationships**: Two Users (bidirectional)

### 9. Message Table
```sql
Message {
  id         String   @id @default(cuid())
  senderId   String
  receiverId String
  content    String
  read       Boolean  @default(false)
  createdAt  DateTime @default(now())
}
```
**Purpose**: Direct messages between users  
**Relationships**: Sender and Receiver are Users

### 10. Notification Table
```sql
Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String
  title     String
  content   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}
```
**Purpose**: User notifications (likes, comments, follows)  
**Relationships**: Belongs to User

### 11. Save Table
```sql
Save {
  id        String   @id @default(cuid())
  postId    String
  userId    String
  createdAt DateTime @default(now())
  @@unique([postId, userId])
}
```
**Purpose**: Saved/bookmarked posts  
**Relationships**: Belongs to Post and User

### 12. Story Table
```sql
Story {
  id        String   @id @default(cuid())
  userId    String
  content   String?
  mediaUrl  String?
  mediaType String?
  createdAt DateTime @default(now())
  expiresAt DateTime
  @@index([userId, expiresAt])
}
```
**Purpose**: 24-hour temporary stories  
**Relationships**: Belongs to User, has many StoryViews

### 13. StoryView Table
```sql
StoryView {
  id       String   @id @default(cuid())
  storyId  String
  userId   String
  viewedAt DateTime @default(now())
  @@unique([storyId, userId])
}
```
**Purpose**: Track who viewed stories  
**Relationships**: Belongs to Story and User

### 14. Follow Table
```sql
Follow {
  id          String   @id @default(cuid())
  followerId  String
  followingId String
  createdAt   DateTime @default(now())
  @@unique([followerId, followingId])
}
```
**Purpose**: Follow/follower relationships  
**Relationships**: Follower and Following are Users

### 15. CodingProfile Table
```sql
CodingProfile {
  id                   String   @id @default(cuid())
  userId               String   @unique
  githubUsername       String?
  leetcodeUsername     String?
  codeforcesUsername   String?
  hackerrankUsername   String?
  totalProblems        Int      @default(0)
  easyProblems         Int      @default(0)
  mediumProblems       Int      @default(0)
  hardProblems         Int      @default(0)
  contestRating        Int      @default(0)
  globalRank           Int?
  streak               Int      @default(0)
  languages            String?
  githubStats          String?
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}
```
**Purpose**: Coding platform integration (LeetCode, GitHub, etc.)  
**Relationships**: Belongs to User

### 16. Achievement Table
```sql
Achievement {
  id          String   @id @default(cuid())
  userId      String
  title       String
  description String
  type        String
  badge       String?
  earnedAt    DateTime @default(now())
  isPublic    Boolean  @default(true)
  @@index([userId, type])
}
```
**Purpose**: User achievements and badges  
**Relationships**: Belongs to User

### 17. Analytics Table
```sql
Analytics {
  id        String   @id @default(cuid())
  type      String   @unique
  count     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```
**Purpose**: Platform-wide analytics and statistics  
**Relationships**: None (standalone)

### 18-20. NextAuth Tables
```sql
Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  @@unique([provider, providerAccountId])
}

Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
}

VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}
```
**Purpose**: NextAuth.js authentication system  
**Relationships**: Account and Session belong to User

## 🔗 Relationship Summary

### One-to-One (1:1)
- User ↔ Profile
- User ↔ CodingProfile

### One-to-Many (1:N)
- User → Posts
- User → Comments
- User → Likes
- User → Messages (sent)
- User → Messages (received)
- User → Notifications
- User → Stories
- User → Achievements
- Post → PostMedia
- Post → Comments
- Post → Likes
- Story → StoryViews

### Many-to-Many (M:N)
- User ↔ User (via Follow)
- User ↔ User (via Friendship)
- User ↔ Post (via Save)

## 📊 Indexes

Optimized queries with indexes on:
- `Story`: [userId, expiresAt]
- `Achievement`: [userId, type]
- All foreign keys automatically indexed

## 🔐 Unique Constraints

- User: email, username, phone
- Like: [postId, userId]
- Save: [postId, userId]
- Follow: [followerId, followingId]
- Friendship: [user1Id, user2Id]
- FriendRequest: [senderId, receiverId]
- StoryView: [storyId, userId]

## 💾 Data Types

- **String**: Text fields (IDs use cuid)
- **Int**: Numbers (counts, ratings)
- **Boolean**: True/false flags
- **DateTime**: Timestamps

## 🎯 Key Features

1. **Cascade Deletes**: Deleting a user removes all related data
2. **Unique Constraints**: Prevent duplicate relationships
3. **Default Values**: Auto-set timestamps and booleans
4. **Indexes**: Fast queries on common lookups
5. **Relations**: Proper foreign key relationships

## 📈 Scalability Notes

Current setup uses SQLite for development. For production:
- Switch to PostgreSQL for better performance
- Add database connection pooling
- Implement caching layer (Redis)
- Add full-text search indexes
- Consider read replicas for scaling
