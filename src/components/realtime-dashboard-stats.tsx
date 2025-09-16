'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useUserStats } from '@/hooks/useUserStats'
import { 
  FileText, 
  Target, 
  BookOpen, 
  Flame, 
  Clock, 
  TrendingUp,
  Users,
  PlayCircle,
  PlusCircle,
  Trophy,
  Calendar,
  BarChart3
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useToast } from '@/hooks/use-toast'
import { QuickTest } from './quick-test/QuickTest'

interface RealtimeDashboardStatsProps {
  userId: string
}

export function RealtimeDashboardStats({ userId }: RealtimeDashboardStatsProps) {
  const {
    stats,
    recentActivities,
    monthlyProgress,
    weeklyProgress,
    derivedStats,
    loading,
    error,
    completeTest,
    createSummary,
    startStudySession,
    endStudySession,
    refreshStats
  } = useUserStats()
  
  const [currentSession, setCurrentSession] = useState<string | null>(null)
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null)
  const [sessionDuration, setSessionDuration] = useState<number>(0)
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false)
  const [showQuickTest, setShowQuickTest] = useState<boolean>(false)
  const { toast } = useToast()

  // Update session timer
  useEffect(() => {
    if (currentSession && sessionStartTime) {
      const timer = setInterval(() => {
        const duration = Math.floor((Date.now() - sessionStartTime.getTime()) / 1000 / 60)
        setSessionDuration(duration)
      }, 60000) // Update every minute

      return () => clearInterval(timer)
    }
  }, [currentSession, sessionStartTime])

  const handleStartSession = async () => {
    const sessionId = await startStudySession('General Study')
    if (sessionId) {
      setCurrentSession(sessionId)
      setSessionStartTime(new Date())
      setSessionDuration(0)
      toast({
        title: 'Study session started! 📚',
        description: 'Your study time is being tracked.'
      })
    }
  }

  const handleEndSession = async () => {
    if (currentSession) {
      await endStudySession(currentSession)
      setCurrentSession(null)
      setSessionStartTime(null)
      setSessionDuration(0)
      toast({
        title: 'Study session completed! 🎉',
        description: `Great job! Session duration: ${sessionDuration} minutes`
      })
    }
  }

  const handleQuickTestComplete = async (score: number) => {
    await completeTest('Quick Assessment', score, 'medium')
    toast({
      title: 'Test completed! 📝',
      description: `Score: ${score}%. Great work!`
    })
  }

  const handleQuickSummary = async () => {
    await createSummary('Study Notes', 'General')
    toast({
      title: 'Summary created! 📋',
      description: 'Your study notes have been saved.'
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
        <CardContent className="p-6">
          <div className="text-center text-red-600 dark:text-red-400">
            <p className="mb-2">Failed to load your statistics</p>
            <Button onClick={refreshStats} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with Quick Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Live Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Badge variant={stats ? "secondary" : "destructive"} className="text-xs">
            {stats ? `Active User` : 'Loading...'}
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
        <Button 
          onClick={() => setShowQuickTest(true)} 
          variant="outline" 
          size="sm"
          className="h-auto p-3 flex flex-col items-center space-y-1"
        >
          <FileText className="h-4 w-4" />
          <span className="text-xs">Quick Test</span>
        </Button>
        
        {/* Quick Test Dialog */}
      {showQuickTest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowQuickTest(false)}>
          <div className="bg-background rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <QuickTest 
              onCompleteAction={handleQuickTestComplete}
              onCloseAction={() => setShowQuickTest(false)}
            />
          </div>
        </div>
      )}
        
        <Button 
          onClick={handleQuickSummary} 
          variant="outline" 
          size="sm"
          className="h-auto p-3 flex flex-col items-center space-y-1"
        >
          <BookOpen className="h-4 w-4" />
          <span className="text-xs">Add Summary</span>
        </Button>
        
        <Button 
          onClick={currentSession ? handleEndSession : handleStartSession} 
          variant={currentSession ? "destructive" : "default"}
          size="sm"
          className="h-auto p-3 flex flex-col items-center space-y-1"
        >
          <Clock className="h-4 w-4" />
          <span className="text-xs">
            {currentSession ? 'End Session' : 'Start Session'}
          </span>
        </Button>
        
        <Button 
          onClick={refreshStats} 
          variant="outline" 
          size="sm"
          className="h-auto p-3 flex flex-col items-center space-y-1"
        >
          <TrendingUp className="h-4 w-4" />
          <span className="text-xs">Refresh</span>
        </Button>
      </div>

      {/* Current Study Session */}
      {currentSession && (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <PlayCircle className="h-4 w-4 text-green-500" />
              <span>Active Study Session</span>
              <Badge variant="secondary" className="animate-pulse bg-green-100 text-green-700">Live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Duration:</span>
                <span className="font-medium">{sessionDuration} minutes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Started:</span>
                <span className="text-sm">
                  {sessionStartTime && formatDistanceToNow(sessionStartTime, { addSuffix: true })}
                </span>
              </div>
              <Progress value={Math.min((sessionDuration / 60) * 100, 100)} className="mt-2" />
              <p className="text-xs text-muted-foreground">Study goal: 60 minutes</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Taken</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.tests_completed || 0}</div>
            <div className="flex items-center space-x-1">
              <span className={`text-xs ${
                derivedStats.monthlyTestsChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {derivedStats.monthlyTestsChange >= 0 ? '+' : ''}{derivedStats.monthlyTestsChange} since last month
              </span>
            </div>
            <div className="mt-1">
              <Badge 
                variant={derivedStats.testPerformance === 'excellent' ? 'default' : 'secondary'} 
                className="text-xs"
              >
                {derivedStats.testPerformance.replace('_', ' ')}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{derivedStats.averageScore}%</div>
            <div className="flex items-center space-x-1">
              <span className={`text-xs ${
                derivedStats.monthlyScoreChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {derivedStats.monthlyScoreChange >= 0 ? '+' : ''}{derivedStats.monthlyScoreChange}% from last month
              </span>
            </div>
            <div className="mt-1">
              <Progress value={derivedStats.averageScore} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Summaries Created</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.summaries_created || 0}</div>
            <div className="flex items-center space-x-1">
              <span className={`text-xs ${
                derivedStats.weeklySummariesChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {derivedStats.weeklySummariesChange >= 0 ? '+' : ''}{derivedStats.weeklySummariesChange} since last week
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center space-x-1">
              <span>{stats?.study_streak_days || 0}</span>
              <span className="text-sm text-muted-foreground">Days</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs text-muted-foreground">
                {derivedStats.isActiveToday ? 'Active today! 🔥' : 'Study today to continue streak'}
              </span>
            </div>
            <div className="mt-1">
              <Badge 
                variant={derivedStats.studyConsistency === 'excellent' ? 'default' : 'secondary'} 
                className="text-xs"
              >
                {derivedStats.studyConsistency} consistency
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Study Progress Summary */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Study Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Study Time:</span>
              <span className="font-medium">{derivedStats.totalStudyHours} hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Average Score:</span>
              <span className="font-medium">{derivedStats.averageScore}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Performance:</span>
              <Badge variant="outline" className="text-xs">
                {derivedStats.testPerformance.replace('_', ' ')}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Consistency:</span>
              <Badge variant="outline" className="text-xs">
                {derivedStats.studyConsistency}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.length > 0 ? (
                recentActivities.slice(0, 5).map((activity, index) => (
                  <div key={activity.id || index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {activity.activity_type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                        {activity.activity_data?.score && (
                          <span className="text-green-600 ml-1">({activity.activity_data.score}%)</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.created_at || ''), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <Trophy className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                  <p className="text-xs text-muted-foreground">Start studying to track your progress!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}