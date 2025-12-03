'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, UserPlus, UserCheck, Clock, Home, Bell, Plus, LogOut } from 'lucide-react'
import Link from 'next/link'

interface SearchClientProps {
  user: any
  users: any[]
}

export default function SearchClient({ user, users }: SearchClientProps) {
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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">📚</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              EduNet
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/feed">
              <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white">
                <Home className="h-6 w-6" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
              <Search className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white">
              <Bell className="h-6 w-6" />
            </Button>
            <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-purple-400">
              <AvatarImage src={user.profile?.avatar} />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                {user.profile?.name?.[0] || user.username[0]}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-red-500/20 text-white">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto py-6 px-4">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, username, or skills..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-black/30 border border-purple-400/30 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((targetUser) => {
            const status = getUserStatus(targetUser)
            return (
              <div key={targetUser.id} className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-400/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 ring-2 ring-purple-400/50">
                      <AvatarImage src={targetUser.profile?.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg">
                        {targetUser.profile?.name?.[0] || targetUser.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-white text-lg">{targetUser.profile?.name || targetUser.username}</h3>
                      <p className="text-purple-300">@{targetUser.username}</p>
                      {targetUser.profile?.bio && (
                        <p className="text-gray-300 text-sm mt-1">{targetUser.profile.bio}</p>
                      )}
                      {targetUser.profile?.skills && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {targetUser.profile.skills.split(',').slice(0, 3).map((skill: string) => (
                            <span key={skill.trim()} className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 px-2 py-1 rounded-full text-xs">
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
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Following
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => toggleFollow(targetUser.id)}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
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