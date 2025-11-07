import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateTokens } from '@/lib/auth'
import { initializeDatabase } from '@/lib/init-db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    console.log('Registration request body:', body)
    
    const { email, phone, username, password } = JSON.parse(body)

    if (!email || !username || !password) {
      return NextResponse.json(
        { success: false, message: 'Email, username, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Initialize database
    const dbReady = await initializeDatabase()
    if (!dbReady) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database not ready. Please run: npm run setup'
      }, { status: 500 })
    }

    const whereConditions = [{ username }, { email }]
    
    const existingUser = await prisma.user.findFirst({
      where: { OR: whereConditions }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email, phone, or username already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        profile: {
          create: {
            name: username,
          }
        }
      },
      include: { profile: true }
    })

    // Auto-login after registration
    const { accessToken, refreshToken } = generateTokens(user.id)

    const response = NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        profile: user.profile
      }
    })

    // Set cookies for auto-login
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
    console.error('Registration error:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Registration failed: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
}