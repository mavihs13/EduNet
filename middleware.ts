import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    const { pathname } = request.nextUrl

    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password']
    
    if (publicRoutes.includes(pathname)) {
      return NextResponse.next()
    }

    // Protected routes - redirect to login if no token
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      // Ensure we're only redirecting to our own domain
      if (loginUrl.origin === request.nextUrl.origin) {
        return NextResponse.redirect(loginUrl)
      }
    }

    return NextResponse.next()
  } catch (error) {
    // Fallback to login on any error
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}