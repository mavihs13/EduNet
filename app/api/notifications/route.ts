import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)!
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    
    if (unreadOnly) {
      const count = await prisma.notification.count({
        where: { userId: payload.userId, read: false }
      })
      return NextResponse.json({ count })
    }
    
    const notifications = await prisma.notification.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json(notifications)
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch notifications' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { userId, type, title, content } = await request.json()

    const notification = await prisma.notification.create({
      data: { userId, type, title, content }
    })

    return NextResponse.json(notification)
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create notification' }, { status: 500 })
  }
}