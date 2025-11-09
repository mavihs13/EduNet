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
  const [showAchievementModal, setShowAchievementModal] = useState(false)
  const [showEditAchievementModal, setShowEditAchievementModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [creatingAchievement, setCreatingAchievement] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState(false)
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null)
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
  const [achievementData, setAchievementData] = useState({
    title: '',
    description: '',
    type: 'custom',
    badge: ''
  })
  const [editAchievementData, setEditAchievementData] = useState({
    title: '',
    description: '',
    type: 'custom',
    badge: ''
  })

  useEffect(() => {
    fetchCodingProfile()
    fetchAchievements()
  }, [user.id])

  const fetchCodingProfile = async () => {
    try {
      const res = await fetch(`/api/coding-profile?userId=${user.id}`)
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

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const payload = {
        githubUsername: editData.githubUsername || '',
        leetcodeUsername: editData.leetcodeUsername || '',
        codeforcesUsername: editData.codeforcesUsername || '',
        hackerrankUsername: editData.hackerrankUsername || '',
        easyProblems: Number(editData.easyProblems) || 0,
        mediumProblems: Number(editData.mediumProblems) || 0,
        hardProblems: Number(editData.hardProblems) || 0,
        contestRating: Number(editData.contestRating) || 0,
        streak: Number(editData.streak) || 0,
        languages: editData.languages || ''
      }
      
      console.log('Saving payload:', payload)
      
      const res = await fetch('/api/coding-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      console.log('Response status:', res.status)
      const responseData = await res.json()
      console.log('Response data:', responseData)
      
      if (res.ok) {
        await fetchCodingProfile()
        setShowEditModal(false)
      } else {
        console.error('Save error:', responseData)
      }
    } catch (error) {
      console.error('Failed to save coding profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleCreateAchievement = async () => {
    if (!achievementData.title.trim() || !achievementData.description.trim()) {
      return
    }
    
    setCreatingAchievement(true)
    try {
      const payload = {
        title: achievementData.title.trim(),
        description: achievementData.description.trim(),
        type: achievementData.type,
        badge: achievementData.badge || null
      }
      
      const res = await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (res.ok) {
        await fetchAchievements()
        setShowAchievementModal(false)
        setAchievementData({ title: '', description: '', type: 'custom', badge: '' })
      }
    } catch (error) {
      console.error('Failed to create achievement:', error)
    } finally {
      setCreatingAchievement(false)
    }
  }

  const handleEditAchievement = (achievement: any) => {
    setSelectedAchievement(achievement)
    setEditAchievementData({
      title: achievement.title,
      description: achievement.description,
      type: achievement.type,
      badge: achievement.badge || ''
    })
    setShowEditAchievementModal(true)
  }

  const handleUpdateAchievement = async () => {
    if (!editAchievementData.title.trim() || !editAchievementData.description.trim()) {
      return
    }
    
    setEditingAchievement(true)
    try {
      const payload = {
        title: editAchievementData.title.trim(),
        description: editAchievementData.description.trim(),
        type: editAchievementData.type,
        badge: editAchievementData.badge || null
      }
      
      const res = await fetch(`/api/achievements/${selectedAchievement.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      if (res.ok) {
        await fetchAchievements()
        setShowEditAchievementModal(false)
        setSelectedAchievement(null)
      }
    } catch (error) {
      console.error('Failed to update achievement:', error)
    } finally {
      setEditingAchievement(false)
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
            <Code className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Coding Profile
            </h2>
            <p className="text-gray-500 text-sm">Showcase your coding journey 🚀</p>
          </div>
        </div>
        {isOwnProfile && (
          <Button 
            onClick={() => {
              console.log('Edit button clicked')
              setShowEditModal(true)
            }} 
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            size="sm"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <Target className="h-10 w-10" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Total</span>
          </div>
          <p className="text-3xl font-bold mb-1">{(codingProfile?.easyProblems || 0) + (codingProfile?.mediumProblems || 0) + (codingProfile?.hardProblems || 0)}</p>
          <p className="text-sm opacity-90">Problems Solved</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <Zap className="h-10 w-10" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">🔥</span>
          </div>
          <p className="text-3xl font-bold mb-1">{codingProfile?.streak || 0}</p>
          <p className="text-sm opacity-90">Day Streak</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <Trophy className="h-10 w-10" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Rating</span>
          </div>
          <p className="text-3xl font-bold mb-1">{codingProfile?.contestRating || 0}</p>
          <p className="text-sm opacity-90">Contest Rating</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between mb-3">
            <Star className="h-10 w-10" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">✨</span>
          </div>
          <p className="text-3xl font-bold mb-1">{achievements.length}</p>
          <p className="text-sm opacity-90">Achievements</p>
        </div>
      </div>

      {/* Problem Breakdown */}
      {codingProfile && (codingProfile.easyProblems > 0 || codingProfile.mediumProblems > 0 || codingProfile.hardProblems > 0) && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mr-3">
              <Target className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Problem Breakdown</h3>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">{codingProfile.easyProblems}</div>
              <div className="text-sm font-medium text-green-700 mb-1">Easy</div>
              <div className="text-xs text-green-600 mb-2">{codingProfile.easyProblems}/1000</div>
              <div className="w-full bg-green-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full transition-all duration-500" style={{width: `${Math.min((codingProfile.easyProblems / 1000) * 100, 100)}%`}}></div>
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{codingProfile.mediumProblems}</div>
              <div className="text-sm font-medium text-yellow-700 mb-1">Medium</div>
              <div className="text-xs text-yellow-600 mb-2">{codingProfile.mediumProblems}/800</div>
              <div className="w-full bg-yellow-200 rounded-full h-3">
                <div className="bg-yellow-500 h-3 rounded-full transition-all duration-500" style={{width: `${Math.min((codingProfile.mediumProblems / 800) * 100, 100)}%`}}></div>
              </div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200">
              <div className="text-3xl font-bold text-red-600 mb-2">{codingProfile.hardProblems}</div>
              <div className="text-sm font-medium text-red-700 mb-1">Hard</div>
              <div className="text-xs text-red-600 mb-2">{codingProfile.hardProblems}/500</div>
              <div className="w-full bg-red-200 rounded-full h-3">
                <div className="bg-red-500 h-3 rounded-full transition-all duration-500" style={{width: `${Math.min((codingProfile.hardProblems / 500) * 100, 100)}%`}}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Platforms */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg mr-3">
            <GitBranch className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Coding Platforms</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {codingProfile?.githubUsername && (
              <a 
                href={codingProfile.githubUsername}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Github className="h-6 w-6 mr-4 text-white" />
                <div className="flex-1">
                  <div className="font-semibold text-white">GitHub</div>
                  <div className="text-sm text-gray-300 truncate">{codingProfile.githubUsername}</div>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400" />
              </a>
            )}
            
            {codingProfile?.leetcodeUsername && (
              <a 
                href={codingProfile.leetcodeUsername}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl hover:from-orange-400 hover:to-red-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Code className="h-6 w-6 mr-4 text-white" />
                <div className="flex-1">
                  <div className="font-semibold text-white">LeetCode</div>
                  <div className="text-sm text-orange-100 truncate">{codingProfile.leetcodeUsername}</div>
                </div>
                <ExternalLink className="h-5 w-5 text-orange-200" />
              </a>
            )}
            
            {codingProfile?.codeforcesUsername && (
              <a 
                href={codingProfile.codeforcesUsername}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Trophy className="h-6 w-6 mr-4 text-white" />
                <div className="flex-1">
                  <div className="font-semibold text-white">Codeforces</div>
                  <div className="text-sm text-blue-100 truncate">{codingProfile.codeforcesUsername}</div>
                </div>
                <ExternalLink className="h-5 w-5 text-blue-200" />
              </a>
            )}
            
            {codingProfile?.hackerrankUsername && (
              <a 
                href={codingProfile.hackerrankUsername}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Star className="h-6 w-6 mr-4 text-white" />
                <div className="flex-1">
                  <div className="font-semibold text-white">HackerRank</div>
                  <div className="text-sm text-green-100 truncate">{codingProfile.hackerrankUsername}</div>
                </div>
                <ExternalLink className="h-5 w-5 text-green-200" />
              </a>
            )}
        </div>
      </div>

      {/* Languages */}
      {getLanguages().length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg mr-3">
              <Code className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Programming Languages</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {getLanguages().map((lang: string, index: number) => (
              <span key={index} className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg mr-3">
              <Award className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Achievements</h3>
          </div>
          {isOwnProfile && (
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => {
                console.log('Add achievement button clicked')
                setShowAchievementModal(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Achievement
            </Button>
          )}
        </div>
        <div>
          {achievements.length > 0 ? (
            <div className="grid gap-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:scale-102">
                  <div className="w-14 h-14 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                    <Trophy className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-lg">{achievement.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    <p className="text-xs text-gray-500">
                      🏆 Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-medium shadow-lg">
                      {achievement.type}
                    </span>
                    {isOwnProfile && (
                      <button
                        onClick={() => handleEditAchievement(achievement)}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">No achievements yet</p>
              <p className="text-gray-400 text-sm">Start coding and unlock your first achievement! 🚀</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mr-4">
                  <Edit3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Edit Coding Profile</h3>
                  <p className="text-gray-500 text-sm">Update your coding journey ✨</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <GitBranch className="h-5 w-5 mr-2 text-purple-500" />
                      Platform URLs
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <Github className="h-4 w-4 mr-2" />
                          GitHub Profile URL
                        </label>
                        <input
                          type="url"
                          value={editData.githubUsername}
                          onChange={(e) => setEditData({...editData, githubUsername: e.target.value})}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors bg-white"
                          placeholder="https://github.com/your-username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <Code className="h-4 w-4 mr-2 text-orange-500" />
                          LeetCode Profile URL
                        </label>
                        <input
                          type="url"
                          value={editData.leetcodeUsername}
                          onChange={(e) => setEditData({...editData, leetcodeUsername: e.target.value})}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors bg-white"
                          placeholder="https://leetcode.com/your-username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <Trophy className="h-4 w-4 mr-2 text-blue-500" />
                          Codeforces Profile URL
                        </label>
                        <input
                          type="url"
                          value={editData.codeforcesUsername}
                          onChange={(e) => setEditData({...editData, codeforcesUsername: e.target.value})}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
                          placeholder="https://codeforces.com/profile/your-username"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <Star className="h-4 w-4 mr-2 text-green-500" />
                          HackerRank Profile URL
                        </label>
                        <input
                          type="url"
                          value={editData.hackerrankUsername}
                          onChange={(e) => setEditData({...editData, hackerrankUsername: e.target.value})}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-white"
                          placeholder="https://www.hackerrank.com/your-username"
                        />
                      </div>
                    </div>
                  </div>
                
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <Target className="h-5 w-5 mr-2 text-blue-500" />
                      Problem Statistics
                    </h4>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold text-green-700 mb-2">🟢 Easy Problems</label>
                        <input
                          type="text"
                          value={editData.easyProblems}
                          onChange={(e) => setEditData({...editData, easyProblems: parseInt(e.target.value) || 0})}
                          className="w-full p-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-white"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-yellow-700 mb-2">🟡 Medium Problems</label>
                        <input
                          type="text"
                          value={editData.mediumProblems}
                          onChange={(e) => setEditData({...editData, mediumProblems: parseInt(e.target.value) || 0})}
                          className="w-full p-3 border-2 border-yellow-200 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors bg-white"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-red-700 mb-2">🔴 Hard Problems</label>
                        <input
                          type="text"
                          value={editData.hardProblems}
                          onChange={(e) => setEditData({...editData, hardProblems: parseInt(e.target.value) || 0})}
                          className="w-full p-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:outline-none transition-colors bg-white"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                          Contest Rating
                        </label>
                        <input
                          type="text"
                          value={editData.contestRating}
                          onChange={(e) => setEditData({...editData, contestRating: parseInt(e.target.value) || 0})}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors bg-white"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <Zap className="h-4 w-4 mr-2 text-orange-500" />
                          Current Streak (days)
                        </label>
                        <input
                          type="text"
                          value={editData.streak}
                          onChange={(e) => setEditData({...editData, streak: parseInt(e.target.value) || 0})}
                          className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors bg-white"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                      <Code className="h-5 w-5 mr-2 text-pink-500" />
                      Programming Languages
                    </h4>
                    <input
                      type="text"
                      value={editData.languages}
                      onChange={(e) => setEditData({...editData, languages: e.target.value})}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors bg-white"
                      placeholder="JavaScript, Python, Java, C++, React, Node.js"
                    />
                    <p className="text-sm text-gray-600 mt-2 flex items-center">
                      <span className="mr-2">💡</span>
                      Separate multiple languages with commas
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  onClick={() => setShowEditModal(false)} 
                  disabled={saving}
                  className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-colors"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveProfile} 
                  disabled={saving}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {saving ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="mr-2">💾</span>
                      Save Changes
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Achievement Modal */}
      {showAchievementModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl mr-4">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Add Achievement</h3>
                  <p className="text-gray-500 text-sm">Celebrate your coding milestone 🏆</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <span className="mr-2">🎯</span>
                        Achievement Title
                      </label>
                      <input
                        type="text"
                        value={achievementData.title}
                        onChange={(e) => setAchievementData({...achievementData, title: e.target.value})}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors bg-white"
                        placeholder="e.g., Solved 100 LeetCode Problems"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <span className="mr-2">📝</span>
                        Description
                      </label>
                      <textarea
                        value={achievementData.description}
                        onChange={(e) => setAchievementData({...achievementData, description: e.target.value})}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl h-24 resize-none focus:border-yellow-500 focus:outline-none transition-colors bg-white"
                        placeholder="Describe your achievement and what it means to you..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <span className="mr-2">🏷️</span>
                        Category
                      </label>
                      <select
                        value={achievementData.type}
                        onChange={(e) => setAchievementData({...achievementData, type: e.target.value})}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors bg-white"
                      >
                        <option value="custom">🎨 Custom</option>
                        <option value="leetcode">🧩 LeetCode</option>
                        <option value="github">🐙 GitHub</option>
                        <option value="codeforces">🏆 Codeforces</option>
                        <option value="contest">🥇 Contest</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAchievementModal(false)} 
                  disabled={creatingAchievement}
                  className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-colors"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateAchievement}
                  disabled={!achievementData.title || !achievementData.description || creatingAchievement}
                  className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  {creatingAchievement ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="mr-2">🏆</span>
                      Add Achievement
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Achievement Modal */}
      {showEditAchievementModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-gray-100">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mr-4">
                  <Edit3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Edit Achievement</h3>
                  <p className="text-gray-500 text-sm">Update your milestone ✨</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <span className="mr-2">🎯</span>
                        Achievement Title
                      </label>
                      <input
                        type="text"
                        value={editAchievementData.title}
                        onChange={(e) => setEditAchievementData({...editAchievementData, title: e.target.value})}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
                        placeholder="e.g., Solved 100 LeetCode Problems"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <span className="mr-2">📝</span>
                        Description
                      </label>
                      <textarea
                        value={editAchievementData.description}
                        onChange={(e) => setEditAchievementData({...editAchievementData, description: e.target.value})}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl h-24 resize-none focus:border-blue-500 focus:outline-none transition-colors bg-white"
                        placeholder="Describe your achievement and what it means to you..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <span className="mr-2">🏷️</span>
                        Category
                      </label>
                      <select
                        value={editAchievementData.type}
                        onChange={(e) => setEditAchievementData({...editAchievementData, type: e.target.value})}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white"
                      >
                        <option value="custom">🎨 Custom</option>
                        <option value="leetcode">🧩 LeetCode</option>
                        <option value="github">🐙 GitHub</option>
                        <option value="codeforces">🏆 Codeforces</option>
                        <option value="contest">🥇 Contest</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button 
                  onClick={() => setShowEditAchievementModal(false)} 
                  disabled={editingAchievement}
                  className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateAchievement}
                  disabled={!editAchievementData.title || !editAchievementData.description || editingAchievement}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                >
                  {editingAchievement ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span className="mr-2">💾</span>
                      Update Achievement
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}