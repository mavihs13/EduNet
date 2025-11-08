const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const generateSecret = () => crypto.randomBytes(32).toString('hex')

const createEnvFile = () => {
  const envPath = path.join(__dirname, '.env.local')
  
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local already exists. Please check your configuration.')
    return
  }

  const envContent = `# Database
DATABASE_URL="file:./dev.db"

# JWT Secrets (Generated)
JWT_SECRET="${generateSecret()}"
JWT_REFRESH_SECRET="${generateSecret()}"

# Redis (Optional - for production)
REDIS_URL="redis://localhost:6379"

# NextAuth
NEXTAUTH_SECRET="${generateSecret()}"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth (Optional - for GitHub login)
# GITHUB_CLIENT_ID="your-github-client-id"
# GITHUB_CLIENT_SECRET="your-github-client-secret"

# AWS S3 (Optional - for file uploads)
# AWS_REGION="us-east-1"
# AWS_ACCESS_KEY_ID="your-aws-access-key-id"
# AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
# S3_BUCKET_NAME="your-s3-bucket-name"

# Email Configuration (Optional - for password reset)
# SMTP_HOST="smtp.gmail.com"
# SMTP_PORT="587"
# SMTP_USER="your-email@gmail.com"
# SMTP_PASS="your-gmail-app-password"

# App Configuration
NODE_ENV="development"
PORT="3000"
`

  fs.writeFileSync(envPath, envContent)
  console.log('✅ Created .env.local with secure random secrets')
  console.log('📝 Please review and update the configuration as needed')
}

const checkDependencies = () => {
  const packageJsonPath = path.join(__dirname, 'package.json')
  
  if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ package.json not found')
    return false
  }

  console.log('✅ package.json found')
  return true
}

const main = () => {
  console.log('🚀 Setting up EduNet...\n')
  
  if (!checkDependencies()) {
    process.exit(1)
  }
  
  createEnvFile()
  
  console.log('\n📋 Next steps:')
  console.log('1. Run: npm install')
  console.log('2. Run: npm run db:push')
  console.log('3. Run: npm run db:generate')
  console.log('4. Run: npm run dev')
  console.log('\n🎉 Setup complete!')
}

main()