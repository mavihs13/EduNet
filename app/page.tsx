import { cookies } from 'next/headers'
import HomeClient from './HomeClient'

export default async function HomePage() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value
    const isAuthenticated = !!token

    return <HomeClient isAuthenticated={isAuthenticated} />
  } catch (error) {
    console.error('Error in HomePage:', error)
    return <HomeClient isAuthenticated={false} />
  }
}