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

    const { postId, content } = await request.json()

    const comment = await prisma.comment.create({
      data: {
        postId,
        userId: payload.userId,
        content
      },
      include: {
        user: {
          include: { profile: true }
        }
      }
    })
    
    // Get post details to create notification
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { user: true }
    })
    
    // Create notification if commenting on someone else's post
    let notificationCreated = false
    if (post && post.userId !== payload.userId) {
      await prisma.notification.create({
        data: {
          userId: post.userId,
          type: 'comment',
          title: 'New Comment',
          content: `${comment.user.profile?.name || comment.user.username} commented on your post`,
          read: false
        }
      })
      notificationCreated = true
    }

    return NextResponse.json({ comment, notificationCreated })
  } catch (error) {
    console.error('Comment creation error:', error)
    return NextResponse.json({ message: 'Failed to create comment' }, { status: 500 })
  }
}