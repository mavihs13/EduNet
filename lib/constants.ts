export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password'
  },
  POSTS: {
    BASE: '/api/posts',
    LIKE: (id: string) => `/api/posts/${id}/like`,
    COMMENTS: (id: string) => `/api/posts/${id}/comments`,
    SAVE: '/api/posts/save',
    SAVED: '/api/posts/saved'
  },
  USERS: {
    PROFILE: '/api/profile',
    SEARCH: '/api/search/users'
  },
  FRIENDS: {
    BASE: '/api/friends',
    SEND_REQUEST: '/api/friends/requests/send',
    ACCEPT_REQUEST: '/api/friends/requests/accept',
    REJECT_REQUEST: '/api/friends/requests/reject'
  },
  MESSAGES: '/api/messages',
  NOTIFICATIONS: '/api/notifications',
  UPLOAD: {
    BASE: '/api/upload',
    AVATAR: '/api/upload/avatar'
  }
} as const

export const VALIDATION_LIMITS = {
  USERNAME: { MIN: 3, MAX: 20 },
  PASSWORD: { MIN: 6, MAX: 100 },
  NAME: { MIN: 1, MAX: 50 },
  BIO: { MAX: 500 },
  POST_CONTENT: { MAX: 2000 },
  CODE_CONTENT: { MAX: 10000 },
  COMMENT: { MIN: 1, MAX: 1000 },
  MESSAGE: { MIN: 1, MAX: 1000 }
} as const

export const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'c',
  'html',
  'css',
  'sql',
  'go',
  'rust',
  'php'
] as const

export const FILE_UPLOAD_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
} as const