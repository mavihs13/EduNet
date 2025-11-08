import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 12)
}

export const verifyPassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword)
}

export const generateTokens = (userId: string) => {
  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT secrets not configured')
  }
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })
  return { accessToken, refreshToken }
}

export const verifyToken = (token: string) => {
  try {
    if (!process.env.JWT_SECRET) return null
    return jwt.verify(token, process.env.JWT_SECRET) as { userId: string }
  } catch {
    return null
  }
}

export const verifyRefreshToken = (token: string) => {
  try {
    if (!process.env.JWT_REFRESH_SECRET) return null
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET) as { userId: string }
  } catch {
    return null
  }
}