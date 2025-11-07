'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const router = useRouter()

  // Check password match in real-time
  useEffect(() => {
    if (formData.confirmPassword) {
      setPasswordMatch(formData.password === formData.confirmPassword)
    } else {
      setPasswordMatch(true)
    }
  }, [formData.password, formData.confirmPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Trim whitespace from all fields
    const trimmedData = {
      email: formData.email.trim(),
      username: formData.username.trim(),
      password: formData.password.trim(),
      confirmPassword: formData.confirmPassword.trim()
    }
    
    if (trimmedData.password !== trimmedData.confirmPassword) {
      setMessage('Passwords do not match')
      setMessageType('error')
      return
    }

    if (trimmedData.password.length < 6) {
      setMessage('Password must be at least 6 characters')
      setMessageType('error')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmedData.email,
          username: trimmedData.username,
          password: trimmedData.password,
        }),
      })

      const data = await res.json()
      console.log('Registration response:', data)

      if (res.ok && data.success) {
        setMessage('Account created successfully! Redirecting...')
        setMessageType('success')
        setTimeout(() => window.location.href = '/feed', 500)
      } else {
        setMessage(data.message || 'Registration failed')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setMessage('Network error. Please check your connection and try again.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10"></div>
      </div>
      
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-3 rounded-2xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
            Join EduNet
          </CardTitle>
          <p className="text-white/70 mt-2">Start your educational journey today</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="on">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              autoComplete="email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-emerald-400 transition-all duration-300"
            />
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              autoComplete="username"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-emerald-400 transition-all duration-300"
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              autoComplete="new-password"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-emerald-400 transition-all duration-300"
            />
            <div>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                autoComplete="new-password"
                className={`bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 transition-all duration-300 ${
                  !passwordMatch ? 'border-red-400 focus:border-red-400' : 'focus:border-emerald-400'
                }`}
              />
              {!passwordMatch && formData.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">Passwords do not match</p>
              )}
            </div>
            {message && (
              <div className={`p-3 rounded-lg text-sm ${messageType === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'}`}>
                {message}
              </div>
            )}
            <button
              type="submit"
              disabled={loading || !passwordMatch}
              className="w-full py-3 px-6 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">
                {loading ? 'Creating account...' : 'Create Account'}
              </span>
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-white/70">
              Already have an account?{' '}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-200">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}