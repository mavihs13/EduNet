import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const savedPosts = await prisma.save.findMany({
      where: { userId: decoded.userId },
      include: {
        post: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profile: {
                  select: {
                    name: true,
                    avatar: true
                  }
                }
              }
            },
            _count: {
              select: {
                likes: true,
                comments: true,
                saves: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(savedPosts)
  } catch (error) {
    console.error('Fetch saved posts error:', error)
    return NextResponse.json({ error: 'Failed to fetch saved posts' }, { status: 500 })
  }
}