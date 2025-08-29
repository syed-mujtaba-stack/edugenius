'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ExternalLink, 
  Copy,
  Eye,
  EyeOff 
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { isSupabaseConfigured } from '@/lib/supabase'

export function SupabaseSetupIndicator() {
  const [setupStatus, setSetupStatus] = useState({
    hasUrl: false,
    hasAnonKey: false,
    hasServiceKey: false,
    urlValid: false
  })
  const [showKeys, setShowKeys] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const checkSetup = () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      const hasUrl = !!url && url !== 'your_supabase_project_url_here'
      const hasAnonKey = !!anonKey && anonKey !== 'your_supabase_anon_key_here'
      const hasServiceKey = !!serviceKey && serviceKey !== 'your_supabase_service_role_key_here'
      
      let urlValid = false
      if (hasUrl) {
        try {
          new URL(url)
          urlValid = url.includes('supabase.co')
        } catch {
          urlValid = false
        }
      }

      setSetupStatus({
        hasUrl,
        hasAnonKey,
        hasServiceKey,
        urlValid
      })
    }

    checkSetup()
    // Check again after a short delay to catch any dynamic updates
    const timer = setTimeout(checkSetup, 1000)
    return () => clearTimeout(timer)
  }, [])

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Copied!',
        description: `${label} copied to clipboard`,
      })
    }).catch(() => {
      toast({
        title: 'Failed to copy',
        description: 'Please copy manually',
        variant: 'destructive'
      })
    })
  }

  const isFullyConfigured = isSupabaseConfigured
  const needsConfiguration = !isSupabaseConfigured

  if (isFullyConfigured) {
    return (
      <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700 dark:text-green-300">
          Supabase is properly configured and ready to use! 🎉
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-yellow-600" />
          <span>Supabase Setup Required</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          To enable realtime features, please configure your Supabase project:
        </div>

        {/* Setup Status */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {setupStatus.hasUrl ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm">Supabase URL configured</span>
            <Badge variant={setupStatus.hasUrl ? "secondary" : "destructive"} className="text-xs">
              {setupStatus.hasUrl ? 'Done' : 'Missing'}
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            {setupStatus.urlValid ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm">Valid Supabase URL format</span>
            <Badge variant={setupStatus.urlValid ? "secondary" : "destructive"} className="text-xs">
              {setupStatus.urlValid ? 'Valid' : 'Invalid'}
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            {setupStatus.hasAnonKey ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm">Anonymous key configured</span>
            <Badge variant={setupStatus.hasAnonKey ? "secondary" : "destructive"} className="text-xs">
              {setupStatus.hasAnonKey ? 'Done' : 'Missing'}
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            {setupStatus.hasServiceKey ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            )}
            <span className="text-sm">Service role key (optional)</span>
            <Badge variant={setupStatus.hasServiceKey ? "secondary" : "outline"} className="text-xs">
              {setupStatus.hasServiceKey ? 'Done' : 'Optional'}
            </Badge>
          </div>
        </div>

        {/* Current Configuration */}
        {(setupStatus.hasUrl || setupStatus.hasAnonKey) && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Configuration:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowKeys(!showKeys)}
                className="h-8 px-2"
              >
                {showKeys ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {showKeys ? 'Hide' : 'Show'}
              </Button>
            </div>
            
            {showKeys && (
              <div className="space-y-2 text-xs font-mono bg-muted p-3 rounded">
                {setupStatus.hasUrl && (
                  <div className="flex items-center justify-between">
                    <span>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 40)}...</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(process.env.NEXT_PUBLIC_SUPABASE_URL || '', 'URL')}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                {setupStatus.hasAnonKey && (
                  <div className="flex items-center justify-between">
                    <span>Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '', 'Anon Key')}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Environment Variables Template */}
        <div className="space-y-2">
          <span className="text-sm font-medium">Add to your .env.local file:</span>
          <div className="bg-muted p-3 rounded text-xs font-mono">
            <div className="space-y-1">
              <div>NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here</div>
              <div>SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(
                'NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here\nSUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here',
                'Environment variables template'
              )}
              className="mt-2 h-7 px-2 text-xs"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy Template
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
            className="text-xs"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Open Supabase Dashboard
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/SUPABASE_SETUP_GUIDE.md', '_blank')}
            className="text-xs"
          >
            Setup Guide
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="text-xs"
          >
            Refresh Status
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          💡 After updating your .env.local file, restart your development server to see changes.
        </div>
      </CardContent>
    </Card>
  )
}