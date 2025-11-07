import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json([])
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            profile: {
              name: {
                contains: query,
                mode: 'insensitive'
              }
            }
          },
          {
            profile: {
              skills: {
                hasSome: [query]
              }
            }
          }
        ]
      },
      include: {
        profile: true
      },
      take: 20
    })

    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ message: 'Search failed' }, { status: 500 })
  }
}