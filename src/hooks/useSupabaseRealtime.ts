'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase, Database, subscribeToTable, unsubscribeFromTable, isSupabaseConfigured } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

// Generic hook for real-time data fetching and synchronization
export function useRealtimeData<T extends keyof Database['public']['Tables']>(
  table: T,
  initialData: Database['public']['Tables'][T]['Row'][] = [],
  filters?: { [key: string]: any }
) {
  const [data, setData] = useState<Database['public']['Tables'][T]['Row'][]>(initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const subscriptionRef = useRef<RealtimeChannel | null>(null)
  const hasInitialized = useRef(false)

  const fetchData = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (!hasInitialized.current) {
      hasInitialized.current = true
      setLoading(true)
    }
    
    try {
      // Check if Supabase is properly configured
      if (!isSupabaseConfigured) {
        setData(initialData)
        setError(null) // No error - just using fallback
        setLoading(false)
        return
      }
      
      if (!supabase || typeof supabase.from !== 'function') {
        setData(initialData)
        setError(null) // No error - just using fallback
        setLoading(false)
        return
      }
      
      let query = supabase.from(table).select('*')
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value)
        })
      }
      
      const { data: fetchedData, error: fetchError } = await query.order('created_at', { ascending: false })
      
      if (fetchError) {
        // Silently handle specific Supabase errors (like the 403/404 notifications errors)
        if (fetchError.code === '403' || fetchError.code === '404' || 
            fetchError.message.includes('JWT') || fetchError.message.includes('RLS') ||
            fetchError.message.includes('authentication') || fetchError.message.includes('permission') ||
            fetchError.status === 403 || fetchError.status === 404) {
          // Authentication or permission error - use fallback data silently
          setData(initialData)
          setError(null)
          setLoading(false)
          return
        }
        throw fetchError
      }
      
      setData(fetchedData || [])
      setError(null)
    } catch (err) {
      // Silently handle all errors and use fallback data
      setError(null) // Don't expose errors to UI
      if (data.length === 0) {
        setData(initialData)
      }
    } finally {
      setLoading(false)
    }
  }, [table, JSON.stringify(filters), JSON.stringify(initialData)]) // Stringify complex objects for stable comparison

  useEffect(() => {
    // Only fetch data once when component mounts or when key dependencies change
    if (!hasInitialized.current) {
      fetchData()
    }

    // Only set up real-time subscription if Supabase is properly configured
    if (!isSupabaseConfigured || !supabase || typeof supabase.channel !== 'function') {
      // Silently skip realtime setup when not configured
      return
    }

    // Set up real-time subscription
    try {
      subscriptionRef.current = subscribeToTable(
        table,
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload

          setData(currentData => {
            switch (eventType) {
              case 'INSERT':
                return [newRecord, ...currentData]
              case 'UPDATE':
                return currentData.map(item => 
                  item.id === newRecord.id ? newRecord : item
                )
              case 'DELETE':
                return currentData.filter(item => item.id !== oldRecord.id)
              default:
                return currentData
            }
          })
        },
        filters
      )
    } catch (err) {
      // Silently handle subscription errors
    }

    return () => {
      if (subscriptionRef.current) {
        try {
          unsubscribeFromTable(subscriptionRef.current)
        } catch (err) {
          // Silently handle unsubscribe errors
        }
      }
    }
  }, [table, JSON.stringify(filters)]) // Remove fetchData from dependencies to prevent loops

  const insert = useCallback(async (newItem: Database['public']['Tables'][T]['Insert']) => {
    try {
      if (!isSupabaseConfigured || !supabase || typeof supabase.from !== 'function') {
        // Return mock response when not configured
        return { id: 'mock_' + Date.now(), ...newItem } as any
      }
      
      const { data: insertedData, error: insertError } = await supabase
        .from(table)
        .insert([newItem])
        .select()
        .single()

      if (insertError) {
        // Handle specific Supabase errors silently (403/404 status codes)
        if (insertError.code === '403' || insertError.code === '404' ||
            insertError.message.includes('JWT') || insertError.message.includes('RLS') ||
            insertError.message.includes('authentication') || insertError.message.includes('permission') ||
            insertError.status === 403 || insertError.status === 404) {
          return { id: 'fallback_' + Date.now(), ...newItem } as any
        }
        throw insertError
      }
      return insertedData
    } catch (err) {
      // Silently return fallback for any errors
      return { id: 'error_' + Date.now(), ...newItem } as any
    }
  }, [table])

  const update = useCallback(async (
    id: string, 
    updates: Database['public']['Tables'][T]['Update']
  ) => {
    try {
      if (!isSupabaseConfigured || !supabase || typeof supabase.from !== 'function') {
        // Return mock response when not configured
        return { id, ...updates } as any
      }
      
      const { data: updatedData, error: updateError } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) {
        // Handle specific Supabase errors silently (403/404 status codes)
        if (updateError.code === '403' || updateError.code === '404' ||
            updateError.message.includes('JWT') || updateError.message.includes('RLS') ||
            updateError.message.includes('authentication') || updateError.message.includes('permission') ||
            updateError.status === 403 || updateError.status === 404) {
          return { id, ...updates } as any
        }
        throw updateError
      }
      return updatedData
    } catch (err) {
      // Silently return fallback for any errors
      return { id, ...updates } as any
    }
  }, [table])

  const remove = useCallback(async (id: string) => {
    try {
      if (!isSupabaseConfigured || !supabase || typeof supabase.from !== 'function') {
        // Silently succeed when not configured
        return
      }
      
      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (deleteError) {
        // Handle specific Supabase errors silently (403/404 status codes)
        if (deleteError.code === '403' || deleteError.code === '404' ||
            deleteError.message.includes('JWT') || deleteError.message.includes('RLS') ||
            deleteError.message.includes('authentication') || deleteError.message.includes('permission') ||
            deleteError.status === 403 || deleteError.status === 404) {
          return // Silently succeed
        }
      }
    } catch (err) {
      // Silently handle all delete errors
    }
  }, [table])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    insert,
    update,
    remove
  }
}

