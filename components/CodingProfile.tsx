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
      {isOwnProfile && (
        <div className="flex justify-end mb-4">
          <Button 
            onClick={() => setShowEditModal(true)} 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all">
          <Target className="h-8 w-8 text-green-600 mb-3" />
          <p className="text-2xl font-bold text-gray-900 mb-1">{(codingProfile?.easyProblems || 0) + (codingProfile?.mediumProblems || 0) + (codingProfile?.hardProblems || 0)}</p>
          <p className="text-sm text-gray-600">Problems Solved</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all">
          <Zap className="h-8 w-8 text-orange-600 mb-3" />
          <p className="text-2xl font-bold text-gray-900 mb-1">{codingProfile?.streak || 0}</p>
          <p className="text-sm text-gray-600">Day Streak</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all">
          <Trophy className="h-8 w-8 text-yellow-600 mb-3" />
          <p className="text-2xl font-bold text-gray-900 mb-1">{codingProfile?.contestRating || 0}</p>
          <p className="text-sm text-gray-600">Contest Rating</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all">
          <Star className="h-8 w-8 text-purple-600 mb-3" />
          <p className="text-2xl font-bold text-gray-900 mb-1">{achievements.length}</p>
          <p className="text-sm text-gray-600">Achievements</p>
        </div>
      </div>

      {/* Problem Breakdown */}
      {codingProfile && (codingProfile.easyProblems > 0 || codingProfile.mediumProblems > 0 || codingProfile.hardProblems > 0) && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Problem Breakdown</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600 mb-1">{codingProfile.easyProblems}</div>
              <div className="text-sm font-medium text-green-700 mb-2">Easy</div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: `${Math.min((codingProfile.easyProblems / 1000) * 100, 100)}%`}}></div>
              </div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600 mb-1">{codingProfile.mediumProblems}</div>
              <div className="text-sm font-medium text-yellow-700 mb-2">Medium</div>
              <div className="w-full bg-yellow-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${Math.min((codingProfile.mediumProblems / 800) * 100, 100)}%`}}></div>
              </div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600 mb-1">{codingProfile.hardProblems}</div>
              <div className="text-sm font-medium text-red-700 mb-2">Hard</div>
              <div className="w-full bg-red-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{width: `${Math.min((codingProfile.hardProblems / 500) * 100, 100)}%`}}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Platforms */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Coding Platforms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {codingProfile?.githubUsername && (
              <a 
                href={codingProfile.githubUsername}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
              >
                <Github className="h-5 w-5 mr-3 text-gray-700" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm">GitHub</div>
                  <div className="text-xs text-gray-600 truncate">{codingProfile.githubUsername}</div>
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>
            )}
            
            {codingProfile?.leetcodeUsername && (
              <a 
                href={codingProfile.leetcodeUsername}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 bg-orange-50 rounded-lg border border-orange-200 hover:border-orange-300 hover:shadow-md transition-all"
              >
                <Code className="h-5 w-5 mr-3 text-orange-600" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm">LeetCode</div>
                  <div className="text-xs text-orange-700 truncate">{codingProfile.leetcodeUsername}</div>
                </div>
                <ExternalLink className="h-4 w-4 text-orange-400" />
              </a>
            )}
            
            {codingProfile?.codeforcesUsername && (
              <a 
                href={codingProfile.codeforcesUsername}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <Trophy className="h-5 w-5 mr-3 text-blue-600" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm">Codeforces</div>
                  <div className="text-xs text-blue-700 truncate">{codingProfile.codeforcesUsername}</div>
                </div>
                <ExternalLink className="h-4 w-4 text-blue-400" />
              </a>
            )}
            
            {codingProfile?.hackerrankUsername && (
              <a 
                href={codingProfile.hackerrankUsername}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 bg-green-50 rounded-lg border border-green-200 hover:border-green-300 hover:shadow-md transition-all"
              >
                <Star className="h-5 w-5 mr-3 text-green-600" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm">HackerRank</div>
                  <div className="text-xs text-green-700 truncate">{codingProfile.hackerrankUsername}</div>
                </div>
                <ExternalLink className="h-4 w-4 text-green-400" />
              </a>
            )}
        </div>
      </div>

      {/* Languages */}
      {getLanguages().length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Programming Languages</h3>
          <div className="flex flex-wrap gap-2">
            {getLanguages().map((lang: string, index: number) => (
              <span key={index} className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium border border-purple-200">
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Achievements</h3>
          {isOwnProfile && (
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg"
              onClick={() => setShowAchievementModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          )}
        </div>
        <div>
          {achievements.length > 0 ? (
            <div className="space-y-3">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(achievement.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                      {achievement.type}
                    </span>
                    {isOwnProfile && (
                      <button
                        onClick={() => handleEditAchievement(achievement)}
                        className="p-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No achievements yet</p>
              <p className="text-gray-400 text-sm mt-1">Start coding and add your first achievement</p>
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