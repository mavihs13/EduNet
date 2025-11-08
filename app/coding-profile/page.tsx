import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { userCrud } from '@/lib/crud'
import CodingProfile from '@/components/CodingProfile'

export default async function CodingProfilePage() {
  const session = await getServerSession()
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await userCrud.findById(session.user.id)
  
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