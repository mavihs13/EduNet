'use client'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Home, Search, Bell, Plus, Code, Menu, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CodingProfile from '@/components/CodingProfile'
import { useTheme } from '@/contexts/ThemeContext'

export default function CodingProfileClient({ user }: any) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">📚</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              EduNet
            </h1>
          </Link>
          
          <div className="flex items-center space-x-2">
            <Link href="/feed">
              <Button variant="ghost" size="icon" className="hover:bg-purple-50 text-gray-900 hover:text-purple-600 rounded-xl">
                <Home className="h-6 w-6" />
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="ghost" size="icon" className="hover:bg-purple-50 text-gray-900 hover:text-purple-600 rounded-xl">
                <Search className="h-6 w-6" />
              </Button>
            </Link>
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all">
              <Plus className="h-5 w-5 mr-2" />
              Create
            </Button>
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="hover:bg-purple-50 text-gray-900 hover:text-purple-600 rounded-xl">
                <Bell className="h-6 w-6" />
              </Button>
            </Link>
            <Link href="/coding-profile">
              <Button variant="ghost" size="icon" className="hover:bg-purple-50 text-gray-900 hover:text-purple-600 rounded-xl bg-purple-100">
                <Code className="h-6 w-6" />
              </Button>
            </Link>
            <Link href="/profile">
              <Avatar className="h-10 w-10 ring-2 ring-purple-500 hover:ring-indigo-500 transition-all cursor-pointer">
                <AvatarImage src={user.profile?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold text-lg">
                  {user.profile?.name?.[0] || user.username[0]}
                </AvatarFallback>
              </Avatar>
            </Link>
            <Button variant="ghost" size="icon" className="hover:bg-purple-50 text-gray-900 hover:text-purple-600 rounded-xl">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center space-x-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="hover:bg-purple-50 text-gray-900 hover:text-purple-600 rounded-xl"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Coding Profile</h2>
            <p className="text-gray-600">Track your coding journey and achievements</p>
          </div>
        </div>

        <CodingProfile user={user} isOwnProfile={true} />
      </div>
    </div>
  )
}
