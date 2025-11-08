import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { achievementCrud } from '@/lib/crud'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const achievements = await achievementCrud.findByUserId(userId)
    return NextResponse.json(achievements)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    const achievement = await achievementCrud.create({
      userId: session.user.id,
      ...data
    })
    
    return NextResponse.json(achievement)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 })
  }
}