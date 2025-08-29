'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Users, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Crown, 
  UserCheck, 
  UserX, 
  Volume2, 
  VolumeX,
  Hand,
  MessageCircle,
  MoreVertical,
  Shield,
  UserCog,
  PhoneOff
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { getParticipantDisplayName } from '@/lib/getstream'

interface Participant {
  userId: string
  name: string
  avatar?: string
  isHost: boolean
  isMuted: boolean
  isVideoOff: boolean
  isHandRaised: boolean
  connectionQuality: 'good' | 'fair' | 'poor'
  joinedAt: Date
  role: 'host' | 'moderator' | 'participant'
}

interface ParticipantManagerProps {
  participants: Participant[]
  currentUserId: string
  isHost: boolean
  onMuteParticipant?: (userId: string) => void
  onUnmuteParticipant?: (userId: string) => void
  onKickParticipant?: (userId: string) => void
  onPromoteToModerator?: (userId: string) => void
  onDemoteFromModerator?: (userId: string) => void
  onToggleParticipantVideo?: (userId: string) => void
  onPrivateMessage?: (userId: string) => void
}

export function ParticipantManager({
  participants,
  currentUserId,
  isHost,
  onMuteParticipant,
  onUnmuteParticipant,
  onKickParticipant,
  onPromoteToModerator,
  onDemoteFromModerator,
  onToggleParticipantVideo,
  onPrivateMessage
}: ParticipantManagerProps) {
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null)
  const [showParticipantDetails, setShowParticipantDetails] = useState(false)
  const { toast } = useToast()

  // Mock data for demonstration
  const [mockParticipants, setMockParticipants] = useState<Participant[]>([
    {
      userId: 'user_1',
      name: 'Ahmed Khan',
      avatar: 'https://getstream.io/random_svg/?id=user_1&name=Ahmed',
      isHost: true,
      isMuted: false,
      isVideoOff: false,
      isHandRaised: false,
      connectionQuality: 'good',
      joinedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      role: 'host'
    },
    {
      userId: 'user_2',
      name: 'Fatima Ali',
      avatar: 'https://getstream.io/random_svg/?id=user_2&name=Fatima',
      isHost: false,
      isMuted: false,
      isVideoOff: false,
      isHandRaised: true,
      connectionQuality: 'good',
      joinedAt: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
      role: 'participant'
    },
    {
      userId: 'user_3',
      name: 'Muhammad Hassan',
      avatar: 'https://getstream.io/random_svg/?id=user_3&name=Hassan',
      isHost: false,
      isMuted: true,
      isVideoOff: true,
      isHandRaised: false,
      connectionQuality: 'fair',
      joinedAt: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
      role: 'moderator'
    },
    {
      userId: 'user_4',
      name: 'Zainab Sheikh',
      avatar: 'https://getstream.io/random_svg/?id=user_4&name=Zainab',
      isHost: false,
      isMuted: false,
      isVideoOff: false,
      isHandRaised: false,
      connectionQuality: 'poor',
      joinedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      role: 'participant'
    }
  ])

  // Use mock data if no participants provided
  const displayParticipants = participants.length > 0 ? participants : mockParticipants

  const handleMuteToggle = (participant: Participant) => {
    if (!isHost && participant.role === 'host') {
      toast({
        title: 'Permission Denied',
        description: 'You cannot mute the host',
        variant: 'destructive'
      })
      return
    }

    if (participant.isMuted) {
      onUnmuteParticipant?.(participant.userId)
      toast({
        title: 'Participant Unmuted',
        description: `${participant.name} has been unmuted`
      })
    } else {
      onMuteParticipant?.(participant.userId)
      toast({
        title: 'Participant Muted',
        description: `${participant.name} has been muted`
      })
    }

    // Update mock data
    setMockParticipants(prev => prev.map(p => 
      p.userId === participant.userId 
        ? { ...p, isMuted: !p.isMuted }
        : p
    ))
  }

  const handleVideoToggle = (participant: Participant) => {
    onToggleParticipantVideo?.(participant.userId)
    
    setMockParticipants(prev => prev.map(p => 
      p.userId === participant.userId 
        ? { ...p, isVideoOff: !p.isVideoOff }
        : p
    ))

    toast({
      title: 'Video Toggled',
      description: `${participant.name}'s video has been ${participant.isVideoOff ? 'enabled' : 'disabled'}`
    })
  }

  const handleKickParticipant = (participant: Participant) => {
    if (participant.role === 'host') {
      toast({
        title: 'Cannot Kick Host',
        description: 'You cannot remove the host from the class',
        variant: 'destructive'
      })
      return
    }

    onKickParticipant?.(participant.userId)
    
    setMockParticipants(prev => prev.filter(p => p.userId !== participant.userId))
    
    toast({
      title: 'Participant Removed',
      description: `${participant.name} has been removed from the class`,
      variant: 'destructive'
    })
  }

  const handlePromoteToModerator = (participant: Participant) => {
    onPromoteToModerator?.(participant.userId)
    
    setMockParticipants(prev => prev.map(p => 
      p.userId === participant.userId 
        ? { ...p, role: 'moderator' }
        : p
    ))

    toast({
      title: 'Promoted to Moderator',
      description: `${participant.name} is now a moderator`
    })
  }

  const handleDemoteFromModerator = (participant: Participant) => {
    onDemoteFromModerator?.(participant.userId)
    
    setMockParticipants(prev => prev.map(p => 
      p.userId === participant.userId 
        ? { ...p, role: 'participant' }
        : p
    ))

    toast({
      title: 'Demoted from Moderator',
      description: `${participant.name} is now a regular participant`
    })
  }

  const getConnectionQualityColor = (quality: string) => {
    switch (quality) {
      case 'good': return 'text-green-500'
      case 'fair': return 'text-yellow-500'
      case 'poor': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'host': return <Crown className="h-3 w-3 text-yellow-500" />
      case 'moderator': return <Shield className="h-3 w-3 text-blue-500" />
      default: return null
    }
  }

  const formatJoinTime = (joinedAt: Date) => {
    const minutes = Math.floor((Date.now() - joinedAt.getTime()) / (1000 * 60))
    if (minutes < 1) return 'Just joined'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ${minutes % 60}m ago`
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Participants</span>
            <Badge variant="secondary">{displayParticipants.length}</Badge>
          </div>
          
          {isHost && (
            <Dialog open={showParticipantDetails} onOpenChange={setShowParticipantDetails}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <UserCog className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Participant Management</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <Card>
                      <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold text-green-500">
                          {displayParticipants.filter(p => p.connectionQuality === 'good').length}
                        </div>
                        <div className="text-xs text-muted-foreground">Good Connection</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold text-yellow-500">
                          {displayParticipants.filter(p => p.connectionQuality === 'fair').length}
                        </div>
                        <div className="text-xs text-muted-foreground">Fair Connection</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3 text-center">
                        <div className="text-2xl font-bold text-red-500">
                          {displayParticipants.filter(p => p.connectionQuality === 'poor').length}
                        </div>
                        <div className="text-xs text-muted-foreground">Poor Connection</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {displayParticipants.map((participant) => (
                        <div key={participant.userId} className="flex items-center justify-between p-2 rounded-lg border">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={participant.avatar} alt={participant.name} />
                              <AvatarFallback>
                                {participant.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-1">
                                <span className="font-medium text-sm">{participant.name}</span>
                                {getRoleIcon(participant.role)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatJoinTime(participant.joinedAt)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${getConnectionQualityColor(participant.connectionQuality).replace('text-', 'bg-')}`} />
                            {participant.isMuted && <MicOff className="h-3 w-3 text-red-500" />}
                            {participant.isVideoOff && <VideoOff className="h-3 w-3 text-red-500" />}
                            {participant.isHandRaised && <Hand className="h-3 w-3 text-yellow-500" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="space-y-2 p-4">
            {displayParticipants.map((participant) => (
              <div key={participant.userId} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={participant.avatar} alt={participant.name} />
                      <AvatarFallback>
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Status indicators */}
                    <div className="absolute -bottom-1 -right-1 flex space-x-1">
                      {participant.isHandRaised && (
                        <Badge variant="secondary" className="h-4 w-4 p-0 rounded-full bg-yellow-500">
                          <Hand className="h-2 w-2 text-white" />
                        </Badge>
                      )}
                      <div className={`w-3 h-3 rounded-full border-2 border-background ${getConnectionQualityColor(participant.connectionQuality).replace('text-', 'bg-')}`} />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium truncate">{participant.name}</span>
                      {getRoleIcon(participant.role)}
                      {participant.userId === currentUserId && (
                        <Badge variant="outline" className="text-xs">You</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span className={getConnectionQualityColor(participant.connectionQuality)}>
                        {participant.connectionQuality}
                      </span>
                      <span>•</span>
                      <span>{formatJoinTime(participant.joinedAt)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Audio/Video status */}
                <div className="flex items-center space-x-1 mr-2">
                  {participant.isMuted ? (
                    <MicOff className="h-4 w-4 text-red-500" />
                  ) : (
                    <Mic className="h-4 w-4 text-green-500" />
                  )}
                  
                  {participant.isVideoOff ? (
                    <VideoOff className="h-4 w-4 text-red-500" />
                  ) : (
                    <Video className="h-4 w-4 text-green-500" />
                  )}
                </div>
                
                {/* Action menu for hosts/moderators */}
                {(isHost || (participant.role !== 'host' && participant.userId !== currentUserId)) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Manage Participant</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem onClick={() => handleMuteToggle(participant)}>
                        {participant.isMuted ? (
                          <>
                            <Mic className="h-4 w-4 mr-2" />
                            Unmute
                          </>
                        ) : (
                          <>
                            <MicOff className="h-4 w-4 mr-2" />
                            Mute
                          </>
                        )}
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => handleVideoToggle(participant)}>
                        {participant.isVideoOff ? (
                          <>
                            <Video className="h-4 w-4 mr-2" />
                            Enable Video
                          </>
                        ) : (
                          <>
                            <VideoOff className="h-4 w-4 mr-2" />
                            Disable Video
                          </>
                        )}
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => onPrivateMessage?.(participant.userId)}>
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Private Message
                      </DropdownMenuItem>
                      
                      {isHost && participant.role !== 'host' && (
                        <>
                          <DropdownMenuSeparator />
                          
                          {participant.role === 'moderator' ? (
                            <DropdownMenuItem onClick={() => handleDemoteFromModerator(participant)}>
                              <UserX className="h-4 w-4 mr-2" />
                              Remove Moderator
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handlePromoteToModerator(participant)}>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Make Moderator
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem 
                            onClick={() => handleKickParticipant(participant)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <PhoneOff className="h-4 w-4 mr-2" />
                            Remove from Class
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {/* Quick stats */}
        <div className="p-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="flex">
                <Mic className="h-3 w-3 text-green-500" />
                <span className="ml-1">{displayParticipants.filter(p => !p.isMuted).length}</span>
              </div>
              <div className="flex">
                <MicOff className="h-3 w-3 text-red-500" />
                <span className="ml-1">{displayParticipants.filter(p => p.isMuted).length}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex">
                <Video className="h-3 w-3 text-green-500" />
                <span className="ml-1">{displayParticipants.filter(p => !p.isVideoOff).length}</span>
              </div>
              <div className="flex">
                <VideoOff className="h-3 w-3 text-red-500" />
                <span className="ml-1">{displayParticipants.filter(p => p.isVideoOff).length}</span>
              </div>
            </div>
          </div>
          
          {displayParticipants.filter(p => p.isHandRaised).length > 0 && (
            <div className="mt-2 flex items-center space-x-2 text-yellow-600">
              <Hand className="h-3 w-3" />
              <span className="text-xs">
                {displayParticipants.filter(p => p.isHandRaised).length} hand(s) raised
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}