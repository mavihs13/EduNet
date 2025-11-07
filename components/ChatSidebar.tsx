'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { 
  MessageCircle, 
  Phone, 
  Video, 
  Monitor, 
  Mic, 
  MicOff, 
  Send, 
  Smile, 
  Paperclip, 
  MoreVertical,
  Heart,
  Trash2,
  Search,
  X,
  Play,
  Pause,
  Info,
  Edit3,
  Camera,
  Image as ImageIcon,
  Moon,
  Sun
} from 'lucide-react'

interface ChatSidebarProps {
  user: any
  isOpen: boolean
  onClose: () => void
  onWidthChange?: (width: number) => void
  onChatSelect?: (chat: any) => void
}

export default function ChatSidebar({ user, isOpen, onClose, onWidthChange, onChatSelect }: ChatSidebarProps) {
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [width, setWidth] = useState(320)
  const [isResizing, setIsResizing] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Mock chat data
  const chats = [
    {
      id: 1,
      user: { name: 'Sarah Code', username: 'sarah_code', avatar: null },
      lastMessage: '🎤 Voice message',
      timestamp: '2m ago',
      unread: 3,
      online: true
    },
    {
      id: 2,
      user: { name: 'Mike Tech', username: 'mike_tech', avatar: null },
      lastMessage: 'Thanks for the algorithm explanation! 💯',
      timestamp: '15m ago',
      unread: 0,
      online: true
    },
    {
      id: 3,
      user: { name: 'John Dev', username: 'john_dev', avatar: null },
      lastMessage: 'Can we do a video call? 📹',
      timestamp: '1h ago',
      unread: 1,
      online: false
    },
    {
      id: 4,
      user: { name: 'Alex Python', username: 'alex_python', avatar: null },
      lastMessage: 'Screen shared the debugging session 🖥️',
      timestamp: '2h ago',
      unread: 0,
      online: true
    },
    {
      id: 5,
      user: { name: 'Emma React', username: 'emma_react', avatar: null },
      lastMessage: 'Loved your latest post! ❤️',
      timestamp: '3h ago',
      unread: 2,
      online: false
    }
  ]

  // Mock messages for selected chat
  const mockMessages = [
    {
      id: 1,
      senderId: selectedChat?.user.username,
      content: 'Hey! How\'s the coding going? 💻',
      timestamp: new Date(Date.now() - 7200000),
      type: 'text',
      liked: false
    },
    {
      id: 2,
      senderId: user.username,
      content: 'Great! Just finished implementing that binary search algorithm 🚀',
      timestamp: new Date(Date.now() - 6600000),
      type: 'text',
      liked: true
    },
    {
      id: 3,
      senderId: selectedChat?.user.username,
      content: 'Voice message - 0:23',
      timestamp: new Date(Date.now() - 5400000),
      type: 'voice',
      liked: false
    },
    {
      id: 4,
      senderId: user.username,
      content: 'That\'s awesome! Can you show me the implementation?',
      timestamp: new Date(Date.now() - 4800000),
      type: 'text',
      liked: false
    },
    {
      id: 5,
      senderId: selectedChat?.user.username,
      content: 'Sure! Let me screen share 🖥️',
      timestamp: new Date(Date.now() - 4200000),
      type: 'text',
      liked: true
    },
    {
      id: 6,
      senderId: selectedChat?.user.username,
      content: 'Screen sharing session - 15:30',
      timestamp: new Date(Date.now() - 3600000),
      type: 'screen_share',
      liked: false
    },
    {
      id: 7,
      senderId: user.username,
      content: 'Thanks! That was really helpful 🙏',
      timestamp: new Date(Date.now() - 2400000),
      type: 'text',
      liked: true
    },
    {
      id: 8,
      senderId: selectedChat?.user.username,
      content: 'Voice message - 0:45',
      timestamp: new Date(Date.now() - 1800000),
      type: 'voice',
      liked: true
    },
    {
      id: 9,
      senderId: user.username,
      content: 'Want to hop on a video call to discuss the next project? 📹',
      timestamp: new Date(Date.now() - 900000),
      type: 'text',
      liked: false
    },
    {
      id: 10,
      senderId: selectedChat?.user.username,
      content: 'Video call - 25:15',
      timestamp: new Date(Date.now() - 300000),
      type: 'video_call',
      liked: false
    },
    {
      id: 11,
      senderId: selectedChat?.user.username,
      content: 'Perfect! Let\'s start working on it tomorrow 🔥',
      timestamp: new Date(Date.now() - 120000),
      type: 'text',
      liked: false
    }
  ]

  useEffect(() => {
    if (selectedChat) {
      setMessages(mockMessages)
    }
  }, [selectedChat])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      const newWidth = e.clientX
      if (newWidth >= 280 && newWidth <= 600) {
        setWidth(newWidth)
        onWidthChange?.(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing, onWidthChange])

  const sendMessage = () => {
    if (!message.trim() || !selectedChat) return

    const newMessage = {
      id: messages.length + 1,
      senderId: user.username,
      content: message,
      timestamp: new Date(),
      type: 'text',
      liked: false
    }

    setMessages([...messages, newMessage])
    setMessage('')
  }

  const toggleLike = (messageId: number) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, liked: !msg.liked } : msg
    ))
  }

  const deleteMessage = (messageId: number) => {
    setMessages(messages.filter(msg => msg.id !== messageId))
  }

  const startVoiceRecording = () => {
    setIsRecording(true)
    setTimeout(() => {
      setIsRecording(false)
      const voiceMessage = {
        id: messages.length + 1,
        senderId: user.username,
        content: 'Voice message - 0:05',
        timestamp: new Date(),
        type: 'voice',
        liked: false
      }
      setMessages([...messages, voiceMessage])
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div 
      ref={sidebarRef}
      className={`fixed left-0 z-40 flex select-none transition-all duration-300 ${
        isDarkMode 
          ? 'bg-gray-900' 
          : 'bg-white'
      }`}
      style={{ 
        width: selectedChat ? '100vw' : `${width}px`,
        top: '80px',
        height: 'calc(100vh - 80px)'
      }}
    >
      {/* Resize Handle - Only show when no chat is selected */}
      {!selectedChat && (
        <div 
          className="absolute right-0 top-0 w-1 h-full bg-gray-300 hover:bg-gray-400 cursor-col-resize transition-colors group"
          onMouseDown={() => setIsResizing(true)}
        >
          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-8 bg-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="w-0.5 h-4 bg-white rounded-full"></div>
          </div>
        </div>
      )}

      {/* Left Panel - Chat List */}
      <div className={`${selectedChat ? 'w-0 overflow-hidden' : 'w-full'} flex flex-col transition-all duration-300 ${
        isDarkMode ? 'border-r border-gray-700' : 'border-r border-gray-300'
      } max-w-sm`}>
        {/* Header */}
        <div className={`p-6 ${
          isDarkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <h1 className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{user.username}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-800' 
                    : 'text-gray-600 hover:bg-gray-100'
                } transition-colors`}
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" className={`${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}>
                <Edit3 className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`} />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 border-0 rounded-lg focus:ring-1 focus:ring-blue-500 ${
                isDarkMode 
                  ? 'bg-gray-800 text-white placeholder:text-gray-400 focus:bg-gray-700' 
                  : 'bg-gray-100 text-gray-900 placeholder:text-gray-500 focus:bg-white'
              }`}
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setSelectedChat(chat)
                onChatSelect?.(chat)
              }}
              className={`p-4 cursor-pointer transition-colors ${
                isDarkMode 
                  ? `hover:bg-gray-800 ${
                      selectedChat?.id === chat.id ? 'bg-gray-800 border-r-2 border-blue-500' : ''
                    }` 
                  : `hover:bg-gray-50 ${
                      selectedChat?.id === chat.id ? 'bg-gray-100 border-r-2 border-blue-500' : ''
                    }`
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={chat.user.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                      {chat.user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  {chat.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className={`font-semibold truncate ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{chat.user.name}</p>
                    <span className={`text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>{chat.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${
                      chat.unread > 0 
                        ? isDarkMode ? 'text-white font-medium' : 'text-gray-900 font-medium'
                        : isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>{chat.lastMessage}</p>
                    {chat.unread > 0 && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Chat View */}
      {selectedChat && (
        <div className={`flex-1 flex flex-col ${
          isDarkMode ? 'bg-gray-900' : 'bg-white'
        }`}>
          {/* Chat Header */}
          <div className={`p-4 ${
            isDarkMode 
              ? 'border-b border-gray-700 bg-gray-900' 
              : 'border-b border-gray-200 bg-white'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setSelectedChat(null)
                    onChatSelect?.(null)
                  }}
                  className={`rounded-full ${
                    isDarkMode 
                      ? 'text-gray-300 hover:bg-gray-800' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <X className="h-5 w-5" />
                </Button>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedChat.user.avatar} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                    {selectedChat.user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className={`font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{selectedChat.user.name}</p>
                  <p className="text-sm text-green-500">Active now</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon" className={`rounded-full ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-800' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}>
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className={`rounded-full ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-800' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}>
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className={`rounded-full ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-800' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}>
                  <Monitor className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className={`rounded-full ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-800' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}>
                  <Info className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-2 ${
            isDarkMode ? 'bg-gray-900' : 'bg-white'
          }`}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === user.username ? 'justify-end' : 'justify-start'} mb-1`}
              >
                <div className="group relative max-w-[70%]">
                  <div
                    className={`px-4 py-2 rounded-3xl ${
                      msg.senderId === user.username
                        ? 'bg-blue-500 text-white'
                        : isDarkMode 
                          ? 'bg-gray-800 text-white border border-gray-700'
                          : 'bg-gray-100 text-gray-900 border border-gray-200'
                    }`}
                  >
                    {msg.type === 'voice' ? (
                      <div className="flex items-center space-x-3 cursor-pointer p-1">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Play className="h-4 w-4 text-white ml-0.5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-0.5">
                              {[1,2,3,4,5,6,7,8].map(i => (
                                <div key={i} className={`w-0.5 bg-current rounded-full opacity-60`} style={{height: `${Math.random() * 16 + 8}px`}}></div>
                              ))}
                            </div>
                            <span className="text-xs opacity-70">{msg.content.split(' - ')[1]}</span>
                          </div>
                        </div>
                      </div>
                    ) : msg.type === 'video_call' ? (
                      <div className="flex items-center space-x-3 cursor-pointer p-1">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Video className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Video call</p>
                          <p className="text-xs opacity-70">{msg.content.split(' - ')[1]}</p>
                        </div>
                      </div>
                    ) : msg.type === 'screen_share' ? (
                      <div className="flex items-center space-x-3 cursor-pointer p-1">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <Monitor className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Screen share</p>
                          <p className="text-xs opacity-70">{msg.content.split(' - ')[1]}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                  </div>
                  
                  {/* Message Actions */}
                  <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleLike(msg.id)}
                        className={`h-6 w-6 ${msg.liked ? 'text-red-500' : isDarkMode ? 'text-gray-400' : 'text-gray-400'} ${
                          isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                        } rounded-full`}
                      >
                        <Heart className={`h-3 w-3 ${msg.liked ? 'fill-current' : ''}`} />
                      </Button>
                      {msg.senderId === user.username && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMessage(msg.id)}
                          className={`h-6 w-6 text-gray-400 hover:text-red-500 rounded-full ${
                            isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                          }`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className={`p-4 ${
            isDarkMode 
              ? 'border-t border-gray-700 bg-gray-900' 
              : 'border-t border-gray-200 bg-white'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className={`rounded-full ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-800' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}>
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className={`rounded-full ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-800' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}>
                  <Paperclip className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 relative">
                <Input
                  placeholder="Message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className={`rounded-full px-4 py-2 pr-16 focus:ring-0 ${
                    isDarkMode 
                      ? 'border border-gray-600 bg-gray-800 text-white placeholder:text-gray-400 focus:border-gray-500'
                      : 'border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-gray-400'
                  }`}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <Button variant="ghost" size="icon" className={`h-7 w-7 rounded-full ${
                    isDarkMode 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onMouseDown={startVoiceRecording}
                    className={`h-7 w-7 rounded-full ${
                      isRecording 
                        ? 'text-red-500' 
                        : isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              {message.trim() && (
                <Button
                  onClick={sendMessage}
                  variant="ghost"
                  className="text-blue-500 hover:text-blue-600 font-semibold"
                >
                  Send
                </Button>
              )}
            </div>
            {isRecording && (
              <div className="mt-3 flex items-center justify-center space-x-2 text-red-500">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Recording...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}