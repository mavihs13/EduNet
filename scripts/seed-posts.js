const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedPosts() {
  // Get existing users
  const users = await prisma.user.findMany()
  
  if (users.length === 0) {
    console.log('No users found. Please run seed-users.js first')
    return
  }

  const posts = [
    {
      content: "Just solved a challenging algorithm problem! 🚀 The key was using dynamic programming to optimize the solution from O(n²) to O(n). Love how coding teaches us to think differently!",
      code: `function fibonacci(n) {
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
  }
  return dp[n];
}`,
      language: "javascript",
      tags: "algorithms,dynamic-programming,javascript"
    },
    {
      content: "Working on a React project and discovered this amazing pattern for state management. Clean, simple, and effective! 💡",
      code: `const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
};`,
      language: "javascript",
      tags: "react,hooks,javascript,frontend"
    },
    {
      content: "Learning Python data structures today. Here's a simple implementation of a binary search tree. The recursive approach makes it so elegant! 🌳",
      code: `class TreeNode:
    def __init__(self, val=0):
        self.val = val
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None
    
    def insert(self, val):
        self.root = self._insert_recursive(self.root, val)
    
    def _insert_recursive(self, node, val):
        if not node:
            return TreeNode(val)
        
        if val < node.val:
            node.left = self._insert_recursive(node.left, val)
        else:
            node.right = self._insert_recursive(node.right, val)
        
        return node`,
      language: "python",
      tags: "python,data-structures,algorithms,trees"
    },
    {
      content: "Just finished building my first REST API with Node.js and Express! 🎉 The feeling when everything clicks together is amazing. Next step: adding authentication and database integration.",
      tags: "nodejs,express,api,backend,learning"
    },
    {
      content: "CSS Grid is absolutely game-changing! 🎨 Finally understood how to create complex layouts without the headache. Here's a simple responsive grid setup:",
      code: `.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}`,
      language: "css",
      tags: "css,grid,responsive,frontend,design"
    }
  ]

  for (let i = 0; i < posts.length; i++) {
    const postData = posts[i]
    const author = users[i % users.length]
    
    const post = await prisma.post.create({
      data: {
        userId: author.id,
        content: postData.content,
        code: postData.code || null,
        language: postData.language || null,
        tags: postData.tags
      }
    })

    // Add likes from other users
    const likeCount = Math.floor(Math.random() * 8) + 3 // 3-10 likes
    const likers = users.filter(u => u.id !== author.id).slice(0, likeCount)
    
    for (const liker of likers) {
      await prisma.like.create({
        data: {
          postId: post.id,
          userId: liker.id
        }
      })
    }

    // Add comments
    const commentCount = Math.floor(Math.random() * 4) + 1 // 1-4 comments
    const comments = [
      "Great solution! Thanks for sharing 👍",
      "This is exactly what I was looking for!",
      "Love the clean code approach 🔥",
      "Bookmarked for later reference",
      "Amazing explanation! Very helpful",
      "This helped me understand the concept better",
      "Brilliant implementation! 💡",
      "Thanks for the detailed breakdown"
    ]

    for (let j = 0; j < commentCount; j++) {
      const commenter = users[Math.floor(Math.random() * users.length)]
      const comment = comments[Math.floor(Math.random() * comments.length)]
      
      await prisma.comment.create({
        data: {
          postId: post.id,
          userId: commenter.id,
          content: comment
        }
      })
    }

    console.log(`✅ Created post by ${author.username} with ${likeCount} likes and ${commentCount} comments`)
  }

  console.log('\n🎉 Successfully created dummy posts with likes and comments!')
}

seedPosts()
  .catch(console.error)
  .finally(() => prisma.$disconnect())