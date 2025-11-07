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

    const { name, bio, avatar, skills, links, location } = await request.json()

    const profile = await prisma.profile.upsert({
      where: { userId: decoded.userId },
      update: {
        name,
        bio,
        avatar,
        skills,
        links,
        location,
      },
      create: {
        userId: decoded.userId,
        name,
        bio,
        avatar,
        skills,
        links,
        location,
      },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}