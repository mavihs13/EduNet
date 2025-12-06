import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { verifyToken } from '@/lib/auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
import FeedClient from './FeedClient'
import Stories from '@/components/Stories'

async function getCurrentUser() {
  // Check NextAuth session first
  const session = await getServerSession(authOptions)
  if (session?.user?.id) {
    return await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true }
    })
  }

  // Fallback to JWT token
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  return await prisma.user.findUnique({
    where: { id: payload.userId },
    include: { profile: true }
  })
}

async function getFeedPosts(userId: string) {
  // Get user's following list
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true }
  })

  const followingIds = following.map(f => f.followingId)

  // Get all public users (accounts where isPrivate is false or doesn't exist)
  const publicUsers = await prisma.user.findMany({
    where: {
      OR: [
        { profile: { isPrivate: false } },
        { profile: null }
      ]
    },
    select: { id: true }
  })

  const publicUserIds = publicUsers.map(u => u.id)

  // Combine all user IDs we want to show posts from
  const allowedUserIds = [...new Set([userId, ...followingIds, ...publicUserIds])]

  return await prisma.post.findMany({
    where: {
      userId: { in: allowedUserIds }
    },
    include: {
      user: {
        include: { profile: true }
      },
      likes: true,
      media: true,
      comments: {
        include: {
          user: { include: { profile: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 2
      },
      _count: {
        select: { likes: true, comments: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  })
}

export default async function FeedPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  const posts = await getFeedPosts(user.id)

  return <FeedClient user={user} initialPosts={posts} />
}