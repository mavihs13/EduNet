import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { verifyToken } from '@/lib/auth'
import { authOptions } from '@/lib/auth-config'
import { followCrud, notificationCrud } from '@/lib/crud'
import { cookies } from 'next/headers'

async function getCurrentUserId() {
  const session = await getServerSession(authOptions)
  if (session?.user?.id) return session.user.id

  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null

  const payload = verifyToken(token)
  return payload?.userId || null
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { followingId } = await request.json()
    
    if (!followingId || followingId === userId) {
      return NextResponse.json({ message: 'Invalid follow request' }, { status: 400 })
    }

    const result = await followCrud.toggle(userId, followingId)
    
    // Create notification if following
    if (result.following) {
      await notificationCrud.create({
        userId: followingId,
        type: 'follow',
        title: 'New Follower',
        content: 'Someone started following you'
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Follow error:', error)
    return NextResponse.json({ message: 'Follow failed' }, { status: 500 })
  }
}