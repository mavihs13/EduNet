'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle, Share, MoreHorizontal, Plus, Home, Search, Bell, User, LogOut, Edit, Calendar, MapPin } from 'lucide-react'
import { formatTimeAgo } from '@/lib/utils'
import CreatePost from '@/components/CreatePost'
import CodeViewer from '@/components/CodeViewer'
import Link from 'next/link'

interface ProfileClientProps {
  user: any
  userPosts: any[]
}

export default function ProfileClient({ user, userPosts }: ProfileClientProps) {
  const [posts, setPosts] = useState(userPosts)
  const [showCreatePost, setShowCreatePost] = useState(false)

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
            <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-gray-100">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-start space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.profile?.avatar} />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl">
                  {user.profile?.name?.[0] || user.username[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{user.profile?.name || user.username}</h1>
                    <p className="text-gray-600 text-lg">@{user.username}</p>
                  </div>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </Button>
                </div>
                
                {user.profile?.bio && (
                  <p className="text-gray-700 mb-4">{user.profile.bio}</p>
                )}
                
                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                  {user.profile?.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{user.profile.location}</span>
                    </div>
                  )}
                </div>

                {user.profile?.skills && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {user.profile.skills.split(',').map((skill: string) => (
                      <span key={skill.trim()} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                <p className="text-sm text-gray-600">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{posts.reduce((acc, post) => acc + post._count.likes, 0)}</p>
                <p className="text-sm text-gray-600">Likes Received</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{posts.reduce((acc, post) => acc + post._count.comments, 0)}</p>
                <p className="text-sm text-gray-600">Comments Received</p>
              </div>
            </div>
          </div>
        </div>

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

        {/* User Posts */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">My Posts</h2>
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-500 mb-4">You haven't posted anything yet</p>
              <Button onClick={() => setShowCreatePost(true)} className="bg-gradient-to-r from-blue-500 to-purple-500">
                Create Your First Post
              </Button>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Post Header */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={post.user.profile?.avatar} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {post.user.profile?.name?.[0] || post.user.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{post.user.profile?.name || post.user.username}</p>
                      <p className="text-sm text-gray-500">{formatTimeAgo(new Date(post.createdAt))}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3">
                  {post.content && (
                    <p className="text-gray-900 mb-3 leading-relaxed">{post.content}</p>
                  )}
                  
                  {post.tags && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.split(',').map((tag: string) => (
                        <span key={tag.trim()} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Code Block */}
                {post.code && (
                  <div className="mx-4 mb-4">
                    <CodeViewer code={post.code} language={post.language || 'javascript'} />
                  </div>
                )}

                {/* Post Actions */}
                <div className="border-t border-gray-100">
                  <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center space-x-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className={`hover:bg-gray-100 ${post.likes.some((like: any) => like.userId === user.id) ? 'text-red-500' : 'text-gray-600'}`}
                      >
                        <Heart className={`h-5 w-5 mr-2 ${post.likes.some((like: any) => like.userId === user.id) ? 'fill-current' : ''}`} />
                        {post._count.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">
                        <MessageCircle className="h-5 w-5 mr-2" />
                        {post._count.comments}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">
                        <Share className="h-5 w-5 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}