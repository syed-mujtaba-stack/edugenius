'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, Users, Video, Plus, BookOpen, Globe, Lock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { generateCallId, CallTypes, type CallType } from '@/lib/getstream'

interface OnlineClass {
  id: string
  title: string
  description: string
  subject: string
  callId: string
  callType: CallType
  scheduledAt: Date
  duration: number
  maxParticipants: number
  isPublic: boolean
  status: 'scheduled' | 'live' | 'ended'
  createdAt: Date
  teacherName: string
  participants: number
}

interface ClassManagerProps {
  userId: string
  userName: string
  onJoinClassAction: (callId: string, className: string) => void
}

export function ClassManager({ userId, userName, onJoinClassAction }: ClassManagerProps) {
  const [classes, setClasses] = useState<OnlineClass[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Form state for creating new class
  const [newClass, setNewClass] = useState({
    title: '',
    description: '',
    subject: '',
    callType: 'live_class' as CallType,
    scheduledAt: '',
    scheduledTime: '',
    duration: 60,
    maxParticipants: 50,
    isPublic: true
  })

  // Load existing classes (mock data for now)
  useEffect(() => {
    loadClasses()
  }, [])

  const loadClasses = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would fetch from your backend/Supabase
      // For now, using mock data
      const mockClasses: OnlineClass[] = [
        {
          id: '1',
          title: 'Mathematics - Algebra Basics',
          description: 'Learn fundamental concepts of algebra including equations and variables',
          subject: 'Mathematics',
          callId: 'class_math_algebra_basics',
          callType: 'live_class',
          scheduledAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
          duration: 60,
          maxParticipants: 30,
          isPublic: true,
          status: 'scheduled',
          createdAt: new Date(),
          teacherName: 'Mr. Ahmed Khan',
          participants: 12
        },
        {
          id: '2',
          title: 'English Literature Discussion',
          description: 'Interactive discussion on Pakistani poets and their contributions',
          subject: 'English',
          callId: 'class_english_literature',
          callType: 'group_study',
          scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
          duration: 90,
          maxParticipants: 20,
          isPublic: true,
          status: 'scheduled',
          createdAt: new Date(),
          teacherName: 'Ms. Fatima Ali',
          participants: 8
        }
      ]
      
      setClasses(mockClasses)
      
      // Check for any live classes
      const liveClasses = mockClasses.filter(cls => cls.status === 'live')
      if (liveClasses.length > 0) {
        toast({
          title: `${liveClasses.length} Live Classes`,
          description: 'There are classes happening right now!'
        })
      }
    } catch (error) {
      console.error('Error loading classes:', error)
      toast({
        title: 'Error',
        description: 'Failed to load classes',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createClass = async () => {
    if (!newClass.title.trim() || !newClass.subject.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in class title and subject',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)
    try {
      const scheduledDateTime = new Date(`${newClass.scheduledAt}T${newClass.scheduledTime}`)
      
      // Validate the created date
      if (isNaN(scheduledDateTime.getTime())) {
        toast({
          title: 'Invalid Date',
          description: 'Please enter a valid date and time',
          variant: 'destructive'
        })
        setIsLoading(false)
        return
      }
      
      if (scheduledDateTime <= new Date()) {
        toast({
          title: 'Invalid Schedule',
          description: 'Please schedule the class for a future date and time',
          variant: 'destructive'
        })
        setIsLoading(false)
        return
      }

      const callId = generateCallId(newClass.title)
      
      const classData: OnlineClass = {
        id: Date.now().toString(),
        title: newClass.title,
        description: newClass.description,
        subject: newClass.subject,
        callId,
        callType: newClass.callType,
        scheduledAt: scheduledDateTime,
        duration: newClass.duration,
        maxParticipants: newClass.maxParticipants,
        isPublic: newClass.isPublic,
        status: 'scheduled',
        createdAt: new Date(),
        teacherName: userName,
        participants: 0
      }

      // In a real app, save to backend/Supabase here
      setClasses(prev => [classData, ...prev])
      
      toast({
        title: 'Class Created!',
        description: `${newClass.title} has been scheduled successfully`
      })

      // Reset form
      setNewClass({
        title: '',
        description: '',
        subject: '',
        callType: 'live_class',
        scheduledAt: '',
        scheduledTime: '',
        duration: 60,
        maxParticipants: 50,
        isPublic: true
      })
      
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error('Error creating class:', error)
      toast({
        title: 'Error',
        description: 'Failed to create class',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const joinClass = (classData: OnlineClass) => {
    if (classData.participants >= classData.maxParticipants) {
      toast({
        title: 'Class Full',
        description: 'This class has reached maximum capacity',
        variant: 'destructive'
      })
      return
    }

    // Update participant count
    setClasses(prev => prev.map(cls => 
      cls.id === classData.id 
        ? { ...cls, participants: cls.participants + 1, status: 'live' as const }
        : cls
    ))

    onJoinClassAction(classData.callId, classData.title)
  }

  const getStatusColor = (status: OnlineClass['status']) => {
    switch (status) {
      case 'live': return 'bg-green-500'
      case 'scheduled': return 'bg-blue-500'
      case 'ended': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getCallTypeLabel = (type: CallType) => {
    switch (type) {
      case 'live_class': return 'Live Class'
      case 'tutorial': return 'Tutorial'
      case 'group_study': return 'Group Study'
      case 'one_on_one': return 'One-on-One'
      default: return 'Class'
    }
  }

  const formatDateTime = (date: Date) => {
    try {
      // Validate that date is a valid Date object
      if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
        return 'Invalid date'
      }
      
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(date)
    } catch (error) {
      console.error('Error formatting date:', error, date)
      return 'Invalid date'
    }
  }

  const isClassStartingSoon = (scheduledAt: Date) => {
    try {
      // Validate that scheduledAt is a valid Date object
      if (!scheduledAt || !(scheduledAt instanceof Date) || isNaN(scheduledAt.getTime())) {
        return false
      }
      
      const timeDiff = scheduledAt.getTime() - Date.now()
      return timeDiff > 0 && timeDiff <= 15 * 60 * 1000 // Starting within 15 minutes
    } catch (error) {
      console.error('Error checking class start time:', error, scheduledAt)
      return false
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Online Classes</h2>
          <p className="text-muted-foreground">Join live classes or create your own</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Class
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Online Class</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Class Title</Label>
                  <Input
                    id="title"
                    value={newClass.title}
                    onChange={(e) => setNewClass({...newClass, title: e.target.value})}
                    placeholder="e.g., Mathematics - Algebra Basics"
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={newClass.subject}
                    onChange={(e) => setNewClass({...newClass, subject: e.target.value})}
                    placeholder="e.g., Mathematics"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newClass.description}
                  onChange={(e) => setNewClass({...newClass, description: e.target.value})}
                  placeholder="Brief description of what will be covered..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="callType">Class Type</Label>
                  <Select value={newClass.callType} onValueChange={(value) => setNewClass({...newClass, callType: value as CallType})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="live_class">Live Class</SelectItem>
                      <SelectItem value="tutorial">Tutorial</SelectItem>
                      <SelectItem value="group_study">Group Study</SelectItem>
                      <SelectItem value="one_on_one">One-on-One</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={newClass.maxParticipants.toString()}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1
                      setNewClass({...newClass, maxParticipants: value})
                    }}
                    min="1"
                    max="100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="scheduledAt">Date</Label>
                  <Input
                    id="scheduledAt"
                    type="date"
                    value={newClass.scheduledAt}
                    onChange={(e) => setNewClass({...newClass, scheduledAt: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="scheduledTime">Time</Label>
                  <Input
                    id="scheduledTime"
                    type="time"
                    value={newClass.scheduledTime}
                    onChange={(e) => setNewClass({...newClass, scheduledTime: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newClass.duration.toString()}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 15
                      setNewClass({...newClass, duration: value})
                    }}
                    min="15"
                    max="480"
                  />
                </div>
              </div>

              <Button onClick={createClass} disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Class'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Classes Grid */}
      {isLoading && classes.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading classes...</p>
        </div>
      ) : classes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Classes Yet</h3>
            <p className="text-muted-foreground mb-4">Create your first online class to get started</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Class
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((classData) => (
            <Card key={classData.id} className={(
              classData.scheduledAt instanceof Date && 
              !isNaN(classData.scheduledAt.getTime()) && 
              isClassStartingSoon(classData.scheduledAt)
            ) ? 'ring-2 ring-orange-500' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant={classData.status === 'live' ? 'default' : 'secondary'} className={getStatusColor(classData.status)}>
                    {classData.status === 'live' && '🔴 '}{classData.status.toUpperCase()}
                  </Badge>
                  <Badge variant="outline">
                    {getCallTypeLabel(classData.callType)}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{classData.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {classData.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {classData.description}
                  </p>
                )}
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{classData.subject}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {classData.scheduledAt instanceof Date && !isNaN(classData.scheduledAt.getTime()) 
                        ? formatDateTime(classData.scheduledAt)
                        : 'Date TBD'
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{classData.duration} minutes</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{classData.participants}/{classData.maxParticipants} participants</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {classData.isPublic ? (
                      <>
                        <Globe className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Public</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 text-orange-600" />
                        <span className="text-orange-600">Private</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <p className="text-xs text-muted-foreground mb-2">
                    Instructor: {classData.teacherName}
                  </p>
                  
                  {classData.status === 'live' || (
                    classData.scheduledAt instanceof Date && 
                    !isNaN(classData.scheduledAt.getTime()) && 
                    isClassStartingSoon(classData.scheduledAt)
                  ) ? (
                    <Button 
                      onClick={() => joinClass(classData)}
                      className="w-full"
                      variant={classData.status === 'live' ? 'default' : 'secondary'}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      {classData.status === 'live' ? 'Join Live Class' : 'Join Class'}
                    </Button>
                  ) : classData.status === 'scheduled' ? (
                    <Button variant="outline" className="w-full" disabled>
                      <Clock className="h-4 w-4 mr-2" />
                      Scheduled for Later
                    </Button>
                  ) : (
                    <Button variant="ghost" className="w-full" disabled>
                      Class Ended
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}