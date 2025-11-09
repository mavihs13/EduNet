import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const data = await request.json()
    
    if (!data.title || !data.description || !data.type) {
      return NextResponse.json({ error: 'Title, description and type are required' }, { status: 400 })
    }

    // Check if achievement belongs to user
    const existingAchievement = await prisma.achievement.findUnique({
      where: { id: params.id }
    })

    if (!existingAchievement || existingAchievement.userId !== payload.userId) {
      return NextResponse.json({ error: 'Achievement not found or unauthorized' }, { status: 404 })
    }
    
    const achievement = await prisma.achievement.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        badge: data.badge || null
      }
    })
    
    return NextResponse.json(achievement)
  } catch (error) {
    console.error('Achievement update error:', error)
    return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 })
  }
}