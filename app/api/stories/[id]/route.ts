import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const story = await prisma.story.findUnique({
      where: { id: params.id }
    })

    if (!story || story.userId !== decoded.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.story.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Story deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete story' }, { status: 500 })
  }
}
