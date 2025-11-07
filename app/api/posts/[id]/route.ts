import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const post = await prisma.post.findUnique({
      where: { id: params.id }
    })

    if (!post || post.userId !== payload.userId) {
      return NextResponse.json({ message: 'Post not found or unauthorized' }, { status: 404 })
    }

    // Check if post is within 30 minutes
    const postTime = new Date(post.createdAt).getTime()
    const now = new Date().getTime()
    const thirtyMinutes = 30 * 60 * 1000

    if ((now - postTime) > thirtyMinutes) {
      return NextResponse.json({ message: 'Edit time expired' }, { status: 400 })
    }

    const { content } = await request.json()

    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: { content },
      include: {
        user: {
          include: { profile: true }
        },
        likes: true,
        comments: {
          include: {
            user: { include: { profile: true } }
          }
        },
        _count: {
          select: { likes: true, comments: true }
        }
      }
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const post = await prisma.post.findUnique({
      where: { id: params.id }
    })

    if (!post || post.userId !== payload.userId) {
      return NextResponse.json({ message: 'Post not found or unauthorized' }, { status: 404 })
    }

    await prisma.post.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete post' }, { status: 500 })
  }
}