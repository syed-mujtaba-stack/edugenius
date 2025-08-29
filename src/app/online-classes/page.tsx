'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/lib/firebase'
import { ClassManager } from '@/components/class-manager'
import { OnlineClassroom } from '@/components/online-classroom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Video, BookOpen } from 'lucide-react'

export default function OnlineClassesPage() {
  const [user, loading, error] = useAuthState(auth)
  const [currentView, setCurrentView] = useState<'manager' | 'classroom'>('manager')
  const [currentCallId, setCurrentCallId] = useState<string>('')
  const [currentClassName, setCurrentClassName] = useState<string>('')
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if user should join a specific class from URL parameters
  useEffect(() => {
    const joinCallId = searchParams.get('join')
    const className = searchParams.get('class')
    
    if (joinCallId) {
      setCurrentCallId(joinCallId)
      setCurrentClassName(className || 'Online Class')
      setCurrentView('classroom')
    }
  }, [searchParams])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/online-classes')
    }
  }, [user, loading, router])

  const handleJoinClass = (callId: string, className: string) => {
    setCurrentCallId(callId)
    setCurrentClassName(className)
    setCurrentView('classroom')
    
    // Update URL to reflect the current class
    const url = new URL(window.location.href)
    url.searchParams.set('join', callId)
    url.searchParams.set('class', className)
    window.history.pushState({}, '', url.toString())
  }

  const handleLeaveClass = () => {
    setCurrentView('manager')
    setCurrentCallId('')
    setCurrentClassName('')
    
    // Clear URL parameters
    const url = new URL(window.location.href)
    url.searchParams.delete('join')
    url.searchParams.delete('class')
    window.history.pushState({}, '', url.toString())
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-red-500 mb-4">Authentication error occurred</p>
            <Button onClick={() => router.push('/login')}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  if (currentView === 'classroom' && currentCallId) {
    return (
      <OnlineClassroom
        callId={currentCallId}
        className={currentClassName}
        userId={user.uid}
        userName={user.displayName || user.email || 'Student'}
        onLeaveClass={handleLeaveClass}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <div className="flex items-center space-x-2">
              <Video className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">Online Classes</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome to Online Classes</h2>
              <p className="text-muted-foreground">
                Join live classes, create study sessions, or schedule teaching sessions
              </p>
            </div>
            <div className="hidden md:block">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Live Classes Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>Interactive Learning</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <Video className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">2</p>
              <p className="text-sm text-muted-foreground">Live Classes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-muted-foreground">Subjects Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-sm font-bold">24</span>
              </div>
              <p className="text-2xl font-bold">24/7</p>
              <p className="text-sm text-muted-foreground">Access Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-sm">👥</span>
              </div>
              <p className="text-2xl font-bold">150+</p>
              <p className="text-sm text-muted-foreground">Students Online</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Class Manager */}
        <ClassManager
          userId={user.uid}
          userName={user.displayName || user.email || 'Student'}
          onJoinClassAction={handleJoinClass}
        />

        {/* Footer Info */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">💡 Getting Started</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Join existing live classes</li>
                  <li>• Create your own study sessions</li>
                  <li>• Schedule classes for later</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🎯 Features Available</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• HD video and audio</li>
                  <li>• Screen sharing</li>
                  <li>• Interactive chat</li>
                  <li>• Participant management</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">📚 Subjects</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Mathematics & Physics</li>
                  <li>• English & Urdu</li>
                  <li>• Computer Science</li>
                  <li>• And many more...</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}