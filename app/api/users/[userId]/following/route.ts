import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const following = await prisma.follow.findMany({
      where: {
        followerId: params.userId
      },
      include: {
        following: {
          include: {
            profile: true
          }
        }
      }
    })

    const followingUsers = following.map(f => f.following)

    return NextResponse.json(followingUsers)
  } catch (error) {
    console.error('Failed to fetch following:', error)
    return NextResponse.json({ error: 'Failed to fetch following' }, { status: 500 })
  }
}
