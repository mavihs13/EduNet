const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12)

  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      username: 'johndoe',
      password: hashedPassword,
      profile: {
        create: {
          name: 'John Doe',
          bio: 'Full-stack developer passionate about React and Node.js',
          skills: 'JavaScript, React, Node.js, TypeScript',
          location: 'San Francisco, CA'
        }
      }
    }
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      username: 'janesmith',
      password: hashedPassword,
      profile: {
        create: {
          name: 'Jane Smith',
          bio: 'Python developer and AI enthusiast',
          skills: 'Python, Machine Learning, TensorFlow',
          location: 'New York, NY'
        }
      }
    }
  })

  const user3 = await prisma.user.upsert({
    where: { email: 'alex@example.com' },
    update: {},
    create: {
      email: 'alex@example.com',
      username: 'alexchen',
      password: hashedPassword,
      profile: {
        create: {
          name: 'Alex Chen',
          bio: 'Mobile app developer | Flutter & React Native',
          skills: 'Flutter, React Native, Dart, JavaScript',
          location: 'Seattle, WA'
        }
      }
    }
  })

  console.log('✓ Created 3 sample users')

  // Create sample posts
  await prisma.post.create({
    data: {
      userId: user1.id,
      content: 'Just finished building my first Next.js 14 app! The App Router is amazing 🚀',
      tags: 'nextjs, react, webdev'
    }
  })

  await prisma.post.create({
    data: {
      userId: user1.id,
      content: 'Check out this clean JavaScript function for array manipulation:',
      code: `const uniqueArray = (arr) => [...new Set(arr)];

// Usage
const numbers = [1, 2, 2, 3, 4, 4, 5];
console.log(uniqueArray(numbers)); // [1, 2, 3, 4, 5]`,
      language: 'javascript',
      tags: 'javascript, coding, tips'
    }
  })

  await prisma.post.create({
    data: {
      userId: user2.id,
      content: 'Working on a machine learning project to predict stock prices. Here\'s a simple linear regression model:',
      code: `import numpy as np
from sklearn.linear_model import LinearRegression

# Sample data
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 5, 4, 5])

# Train model
model = LinearRegression()
model.fit(X, y)

# Predict
prediction = model.predict([[6]])
print(f"Prediction: {prediction[0]}")`,
      language: 'python',
      tags: 'python, machinelearning, ai'
    }
  })

  await prisma.post.create({
    data: {
      userId: user3.id,
      content: 'Flutter tip: Use const constructors whenever possible for better performance! 💡',
      tags: 'flutter, mobile, performance'
    }
  })

  console.log('✓ Created 4 sample posts')

  // Create follow relationships
  await prisma.follow.create({
    data: {
      followerId: user1.id,
      followingId: user2.id
    }
  })

  await prisma.follow.create({
    data: {
      followerId: user2.id,
      followingId: user1.id
    }
  })

  await prisma.follow.create({
    data: {
      followerId: user3.id,
      followingId: user1.id
    }
  })

  console.log('✓ Created follow relationships')

  // Initialize analytics
  await prisma.analytics.upsert({
    where: { type: 'user_registrations' },
    update: { count: 3 },
    create: { type: 'user_registrations', count: 3 }
  })

  console.log('✓ Initialized analytics')

  console.log('\n✅ Database seeded successfully!')
  console.log('\n📝 Sample Login Credentials:')
  console.log('   Email: john@example.com')
  console.log('   Username: johndoe')
  console.log('   Password: password123')
  console.log('\n   Email: jane@example.com')
  console.log('   Username: janesmith')
  console.log('   Password: password123')
  console.log('\n   Email: alex@example.com')
  console.log('   Username: alexchen')
  console.log('   Password: password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
