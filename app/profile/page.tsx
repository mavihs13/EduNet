import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
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

async function getStats(userId: string) {
  const [postsCount, followersCount, followingCount] = await Promise.all([
    prisma.post.count({ where: { userId } }),
    prisma.follow.count({ where: { followingId: userId } }),
    prisma.follow.count({ where: { followerId: userId } })
  ])
  return { posts: postsCount, followers: followersCount, following: followingCount }
}

export default async function ProfilePage() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  const stats = await getStats(user.id)
  return <ProfileClient initialUser={user} initialStats={stats} />
}
