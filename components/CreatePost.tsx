'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Image, MapPin, Smile, Calendar, BarChart3, X, Globe, Code2, Sparkles } from 'lucide-react'

interface CreatePostProps {
  user: any
  onPostCreated: (post: any) => void
}

export default function CreatePost({ user, onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = async () => {
    if (!content.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim()
        }),
      })

      if (res.ok) {
        const newPost = await res.json()
        onPostCreated(newPost)
        setContent('')
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'
        }
      }
    } catch (error) {
      console.error('Failed to create post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }

  const characterCount = content.length
  const maxCharacters = 280
  const isOverLimit = characterCount > maxCharacters

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="p-4">
        <div className="flex space-x-3">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarImage src={user.profile?.avatar} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              {user.profile?.name?.[0] || user.username[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            {/* Text Area */}
            <textarea
              ref={textareaRef}
              placeholder="What's happening?"
              value={content}
              onChange={handleTextareaChange}
              className="w-full text-xl placeholder-gray-500 border-none resize-none focus:outline-none bg-transparent min-h-[60px] leading-normal"
              maxLength={maxCharacters + 50} // Allow slight overflow for warning
            />
            
            {/* Media Preview Area */}
            {/* This would show uploaded images/videos */}
            
            {/* Bottom Section */}
            <div className="mt-4">
              {/* Character Count & Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {/* Media Upload */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-500 hover:bg-blue-50 p-2 rounded-full"
                    title="Add photos or video"
                  >
                    <Image className="h-5 w-5" />
                  </Button>
                  
                  {/* GIF */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-500 hover:bg-blue-50 p-2 rounded-full"
                    title="Add GIF"
                  >
                    <span className="text-sm font-bold">GIF</span>
                  </Button>
                  
                  {/* Poll */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-500 hover:bg-blue-50 p-2 rounded-full"
                    title="Create a poll"
                  >
                    <BarChart3 className="h-5 w-5" />
                  </Button>
                  
                  {/* Emoji */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-500 hover:bg-blue-50 p-2 rounded-full"
                    title="Add emoji"
                  >
                    <Smile className="h-5 w-5" />
                  </Button>
                  
                  {/* Schedule */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-500 hover:bg-blue-50 p-2 rounded-full"
                    title="Schedule post"
                  >
                    <Calendar className="h-5 w-5" />
                  </Button>
                  
                  {/* Location */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-500 hover:bg-blue-50 p-2 rounded-full"
                    title="Add location"
                  >
                    <MapPin className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-3">
                  {/* Character Counter */}
                  {content.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 24 24">
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="#e5e7eb"
                            strokeWidth="2"
                            fill="none"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke={isOverLimit ? '#ef4444' : characterCount > maxCharacters * 0.8 ? '#f59e0b' : '#3b82f6'}
                            strokeWidth="2"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 10}`}
                            strokeDashoffset={`${2 * Math.PI * 10 * (1 - Math.min(characterCount / maxCharacters, 1))}`}
                            className="transition-all duration-200"
                          />
                        </svg>
                        {characterCount > maxCharacters * 0.8 && (
                          <span className={`absolute inset-0 flex items-center justify-center text-xs font-medium ${
                            isOverLimit ? 'text-red-500' : 'text-yellow-600'
                          }`}>
                            {maxCharacters - characterCount}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Divider */}
                  {content.length > 0 && (
                    <div className="w-px h-6 bg-gray-300"></div>
                  )}
                  
                  {/* Post Button */}
                  <Button 
                    onClick={handleSubmit} 
                    disabled={loading || !content.trim() || isOverLimit}
                    className={`px-6 py-2 rounded-full font-bold transition-all ${
                      loading || !content.trim() || isOverLimit
                        ? 'bg-blue-300 text-white cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Posting...</span>
                      </div>
                    ) : (
                      'Post'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}