import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { verifyToken } from '@/lib/auth'
import { authOptions } from '@/lib/auth-config'
import { followCrud } from '@/lib/crud'
import { cookies } from 'next/headers'

async function getCurrentUserId() {
  const session = await getServerSession(authOptions)
  if (session?.user?.id) return session.user.id

  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value
  if (!token) return null

  const payload = verifyToken(token)
  return payload?.userId || null
}

export async function GET(request: NextRequest) {
  try {
    const currentUserId = await getCurrentUserId()
    if (!currentUserId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ message: 'User ID required' }, { status: 400 })
    }

    const isFollowing = await followCrud.isFollowing(currentUserId, userId)
    return NextResponse.json({ isFollowing })
  } catch (error) {
    console.error('Follow status error:', error)
    return NextResponse.json({ message: 'Failed to get follow status' }, { status: 500 })
  }
}