import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verify } from 'jsonwebtoken'
import prisma from '@/lib/prisma'
import MessagesClient from './MessagesClient'

export default async function MessagesPage() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    redirect('/login')
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as { userId: string }
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        profile: true
      }
    })

    if (!user) {
      redirect('/login')
    }

    // Get conversations with messages
    const conversations = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user.id },
          { receiverId: user.id }
        ]
      },
      include: {
        sender: {
          include: { profile: true }
        },
        receiver: {
          include: { profile: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get unique conversation partners
    const conversationMap = new Map()
    conversations.forEach(msg => {
      const partnerId = msg.senderId === user.id ? msg.receiverId : msg.senderId
      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          user: msg.senderId === user.id ? msg.receiver : msg.sender,
          lastMessage: msg,
          unreadCount: 0
        })
      }
      if (msg.receiverId === user.id && !msg.read) {
        conversationMap.get(partnerId).unreadCount++
      }
    })

    const conversationList = Array.from(conversationMap.values())

    // Get message requests
    const messageRequests = await prisma.messageRequest.findMany({
      where: {
        receiverId: user.id,
        status: 'pending'
      },
      include: {
        sender: {
          include: { profile: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return <MessagesClient user={user} conversations={conversationList} messageRequests={messageRequests} />
  } catch (error) {
    redirect('/login')
  }
}
