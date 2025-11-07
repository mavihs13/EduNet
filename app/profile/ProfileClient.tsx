'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Home, Search, Bell, LogOut, Settings, Grid3X3, Bookmark, Heart, MessageCircle, Share, Edit, MapPin, LinkIcon, Calendar, Users, Trophy, Code, Star, Copy, Send, X, Camera, User, Globe, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { formatTimeAgo } from '@/lib/utils'

interface ProfileClientProps {
  user: any
  followingCount: number
  followersCount: number
  friends?: any[]
}

export default function ProfileClient({ user, followingCount, followersCount, friends = [] }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState('posts')
  const [showLikes, setShowLikes] = useState<{[key: string]: boolean}>({})
  const [showComments, setShowComments] = useState<{[key: string]: boolean}>({})
  const [showShareMenu, setShowShareMenu] = useState<{[key: string]: boolean}>({})
  const [commentText, setCommentText] = useState<{[key: string]: string}>({})
  const [showFriendsShare, setShowFriendsShare] = useState<{[key: string]: boolean}>({})
  const [savedPosts, setSavedPosts] = useState([])
  const [loadingSaved, setLoadingSaved] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user.profile?.name || '',
    bio: user.profile?.bio || '',
    avatar: user.profile?.avatar || '',
    skills: user.profile?.skills || '',
    links: user.profile?.links || '',
    location: user.profile?.location || ''
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const fetchSavedPosts = async () => {
    setLoadingSaved(true)
    try {
      const res = await fetch('/api/posts/saved')
      if (res.ok) {
        const data = await res.json()
        setSavedPosts(data)
      }
    } catch (error) {
      console.error('Failed to fetch saved posts:', error)
    } finally {
      setLoadingSaved(false)
    }
  }

  const SavedPostsSection = () => {
    useEffect(() => {
      if (activeTab === 'saved') {
        fetchSavedPosts()
      }
    }, [activeTab])

    const fetchSavedPostsInner = async () => {
      setLoadingSaved(true)
      try {
        const res = await fetch('/api/posts/saved')
        if (res.ok) {
          const data = await res.json()
          setSavedPosts(data)
        }
      } catch (error) {
        console.error('Failed to fetch saved posts:', error)
      } finally {
        setLoadingSaved(false)
      }
    }

    if (loadingSaved) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading saved posts...</p>
        </div>
      )
    }

    if (savedPosts.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bookmark className="h-12 w-12 text-gray-500" />
          </div>
          <p className="text-gray-400 text-lg">No saved posts</p>
          <p className="text-gray-500 text-sm">Posts you save will appear here</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedPosts.map((save: any) => {
          const post = save.post
          return (
            <div key={save.id} className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-purple-400/30 transition-all duration-300 group">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-xs text-gray-400">Saved</span>
                  </div>
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                </div>
                
                {post.content && (
                  <p className="text-white text-sm mb-3 line-clamp-3">{post.content}</p>
                )}
                
                {post.code && (
                  <div className="bg-black/40 rounded-lg p-3 mb-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <Code className="h-4 w-4 text-cyan-400" />
                      <span className="text-xs text-cyan-300">{post.language || 'code'}</span>
                    </div>
                    <pre className="text-green-400 text-xs overflow-hidden">
                      <code className="line-clamp-2">{post.code}</code>
                    </pre>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4 text-pink-400" />
                      <span className="text-xs text-gray-400">{post._count?.likes || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-xs text-gray-400">{post._count?.comments || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-400">by @{post.user?.username}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  const totalLikes = user.posts.reduce((sum: number, post: any) => sum + post._count.likes, 0)

  const handleShare = async (postId: string, type: string) => {
    const url = `${window.location.origin}/post/${postId}`
    const text = 'Check out this amazing post on EduNet! 🚀'
    
    try {
      switch(type) {
        case 'copy':
          await navigator.clipboard.writeText(url)
          showNotification('Link copied to clipboard! 📋')
          break
        case 'message':
          showNotification('Direct message feature coming soon! 💬')
          break
        case 'story':
          showNotification('Add to story feature coming soon! 📸')
          break
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank', 'width=600,height=400')
          break
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}&hashtags=EduNet,Coding`, '_blank', 'width=600,height=400')
          break
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`, '_blank')
          break
        case 'telegram':
          window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
          break
        case 'email':
          window.open(`mailto:?subject=${encodeURIComponent('Amazing Post from EduNet')}&body=${encodeURIComponent(text + '\n\n' + url)}`, '_blank')
          break
      }
    } catch (error) {
      showNotification('Sharing failed. Please try again.')
    }
    
    setShowShareMenu(prev => ({ ...prev, [postId]: false }))
  }

  const showNotification = (message: string) => {
    const notification = document.createElement('div')
    notification.className = 'fixed top-20 right-4 z-50 px-6 py-3 rounded-2xl bg-green-500 text-white font-medium shadow-2xl transform transition-all duration-300'
    notification.textContent = message
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)'
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }

  const handleShareWithFriend = async (postId: string, friendId: string) => {
    try {
      const res = await fetch('/api/share-with-friend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, friendId })
      })
      
      if (res.ok) {
        showNotification('Post shared with friend! 👥')
        setShowFriendsShare(prev => ({ ...prev, [postId]: false }))
        setShowShareMenu(prev => ({ ...prev, [postId]: false }))
      }
    } catch (error) {
      showNotification('Failed to share with friend')
    }
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
        showNotification(data.saved ? 'Post saved! ⭐' : 'Post unsaved')
        // Don't reload for better UX - update state instead
        const updatedPosts = user.posts.map((post: any) => {
          if (post.id === postId) {
            const isSaved = post.saves?.some((save: any) => save.userId === user.id)
            const isOwnPost = post.userId === user.id
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
        })
        user.posts = updatedPosts
        // Always refresh saved posts when starring/unstarring
        fetchSavedPosts()
      }
    } catch (error) {
      showNotification('Failed to save post')
    }
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
        setCommentText(prev => ({ ...prev, [postId]: '' }))
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to add comment:', error)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const res = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        const data = await res.json()
        setEditForm(prev => ({ ...prev, avatar: data.avatarUrl }))
        showNotification('Avatar uploaded! 📸')
      } else {
        showNotification('Failed to upload avatar')
      }
    } catch (error) {
      showNotification('Failed to upload avatar')
    } finally {
      setUploading(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      
      if (res.ok) {
        showNotification('Profile updated successfully! ✨')
        setShowEditProfile(false)
        window.location.reload()
      } else {
        showNotification('Failed to update profile')
      }
    } catch (error) {
      showNotification('Failed to update profile')
    } finally {
      setSaving(false)
    }
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
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white">
                <Bell className="h-6 w-6" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
              <Settings className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-red-500/20 text-white">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Profile Header */}
        <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Picture */}
            <div className="relative">
              <Avatar className="h-32 w-32 ring-4 ring-gradient-to-r from-pink-400 to-purple-400 ring-offset-4 ring-offset-transparent">
                <AvatarImage src={user.profile?.avatar} />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-4xl">
                  {user.profile?.name?.[0] || user.username[0]}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-black/20 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
                <h1 className="text-3xl font-bold text-white mb-2 md:mb-0">
                  {user.profile?.name || user.username}
                </h1>
                <Button 
                  onClick={() => setShowEditProfile(true)}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-full px-6"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
              
              <p className="text-purple-300 text-lg mb-4">@{user.username}</p>
              
              {user.profile?.bio && (
                <p className="text-gray-300 mb-4 max-w-md">{user.profile.bio}</p>
              )}

              {/* Profile Details */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-6">
                {user.profile?.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{user.profile.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
                {user.profile?.links && (
                  <div className="flex items-center space-x-1">
                    <LinkIcon className="h-4 w-4" />
                    <a href={user.profile.links} className="text-cyan-400 hover:underline">
                      {user.profile.links}
                    </a>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex justify-center md:justify-start space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{user._count.posts}</div>
                  <div className="text-sm text-gray-400">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{followersCount}</div>
                  <div className="text-sm text-gray-400">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{followingCount}</div>
                  <div className="text-sm text-gray-400">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{totalLikes}</div>
                  <div className="text-sm text-gray-400">Likes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          {user.profile?.skills && (
            <div className="mt-8 pt-6 border-t border-white/10">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <Code className="h-5 w-5 mr-2 text-cyan-400" />
                Skills & Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.profile.skills.split(',').map((skill: string) => (
                  <span key={skill.trim()} className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm font-medium border border-cyan-400/30">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 mb-8">
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 transition-colors ${
                activeTab === 'posts' 
                  ? 'text-white border-b-2 border-purple-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="h-5 w-5" />
              <span className="font-medium">Posts</span>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 transition-colors ${
                activeTab === 'saved' 
                  ? 'text-white border-b-2 border-purple-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Bookmark className="h-5 w-5" />
              <span className="font-medium">Saved</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'posts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.posts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Grid3X3 className="h-12 w-12 text-gray-500" />
                </div>
                <p className="text-gray-400 text-lg">No posts yet</p>
                <p className="text-gray-500 text-sm">Share your first post to get started!</p>
              </div>
            ) : (
              user.posts.map((post: any) => (
                <div key={post.id} className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-purple-400/30 transition-all duration-300 group">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-xs text-gray-400">{formatTimeAgo(new Date(post.createdAt))}</span>
                      </div>
                      <button 
                        onClick={() => handleSavePost(post.id)}
                        className="flex items-center space-x-1 hover:scale-110 transition-transform"
                      >
                        <Star className={`h-4 w-4 ${post.saves?.some((save: any) => save.userId === user.id) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
                        <span className="text-xs text-gray-400">{post._count.saves || 0}</span>
                      </button>
                    </div>
                    
                    {post.content && (
                      <p className="text-white text-sm mb-3 line-clamp-3">{post.content}</p>
                    )}
                    
                    {post.code && (
                      <div className="bg-black/40 rounded-lg p-3 mb-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <Code className="h-4 w-4 text-cyan-400" />
                          <span className="text-xs text-cyan-300">{post.language || 'code'}</span>
                        </div>
                        <pre className="text-green-400 text-xs overflow-hidden">
                          <code className="line-clamp-2">{post.code}</code>
                        </pre>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={() => setShowLikes(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                          className="flex items-center space-x-1 hover:scale-110 transition-transform"
                        >
                          <Heart className="h-4 w-4 text-pink-400" />
                          <span className="text-xs text-gray-400">{post._count.likes}</span>
                        </button>
                        <button 
                          onClick={() => setShowComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                          className="flex items-center space-x-1 hover:scale-110 transition-transform"
                        >
                          <MessageCircle className="h-4 w-4 text-blue-400" />
                          <span className="text-xs text-gray-400">{post._count.comments}</span>
                        </button>
                      </div>
                      <button 
                        onClick={() => setShowShareMenu(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                        className="relative"
                      >
                        <Share className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors cursor-pointer" />
                        {showShareMenu[post.id] && (
                          <div className="absolute bottom-6 right-0 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-4 z-10 min-w-[280px] shadow-2xl">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-gray-800 font-semibold text-lg">Share Post</h3>
                              <button
                                onClick={() => setShowShareMenu(prev => ({ ...prev, [post.id]: false }))}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                ×
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-3 mb-4">
                              <button
                                onClick={() => handleShare(post.id, 'message')}
                                className="flex flex-col items-center space-y-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-all"
                              >
                                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                  <MessageCircle className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xs font-medium text-gray-700">Message</span>
                              </button>
                              
                              <button
                                onClick={() => handleShare(post.id, 'story')}
                                className="flex flex-col items-center space-y-2 p-3 bg-purple-50 hover:bg-purple-100 rounded-2xl transition-all"
                              >
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                  <Star className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xs font-medium text-gray-700">Story</span>
                              </button>
                              
                              <button
                                onClick={() => handleShare(post.id, 'copy')}
                                className="flex flex-col items-center space-y-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all"
                              >
                                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                                  <Copy className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xs font-medium text-gray-700">Copy</span>
                              </button>
                            </div>
                            
                            <div className="border-t border-gray-200 pt-4">
                              <button
                                onClick={() => setShowFriendsShare(prev => ({ ...prev, [post.id]: !prev[post.id] }))}
                                className="w-full flex items-center justify-center space-x-3 p-3 mb-3 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all"
                              >
                                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                  <Users className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Share with Friends</span>
                              </button>
                              
                              {showFriendsShare[post.id] && (
                                <div className="mb-4 p-3 bg-gray-50 rounded-xl max-h-40 overflow-y-auto">
                                  <p className="text-xs font-medium text-gray-600 mb-2">Send to friends</p>
                                  {friends.length === 0 ? (
                                    <p className="text-xs text-gray-500 text-center py-4">No friends to share with</p>
                                  ) : (
                                    <div className="space-y-2">
                                      {friends.slice(0, 5).map((friend: any) => (
                                        <button
                                          key={friend.id}
                                          onClick={() => handleShareWithFriend(post.id, friend.id)}
                                          className="w-full flex items-center space-x-2 p-2 hover:bg-white rounded-lg transition-colors"
                                        >
                                          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                            {friend.username?.[0] || 'F'}
                                          </div>
                                          <span className="text-xs text-gray-700">{friend.username}</span>
                                        </button>
                                      ))}
                                      {friends.length > 5 && (
                                        <p className="text-xs text-gray-500 text-center">+{friends.length - 5} more friends</p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              <p className="text-sm font-medium text-gray-600 mb-3">Share to social media</p>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  onClick={() => handleShare(post.id, 'whatsapp')}
                                  className="flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-all"
                                >
                                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                    <MessageCircle className="h-4 w-4 text-white" />
                                  </div>
                                  <span className="text-sm font-medium text-gray-700">WhatsApp</span>
                                </button>
                                
                                <button
                                  onClick={() => handleShare(post.id, 'facebook')}
                                  className="flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
                                >
                                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Share className="h-4 w-4 text-white" />
                                  </div>
                                  <span className="text-sm font-medium text-gray-700">Facebook</span>
                                </button>
                                
                                <button
                                  onClick={() => handleShare(post.id, 'twitter')}
                                  className="flex items-center space-x-3 p-3 bg-sky-50 hover:bg-sky-100 rounded-xl transition-all"
                                >
                                  <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                                    <Share className="h-4 w-4 text-white" />
                                  </div>
                                  <span className="text-sm font-medium text-gray-700">Twitter</span>
                                </button>
                                
                                <button
                                  onClick={() => handleShare(post.id, 'telegram')}
                                  className="flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
                                >
                                  <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center">
                                    <Send className="h-4 w-4 text-white" />
                                  </div>
                                  <span className="text-sm font-medium text-gray-700">Telegram</span>
                                </button>
                              </div>
                              
                              <button
                                onClick={() => handleShare(post.id, 'email')}
                                className="w-full flex items-center justify-center space-x-3 p-3 mt-2 bg-red-50 hover:bg-red-100 rounded-xl transition-all"
                              >
                                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                                  <Share className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Send via Email</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Likes Modal */}
                  {showLikes[post.id] && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <div className="bg-white rounded-3xl w-full max-w-md max-h-[70vh] overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b">
                          <h3 className="text-lg font-semibold text-gray-800">Likes</h3>
                          <button 
                            onClick={() => setShowLikes(prev => ({ ...prev, [post.id]: false }))}
                            className="p-2 hover:bg-gray-100 rounded-full"
                          >
                            ×
                          </button>
                        </div>
                        <div className="p-4 space-y-3 overflow-y-auto">
                          {post.likes.map((like: any) => (
                            <div key={like.id} className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                {like.user?.username?.[0] || 'U'}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{like.user?.username || 'User'}</p>
                                <p className="text-sm text-gray-500">@{like.user?.username || 'user'}</p>
                              </div>
                            </div>
                          ))}
                          {post.likes.length === 0 && (
                            <p className="text-center text-gray-500 py-8">No likes yet</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Comments Modal */}
                  {showComments[post.id] && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <div className="bg-white rounded-3xl w-full max-w-md max-h-[70vh] overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b">
                          <h3 className="text-lg font-semibold text-gray-800">Comments</h3>
                          <button 
                            onClick={() => setShowComments(prev => ({ ...prev, [post.id]: false }))}
                            className="p-2 hover:bg-gray-100 rounded-full"
                          >
                            ×
                          </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                          {post.comments.map((comment: any) => (
                            <div key={comment.id} className="flex space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {comment.user?.username?.[0] || 'U'}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-800 text-sm">{comment.user?.username || 'User'}</p>
                                <p className="text-gray-700 text-sm">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                          {post.comments.length === 0 && (
                            <p className="text-center text-gray-500 py-8">No comments yet</p>
                          )}
                        </div>
                        <div className="p-4 border-t">
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              value={commentText[post.id] || ''}
                              onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-purple-400"
                            />
                            <button 
                              onClick={() => handleComment(post.id)}
                              disabled={!commentText[post.id]?.trim()}
                              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-4 py-2 text-sm font-medium disabled:opacity-50"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <SavedPostsSection />
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
              <button 
                onClick={() => setShowEditProfile(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24 ring-4 ring-purple-200">
                    <AvatarImage src={editForm.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-2xl">
                      {editForm.name?.[0] || user.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white hover:bg-purple-600 transition-colors cursor-pointer">
                    {uploading ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
                <div className="w-full space-y-3">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Click camera icon to upload image</p>
                    <p className="text-xs text-gray-500">or enter URL below</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture URL</label>
                    <input
                      type="url"
                      value={editForm.avatar}
                      onChange={(e) => setEditForm(prev => ({ ...prev, avatar: e.target.value }))}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-400 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 mr-2 text-purple-500" />
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your display name"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MessageCircle className="h-4 w-4 mr-2 text-purple-500" />
                    Bio
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-400 transition-colors resize-none"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-purple-500" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, Country"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>

                {/* Website/Links */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Globe className="h-4 w-4 mr-2 text-purple-500" />
                    Website/Portfolio
                  </label>
                  <input
                    type="url"
                    value={editForm.links}
                    onChange={(e) => setEditForm(prev => ({ ...prev, links: e.target.value }))}
                    placeholder="https://yourwebsite.com"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Code className="h-4 w-4 mr-2 text-purple-500" />
                    Skills & Technologies
                  </label>
                  <input
                    type="text"
                    value={editForm.skills}
                    onChange={(e) => setEditForm(prev => ({ ...prev, skills: e.target.value }))}
                    placeholder="JavaScript, React, Python, etc. (comma separated)"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-end space-x-4 p-6 border-t bg-gray-50">
              <Button 
                onClick={() => setShowEditProfile(false)}
                variant="outline"
                className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-2 disabled:opacity-50"
              >
                {saving ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}