import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { analyticsCrud } from '@/lib/crud'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const stats = await analyticsCrud.getStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ message: 'Failed to fetch analytics' }, { status: 500 })
  }
}