import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)!
    const { content } = await request.json()

    const comment = await prisma.comment.create({
      data: {
        postId: params.id,
        userId: payload.userId,
        content,
      },
      include: {
        user: { include: { profile: true } }
      }
    })

    return NextResponse.json(comment)
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create comment' }, { status: 500 })
  }
}