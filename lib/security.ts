import { NextRequest } from 'next/server'

export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
}

export const rateLimitMap = new Map()

export const rateLimit = (identifier: string, limit: number = 100, windowMs: number = 15 * 60 * 1000) => {
  const now = Date.now()
  const windowStart = now - windowMs
  
  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, [])
  }
  
  const requests = rateLimitMap.get(identifier)
  const validRequests = requests.filter((time: number) => time > windowStart)
  
  if (validRequests.length >= limit) {
    return false
  }
  
  validRequests.push(now)
  rateLimitMap.set(identifier, validRequests)
  return true
}

export const getClientIP = (request: NextRequest): string => {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.+/g, '.')
    .substring(0, 100)
}

export const isValidImageType = (mimeType: string): boolean => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  return allowedTypes.includes(mimeType)
}

export const validateFileSize = (size: number, maxSize: number = 5 * 1024 * 1024): boolean => {
  return size <= maxSize
}