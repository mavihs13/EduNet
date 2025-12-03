import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { searchCrud } from '@/lib/crud'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json([])
    }

    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value
    const payload = token ? verifyToken(token) : null
    
    const users = await searchCrud.users(query, payload?.userId)

    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ message: 'Search failed' }, { status: 500 })
  }
}