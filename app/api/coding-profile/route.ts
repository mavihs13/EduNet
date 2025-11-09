import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(null)
    }

    // Check if codingProfile exists in prisma
    if (!prisma.codingProfile) {
      console.error('CodingProfile model not found in Prisma client')
      return NextResponse.json(null)
    }

    const profile = await prisma.codingProfile.findUnique({
      where: { userId }
    })
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Coding profile fetch error:', error)
    return NextResponse.json(null)
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const data = await request.json()
    
    const profileData = {
      githubUsername: data.githubUsername || null,
      leetcodeUsername: data.leetcodeUsername || null,
      codeforcesUsername: data.codeforcesUsername || null,
      hackerrankUsername: data.hackerrankUsername || null,
      totalProblems: parseInt(data.totalProblems) || 0,
      easyProblems: parseInt(data.easyProblems) || 0,
      mediumProblems: parseInt(data.mediumProblems) || 0,
      hardProblems: parseInt(data.hardProblems) || 0,
      contestRating: parseInt(data.contestRating) || 0,
      globalRank: parseInt(data.globalRank) || null,
      streak: parseInt(data.streak) || 0,
      languages: data.languages || null,
      githubStats: data.githubStats || null
    }
    
    let profile
    try {
      // Try using Prisma first
      profile = await prisma.codingProfile.upsert({
        where: { userId: payload.userId },
        update: profileData,
        create: { userId: payload.userId, ...profileData }
      })
    } catch (prismaError) {
      console.error('Prisma error, using fallback:', prismaError)
      
      // Fallback: try to find existing profile
      try {
        const existing = await prisma.$queryRaw`SELECT * FROM CodingProfile WHERE userId = ${payload.userId}`
        
        if (existing && existing.length > 0) {
          // Update existing
          await prisma.$executeRaw`
            UPDATE CodingProfile SET 
              githubUsername = ${profileData.githubUsername},
              leetcodeUsername = ${profileData.leetcodeUsername},
              codeforcesUsername = ${profileData.codeforcesUsername},
              hackerrankUsername = ${profileData.hackerrankUsername},
              totalProblems = ${profileData.totalProblems},
              easyProblems = ${profileData.easyProblems},
              mediumProblems = ${profileData.mediumProblems},
              hardProblems = ${profileData.hardProblems},
              contestRating = ${profileData.contestRating},
              globalRank = ${profileData.globalRank},
              streak = ${profileData.streak},
              languages = ${profileData.languages},
              githubStats = ${profileData.githubStats},
              updatedAt = datetime('now')
            WHERE userId = ${payload.userId}
          `
        } else {
          // Create new
          await prisma.$executeRaw`
            INSERT INTO CodingProfile (
              id, userId, githubUsername, leetcodeUsername, codeforcesUsername, hackerrankUsername,
              totalProblems, easyProblems, mediumProblems, hardProblems, contestRating,
              globalRank, streak, languages, githubStats, createdAt, updatedAt
            ) VALUES (
              ${Math.random().toString(36)}, ${payload.userId}, ${profileData.githubUsername}, 
              ${profileData.leetcodeUsername}, ${profileData.codeforcesUsername}, ${profileData.hackerrankUsername},
              ${profileData.totalProblems}, ${profileData.easyProblems}, ${profileData.mediumProblems}, 
              ${profileData.hardProblems}, ${profileData.contestRating}, ${profileData.globalRank},
              ${profileData.streak}, ${profileData.languages}, ${profileData.githubStats},
              datetime('now'), datetime('now')
            )
          `
        }
        
        // Return the updated/created profile
        const result = await prisma.$queryRaw`SELECT * FROM CodingProfile WHERE userId = ${payload.userId}`
        profile = result[0]
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError)
        return NextResponse.json({ error: 'Database operation failed' }, { status: 500 })
      }
    }
    
    return NextResponse.json(profile)
  } catch (error) {
    console.error('Coding profile update error:', error)
    return NextResponse.json({ error: error.message || 'Failed to update coding profile' }, { status: 500 })
  }
}