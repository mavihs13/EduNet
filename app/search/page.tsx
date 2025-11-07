'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Search, UserPlus } from 'lucide-react'
import Link from 'next/link'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      if (res.ok) {
        const data = await res.json()
        setResults(data)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendFriendRequest = async (userId: string) => {
    try {
      const res = await fetch('/api/friends/requests/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: userId }),
      })
      
      if (res.ok) {
        alert('Friend request sent!')
      } else {
        const error = await res.json()
        alert(error.message)
      }
    } catch (error) {
      console.error('Failed to send friend request:', error)
    }
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query.trim()) {
        handleSearch()
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(debounce)
  }, [query])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-6 px-4">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users by name, username, or skills..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Searching...</p>
          </div>
        )}

        <div className="space-y-4">
          {results.map((user: any) => (
            <Card key={user.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={user.profile?.avatar} />
                      <AvatarFallback>
                        {user.profile?.name?.[0] || user.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link 
                        href={`/profile/${user.username}`}
                        className="font-semibold hover:text-blue-600"
                      >
                        {user.profile?.name || user.username}
                      </Link>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                      {user.profile?.bio && (
                        <p className="text-sm text-gray-600 mt-1">{user.profile.bio}</p>
                      )}
                      {user.profile?.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {user.profile.skills.slice(0, 3).map((skill: string) => (
                            <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => sendFriendRequest(user.id)}
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    Add Friend
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {query && !loading && results.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No users found matching "{query}"</p>
          </div>
        )}
      </div>
    </div>
  )
}