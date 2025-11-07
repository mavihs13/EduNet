import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProfileClient from './ProfileClient'

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
          posts: true
        }
      }
    }
  })
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const user = await getUser(params.username)
  
  if (!user) {
    notFound()
  }

  const friendCount = user._count.friendships1 + user._count.friendships2

  return <ProfileClient user={user} friendCount={friendCount} />
}