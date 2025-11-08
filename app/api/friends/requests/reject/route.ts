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

    const { requestId } = await request.json()

    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId }
    })

    if (!friendRequest || friendRequest.receiverId !== payload.userId) {
      return NextResponse.json({ message: 'Friend request not found' }, { status: 404 })
    }

    await prisma.friendRequest.delete({
      where: { id: requestId }
    })

    return NextResponse.json({ message: 'Friend request rejected' })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to reject friend request' }, { status: 500 })
  }
}