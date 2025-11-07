import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    const { name, bio, location, skills, avatar } = await request.json()

    const profile = await prisma.profile.upsert({
      where: { userId: payload.userId },
      update: { name, bio, location, skills, avatar },
      create: { userId: payload.userId, name, bio, location, skills, avatar }
    })

    return NextResponse.json(profile)
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 })
  }
}