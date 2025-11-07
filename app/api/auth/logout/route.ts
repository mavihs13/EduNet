import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = cookies()
  
  cookieStore.delete('token')
  cookieStore.delete('refreshToken')

  return NextResponse.json({ message: 'Logged out successfully' })
}