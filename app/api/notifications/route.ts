import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { notificationCrud } from '@/lib/crud'

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
      const count = await notificationCrud.getUnreadCount(payload.userId)
      return NextResponse.json({ count })
    }
    
    const notifications = await notificationCrud.findByUser(payload.userId)

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
    const notification = await notificationCrud.create({ userId, type, title, content })

    return NextResponse.json(notification)
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create notification' }, { status: 500 })
  }
}