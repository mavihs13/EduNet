'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, MessageCircle, CheckCircle, Github } from 'lucide-react'
import { signIn } from 'next-auth/react'

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
    
    // Validate email is provided
    if (!trimmedData.email) {
      setMessage('Email is required for account recovery')
      setMessageType('error')
      return
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
        // Save username for future autofill
        localStorage.setItem('rememberedUsername', trimmedData.username)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Left Section - 45% */}
      <div className="w-[45%] flex items-center justify-center relative z-10 p-12">
        <div className="max-w-md">
          {/* Logo & Tagline */}
          <div className="mb-12">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-3xl">📚</span>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                EduNet
              </h1>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Start Your
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Learning Journey</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Join a vibrant community of developers. Share code, learn together, and accelerate your growth.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">10K+</p>
              <p className="text-gray-400 text-sm mt-1">Developers</p>
            </div>
            <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">50K+</p>
              <p className="text-gray-400 text-sm mt-1">Code Shared</p>
            </div>
            <div className="text-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">100K+</p>
              <p className="text-gray-400 text-sm mt-1">Problems Solved</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Section - 55% */}
      <div className="w-[55%] flex items-center justify-center relative z-10 p-12">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-10 shadow-2xl">
          
            {/* Welcome Text */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
              <p className="text-gray-400">Join EduNet and start learning today</p>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className={`w-full px-4 py-3.5 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all ${
                    !passwordMatch ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-white/10 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                  }`}
                />
                {!passwordMatch && formData.confirmPassword && (
                  <p className="text-red-400 text-sm mt-2">Passwords do not match</p>
                )}
              </div>
            
            {message && (
              <div className={`p-3 rounded text-sm ${messageType === 'success' ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-red-900/50 text-red-300 border border-red-700'}`}>
                {message}
              </div>
            )}
            
              <button
                type="submit"
                disabled={loading || !passwordMatch}
                className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </span>
                ) : 'Create Account'}
              </button>
            </form>
          
            {/* OR Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="px-4 text-gray-400 text-sm font-medium">OR</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>
            
            {/* GitHub Signup */}
            <button 
              onClick={() => signIn('github', { callbackUrl: '/feed' })}
              className="w-full flex items-center justify-center space-x-3 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl transition-all font-medium"
            >
              <Github className="w-5 h-5" />
              <span>Sign up with GitHub</span>
            </button>
            
            {/* Sign In Link */}
            <div className="text-center mt-8 pt-6 border-t border-white/10">
              <span className="text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                  Sign in
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div className="text-center">
          <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500 mb-3">
            <a href="#" className="hover:text-gray-300 transition-colors">About</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Blog</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Help</a>
            <a href="#" className="hover:text-gray-300 transition-colors">API</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms</a>
          </div>
          <p className="text-xs text-gray-600">© 2025 EduNet. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}