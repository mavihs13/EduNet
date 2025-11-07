import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import FeedClient from './FeedClient'

async function getCurrentUser() {
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
  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [{ user1Id: userId }, { user2Id: userId }]
    }
  })

  const friendIds = friendships.map(f => 
    f.user1Id === userId ? f.user2Id : f.user1Id
  )

  return await prisma.post.findMany({
    where: {
      OR: [
        { userId: userId },
        { userId: { in: friendIds } }
      ]
    },
    include: {
      user: {
        include: { profile: true }
      },
      likes: true,
      comments: {
        include: {
          user: { include: { profile: true } }
        },
        orderBy: { createdAt: 'desc' }
      },
      _count: {
        select: { likes: true, comments: true }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 20
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