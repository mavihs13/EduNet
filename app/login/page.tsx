'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, MessageCircle, CheckCircle, Github } from 'lucide-react'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const router = useRouter()

  // Load saved username on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername')
    if (savedUsername) {
      setUsername(savedUsername)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        // Save username for future autofill (not password for security)
        localStorage.setItem('rememberedUsername', username)
        setMessage('Login successful! Redirecting...')
        setMessageType('success')
        setTimeout(() => window.location.href = '/feed', 500)
      } else {
        setMessage(data.message || 'Login failed')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Login error:', error)
      setMessage('Login failed')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Section - 40% */}
      <div className="w-2/5 flex items-center justify-center relative overflow-hidden">
        {/* Background Images Collage */}
        <div className="relative w-80 h-96">
          {/* Main Images */}
          <div className="absolute top-0 left-0 w-48 h-64 rounded-2xl overflow-hidden shadow-2xl transform rotate-12 hover:rotate-6 transition-transform duration-500">
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white text-6xl">📚</span>
            </div>
          </div>
          
          <div className="absolute top-8 right-0 w-40 h-56 rounded-2xl overflow-hidden shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500">
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white text-5xl">💻</span>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-8 w-44 h-60 rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:-rotate-3 transition-transform duration-500">
            <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <span className="text-white text-5xl">🚀</span>
            </div>
          </div>
          
          <div className="absolute bottom-4 right-4 w-36 h-48 rounded-2xl overflow-hidden shadow-2xl transform -rotate-12 hover:-rotate-6 transition-transform duration-500">
            <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <span className="text-white text-4xl">🎯</span>
            </div>
          </div>
        </div>
        
        {/* Floating UI Elements */}
        <Heart className="absolute top-20 left-20 w-8 h-8 text-red-500 animate-pulse" fill="currentColor" />
        <MessageCircle className="absolute top-32 right-16 w-6 h-6 text-blue-400 animate-bounce" />
        <CheckCircle className="absolute bottom-32 left-12 w-7 h-7 text-green-500 animate-pulse" fill="currentColor" />
        <div className="absolute top-40 left-32 text-2xl animate-bounce">🔥</div>
        <div className="absolute bottom-40 right-20 text-2xl animate-pulse">💜</div>
        
        {/* Rainbow Profile Ring */}
        <div className="absolute top-16 right-32 w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 p-1 animate-spin-slow">
          <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
            <span className="text-white text-xl">👤</span>
          </div>
        </div>
      </div>
      
      {/* Right Section - 60% */}
      <div className="w-3/5 flex items-center justify-center">
        <div className="w-full max-w-sm">
          {/* Instagram Logo */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'Billabong, cursive' }}>
              EduNet
            </h1>
          </div>
          
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none transition-colors"
            />
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none transition-colors"
            />
            
            {message && (
              <div className={`p-3 rounded text-sm ${messageType === 'success' ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-red-900/50 text-red-300 border border-red-700'}`}>
                {message}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#4e8fef' }}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
          
          {/* OR Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="px-4 text-gray-400 text-sm font-semibold">OR</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>
          
          {/* GitHub Login */}
          <button 
            onClick={() => signIn('github', { callbackUrl: '/feed' })}
            className="w-full flex items-center justify-center space-x-2 py-3 text-gray-300 hover:text-white transition-colors border border-gray-700 rounded hover:border-gray-600"
          >
            <Github className="w-5 h-5" />
            <span className="font-semibold">Continue with GitHub</span>
          </button>
          
          {/* Forgot Password */}
          <div className="text-center mt-6">
            <Link href="/forgot-password" className="text-white text-sm hover:underline">
              Forgot password?
            </Link>
          </div>
          
          {/* Sign Up Link */}
          <div className="text-center mt-8 pt-8 border-t border-gray-800">
            <span className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-400 hover:text-blue-300 font-semibold">
                Sign up
              </Link>
            </span>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center space-x-4 text-xs text-gray-500 mb-4">
            <a href="#" className="hover:underline">Mavi</a>
            <a href="#" className="hover:underline">About</a>
            <a href="#" className="hover:underline">Blog</a>
            <a href="#" className="hover:underline">Jobs</a>
            <a href="#" className="hover:underline">Help</a>
            <a href="#" className="hover:underline">API</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Locations</a>
            <a href="#" className="hover:underline">EduNet Lite</a>
            <a href="#" className="hover:underline">Mavi AI</a>
            <a href="#" className="hover:underline">Threads</a>
            <a href="#" className="hover:underline">Contact</a>
            <a href="#" className="hover:underline">Mavi Verified</a>
          </div>
          <div className="flex justify-center items-center space-x-4 text-xs text-gray-500">
            <span>© 2025 EduNet from Mavi</span>
            <select className="bg-transparent border-none text-gray-500 text-xs">
              <option>English</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}