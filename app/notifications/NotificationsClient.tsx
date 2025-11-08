'use client'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Home, Search, Bell, LogOut, UserCheck, X } from 'lucide-react'
import Link from 'next/link'

interface NotificationsClientProps {
  user: any
  friendRequests: any[]
}

export default function NotificationsClient({ user, friendRequests }: NotificationsClientProps) {
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

  const rejectFriendRequest = async (requestId: string) => {
    try {
      const res = await fetch('/api/friends/requests/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId })
      })
      if (res.ok) {
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to reject friend request:', error)
    }
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
            <Link href="/search">
              <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white">
                <Search className="h-6 w-6" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
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
        <h2 className="text-2xl font-bold text-white mb-6">Notifications</h2>
        
        {friendRequests.length === 0 ? (
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-8 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">No new notifications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {friendRequests.map((request) => (
              <div key={request.id} className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 ring-2 ring-purple-400/50">
                      <AvatarImage src={request.sender.profile?.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                        {request.sender.profile?.name?.[0] || request.sender.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white">
                        <span className="font-bold">{request.sender.profile?.name || request.sender.username}</span>
                        <span className="text-gray-300"> wants to follow you</span>
                      </p>
                      <p className="text-sm text-purple-300">@{request.sender.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => acceptFriendRequest(request.id)}
                      className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button 
                      onClick={() => rejectFriendRequest(request.id)}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-red-500/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}