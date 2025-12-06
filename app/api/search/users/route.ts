import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { searchCrud } from '@/lib/crud'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value
    
    let currentUserId: string | undefined
    if (token) {
      const payload = verifyToken(token)
      currentUserId = payload?.userId
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    if (!query.trim()) {
      return NextResponse.json([])
    }

    const users = await searchCrud.users(query, currentUserId)
    return NextResponse.json(users)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ message: 'Search failed' }, { status: 500 })
  }
}
