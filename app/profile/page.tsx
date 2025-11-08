import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ProfileClient from './ProfileClient'

export default async function ProfilePage() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    redirect('/login')
  }

  const payload = verifyToken(token)
  if (!payload) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: { 
      profile: true,
      posts: {
        include: {
          likes: true,
          comments: true,
          _count: {
            select: { likes: true, comments: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      },
      friendships1: true,
      friendships2: true,
      _count: {
        select: { posts: true }
      }
    }
  })

  if (!user) {
    redirect('/login')
  }

  const followingCount = user.friendships1.length + user.friendships2.length
  
  // Count followers (people who follow this user)
  const followersCount = await prisma.friendship.count({
    where: {
      OR: [
        { user2Id: user.id },
        { user1Id: user.id }
      ]
    }
  })

  // Get friends list for sharing
  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [
        { user1Id: user.id },
        { user2Id: user.id }
      ]
    },
    include: {
      user1: { select: { id: true, username: true } },
      user2: { select: { id: true, username: true } }
    }
  })

  const friends = friendships.map(f => 
    f.user1Id === user.id ? f.user2 : f.user1
  )

  return <ProfileClient user={user} followingCount={followingCount} followersCount={followersCount} friends={friends} />
}