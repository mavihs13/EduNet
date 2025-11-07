const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function seedUsers() {
  // Clear existing users first
  await prisma.user.deleteMany({})
  console.log('🗑️ Cleared existing users')
  
  const sharedEmail = 'test@example.com'
  
  const users = [
    { username: 'john_dev', password: 'john123', name: 'John Developer' },
    { username: 'sarah_code', password: 'sarah456', name: 'Sarah Coder' },
    { username: 'mike_tech', password: 'mike789', name: 'Mike Tech' }
  ]

  for (const userData of users) {
    const hashedPassword = await bcrypt.hash(userData.password, 10)
    
    const user = await prisma.user.create({
      data: {
        username: userData.username,
        email: sharedEmail,
        password: hashedPassword,
        profile: {
          create: {
            name: userData.name,
            bio: `I'm ${userData.name}, a passionate developer!`,
            skills: 'JavaScript,React,Node.js'
          }
        }
      }
    })
    
    console.log(`✅ Created user: ${userData.username} (${userData.name})`)
    console.log(`   Password: ${userData.password}`)
  }
  
  console.log(`\n📧 All users share email: ${sharedEmail}`)
}

seedUsers()
  .catch(console.error)
  .finally(() => prisma.$disconnect())