import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { notifyComment } from '@/lib/notifications'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: params.id },
      include: {
        user: { include: { profile: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(comments)
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)!
    const { content } = await request.json()

    const comment = await prisma.comment.create({
      data: {
        postId: params.id,
        userId: payload.userId,
        content,
      },
      include: {
        user: { include: { profile: true } }
      }
    })

    const post = await prisma.post.findUnique({ where: { id: params.id } })
    if (post && post.userId !== payload.userId) {
      await notifyComment(params.id, post.userId, {
        id: comment.user.id,
        name: comment.user.profile?.name,
        username: comment.user.username
      }, content)
    }

    if (global.io) {
      global.io.to(`post_${params.id}`).emit('new_comment', comment)
    }

    return NextResponse.json(comment)
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create comment' }, { status: 500 })
  }
}