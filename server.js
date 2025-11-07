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
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  })

  redis.connect().catch(console.error)

  const userSockets = new Map()

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    socket.on('join', (userId) => {
      userSockets.set(userId, socket.id)
      socket.userId = userId
      socket.join(`user_${userId}`)
      
      // Notify friends that user is online
      socket.broadcast.emit('user_online', userId)
    })

    socket.on('send_message', async (data) => {
      const { receiverId, content } = data
      const senderId = socket.userId

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