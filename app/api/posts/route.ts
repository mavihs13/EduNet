import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { postCrud } from '@/lib/crud'

export async function POST(request: NextRequest) {
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

    const { content, code, language, tags, media } = await request.json()

    const post = await postCrud.create({
      userId: payload.userId,
      content,
      code,
      language,
      tags,
      media
    })

    // Broadcast new post to followers
    if (global.io) {
      global.io.emit('new_post', post)
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Post creation error:', error)
    return NextResponse.json({ message: 'Failed to create post' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const userId = searchParams.get('userId')

    const posts = userId ? await postCrud.findByUserId(userId, page, limit) : await postCrud.findAll(page, limit)

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return NextResponse.json({ message: 'Failed to fetch posts' }, { status: 500 })
  }
}