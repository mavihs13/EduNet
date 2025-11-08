import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateTokens } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ message: 'Valid username and password required' }, { status: 400 })
    }

    // Login only with username
    const user = await prisma.user.findUnique({
      where: { username: username },
      include: { profile: true }
    })

    if (!user || !user.password || !(await verifyPassword(password, user.password))) {
      return NextResponse.json({ message: 'Invalid username or password' }, { status: 401 })
    }

    const { accessToken, refreshToken } = generateTokens(user.id)

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profile: user.profile
      }
    })

    response.cookies.set('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    })
    
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ message: 'Login failed' }, { status: 500 })
  }
}