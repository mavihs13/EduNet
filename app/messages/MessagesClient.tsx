'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, Send, Search, MoreVertical, Check, CheckCheck, X, MessageCircle, Clock } from 'lucide-react'
import { formatTimeAgo } from '@/lib/utils'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

interface MessagesClientProps {
  user: any
  conversations: any[]
  messageRequests: any[]
}

export default function MessagesClient({ user, conversations: initialConversations, messageRequests: initialRequests }: MessagesClientProps) {
  const { theme } = useTheme()
  const [conversations, setConversations] = useState(initialConversations)
  const [messageRequests, setMessageRequests] = useState(initialRequests)
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showRequests, setShowRequests] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async (partnerId: string) => {
    try {
      const res = await fetch(`/api/messages?partnerId=${partnerId}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Failed to load messages:', error)
    }
  }

  const handleSelectChat = (conversation: any) => {
    setSelectedChat(conversation.user)
    setShowRequests(false)
    loadMessages(conversation.user.id)
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: selectedChat.id,
          content: newMessage
        })
      })

      if (res.ok) {
        const message = await res.json()
        setMessages([...messages, message])
        setNewMessage('')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleAcceptRequest = async (requestId: string, senderId: string) => {
    try {
      const res = await fetch('/api/messages/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action: 'accept' })
      })

      if (res.ok) {
        setMessageRequests(messageRequests.filter(r => r.id !== requestId))
        // Reload conversations
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to accept request:', error)
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      const res = await fetch('/api/messages/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action: 'reject' })
      })

      if (res.ok) {
        setMessageRequests(messageRequests.filter(r => r.id !== requestId))
      }
    } catch (error) {
      console.error('Failed to reject request:', error)
    }
  }

  const filteredConversations = conversations.filter(conv =>
    conv.user.profile?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto h-screen flex">
        {/* Sidebar */}
        <div className="w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-300">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Link href="/feed">
                  <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                    <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors duration-300"
              />
            </div>

            {/* Message Requests Badge */}
            {messageRequests.length > 0 && (
              <button
                onClick={() => setShowRequests(!showRequests)}
                className="w-full mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl flex items-center justify-between transition-all"
              >
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="font-semibold text-purple-900 dark:text-purple-300">Message Requests</span>
                </div>
                <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {messageRequests.length}
                </span>
              </button>
            )}
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {showRequests ? (
              <div className="p-2">
                <div className="flex items-center justify-between p-3">
                  <h3 className="font-bold text-gray-900 dark:text-white">Requests</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowRequests(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {messageRequests.map((request) => (
                  <div key={request.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all mb-2">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar className="h-12 w-12 ring-2 ring-purple-500">
                        <AvatarImage src={request.sender.profile?.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold">
                          {request.sender.profile?.name?.[0] || request.sender.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">{request.sender.profile?.name || request.sender.username}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">@{request.sender.username}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleAcceptRequest(request.id, request.sender.id)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectRequest(request.id)}
                        className="flex-1"
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => (
                    <button
                      key={conversation.user.id}
                      onClick={() => handleSelectChat(conversation)}
                      className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all ${
                        selectedChat?.id === conversation.user.id ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                      }`}
                    >
                      <div className="relative">
                        <Avatar className="h-14 w-14 ring-2 ring-purple-500">
                          <AvatarImage src={conversation.user.profile?.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold">
                            {conversation.user.profile?.name?.[0] || conversation.user.username[0]}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {conversation.user.profile?.name || conversation.user.username}
                          </p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTimeAgo(new Date(conversation.lastMessage.createdAt))}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {conversation.lastMessage.senderId === user.id && (
                            <span className="mr-1">
                              {conversation.lastMessage.read ? (
                                <CheckCheck className="h-3 w-3 inline text-blue-500" />
                              ) : (
                                <Check className="h-3 w-3 inline" />
                              )}
                            </span>
                          )}
                          {conversation.lastMessage.content}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <MessageCircle className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No conversations yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Start chatting with your connections</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 transition-colors duration-300">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-11 w-11 ring-2 ring-purple-500">
                    <AvatarImage src={selectedChat.profile?.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold">
                      {selectedChat.profile?.name?.[0] || selectedChat.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{selectedChat.profile?.name || selectedChat.username}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">@{selectedChat.username}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                  <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md px-4 py-2 rounded-2xl ${
                        message.senderId === user.id
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <p className="break-words">{message.content}</p>
                      <div className="flex items-center justify-end space-x-1 mt-1">
                        <span className={`text-xs ${message.senderId === user.id ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'}`}>
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {message.senderId === user.id && (
                          message.read ? (
                            <CheckCheck className="h-3 w-3 text-purple-100" />
                          ) : (
                            <Check className="h-3 w-3 text-purple-100" />
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors duration-300"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full h-12 w-12 p-0"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="h-12 w-12 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your Messages</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md">
                Select a conversation from the sidebar to start chatting with your connections
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
