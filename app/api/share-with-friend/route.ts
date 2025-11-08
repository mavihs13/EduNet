import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    const { postId, friendId } = await request.json()

    // Create notification for friend
    await prisma.notification.create({
      data: {
        userId: friendId,
        type: 'post_share',
        title: 'Post Shared',
        content: `${payload.userId} shared a post with you`,
        read: false
      }
    })

    return NextResponse.json({ message: 'Post shared successfully' })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to share post' }, { status: 500 })
  }
}