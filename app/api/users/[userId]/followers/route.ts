import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const followers = await prisma.follow.findMany({
      where: {
        followingId: params.userId
      },
      include: {
        follower: {
          include: {
            profile: true
          }
        }
      }
    })

    const followerUsers = followers.map(f => f.follower)

    return NextResponse.json(followerUsers)
  } catch (error) {
    console.error('Failed to fetch followers:', error)
    return NextResponse.json({ error: 'Failed to fetch followers' }, { status: 500 })
  }
}
