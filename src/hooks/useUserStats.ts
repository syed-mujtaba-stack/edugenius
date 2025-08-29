'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/lib/firebase'
import supabaseUserStatsService, { UserStats, UserActivity } from '@/lib/supabaseUserStatsService'

export function useUserStats() {
  const [user] = useAuthState(auth)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [recentActivities, setRecentActivities] = useState<UserActivity[]>([])
  const [monthlyProgress, setMonthlyProgress] = useState<any>(null)
  const [weeklyProgress, setWeeklyProgress] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load user stats
  const loadUserStats = useCallback(async () => {
    if (!user?.uid) return

    try {
      setLoading(true)
      setError(null)

      const [userStats, activities, monthly, weekly] = await Promise.all([
        supabaseUserStatsService.getUserStats(user.uid),
        supabaseUserStatsService.getRecentActivities(user.uid, 5),
        supabaseUserStatsService.getMonthlyProgress(user.uid),
        supabaseUserStatsService.getWeeklyProgress(user.uid)
      ])

      setStats(userStats)
      setRecentActivities(activities)
      setMonthlyProgress(monthly)
      setWeeklyProgress(weekly)
    } catch (err) {
      console.error('Error loading user stats:', err)
      setError(err instanceof Error ? err.message : 'Failed to load stats')
    } finally {
      setLoading(false)
    }
  }, [user?.uid])

  // Log activity
  const logActivity = useCallback(async (
    activityType: 'test_completed' | 'summary_created' | 'study_session' | 'login' | 'chapter_read' | 'video_watched',
    activityData: any
  ) => {
    if (!user?.uid) return

    try {
      await supabaseUserStatsService.logActivity(user.uid, {
        activity_type: activityType,
        activity_data: activityData
      })
      
      // Reload stats after logging activity
      await loadUserStats()
    } catch (err) {
      console.error('Error logging activity:', err)
      setError(err instanceof Error ? err.message : 'Failed to log activity')
    }
  }, [user?.uid, loadUserStats])

  // Complete test
  const completeTest = useCallback(async (subject: string, score: number, difficulty: 'easy' | 'medium' | 'hard' = 'medium') => {
    return logActivity('test_completed', {
      subject,
      score,
      difficulty
    })
  }, [logActivity])

  // Create summary
  const createSummary = useCallback(async (chapterTitle: string, subject: string) => {
    return logActivity('summary_created', {
      chapterTitle,
      subject
    })
  }, [logActivity])

  // Start study session
  const startStudySession = useCallback(async (subject: string) => {
    if (!user?.uid) return null

    try {
      const sessionId = await supabaseUserStatsService.startStudySession(user.uid, subject)
      return sessionId
    } catch (err) {
      console.error('Error starting study session:', err)
      setError(err instanceof Error ? err.message : 'Failed to start study session')
      return null
    }
  }, [user?.uid])

  // End study session
  const endStudySession = useCallback(async (sessionId: string, score?: number) => {
    try {
      await supabaseUserStatsService.endStudySession(sessionId, score)
      await loadUserStats()
    } catch (err) {
      console.error('Error ending study session:', err)
      setError(err instanceof Error ? err.message : 'Failed to end study session')
    }
  }, [loadUserStats])

  // Watch video
  const watchVideo = useCallback(async (videoTitle: string, duration: number, subject: string) => {
    return logActivity('video_watched', {
      videoTitle,
      duration,
      subject
    })
  }, [logActivity])

  // Read chapter
  const readChapter = useCallback(async (chapterTitle: string, subject: string, duration: number) => {
    return logActivity('chapter_read', {
      chapterTitle,
      subject,
      duration
    })
  }, [logActivity])

  // Log login
  const logLogin = useCallback(async () => {
    return logActivity('login', {})
  }, [logActivity])

  // Calculate derived stats
  const derivedStats = {
    averageScore: stats && stats.tests_completed > 0 
      ? Math.round(stats.total_score / stats.tests_completed) 
      : 0,
    
    monthlyTestsChange: monthlyProgress?.changes?.testsChange || 0,
    monthlyScoreChange: monthlyProgress?.changes?.scoreChange || 0,
    weeklySummariesChange: weeklyProgress?.change || 0,
    
    totalStudyHours: stats ? Math.round(stats.total_study_time / 60 * 10) / 10 : 0,
    
    isActiveToday: stats ? stats.last_activity_date === new Date().toISOString().split('T')[0] : false,
    
    // Performance indicators
    testPerformance: stats && stats.tests_completed > 0 ? (
      stats.total_score / stats.tests_completed >= 80 ? 'excellent' :
      stats.total_score / stats.tests_completed >= 70 ? 'good' :
      stats.total_score / stats.tests_completed >= 60 ? 'average' : 'needs_improvement'
    ) : 'no_data',
    
    studyConsistency: stats ? (
      stats.study_streak_days >= 7 ? 'excellent' :
      stats.study_streak_days >= 3 ? 'good' :
      stats.study_streak_days >= 1 ? 'average' : 'low'
    ) : 'no_data'
  }

  // Load stats when user changes
  useEffect(() => {
    if (user?.uid) {
      loadUserStats()
      // Log login when user stats are loaded
      logLogin()
    }
  }, [user?.uid, loadUserStats, logLogin])

  return {
    // Data
    user,
    stats,
    recentActivities,
    monthlyProgress,
    weeklyProgress,
    derivedStats,
    
    // State
    loading,
    error,
    
    // Actions
    loadUserStats,
    logActivity,
    completeTest,
    createSummary,
    startStudySession,
    endStudySession,
    watchVideo,
    readChapter,
    logLogin,
    
    // Helpers
    refreshStats: loadUserStats
  }
}