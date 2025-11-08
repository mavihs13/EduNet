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
      const { storyId } = await request.json()

      await prisma.storyView.upsert({
        where: {
          storyId_userId: {
            storyId,
            userId: decoded.userId
          }
        },
        update: {
          viewedAt: new Date()
        },
        create: {
          storyId,
          userId: decoded.userId
        }
      })

      return NextResponse.json({ success: true })
    } catch (error) {
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error('Story view error:', error)
    return NextResponse.json({ error: 'Failed to record view' }, { status: 500 })
  }
}