'use client'

import { StreamVideoClient, User } from '@stream-io/video-react-sdk'
import jwt from 'jsonwebtoken'

// Type definition for StreamChat (to avoid import dependency)
interface StreamChatClient {
  connectUser: (user: any, token: string) => Promise<any>
  getInstance: (apiKey: string) => StreamChatClient
}

// GetStream configuration
const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!
const apiSecret = process.env.STREAM_API_SECRET!

// Validate configuration
if (!apiKey) {
  console.warn('🔧 GetStream API key not found in environment variables')
}

export const isGetStreamConfigured = !!apiKey && !!apiSecret

// Create a proper JWT token for user authentication
const createUserToken = (userId: string): string => {
  try {
    if (!apiSecret) {
      console.warn('🔧 GetStream secret not configured, using development token')
      return `dev_token_${userId}_${Date.now()}`
    }

    // Create proper JWT token with GetStream secret
    const payload = {
      user_id: userId,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24), // 24 hours
      iat: Math.floor(Date.now() / 1000)
    }
    
    return jwt.sign(payload, apiSecret, { algorithm: 'HS256' })
  } catch (error) {
    console.warn('⚠️ Error creating GetStream token, using fallback:', error)
    return `fallback_token_${userId}_${Date.now()}`
  }
}

// Create GetStream client with enhanced error handling
export const createStreamClient = (userId: string, userName: string = 'Student'): StreamVideoClient | null => {
  try {
    if (!apiKey) {
      console.info('📹 GetStream not configured. Video calling features will use fallback mode.')
      return null
    }

    const user: User = {
      id: userId,
      name: userName,
      image: `https://getstream.io/random_svg/?id=${userId}&name=${encodeURIComponent(userName)}`,
    }

    const token = createUserToken(userId)
    
    const client = new StreamVideoClient({
      apiKey,
      user,
      token
    })

    console.info('🎆 GetStream client initialized successfully')
    return client
  } catch (error) {
    console.error('⚠️ Failed to create GetStream client:', error)
    return null
  }
}

// Create GetStream Chat client
export const createChatClient = (userId: string, userName: string = 'Student'): StreamChatClient | null => {
  try {
    if (!apiKey) {
      console.info('💬 Chat service not configured, using local mode')
      return null
    }

    // Check if StreamChat is available (dynamic import approach)
    if (typeof window !== 'undefined' && (window as any).StreamChat) {
      const StreamChat = (window as any).StreamChat
      const chatClient = StreamChat.getInstance(apiKey)
      const token = createUserToken(userId)

      chatClient.connectUser(
        {
          id: userId,
          name: userName,
          image: `https://getstream.io/random_svg/?id=${userId}&name=${encodeURIComponent(userName)}`,
        },
        token
      )

      return chatClient
    } else {
      console.info('💬 StreamChat SDK not available, chat features will use fallback mode')
      return null
    }
  } catch (error) {
    console.info('💬 Chat service temporarily unavailable, using local mode')
    return null
  }
}

// Enhanced call management utilities
export const generateCallId = (classTitle: string): string => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const cleanTitle = classTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')
  return `class_${cleanTitle}_${timestamp}_${random}`
}

export const formatCallDuration = (startTime: Date): string => {
  const now = new Date()
  const duration = now.getTime() - startTime.getTime()
  const minutes = Math.floor(duration / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`
  }
  return `${minutes}m`
}

export const getParticipantDisplayName = (participant: any): string => {
  return participant.name || participant.user?.name || `User ${participant.userId?.slice(-4)}`
}

// Real-time class state management
export interface ClassState {
  isRecording: boolean
  isLive: boolean
  participantCount: number
  currentSlide: number
  totalSlides: number
  whiteboardData?: any
  pollActive?: {
    id: string
    question: string
    options: string[]
    endTime: Date
  }
}

// Enhanced call types with detailed configurations
export const CallTypes = {
  LIVE_CLASS: 'live_class',
  TUTORIAL: 'tutorial', 
  GROUP_STUDY: 'group_study',
  ONE_ON_ONE: 'one_on_one',
  WORKSHOP: 'workshop',
  PRESENTATION: 'presentation',
  EXAM: 'exam'
} as const

export type CallType = typeof CallTypes[keyof typeof CallTypes]

// Call permissions based on role
export interface CallPermissions {
  canMute: boolean
  canVideo: boolean
  canScreenShare: boolean
  canRecord: boolean
  canKick: boolean
  canInvite: boolean
  canChat: boolean
  canRaiseHand: boolean
}

export const getCallPermissions = (role: 'host' | 'moderator' | 'participant', callType: CallType): CallPermissions => {
  const basePermissions: CallPermissions = {
    canMute: false,
    canVideo: true,
    canScreenShare: false,
    canRecord: false,
    canKick: false,
    canInvite: false,
    canChat: true,
    canRaiseHand: true
  }

  if (role === 'host') {
    return {
      ...basePermissions,
      canMute: true,
      canVideo: true,
      canScreenShare: true,
      canRecord: true,
      canKick: true,
      canInvite: true
    }
  }

  if (role === 'moderator') {
    return {
      ...basePermissions,
      canMute: true,
      canScreenShare: true,
      canInvite: true
    }
  }

  // Participant permissions vary by call type
  switch (callType) {
    case CallTypes.GROUP_STUDY:
      return {
        ...basePermissions,
        canScreenShare: true
      }
    case CallTypes.WORKSHOP:
      return {
        ...basePermissions,
        canScreenShare: true
      }
    case CallTypes.EXAM:
      return {
        ...basePermissions,
        canChat: false,
        canRaiseHand: false,
        canVideo: false
      }
    default:
      return basePermissions
  }
}

// Real-time event types
export interface ClassEvent {
  type: 'participant_joined' | 'participant_left' | 'message' | 'poll_started' | 'poll_ended' | 'screen_share' | 'recording_started' | 'recording_stopped'
  userId: string
  userName: string
  timestamp: Date
  data?: any
}

// Utility functions for class management
export const isClassActive = (scheduledAt: Date, duration: number): boolean => {
  const now = new Date()
  const endTime = new Date(scheduledAt.getTime() + (duration * 60 * 1000))
  return now >= scheduledAt && now <= endTime
}

export const getClassStatus = (scheduledAt: Date, duration: number): 'upcoming' | 'live' | 'ended' => {
  const now = new Date()
  const endTime = new Date(scheduledAt.getTime() + (duration * 60 * 1000))
  
  if (now < scheduledAt) return 'upcoming'
  if (now <= endTime) return 'live'
  return 'ended'
}