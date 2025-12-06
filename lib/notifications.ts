import { prisma } from './prisma'

export async function createNotification(data: {
  userId: string
  type: string
  title: string
  content: string
  metadata?: any
}) {
  const notification = await prisma.notification.create({
    data: {
      ...data,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null
    }
  })

  // Emit via Socket.IO if available
  if (global.io) {
    global.io.to(`user_${data.userId}`).emit('new_notification', notification)
  }

  return notification
}

export async function notifyFollow(followerId: string, followingId: string, followerData: any) {
  return createNotification({
    userId: followingId,
    type: 'follow',
    title: 'New Follower',
    content: `${followerData.name || followerData.username} started following you`,
    metadata: { followerId, followerUsername: followerData.username }
  })
}

export async function notifyLike(postId: string, postOwnerId: string, likerData: any) {
  return createNotification({
    userId: postOwnerId,
    type: 'like',
    title: 'New Like',
    content: `${likerData.name || likerData.username} liked your post`,
    metadata: { postId, likerId: likerData.id, likerUsername: likerData.username }
  })
}

export async function notifyComment(postId: string, postOwnerId: string, commenterData: any, commentContent: string) {
  return createNotification({
    userId: postOwnerId,
    type: 'comment',
    title: 'New Comment',
    content: `${commenterData.name || commenterData.username} commented: ${commentContent.slice(0, 50)}${commentContent.length > 50 ? '...' : ''}`,
    metadata: { postId, commenterId: commenterData.id, commenterUsername: commenterData.username }
  })
}

export async function notifyMessage(senderId: string, receiverId: string, senderData: any) {
  return createNotification({
    userId: receiverId,
    type: 'message',
    title: 'New Message',
    content: `${senderData.name || senderData.username} sent you a message`,
    metadata: { senderId, senderUsername: senderData.username }
  })
}
