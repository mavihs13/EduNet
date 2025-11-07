import { prisma } from './prisma'

let dbInitialized = false

export async function initializeDatabase() {
  if (dbInitialized) return true
  
  try {
    // Test connection
    await prisma.$connect()
    
    // Try to query users table
    await prisma.user.count()
    
    dbInitialized = true
    console.log('✅ Database initialized successfully')
    return true
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    return false
  }
}