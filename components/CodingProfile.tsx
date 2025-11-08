'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Star, Code, GitBranch, Target, Zap, Award, Plus, Edit3, Github, ExternalLink } from 'lucide-react'

interface CodingProfileProps {
  user: any
  isOwnProfile?: boolean
}

export default function CodingProfile({ user, isOwnProfile = false }: CodingProfileProps) {
  const [codingProfile, setCodingProfile] = useState<any>(null)
  const [achievements, setAchievements] = useState<any[]>([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [editData, setEditData] = useState({
    githubUsername: '',
    leetcodeUsername: '',
    codeforcesUsername: '',
    hackerrankUsername: '',
    totalProblems: 0,
    easyProblems: 0,
    mediumProblems: 0,
    hardProblems: 0,
    contestRating: 0,
    streak: 0,
    languages: ''
  })

  useEffect(() => {
    fetchCodingProfile()
    fetchAchievements()
  }, [user.id])

  const fetchCodingProfile = async () => {
    try {
      const res = await fetch(`/api/coding-profile?userId=${user.id}`)
      if (res.ok) {
        const data = await res.json()
        setCodingProfile(data)
        if (data) {
          setEditData({
            githubUsername: data.githubUsername || '',
            leetcodeUsername: data.leetcodeUsername || '',
            codeforcesUsername: data.codeforcesUsername || '',
            hackerrankUsername: data.hackerrankUsername || '',
            totalProblems: data.totalProblems || 0,
            easyProblems: data.easyProblems || 0,
            mediumProblems: data.mediumProblems || 0,
            hardProblems: data.hardProblems || 0,
            contestRating: data.contestRating || 0,
            streak: data.streak || 0,
            languages: data.languages || ''
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch coding profile:', error)
    }
  }

  const fetchAchievements = async () => {
    try {
      const res = await fetch(`/api/achievements?userId=${user.id}`)
      if (res.ok) {
        const data = await res.json()
        setAchievements(data)
      }
    } catch (error) {
      console.error('Failed to fetch achievements:', error)
    }
  }

  const handleSaveProfile = async () => {
    try {
      const res = await fetch('/api/coding-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      })
      
      if (res.ok) {
        await fetchCodingProfile()
        setShowEditModal(false)
      }
    } catch (error) {
      console.error('Failed to save coding profile:', error)
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Code className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-bold">Coding Profile</h2>
        </div>
        {isOwnProfile && (
          <Button onClick={() => setShowEditModal(true)} variant="outline" size="sm">
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <GitBranch className="h-5 w-5 mr-2" />
            Coding Platforms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {codingProfile?.githubUsername && (
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
            
            {codingProfile?.leetcodeUsername && (
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
            
            {codingProfile?.codeforcesUsername && (
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
            
            {codingProfile?.hackerrankUsername && (
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
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Achievements
            </div>
            {isOwnProfile && (
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Achievement
              </Button>
            )}
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Edit Coding Profile</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">GitHub Username</label>
                    <input
                      type="text"
                      value={editData.githubUsername}
                      onChange={(e) => setEditData({...editData, githubUsername: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                      placeholder="your-github-username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">LeetCode Username</label>
                    <input
                      type="text"
                      value={editData.leetcodeUsername}
                      onChange={(e) => setEditData({...editData, leetcodeUsername: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                      placeholder="your-leetcode-username"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Codeforces Username</label>
                    <input
                      type="text"
                      value={editData.codeforcesUsername}
                      onChange={(e) => setEditData({...editData, codeforcesUsername: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                      placeholder="your-codeforces-username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">HackerRank Username</label>
                    <input
                      type="text"
                      value={editData.hackerrankUsername}
                      onChange={(e) => setEditData({...editData, hackerrankUsername: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                      placeholder="your-hackerrank-username"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Easy Problems</label>
                    <input
                      type="number"
                      value={editData.easyProblems}
                      onChange={(e) => setEditData({...editData, easyProblems: parseInt(e.target.value) || 0})}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Medium Problems</label>
                    <input
                      type="number"
                      value={editData.mediumProblems}
                      onChange={(e) => setEditData({...editData, mediumProblems: parseInt(e.target.value) || 0})}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Hard Problems</label>
                    <input
                      type="number"
                      value={editData.hardProblems}
                      onChange={(e) => setEditData({...editData, hardProblems: parseInt(e.target.value) || 0})}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Contest Rating</label>
                    <input
                      type="number"
                      value={editData.contestRating}
                      onChange={(e) => setEditData({...editData, contestRating: parseInt(e.target.value) || 0})}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Programming Languages</label>
                  <input
                    type="text"
                    value={editData.languages}
                    onChange={(e) => setEditData({...editData, languages: e.target.value})}
                    className="w-full p-2 border rounded-lg"
                    placeholder="JavaScript, Python, Java, C++"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile}>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}