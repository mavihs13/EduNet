import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ message: 'If this email exists, a reset link has been sent' })
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    )

    // Try to send reset email, fallback to console/response if email not configured
    let emailSent = false
    try {
      if (process.env.SMTP_USER && process.env.SMTP_PASS && 
          process.env.SMTP_USER !== 'your-email@gmail.com' &&
          process.env.SMTP_USER !== 'your-real-email@gmail.com' &&
          process.env.SMTP_PASS !== 'your-gmail-app-password') {
        await sendPasswordResetEmail(user.email, resetToken)
        console.log(`Password reset email sent to: ${email}`)
        emailSent = true
      } else {
        console.log('📧 Email not configured - using development mode')
      }
    } catch (emailError) {
      console.error('Failed to send email:', emailError)
    }

    // If email not configured or failed, provide reset link for development
    if (!emailSent) {
      console.log(`\n🔗 Password Reset Link for ${email}:`)
      console.log(`${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`)
      console.log('\n📧 Configure SMTP settings in .env.local to send actual emails\n')
      
      return NextResponse.json({ 
        message: 'If this email exists, a reset link has been sent',
        resetToken, // Include for development
        resetUrl: `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`
      })
    }

    return NextResponse.json({ 
      message: 'If this email exists, a reset link has been sent'
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ message: 'Failed to process request' }, { status: 500 })
  }
}