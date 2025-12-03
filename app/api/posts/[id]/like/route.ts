import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { likeCrud, notificationCrud } from '@/lib/crud'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const result = await likeCrud.toggle(params.id, payload.userId)
    
    // Create notification if liked
    if (result.liked) {
      const post = await prisma.post.findUnique({
        where: { id: params.id },
        include: { user: true }
      })
      
      if (post && post.userId !== payload.userId) {
        const liker = await prisma.user.findUnique({
          where: { id: payload.userId },
          include: { profile: true }
        })
        
        if (liker) {
          await notificationCrud.create({
            userId: post.userId,
            type: 'like',
            title: 'New Like',
            content: `${liker.profile?.name || liker.username} liked your post`
          })
        }
      }
    }
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ message: 'Failed to toggle like' }, { status: 500 })
  }
}