import { z } from 'zod'

export const userRegistrationSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be less than 20 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required').max(50, 'Name must be less than 50 characters')
})

export const userLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required')
})

export const postSchema = z.object({
  content: z.string().max(2000, 'Content must be less than 2000 characters').optional(),
  code: z.string().max(10000, 'Code must be less than 10000 characters').optional(),
  language: z.string().max(50, 'Language must be less than 50 characters').optional(),
  tags: z.string().max(200, 'Tags must be less than 200 characters').optional()
})

export const profileSchema = z.object({
  name: z.string().max(50, 'Name must be less than 50 characters').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  skills: z.string().max(200, 'Skills must be less than 200 characters').optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  links: z.string().max(500, 'Links must be less than 500 characters').optional()
})

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment must be less than 1000 characters')
})

export const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(1000, 'Message must be less than 1000 characters'),
  receiverId: z.string().min(1, 'Receiver ID is required')
})