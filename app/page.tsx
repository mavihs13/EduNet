import { cookies } from 'next/headers'
import HomeClient from './HomeClient'

export default async function HomePage() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value
  const isAuthenticated = !!token

  return <HomeClient isAuthenticated={isAuthenticated} />
}