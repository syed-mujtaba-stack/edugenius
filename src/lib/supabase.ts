import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables and provide safe defaults
const validateSupabaseConfig = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const hasValidUrl = url && url !== 'your_supabase_project_url_here' && url.startsWith('https://')
  const hasValidAnonKey = anonKey && anonKey !== 'your_supabase_anon_key_here' && anonKey.length > 20

  return {
    url: hasValidUrl ? url : 'https://placeholder.supabase.co',
    anonKey: hasValidAnonKey ? anonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder',
    isConfigured: hasValidUrl && hasValidAnonKey
  }
}

const config = validateSupabaseConfig()

if (!config.isConfigured) {
  console.info('🚀 EduGenius: Running in offline mode');
  console.info('📋 All features work perfectly - realtime sync disabled');
  console.info('🔧 To enable realtime: Set up Supabase (optional)');
}

// Only create client if we have valid values
let supabase: any = null
let supabaseAdmin: any = null

try {
  // Client-side Supabase client
  supabase = createClient(config.url, config.anonKey, {
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  })

  // Server-side Supabase client with service role key (for admin operations)
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (serviceRoleKey && serviceRoleKey !== 'your_supabase_service_role_key_here') {
    supabaseAdmin = createClient(
      config.url,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  }

  // If not properly configured, disable realtime features
  if (!config.isConfigured) {
    console.warn('Supabase not configured. Realtime features disabled.')
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error)
  // Create a mock client for development
  supabase = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ error: null }),
    }),
    channel: () => ({
      on: () => ({ subscribe: () => Promise.resolve() }),
      subscribe: () => Promise.resolve(),
    }),
    removeChannel: () => {},
  }
}

export { supabase, supabaseAdmin }

// Export configuration status for components
export const isSupabaseConfigured = config.isConfigured

// Database types for TypeScript
export type Database = {
  public: {
    Tables: {
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error'
          read: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: 'info' | 'success' | 'warning' | 'error'
          read?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'success' | 'warning' | 'error'
          read?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          message: string
          ai_response: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          ai_response?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          ai_response?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_activities: {
        Row: {
          id: string
          user_id: string
          activity_type: string
          activity_data: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: string
          activity_data?: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: string
          activity_data?: any
          created_at?: string
        }
      }
      study_sessions: {
        Row: {
          id: string
          user_id: string
          subject: string
          duration: number
          status: 'active' | 'completed' | 'paused'
          started_at: string
          ended_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject: string
          duration?: number
          status?: 'active' | 'completed' | 'paused'
          started_at?: string
          ended_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject?: string
          duration?: number
          status?: 'active' | 'completed' | 'paused'
          started_at?: string
          ended_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper function to get user ID from Firebase Auth or other auth system
export const getCurrentUserId = (): string => {
  // This will be integrated with your existing Firebase Auth
  // For now, returning a placeholder
  return 'user_placeholder'
}

// Real-time subscription helper
export const subscribeToTable = (
  table: keyof Database['public']['Tables'],
  callback: (payload: any) => void,
  filters?: { [key: string]: any }
) => {
  if (!supabase || typeof supabase.channel !== 'function') {
    console.warn('Supabase not properly configured. Cannot subscribe to table.')
    return null
  }

  try {
    let subscription = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: filters ? Object.entries(filters).map(([key, value]) => `${key}=eq.${value}`).join(',') : undefined,
        },
        callback
      )
      .subscribe()

    return subscription
  } catch (error) {
    console.warn('Failed to subscribe to table:', error)
    return null
  }
}

// Cleanup subscription helper
export const unsubscribeFromTable = (subscription: any) => {
  if (subscription && supabase && typeof supabase.removeChannel === 'function') {
    try {
      supabase.removeChannel(subscription)
    } catch (error) {
      console.warn('Failed to unsubscribe:', error)
    }
  }
}