const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedMorePosts() {
  const users = await prisma.user.findMany()
  
  if (users.length === 0) {
    console.log('No users found. Please run seed-users.js first')
    return
  }

  const morePosts = [
    {
      content: "Finally mastered async/await in JavaScript! 🎯 No more callback hell for me. Here's a clean pattern I've been using:",
      code: `async function fetchUserData(userId) {
  try {
    const user = await fetch(\`/api/users/\${userId}\`);
    const userData = await user.json();
    
    const posts = await fetch(\`/api/users/\${userId}/posts\`);
    const userPosts = await posts.json();
    
    return { ...userData, posts: userPosts };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}`,
      language: "javascript",
      tags: "javascript,async,promises,clean-code"
    },
    {
      content: "Built my first REST API with Express.js today! 🚀 The middleware concept is so powerful. Here's a simple auth middleware:",
      code: `const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};`,
      language: "javascript",
      tags: "nodejs,express,jwt,authentication,middleware"
    },
    {
      content: "Learning Python data analysis with pandas! 📊 The power of data manipulation is incredible. Check out this data cleaning snippet:",
      code: `import pandas as pd
import numpy as np

# Load and clean dataset
df = pd.read_csv('data.csv')

# Handle missing values
df['age'].fillna(df['age'].median(), inplace=True)
df['salary'].fillna(df['salary'].mean(), inplace=True)

# Remove duplicates
df.drop_duplicates(inplace=True)

# Create age groups
df['age_group'] = pd.cut(df['age'], 
                        bins=[0, 25, 35, 50, 100], 
                        labels=['Young', 'Adult', 'Middle', 'Senior'])

print(df.groupby('age_group')['salary'].mean())`,
      language: "python",
      tags: "python,pandas,data-analysis,data-science"
    },
    {
      content: "CSS Grid is a game changer! 🎨 Created this responsive layout without any media queries. The auto-fit and minmax functions are pure magic:",
      code: `.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
}`,
      language: "css",
      tags: "css,grid,responsive,frontend,design"
    },
    {
      content: "Diving deep into React hooks! 🪝 Custom hooks are so powerful for reusable logic. Here's my useLocalStorage hook:",
      code: `import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  };

  return [storedValue, setValue];
}`,
      language: "javascript",
      tags: "react,hooks,javascript,frontend,custom-hooks"
    },
    {
      content: "Just discovered the power of SQL window functions! 📈 They're perfect for analytics queries. Here's how to calculate running totals:",
      code: `-- Calculate running total of sales by date
SELECT 
  date,
  amount,
  SUM(amount) OVER (ORDER BY date) as running_total,
  AVG(amount) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as moving_avg_7_days
FROM sales
ORDER BY date;

-- Rank products by sales within each category
SELECT 
  category,
  product_name,
  total_sales,
  RANK() OVER (PARTITION BY category ORDER BY total_sales DESC) as rank_in_category
FROM product_sales;`,
      language: "sql",
      tags: "sql,database,analytics,window-functions"
    },
    {
      content: "Working with Docker for the first time! 🐳 Containerization makes deployment so much easier. Here's my Node.js Dockerfile:",
      code: `FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

CMD ["npm", "start"]`,
      language: "dockerfile",
      tags: "docker,containerization,nodejs,deployment"
    },
    {
      content: "Exploring machine learning with scikit-learn! 🤖 Built my first classification model. The accuracy is surprisingly good!",
      code: `from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import pandas as pd

# Load and prepare data
data = pd.read_csv('dataset.csv')
X = data.drop('target', axis=1)
y = data['target']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train the model
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Make predictions
y_pred = rf_model.predict(X_test)

# Evaluate
accuracy = accuracy_score(y_test, y_pred)
print(f'Accuracy: {accuracy:.2f}')
print(classification_report(y_test, y_pred))`,
      language: "python",
      tags: "python,machine-learning,scikit-learn,data-science"
    },
    {
      content: "Learning TypeScript and loving the type safety! 💪 Interfaces make code so much more maintainable. Here's a clean API response pattern:",
      code: `interface User {
  id: string;
  name: string;
  email: string;
  profile?: UserProfile;
}

interface UserProfile {
  bio: string;
  avatar: string;
  skills: string[];
  location?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message: string;
}

// Usage
async function fetchUser(id: string): Promise<ApiResponse<User>> {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    const data = await response.json();
    
    return {
      success: true,
      data,
      message: 'User fetched successfully'
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to fetch user'
    };
  }
}`,
      language: "typescript",
      tags: "typescript,interfaces,type-safety,api,frontend"
    },
    {
      content: "Just finished a coding challenge! 🧩 Implementing a binary search tree was trickier than expected, but so satisfying when it works:",
      code: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class BinarySearchTree:
    def __init__(self):
        self.root = None
    
    def insert(self, val):
        if not self.root:
            self.root = TreeNode(val)
        else:
            self._insert_recursive(self.root, val)
    
    def _insert_recursive(self, node, val):
        if val < node.val:
            if node.left is None:
                node.left = TreeNode(val)
            else:
                self._insert_recursive(node.left, val)
        else:
            if node.right is None:
                node.right = TreeNode(val)
            else:
                self._insert_recursive(node.right, val)
    
    def inorder_traversal(self):
        result = []
        self._inorder_recursive(self.root, result)
        return result
    
    def _inorder_recursive(self, node, result):
        if node:
            self._inorder_recursive(node.left, result)
            result.append(node.val)
            self._inorder_recursive(node.right, result)`,
      language: "python",
      tags: "python,algorithms,data-structures,binary-tree,coding-challenge"
    }
  ]

  for (let i = 0; i < morePosts.length; i++) {
    const postData = morePosts[i]
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

    // Add likes from random users
    const likeCount = Math.floor(Math.random() * 12) + 5 // 5-16 likes
    const shuffledUsers = users.sort(() => 0.5 - Math.random())
    const likers = shuffledUsers.filter(u => u.id !== author.id).slice(0, likeCount)
    
    for (const liker of likers) {
      await prisma.like.create({
        data: {
          postId: post.id,
          userId: liker.id
        }
      })
    }

    // Add comments
    const commentCount = Math.floor(Math.random() * 5) + 2 // 2-6 comments
    const comments = [
      "This is exactly what I needed! Thanks for sharing 🙏",
      "Great explanation! Bookmarked for reference",
      "Clean code! I learned something new today 💡",
      "Amazing work! Keep it up 🔥",
      "This helped me solve a similar problem",
      "Love the detailed comments in the code",
      "Brilliant approach! Never thought of it this way",
      "Thanks for the tutorial! Very helpful 👍",
      "Perfect timing! I was just working on something similar",
      "Your code is so readable and well-structured",
      "This is gold! Sharing with my team",
      "Excellent example! Clear and concise"
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

  console.log('\n🎉 Successfully created 10 more diverse posts!')
}

seedMorePosts()
  .catch(console.error)
  .finally(() => prisma.$disconnect())