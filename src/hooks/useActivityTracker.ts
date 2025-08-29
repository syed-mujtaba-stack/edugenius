'use client'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/lib/firebase'
import { supabaseUserStatsService } from '@/lib/supabaseUserStatsService'
import { useToast } from '@/hooks/use-toast'

export function useActivityTracker() {
  const [user] = useAuthState(auth)
  const { toast } = useToast()

  const trackActivity = async (activityType: string, activityData: any = {}) => {
    if (!user?.uid) return

    try {
      await supabaseUserStatsService.logActivity(user.uid, {
        activity_type: activityType as any,
        activity_data: activityData
      })
    } catch (error) {
      console.log('Activity tracking failed (non-blocking):', error)
    }
  }

  // Specific tracking methods
  const trackTestCompletion = async (subject: string, score: number, difficulty: 'easy' | 'medium' | 'hard' = 'medium') => {
    await trackActivity('test_completed', { subject, score, difficulty })
    
    // Show encouraging toast
    if (score >= 90) {
      toast({
        title: 'Excellent work! 🌟',
        description: `You scored ${score}% on ${subject}. Outstanding performance!`
      })
    } else if (score >= 75) {
      toast({
        title: 'Great job! 👏',
        description: `You scored ${score}% on ${subject}. Keep it up!`
      })
    } else {
      toast({
        title: 'Good effort! 💪',
        description: `You scored ${score}% on ${subject}. Practice makes perfect!`
      })
    }
  }

  const trackSummaryCreation = async (subject: string, chapterTitle?: string) => {
    await trackActivity('summary_created', { subject, chapterTitle })
    toast({
      title: 'Summary created! 📋',
      description: `Your ${subject} summary has been saved.`
    })
  }

  const trackChapterRead = async (chapterTitle: string, subject: string) => {
    await trackActivity('chapter_read', { chapterTitle, subject })
  }

  const trackVideoWatched = async (videoTitle: string, duration?: number) => {
    await trackActivity('video_watched', { videoTitle, duration })
  }

  const trackLogin = async () => {
    await trackActivity('login', {})
  }

  return {
    trackActivity,
    trackTestCompletion,
    trackSummaryCreation,
    trackChapterRead,
    trackVideoWatched,
    trackLogin
  }
}