'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Plus, X, ChevronLeft, ChevronRight, Eye, Camera, Type } from 'lucide-react'

interface Story {
  id: string
  content?: string
  mediaUrl?: string
  mediaType?: string
  createdAt: string
  views: any[]
  _count: { views: number }
}

interface StoryGroup {
  user: any
  stories: Story[]
  hasUnviewed: boolean
}

export default function Stories({ currentUser }: { currentUser: any }) {
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([])
  const [showViewer, setShowViewer] = useState(false)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [currentUserIndex, setCurrentUserIndex] = useState(0)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createContent, setCreateContent] = useState('')
  const [createMedia, setCreateMedia] = useState('')
  const [createType, setCreateType] = useState<'text' | 'image'>('text')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      const res = await fetch('/api/stories')
      if (res.ok) {
        const data = await res.json()
        setStoryGroups(data)
      }
    } catch (error) {
      console.error('Failed to fetch stories:', error)
    }
  }

  const handleCreateStory = async () => {
    try {
      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: createContent,
          mediaUrl: createMedia,
          mediaType: createType === 'image' ? 'image' : null
        })
      })

      if (res.ok) {
        setShowCreateModal(false)
        setCreateContent('')
        setCreateMedia('')
        setCreateType('text')
        fetchStories()
      }
    } catch (error) {
      console.error('Failed to create story:', error)
    }
  }

  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const res = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        const data = await res.json()
        setCreateMedia(data.avatarUrl)
        setCreateType('image')
      }
    } catch (error) {
      console.error('Failed to upload media:', error)
    } finally {
      setUploading(false)
    }
  }

  const openStoryViewer = (userIndex: number) => {
    setCurrentUserIndex(userIndex)
    setCurrentStoryIndex(0)
    setShowViewer(true)
    markStoryAsViewed(storyGroups[userIndex].stories[0].id)
  }

  const markStoryAsViewed = async (storyId: string) => {
    try {
      await fetch('/api/stories/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId })
      })
    } catch (error) {
      console.error('Failed to mark story as viewed:', error)
    }
  }

  const nextStory = () => {
    const currentGroup = storyGroups[currentUserIndex]
    if (currentStoryIndex < currentGroup.stories.length - 1) {
      const newIndex = currentStoryIndex + 1
      setCurrentStoryIndex(newIndex)
      markStoryAsViewed(currentGroup.stories[newIndex].id)
    } else if (currentUserIndex < storyGroups.length - 1) {
      const newUserIndex = currentUserIndex + 1
      setCurrentUserIndex(newUserIndex)
      setCurrentStoryIndex(0)
      markStoryAsViewed(storyGroups[newUserIndex].stories[0].id)
    } else {
      setShowViewer(false)
    }
  }

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1)
    } else if (currentUserIndex > 0) {
      const newUserIndex = currentUserIndex - 1
      setCurrentUserIndex(newUserIndex)
      setCurrentStoryIndex(storyGroups[newUserIndex].stories.length - 1)
    }
  }

  const currentStory = storyGroups[currentUserIndex]?.stories[currentStoryIndex]

  return (
    <>
      <div className="flex space-x-4 p-4 overflow-x-auto">
        {/* Add Story Button */}
        <div className="flex flex-col items-center space-y-2 min-w-[70px]">
          <button
            onClick={() => setShowCreateModal(true)}
            className="relative w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Plus className="h-8 w-8 text-white" />
          </button>
          <span className="text-xs text-white text-center">Your Story</span>
        </div>

        {/* Story Circles */}
        {storyGroups.map((group, index) => (
          <div key={group.user.id} className="flex flex-col items-center space-y-2 min-w-[70px]">
            <button
              onClick={() => openStoryViewer(index)}
              className={`relative w-16 h-16 rounded-full p-0.5 ${
                group.hasUnviewed 
                  ? 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500' 
                  : 'bg-gray-600'
              } hover:scale-105 transition-transform`}
            >
              <Avatar className="w-full h-full border-2 border-black">
                <AvatarImage src={group.user.profile?.avatar} />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                  {group.user.profile?.name?.[0] || group.user.username[0]}
                </AvatarFallback>
              </Avatar>
            </button>
            <span className="text-xs text-white text-center truncate w-16">
              {group.user.profile?.name || group.user.username}
            </span>
          </div>
        ))}
      </div>

      {/* Create Story Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Create Story</h2>
              <button onClick={() => setShowCreateModal(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setCreateType('text')}
                  className={`flex-1 p-3 rounded-xl flex items-center justify-center space-x-2 ${
                    createType === 'text' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100'
                  }`}
                >
                  <Type className="h-5 w-5" />
                  <span>Text</span>
                </button>
                <label className={`flex-1 p-3 rounded-xl flex items-center justify-center space-x-2 cursor-pointer ${
                  createType === 'image' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100'
                }`}>
                  <Camera className="h-5 w-5" />
                  <span>{uploading ? 'Uploading...' : 'Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              {createType === 'image' && createMedia && (
                <div className="relative">
                  <img src={createMedia} alt="Story" className="w-full h-48 object-cover rounded-xl" />
                </div>
              )}

              <textarea
                value={createContent}
                onChange={(e) => setCreateContent(e.target.value)}
                placeholder={createType === 'text' ? 'Share something...' : 'Add a caption...'}
                className="w-full p-3 border rounded-xl resize-none h-24 focus:outline-none focus:border-purple-400"
              />

              <Button
                onClick={handleCreateStory}
                disabled={!createContent.trim() && !createMedia}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white"
              >
                Share Story
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Story Viewer */}
      {showViewer && currentStory && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative w-full h-full max-w-md mx-auto">
            {/* Progress bars */}
            <div className="absolute top-4 left-4 right-4 flex space-x-1 z-10">
              {storyGroups[currentUserIndex].stories.map((_, index) => (
                <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-white transition-all duration-300 ${
                      index < currentStoryIndex ? 'w-full' : 
                      index === currentStoryIndex ? 'w-full animate-pulse' : 'w-0'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="absolute top-12 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={storyGroups[currentUserIndex].user.profile?.avatar} />
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">
                    {storyGroups[currentUserIndex].user.profile?.name?.[0] || storyGroups[currentUserIndex].user.username[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-medium text-sm">
                    {storyGroups[currentUserIndex].user.profile?.name || storyGroups[currentUserIndex].user.username}
                  </p>
                  <p className="text-white/70 text-xs">
                    {new Date(currentStory.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowViewer(false)} className="text-white">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Story Content */}
            <div className="w-full h-full flex items-center justify-center">
              {currentStory.mediaUrl ? (
                <img 
                  src={currentStory.mediaUrl} 
                  alt="Story" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center p-8">
                  <p className="text-white text-xl text-center font-medium">
                    {currentStory.content}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <button 
              onClick={prevStory}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button 
              onClick={nextStory}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
            >
              <ChevronRight className="h-8 w-8" />
            </button>

            {/* Views count */}
            <div className="absolute bottom-4 left-4 flex items-center space-x-1 text-white/70">
              <Eye className="h-4 w-4" />
              <span className="text-sm">{currentStory._count.views}</span>
            </div>

            {/* Tap areas for navigation */}
            <div className="absolute inset-0 flex">
              <div className="w-1/2 h-full" onClick={prevStory} />
              <div className="w-1/2 h-full" onClick={nextStory} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}