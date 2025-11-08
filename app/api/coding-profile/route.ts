import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { codingProfileCrud } from '@/lib/crud'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || session.user.id

    const profile = await codingProfileCrud.findByUserId(userId)
    return NextResponse.json(profile)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch coding profile' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const profile = await codingProfileCrud.upsert(session.user.id, data)
    
    return NextResponse.json(profile)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update coding profile' }, { status: 500 })
  }
}