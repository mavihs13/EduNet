import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { followCrud, userCrud } from '@/lib/crud'
import { notifyFollow } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    const { followingId } = await request.json()

    if (!followingId) {
      return NextResponse.json({ message: 'Following ID required' }, { status: 400 })
    }

    const result = await followCrud.toggle(payload.userId, followingId)
    
    if (result.following) {
      const follower = await userCrud.findById(payload.userId)
      await notifyFollow(payload.userId, followingId, {
        id: follower?.id,
        name: follower?.profile?.name,
        username: follower?.username
      })
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Follow error:', error)
    return NextResponse.json({ message: 'Failed to follow/unfollow' }, { status: 500 })
  }
}