// Specific hook for notifications
export function useNotifications(userId: string) {
  const {
    data: notifications,
    loading,
    error,
    insert,
    update,
    remove
  } = useRealtimeData('notifications', [], { user_id: userId })

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      return update(notificationId, { read: true })
    } catch (error: any) {
      // Silently handle 403/404 errors
      if (error?.code === '403' || error?.code === '404' || error?.status === 403 || error?.status === 404) {
        return { id: notificationId, read: true }
      }
      throw error
    }
  }, [update])

  const markAllAsRead = useCallback(async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read)
      const promises = unreadNotifications.map(n => markAsRead(n.id))
      return Promise.all(promises)
    } catch (error: any) {
      // Silently handle errors and return empty array
      return []
    }
  }, [notifications, markAsRead])

  const createNotification = useCallback(async (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    try {
      if (!isSupabaseConfigured) {
        return {
          id: 'mock_' + Date.now(),
          user_id: userId,
          title,
          message,
          type,
          read: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
      
      return await insert({
        user_id: userId,
        title,
        message,
        type
      })
    } catch (error: any) {
      // Handle 403/404 and other authentication errors silently
      if (error?.code === '403' || error?.code === '404' ||
          error?.message?.includes('JWT') || error?.message?.includes('RLS') ||
          error?.message?.includes('authentication')) {
        return {
          id: 'fallback_' + Date.now(),
          user_id: userId,
          title,
          message,
          type,
          read: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
      return null
    }
  }, [insert, userId])

  const unreadCount = notifications.filter(n => !n.read).length

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    createNotification,
    deleteNotification: remove
  }
}

// Specific hook for chat messages
export function useChatMessages(userId: string) {
  const [mockMessages, setMockMessages] = useState<any[]>([])
  const [mockLoading, setMockLoading] = useState(false)
  const [mockError, setMockError] = useState<string | null>(null)
  
  const {
    data: supabaseMessages,
    loading: supabaseLoading,
    error: supabaseError,
    insert,
    update
  } = useRealtimeData('chat_messages', [], { user_id: userId })

  // Use Supabase data if configured, otherwise use mock data
  const messages = isSupabaseConfigured ? supabaseMessages : mockMessages
  const loading = isSupabaseConfigured ? supabaseLoading : mockLoading
  const error = isSupabaseConfigured ? supabaseError : mockError

  const sendMessage = useCallback(async (message: string) => {
    if (!isSupabaseConfigured) {
      // Mock implementation for development/fallback
      setMockLoading(true)
      const newMessage = {
        id: 'mock_' + Date.now(),
        user_id: userId,
        message,
        ai_response: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      setMockMessages(prev => [newMessage, ...prev])
      setMockLoading(false)
      console.info('💬 Chat: Using local mode (Supabase not configured)')
      return newMessage
    }
    
    try {
      return await insert({
        user_id: userId,
        message
      })
    } catch (error) {
      console.info('💬 Chat service temporarily unavailable, using local mode')
      // Fallback to mock on error
      const newMessage = {
        id: 'fallback_' + Date.now(),
        user_id: userId,
        message,
        ai_response: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setMockMessages(prev => [newMessage, ...prev])
      return newMessage
    }
  }, [insert, userId])

  const updateWithAIResponse = useCallback(async (messageId: string, aiResponse: string) => {
    if (!isSupabaseConfigured || messageId.startsWith('mock_') || messageId.startsWith('fallback_')) {
      // Mock implementation
      setMockMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, ai_response: aiResponse, updated_at: new Date().toISOString() }
            : msg
        )
      )
      console.info('💬 AI response added locally')
      return { id: messageId, ai_response: aiResponse }
    }
    
    try {
      return await update(messageId, { ai_response: aiResponse })
    } catch (error) {
      console.info('💬 Chat update temporarily unavailable, using local mode')
      // Fallback to mock on error
      setMockMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, ai_response: aiResponse, updated_at: new Date().toISOString() }
            : msg
        )
      )
      return { id: messageId, ai_response: aiResponse }
    }
  }, [update])

  return {
    messages,
    loading,
    error: null, // Never show error, always provide fallback
    sendMessage,
    updateWithAIResponse
  }
}

