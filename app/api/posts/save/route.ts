import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { postId } = await request.json()

    const existingSave = await prisma.save.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: decoded.userId
        }
      }
    })

    if (existingSave) {
      await prisma.save.delete({
        where: { id: existingSave.id }
      })
      return NextResponse.json({ saved: false })
    } else {
      await prisma.save.create({
        data: {
          postId,
          userId: decoded.userId
        }
      })
      return NextResponse.json({ saved: true })
    }
  } catch (error) {
    console.error('Save post error:', error)
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 })
  }
}