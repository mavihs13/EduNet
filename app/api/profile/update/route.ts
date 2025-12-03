import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { name, username, bio, avatar, skills, location } = await request.json()

    const user = await prisma.user.update({
      where: { id: decoded.userId },
      data: { username },
      include: { profile: true }
    })

    const profile = await prisma.profile.upsert({
      where: { userId: decoded.userId },
      update: { name, bio, avatar, skills, location },
      create: { userId: decoded.userId, name, bio, avatar, skills, location }
    })

    return NextResponse.json({ ...user, profile })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
