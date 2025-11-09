import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const postId = params.id
    const userId = payload.userId

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    })

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      })
      return NextResponse.json({ liked: false })
    } else {
      // Get post details to create notification
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: { user: { include: { profile: true } } }
      })
      
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      })
      
      // Create notification if liking someone else's post
      let notificationCreated = false
      if (post && post.userId !== userId) {
        const liker = await prisma.user.findUnique({
          where: { id: userId },
          include: { profile: true }
        })
        
        if (liker) {
          await prisma.notification.create({
            data: {
              userId: post.userId,
              type: 'like',
              title: 'New Like',
              content: `${liker.profile?.name || liker.username} liked your post`,
              read: false
            }
          })
          notificationCreated = true
        }
      }
      
      return NextResponse.json({ liked: true, notificationCreated })
    }
  } catch (error) {
    return NextResponse.json({ message: 'Failed to toggle like' }, { status: 500 })
  }
}