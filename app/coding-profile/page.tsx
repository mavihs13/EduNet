import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/auth'
import { userCrud } from '@/lib/crud'
import CodingProfileClient from './CodingProfileClient'

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

  return <CodingProfileClient user={user} />
}