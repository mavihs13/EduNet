'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Code, Image, X } from 'lucide-react'
import CodeEditor from './CodeEditor'

interface CreatePostProps {
  user: any
  onPostCreated: (post: any) => void
}

export default function CreatePost({ user, onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('')
  const [showCodeEditor, setShowCodeEditor] = useState(false)
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim() && !code.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim() || null,
          code: code.trim() || null,
          language: code.trim() ? language : null,
          tags: tags.split(',').map(tag => tag.trim()).filter(Boolean)
        }),
      })

      if (res.ok) {
        const newPost = await res.json()
        onPostCreated(newPost)
        setContent('')
        setCode('')
        setTags('')
        setShowCodeEditor(false)
      }
    } catch (error) {
      console.error('Failed to create post:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={user.profile?.avatar} />
            <AvatarFallback>
              {user.profile?.name?.[0] || user.username[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <textarea
              placeholder="What's on your mind? Share a coding question or insight..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
        </div>
      </CardHeader>
      
      {showCodeEditor && (
        <CardContent className="pt-0">
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1 border rounded"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
              </select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCodeEditor(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
              placeholder="Enter your code here..."
            />
          </div>
        </CardContent>
      )}

      <CardContent className="pt-0">
        <input
          type="text"
          placeholder="Add tags (comma separated): javascript, react, algorithm"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-2 border rounded mb-3 text-sm"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCodeEditor(!showCodeEditor)}
              className={showCodeEditor ? 'bg-blue-100 text-blue-600' : ''}
            >
              <Code className="h-4 w-4 mr-1" />
              Code
            </Button>
            <Button variant="ghost" size="sm">
              <Image className="h-4 w-4 mr-1" />
              Image
            </Button>
          </div>
          
          <Button 
            onClick={handleSubmit} 
            disabled={loading || (!content.trim() && !code.trim())}
          >
            {loading ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}