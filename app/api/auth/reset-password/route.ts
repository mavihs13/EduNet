import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ message: 'Token and password are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters' }, { status: 400 })
    }

    // Verify token
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string }
    } catch (error) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 })
    }

    // Update password
    const hashedPassword = await hashPassword(password)
    
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword }
    })

    return NextResponse.json({ message: 'Password reset successfully' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ message: 'Failed to reset password' }, { status: 500 })
  }
}