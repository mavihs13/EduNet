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

    const { receiverId } = await request.json()

    if (payload.userId === receiverId) {
      return NextResponse.json({ message: 'Cannot send friend request to yourself' }, { status: 400 })
    }

    // Check if friendship already exists
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id: payload.userId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: payload.userId }
        ]
      }
    })

    if (existingFriendship) {
      return NextResponse.json({ message: 'Already friends' }, { status: 400 })
    }

    // Check if request already exists
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: payload.userId, receiverId },
          { senderId: receiverId, receiverId: payload.userId }
        ]
      }
    })

    if (existingRequest) {
      return NextResponse.json({ message: 'Friend request already exists' }, { status: 400 })
    }

    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId: payload.userId,
        receiverId,
      },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } }
      }
    })

    return NextResponse.json(friendRequest)
  } catch (error) {
    return NextResponse.json({ message: 'Failed to send friend request' }, { status: 500 })
  }
}