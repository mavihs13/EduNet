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

    const existingRequest = await prisma.friendRequest.findUnique({
      where: {
        senderId_receiverId: {
          senderId: payload.userId,
          receiverId
        }
      }
    })

    if (existingRequest) {
      return NextResponse.json({ message: 'Friend request already sent' }, { status: 400 })
    }

    const friendRequest = await prisma.friendRequest.create({
      data: {
        senderId: payload.userId,
        receiverId,
        status: 'pending'
      }
    })

    return NextResponse.json(friendRequest)
  } catch (error) {
    return NextResponse.json({ message: 'Failed to send friend request' }, { status: 500 })
  }
}