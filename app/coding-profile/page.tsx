import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/auth'
import { userCrud } from '@/lib/crud'
import CodingProfile from '@/components/CodingProfile'

export default async function CodingProfilePage() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value
  
  if (!token) {
    redirect('/login')
  }

  const payload = verifyToken(token)
  if (!payload) {
    redirect('/login')
  }

  const user = await userCrud.findById(payload.userId)
  
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <CodingProfile user={user} isOwnProfile={true} />
      </div>
    </div>
  )
}