import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
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

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { user1Id: payload.userId },
          { user2Id: payload.userId }
        ]
      },
      include: {
        user1: { include: { profile: true } },
        user2: { include: { profile: true } }
      }
    })

    const friends = friendships.map(friendship => {
      return friendship.user1Id === payload.userId 
        ? friendship.user2 
        : friendship.user1
    })

    return NextResponse.json(friends)
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch friends' }, { status: 500 })
  }
}