'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Home, Settings, Grid, Bookmark, Code, Trophy, ArrowLeft, Moon, Sun, Heart, MessageCircle, Share } from 'lucide-react'
import Link from 'next/link'
import { formatTimeAgo } from '@/lib/utils'
import CodeViewer from '@/components/CodeViewer'

export default function ProfileClient({ initialUser, initialStats }: any) {
  const [user, setUser] = useState(initialUser)
  const [stats, setStats] = useState(initialStats)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user.profile?.name || '',
    username: user.username,
    bio: user.profile?.bio || '',
    avatar: user.profile?.avatar || '',
    skills: user.profile?.skills || '',
    location: user.profile?.location || ''
  })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light'
    setIsDarkMode(theme === 'dark')
    document.documentElement.classList.toggle('dark', theme === 'dark')
    fetchPosts()
  }, [user.id])

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark'
    setIsDarkMode(!isDarkMode)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const reader = new FileReader()
    reader.onloadend = () => {
      setEditForm({ ...editForm, avatar: reader.result as string })
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleEditProfile = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })
      if (res.ok) {
        const updatedUser = await res.json()
        setUser(updatedUser)
        setShowEditModal(false)
        fetchPosts()
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/posts?userId=${user.id}`)
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/feed">
              <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user.profile?.name || user.username}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stats.posts} posts</p>
            </div>
          </div>
          <Link href="/feed">
            <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Home className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 mb-6 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <Avatar className="h-32 w-32 ring-4 ring-blue-500 dark:ring-blue-400">
              <AvatarImage src={user.profile?.avatar} />
              <AvatarFallback className="bg-blue-600 text-white text-4xl font-bold">
                {user.profile?.name?.[0] || user.username[0]}
              </AvatarFallback>
            </Avatar>
            <Button onClick={() => setShowEditModal(true)} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{user.profile?.name || user.username}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">@{user.username}</p>
            {user.profile?.bio && <p className="text-gray-700 dark:text-gray-300 mb-4">{user.profile.bio}</p>}
            {user.profile?.location && <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">📍 {user.profile.location}</p>}
          </div>

          <div className="flex items-center space-x-8 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.posts}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Posts</p>
            </div>
            <div className="text-center cursor-pointer hover:scale-110 transition-transform">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.followers}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Followers</p>
            </div>
            <div className="text-center cursor-pointer hover:scale-110 transition-transform">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.following}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Following</p>
            </div>
          </div>

          {user.profile?.skills && (
            <div className="mb-6">
              <h3 className="text-gray-900 dark:text-white font-semibold mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.profile.skills.split(',').map((skill: string) => (
                  <span key={skill.trim()} className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-semibold border border-blue-200 dark:border-blue-800">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-4">
            <Button onClick={() => setActiveTab('posts')} variant="outline" className={`w-full ${activeTab === 'posts' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400' : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'} transition-all`}>
              <Grid className="h-5 w-5 mr-2" />
              Posts
            </Button>
            <Link href="/coding-profile">
              <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
                <Code className="h-5 w-5 mr-2" />
                Coding
              </Button>
            </Link>
            <Button onClick={() => setActiveTab('achievements')} variant="outline" className={`w-full ${activeTab === 'achievements' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400' : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'} transition-all`}>
              <Trophy className="h-5 w-5 mr-2" />
              Achievements
            </Button>
            <Button onClick={() => setActiveTab('saved')} variant="outline" className={`w-full ${activeTab === 'saved' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400' : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-500 dark:hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400'} transition-all`}>
              <Bookmark className="h-5 w-5 mr-2" />
              Saved
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          {activeTab === 'posts' && (
            loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post: any) => (
                  <div key={post.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.user.profile?.avatar} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {post.user.profile?.name?.[0] || post.user.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{post.user.profile?.name || post.user.username}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{formatTimeAgo(new Date(post.createdAt))}</p>
                      </div>
                    </div>
                    {post.content && <p className="text-gray-900 dark:text-white mb-4">{post.content}</p>}
                    {post.media && post.media.length > 0 && (
                      <div className="mb-4 grid gap-2 rounded-lg overflow-hidden">
                        {post.media.map((media: any) => (
                          <img key={media.id} src={media.url} alt="Post media" className="w-full rounded-lg" />
                        ))}
                      </div>
                    )}
                    {post.code && (
                      <div className="mb-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <CodeViewer code={post.code} language={post.language || 'javascript'} />
                      </div>
                    )}
                    <div className="flex items-center space-x-6 text-gray-500 dark:text-gray-400">
                      <button className="flex items-center space-x-2 hover:text-blue-600 dark:hover:text-blue-400">
                        <Heart className="h-5 w-5" />
                        <span>{post._count.likes}</span>
                      </button>
                      <button className="flex items-center space-x-2 hover:text-blue-600 dark:hover:text-blue-400">
                        <MessageCircle className="h-5 w-5" />
                        <span>{post._count.comments}</span>
                      </button>
                      <button className="flex items-center space-x-2 hover:text-blue-600 dark:hover:text-blue-400">
                        <Share className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                <Grid className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No posts yet</p>
              </div>
            )
          )}
          {activeTab === 'achievements' && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No achievements yet</p>
            </div>
          )}
          {activeTab === 'saved' && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No saved posts yet</p>
            </div>
          )}
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Image</label>
                <div className="flex items-center space-x-4">
                  {editForm.avatar && (
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={editForm.avatar} />
                      <AvatarFallback className="bg-blue-600 text-white text-2xl">
                        {editForm.name?.[0] || editForm.username[0]}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                    >
                      {uploading ? 'Uploading...' : 'Choose Image'}
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">JPG, PNG or GIF (max 5MB)</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills (comma separated)</label>
                <input
                  type="text"
                  value={editForm.skills}
                  onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="JavaScript, React, Node.js"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="New York, USA"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <Button onClick={() => setShowEditModal(false)} variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                Cancel
              </Button>
              <Button onClick={handleEditProfile} disabled={saving} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
