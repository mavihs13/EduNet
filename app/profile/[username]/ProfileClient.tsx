'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Edit, MapPin, Calendar, UserPlus, MessageCircle, Code, Trophy, Star, Target, Zap, Award, Github, ExternalLink, ArrowLeft, UserMinus, Ban, MoreVertical, UserCheck, X } from 'lucide-react'
import { formatTimeAgo } from '@/lib/utils'
import CodeViewer from '@/components/CodeViewer'

interface ProfileClientProps {
  user: any
  friendCount: number
  followersCount: number
  followingCount: number
  isOwnProfile: boolean
  isFollowing: boolean
}

export default function ProfileClient({ user, friendCount, followersCount, followingCount, isOwnProfile, isFollowing: initialFollowing }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(user.profile || {})
  const [codingProfile, setCodingProfile] = useState<any>(null)
  const [achievements, setAchievements] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('posts')
  const [isFollowing, setIsFollowing] = useState(initialFollowing)
  const [showMenu, setShowMenu] = useState(false)
  const [showFollowersModal, setShowFollowersModal] = useState(false)
  const [showFollowingModal, setShowFollowingModal] = useState(false)
  const [followers, setFollowers] = useState<any[]>([])
  const [following, setFollowing] = useState<any[]>([])
  const [loadingFollowers, setLoadingFollowers] = useState(false)
  const [loadingFollowing, setLoadingFollowing] = useState(false)

  useEffect(() => {
    fetchCodingProfile()
    fetchAchievements()
  }, [user.id])

  const fetchCodingProfile = async () => {
    try {
      const res = await fetch(`/api/coding-profile?userId=${user.id}`)
      const data = await res.json()
      setCodingProfile(data)
    } catch (error) {
      console.error('Failed to fetch coding profile:', error)
      setCodingProfile(null)
    }
  }

  const fetchAchievements = async () => {
    try {
      const res = await fetch(`/api/achievements?userId=${user.id}`)
      const data = await res.json()
      setAchievements(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch achievements:', error)
      setAchievements([])
    }
  }

  const handleSave = async () => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      
      if (res.ok) {
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const getLanguages = () => {
    if (!codingProfile?.languages) return []
    try {
      return JSON.parse(codingProfile.languages)
    } catch {
      return codingProfile.languages.split(',').map((lang: string) => lang.trim())
    }
  }

  const handleFollow = async () => {
    try {
      const res = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followingId: user.id })
      })
      if (res.ok) {
        const data = await res.json()
        setIsFollowing(data.following)
      }
    } catch (error) {
      console.error('Follow failed:', error)
    }
  }

  const handleBlock = async () => {
    if (!confirm(`Are you sure you want to block @${user.username}?`)) return
    try {
      const res = await fetch('/api/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockedUserId: user.id })
      })
      if (res.ok) {
        alert('User blocked successfully')
        window.location.href = '/feed'
      }
    } catch (error) {
      console.error('Block failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Back Button */}
      {!isOwnProfile && (
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Profile Header Card */}
        <Card className="mb-6 border-0 shadow-xl bg-white dark:bg-gray-800 transition-colors duration-300">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-6">
              <Avatar className="w-28 h-28 ring-4 ring-purple-500/20 dark:ring-purple-500/30 shadow-lg">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="text-3xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold">
                  {profile.name?.[0] || user.username[0]}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      placeholder="Name"
                      value={profile.name || ''}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                    <Textarea
                      placeholder="Bio"
                      value={profile.bio || ''}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    />
                    <Input
                      placeholder="Location"
                      value={profile.location || ''}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    />
                    <Input
                      placeholder="Skills (comma separated)"
                      value={profile.skills?.join(', ') || ''}
                      onChange={(e) => setProfile({ 
                        ...profile, 
                        skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      })}
                    />
                  </div>
                ) : (
                  <div>
                    <div className="mb-4">
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{profile.name || user.username}</h1>
                      <p className="text-base text-gray-500 dark:text-gray-400">@{user.username}</p>
                    </div>
                    
                    {profile.bio && (
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 max-w-2xl">{profile.bio}</p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      {profile.location && (
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-2">
                            <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <span className="text-sm font-medium">{profile.location}</span>
                        </div>
                      )}
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg mr-2">
                          <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium">Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{user._count.posts}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Posts</p>
                      </div>
                      <div className="w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
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
                        className="text-center hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
                      >
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{followersCount}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Followers</p>
                      </button>
                      <div className="w-px h-12 bg-gray-200 dark:bg-gray-700"></div>
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
                        className="text-center hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
                      >
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{followingCount}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Following</p>
                      </button>
                    </div>

                    {profile.skills && (
                      <div className="flex flex-wrap gap-2">
                        {(typeof profile.skills === 'string' 
                          ? profile.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
                          : profile.skills
                        ).map((skill: string) => (
                          <span key={skill} className="bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium border border-purple-200 dark:border-purple-700">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3">
                {isOwnProfile ? (
                  isEditing ? (
                    <>
                      <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">Save</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )
                ) : (
                  <>
                    <Button 
                      onClick={handleFollow}
                      className={isFollowing 
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600" 
                        : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                      }
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="h-4 w-4 mr-2" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Follow
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={() => {
                        localStorage.setItem('openChat', JSON.stringify({ userId: user.id, username: user.username, name: profile.name || user.username, avatar: profile.avatar }))
                        window.location.href = '/feed'
                      }}
                      variant="outline" 
                      className="border-purple-600 text-purple-600 hover:bg-purple-50 dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-900/20"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <div className="relative">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => setShowMenu(!showMenu)}
                        className="border-gray-300 dark:border-gray-600"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                      {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 py-2 z-10">
                          <button
                            onClick={() => {
                              handleBlock()
                              setShowMenu(false)
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 text-red-600 dark:text-red-400"
                          >
                            <Ban className="h-4 w-4" />
                            <span>Block User</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 mb-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'posts' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              📝 Posts
            </button>
            <button
              onClick={() => setActiveTab('coding')}
              className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === 'coding' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              💻 Coding Profile
            </button>
          </div>
        </div>

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {user.posts.length > 0 ? (
              user.posts.map((post: any) => (
                <Card key={post.id} className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800">
                  <CardHeader className="pb-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12 ring-2 ring-purple-500">
                        <AvatarImage src={post.user.profile?.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold">
                          {post.user.profile?.name?.[0] || post.user.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{post.user.profile?.name || post.user.username}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">@{post.user.username} • {formatTimeAgo(new Date(post.createdAt))}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {post.content && <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">{post.content}</p>}
                    
                    {post.code && (
                      <div className="mb-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <CodeViewer code={post.code} language={post.language || 'javascript'} />
                      </div>
                    )}

                    {post.tags && (
                      <div className="flex flex-wrap gap-2">
                        {(typeof post.tags === 'string' 
                          ? post.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
                          : post.tags
                        ).map((tag: string) => (
                          <span key={tag} className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-700">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-gray-900 dark:text-white font-semibold text-lg mb-2">No posts yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Start sharing your coding journey!</p>
              </div>
            )}
          </div>
        )}

        {/* Coding Profile Tab */}
        {activeTab === 'coding' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Target className="h-7 w-7 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{codingProfile?.totalProblems || 0}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Problems Solved</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Zap className="h-7 w-7 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{codingProfile?.streak || 0}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Day Streak</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Trophy className="h-7 w-7 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{codingProfile?.contestRating || 0}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Contest Rating</p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Star className="h-7 w-7 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{achievements.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Achievements</p>
                </CardContent>
              </Card>
            </div>

            {/* Problem Breakdown */}
            {codingProfile && (codingProfile.easyProblems > 0 || codingProfile.mediumProblems > 0 || codingProfile.hardProblems > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Problem Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-500">{codingProfile.easyProblems}</div>
                      <div className="text-sm text-gray-600">Easy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-500">{codingProfile.mediumProblems}</div>
                      <div className="text-sm text-gray-600">Medium</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-500">{codingProfile.hardProblems}</div>
                      <div className="text-sm text-gray-600">Hard</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Platforms */}
            {codingProfile && (codingProfile.githubUsername || codingProfile.leetcodeUsername || codingProfile.codeforcesUsername || codingProfile.hackerrankUsername) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="h-5 w-5 mr-2" />
                    Coding Platforms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {codingProfile.githubUsername && (
                      <a 
                        href={`https://github.com/${codingProfile.githubUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Github className="h-5 w-5 mr-3" />
                        <div>
                          <div className="font-medium">GitHub</div>
                          <div className="text-sm text-gray-600">@{codingProfile.githubUsername}</div>
                        </div>
                        <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                      </a>
                    )}
                    
                    {codingProfile.leetcodeUsername && (
                      <a 
                        href={`https://leetcode.com/${codingProfile.leetcodeUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Code className="h-5 w-5 mr-3 text-orange-500" />
                        <div>
                          <div className="font-medium">LeetCode</div>
                          <div className="text-sm text-gray-600">@{codingProfile.leetcodeUsername}</div>
                        </div>
                        <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                      </a>
                    )}
                    
                    {codingProfile.codeforcesUsername && (
                      <a 
                        href={`https://codeforces.com/profile/${codingProfile.codeforcesUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Trophy className="h-5 w-5 mr-3 text-blue-500" />
                        <div>
                          <div className="font-medium">Codeforces</div>
                          <div className="text-sm text-gray-600">@{codingProfile.codeforcesUsername}</div>
                        </div>
                        <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                      </a>
                    )}
                    
                    {codingProfile.hackerrankUsername && (
                      <a 
                        href={`https://www.hackerrank.com/${codingProfile.hackerrankUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Star className="h-5 w-5 mr-3 text-green-500" />
                        <div>
                          <div className="font-medium">HackerRank</div>
                          <div className="text-sm text-gray-600">@{codingProfile.hackerrankUsername}</div>
                        </div>
                        <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Languages */}
            {getLanguages().length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Programming Languages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {getLanguages().map((lang: string, index: number) => (
                      <Badge key={index} variant="secondary">{lang}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                {achievements.length > 0 ? (
                  <div className="grid gap-4">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center p-3 border rounded-lg">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
                          <Trophy className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(achievement.earnedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline">{achievement.type}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No achievements yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Followers Modal */}
        {showFollowersModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md shadow-2xl max-h-[80vh] overflow-hidden transition-colors duration-300">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Followers</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowFollowersModal(false)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
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
                      <div key={follower.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
                        <a href={`/profile/${follower.username}`} className="flex items-center space-x-3 flex-1">
                          <Avatar className="h-12 w-12 ring-2 ring-purple-500">
                            <AvatarImage src={follower.profile?.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold">
                              {follower.profile?.name?.[0] || follower.username[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{follower.profile?.name || follower.username}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">@{follower.username}</p>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
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
            <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md shadow-2xl max-h-[80vh] overflow-hidden transition-colors duration-300">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Following</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowFollowingModal(false)}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
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
                      <div key={followedUser.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
                        <a href={`/profile/${followedUser.username}`} className="flex items-center space-x-3 flex-1">
                          <Avatar className="h-12 w-12 ring-2 ring-purple-500">
                            <AvatarImage src={followedUser.profile?.avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white font-bold">
                              {followedUser.profile?.name?.[0] || followedUser.username[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{followedUser.profile?.name || followedUser.username}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">@{followedUser.username}</p>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Not following anyone yet
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}