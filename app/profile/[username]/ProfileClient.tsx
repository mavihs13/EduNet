'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Edit, MapPin, Calendar, UserPlus, MessageCircle, Code, Trophy, Star, Target, Zap, Award, Github, ExternalLink } from 'lucide-react'
import { formatTimeAgo } from '@/lib/utils'
import CodeViewer from '@/components/CodeViewer'

interface ProfileClientProps {
  user: any
  friendCount: number
}

export default function ProfileClient({ user, friendCount }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(user.profile || {})
  const [codingProfile, setCodingProfile] = useState<any>(null)
  const [achievements, setAchievements] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('posts')

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="text-2xl">
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
                    <h1 className="text-2xl font-bold">{profile.name || user.username}</h1>
                    <p className="text-gray-600">@{user.username}</p>
                    {profile.bio && <p className="mt-2">{profile.bio}</p>}
                    
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                      {profile.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {profile.location}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 mt-4">
                      <span><strong>{user._count.posts}</strong> Posts</span>
                      <span><strong>{friendCount}</strong> Friends</span>
                    </div>

                    {profile.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {profile.skills.map((skill: string) => (
                          <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave}>Save</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline">
                      <UserPlus className="h-4 w-4 mr-1" />
                      Add Friend
                    </Button>
                    <Button variant="outline">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'posts' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setActiveTab('coding')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'coding' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Coding Profile
          </button>
        </div>

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
          {user.posts.map((post: any) => (
            <Card key={post.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={post.user.profile?.avatar} />
                    <AvatarFallback>
                      {post.user.profile?.name?.[0] || post.user.username[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{post.user.profile?.name || post.user.username}</p>
                    <p className="text-sm text-gray-500">@{post.user.username}</p>
                    <p className="text-xs text-gray-400">{formatTimeAgo(new Date(post.createdAt))}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {post.content && <p className="mb-4">{post.content}</p>}
                
                {post.code && (
                  <div className="mb-4">
                    <CodeViewer code={post.code} language={post.language || 'javascript'} />
                  </div>
                )}

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          </div>
        )}

        {/* Coding Profile Tab */}
        {activeTab === 'coding' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{codingProfile?.totalProblems || 0}</p>
                  <p className="text-sm text-gray-600">Problems Solved</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Zap className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{codingProfile?.streak || 0}</p>
                  <p className="text-sm text-gray-600">Day Streak</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{codingProfile?.contestRating || 0}</p>
                  <p className="text-sm text-gray-600">Contest Rating</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{achievements.length}</p>
                  <p className="text-sm text-gray-600">Achievements</p>
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
      </div>
    </div>
  )
}