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

    const { requestId } = await request.json()
    await friendCrud.acceptRequest(requestId, payload.userId)

    return NextResponse.json({ message: 'Friend request accepted' })
  } catch (error) {
    return NextResponse.json({ message: 'Failed to accept friend request' }, { status: 500 })
  }
}