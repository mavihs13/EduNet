# GitHub OAuth Setup Instructions

## 1. Create GitHub OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: EduNet
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"

## 2. Update Environment Variables

Copy the Client ID and Client Secret from your GitHub OAuth app and update `.env.local`:

```env
GITHUB_CLIENT_ID="your-actual-github-client-id"
GITHUB_CLIENT_SECRET="your-actual-github-client-secret"
```

## 3. Test the Login

1. Start the development server: `npm run dev`
2. Go to `http://localhost:3000/login`
3. Click "Continue with GitHub"
4. Authorize the app
5. You should be redirected to `/feed` with your GitHub profile data

## Profile Data Synced from GitHub:
- Name (GitHub display name or username)
- Avatar (GitHub profile picture)
- Bio (GitHub bio)
- Location (GitHub location)
- Links (GitHub blog/website or profile URL)
- Username (GitHub username)