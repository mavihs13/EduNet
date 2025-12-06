'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      alert('Invalid reset token')
      return
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })

      const data = await res.json()

      if (res.ok) {
        alert('Password reset successful! Please login with your new password.')
        window.location.href = '/login'
      } else {
        alert(data.message || 'Failed to reset password')
      }
    } catch (error) {
      alert('Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'Billabong, cursive' }}>
              EduNet
            </h1>
          </div>
          <div className="bg-gray-900 border border-gray-700 rounded p-8 text-center">
            <p className="text-gray-300 mb-4">Invalid or missing reset token</p>
            <Link
              href="/forgot-password"
              className="inline-block w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded transition-colors"
              style={{ backgroundColor: '#4e8fef' }}
            >
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Billabong, cursive' }}>
            EduNet
          </h1>
        </div>
        
        <div className="bg-gray-900 border border-gray-700 rounded p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
            <p className="text-gray-400 text-sm">Enter your new password</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none transition-colors"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#4e8fef' }}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
          
          <div className="text-center mt-6">
            <Link href="/login" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}