import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateTokens } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password required' }, { status: 400 })
    }

    // Check if input is email or username
    const isEmail = username.includes('@')
    
    const user = await prisma.user.findFirst({
      where: isEmail ? { email: username } : { username: username },
      include: { profile: true }
    })

    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
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
      maxAge: 15 * 60,
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