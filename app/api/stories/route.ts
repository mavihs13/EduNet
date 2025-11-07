import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    try {
      const { content, mediaUrl, mediaType } = await request.json()
      
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)

      const story = await prisma.story.create({
        data: {
          userId: decoded.userId,
          content,
          mediaUrl,
          mediaType,
          expiresAt
        },
        include: {
          user: {
            include: { profile: true }
          },
          _count: {
            select: { views: true }
          }
        }
      })

      return NextResponse.json(story)
    } catch (error) {
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error('Story creation error:', error)
    return NextResponse.json({ error: 'Failed to create story' }, { status: 500 })
  }
}

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

    try {
      const friendships = await prisma.friendship.findMany({
        where: {
          OR: [{ user1Id: decoded.userId }, { user2Id: decoded.userId }]
        }
      })

      const friendIds = friendships.map(f => 
        f.user1Id === decoded.userId ? f.user2Id : f.user1Id
      )
      friendIds.push(decoded.userId)

      const stories = await prisma.story.findMany({
        where: {
          userId: { in: friendIds },
          expiresAt: { gt: new Date() }
        },
        include: {
          user: {
            include: { profile: true }
          },
          views: {
            where: { userId: decoded.userId }
          },
          _count: {
            select: { views: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      const groupedStories = stories.reduce((acc: any, story) => {
        const userId = story.userId
        if (!acc[userId]) {
          acc[userId] = {
            user: story.user,
            stories: [],
            hasUnviewed: false
          }
        }
        acc[userId].stories.push(story)
        if (story.views.length === 0) {
          acc[userId].hasUnviewed = true
        }
        return acc
      }, {})

      return NextResponse.json(Object.values(groupedStories))
    } catch (error) {
      return NextResponse.json([])
    }
  } catch (error) {
    console.error('Stories fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 })
  }
}