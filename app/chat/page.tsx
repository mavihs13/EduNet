'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Circle } from 'lucide-react'
import { formatTimeAgo } from '@/lib/utils'
import { io, Socket } from 'socket.io-client'

export default function ChatPage() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [friends, setFriends] = useState([])
  const [selectedFriend, setSelectedFriend] = useState<any>(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [onlineUsers, setOnlineUsers] = useState(new Set())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const newSocket = io('http://localhost:3000')
    setSocket(newSocket)

    // Join with user ID (you'll need to get this from auth)
    newSocket.emit('join', 'current-user-id')

    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message])
    })

    newSocket.on('user_online', (userId) => {
      setOnlineUsers(prev => new Set([...prev, userId]))
    })

    newSocket.on('user_offline', (userId) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    })

    return () => newSocket.close()
  }, [])

  useEffect(() => {
    fetchFriends()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchFriends = async () => {
    try {
      const res = await fetch('/api/friends')
      if (res.ok) {
        const data = await res.json()
        setFriends(data)
      }
    } catch (error) {
      console.error('Failed to fetch friends:', error)
    }
  }

  const fetchMessages = async (friendId: string) => {
    try {
      const res = await fetch(`/api/messages?userId=${friendId}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedFriend || !socket) return

    socket.emit('send_message', {
      receiverId: selectedFriend.id,
      content: newMessage.trim()
    })

    setNewMessage('')
  }

  const selectFriend = (friend: any) => {
    setSelectedFriend(friend)
    fetchMessages(friend.id)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
          {/* Friends List */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {friends.map((friend: any) => (
                  <div
                    key={friend.id}
                    onClick={() => selectFriend(friend)}
                    className={`p-3 cursor-pointer hover:bg-gray-50 border-b ${
                      selectedFriend?.id === friend.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={friend.profile?.avatar} />
                          <AvatarFallback>
                            {friend.profile?.name?.[0] || friend.username[0]}
                          </AvatarFallback>
                        </Avatar>
                        {onlineUsers.has(friend.id) && (
                          <Circle className="absolute -bottom-1 -right-1 h-3 w-3 fill-green-500 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {friend.profile?.name || friend.username}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          @{friend.username}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="md:col-span-2">
            {selectedFriend ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={selectedFriend.profile?.avatar} />
                      <AvatarFallback>
                        {selectedFriend.profile?.name?.[0] || selectedFriend.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">
                        {selectedFriend.profile?.name || selectedFriend.username}
                      </p>
                      <p className="text-sm text-gray-500">
                        {onlineUsers.has(selectedFriend.id) ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col h-96">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message: any) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === 'current-user-id' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            message.senderId === 'current-user-id'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {formatTimeAgo(new Date(message.createdAt))}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="border-t p-4">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      />
                      <Button onClick={sendMessage}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <p className="text-gray-500">Select a friend to start chatting</p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}