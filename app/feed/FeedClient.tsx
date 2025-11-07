'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle, Share, MoreHorizontal, Home, Search, Bell, User, LogOut, Plus, X, Code, Image, Smile, Hash, Upload, Trash2, BarChart3, MapPin, Send, Copy, Link2, MessageSquare, Bookmark, Flag, UserMinus, ExternalLink, Edit3, Star, Camera, Type, ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import { formatTimeAgo } from '@/lib/utils'
import CodeViewer from '@/components/CodeViewer'
import Link from 'next/link'

interface FeedClientProps {
  user: any
  initialPosts: any[]
}

export default function FeedClient({ user, initialPosts }: FeedClientProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [postContent, setPostContent] = useState('')
  const [postCode, setPostCode] = useState('')
  const [postLanguage, setPostLanguage] = useState('javascript')
  const [postTags, setPostTags] = useState('')
  const [selectedMedia, setSelectedMedia] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showPollCreator, setShowPollCreator] = useState(false)
  const [pollQuestion, setPollQuestion] = useState('')
  const [pollOptions, setPollOptions] = useState(['', ''])
  const [pollDuration, setPollDuration] = useState('24')
  const [isDragging, setIsDragging] = useState(false)
  const [showComments, setShowComments] = useState<{[key: string]: boolean}>({})
  const [commentText, setCommentText] = useState<{[key: string]: string}>({})
  const [showShareMenu, setShowShareMenu] = useState<{[key: string]: boolean}>({})
  const [showPostMenu, setShowPostMenu] = useState<{[key: string]: boolean}>({})
  const [editingPost, setEditingPost] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [storyGroups, setStoryGroups] = useState<any[]>([])
  const [showStoryViewer, setShowStoryViewer] = useState(false)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [currentUserIndex, setCurrentUserIndex] = useState(0)
  const [showCreateStory, setShowCreateStory] = useState(false)
  const [storyContent, setStoryContent] = useState('')
  const [storyMedia, setStoryMedia] = useState('')
  const [storyType, setStoryType] = useState<'text' | 'image'>('text')
  const [uploadingStory, setUploadingStory] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  useEffect(() => {
    // Fetch stories
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const res = await fetch('/api/stories')
      if (res.ok) {
        const data = await res.json()
        setStoryGroups(data)
      }
    } catch (error) {
      console.error('Failed to fetch stories:', error)
    }
  }

  const handleCreateStory = async () => {
    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: storyContent,
          mediaUrl: storyMedia,
          mediaType: storyType === 'image' ? 'image' : null
        })
      })

      if (res.ok) {
        setShowCreateStory(false)
        setStoryContent('')
        setStoryMedia('')
        setStoryType('text')
        fetchStories()
        showNotification('Story created! 📸', 'success')
      }
    } catch (error) {
      showNotification('Failed to create story', 'error')
    }
  }

  const handleStoryMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingStory(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const res = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        const data = await res.json()
        setStoryMedia(data.avatarUrl)
        setStoryType('image')
      }
    } catch (error) {
      showNotification('Failed to upload media', 'error')
    } finally {
      setUploadingStory(false)
    }
  }

  const openStoryViewer = (userIndex: number) => {
    setCurrentUserIndex(userIndex)
    setCurrentStoryIndex(0)
    setShowStoryViewer(true)
    markStoryAsViewed(storyGroups[userIndex].stories[0].id)
  }

  const markStoryAsViewed = async (storyId: string) => {
    try {
      await fetch('/api/stories/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId })
      })
    } catch (error) {
      console.error('Failed to mark story as viewed:', error)
    }
  }

  const nextStory = () => {
    const currentGroup = storyGroups[currentUserIndex]
    if (currentStoryIndex < currentGroup.stories.length - 1) {
      const newIndex = currentStoryIndex + 1
      setCurrentStoryIndex(newIndex)
      markStoryAsViewed(currentGroup.stories[newIndex].id)
    } else if (currentUserIndex < storyGroups.length - 1) {
      const newUserIndex = currentUserIndex + 1
      setCurrentUserIndex(newUserIndex)
      setCurrentStoryIndex(0)
      markStoryAsViewed(storyGroups[newUserIndex].stories[0].id)
    } else {
      setShowStoryViewer(false)
    }
  }

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1)
    } else if (currentUserIndex > 0) {
      const newUserIndex = currentUserIndex - 1
      setCurrentUserIndex(newUserIndex)
      setCurrentStoryIndex(storyGroups[newUserIndex].stories.length - 1)
    }
  }

  const handleLike = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      })
      
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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  const handleCreatePost = async () => {
    if (!postContent.trim() && !postCode.trim() && selectedMedia.length === 0 && (!showPollCreator || !pollQuestion.trim())) return

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: postContent || null,
          code: postCode || null,
          language: postCode ? postLanguage : null,
          tags: postTags || null,

        })
      })

      if (res.ok) {
        const newPost = await res.json()
        setPosts([newPost, ...posts])
        resetUploadModal()
      } else {
        console.error('Failed to create post:', await res.text())
      }
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }

  const resetUploadModal = () => {
    setShowUploadModal(false)
    setPostContent('')
    setPostCode('')
    setPostTags('')
    setSelectedMedia([])
    setMediaPreviews([])
    setShowEmojiPicker(false)
    setShowPollCreator(false)
    setPollQuestion('')
    setPollOptions(['', ''])
    setPollDuration('24')
    setShowComments({})
    setCommentText({})
    setShowShareMenu({})
    setShowPostMenu({})
    setEditingPost(null)
    setEditContent('')
  }

  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    const newFiles = [...selectedMedia, ...files].slice(0, 4) // Max 4 files
    setSelectedMedia(newFiles)

    // Create previews
    const newPreviews = [...mediaPreviews]
    files.forEach((file, index) => {
      if (mediaPreviews.length + index < 4) {
        const reader = new FileReader()
        reader.onload = (e) => {
          newPreviews.push(e.target?.result as string)
          setMediaPreviews([...newPreviews])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeMedia = (index: number) => {
    const newMedia = selectedMedia.filter((_, i) => i !== index)
    const newPreviews = mediaPreviews.filter((_, i) => i !== index)
    setSelectedMedia(newMedia)
    setMediaPreviews(newPreviews)
  }

  const insertEmoji = (emoji: string) => {
    setPostContent(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, ''])
    }
  }

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index))
    }
  }

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions]
    newOptions[index] = value
    setPollOptions(newOptions)
  }

  const emojis = ['😀', '😂', '🥰', '😎', '🤔', '👍', '❤️', '🔥', '💯', '🚀', '💻', '📚', '🎯', '✨', '🌟', '💡', '🎉', '👏', '🙌', '💪']

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/') || file.type.startsWith('video/'))
    
    if (imageFiles.length > 0) {
      const newFiles = [...selectedMedia, ...imageFiles].slice(0, 4)
      setSelectedMedia(newFiles)
      
      imageFiles.forEach((file, index) => {
        if (mediaPreviews.length + index < 4) {
          const reader = new FileReader()
          reader.onload = (e) => {
            setMediaPreviews(prev => [...prev, e.target?.result as string])
          }
          reader.readAsDataURL(file)
        }
      })
    }
  }

  const toggleComments = (postId: string) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }))
  }

  const handleComment = async (postId: string) => {
    const content = commentText[postId]?.trim()
    if (!content) return

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content })
      })
      
      if (res.ok) {
        const newComment = await res.json()
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [newComment, ...post.comments],
              _count: { ...post._count, comments: post._count.comments + 1 }
            }
          }
          return post
        }))
        setCommentText(prev => ({ ...prev, [postId]: '' }))
      }
    } catch (error) {
      console.error('Failed to add comment:', error)
    }
  }

  const handleShare = async (postId: string, type: string) => {
    const url = `${window.location.origin}/post/${postId}`
    const text = 'Check out this amazing post on EduNet! 🚀'
    
    try {
      switch(type) {
        case 'copy':
          await navigator.clipboard.writeText(url)
          showNotification('Link copied to clipboard! 📋', 'success')
          break
        case 'message':
          showNotification('Direct message feature coming soon! 💬', 'info')
          break
        case 'story':
          showNotification('Add to story feature coming soon! 📸', 'info')
          break
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400')
          break
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}&hashtags=EduNet,Coding,Learning`, '_blank', 'width=600,height=400')
          break
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`, '_blank')
          break
        case 'telegram':
          window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
          break
        case 'email':
          window.open(`mailto:?subject=${encodeURIComponent('Amazing Post from EduNet')}&body=${encodeURIComponent(text + '\n\n' + url + '\n\nShared via EduNet - The Educational Social Platform')}`, '_blank')
          break
      }
    } catch (error) {
      showNotification('Sharing failed. Please try again.', 'error')
    }
    
    setShowShareMenu(prev => ({ ...prev, [postId]: false }))
  }

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const notification = document.createElement('div')
    notification.className = `fixed top-20 right-4 z-50 px-6 py-3 rounded-2xl text-white font-medium shadow-2xl transform transition-all duration-300 ${
      type === 'success' ? 'bg-green-500' :
      type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`
    notification.textContent = message
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)'
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }

  const handleSavePost = async (postId: string) => {
    try {
      const res = await fetch('/api/posts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId })
      })
      
      if (res.ok) {
        const data = await res.json()
        setPosts(posts.map(post => {
          if (post.id === postId) {
            const isSaved = post.saves?.some((save: any) => save.userId === user.id)
            const isOwnPost = post.user.id === user.id
            return {
              ...post,
              saves: isSaved 
                ? post.saves.filter((save: any) => save.userId !== user.id)
                : [...(post.saves || []), { userId: user.id }],
              _count: {
                ...post._count,
                saves: isOwnPost ? (post._count.saves || 0) : 
                       isSaved ? (post._count.saves || 1) - 1 : (post._count.saves || 0) + 1
              }
            }
          }
          return post
        }))
        showNotification(data.saved ? 'Post saved! ⭐' : 'Post unsaved', 'success')
      }
    } catch (error) {
      showNotification('Failed to save post', 'error')
    }
  }

  const canEditPost = (createdAt: string) => {
    const postTime = new Date(createdAt).getTime()
    const now = new Date().getTime()
    const thirtyMinutes = 30 * 60 * 1000
    return (now - postTime) < thirtyMinutes
  }

  const handleEditPost = (post: any) => {
    setEditingPost(post.id)
    setEditContent(post.content || '')
    setShowPostMenu(prev => ({ ...prev, [post.id]: false }))
  }

  const saveEditPost = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent })
      })
      
      if (res.ok) {
        setPosts(posts.map(post => 
          post.id === postId ? { ...post, content: editContent } : post
        ))
        setEditingPost(null)
        setEditContent('')
        showNotification('Post updated successfully! ✏️', 'success')
      }
    } catch (error) {
      showNotification('Failed to update post', 'error')
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return
    
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE'
      })
      
      if (res.ok) {
        setPosts(posts.filter(post => post.id !== postId))
        showNotification('Post deleted successfully! 🗑️', 'success')
      }
    } catch (error) {
      showNotification('Failed to delete post', 'error')
    }
    
    setShowPostMenu(prev => ({ ...prev, [postId]: false }))
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
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full font-semibold">Gen-Z</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white">
              <Home className="h-6 w-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowSearchModal(true)}
              className="hover:bg-white/10 text-white relative"
            >
              <Search className="h-6 w-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowUploadModal(true)}
              className="hover:bg-white/10 text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg hover:scale-110 transition-all duration-300 shadow-lg shadow-pink-500/25"
            >
              <Plus className="h-6 w-6" />
            </Button>
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white relative">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-pulse"></span>
              </Button>
            </Link>
            <Link href="/profile">
              <Avatar className="h-9 w-9 cursor-pointer ring-2 ring-purple-400 ring-offset-2 ring-offset-transparent hover:ring-pink-400 transition-all">
                <AvatarImage src={user.profile?.avatar} />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                  {user.profile?.name?.[0] || user.username[0]}
                </AvatarFallback>
              </Avatar>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-red-500/20 text-white">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto py-6 px-4">
        {/* Stories Section */}
        <div className="mb-8">
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {/* Your Story */}
            <div className="flex-shrink-0 text-center">
              {storyGroups.find(g => g.user.id === user.id) ? (
                <button
                  onClick={() => openStoryViewer(storyGroups.findIndex(g => g.user.id === user.id))}
                  className="relative w-16 h-16 rounded-full p-0.5 cursor-pointer hover:scale-110 transition-transform bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"
                >
                  <Avatar className="w-full h-full border-2 border-black">
                    <AvatarImage src={user.profile?.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">
                      {user.profile?.name?.[0] || user.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-black flex items-center justify-center">
                    <Plus className="h-3 w-3 text-white" />
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => setShowCreateStory(true)}
                  className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-2 cursor-pointer hover:scale-110 transition-transform"
                >
                  <Plus className="h-8 w-8 text-white" />
                </button>
              )}
              <p className="text-xs text-white/80 mt-1">Your Story</p>
            </div>
            
            {/* Friends Stories */}
            {storyGroups.filter(g => g.user.id !== user.id).map((group, index) => (
              <div key={group.user.id} className="flex-shrink-0 text-center">
                <button
                  onClick={() => openStoryViewer(storyGroups.findIndex(g => g.user.id === group.user.id))}
                  className={`w-16 h-16 rounded-full p-0.5 cursor-pointer hover:scale-110 transition-transform ${
                    group.hasUnviewed 
                      ? 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500' 
                      : 'bg-gray-600'
                  }`}
                >
                  <Avatar className="w-full h-full border-2 border-black">
                    <AvatarImage src={group.user.profile?.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">
                      {group.user.profile?.name?.[0] || group.user.username[0]}
                    </AvatarFallback>
                  </Avatar>
                </button>
                <p className="text-xs text-white/80 mt-1 truncate w-16">{group.user.profile?.name || group.user.username}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Posts Feed */}
        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden hover:border-purple-400/30 transition-all duration-300">
              {/* Post Header */}
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 ring-2 ring-purple-400/50">
                    <AvatarImage src={post.user.profile?.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                      {post.user.profile?.name?.[0] || post.user.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-white">{post.user.profile?.name || post.user.username}</p>
                    <p className="text-sm text-purple-300">@{post.user.username} • {formatTimeAgo(new Date(post.createdAt))}</p>
                  </div>
                </div>
                {post.user.id === user.id && (
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setShowPostMenu(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                      className="hover:bg-white/10 text-white"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                    {showPostMenu[post.id] && (
                      <div className="absolute top-10 right-0 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-2 z-10 min-w-[160px] shadow-2xl">
                        {canEditPost(post.createdAt) && (
                          <button
                            onClick={() => handleEditPost(post)}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-blue-50 rounded-xl transition-colors"
                          >
                            <Edit3 className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium">Edit Post</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium">Delete Post</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Post Content */}
              <div className="px-6 pb-4">
                {editingPost === post.id ? (
                  <div className="mb-4">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-black/30 border border-purple-400/30 rounded-2xl p-4 text-white placeholder:text-gray-400 resize-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                      rows={3}
                    />
                    <div className="flex space-x-2 mt-3">
                      <Button 
                        onClick={() => saveEditPost(post.id)}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-4 py-2 rounded-xl"
                      >
                        Save
                      </Button>
                      <Button 
                        onClick={() => setEditingPost(null)}
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700/50 px-4 py-2 rounded-xl"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  post.content && (
                    <p className="text-white mb-4 leading-relaxed text-lg">{post.content}</p>
                  )
                )}
                
                {post.tags && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.split(',').map((tag: string) => (
                      <span key={tag.trim()} className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 px-3 py-1 rounded-full text-sm font-semibold border border-pink-400/30 hover:bg-pink-500/30 transition-colors cursor-pointer">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Media */}
              {post.media && post.media.length > 0 && (
                <div className="mx-6 mb-6">
                  <div className={`grid gap-2 rounded-2xl overflow-hidden ${
                    post.media.length === 1 ? 'grid-cols-1' :
                    post.media.length === 2 ? 'grid-cols-2' :
                    post.media.length === 3 ? 'grid-cols-2' : 'grid-cols-2'
                  }`}>
                    {post.media.map((media: any, index: number) => (
                      <div key={media.id} className={`relative ${
                        post.media.length === 3 && index === 0 ? 'row-span-2' : ''
                      }`}>
                        {media.type === 'video' ? (
                          <video 
                            src={media.url} 
                            controls 
                            className="w-full h-full object-cover rounded-xl border border-purple-400/20"
                          />
                        ) : (
                          <img 
                            src={media.url} 
                            alt={`Media ${index + 1}`}
                            className="w-full h-full object-cover rounded-xl border border-purple-400/20 hover:scale-105 transition-transform cursor-pointer"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Poll */}
              {post.pollQuestion && (
                <div className="mx-6 mb-6">
                  <div className="bg-black/40 rounded-2xl border border-cyan-400/30 p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <BarChart3 className="h-5 w-5 text-cyan-400" />
                      <span className="text-white font-semibold">{post.pollQuestion}</span>
                    </div>
                    <div className="space-y-2">
                      {JSON.parse(post.pollOptions || '[]').map((option: string, index: number) => (
                        <button
                          key={index}
                          className="w-full text-left bg-black/30 hover:bg-purple-500/20 border border-gray-600 hover:border-purple-400 rounded-xl px-4 py-3 text-white transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            <span className="text-sm text-gray-400">{Math.floor(Math.random() * 30 + 10)}%</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-gray-400 flex items-center justify-between">
                      <span>🗳️ {Math.floor(Math.random() * 500 + 100)} votes</span>
                      <span>⏰ {post.pollDuration}h left</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Code Block */}
              {post.code && (
                <div className="mx-6 mb-6">
                  <div className="bg-black/40 rounded-2xl border border-cyan-400/30 overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 px-4 py-2 border-b border-cyan-400/30">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>
                        <span className="text-cyan-300 text-sm font-mono">{post.language || 'javascript'}</span>
                        <span className="text-purple-300 text-xs">🔥 Hot Code</span>
                      </div>
                    </div>
                    <CodeViewer code={post.code} language={post.language || 'javascript'} />
                  </div>
                </div>
              )}

              {/* Post Actions */}
              <div className="border-t border-white/10 bg-black/20">
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center space-x-8">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={`hover:bg-pink-500/20 transition-all duration-300 ${post.likes.some((like: any) => like.userId === user.id) ? 'text-pink-400' : 'text-white'}`}
                    >
                      <Heart className={`h-6 w-6 mr-2 ${post.likes.some((like: any) => like.userId === user.id) ? 'fill-current animate-pulse' : ''}`} />
                      <span className="font-bold">{post._count.likes}</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleComments(post.id)}
                      className="text-white hover:bg-purple-500/20 transition-all duration-300"
                    >
                      <MessageCircle className="h-6 w-6 mr-2" />
                      <span className="font-bold">{post._count.comments}</span>
                    </Button>
                    <div className="relative">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowShareMenu(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                        className="text-white hover:bg-cyan-500/20 transition-all duration-300"
                      >
                        <Share className="h-6 w-6 mr-2" />
                        <span className="font-bold">Share</span>
                      </Button>
                      {showShareMenu[post.id] && (
                        <div className="absolute bottom-12 left-0 bg-white/95 backdrop-blur-2xl border border-gray-200/50 rounded-3xl p-4 z-10 min-w-[280px] shadow-2xl shadow-black/20">
                          {/* Header */}
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-800 font-semibold text-lg">Share Post</h3>
                            <button
                              onClick={() => setShowShareMenu(prev => ({ ...prev, [post.id]: false }))}
                              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <X className="h-4 w-4 text-gray-500" />
                            </button>
                          </div>
                          
                          {/* Quick Actions */}
                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <button
                              onClick={() => handleShare(post.id, 'message')}
                              className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-2xl transition-all duration-300 transform hover:scale-105"
                            >
                              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                <MessageSquare className="h-6 w-6 text-white" />
                              </div>
                              <span className="text-xs font-medium text-gray-700">Message</span>
                            </button>
                            
                            <button
                              onClick={() => handleShare(post.id, 'story')}
                              className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-2xl transition-all duration-300 transform hover:scale-105"
                            >
                              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <Plus className="h-6 w-6 text-white" />
                              </div>
                              <span className="text-xs font-medium text-gray-700">Story</span>
                            </button>
                            
                            <button
                              onClick={() => handleShare(post.id, 'copy')}
                              className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-2xl transition-all duration-300 transform hover:scale-105"
                            >
                              <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                                <Copy className="h-6 w-6 text-white" />
                              </div>
                              <span className="text-xs font-medium text-gray-700">Copy</span>
                            </button>
                          </div>
                          
                          {/* Social Platforms */}
                          <div className="border-t border-gray-200 pt-4">
                            <p className="text-sm font-medium text-gray-600 mb-3">Share to social media</p>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => handleShare(post.id, 'whatsapp')}
                                className="flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-200 group"
                              >
                                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <MessageCircle className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                              </button>
                              
                              <button
                                onClick={() => handleShare(post.id, 'facebook')}
                                className="flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 group"
                              >
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <ExternalLink className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Facebook</span>
                              </button>
                              
                              <button
                                onClick={() => handleShare(post.id, 'twitter')}
                                className="flex items-center space-x-3 p-3 bg-sky-50 hover:bg-sky-100 rounded-xl transition-all duration-200 group"
                              >
                                <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <Link2 className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Twitter</span>
                              </button>
                              
                              <button
                                onClick={() => handleShare(post.id, 'telegram')}
                                className="flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 group"
                              >
                                <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <Send className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Telegram</span>
                              </button>
                            </div>
                            
                            <button
                              onClick={() => handleShare(post.id, 'email')}
                              className="w-full flex items-center justify-center space-x-3 p-3 mt-2 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 group"
                            >
                              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Hash className="h-4 w-4 text-white" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">Send via Email</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleSavePost(post.id)}
                      className="flex items-center space-x-1 hover:scale-110 transition-transform"
                    >
                      <Star className="h-5 w-5 text-gray-400 hover:text-yellow-400" />
                      <span className="text-xs text-gray-400">0</span>
                    </button>
                    <span className="text-xs text-purple-300">🔥 {post._count.likes * 3 + 15}K views</span>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              {showComments[post.id] && (
                <div className="border-t border-white/10 bg-black/10">
                  {/* Add Comment */}
                  <div className="p-4 border-b border-white/10">
                    <div className="flex space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profile?.avatar} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">
                          {user.profile?.name?.[0] || user.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex space-x-2">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={commentText[post.id] || ''}
                          onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleComment(post.id)
                            }
                          }}
                          className="flex-1 bg-black/30 border border-gray-600 rounded-full px-4 py-2 text-white placeholder:text-gray-400 focus:border-purple-400 text-sm"
                        />
                        <Button 
                          onClick={() => handleComment(post.id)}
                          disabled={!commentText[post.id]?.trim()}
                          size="sm"
                          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full px-4 disabled:opacity-50"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Comments List */}
                  <div className="max-h-60 overflow-y-auto">
                    {post.comments.map((comment: any) => (
                      <div key={comment.id} className="p-4 hover:bg-black/10 transition-colors">
                        <div className="flex space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.user.profile?.avatar} />
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">
                              {comment.user.profile?.name?.[0] || comment.user.username[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-white text-sm">
                                {comment.user.profile?.name || comment.user.username}
                              </span>
                              <span className="text-gray-400 text-xs">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-200 text-sm mt-1">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-3xl border border-purple-400/30 w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl shadow-purple-500/25">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-400/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">✨</span>
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Create Epic Post
                </h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              {/* User Info */}
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12 ring-2 ring-purple-400">
                  <AvatarImage src={user.profile?.avatar} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                    {user.profile?.name?.[0] || user.username[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold text-white">{user.profile?.name || user.username}</p>
                  <p className="text-sm text-purple-300">@{user.username}</p>
                </div>
              </div>

              {/* Content Input */}
              <div className="space-y-4">
                <div 
                  className={`relative ${
                    isDragging ? 'ring-2 ring-purple-400 ring-opacity-50' : ''
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <textarea
                    placeholder="What's on your mind? Share your coding journey! 🚀"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    maxLength={500}
                    className="w-full h-32 bg-black/30 border border-purple-400/30 rounded-2xl p-4 text-white placeholder:text-gray-400 resize-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                  />
                  {isDragging && (
                    <div className="absolute inset-0 bg-purple-500/20 border-2 border-dashed border-purple-400 rounded-2xl flex items-center justify-center">
                      <div className="text-center text-white">
                        <Upload className="h-8 w-8 mx-auto mb-2" />
                        <p className="font-semibold">Drop your media here!</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                    <div className="relative">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="h-8 w-8 text-gray-400 hover:text-purple-400"
                      >
                        <Smile className="h-4 w-4" />
                      </Button>
                      {showEmojiPicker && (
                        <div className="absolute bottom-10 right-0 bg-black/90 backdrop-blur-xl border border-purple-400/30 rounded-2xl p-3 grid grid-cols-5 gap-2 z-10">
                          {emojis.map((emoji, index) => (
                            <button
                              key={index}
                              onClick={() => insertEmoji(emoji)}
                              className="text-xl hover:bg-purple-500/20 rounded-lg p-1 transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className={`text-xs ${
                      postContent.length > 450 ? 'text-red-400' : 
                      postContent.length > 400 ? 'text-yellow-400' : 'text-gray-500'
                    }`}>
                      {postContent.length}/500
                    </span>
                  </div>
                </div>

                {/* Code Section */}
                <div className="bg-black/40 rounded-2xl border border-cyan-400/30 overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 px-4 py-3 border-b border-cyan-400/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Code className="h-5 w-5 text-cyan-400" />
                        <span className="text-white font-semibold">Code Snippet</span>
                      </div>
                      <select
                        value={postLanguage}
                        onChange={(e) => setPostLanguage(e.target.value)}
                        className="bg-black/50 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm focus:border-cyan-400"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="css">CSS</option>
                        <option value="html">HTML</option>
                      </select>
                    </div>
                  </div>
                  <textarea
                    placeholder="// Share your amazing code here! \nconsole.log('Hello, EduNet! 🔥');"
                    value={postCode}
                    onChange={(e) => setPostCode(e.target.value)}
                    className="w-full h-40 bg-transparent border-0 p-4 text-green-400 font-mono text-sm placeholder:text-gray-500 resize-none focus:outline-none"
                  />
                </div>

                {/* Media Upload Section */}
                {mediaPreviews.length > 0 && (
                  <div className="bg-black/30 rounded-2xl border border-purple-400/30 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-semibold flex items-center">
                        <Image className="h-5 w-5 mr-2 text-purple-400" />
                        Media ({mediaPreviews.length}/4)
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {mediaPreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={preview} 
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-xl border border-purple-400/20"
                          />
                          <button
                            onClick={() => removeMedia(index)}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Poll Creator */}
                {showPollCreator && (
                  <div className="bg-black/40 rounded-2xl border border-cyan-400/30 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5 text-cyan-400" />
                        <span className="text-white font-semibold">Create Poll</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setShowPollCreator(false)}
                        className="h-8 w-8 text-gray-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <input
                      type="text"
                      placeholder="Ask a question..."
                      value={pollQuestion}
                      onChange={(e) => setPollQuestion(e.target.value)}
                      className="w-full bg-black/30 border border-cyan-400/30 rounded-xl px-4 py-3 text-white placeholder:text-gray-400 focus:border-cyan-400"
                    />
                    
                    <div className="space-y-2">
                      {pollOptions.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => updatePollOption(index, e.target.value)}
                            className="flex-1 bg-black/30 border border-gray-600 rounded-xl px-4 py-2 text-white placeholder:text-gray-400 focus:border-cyan-400"
                          />
                          {pollOptions.length > 2 && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removePollOption(index)}
                              className="h-8 w-8 text-red-400 hover:text-red-300"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Button 
                        variant="ghost" 
                        onClick={addPollOption}
                        disabled={pollOptions.length >= 4}
                        className="text-cyan-400 hover:text-cyan-300 text-sm"
                      >
                        + Add Option
                      </Button>
                      <select
                        value={pollDuration}
                        onChange={(e) => setPollDuration(e.target.value)}
                        className="bg-black/50 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm"
                      >
                        <option value="1">1 hour</option>
                        <option value="6">6 hours</option>
                        <option value="24">1 day</option>
                        <option value="168">1 week</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Tags Input */}
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-pink-400" />
                  <input
                    type="text"
                    placeholder="Add tags (javascript, react, coding, etc.)"
                    value={postTags}
                    onChange={(e) => setPostTags(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const tag = e.currentTarget.value.trim()
                        if (tag && !postTags.includes(tag)) {
                          setPostTags(prev => prev ? `${prev}, ${tag}` : tag)
                          e.currentTarget.value = ''
                        }
                      }
                    }}
                    className="w-full bg-black/30 border border-pink-400/30 rounded-2xl pl-12 pr-4 py-3 text-white placeholder:text-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-purple-400/20">
                <div className="flex items-center space-x-3">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleMediaSelect}
                      className="hidden"
                      disabled={mediaPreviews.length >= 4}
                    />
                    <div 
                      className={`text-gray-400 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-colors flex items-center ${
                        mediaPreviews.length >= 4 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      <Image className="h-5 w-5 mr-2" />
                      Media {mediaPreviews.length > 0 && `(${mediaPreviews.length}/4)`}
                    </div>
                  </label>
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowPollCreator(!showPollCreator)}
                    className={`text-gray-400 hover:text-white hover:bg-white/10 ${
                      showPollCreator ? 'text-cyan-400 bg-cyan-500/10' : ''
                    }`}
                  >
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Poll
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      navigator.geolocation?.getCurrentPosition(
                        (position) => {
                          const location = `📍 ${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`
                          setPostContent(prev => prev + ` ${location}`)
                        },
                        () => {
                          setPostContent(prev => prev + ' 📍 Location shared')
                        }
                      )
                    }}
                    className="text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    <MapPin className="h-5 w-5 mr-2" />
                    Location
                  </Button>
                </div>
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="ghost" 
                    onClick={resetUploadModal}
                    className="text-gray-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreatePost}
                    disabled={!postContent.trim() && !postCode.trim() && selectedMedia.length === 0 && (!showPollCreator || !pollQuestion.trim())}
                    className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white font-bold px-8 py-2 rounded-full shadow-lg shadow-purple-500/25 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {selectedMedia.length > 0 ? '📸 ' : showPollCreator ? '📊 ' : ''}Post It! 🚀
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Story Modal */}
      {showCreateStory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Create Story</h2>
              <button onClick={() => setShowCreateStory(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setStoryType('text')}
                  className={`flex-1 p-3 rounded-xl flex items-center justify-center space-x-2 ${
                    storyType === 'text' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100'
                  }`}
                >
                  <Type className="h-5 w-5" />
                  <span>Text</span>
                </button>
                <label className={`flex-1 p-3 rounded-xl flex items-center justify-center space-x-2 cursor-pointer ${
                  storyType === 'image' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100'
                }`}>
                  <Camera className="h-5 w-5" />
                  <span>{uploadingStory ? 'Uploading...' : 'Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleStoryMediaUpload}
                    className="hidden"
                    disabled={uploadingStory}
                  />
                </label>
              </div>

              {storyType === 'image' && storyMedia && (
                <div className="relative">
                  <img src={storyMedia} alt="Story" className="w-full h-48 object-cover rounded-xl" />
                </div>
              )}

              <textarea
                value={storyContent}
                onChange={(e) => setStoryContent(e.target.value)}
                placeholder={storyType === 'text' ? 'Share something...' : 'Add a caption...'}
                className="w-full p-3 border rounded-xl resize-none h-24 focus:outline-none focus:border-purple-400"
              />

              <Button
                onClick={handleCreateStory}
                disabled={!storyContent.trim() && !storyMedia}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white"
              >
                Share Story
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Story Viewer */}
      {showStoryViewer && storyGroups[currentUserIndex]?.stories[currentStoryIndex] && (
        (() => {
          const currentStory = storyGroups[currentUserIndex].stories[currentStoryIndex]
          return (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-md mx-auto">
            {/* Progress bars */}
            <div className="absolute top-4 left-4 right-4 flex space-x-1 z-10">
              {storyGroups[currentUserIndex].stories.map((_, index) => (
                <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-white transition-all duration-300 ${
                      index < currentStoryIndex ? 'w-full' : 
                      index === currentStoryIndex ? 'w-full animate-pulse' : 'w-0'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="absolute top-12 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={storyGroups[currentUserIndex].user.profile?.avatar} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">
                    {storyGroups[currentUserIndex].user.profile?.name?.[0] || storyGroups[currentUserIndex].user.username[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-medium text-sm">
                    {storyGroups[currentUserIndex].user.profile?.name || storyGroups[currentUserIndex].user.username}
                  </p>
                  <p className="text-white/70 text-xs">
                    {new Date(currentStory.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowStoryViewer(false)} className="text-white">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Story Content */}
            <div className="w-full h-full flex items-center justify-center">
              {currentStory.mediaUrl ? (
                <img 
                  src={currentStory.mediaUrl} 
                  alt="Story" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center p-8">
                  <p className="text-white text-xl text-center font-medium">
                    {currentStory.content}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <button 
              onClick={prevStory}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button 
              onClick={nextStory}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            {/* Views count */}
            <div className="absolute bottom-4 left-4 flex items-center space-x-1 text-white/70">
              <Eye className="h-4 w-4" />
              <span className="text-sm">{currentStory._count.views}</span>
            </div>

            {/* Tap areas for navigation */}
            <div className="absolute inset-0 flex">
              <div className="w-1/2 h-full" onClick={prevStory} />
              <div className="w-1/2 h-full" onClick={nextStory} />
            </div>
          </div>
        </div>
        )
        })()
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
          <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-3xl border border-purple-400/30 w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl">
            {/* Search Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-400/20">
              <h2 className="text-xl font-bold text-white">Search Users</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSearchModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Search Input */}
            <div className="p-6 border-b border-purple-400/20">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name, username, or skills..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    handleSearch(e.target.value)
                  }}
                  className="w-full bg-black/30 border border-purple-400/30 rounded-2xl pl-12 pr-4 py-4 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                />
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto p-6">
              {searchLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
                  <p className="text-gray-400 mt-2">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((targetUser) => (
                    <div key={targetUser.id} className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 p-4 hover:border-purple-400/30 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12 ring-2 ring-purple-400/50">
                            <AvatarImage src={targetUser.profile?.avatar} />
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                              {targetUser.profile?.name?.[0] || targetUser.username[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-bold text-white">{targetUser.profile?.name || targetUser.username}</h3>
                            <p className="text-purple-300 text-sm">@{targetUser.username}</p>
                            {targetUser.profile?.bio && (
                              <p className="text-gray-300 text-sm mt-1">{targetUser.profile.bio}</p>
                            )}
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => toggleFollow(targetUser.id)}
                          className={targetUser.isFollowedByCurrentUser ? 
                            "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white" :
                            "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                          }
                        >
                          {targetUser.isFollowedByCurrentUser ? 'Following' : 'Follow'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchTerm ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No users found for "{searchTerm}"</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">Start typing to search for users</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  async function handleSearch(query: string) {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    try {
      const res = await fetch(`/api/search/users?q=${encodeURIComponent(query)}`)
      if (res.ok) {
        const users = await res.json()
        // Add follow status for each user
        const usersWithFollowStatus = await Promise.all(
          users.map(async (targetUser: any) => {
            const followRes = await fetch(`/api/follow/status?userId=${targetUser.id}`)
            const followData = followRes.ok ? await followRes.json() : { isFollowing: false }
            return {
              ...targetUser,
              isFollowedByCurrentUser: followData.isFollowing
            }
          })
        )
        setSearchResults(usersWithFollowStatus)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setSearchLoading(false)
    }
  }

  async function toggleFollow(userId: string) {
    try {
      const res = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: userId })
      })
      
      if (res.ok) {
        // Update search results
        setSearchResults(prev => prev.map(user => 
          user.id === userId 
            ? { ...user, isFollowedByCurrentUser: !user.isFollowedByCurrentUser }
            : user
        ))
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error)
    }
  }
}