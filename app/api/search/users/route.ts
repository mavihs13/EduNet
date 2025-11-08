import { NextRequest, NextResponse } from 'next/server'
import { searchCrud } from '@/lib/crud'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    
    if (!query) {
      return NextResponse.json([])
    }

    const users = await searchCrud.users(query, 20)
    return NextResponse.json(users)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ message: 'Search failed' }, { status: 500 })
  }
}