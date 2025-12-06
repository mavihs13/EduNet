const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')
const { createClient } = require('redis')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
})

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.NEXTAUTH_URL 
        : "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  })

  // Make io available globally
  global.io = io

  redis.connect().catch(console.error)

  const userSockets = new Map()

  // Authentication middleware for Socket.IO
  io.use((socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
      return next(new Error('Authentication error'))
    }
    // Add token validation here if needed
    next()
  })

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    socket.on('join', (userId) => {
      if (!userId || typeof userId !== 'string' || userId.length > 50) {
        socket.emit('error', 'Invalid user ID')
        return
      }
      
      userSockets.set(userId, socket.id)
      socket.userId = userId
      socket.join(`user_${userId}`)
      socket.broadcast.emit('user_online', userId)
    })

    socket.on('join_post', (postId) => {
      if (postId && typeof postId === 'string') {
        socket.join(`post_${postId}`)
      }
    })

    socket.on('leave_post', (postId) => {
      if (postId && typeof postId === 'string') {
        socket.leave(`post_${postId}`)
      }
    })

    socket.on('typing', (data) => {
      const { receiverId } = data
      if (receiverId && socket.userId) {
        io.to(`user_${receiverId}`).emit('user_typing', { userId: socket.userId })
      }
    })

    socket.on('stop_typing', (data) => {
      const { receiverId } = data
      if (receiverId && socket.userId) {
        io.to(`user_${receiverId}`).emit('user_stop_typing', { userId: socket.userId })
      }
    })

    socket.on('send_message', async (data) => {
      const { receiverId, content } = data
      const senderId = socket.userId

      // Validate input
      if (!senderId || !receiverId || !content || 
          typeof receiverId !== 'string' || typeof content !== 'string' ||
          content.length > 1000 || receiverId.length > 50) {
        socket.emit('error', 'Invalid message data')
        return
      }

      try {
        // Save message to database (you'll need to implement this)
        const message = {
          id: Date.now().toString(),
          senderId,
          receiverId,
          content,
          createdAt: new Date(),
          read: false
        }

        // Send to receiver if online
        const receiverSocketId = userSockets.get(receiverId)
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('new_message', message)
        }

        // Send back to sender
        socket.emit('message_sent', message)

        // Store in Redis for offline users
        await redis.lpush(`messages:${receiverId}`, JSON.stringify(message))
      } catch (error) {
        console.error('Error sending message:', error)
      }
    })

    socket.on('send_notification', async (data) => {
      const { userId, type, title, content } = data

      // Validate input
      if (!userId || !type || !title || !content ||
          typeof userId !== 'string' || typeof type !== 'string' ||
          typeof title !== 'string' || typeof content !== 'string' ||
          userId.length > 50 || type.length > 50 ||
          title.length > 100 || content.length > 500) {
        socket.emit('error', 'Invalid notification data')
        return
      }

      try {
        const notification = {
          id: Date.now().toString(),
          userId,
          type,
          title,
          content,
          read: false,
          createdAt: new Date()
        }

        // Send to user if online
        const userSocketId = userSockets.get(userId)
        if (userSocketId) {
          io.to(userSocketId).emit('new_notification', notification)
        }

        // Store in Redis
        await redis.lpush(`notifications:${userId}`, JSON.stringify(notification))
      } catch (error) {
        console.error('Error sending notification:', error)
      }
    })

    socket.on('mark_notification_read', async (notificationId) => {
      if (!notificationId || !socket.userId) return
      try {
        const { PrismaClient } = require('@prisma/client')
        const prisma = new PrismaClient()
        await prisma.notification.update({
          where: { id: notificationId },
          data: { read: true }
        })
        socket.emit('notification_marked_read', notificationId)
      } catch (error) {
        console.error('Mark notification read error:', error)
      }
    })

    socket.on('disconnect', () => {
      if (socket.userId) {
        userSockets.delete(socket.userId)
        socket.broadcast.emit('user_offline', socket.userId)
      }
      console.log('User disconnected:', socket.id)
    })
  })

  server
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})