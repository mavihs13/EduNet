import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)!
    const { requestId } = await request.json()

    const friendRequest = await prisma.friendRequest.findUnique({
      where: { id: requestId }
    })

    if (!friendRequest || friendRequest.receiverId !== payload.userId) {
      return NextResponse.json({ message: 'Request not found' }, { status: 404 })
    }

    await prisma.friendRequest.delete({
      where: { id: requestId }
    })

    return NextResponse.json({ message: 'Friend request rejected' })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to reject request' }, { status: 500 })
  }
}