import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import prisma from '@/lib/prisma'

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
    const partnerId = searchParams.get('partnerId')

    if (!partnerId) {
      return NextResponse.json({ message: 'Partner ID required' }, { status: 400 })
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: payload.userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: payload.userId }
        ]
      },
      orderBy: { createdAt: 'asc' }
    })

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        senderId: partnerId,
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

    // Check if users follow each other or receiver has public account
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      include: { profile: true }
    })

    const mutualFollow = await prisma.follow.findFirst({
      where: {
        AND: [
          { followerId: payload.userId, followingId: receiverId },
          { followerId: receiverId, followingId: payload.userId }
        ]
      }
    })

    // If not mutual followers and receiver has private account, create message request
    if (!mutualFollow && receiver?.profile?.isPrivate) {
      const existingRequest = await prisma.messageRequest.findUnique({
        where: {
          senderId_receiverId: {
            senderId: payload.userId,
            receiverId
          }
        }
      })

      if (!existingRequest) {
        await prisma.messageRequest.create({
          data: {
            senderId: payload.userId,
            receiverId
          }
        })
        return NextResponse.json({ message: 'Message request sent' }, { status: 200 })
      }

      if (existingRequest.status === 'pending') {
        return NextResponse.json({ message: 'Message request already sent' }, { status: 400 })
      }

      if (existingRequest.status === 'rejected') {
        return NextResponse.json({ message: 'Cannot send message' }, { status: 403 })
      }
    }

    const message = await prisma.message.create({
      data: {
        senderId: payload.userId,
        receiverId,
        content
      },
      include: {
        sender: { include: { profile: true } }
      }
    })

    // Real-time message delivery
    if (global.io) {
      global.io.to(`user_${receiverId}`).emit('new_message', message)
    }

    // Notify receiver
    const { notifyMessage } = await import('@/lib/notifications')
    await notifyMessage(payload.userId, receiverId, {
      id: message.sender.id,
      name: message.sender.profile?.name,
      username: message.sender.username
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('Message error:', error)
    return NextResponse.json({ message: 'Failed to send message' }, { status: 500 })
  }
}