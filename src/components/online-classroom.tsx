'use client'

import { useState, useEffect } from 'react'
import { 
  StreamVideo, 
  StreamVideoClient, 
  StreamCall,
  CallControls,
  SpeakerLayout,
  CallParticipantsList,
  StreamTheme
} from '@stream-io/video-react-sdk'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MonitorOff,
  Users,
  MessageCircle,
  Settings,
  Maximize,
  Minimize,
  Clock,
  Copy,
  CheckCircle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { createStreamClient, formatCallDuration, isGetStreamConfigured } from '@/lib/getstream'
import { RealtimeChat } from '@/components/realtime-chat'
import { ParticipantManager } from '@/components/participant-manager'

interface OnlineClassroomProps {
  callId: string
  className: string
  userId: string
  userName: string
  onLeaveClass: () => void
}

export function OnlineClassroom({ callId, className, userId, userName, onLeaveClass }: OnlineClassroomProps) {
  const [client, setClient] = useState<StreamVideoClient | null>(null)
  const [call, setCall] = useState<any>(null)
  const [isConnecting, setIsConnecting] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [callStartTime, setCallStartTime] = useState<Date>(new Date())
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState('video')
  const [participantCount, setParticipantCount] = useState(0)
  const [isLinkCopied, setIsLinkCopied] = useState(false)
  
  // Call state
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  
  const { toast } = useToast()

  useEffect(() => {
    const initializeCall = async () => {
      if (!isGetStreamConfigured) {
        toast({
          title: 'Video Service Unavailable',
          description: 'GetStream.io is not configured. Please check your API keys.',
          variant: 'destructive'
        })
        return
      }

      try {
        setIsConnecting(true)
        
        // Create GetStream client
        const streamClient = createStreamClient(userId, userName)
        if (!streamClient) {
          throw new Error('Failed to create GetStream client')
        }

        setClient(streamClient)

        // Create or join call
        const callInstance = streamClient.call('default', callId)
        
        // Join the call
        await callInstance.join({ create: true })
        
        setCall(callInstance)
        setIsConnected(true)
        setCallStartTime(new Date())
        
        // Set up event listeners
        callInstance.on('call.session_participant_joined', (event: any) => {
          setParticipantCount(prev => prev + 1)
          toast({
            title: 'Participant Joined',
            description: `${event.participant.user.name || 'Someone'} joined the class`
          })
        })

        callInstance.on('call.session_participant_left', (event: any) => {
          setParticipantCount(prev => Math.max(0, prev - 1))
          toast({
            title: 'Participant Left',
            description: `${event.participant.user.name || 'Someone'} left the class`
          })
        })

        toast({
          title: 'Connected!',
          description: `You've joined ${className} successfully`
        })

      } catch (error) {
        console.error('Error initializing call:', error)
        toast({
          title: 'Connection Failed',
          description: 'Failed to join the class. Please try again.',
          variant: 'destructive'
        })
      } finally {
        setIsConnecting(false)
      }
    }

    initializeCall()

    // Cleanup
    return () => {
      if (call) {
        call.leave()
      }
      if (client) {
        client.disconnectUser()
      }
    }
  }, [callId, userId, userName, className])

  const handleLeaveCall = async () => {
    try {
      if (call) {
        await call.leave()
      }
      if (client) {
        await client.disconnectUser()
      }
      onLeaveClass()
    } catch (error) {
      console.error('Error leaving call:', error)
      onLeaveClass()
    }
  }

  const toggleMute = async () => {
    if (call) {
      try {
        if (isMuted) {
          await call.microphone.enable()
        } else {
          await call.microphone.disable()
        }
        setIsMuted(!isMuted)
      } catch (error) {
        console.error('Error toggling microphone:', error)
      }
    }
  }

  const toggleVideo = async () => {
    if (call) {
      try {
        if (isVideoOff) {
          await call.camera.enable()
        } else {
          await call.camera.disable()
        }
        setIsVideoOff(!isVideoOff)
      } catch (error) {
        console.error('Error toggling video:', error)
      }
    }
  }

  const toggleScreenShare = async () => {
    if (call) {
      try {
        if (isScreenSharing) {
          await call.stopScreenShare()
        } else {
          await call.startScreenShare()
        }
        setIsScreenSharing(!isScreenSharing)
      } catch (error) {
        console.error('Error toggling screen share:', error)
        toast({
          title: 'Screen Share Error',
          description: 'Failed to toggle screen sharing',
          variant: 'destructive'
        })
      }
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const copyClassLink = async () => {
    const classLink = `${window.location.origin}/online-classes?join=${callId}`
    try {
      await navigator.clipboard.writeText(classLink)
      setIsLinkCopied(true)
      toast({
        title: 'Link Copied!',
        description: 'Class link has been copied to clipboard'
      })
      setTimeout(() => setIsLinkCopied(false), 2000)
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy link to clipboard',
        variant: 'destructive'
      })
    }
  }

  if (!isGetStreamConfigured) {
    return (
      <Card className="w-full">
        <CardContent className="text-center py-12">
          <Video className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Video Service Unavailable</h3>
          <p className="text-muted-foreground mb-4">
            GetStream.io is not configured. Please check your API configuration.
          </p>
          <Button onClick={onLeaveClass} variant="outline">
            Go Back
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (isConnecting) {
    return (
      <Card className="w-full">
        <CardContent className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Connecting to Class...</h3>
          <p className="text-muted-foreground">Please wait while we connect you to {className}</p>
        </CardContent>
      </Card>
    )
  }

  if (!client || !call) {
    return (
      <Card className="w-full">
        <CardContent className="text-center py-12">
          <PhoneOff className="h-16 w-16 mx-auto text-red-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Connection Failed</h3>
          <p className="text-muted-foreground mb-4">
            Failed to connect to the class. Please try again.
          </p>
          <Button onClick={onLeaveClass}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-background border-b p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Badge variant="default" className="bg-red-500">
            🔴 LIVE
          </Badge>
          <div>
            <h2 className="font-semibold">{className}</h2>
            <p className="text-sm text-muted-foreground">
              {formatCallDuration(callStartTime)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={copyClassLink}>
            {isLinkCopied ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>

          <Badge variant="outline">
            <Users className="h-3 w-3 mr-1" />
            {participantCount} participants
          </Badge>

          <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>

          <Button variant="destructive" size="sm" onClick={handleLeaveCall}>
            <PhoneOff className="h-4 w-4 mr-2" />
            Leave
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 relative">
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <StreamTheme>
                <div className="h-full w-full">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
                    <TabsList className="absolute top-4 left-4 z-10">
                      <TabsTrigger value="video">
                        <Video className="h-4 w-4 mr-2" />
                        Video
                      </TabsTrigger>
                      <TabsTrigger value="participants">
                        <Users className="h-4 w-4 mr-2" />
                        Participants
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="video" className="flex-1 mt-0">
                      <SpeakerLayout />
                    </TabsContent>

                    <TabsContent value="participants" className="flex-1 mt-0 p-4">
                      <ParticipantManager
                        participants={[]}
                        currentUserId={userId}
                        isHost={true}
                        onMuteParticipant={(userId) => console.log('Mute:', userId)}
                        onUnmuteParticipant={(userId) => console.log('Unmute:', userId)}
                        onKickParticipant={(userId) => console.log('Kick:', userId)}
                        onPromoteToModerator={(userId) => console.log('Promote:', userId)}
                        onDemoteFromModerator={(userId) => console.log('Demote:', userId)}
                        onToggleParticipantVideo={(userId) => console.log('Toggle video:', userId)}
                        onPrivateMessage={(userId) => console.log('Private message:', userId)}
                      />
                    </TabsContent>
                  </Tabs>

                  {/* Custom Controls Overlay */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm rounded-lg p-2">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant={isMuted ? "destructive" : "secondary"}
                        onClick={toggleMute}
                      >
                        {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>

                      <Button
                        size="sm"
                        variant={isVideoOff ? "destructive" : "secondary"}
                        onClick={toggleVideo}
                      >
                        {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                      </Button>

                      <Button
                        size="sm"
                        variant={isScreenSharing ? "default" : "secondary"}
                        onClick={toggleScreenShare}
                      >
                        {isScreenSharing ? <MonitorOff className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                      </Button>

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setActiveTab(activeTab === 'participants' ? 'video' : 'participants')}
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </StreamTheme>
            </StreamCall>
          </StreamVideo>
        </div>

        {/* Side Panel - Chat & Participants */}
        <div className="w-80 bg-background border-l">
          <Tabs defaultValue="chat" className="h-full flex flex-col">
            <div className="p-4 border-b">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat" className="text-xs">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="participants" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  People
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="chat" className="flex-1 overflow-hidden mt-0">
              <RealtimeChat 
                userId={userId}
                onAIResponse={(message, response) => {
                  // Handle AI responses in class context
                  console.log('AI Response in class:', { message, response })
                }}
              />
            </TabsContent>
            
            <TabsContent value="participants" className="flex-1 overflow-hidden mt-0">
              <ParticipantManager
                participants={[]}
                currentUserId={userId}
                isHost={true}
                onMuteParticipant={(userId) => console.log('Mute:', userId)}
                onUnmuteParticipant={(userId) => console.log('Unmute:', userId)}
                onKickParticipant={(userId) => console.log('Kick:', userId)}
                onPromoteToModerator={(userId) => console.log('Promote:', userId)}
                onDemoteFromModerator={(userId) => console.log('Demote:', userId)}
                onToggleParticipantVideo={(userId) => console.log('Toggle video:', userId)}
                onPrivateMessage={(userId) => console.log('Private message:', userId)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}