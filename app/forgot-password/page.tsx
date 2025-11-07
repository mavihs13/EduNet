'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [resetToken, setResetToken] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      
      if (res.ok) {
        setSent(true)
        if (data.resetToken) {
          setResetToken(data.resetToken)
        }
      } else {
        setMessage(data.message || 'Failed to send reset email')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Failed to send reset email')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
        </div>
        
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-green-500 to-blue-600 p-3 rounded-2xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Check Your Email
            </CardTitle>
            <p className="text-white/70 mt-2">Reset link sent successfully</p>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6 text-white/70">We've sent a password reset link to {email}</p>
            {resetToken ? (
              <div className="mb-6">
                <p className="mb-3 text-white/60 text-sm">Email not configured. Use this development link:</p>
                <Link 
                  href={`/reset-password?token=${resetToken}`}
                  className="inline-block w-full py-3 px-4 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 relative overflow-hidden group border border-white/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 opacity-60"></div>
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-2xl"></div>
                  <span className="relative z-10 drop-shadow-lg">Reset Password Now</span>
                </Link>
              </div>
            ) : (
              <p className="mb-6 text-white/60 text-sm">Please check your email and click the reset link to continue.</p>
            )}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
              Back to Login
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
      </div>
      
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-3 rounded-2xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Reset Password
          </CardTitle>
          <p className="text-white/70 mt-2">Enter your email to reset password</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-orange-400 transition-all duration-300"
              />
            </div>
            {message && (
              <div className={`p-3 rounded-lg text-sm ${messageType === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                {message}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transform hover:scale-[1.02] hover:-translate-y-1 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group border border-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/20 opacity-60"></div>
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-2xl"></div>
              <span className="relative z-10 drop-shadow-lg">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </span>
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/login" className="text-orange-400 hover:text-orange-300 text-sm transition-colors duration-200">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}