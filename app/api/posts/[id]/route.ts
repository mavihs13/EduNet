import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Update post (only within 2 minutes)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value
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

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 })
    }

    if (post.userId !== payload.userId) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 })
    }

    // Check if post is older than 2 minutes
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)
    if (post.createdAt < twoMinutesAgo) {
      return NextResponse.json({ message: 'Edit time expired (2 minutes)' }, { status: 403 })
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
        media: true,
        _count: {
          select: { likes: true, comments: true }
        }
      }
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Update post error:', error)
    return NextResponse.json({ message: 'Failed to update post' }, { status: 500 })
  }
}

// Delete post (anytime)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value
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

    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 })
    }

    if (post.userId !== payload.userId) {
      return NextResponse.json({ message: 'Not authorized' }, { status: 403 })
    }

    await prisma.post.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Delete post error:', error)
    return NextResponse.json({ message: 'Failed to delete post' }, { status: 500 })
  }
}
