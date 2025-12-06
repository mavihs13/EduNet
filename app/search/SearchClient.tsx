'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, UserPlus, UserCheck, Home, Bell, Plus, Code, Menu, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'

interface SearchClientProps {
  user: any
  users: any[]
}

export default function SearchClient({ user, users }: SearchClientProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState(users)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = users.filter(u => 
      u.username.toLowerCase().includes(term.toLowerCase()) ||
      u.profile?.name?.toLowerCase().includes(term.toLowerCase()) ||
      u.profile?.skills?.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredUsers(filtered)
  }

  const toggleFollow = async (userId: string) => {
    try {
      const res = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: userId })
      })
      if (res.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error)
    }
  }

  const acceptFriendRequest = async (requestId: string) => {
    try {
      const res = await fetch('/api/friends/requests/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId })
      })
      if (res.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to accept friend request:', error)
    }
  }

  const isFollowing = (targetUser: any) => {
    return targetUser.isFollowedByCurrentUser || false
  }

  const getUserStatus = (targetUser: any) => {
    return targetUser.friendshipStatus || 'none'
  }

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
              <Button variant="ghost" size="icon" className="hover:bg-purple-50 text-gray-900 hover:text-purple-600 rounded-xl bg-purple-100">
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
              <Button variant="ghost" size="icon" className="hover:bg-purple-50 text-gray-900 hover:text-purple-600 rounded-xl">
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

      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="flex items-center space-x-4 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="hover:bg-purple-50 text-gray-900 hover:text-purple-600 rounded-xl"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h2 className="text-3xl font-bold text-gray-900">Search Users</h2>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, username, or skills..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl pl-12 pr-4 py-4 text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((targetUser) => {
            const status = getUserStatus(targetUser)
            return (
              <div key={targetUser.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 ring-2 ring-purple-500">
                      <AvatarImage src={targetUser.profile?.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold text-lg">
                        {targetUser.profile?.name?.[0] || targetUser.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{targetUser.profile?.name || targetUser.username}</h3>
                      <p className="text-purple-600">@{targetUser.username}</p>
                      {targetUser.profile?.bio && (
                        <p className="text-gray-600 text-sm mt-1">{targetUser.profile.bio}</p>
                      )}
                      {targetUser.profile?.skills && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {targetUser.profile.skills.split(',').slice(0, 3).map((skill: string) => (
                            <span key={skill.trim()} className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    {isFollowing(targetUser) ? (
                      <Button 
                        onClick={() => toggleFollow(targetUser.id)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-xl"
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Following
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => toggleFollow(targetUser.id)}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Follow
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}