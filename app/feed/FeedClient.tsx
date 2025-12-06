'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle, Share, Home, Search, Bell, Plus, Code, Menu, LogOut, Settings, X, Lock, Globe, User as UserIcon, MoreVertical, Edit, Trash2, Image as ImageIcon, Video, Smile, AtSign, Hash, MapPin, Moon, Sun, Send, Check, CheckCheck, Minimize2, Phone, VideoIcon, Mic, StopCircle, Play, PhoneOff, Reply, Paperclip } from 'lucide-react'
import { formatTimeAgo } from '@/lib/utils'
import CodeViewer from '@/components/CodeViewer'
import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'

interface FeedClientProps {
  user: any
  initialPosts: any[]
}

export default function FeedClient({ user, initialPosts }: FeedClientProps) {
  const { theme, toggleTheme } = useTheme()
  const [posts, setPosts] = useState(initialPosts)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [postContent, setPostContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isPrivate, setIsPrivate] = useState(user.profile?.isPrivate || false)
  const [showPostMenu, setShowPostMenu] = useState<string | null>(null)
  const [editingPost, setEditingPost] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [activeTab, setActiveTab] = useState<'text' | 'code'>('text')
  const [codeLanguage, setCodeLanguage] = useState('javascript')
  const [codeContent, setCodeContent] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [showCallModal, setShowCallModal] = useState(false)
  const [callType, setCallType] = useState<'voice' | 'video' | null>(null)
  const [showReactions, setShowReactions] = useState<string | null>(null)
  const [replyTo, setReplyTo] = useState<any>(null)
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [showComments, setShowComments] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')
  const [postComments, setPostComments] = useState<{[key: string]: any[]}>({}) 
  const [commentLoading, setCommentLoading] = useState(false) 
  const emojis = ['😊', '❤️', '🎉', '🚀', '💡', '🔥', '👍', '✨', '💻', '📚', '🎯', '⚡']
  const reactionEmojis = ['❤️', '😂', '😮', '😢', '😡', '👍', '👎']

  useEffect(() => {
    const openChatData = localStorage.getItem('openChat')
    if (openChatData) {
      try {
        const chatUser = JSON.parse(openChatData)
        const conversation = {
          id: chatUser.userId,
          user: {
            id: chatUser.userId,
            username: chatUser.username,
            profile: { name: chatUser.name, avatar: chatUser.avatar }
          },
          lastMessage: { content: '', createdAt: new Date(), read: true },
          unreadCount: 0,
          online: false
        }
        handleOpenChat(conversation)
        localStorage.removeItem('openChat')
      } catch (error) {
        console.error('Failed to open chat:', error)
      }
    }
  }, [])
  
  // Dummy conversations
  const dummyConversations = [
    {
      id: '1',
      user: { id: 'u1', username: 'sarah_dev', profile: { name: 'Sarah Johnson', avatar: null } },
      lastMessage: { content: 'Hey! Did you check out that React tutorial?', createdAt: new Date(Date.now() - 5 * 60000), read: true },
      unreadCount: 0,
      online: true
    },
    {
      id: '2',
      user: { id: 'u2', username: 'mike_codes', profile: { name: 'Mike Chen', avatar: null } },
      lastMessage: { content: 'Thanks for the help with the algorithm!', createdAt: new Date(Date.now() - 30 * 60000), read: false },
      unreadCount: 2,
      online: true
    },
    {
      id: '3',
      user: { id: 'u3', username: 'emma_tech', profile: { name: 'Emma Wilson', avatar: null } },
      lastMessage: { content: 'See you at the coding meetup! 🚀', createdAt: new Date(Date.now() - 2 * 60 * 60000), read: true },
      unreadCount: 0,
      online: false
    },
    {
      id: '4',
      user: { id: 'u4', username: 'alex_py', profile: { name: 'Alex Rodriguez', avatar: null } },
      lastMessage: { content: 'That Python script worked perfectly!', createdAt: new Date(Date.now() - 24 * 60 * 60000), read: true },
      unreadCount: 0,
      online: false
    }
  ]

  const handleLike = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' })
      if (res.ok) {
        setPosts(posts.map(post => {
          if (post.id === postId) {
            const isLiked = post.likes.some((like: any) => like.userId === user.id)
            return {
              ...post,
              likes: isLiked 
                ? post.likes.filter((like: any) => like.userId !== user.id)
                : [...post.likes, { userId: user.id }],
              _count: {
                ...post._count,
                likes: isLiked ? post._count.likes - 1 : post._count.likes + 1
              }
            }
          }
          return post
        }))
      }
    } catch (error) {
      console.error('Failed to like post:', error)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setSelectedFiles(prev => [...prev, ...files].slice(0, 4))
    
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setMediaPreviews(prev => [...prev, e.target?.result as string].slice(0, 4))
      }
      reader.readAsDataURL(file)
    })
  }

  const removeMedia = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setMediaPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleCreatePost = async () => {
    if (!postContent.trim() && selectedFiles.length === 0 && !codeContent.trim()) return
    setLoading(true)
    try {
      let mediaUrls: any[] = []
      
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const formData = new FormData()
          formData.append('avatar', file)
          const uploadRes = await fetch('/api/upload/avatar', {
            method: 'POST',
            body: formData
          })
          if (uploadRes.ok) {
            const data = await uploadRes.json()
            mediaUrls.push({
              url: data.avatarUrl,
              type: file.type.startsWith('video') ? 'video' : 'image'
            })
          }
        }
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: postContent,
          media: mediaUrls.length > 0 ? mediaUrls : null,
          code: codeContent.trim() || null,
          language: codeContent.trim() ? codeLanguage : null
        })
      })
      if (res.ok) {
        const newPost = await res.json()
        setPosts([newPost, ...posts])
        setPostContent('')
        setCodeContent('')
        setSelectedFiles([])
        setMediaPreviews([])
        setActiveTab('text')
        setShowCreateModal(false)
      }
    } catch (error) {
      console.error('Failed to create post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults([])
      return
    }
    setSearchLoading(true)
    try {
      const res = await fetch(`/api/search/users?q=${encodeURIComponent(query)}`)
      if (res.ok) {
        const users = await res.json()
        setSearchResults(users)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleFollow = async (userId: string) => {
    try {
      const res = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: userId })
      })
      if (res.ok) {
        const data = await res.json()
        setSearchResults(prev => prev.map(u => 
          u.id === userId ? { ...u, isFollowing: data.following } : u
        ))
      }
    } catch (error) {
      console.error('Follow failed:', error)
    }
  }

  const handlePrivacyToggle = async () => {
    try {
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPrivate: !isPrivate })
      })
      if (res.ok) {
        setIsPrivate(!isPrivate)
      }
    } catch (error) {
      console.error('Privacy update failed:', error)
    }
  }

  const canEditPost = (createdAt: Date) => {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000)
    return new Date(createdAt) > twoMinutesAgo
  }

  const handleEditPost = async (postId: string) => {
    if (!editContent.trim()) return
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent })
      })
      if (res.ok) {
        const updatedPost = await res.json()
        setPosts(posts.map(p => p.id === postId ? updatedPost : p))
        setEditingPost(null)
        setEditContent('')
      } else {
        const data = await res.json()
        alert(data.message || 'Failed to edit post')
      }
    } catch (error) {
      console.error('Failed to edit post:', error)
      alert('Failed to edit post')
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' })
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== postId))
      } else {
        alert('Failed to delete post')
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
      alert('Failed to delete post')
    }
  }

  const handleOpenChat = (conversation: any) => {
    setSelectedChat(conversation)
    // Load dummy messages
    const dummyMessages = [
      { id: '1', senderId: conversation.user.id, content: 'Hey! How are you?', createdAt: new Date(Date.now() - 60000), read: true },
      { id: '2', senderId: user.id, content: 'I\'m good! Working on a new project', createdAt: new Date(Date.now() - 50000), read: true },
      { id: '3', senderId: conversation.user.id, content: conversation.lastMessage.content, createdAt: conversation.lastMessage.createdAt, read: conversation.lastMessage.read }
    ]
    setChatMessages(dummyMessages)
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedMedia) return
    
    let mediaUrl = null
    let mediaType = null
    
    if (selectedMedia) {
      const formData = new FormData()
      formData.append('avatar', selectedMedia)
      const uploadRes = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData
      })
      if (uploadRes.ok) {
        const data = await uploadRes.json()
        mediaUrl = data.avatarUrl
        mediaType = selectedMedia.type.startsWith('video') ? 'video' : 'image'
      }
    }
    
    const message = {
      id: Date.now().toString(),
      senderId: user.id,
      content: newMessage,
      type: mediaUrl ? mediaType : 'text',
      mediaUrl,
      replyTo: replyTo,
      reactions: [],
      createdAt: new Date(),
      read: false
    }
    setChatMessages([...chatMessages, message])
    setNewMessage('')
    setReplyTo(null)
    setSelectedMedia(null)
    setMediaPreview(null)
  }

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedMedia(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setMediaPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAddReaction = (messageId: string, emoji: string) => {
    setChatMessages(chatMessages.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || []
        const existingReaction = reactions.find((r: any) => r.emoji === emoji)
        if (existingReaction) {
          return {
            ...msg,
            reactions: reactions.map((r: any) => 
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            )
          }
        }
        return {
          ...msg,
          reactions: [...reactions, { emoji, count: 1 }]
        }
      }
      return msg
    }))
    setShowReactions(null)
  }

  const handleStartRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    const interval = setInterval(() => {
      setRecordingTime(prev => prev + 1)
    }, 1000)
    // Store interval ID for cleanup
    ;(window as any).recordingInterval = interval
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    clearInterval((window as any).recordingInterval)
    const message = {
      id: Date.now().toString(),
      senderId: user.id,
      content: `Voice message (${recordingTime}s)`,
      type: 'voice',
      duration: recordingTime,
      createdAt: new Date(),
      read: false
    }
    setChatMessages([...chatMessages, message])
    setRecordingTime(0)
  }

  const handleStartCall = (type: 'voice' | 'video') => {
    setCallType(type)
    setShowCallModal(true)
  }

  const handleEndCall = () => {
    setShowCallModal(false)
    setCallType(null)
  }

  const handleShowComments = async (postId: string) => {
    setShowComments(postId)
    if (!postComments[postId]) {
      try {
        const res = await fetch(`/api/posts/${postId}/comments`)
        if (res.ok) {
          const comments = await res.json()
          setPostComments(prev => ({ ...prev, [postId]: comments }))
        }
      } catch (error) {
        console.error('Failed to load comments:', error)
      }
    }
  }

  const handlePostComment = async (postId: string) => {
    if (!commentText.trim() || commentLoading) return
    setCommentLoading(true)
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText })
      })
      if (res.ok) {
        const newComment = await res.json()
        setPostComments(prev => ({
          ...prev,
          [postId]: [newComment, ...(prev[postId] || [])]
        }))
        setPosts(posts.map(p => 
          p.id === postId ? { 
            ...p, 
            _count: { ...p._count, comments: p._count.comments + 1 },
            comments: [newComment, ...(p.comments || [])].slice(0, 2)
          } : p
        ))
        setCommentText('')
      }
    } catch (error) {
      console.error('Failed to post comment:', error)
    } finally {
      setCommentLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
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
              <Button variant="ghost" size="icon" className="hover:bg-purple-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl">
                <Home className="h-6 w-6" />
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowSearchModal(true)}
              className="hover:bg-purple-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl"
            >
              <Search className="h-6 w-6" />
            </Button>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create
            </Button>
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="hover:bg-purple-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl">
                <Bell className="h-6 w-6" />
              </Button>
            </Link>
            <Link href="/coding-profile">
              <Button variant="ghost" size="icon" className="hover:bg-purple-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl">
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
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowSettings(true)}
              className="hover:bg-purple-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex gap-6 py-8 px-4">
        {/* Messages Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg transition-colors duration-300">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                Messages
              </h2>
            </div>
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              {dummyConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleOpenChat(conv)}
                  className="w-full p-3 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12 ring-2 ring-purple-500">
                      <AvatarImage src={conv.user.profile?.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold text-sm">
                        {conv.user.profile?.name?.[0] || conv.user.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                    )}
                    {conv.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {conv.unreadCount}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {conv.user.profile?.name || conv.user.username}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {conv.lastMessage.content}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {formatTimeAgo(conv.lastMessage.createdAt)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="flex-1 max-w-2xl">
        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300">
              {/* Post Header */}
              <div className="flex items-center justify-between p-4">
                <Link href={`/profile/${post.user.username}`} className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer">
                  <Avatar className="h-11 w-11 ring-2 ring-purple-500">
                    <AvatarImage src={post.user.profile?.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold">
                      {post.user.profile?.name?.[0] || post.user.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{post.user.profile?.name || post.user.username}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">@{post.user.username} • {formatTimeAgo(new Date(post.createdAt))}</p>
                  </div>
                </Link>
                {post.user.id === user.id && (
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPostMenu(showPostMenu === post.id ? null : post.id)}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                    >
                      <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </Button>
                    {showPostMenu === post.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-2 z-10">
                        {canEditPost(post.createdAt) && (
                          <button
                            onClick={() => {
                              setEditingPost(post.id)
                              setEditContent(post.content || '')
                              setShowPostMenu(null)
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2 text-gray-700 dark:text-gray-200"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            handleDeletePost(post.id)
                            setShowPostMenu(null)
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center space-x-2 text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Post Content */}
              {post.content && (
                <div className="px-4 pb-3">
                  {editingPost === post.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white dark:bg-gray-700 transition-colors duration-300"
                        rows={3}
                      />
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleEditPost(post.id)}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingPost(null)
                            setEditContent('')
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-900 dark:text-white leading-relaxed">{post.content}</p>
                  )}
                </div>
              )}

              {/* Media */}
              {post.media && post.media.length > 0 && (
                <div className="px-4 pb-4">
                  <div className={`grid gap-2 rounded-xl overflow-hidden ${
                    post.media.length === 1 ? 'grid-cols-1' :
                    post.media.length === 2 ? 'grid-cols-2' :
                    post.media.length === 3 ? 'grid-cols-2' : 'grid-cols-2'
                  }`}>
                    {post.media.map((media: any, index: number) => (
                      <div key={media.id || index} className={`relative ${
                        post.media.length === 3 && index === 0 ? 'row-span-2' : ''
                      }`}>
                        {media.type === 'video' ? (
                          <video 
                            src={media.url} 
                            controls 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <img 
                            src={media.url} 
                            alt={`Media ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg hover:opacity-95 transition-opacity cursor-pointer"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Code Block */}
              {post.code && (
                <div className="mx-4 mb-4">
                  <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
                    <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                      <span className="text-gray-300 text-sm font-mono">{post.language || 'javascript'}</span>
                    </div>
                    <CodeViewer code={post.code} language={post.language || 'javascript'} />
                  </div>
                </div>
              )}

              {/* Recent Comments Preview */}
              {post.comments && post.comments.length > 0 && (
                <div className="px-4 pb-3 space-y-3">
                  {post.comments.slice(0, 2).map((comment: any) => (
                    <div key={comment.id} className="flex space-x-2">
                      <Link 
                        href={`/profile/${comment.user.username}`}
                        className="flex-shrink-0 hover:opacity-80 transition-opacity"
                      >
                        <Avatar className="h-7 w-7 ring-1 ring-gray-300 dark:ring-gray-600 cursor-pointer">
                          <AvatarImage src={comment.user.profile?.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold text-xs">
                            {comment.user.profile?.name?.[0] || comment.user.username[0]}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-xl px-3 py-2">
                        <p className="text-sm">
                          <Link 
                            href={`/profile/${comment.user.username}`}
                            className="font-semibold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 mr-2 transition-colors"
                          >
                            {comment.user.profile?.name || comment.user.username}
                          </Link>
                          <span className="text-gray-700 dark:text-gray-300">{comment.content}</span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatTimeAgo(new Date(comment.createdAt))}
                        </p>
                      </div>
                    </div>
                  ))}
                  {post.comments.length > 2 && (
                    <button
                      onClick={() => handleShowComments(post.id)}
                      className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-colors"
                    >
                      View all {post.comments.length} comments
                    </button>
                  )}
                </div>
              )}

              {/* Post Actions */}
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center space-x-6">
                {(!post.user.profile?.isPrivate || post.user.id === user.id) ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={`transition-all ${post.likes.some((like: any) => like.userId === user.id) ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}
                    >
                      <Heart className={`h-5 w-5 mr-2 ${post.likes.some((like: any) => like.userId === user.id) ? 'fill-current' : ''}`} />
                      <span className="font-semibold">{post._count.likes}</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleShowComments(post.id)}
                      className="text-gray-600 dark:text-gray-400 transition-all"
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      <span className="font-semibold">{post._count.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 transition-all">
                      <Share className="h-5 w-5 mr-2" />
                      Share
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm">Private Account</span>
                  </div>
                )}              </div>
            </div>
          ))}
        </div>
        </div>
      </div>

      {/* Create Post Modal - Modern UI */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col transition-colors duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 ring-2 ring-purple-500">
                  <AvatarImage src={user.profile?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold">
                    {user.profile?.name?.[0] || user.username[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{user.profile?.name || user.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  setShowCreateModal(false)
                  setPostContent('')
                  setCodeContent('')
                  setSelectedFiles([])
                  setMediaPreviews([])
                  setActiveTab('text')
                }}
                className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('text')}
                className={`flex-1 py-3 px-4 font-medium transition-all ${
                  activeTab === 'text'
                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <MessageCircle className="h-4 w-4 inline mr-2" />
                Text Post
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`flex-1 py-3 px-4 font-medium transition-all ${
                  activeTab === 'code'
                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Code className="h-4 w-4 inline mr-2" />
                Code Snippet
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {activeTab === 'text' ? (
                <>
                  <textarea
                    placeholder="What's on your mind? Share your thoughts, ideas, or questions..."
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="w-full h-40 p-4 border-0 resize-none focus:outline-none text-gray-900 dark:text-white dark:bg-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-lg transition-colors duration-300"
                    autoFocus
                  />
                  
                  {/* Media Previews */}
                  {mediaPreviews.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {mediaPreviews.map((preview, index) => (
                        <div key={index} className="relative group rounded-xl overflow-hidden">
                          <img 
                            src={preview} 
                            alt={`Preview ${index + 1}`}
                            className="w-full h-48 object-cover"
                          />
                          <button
                            onClick={() => removeMedia(index)}
                            className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
                    <select
                      value={codeLanguage}
                      onChange={(e) => setCodeLanguage(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white dark:bg-gray-700 transition-colors duration-300"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                      <option value="typescript">TypeScript</option>
                      <option value="html">HTML</option>
                      <option value="css">CSS</option>
                      <option value="sql">SQL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description (optional)</label>
                    <textarea
                      placeholder="Explain your code..."
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="w-full h-20 p-3 border border-gray-300 dark:border-gray-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white dark:bg-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Code</label>
                    <textarea
                      placeholder="Paste your code here..."
                      value={codeContent}
                      onChange={(e) => setCodeContent(e.target.value)}
                      className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white dark:bg-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 font-mono text-sm transition-colors duration-300"
                      spellCheck={false}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {activeTab === 'text' && (
                    <>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          disabled={mediaPreviews.length >= 4}
                        />
                        <Button 
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={mediaPreviews.length >= 4}
                          className="pointer-events-none hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                        >
                          <ImageIcon className="h-5 w-5" />
                        </Button>
                      </label>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 relative"
                      >
                        <Smile className="h-5 w-5" />
                      </Button>
                      {showEmojiPicker && (
                        <div className="absolute bottom-16 left-4 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 p-3 grid grid-cols-6 gap-2 z-10">
                          {emojis.map((emoji, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setPostContent(postContent + emoji)
                                setShowEmojiPicker(false)
                              }}
                              className="text-2xl hover:bg-gray-100 dark:hover:bg-gray-600 rounded p-1 transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    {activeTab === 'text' ? `${postContent.length}/500` : `${codeContent.length} chars`}
                  </span>
                </div>
                <button
                  onClick={handleCreatePost}
                  disabled={loading || (!postContent.trim() && selectedFiles.length === 0 && !codeContent.trim())}
                  className="relative px-8 py-3.5 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white font-bold rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  <div className="absolute inset-0 rounded-full bg-white/20 blur-xl group-hover:bg-white/30 transition-all duration-300"></div>
                  {loading ? (
                    <div className="flex items-center space-x-2 relative z-10">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="drop-shadow-lg">Posting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 relative z-10">
                      <span className="drop-shadow-lg">Post Now</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 group-hover:scale-110 transition-all drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl shadow-2xl max-h-[80vh] overflow-hidden transition-colors duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Search Users</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSearchModal(false)}
                className="hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 text-gray-700 dark:text-gray-300 rounded-xl transition-all"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="p-6">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by name or username..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white dark:bg-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors duration-300"
                />
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {searchLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((searchUser) => (
                    <div key={searchUser.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                          {searchUser.profile?.name?.[0] || searchUser.username[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{searchUser.profile?.name || searchUser.username}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">@{searchUser.username}</p>
                          {searchUser.profile?.isPrivate && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <Lock className="h-3 w-3" />
                              <span>Private</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {searchUser.id !== user.id && (
                        <Button
                          onClick={() => handleFollow(searchUser.id)}
                          className={searchUser.isFollowing ? 
                            "bg-gray-300 hover:bg-gray-400 text-gray-700" :
                            "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                          }
                        >
                          {searchUser.isFollowing ? 'Following' : 'Follow'}
                        </Button>
                      )}
                    </div>
                  ))
                ) : searchQuery ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No users found
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Search for users by name or username
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Sidebar */}
      {showSettings && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setShowSettings(false)}
          />
          <div className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto transition-colors duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSettings(false)}
                className="hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 text-gray-700 dark:text-gray-300 rounded-xl transition-all"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="p-6 space-y-6">
              {/* Theme Settings */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Appearance</h3>
                <div className="space-y-4">
                  <div 
                    onClick={toggleTheme}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      {theme === 'dark' ? <Moon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" /> : <Sun className="h-5 w-5 text-amber-600" />}
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Switch to {theme === 'dark' ? 'light' : 'dark'} theme</p>
                      </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-all ${theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-all ${theme === 'dark' ? 'ml-6' : 'ml-0.5'}`}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy Settings */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Privacy</h3>
                <div className="space-y-4">
                  <div 
                    onClick={handlePrivacyToggle}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      {isPrivate ? <Lock className="h-5 w-5 text-purple-600 dark:text-purple-400" /> : <Globe className="h-5 w-5 text-green-600 dark:text-green-400" />}
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{isPrivate ? 'Private Account' : 'Public Account'}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{isPrivate ? 'Only followers can interact' : 'Everyone can interact'}</p>
                      </div>
                    </div>
                    <div className={`w-12 h-6 rounded-full transition-all ${isPrivate ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-all ${isPrivate ? 'ml-6' : 'ml-0.5'}`}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Account</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <UserIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                      <p className="font-semibold text-gray-900 dark:text-white">@{user.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <UserIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{user.profile?.name || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logout */}
              <Button 
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Chat Popup Modal */}
      {selectedChat && (
        <div className="fixed bottom-0 right-8 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-t-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50 transition-colors duration-300">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10 ring-2 ring-white">
                  <AvatarImage src={selectedChat.user.profile?.avatar} />
                  <AvatarFallback className="bg-white text-purple-600 font-bold text-sm">
                    {selectedChat.user.profile?.name?.[0] || selectedChat.user.username[0]}
                  </AvatarFallback>
                </Avatar>
                {selectedChat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div>
                <p className="font-bold text-white text-sm">{selectedChat.user.profile?.name || selectedChat.user.username}</p>
                <p className="text-xs text-purple-100">{selectedChat.online ? 'Active now' : 'Offline'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleStartCall('voice')}
                className="hover:bg-white/20 text-white rounded-full h-8 w-8"
                title="Voice call"
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleStartCall('video')}
                className="hover:bg-white/20 text-white rounded-full h-8 w-8"
                title="Video call"
              >
                <VideoIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedChat(null)}
                className="hover:bg-white/20 text-white rounded-full h-8 w-8"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-end space-x-2 ${msg.senderId === user.id ? 'justify-end flex-row-reverse space-x-reverse' : 'justify-start'}`}
              >
                {/* Profile Avatar */}
                <Link
                  href={msg.senderId === user.id ? '/profile' : `/profile/${selectedChat.user.username}`}
                  className="flex-shrink-0 mb-1 hover:opacity-80 transition-opacity"
                  title={`View ${msg.senderId === user.id ? 'your' : selectedChat.user.profile?.name || selectedChat.user.username + "'s"} profile`}
                >
                  <Avatar className="h-6 w-6 ring-1 ring-gray-300 dark:ring-gray-600">
                    <AvatarImage src={msg.senderId === user.id ? user.profile?.avatar : selectedChat.user.profile?.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold text-xs">
                      {msg.senderId === user.id 
                        ? (user.profile?.name?.[0] || user.username[0])
                        : (selectedChat.user.profile?.name?.[0] || selectedChat.user.username[0])
                      }
                    </AvatarFallback>
                  </Avatar>
                </Link>

                <div className="relative group">
                  {/* Message Actions */}
                  <div className={`absolute -top-8 ${msg.senderId === user.id ? 'right-0' : 'left-0'} opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 bg-white dark:bg-gray-700 rounded-full px-2 py-1 shadow-lg`}>
                    <button
                      onClick={() => setShowReactions(showReactions === msg.id ? null : msg.id)}
                      className="hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full p-1 transition-colors"
                      title="React"
                    >
                      <Smile className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </button>
                    <button
                      onClick={() => setReplyTo(msg)}
                      className="hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full p-1 transition-colors"
                      title="Reply"
                    >
                      <Reply className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>

                  {/* Reaction Picker */}
                  {showReactions === msg.id && (
                    <div className={`absolute -top-14 ${msg.senderId === user.id ? 'right-0' : 'left-0'} bg-white dark:bg-gray-700 rounded-full px-3 py-2 shadow-xl border border-gray-200 dark:border-gray-600 flex space-x-1 z-10`}>
                      {reactionEmojis.map((emoji, i) => (
                        <button
                          key={i}
                          onClick={() => handleAddReaction(msg.id, emoji)}
                          className="text-xl hover:scale-125 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                      msg.senderId === user.id
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-sm'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-sm'
                    }`}
                  >
                    {/* Reply Preview */}
                    {msg.replyTo && (
                      <div className={`mb-2 pb-2 border-l-2 pl-2 text-xs opacity-75 ${
                        msg.senderId === user.id ? 'border-white/30' : 'border-purple-500'
                      }`}>
                        <p className="font-semibold">{msg.replyTo.senderId === user.id ? 'You' : selectedChat.user.profile?.name || selectedChat.user.username}</p>
                        <p className="truncate">{msg.replyTo.content}</p>
                      </div>
                    )}

                    {/* Media Content */}
                    {msg.type === 'image' && msg.mediaUrl && (
                      <img src={msg.mediaUrl} alt="Shared image" className="rounded-lg max-w-full mb-2" />
                    )}
                    {msg.type === 'video' && msg.mediaUrl && (
                      <video src={msg.mediaUrl} controls className="rounded-lg max-w-full mb-2" />
                    )}
                    {msg.type === 'voice' ? (
                    <div className="flex items-center space-x-3">
                      <Button
                        size="icon"
                        className={`h-8 w-8 rounded-full ${
                          msg.senderId === user.id
                            ? 'bg-white/20 hover:bg-white/30 text-white'
                            : 'bg-purple-100 hover:bg-purple-200 text-purple-600'
                        }`}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 h-1 bg-white/30 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div className="h-full w-0 bg-white dark:bg-purple-500 rounded-full"></div>
                          </div>
                        </div>
                        <p className="text-xs mt-1 opacity-75">{msg.duration}s</p>
                      </div>
                    </div>
                    ) : (
                      <p className="text-sm break-words">{msg.content}</p>
                    )}
                    <div className="flex items-center justify-end space-x-1 mt-1">
                      <span className={`text-xs ${
                        msg.senderId === user.id ? 'text-purple-100' : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.senderId === user.id && (
                        msg.read ? (
                          <CheckCheck className="h-3 w-3 text-purple-100" />
                        ) : (
                          <Check className="h-3 w-3 text-purple-100" />
                        )
                      )}
                    </div>
                  </div>

                  {/* Reactions Display */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className={`absolute -bottom-3 ${msg.senderId === user.id ? 'right-2' : 'left-2'} flex space-x-1`}>
                      {msg.reactions.map((reaction: any, i: number) => (
                        <div
                          key={i}
                          className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full px-2 py-0.5 text-xs flex items-center space-x-1 shadow-sm"
                        >
                          <span>{reaction.emoji}</span>
                          <span className="text-gray-600 dark:text-gray-300 font-semibold">{reaction.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            {/* Reply Preview */}
            {replyTo && (
              <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">Replying to {replyTo.senderId === user.id ? 'yourself' : selectedChat.user.profile?.name || selectedChat.user.username}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{replyTo.content}</p>
                </div>
                <button onClick={() => setReplyTo(null)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Media Preview */}
            {mediaPreview && (
              <div className="mb-2 relative inline-block">
                {selectedMedia?.type.startsWith('video') ? (
                  <video src={mediaPreview} className="h-20 rounded-lg" />
                ) : (
                  <img src={mediaPreview} alt="Preview" className="h-20 rounded-lg" />
                )}
                <button
                  onClick={() => {
                    setSelectedMedia(null)
                    setMediaPreview(null)
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            {isRecording ? (
              <div className="flex items-center space-x-3 bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-full">
                <div className="flex items-center space-x-2 flex-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    Recording... {recordingTime}s
                  </span>
                </div>
                <Button
                  onClick={handleStopRecording}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full h-9 w-9 p-0"
                >
                  <StopCircle className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaSelect}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="pointer-events-none hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full h-9 w-9 flex-shrink-0"
                    title="Attach media"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </label>
                <Button
                  onClick={handleStartRecording}
                  variant="ghost"
                  size="icon"
                  className="hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full h-9 w-9 flex-shrink-0"
                  title="Voice message"
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-colors duration-300"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() && !selectedMedia}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-full h-9 w-9 p-0 flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Comments Modal */}
      {showComments && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-3xl shadow-2xl max-h-[85vh] flex flex-col transition-colors duration-300 border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="relative p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Comments</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{postComments[showComments]?.length || 0} comments</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => {
                    setShowComments(null)
                    setCommentText('')
                  }}
                  className="hover:bg-white/50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300 rounded-full h-10 w-10 transition-all"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
              {postComments[showComments]?.length > 0 ? (
                postComments[showComments].map((comment: any, index: number) => (
                  <div 
                    key={comment.id} 
                    className="flex space-x-3 animate-in slide-in-from-bottom duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Link href={`/profile/${comment.user.username}`} className="flex-shrink-0">
                      <Avatar className="h-11 w-11 ring-2 ring-purple-500 hover:ring-purple-600 transition-all cursor-pointer">
                        <AvatarImage src={comment.user.profile?.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold">
                          {comment.user.profile?.name?.[0] || comment.user.username[0]}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link href={`/profile/${comment.user.username}`} className="font-bold text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                            {comment.user.profile?.name || comment.user.username}
                          </Link>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">@{comment.user.username}</p>
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                          {formatTimeAgo(new Date(comment.createdAt))}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                  </div>
                  <p className="text-gray-900 dark:text-white font-semibold text-lg mb-2">No comments yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Be the first to share your thoughts!</p>
                </div>
              )}
            </div>

            {/* Comment Input */}
            <div className="p-5 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b-3xl">
              <div className="flex items-start space-x-3">
                <Avatar className="h-11 w-11 ring-2 ring-purple-500 flex-shrink-0 mt-1">
                  <AvatarImage src={user.profile?.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold">
                    {user.profile?.name?.[0] || user.username[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-3">
                  <textarea
                    placeholder="Write a thoughtful comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handlePostComment(showComments)
                      }
                    }}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none transition-all"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">Tip:</span> Press Enter to post, Shift+Enter for new line
                    </p>
                    <Button
                      onClick={() => handlePostComment(showComments)}
                      disabled={!commentText.trim() || commentLoading}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl px-8 py-2.5 font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {commentLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Posting...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          <span>Post Comment</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call Modal */}
      {showCallModal && callType && (
        <div className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center">
          <div className="w-full max-w-2xl mx-4">
            {/* Call Interface */}
            <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-8 text-center shadow-2xl">
              {/* User Info */}
              <div className="mb-8">
                <Avatar className="h-32 w-32 mx-auto ring-4 ring-white/30 mb-4">
                  <AvatarImage src={selectedChat?.user.profile?.avatar} />
                  <AvatarFallback className="bg-white text-purple-600 font-bold text-4xl">
                    {selectedChat?.user.profile?.name?.[0] || selectedChat?.user.username[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {selectedChat?.user.profile?.name || selectedChat?.user.username}
                </h2>
                <p className="text-purple-200 text-lg">
                  {callType === 'video' ? 'Video calling...' : 'Voice calling...'}
                </p>
              </div>

              {/* Video Preview (only for video calls) */}
              {callType === 'video' && (
                <div className="mb-8 relative">
                  <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <VideoIcon className="h-24 w-24 text-gray-600" />
                    </div>
                    {/* Self video preview */}
                    <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-xl border-2 border-white/30 overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center">
                        <UserIcon className="h-12 w-12 text-gray-500" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Call Controls */}
              <div className="flex items-center justify-center space-x-6">
                {callType === 'video' && (
                  <>
                    <Button
                      size="lg"
                      className="h-14 w-14 rounded-full bg-white/20 hover:bg-white/30 text-white"
                      title="Toggle camera"
                    >
                      <VideoIcon className="h-6 w-6" />
                    </Button>
                    <Button
                      size="lg"
                      className="h-14 w-14 rounded-full bg-white/20 hover:bg-white/30 text-white"
                      title="Toggle microphone"
                    >
                      <Mic className="h-6 w-6" />
                    </Button>
                  </>
                )}
                {callType === 'voice' && (
                  <Button
                    size="lg"
                    className="h-14 w-14 rounded-full bg-white/20 hover:bg-white/30 text-white"
                    title="Toggle microphone"
                  >
                    <Mic className="h-6 w-6" />
                  </Button>
                )}
                <Button
                  size="lg"
                  onClick={handleEndCall}
                  className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg"
                  title="End call"
                >
                  <PhoneOff className="h-7 w-7" />
                </Button>
              </div>

              {/* Call Duration */}
              <div className="mt-6">
                <p className="text-white/60 text-sm">00:00</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
