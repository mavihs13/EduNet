import { prisma } from './prisma'

// User CRUD
export const userCrud = {
  create: async (data: { email: string; username: string; password: string }) => {
    if (!data.email || !data.username || !data.password) {
      throw new Error('Email, username and password are required')
    }
    const user = await prisma.user.create({ data })
    
    // Track registration
    await prisma.analytics.upsert({
      where: { type: 'user_registrations' },
      update: { count: { increment: 1 } },
      create: { type: 'user_registrations', count: 1 }
    })
    
    return user
  },
  
  getRegistrationCount: async () => {
    const analytics = await prisma.analytics.findUnique({
      where: { type: 'user_registrations' }
    })
    return analytics?.count || 0
  },
  
  findByEmail: async (email: string) => {
    if (!email) return null
    return await prisma.user.findUnique({ where: { email }, include: { profile: true } })
  },
  
  findByUsername: async (username: string) => {
    if (!username) return null
    return await prisma.user.findUnique({ where: { username }, include: { profile: true } })
  },
  
  findByPhone: async (phone: string) => {
    if (!phone) return null
    return await prisma.user.findUnique({ where: { phone }, include: { profile: true } })
  },
  
  findById: async (id: string) => {
    if (!id) return null
    return await prisma.user.findUnique({ where: { id }, include: { profile: true } })
  }
}

// Post CRUD
export const postCrud = {
  create: async (data: { userId: string; content?: string; code?: string; language?: string; tags?: string }) => {
    if (!data.userId) throw new Error('User ID is required')
    if (!data.content?.trim() && !data.code?.trim()) throw new Error('Content or code is required')
    
    return await prisma.post.create({
      data: {
        ...data,
        content: data.content?.trim() || null,
        code: data.code?.trim() || null
      },
      include: {
        user: { include: { profile: true } },
        likes: true,
        comments: { include: { user: { include: { profile: true } } } },
        _count: { select: { likes: true, comments: true } }
      }
    })
  },
  
  findMany: async (page = 1, limit = 20) => {
    const validPage = Math.max(1, page)
    const validLimit = Math.min(50, Math.max(1, limit))
    
    return await prisma.post.findMany({
      skip: (validPage - 1) * validLimit,
      take: validLimit,
      include: {
        user: { include: { profile: true } },
        likes: true,
        comments: { 
          include: { user: { include: { profile: true } } },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
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
  
  update: async (id: string, data: { content?: string; tags?: string }) => {
    return await prisma.post.update({ where: { id }, data })
  },
  
  delete: async (id: string) => {
    return await prisma.post.delete({ where: { id } })
  }
}

// Like CRUD
export const likeCrud = {
  toggle: async (postId: string, userId: string) => {
    if (!postId || !userId) throw new Error('Invalid parameters')
    
    try {
      const existing = await prisma.like.findFirst({
        where: { postId, userId }
      })
      
      if (existing) {
        await prisma.like.delete({ where: { id: existing.id } })
        return { liked: false }
      } else {
        await prisma.like.create({ data: { postId, userId } })
        return { liked: true }
      }
    } catch (error) {
      console.error('Like toggle error:', error)
      throw new Error('Failed to toggle like')
    }
  }
}

// Comment CRUD
export const commentCrud = {
  create: async (data: { postId: string; userId: string; content: string }) => {
    if (!data.postId || !data.userId || !data.content?.trim()) {
      throw new Error('Post ID, user ID and content are required')
    }
    return await prisma.comment.create({
      data: {
        ...data,
        content: data.content.trim()
      },
      include: { user: { include: { profile: true } } }
    })
  },
  
  findByPost: async (postId: string) => {
    if (!postId) return []
    return await prisma.comment.findMany({
      where: { postId },
      include: { user: { include: { profile: true } } },
      orderBy: { createdAt: 'desc' }
    })
  },
  
  delete: async (id: string) => {
    if (!id) throw new Error('Comment ID is required')
    return await prisma.comment.delete({ where: { id } })
  }
}

// Friend CRUD
export const friendCrud = {
  sendRequest: async (senderId: string, receiverId: string) => {
    if (!senderId || !receiverId || senderId === receiverId) {
      throw new Error('Invalid parameters')
    }
    
    // Check if request already exists
    const existing = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      }
    })
    
    if (existing) throw new Error('Friend request already exists')
    
    // Check if already friends
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id: senderId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: senderId }
        ]
      }
    })
    
    if (friendship) throw new Error('Already friends')
    
    return await prisma.friendRequest.create({
      data: { senderId, receiverId },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } }
      }
    })
  },
  
  acceptRequest: async (requestId: string) => {
    if (!requestId) throw new Error('Invalid request ID')
    
    const request = await prisma.friendRequest.findUnique({ where: { id: requestId } })
    if (!request) throw new Error('Request not found')
    
    try {
      await prisma.$transaction([
        prisma.friendship.create({
          data: { user1Id: request.senderId, user2Id: request.receiverId }
        }),
        prisma.friendRequest.delete({ where: { id: requestId } })
      ])
      return { success: true }
    } catch (error) {
      console.error('Accept request error:', error)
      throw new Error('Failed to accept request')
    }
  },
  
  rejectRequest: async (requestId: string) => {
    if (!requestId) throw new Error('Request ID is required')
    return await prisma.friendRequest.delete({ where: { id: requestId } })
  },
  
  getFriends: async (userId: string) => {
    if (!userId) return []
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
    if (!userId) return []
    return await prisma.friendRequest.findMany({
      where: { receiverId: userId, status: 'pending' },
      include: { sender: { include: { profile: true } } }
    })
  }
}

