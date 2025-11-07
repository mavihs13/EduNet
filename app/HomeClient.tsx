'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Code, Users, MessageCircle, Search, BookOpen, Zap } from 'lucide-react'

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
    return <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting to feed...</p>
    </div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-blue-600">EduNet</h1>
          </div>
          <div className="flex space-x-4">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Learn, Code, Connect
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join the ultimate educational social platform where students share coding questions, 
            connect with peers, and learn together. It's LinkedIn + Instagram + LeetCode combined!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="px-8 py-3">
                Join EduNet Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose EduNet?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Code className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Code Sharing</h4>
                <p className="text-gray-600">
                  Share code snippets with syntax highlighting. Get help with debugging and learn from others.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Connect & Learn</h4>
                <p className="text-gray-600">
                  Build your network with fellow students, share knowledge, and grow together.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">Real-time Chat</h4>
                <p className="text-gray-600">
                  Instant messaging with friends, study groups, and coding discussions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">How EduNet Works</h3>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-semibold">Create Your Profile</h4>
                    <p className="text-gray-600">Set up your profile with skills, bio, and interests</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-semibold">Share & Discover</h4>
                    <p className="text-gray-600">Post coding questions, share solutions, and discover new content</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-semibold">Connect & Chat</h4>
                    <p className="text-gray-600">Make friends, join discussions, and chat in real-time</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Search className="h-5 w-5 text-blue-600" />
                  <span className="text-sm">Search users by skills</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Share coding problems</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-purple-600" />
                  <span className="text-sm">Real-time notifications</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-5 w-5 text-orange-600" />
                  <span className="text-sm">Instant messaging</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Start Learning?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students already learning and growing on EduNet
          </p>
          <Link href="/register">
            <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Code className="h-6 w-6" />
            <span className="text-xl font-bold">EduNet</span>
          </div>
          <p className="text-gray-400">
            © 2024 EduNet. The educational social platform for students.
          </p>
        </div>
      </footer>
    </div>
  )
}