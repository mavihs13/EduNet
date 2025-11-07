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

    const { content, code, language, tags } = await request.json()

    const post = await prisma.post.create({
      data: {
        userId: payload.userId,
        content,
        code,
        language,
        tags: tags || [],
      },
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

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create post' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const posts = await prisma.post.findMany({
      skip,
      take: limit,
      include: {
        user: {
          include: { profile: true }
        },
        likes: true,
        comments: {
          include: {
            user: { include: { profile: true } }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { likes: true, comments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 })
  }
}