// Specific hook for user activities
export function useUserActivities(userId: string) {
  const {
    data: activities,
    loading,
    error,
    insert
  } = useRealtimeData('user_activities', [], { user_id: userId })

  const logActivity = useCallback(async (
    activityType: string,
    activityData: any = {}
  ) => {
    try {
      return await insert({
        user_id: userId,
        activity_type: activityType,
        activity_data: activityData
      })
    } catch (error) {
      console.debug('Activity logging skipped: Supabase not configured')
      return null // Return null instead of throwing to prevent uncaught errors
    }
  }, [insert, userId])

  return {
    activities,
    loading,
    error,
    logActivity
  }
}

// Specific hook for study sessions
export function useStudySessions(userId: string) {
  const {
    data: sessions,
    loading,
    error,
    insert,
    update
  } = useRealtimeData('study_sessions', [], { user_id: userId })

  const startSession = useCallback(async (subject: string) => {
    try {
      return await insert({
        user_id: userId,
        subject,
        status: 'active',
        started_at: new Date().toISOString()
      })
    } catch (error) {
      console.debug('Session start skipped: Supabase not configured')
      return null
    }
  }, [insert, userId])

  const endSession = useCallback(async (sessionId: string, duration: number) => {
    try {
      return await update(sessionId, {
        status: 'completed',
        duration,
        ended_at: new Date().toISOString()
      })
    } catch (error) {
      console.debug('Session end skipped: Supabase not configured')
      return null
    }
  }, [update])

  const pauseSession = useCallback(async (sessionId: string, duration: number) => {
    try {
      return await update(sessionId, {
        status: 'paused',
        duration
      })
    } catch (error) {
      console.debug('Session pause skipped: Supabase not configured')
      return null
    }
  }, [update])

  const resumeSession = useCallback(async (sessionId: string) => {
    try {
      return await update(sessionId, {
        status: 'active'
      })
    } catch (error) {
      console.debug('Session resume skipped: Supabase not configured')
      return null
    }
  }, [update])

  const activeSessions = sessions.filter(s => s.status === 'active')
  const completedSessions = sessions.filter(s => s.status === 'completed')

  return {
    sessions,
    activeSessions,
    completedSessions,
    loading,
    error,
    startSession,
    endSession,
    pauseSession,
    resumeSession
  }
}

// Hook for real-time connection status
export function useRealtimeStatus() {
  const [isConnected, setIsConnected] = useState(isSupabaseConfigured)
  const [connectionCount, setConnectionCount] = useState(0)

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase || typeof supabase.channel !== 'function') {
      console.warn('Supabase not properly configured. Connection status unavailable.')
      setIsConnected(false)
      return
    }

    let channel: any = null
    
    try {
      channel = supabase.channel('connection_status')
      
      channel
        .on('presence', { event: 'sync' }, () => {
          const newState = channel.presenceState()
          setConnectionCount(Object.keys(newState).length)
        })
        .on('presence', { event: 'join' }, ({ key, newPresences }: any) => {
          setIsConnected(true)
        })
        .on('presence', { event: 'leave' }, ({ key, leftPresences }: any) => {
          setIsConnected(false)
        })
        .subscribe(async (status: string) => {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true)
            await channel.track({
              user_id: 'anonymous',
              online_at: new Date().toISOString(),
            })
          }
        })
    } catch (error) {
      console.warn('Failed to set up connection status:', error)
      setIsConnected(false)
    }

    return () => {
      if (channel && supabase && typeof supabase.removeChannel === 'function') {
        try {
          supabase.removeChannel(channel)
        } catch (error) {
          console.warn('Failed to cleanup connection status:', error)
        }
      }
    }
  }, [])

  return {
    isConnected: isSupabaseConfigured && isConnected,
    connectionCount
  }
}

// Hook for handling optimistic updates
export function useOptimisticUpdate<T>(
  currentData: T[],
  updateFn: (newItem: T) => Promise<T>,
  keyField: keyof T = 'id' as keyof T
) {
  const [optimisticData, setOptimisticData] = useState<T[]>(currentData)

  useEffect(() => {
    setOptimisticData(currentData)
  }, [currentData])

  const optimisticUpdate = useCallback(async (newItem: T) => {
    // Add optimistic update immediately
    setOptimisticData(prev => [newItem, ...prev])

    try {
      // Perform actual update
      const result = await updateFn(newItem)
      
      // Replace optimistic item with real result
      setOptimisticData(prev => 
        prev.map(item => 
          item[keyField] === newItem[keyField] ? result : item
        )
      )
      
      return result
    } catch (error) {
      // Remove optimistic update on error
      setOptimisticData(prev => 
        prev.filter(item => item[keyField] !== newItem[keyField])
      )
      throw error
    }
  }, [updateFn, keyField])

  return {
    data: optimisticData,
    optimisticUpdate
  }
}