import { NextResponse } from 'next/server'

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const handleApiError = (error: unknown) => {
  console.error('API Error:', error)

  if (error instanceof AppError) {
    return NextResponse.json(
      { message: error.message, code: error.code },
      { status: error.statusCode }
    )
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { message: 'Unknown error occurred' },
    { status: 500 }
  )
}

export const validateInput = (data: any, requiredFields: string[]) => {
  const missing = requiredFields.filter(field => !data[field])
  if (missing.length > 0) {
    throw new AppError(`Missing required fields: ${missing.join(', ')}`, 400)
  }
}

export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return ''
  return input.trim().replace(/[<>]/g, '')
}