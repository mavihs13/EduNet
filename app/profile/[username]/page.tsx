import { notFound, redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ProfileClient from './ProfileClient'

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

async function getUser(username: string) {
  return await prisma.user.findUnique({
    where: { username },
    include: {
      profile: true,
      posts: {
        include: {
          user: { include: { profile: true } },
          likes: true,
          comments: { include: { user: { include: { profile: true } } } },
          _count: { select: { likes: true, comments: true } }
        },
        orderBy: { createdAt: 'desc' }
      },
      _count: {
        select: {
          friendships1: true,
          friendships2: true,
          posts: true,
          followers: true,
          following: true
        }
      }
    }
  })
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    redirect('/login')
  }

  const user = await getUser(params.username)
  
  if (!user) {
    notFound()
  }

  const friendCount = user._count.friendships1 + user._count.friendships2
  const followersCount = user._count.followers
  const followingCount = user._count.following
  const isOwnProfile = currentUser.id === user.id

  // Check if current user follows this profile
  const followStatus = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUser.id,
        followingId: user.id
      }
    }
  })

  const isFollowing = !!followStatus

  return <ProfileClient user={user} friendCount={friendCount} followersCount={followersCount} followingCount={followingCount} isOwnProfile={isOwnProfile} isFollowing={isFollowing} />
}