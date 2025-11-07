import { prisma } from './prisma'

// User CRUD
export const userCrud = {
  create: async (data: { email: string; username: string; password: string }) => {
    return await prisma.user.create({ data })
  },
  
  findByEmail: async (email: string) => {
    return await prisma.user.findUnique({ where: { email }, include: { profile: true } })
  },
  
  findByUsername: async (username: string) => {
    return await prisma.user.findUnique({ where: { username }, include: { profile: true } })
  },
  
  findById: async (id: string) => {
    return await prisma.user.findUnique({ where: { id }, include: { profile: true } })
  }
}

// Post CRUD
export const postCrud = {
  create: async (data: { userId: string; content?: string; code?: string; language?: string; tags?: string }) => {
    return await prisma.post.create({
      data,
      include: {
        user: { include: { profile: true } },
        likes: true,
        comments: { include: { user: { include: { profile: true } } } },
        _count: { select: { likes: true, comments: true } }
      }
    })
  },
  
  findMany: async (page = 1, limit = 20) => {
    return await prisma.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: { include: { profile: true } },
        likes: true,
        comments: { include: { user: { include: { profile: true } } } },
        _count: { select: { likes: true, comments: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
  },
  
  findById: async (id: string) => {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        user: { include: { profile: true } },
        likes: true,
        comments: { include: { user: { include: { profile: true } } } },
        _count: { select: { likes: true, comments: true } }
      }
    })
  },
  
  update: async (id: string, data: { content?: string; code?: string; language?: string; tags?: string }) => {
    return await prisma.post.update({ where: { id }, data })
  },
  
  delete: async (id: string) => {
    return await prisma.post.delete({ where: { id } })
  }
}

// Like CRUD
export const likeCrud = {
  toggle: async (postId: string, userId: string) => {
    const existing = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId } }
    })
    
    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } })
      return { liked: false }
    } else {
      await prisma.like.create({ data: { postId, userId } })
      return { liked: true }
    }
  }
}

// Comment CRUD
export const commentCrud = {
  create: async (data: { postId: string; userId: string; content: string }) => {
    return await prisma.comment.create({
      data,
      include: { user: { include: { profile: true } } }
    })
  },
  
  findByPost: async (postId: string) => {
    return await prisma.comment.findMany({
      where: { postId },
      include: { user: { include: { profile: true } } },
      orderBy: { createdAt: 'desc' }
    })
  },
  
  delete: async (id: string) => {
    return await prisma.comment.delete({ where: { id } })
  }
}

// Friend CRUD
export const friendCrud = {
  sendRequest: async (senderId: string, receiverId: string) => {
    return await prisma.friendRequest.create({
      data: { senderId, receiverId },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } }
      }
    })
  },
  
  acceptRequest: async (requestId: string) => {
    const request = await prisma.friendRequest.findUnique({ where: { id: requestId } })
    if (!request) throw new Error('Request not found')
    
    await prisma.friendship.create({
      data: { user1Id: request.senderId, user2Id: request.receiverId }
    })
    
    await prisma.friendRequest.delete({ where: { id: requestId } })
  },
  
  rejectRequest: async (requestId: string) => {
    return await prisma.friendRequest.delete({ where: { id: requestId } })
  },
  
  getFriends: async (userId: string) => {
    const friendships = await prisma.friendship.findMany({
      where: { OR: [{ user1Id: userId }, { user2Id: userId }] },
      include: {
        user1: { include: { profile: true } },
        user2: { include: { profile: true } }
      }
    })
    
    return friendships.map(f => f.user1Id === userId ? f.user2 : f.user1)
  },
  
  getPendingRequests: async (userId: string) => {
    return await prisma.friendRequest.findMany({
      where: { receiverId: userId, status: 'pending' },
      include: { sender: { include: { profile: true } } }
    })
  }
}

// Message CRUD
export const messageCrud = {
  create: async (data: { senderId: string; receiverId: string; content: string }) => {
    return await prisma.message.create({
      data,
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } }
      }
    })
  },
  
  findConversation: async (user1Id: string, user2Id: string) => {
    return await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user1Id, receiverId: user2Id },
          { senderId: user2Id, receiverId: user1Id }
        ]
      },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } }
      },
      orderBy: { createdAt: 'asc' }
    })
  },
  
  markAsRead: async (senderId: string, receiverId: string) => {
    return await prisma.message.updateMany({
      where: { senderId, receiverId, read: false },
      data: { read: true }
    })
  }
}

// Notification CRUD
export const notificationCrud = {
  create: async (data: { userId: string; type: string; title: string; content: string }) => {
    return await prisma.notification.create({ data })
  },
  
  findByUser: async (userId: string, limit = 50) => {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    })
  },
  
  markAsRead: async (id: string) => {
    return await prisma.notification.update({
      where: { id },
      data: { read: true }
    })
  },
  
  markAllAsRead: async (userId: string) => {
    return await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true }
    })
  }
}

// Profile CRUD
export const profileCrud = {
  upsert: async (userId: string, data: { name?: string; bio?: string; avatar?: string; skills?: string; links?: string; location?: string }) => {
    return await prisma.profile.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data }
    })
  },
  
  findByUserId: async (userId: string) => {
    return await prisma.profile.findUnique({ where: { userId } })
  }
}

// Search CRUD
export const searchCrud = {
  users: async (query: string, limit = 20) => {
    return await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { profile: { name: { contains: query, mode: 'insensitive' } } },
          { profile: { skills: { contains: query, mode: 'insensitive' } } }
        ]
      },
      include: { profile: true },
      take: limit
    })
  },
  
  posts: async (query: string, limit = 20) => {
    return await prisma.post.findMany({
      where: {
        OR: [
          { content: { contains: query, mode: 'insensitive' } },
          { tags: { contains: query, mode: 'insensitive' } }
        ]
      },
      include: {
        user: { include: { profile: true } },
        _count: { select: { likes: true, comments: true } }
      },
      take: limit,
      orderBy: { createdAt: 'desc' }
    })
  }
}