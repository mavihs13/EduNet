import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import SearchClient from './SearchClient'

export default async function SearchPage() {
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
    include: { profile: true }
  })

  if (!user) {
    redirect('/login')
  }

  const users = await prisma.user.findMany({
    where: {
      NOT: { id: user.id }
    },
    include: {
      profile: true
    }
  })

  // Get follow status for each user
  const usersWithFollowStatus = await Promise.all(
    users.map(async (targetUser) => {
      const isFollowing = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: user.id,
            followingId: targetUser.id
          }
        }
      })
      return {
        ...targetUser,
        isFollowedByCurrentUser: !!isFollowing
      }
    })
  )

  return <SearchClient user={user} users={usersWithFollowStatus} />
}