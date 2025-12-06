'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Code, Users, MessageCircle, Search, BookOpen, Zap, Sparkles, TrendingUp, Award, Globe, Shield, Rocket } from 'lucide-react'

interface HomeClientProps {
  isAuthenticated: boolean
}

export default function HomeClient({ isAuthenticated }: HomeClientProps) {
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/feed')
    }
  }, [isAuthenticated, router])

  if (isAuthenticated) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Redirecting to your feed...</p>
      </div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Code className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gradient">EduNet</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" className="font-semibold">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="gradient-primary text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-transparent to-blue-100/50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-6 font-medium">
            <Sparkles className="h-4 w-4" />
            <span>The Future of Educational Networking</span>
          </div>
          
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
            Learn, Code,
            <span className="text-gradient block">Connect Together</span>
          </h2>
          
          <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join the ultimate educational social platform where students share coding questions, 
            connect with peers, and learn together. <span className="font-semibold text-purple-600">LinkedIn + Instagram + LeetCode</span> combined!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button size="lg" className="gradient-primary text-white font-bold px-10 py-6 text-lg shadow-glow hover:shadow-glow-lg transition-all transform hover:scale-105">
                <Rocket className="mr-2 h-5 w-5" />
                Join EduNet Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="font-semibold px-10 py-6 text-lg border-2 hover:bg-gray-50">
                Sign In
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span><strong className="text-gray-900">10K+</strong> Students</span>
            </div>
            <div className="flex items-center space-x-2">
              <Code className="h-5 w-5 text-purple-600" />
              <span><strong className="text-gray-900">50K+</strong> Code Snippets</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-purple-600" />
              <span><strong className="text-gray-900">100K+</strong> Discussions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Why Choose EduNet?</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to accelerate your learning journey</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-purple-200 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-3 text-gray-900">Code Sharing</h4>
                <p className="text-gray-600 leading-relaxed">
                  Share code snippets with beautiful syntax highlighting. Get help with debugging and learn from others' solutions.
                </p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-green-200 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-3 text-gray-900">Connect & Learn</h4>
                <p className="text-gray-600 leading-relaxed">
                  Build your network with fellow students, share knowledge, and grow together in a supportive community.
                </p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-200 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-3 text-gray-900">Real-time Chat</h4>
                <p className="text-gray-600 leading-relaxed">
                  Instant messaging with friends, study groups, and coding discussions. Never miss a beat.
                </p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-orange-200 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-3 text-gray-900">Track Progress</h4>
                <p className="text-gray-600 leading-relaxed">
                  Monitor your learning journey with detailed analytics and achievement badges.
                </p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-pink-200 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-3 text-gray-900">Achievements</h4>
                <p className="text-gray-600 leading-relaxed">
                  Earn badges and recognition for your contributions and learning milestones.
                </p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-2xl transition-all duration-300 border-2 hover:border-violet-200 hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-3 text-gray-900">Global Community</h4>
                <p className="text-gray-600 leading-relaxed">
                  Connect with students from around the world and expand your horizons.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">How EduNet Works</h3>
            <p className="text-xl text-gray-600">Get started in three simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-purple-100 hover:border-purple-300">
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    1
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="text-2xl font-bold mb-3 text-gray-900">Create Your Profile</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Set up your profile with skills, bio, and interests. Showcase your coding journey and connect with like-minded peers.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-blue-100 hover:border-blue-300">
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    2
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="text-2xl font-bold mb-3 text-gray-900">Share & Discover</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Post coding questions, share solutions, and discover new content. Learn from the community's collective knowledge.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-green-100 hover:border-green-300">
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    3
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="text-2xl font-bold mb-3 text-gray-900">Connect & Chat</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Make friends, join discussions, and chat in real-time. Build lasting connections in the tech community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h3 className="text-4xl sm:text-5xl font-bold mb-6">Ready to Start Learning?</h3>
          <p className="text-xl sm:text-2xl mb-10 opacity-90 leading-relaxed">
            Join thousands of students already learning and growing on EduNet
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-bold px-12 py-6 text-lg shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105">
              <Rocket className="mr-2 h-5 w-5" />
              Create Free Account
            </Button>
          </Link>
          <p className="mt-6 text-sm opacity-75">No credit card required • Free forever • Join in 30 seconds</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Code className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">EduNet</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                The educational social platform for students to learn, code, and connect.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 EduNet. All rights reserved. Made with ❤️ for students worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}