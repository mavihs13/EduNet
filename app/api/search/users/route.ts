import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { searchCrud } from '@/lib/crud'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const suggestions = searchParams.get('suggestions') === 'true'
    
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value
    let currentUserId: string | undefined
    
    if (token) {
      const payload = verifyToken(token)
      currentUserId = payload?.userId
    }
    
    // Return suggestions if requested
    if (suggestions && currentUserId) {
      const users = await searchCrud.suggestions(currentUserId, 10)
      return NextResponse.json(users)
    }
    
    if (!query) {
      return NextResponse.json([])
    }

    const users = await searchCrud.users(query, currentUserId, 20)
    return NextResponse.json(users)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ message: 'Search failed' }, { status: 500 })
  }
}