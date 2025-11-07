import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { verifyToken } from '@/lib/auth'
import { authOptions } from '@/lib/auth-config'
import { prisma } from '@/lib/prisma'
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

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const currentUserId = await getCurrentUserId()
    
    const user = await prisma.user.findUnique({
      where: { username: params.username },
      include: {
        profile: true,
        posts: {
          include: {
            user: { include: { profile: true } },
            likes: true,
            comments: { include: { user: { include: { profile: true } } } },
            _count: { select: { likes: true, comments: true } }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Check if profile is private and user is not following
    const isPrivate = user.profile?.isPrivate || false
    const isOwner = currentUserId === user.id
    
    let isFollowing = false
    if (currentUserId && !isOwner) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: user.id
          }
        }
      })
      isFollowing = !!follow
    }

    // Filter posts based on privacy
    let posts = user.posts
    if (isPrivate && !isOwner && !isFollowing) {
      posts = []
    }

    return NextResponse.json({
      user: {
        ...user,
        posts
      },
      isFollowing,
      canViewPosts: !isPrivate || isOwner || isFollowing
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ message: 'Failed to fetch profile' }, { status: 500 })
  }
}