'use client'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Home, Search, Bell, Plus, Code, Menu, UserCheck, X, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface NotificationsClientProps {
  user: any
  friendRequests: any[]
  notifications: any[]
}

export default function NotificationsClient({ user, friendRequests, notifications: initialNotifications }: NotificationsClientProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState(initialNotifications)
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const newSocket = io('http://localhost:3000', {
      auth: { token: document.cookie.split('token=')[1]?.split(';')[0] }
    })
    
    newSocket.emit('join', user.id)
    
    newSocket.on('new_notification', (notification) => {
      setNotifications(prev => [notification, ...prev])
    })
    
    setSocket(newSocket)
    
    return () => {
      newSocket.disconnect()
    }
  }, [user.id])

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

  const handleNotificationAction = async (notificationId: string, action: 'accept' | 'reject') => {
    try {
      const res = await fetch(`/api/notifications/${notificationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
      }
    } catch (error) {
      console.error('Failed to process notification:', error)
    }
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
              <Button variant="ghost" size="icon" className="hover:bg-purple-50 text-gray-900 hover:text-purple-600 rounded-xl">
                <Search className="h-6 w-6" />
              </Button>
            </Link>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create
            </Button>
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="hover:bg-purple-50 text-gray-900 hover:text-purple-600 rounded-xl bg-purple-100">
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
          <h2 className="text-3xl font-bold text-gray-900">Notifications</h2>
        </div>
        
        {notifications.length === 0 && friendRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-lg">
            <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No new notifications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.filter(n => n.type === 'follow' && !n.read).map((notification) => {
              const metadata = JSON.parse(notification.metadata || '{}')
              return (
                <div key={notification.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 ring-2 ring-purple-500">
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold">
                          {metadata.followerUsername?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-gray-900">{notification.content}</p>
                        <p className="text-sm text-purple-600">@{metadata.followerUsername}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleNotificationAction(notification.id, 'accept')}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
                      >
                        <UserCheck className="h-4 w-4 mr-2" />
                        Accept
                      </Button>
                      <Button 
                        onClick={() => handleNotificationAction(notification.id, 'reject')}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-300 rounded-xl transition-all"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
            {friendRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 ring-2 ring-purple-500">
                      <AvatarImage src={request.sender.profile?.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold">
                        {request.sender.profile?.name?.[0] || request.sender.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-gray-900">
                        <span className="font-bold">{request.sender.profile?.name || request.sender.username}</span>
                        <span className="text-gray-600"> wants to follow you</span>
                      </p>
                      <p className="text-sm text-purple-600">@{request.sender.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => acceptFriendRequest(request.id)}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button 
                      onClick={() => rejectFriendRequest(request.id)}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-300 rounded-xl transition-all"
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