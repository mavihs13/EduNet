import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import PostsClient from './PostsClient'

export default async function PostsPage() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    redirect('/login')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { profile: true }
    })

    if (!user) {
      redirect('/login')
    }

    const posts = await prisma.post.findMany({
      include: {
        user: { include: { profile: true } },
        likes: true,
        comments: { include: { user: { include: { profile: true } } } },
        _count: { select: { likes: true, comments: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return <PostsClient user={user} initialPosts={posts} />
  } catch (error) {
    redirect('/login')
  }
}