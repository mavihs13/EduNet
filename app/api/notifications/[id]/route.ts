import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { followCrud } from '@/lib/crud'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { action } = await request.json()
    const notification = await prisma.notification.findUnique({
      where: { id: params.id }
    })

    if (!notification || notification.userId !== payload.userId) {
      return NextResponse.json({ message: 'Notification not found' }, { status: 404 })
    }

    if (notification.type !== 'follow') {
      return NextResponse.json({ message: 'Invalid notification type' }, { status: 400 })
    }

    const metadata = JSON.parse(notification.metadata || '{}')
    const followerId = metadata.followerId

    if (action === 'accept') {
      await prisma.notification.update({
        where: { id: params.id },
        data: { read: true }
      })
      return NextResponse.json({ success: true, message: 'Follow accepted' })
    } else if (action === 'reject') {
      await followCrud.toggle(followerId, payload.userId)
      await prisma.notification.delete({ where: { id: params.id } })
      return NextResponse.json({ success: true, message: 'Follow rejected' })
    }

    return NextResponse.json({ message: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Notification action error:', error)
    return NextResponse.json({ message: 'Failed to process action' }, { status: 500 })
  }
}
