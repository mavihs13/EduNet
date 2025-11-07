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

    const { searchParams } = new URL(request.url)
    const otherUserId = searchParams.get('userId')

    if (!otherUserId) {
      return NextResponse.json({ message: 'User ID required' }, { status: 400 })
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: payload.userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: payload.userId }
        ]
      },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } }
      },
      orderBy: { createdAt: 'asc' }
    })

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: payload.userId,
        read: false
      },
      data: { read: true }
    })

    return NextResponse.json(messages)
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch messages' }, { status: 500 })
  }
}

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

    const { receiverId, content } = await request.json()

    const message = await prisma.message.create({
      data: {
        senderId: payload.userId,
        receiverId,
        content,
      },
      include: {
        sender: { include: { profile: true } },
        receiver: { include: { profile: true } }
      }
    })

    return NextResponse.json(message)
  } catch (error) {
    return NextResponse.json({ message: 'Failed to send message' }, { status: 500 })
  }
}