// Message CRUD
export const messageCrud = {
  create: async (data: { senderId: string; receiverId: string; content: string }) => {
    if (!data.senderId || !data.receiverId || !data.content?.trim()) {
      throw new Error('Invalid message data')
    }
    
    if (data.senderId === data.receiverId) {
      throw new Error('Cannot send message to yourself')
    }
    
    return await prisma.message.create({
      data: {
        ...data,
        content: data.content.trim()
      },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } }
      }
    })
  },
  
  findConversation: async (user1Id: string, user2Id: string) => {
    if (!user1Id || !user2Id) return []
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
    if (!senderId || !receiverId) return { count: 0 }
    return await prisma.message.updateMany({
      where: { senderId, receiverId, read: false },
      data: { read: true }
    })
  }
}

// Notification CRUD
export const notificationCrud = {
  create: async (data: { userId: string; type: string; title: string; content: string }) => {
    if (!data.userId || !data.type || !data.title || !data.content) {
      throw new Error('All notification fields are required')
    }
    return await prisma.notification.create({ data })
  },
  
  findByUser: async (userId: string, limit = 50) => {
    if (!userId) return []
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 100)
    })
  },

  getUnreadCount: async (userId: string) => {
    if (!userId) return 0
    return await prisma.notification.count({
      where: { userId, read: false }
    })
  },

  markAsRead: async (id: string) => {
    if (!id) throw new Error('Notification ID is required')
    return await prisma.notification.update({
      where: { id },
      data: { read: true }
    })
  },
  
  markAllAsRead: async (userId: string) => {
    if (!userId) return { count: 0 }
    return await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true }
    })
  }
}

// Analytics CRUD
export const analyticsCrud = {
  getStats: async () => {
    const userCount = await prisma.analytics.findUnique({
      where: { type: 'user_registrations' }
    })
    
    const totalPosts = await prisma.post.count()
    const totalUsers = await prisma.user.count()
    
    return {
      registrations: userCount?.count || 0,
      totalUsers,
      totalPosts,
      activeToday: await prisma.user.count({
        where: {
          lastActive: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
          }
        }
      })
    }
  }
}nt: async (userId: string) => {
    if (!userId) return 0
    return await prisma.notification.count({
      where: { userId, read: false }
    })
  },
  
  markAsRead: async (id: string) => {
    if (!id) throw new Error('Notification ID is required')
    return await prisma.notification.update({
      where: { id },
      data: { read: true }
    })
  },
  
  markAllAsRead: async (userId: string) => {
    if (!userId) return { count: 0 }
    return await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true }
    })
  }
}

// Profile CRUD
export const profileCrud = {
  upsert: async (userId: string, data: { name?: string; bio?: string; avatar?: string; skills?: string; links?: string; location?: string }) => {
    if (!userId) throw new Error('User ID is required')
    return await prisma.profile.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data }
    })
  },
  
  findByUserId: async (userId: string) => {
    if (!userId) return null
    return await prisma.profile.findUnique({ where: { userId } })
  }
}

