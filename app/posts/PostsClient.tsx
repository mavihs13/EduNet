'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle, Share, MoreHorizontal, Plus, Home, Search, Bell, LogOut, Repeat2, Bookmark, ExternalLink, Flag, UserMinus, Volume2, VolumeX } from 'lucide-react'
import { formatTimeAgo } from '@/lib/utils'
import CreatePost from '@/components/CreatePost'
import Link from 'next/link'

interface PostsClientProps {
  user: any
  initialPosts: any[]
}

export default function PostsClient({ user, initialPosts }: PostsClientProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showDropdown, setShowDropdown] = useState<string | null>(null)
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set())
  const [retweetedPosts, setRetweetedPosts] = useState<Set<string>>(new Set())

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowDropdown(null)
    if (showDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showDropdown])

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

  const handleRetweet = async (postId: string) => {
    setRetweetedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const handleBookmark = async (postId: string) => {
    setBookmarkedPosts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const handleShare = async (post: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post by ${post.user.profile?.name || post.user.username}`,
          text: post.content,
          url: window.location.href
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href + '/posts/' + post.id)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">EduNet</h1>
          <div className="flex items-center space-x-6">
            <Link href="/feed">
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <Home className="h-6 w-6" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <Search className="h-6 w-6" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-gray-100"
              onClick={() => setShowCreatePost(!showCreatePost)}
            >
              <Plus className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100">
              <Bell className="h-6 w-6" />
            </Button>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={user.profile?.avatar} />
              <AvatarFallback className="bg-blue-500 text-white text-sm">
                {user.profile?.name?.[0] || user.username[0]}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-gray-100">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Create New Post</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowCreatePost(false)}>
                <Plus className="h-5 w-5 rotate-45" />
              </Button>
            </div>
            <CreatePost 
              user={user} 
              onPostCreated={(newPost) => {
                setPosts([newPost, ...posts])
                setShowCreatePost(false)
              }} 
            />
          </div>
        )}

        {/* Posts Feed */}
        <div className="space-y-0">
          {posts.map((post) => (
            <article key={post.id} className="bg-white border-b border-gray-200 hover:bg-gray-50/50 transition-colors">
              <div className="p-4">
                {/* Retweet indicator */}
                {retweetedPosts.has(post.id) && (
                  <div className="flex items-center text-gray-500 text-sm mb-2 ml-8">
                    <Repeat2 className="h-4 w-4 mr-2" />
                    <span>You retweeted</span>
                  </div>
                )}

                {/* Post Header */}
                <div className="flex space-x-3">
                  <Avatar className="h-12 w-12 cursor-pointer hover:opacity-90 transition-opacity">
                    <AvatarImage src={post.user.profile?.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {post.user.profile?.name?.[0] || post.user.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    {/* User info and timestamp */}
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-bold text-gray-900 hover:underline cursor-pointer">
                        {post.user.profile?.name || post.user.username}
                      </p>
                      {post.user.verified && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      <p className="text-gray-500 hover:underline cursor-pointer">@{post.user.username}</p>
                      <span className="text-gray-500">·</span>
                      <p className="text-gray-500 text-sm hover:underline cursor-pointer" title={new Date(post.createdAt).toLocaleString()}>
                        {formatTimeAgo(new Date(post.createdAt))}
                      </p>
                      
                      {/* More options dropdown */}
                      <div className="ml-auto relative">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 hover:bg-blue-50 hover:text-blue-500 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            setShowDropdown(showDropdown === post.id ? null : post.id)
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        
                        {/* Dropdown Menu */}
                        {showDropdown === post.id && (
                          <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] z-10">
                            {post.user.id !== user.id && (
                              <>
                                <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-gray-700">
                                  <UserMinus className="h-4 w-4 mr-3" />
                                  Unfollow @{post.user.username}
                                </button>
                                <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-gray-700">
                                  <VolumeX className="h-4 w-4 mr-3" />
                                  Mute @{post.user.username}
                                </button>
                                <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-gray-700">
                                  <Flag className="h-4 w-4 mr-3" />
                                  Report post
                                </button>
                              </>
                            )}
                            <button 
                              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-gray-700"
                              onClick={() => handleBookmark(post.id)}
                            >
                              <Bookmark className={`h-4 w-4 mr-3 ${bookmarkedPosts.has(post.id) ? 'fill-current text-blue-500' : ''}`} />
                              {bookmarkedPosts.has(post.id) ? 'Remove bookmark' : 'Bookmark'}
                            </button>
                            <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center text-gray-700">
                              <ExternalLink className="h-4 w-4 mr-3" />
                              Copy link to post
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Post Content */}
                    {post.content && (
                      <div className="mb-3">
                        <p className="text-gray-900 text-[15px] leading-normal whitespace-pre-wrap">
                          {post.content.split(' ').map((word, index) => {
                            if (word.startsWith('#')) {
                              return (
                                <span key={index} className="text-blue-500 hover:underline cursor-pointer">
                                  {word}{' '}
                                </span>
                              )
                            }
                            if (word.startsWith('@')) {
                              return (
                                <span key={index} className="text-blue-500 hover:underline cursor-pointer">
                                  {word}{' '}
                                </span>
                              )
                            }
                            if (word.startsWith('http')) {
                              return (
                                <a key={index} href={word} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                  {word}{' '}
                                </a>
                              )
                            }
                            return word + ' '
                          })}
                        </p>
                      </div>
                    )}
                    
                    {/* Tags */}
                    {post.tags && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.split(',').map((tag: string) => (
                          <span key={tag.trim()} className="text-blue-500 hover:underline cursor-pointer text-sm">
                            #{tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Engagement Stats */}
                    {(post._count.likes > 0 || post._count.comments > 0) && (
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3 pt-2">
                        {post._count.likes > 0 && (
                          <span className="hover:underline cursor-pointer">
                            <strong className="text-gray-900">{post._count.likes}</strong> {post._count.likes === 1 ? 'like' : 'likes'}
                          </span>
                        )}
                        {post._count.comments > 0 && (
                          <span className="hover:underline cursor-pointer">
                            <strong className="text-gray-900">{post._count.comments}</strong> {post._count.comments === 1 ? 'reply' : 'replies'}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center justify-between max-w-md pt-2 border-t border-gray-100">
                      {/* Reply */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:bg-blue-50 hover:text-blue-500 rounded-full p-2 group"
                      >
                        <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        {post._count.comments > 0 && (
                          <span className="ml-2 text-sm">{post._count.comments}</span>
                        )}
                      </Button>
                      
                      {/* Retweet */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRetweet(post.id)}
                        className={`rounded-full p-2 group transition-colors ${
                          retweetedPosts.has(post.id) 
                            ? 'text-green-500 hover:bg-green-50' 
                            : 'text-gray-500 hover:bg-green-50 hover:text-green-500'
                        }`}
                      >
                        <Repeat2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      </Button>
                      
                      {/* Like */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className={`rounded-full p-2 group transition-colors ${
                          post.likes.some((like: any) => like.userId === user.id) 
                            ? 'text-red-500 hover:bg-red-50' 
                            : 'text-gray-500 hover:bg-red-50 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`h-5 w-5 group-hover:scale-110 transition-transform ${
                          post.likes.some((like: any) => like.userId === user.id) ? 'fill-current' : ''
                        }`} />
                        {post._count.likes > 0 && (
                          <span className="ml-2 text-sm">{post._count.likes}</span>
                        )}
                      </Button>
                      
                      {/* Share */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(post)}
                        className="text-gray-500 hover:bg-blue-50 hover:text-blue-500 rounded-full p-2 group"
                      >
                        <Share className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      </Button>
                      
                      {/* Bookmark */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark(post.id)}
                        className={`rounded-full p-2 group transition-colors ${
                          bookmarkedPosts.has(post.id)
                            ? 'text-blue-500 hover:bg-blue-50'
                            : 'text-gray-500 hover:bg-blue-50 hover:text-blue-500'
                        }`}
                      >
                        <Bookmark className={`h-5 w-5 group-hover:scale-110 transition-transform ${
                          bookmarkedPosts.has(post.id) ? 'fill-current' : ''
                        }`} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}