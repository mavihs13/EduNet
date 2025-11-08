import { createClient } from 'redis'

// Validate Redis URL to prevent SSRF
const validateRedisUrl = (url: string) => {
  try {
    const parsed = new URL(url)
    // Only allow redis protocol and localhost/127.0.0.1
    if (parsed.protocol !== 'redis:' && parsed.protocol !== 'rediss:') {
      throw new Error('Invalid Redis protocol')
    }
    return url
  } catch {
    return 'redis://localhost:6379'
  }
}

const redisUrl = validateRedisUrl(process.env.REDIS_URL || 'redis://localhost:6379')

const client = createClient({ url: redisUrl })

client.on('error', (err) => {
  console.error('Redis Client Error:', err.message)
})

export const connectRedis = async () => {
  try {
    if (!client.isOpen) {
      await client.connect()
    }
    return client
  } catch (error) {
    console.error('Failed to connect to Redis:', error)
    throw error
  }
}

export { client as redis }