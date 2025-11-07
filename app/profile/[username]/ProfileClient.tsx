'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Edit, MapPin, Calendar, UserPlus, MessageCircle } from 'lucide-react'
import { formatTimeAgo } from '@/lib/utils'
import CodeViewer from '@/components/CodeViewer'

interface ProfileClientProps {
  user: any
  friendCount: number
}

export default function ProfileClient({ user, friendCount }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(user.profile || {})

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

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Posts</h2>
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
      </div>
    </div>
  )
}