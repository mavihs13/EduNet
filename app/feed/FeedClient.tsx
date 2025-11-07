'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle, Share, MoreHorizontal, Home, Search, Bell, User, LogOut } from 'lucide-react'
import { formatTimeAgo } from '@/lib/utils'
import CodeViewer from '@/components/CodeViewer'
import Link from 'next/link'

interface FeedClientProps {
  user: any
  initialPosts: any[]
}

export default function FeedClient({ user, initialPosts }: FeedClientProps) {
  const [posts, setPosts] = useState(initialPosts)

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
            <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white relative">
              <Search className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white relative">
              <Bell className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-pulse"></span>
            </Button>
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
            <div className="flex-shrink-0 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-2 cursor-pointer hover:scale-110 transition-transform">
                <span className="text-2xl">➕</span>
              </div>
              <p className="text-xs text-white/80">Your Story</p>
            </div>
            {posts.slice(0, 6).map((post, idx) => (
              <div key={idx} className="flex-shrink-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full p-0.5 cursor-pointer hover:scale-110 transition-transform">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={post.user.profile?.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">
                      {post.user.profile?.name?.[0] || post.user.username[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <p className="text-xs text-white/80 mt-1 truncate w-16">{post.user.username}</p>
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
                <Button variant="ghost" size="icon" className="hover:bg-white/10 text-white">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </div>

              {/* Post Content */}
              <div className="px-6 pb-4">
                {post.content && (
                  <p className="text-white mb-4 leading-relaxed text-lg">{post.content}</p>
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
                    <Button variant="ghost" size="sm" className="text-white hover:bg-purple-500/20 transition-all duration-300">
                      <MessageCircle className="h-6 w-6 mr-2" />
                      <span className="font-bold">{post._count.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-cyan-500/20 transition-all duration-300">
                      <Share className="h-6 w-6 mr-2" />
                      <span className="font-bold">Share</span>
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-purple-300">🔥 {post._count.likes * 3 + 15}K views</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8">
          <Button className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:scale-110 transition-all duration-300 shadow-2xl shadow-purple-500/25">
            <span className="text-2xl">✨</span>
          </Button>
        </div>
      </div>
    </div>
  )
}