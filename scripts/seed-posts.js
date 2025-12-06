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
    },
    {
      content: "Debugging tip of the day: console.log() is your best friend! 🐛 But don't forget to remove them before pushing to production. Here's a better approach using environment variables:",
      code: `const debug = process.env.NODE_ENV === 'development';

const log = (...args) => {
  if (debug) {
    console.log('[DEBUG]:', ...args);
  }
};

// Usage
log('User data:', userData);`,
      language: "javascript",
      tags: "debugging,javascript,best-practices,tips"
    },
    {
      content: "Finally mastered async/await in JavaScript! ⚡ No more callback hell. Here's a clean example of handling multiple API calls:",
      code: `async function fetchUserData(userId) {
  try {
    const user = await fetch(\`/api/users/\${userId}\`);
    const posts = await fetch(\`/api/users/\${userId}/posts\`);
    const comments = await fetch(\`/api/users/\${userId}/comments\`);
    
    return {
      user: await user.json(),
      posts: await posts.json(),
      comments: await comments.json()
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}`,
      language: "javascript",
      tags: "javascript,async,promises,api"
    },
    {
      content: "Built my first machine learning model today! 🤖 Used scikit-learn to predict house prices. The accuracy is surprisingly good for a beginner project!",
      code: `from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import pandas as pd

# Load data
df = pd.read_csv('house_prices.csv')
X = df[['size', 'bedrooms', 'age']]
y = df['price']

# Split and train
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = LinearRegression()
model.fit(X_train, y_train)

print(f'Score: {model.score(X_test, y_test):.2f}')`,
      language: "python",
      tags: "python,machine-learning,ai,scikit-learn"
    },
    {
      content: "Docker has changed my development workflow completely! 🐳 No more 'works on my machine' problems. Here's a simple Dockerfile for a Node.js app:",
      code: `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]`,
      language: "dockerfile",
      tags: "docker,devops,nodejs,containers"
    },
    {
      content: "Learned about SQL joins today and everything makes sense now! 📊 Here's a quick reference for the different types:",
      code: `-- INNER JOIN: Returns matching records from both tables
SELECT users.name, orders.total
FROM users
INNER JOIN orders ON users.id = orders.user_id;

-- LEFT JOIN: Returns all records from left table
SELECT users.name, orders.total
FROM users
LEFT JOIN orders ON users.id = orders.user_id;

-- RIGHT JOIN: Returns all records from right table
SELECT users.name, orders.total
FROM users
RIGHT JOIN orders ON users.id = orders.user_id;`,
      language: "sql",
      tags: "sql,database,joins,learning"
    },
    {
      content: "TypeScript is a game changer! 💙 The type safety catches so many bugs before runtime. Here's how to use generics effectively:",
      code: `function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

// Usage with type inference
const firstNumber = getFirstElement([1, 2, 3]); // number
const firstName = getFirstElement(['a', 'b', 'c']); // string

// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

const userResponse: ApiResponse<User> = {
  data: { id: 1, name: 'John' },
  status: 200,
  message: 'Success'
};`,
      language: "typescript",
      tags: "typescript,generics,types,javascript"
    },
    {
      content: "Just discovered Tailwind CSS and I'm never going back! 🎨 The utility-first approach is so productive. No more context switching between files!",
      tags: "tailwind,css,frontend,productivity"
    },
    {
      content: "Git rebase vs merge - finally understand the difference! 🌿 Rebase keeps history clean, merge preserves context. Use rebase for feature branches, merge for main branches.",
      code: `# Rebase feature branch onto main
git checkout feature-branch
git rebase main

# Interactive rebase to clean up commits
git rebase -i HEAD~3

# Merge feature into main
git checkout main
git merge feature-branch`,
      language: "bash",
      tags: "git,version-control,workflow,tips"
    },
    {
      content: "Implemented my first GraphQL API! 🚀 The flexibility compared to REST is incredible. Clients can request exactly what they need.",
      code: `const typeDefs = gql\`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
  }

  type Query {
    user(id: ID!): User
    posts: [Post!]!
  }
\`;

const resolvers = {
  Query: {
    user: (_, { id }) => getUserById(id),
    posts: () => getAllPosts()
  }
};`,
      language: "javascript",
      tags: "graphql,api,javascript,backend"
    },
    {
      content: "Regex doesn't have to be scary! 🔍 Here are some common patterns I use all the time. Save this for reference!",
      code: `// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone number (US format)
const phoneRegex = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

// URL validation
const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b/;

// Password (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

// Extract hashtags
const hashtagRegex = /#(\w+)/g;`,
      language: "javascript",
      tags: "regex,javascript,validation,patterns"
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