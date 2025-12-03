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

    const [postsCount, followersCount, followingCount] = await Promise.all([
      prisma.post.count({ where: { userId: decoded.userId } }),
      prisma.follow.count({ where: { followingId: decoded.userId } }),
      prisma.follow.count({ where: { followerId: decoded.userId } })
    ])

    return NextResponse.json({
      posts: postsCount,
      followers: followersCount,
      following: followingCount
    })
  } catch (error) {
    console.error('Profile stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
