import { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET ? [
      GitHubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        profile(profile) {
          return {
            id: profile.id.toString(),
            name: profile.name || profile.login,
            email: profile.email,
            image: profile.avatar_url,
            username: profile.login,
          }
        },
      })
    ] : []),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === 'github' && profile) {
          // Update user with GitHub username
          await prisma.user.update({
            where: { id: user.id },
            data: {
              username: (profile as any).login,
            },
          })
          
          // Create or update profile with GitHub data
          await prisma.profile.upsert({
            where: { userId: user.id },
            update: {
              name: user.name || (profile as any).name || (profile as any).login,
              avatar: user.image || (profile as any).avatar_url,
              bio: (profile as any).bio || '',
              location: (profile as any).location || '',
              links: (profile as any).blog || (profile as any).html_url || '',
            },
            create: {
              userId: user.id,
              name: user.name || (profile as any).name || (profile as any).login,
              avatar: user.image || (profile as any).avatar_url,
              bio: (profile as any).bio || '',
              skills: '',
              links: (profile as any).blog || (profile as any).html_url || '',
              location: (profile as any).location || '',
            },
          })
        }
        return true
      } catch (error) {
        console.error('SignIn callback error:', error)
        return true
      }
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'database',
  },
  debug: process.env.NODE_ENV === 'development',
}