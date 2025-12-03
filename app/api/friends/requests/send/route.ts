import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { friendCrud } from '@/lib/crud'

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
    const friendRequest = await friendCrud.sendRequest(payload.userId, receiverId)

    return NextResponse.json(friendRequest)
  } catch (error) {
    return NextResponse.json({ message: 'Failed to send friend request' }, { status: 500 })
  }
}