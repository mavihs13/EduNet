import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import NotificationsClient from './NotificationsClient'

export default async function NotificationsPage() {
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

  const friendRequests = await prisma.friendRequest.findMany({
    where: { receiverId: user.id },
    include: {
      sender: {
        include: { profile: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return <NotificationsClient user={user} friendRequests={friendRequests} />
}