import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import prisma from '@/lib/prisma'

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

    const { requestId, action } = await request.json()

    const messageRequest = await prisma.messageRequest.findUnique({
      where: { id: requestId }
    })

    if (!messageRequest || messageRequest.receiverId !== payload.userId) {
      return NextResponse.json({ message: 'Request not found' }, { status: 404 })
    }

    if (action === 'accept') {
      await prisma.messageRequest.update({
        where: { id: requestId },
        data: { status: 'accepted' }
      })
      return NextResponse.json({ message: 'Request accepted' })
    } else if (action === 'reject') {
      await prisma.messageRequest.update({
        where: { id: requestId },
        data: { status: 'rejected' }
      })
      return NextResponse.json({ message: 'Request rejected' })
    }

    return NextResponse.json({ message: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Message request error:', error)
    return NextResponse.json({ message: 'Failed to process request' }, { status: 500 })
  }
}
