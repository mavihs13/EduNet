'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Home, Settings, Grid, Bookmark, Code, Trophy, ArrowLeft, Moon, Sun, Heart, MessageCircle, Share, X } from 'lucide-react'
import Link from 'next/link'
import { formatTimeAgo } from '@/lib/utils'
import CodeViewer from '@/components/CodeViewer'
import { useTheme } from '@/contexts/ThemeContext'

export default function ProfileClient({ initialUser, initialStats }: any) {
  const { theme, toggleTheme } = useTheme()
  const [user, setUser] = useState(initialUser)
  const [stats, setStats] = useState(initialStats)
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
  const [showFollowersModal, setShowFollowersModal] = useState(false)
  const [showFollowingModal, setShowFollowingModal] = useState(false)
  const [followers, setFollowers] = useState<any[]>([])
  const [following, setFollowing] = useState<any[]>([])
  const [loadingFollowers, setLoadingFollowers] = useState(false)
  const [loadingFollowing, setLoadingFollowing] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [user.id])

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/feed">
              <Button variant="ghost" size="icon" className="hover:bg-purple-50 text-gray-900 hover:text-purple-600 rounded-xl">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{user.profile?.name || user.username}</h1>
              <p className="text-sm text-gray-600">{stats.posts} posts</p>
            </div>
          </div>
          <Link href="/feed">
            <Button variant="ghost" size="icon" className="hover:bg-purple-50 text-gray-900 hover:text-purple-600 rounded-xl">
              <Home className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 hover:shadow-xl transition-all">
          <div className="flex items-start justify-between mb-6">
            <Avatar className="h-32 w-32 ring-4 ring-purple-500">
              <AvatarImage src={user.profile?.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-4xl font-bold">
                {user.profile?.name?.[0] || user.username[0]}
              </AvatarFallback>
            </Avatar>
            <Button onClick={() => setShowEditModal(true)} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{user.profile?.name || user.username}</h2>
            <p className="text-gray-600 mb-4">@{user.username}</p>
            {user.profile?.bio && <p className="text-gray-700 mb-4">{user.profile.bio}</p>}
            {user.profile?.location && <p className="text-gray-500 text-sm mb-2">📍 {user.profile.location}</p>}
          </div>

          <div className="flex items-center space-x-8 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.posts}</p>
              <p className="text-sm text-gray-500">Posts</p>
            </div>
            <button 
              onClick={async () => {
                setShowFollowersModal(true)
                setLoadingFollowers(true)
                try {
                  const res = await fetch(`/api/users/${user.id}/followers`)
                  if (res.ok) {
                    const data = await res.json()
                    setFollowers(data)
                  }
                } catch (error) {
                  console.error('Failed to load followers:', error)
                } finally {
                  setLoadingFollowers(false)
                }
              }}
              className="text-center cursor-pointer hover:scale-105 transition-transform hover:bg-purple-50 px-4 py-2 rounded-lg"
            >
              <p className="text-2xl font-bold text-gray-900">{stats.followers}</p>
              <p className="text-sm text-gray-500">Followers</p>
            </button>
            <button 
              onClick={async () => {
                setShowFollowingModal(true)
                setLoadingFollowing(true)
                try {
                  const res = await fetch(`/api/users/${user.id}/following`)
                  if (res.ok) {
                    const data = await res.json()
                    setFollowing(data)
                  }
                } catch (error) {
                  console.error('Failed to load following:', error)
                } finally {
                  setLoadingFollowing(false)
                }
              }}
              className="text-center cursor-pointer hover:scale-105 transition-transform hover:bg-purple-50 px-4 py-2 rounded-lg"
            >
              <p className="text-2xl font-bold text-gray-900">{stats.following}</p>
              <p className="text-sm text-gray-500">Following</p>
            </button>
          </div>

          {user.profile?.skills && (
            <div className="mb-6">
              <h3 className="text-gray-900 font-semibold mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.profile.skills.split(',').map((skill: string) => (
                  <span key={skill.trim()} className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold border border-purple-200">
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-4">
            <Button onClick={() => setActiveTab('posts')} variant="outline" className={`w-full ${activeTab === 'posts' ? 'bg-purple-50 border-purple-500 text-purple-600' : 'bg-gray-50 border-gray-300 text-gray-700'} transition-all rounded-xl`}>
              <Grid className="h-5 w-5 mr-2" />
              Posts
            </Button>
            <Link href="/coding-profile">
              <Button variant="outline" className="w-full bg-gray-50 border-gray-300 text-gray-700 transition-all rounded-xl">
                <Code className="h-5 w-5 mr-2" />
                Coding
              </Button>
            </Link>
            <Button onClick={() => setActiveTab('achievements')} variant="outline" className={`w-full ${activeTab === 'achievements' ? 'bg-purple-50 border-purple-500 text-purple-600' : 'bg-gray-50 border-gray-300 text-gray-700'} transition-all rounded-xl`}>
              <Trophy className="h-5 w-5 mr-2" />
              Achievements
            </Button>
            <Button onClick={() => setActiveTab('saved')} variant="outline" className={`w-full ${activeTab === 'saved' ? 'bg-purple-50 border-purple-500 text-purple-600' : 'bg-gray-50 border-gray-300 text-gray-700'} transition-all rounded-xl`}>
              <Bookmark className="h-5 w-5 mr-2" />
              Saved
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all">
          {activeTab === 'posts' && (
            loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map((post: any) => (
                  <div key={post.id} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar className="h-10 w-10 ring-2 ring-purple-500">
                        <AvatarImage src={post.user.profile?.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
                          {post.user.profile?.name?.[0] || post.user.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{post.user.profile?.name || post.user.username}</p>
                        <p className="text-sm text-gray-500">{formatTimeAgo(new Date(post.createdAt))}</p>
                      </div>
                    </div>
                    {post.content && <p className="text-gray-900 mb-4">{post.content}</p>}
                    {post.media && post.media.length > 0 && (
                      <div className="mb-4 grid gap-2 rounded-lg overflow-hidden">
                        {post.media.map((media: any) => (
                          <img key={media.id} src={media.url} alt="Post media" className="w-full rounded-lg" />
                        ))}
                      </div>
                    )}
                    {post.code && (
                      <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
                        <CodeViewer code={post.code} language={post.language || 'javascript'} />
                      </div>
                    )}
                    <div className="flex items-center space-x-6 text-gray-500">
                      <button className="flex items-center space-x-2 hover:text-purple-600">
                        <Heart className="h-5 w-5" />
                        <span>{post._count.likes}</span>
                      </button>
                      <button className="flex items-center space-x-2 hover:text-purple-600">
                        <MessageCircle className="h-5 w-5" />
                        <span>{post._count.comments}</span>
                      </button>
                      <button className="flex items-center space-x-2 hover:text-purple-600">
                        <Share className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <Grid className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No posts yet</p>
              </div>
            )
          )}
          {activeTab === 'achievements' && (
            <div className="text-center text-gray-500 py-12">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No achievements yet</p>
            </div>
          )}
          {activeTab === 'saved' && (
            <div className="text-center text-gray-500 py-12">
              <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No saved posts yet</p>
            </div>
          )}
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                <div className="flex items-center space-x-4">
                  {editForm.avatar && (
                    <Avatar className="h-20 w-20 ring-2 ring-purple-500">
                      <AvatarImage src={editForm.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white text-2xl">
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
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      {uploading ? 'Uploading...' : 'Choose Image'}
                    </label>
                    <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF (max 5MB)</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma separated)</label>
                <input
                  type="text"
                  value={editForm.skills}
                  onChange={(e) => setEditForm({ ...editForm, skills: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="JavaScript, React, Node.js"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="New York, USA"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <Button onClick={() => setShowEditModal(false)} variant="outline" className="border-gray-300 text-gray-700 rounded-xl">
                Cancel
              </Button>
              <Button onClick={handleEditProfile} disabled={saving} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all">
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Followers Modal */}
      {showFollowersModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Followers</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowFollowersModal(false)}
                className="hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {loadingFollowers ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                </div>
              ) : followers.length > 0 ? (
                <div className="space-y-3">
                  {followers.map((follower) => (
                    <div key={follower.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                      <a href={`/profile/${follower.username}`} className="flex items-center space-x-3 flex-1">
                        <Avatar className="h-12 w-12 ring-2 ring-purple-500">
                          <AvatarImage src={follower.profile?.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold">
                            {follower.profile?.name?.[0] || follower.username[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-gray-900">{follower.profile?.name || follower.username}</p>
                          <p className="text-sm text-gray-500">@{follower.username}</p>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No followers yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Following</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowFollowingModal(false)}
                className="hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {loadingFollowing ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                </div>
              ) : following.length > 0 ? (
                <div className="space-y-3">
                  {following.map((followedUser) => (
                    <div key={followedUser.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                      <a href={`/profile/${followedUser.username}`} className="flex items-center space-x-3 flex-1">
                        <Avatar className="h-12 w-12 ring-2 ring-purple-500">
                          <AvatarImage src={followedUser.profile?.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold">
                            {followedUser.profile?.name?.[0] || followedUser.username[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-gray-900">{followedUser.profile?.name || followedUser.username}</p>
                          <p className="text-sm text-gray-500">@{followedUser.username}</p>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Not following anyone yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