// Follow CRUD
export const followCrud = {
  toggle: async (followerId: string, followingId: string) => {
    if (!followerId || !followingId || followerId === followingId) {
      throw new Error('Invalid parameters')
    }
    
    try {
      const existing = await prisma.follow.findFirst({
        where: { followerId, followingId }
      })
      
      if (existing) {
        await prisma.follow.delete({ where: { id: existing.id } })
        return { following: false }
      } else {
        await prisma.follow.create({ data: { followerId, followingId } })
        return { following: true }
      }
    } catch (error) {
      console.error('Follow toggle error:', error)
      throw new Error('Failed to toggle follow')
    }
  },
  
  getFollowers: async (userId: string) => {
    if (!userId) return []
    return await prisma.follow.findMany({
      where: { followingId: userId },
      include: { follower: { include: { profile: true } } }
    })
  },
  
  getFollowing: async (userId: string) => {
    if (!userId) return []
    return await prisma.follow.findMany({
      where: { followerId: userId },
      include: { following: { include: { profile: true } } }
    })
  },
  
  isFollowing: async (followerId: string, followingId: string) => {
    if (!followerId || !followingId) return false
    
    const follow = await prisma.follow.findFirst({
      where: { followerId, followingId }
    })
    return !!follow
  }
}

// Search CRUD
export const searchCrud = {
  users: async (query: string, currentUserId?: string, limit = 20) => {
    if (!query?.trim()) return []
    
    const searchTerm = query.trim()
    
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: currentUserId } }, // Exclude current user
          {
            OR: [
              { username: { contains: searchTerm, mode: 'insensitive' } },
              { profile: { name: { contains: searchTerm, mode: 'insensitive' } } },
              { profile: { skills: { contains: searchTerm, mode: 'insensitive' } } }
            ]
          }
        ]
      },
      include: { 
        profile: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true
          }
        }
      },
      take: Math.min(limit, 50),
      orderBy: [
        { createdAt: 'desc' }, // Newer users first
        { profile: { name: 'asc' } }
      ]
    })
    
    // Add follow status if currentUserId provided
    if (currentUserId) {
      const usersWithFollowStatus = await Promise.all(
        users.map(async (user) => {
          const isFollowing = await prisma.follow.findFirst({
            where: {
              followerId: currentUserId,
              followingId: user.id
            }
          })
          return {
            ...user,
            isFollowing: !!isFollowing
          }
        })
      )
      return usersWithFollowStatus
    }
    
    return users
  },
  
  suggestions: async (currentUserId: string, limit = 10) => {
    if (!currentUserId) return []
    
    // Get users not followed by current user, ordered by activity
    return await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: currentUserId } },
          {
            NOT: {
              followers: {
                some: { followerId: currentUserId }
              }
            }
          }
        ]
      },
      include: {
        profile: true,
        _count: {
          select: {
            followers: true,
            posts: true
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' }, // Newer users first for better discovery
        { posts: { _count: 'desc' } } // Active users
      ],
      take: Math.min(limit, 20)
    })
  },
  
  posts: async (query: string, limit = 20) => {
    if (!query?.trim()) return []
    
    const searchTerm = query.trim()
    
    return await prisma.post.findMany({
      where: {
        OR: [
          { content: { contains: searchTerm } },
          { tags: { contains: searchTerm } },
          { code: { contains: searchTerm } }
        ]
      },
      include: {
        user: { include: { profile: true } },
        _count: { select: { likes: true, comments: true } }
      },
      take: Math.min(limit, 50),
      orderBy: { createdAt: 'desc' }
    })
  }
}

// Coding Profile CRUD
export const codingProfileCrud = {
  upsert: async (userId: string, data: {
    githubUsername?: string
    leetcodeUsername?: string
    codeforcesUsername?: string
    hackerrankUsername?: string
    totalProblems?: number
    easyProblems?: number
    mediumProblems?: number
    hardProblems?: number
    contestRating?: number
    globalRank?: number
    streak?: number
    languages?: string
    githubStats?: string
  }) => {
    if (!userId) throw new Error('User ID is required')
    return await prisma.codingProfile.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data }
    })
  },
  
  findByUserId: async (userId: string) => {
    if (!userId) return null
    return await prisma.codingProfile.findUnique({ where: { userId } })
  }
}

// Achievement CRUD
export const achievementCrud = {
  create: async (data: {
    userId: string
    title: string
    description: string
    type: string
    badge?: string
    isPublic?: boolean
  }) => {
    if (!data.userId || !data.title || !data.description || !data.type) {
      throw new Error('User ID, title, description and type are required')
    }
    return await prisma.achievement.create({ data })
  },
  
  findByUserId: async (userId: string, isPublic = true) => {
    if (!userId) return []
    return await prisma.achievement.findMany({
      where: { userId, isPublic },
      orderBy: { earnedAt: 'desc' }
    })
  },
  
  delete: async (id: string) => {
    if (!id) throw new Error('Achievement ID is required')
    return await prisma.achievement.delete({ where: { id } })
  }
}