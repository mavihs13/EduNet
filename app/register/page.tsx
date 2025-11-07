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
          {/* EduNet Logo */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'Billabong, cursive' }}>
              EduNet
            </h1>
          </div>
          
          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none transition-colors"
            />
            

            
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none transition-colors"
            />
            
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none transition-colors"
            />
            
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              className={`w-full px-4 py-3 bg-gray-900 border rounded text-white placeholder-gray-400 focus:outline-none transition-colors ${
                !passwordMatch ? 'border-red-500 focus:border-red-500' : 'border-gray-700 focus:border-gray-500'
              }`}
            />
            {!passwordMatch && formData.confirmPassword && (
              <p className="text-red-400 text-sm">Passwords do not match</p>
            )}
            
            {message && (
              <div className={`p-3 rounded text-sm ${messageType === 'success' ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-red-900/50 text-red-300 border border-red-700'}`}>
                {message}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || !passwordMatch}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#4e8fef' }}
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>
          
          {/* OR Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="px-4 text-gray-400 text-sm font-semibold">OR</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>
          
          {/* GitHub Signup */}
          <button 
            onClick={() => signIn('github', { callbackUrl: '/feed' })}
            className="w-full flex items-center justify-center space-x-2 py-3 text-gray-300 hover:text-white transition-colors border border-gray-700 rounded hover:border-gray-600"
          >
            <Github className="w-5 h-5" />
            <span className="font-semibold">Sign up with GitHub</span>
          </button>
          
          {/* Sign In Link */}
          <div className="text-center mt-8 pt-8 border-t border-gray-800">
            <span className="text-gray-400 text-sm">
              Have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
                Log in
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
            <a href="#" className="hover:underline">maviThreads</a>
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