'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Settings,
  Key,
  Bell,
  Clock,
  Target,
  CheckCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  Copy,
  Eye,
  EyeOff,
  Save
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { isPageSpeedConfigured } from '@/lib/pagespeed'

export default function PerformanceSettingsPage() {
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [isConfigured, setIsConfigured] = useState(false)
  const [monitoringEnabled, setMonitoringEnabled] = useState(true)
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [monitoringInterval, setMonitoringInterval] = useState(5)
  const { toast } = useToast()

  useEffect(() => {
    // Load existing settings
    setIsConfigured(isPageSpeedConfigured)
    const stored = localStorage.getItem('performance-settings')
    if (stored) {
      const settings = JSON.parse(stored)
      setMonitoringEnabled(settings.monitoringEnabled ?? true)
      setAlertsEnabled(settings.alertsEnabled ?? true)
      setMonitoringInterval(settings.monitoringInterval ?? 5)
    }
  }, [])

  const saveSettings = () => {
    const settings = {
      monitoringEnabled,
      alertsEnabled,
      monitoringInterval
    }
    localStorage.setItem('performance-settings', JSON.stringify(settings))
    
    toast({
      title: 'Settings Saved',
      description: 'Performance monitoring settings have been updated',
    })
  }

  const copySetupInstructions = () => {
    const instructions = `# PageSpeed Insights API Setup for EduGenius

1. Go to Google Cloud Console (https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the PageSpeed Insights API
4. Create credentials (API Key)
5. Add to your .env.local file:

PAGESPEED_INSIGHTS_API_KEY=your_api_key_here
NEXT_PUBLIC_PAGESPEED_API_KEY=your_api_key_here

6. Restart your development server`

    navigator.clipboard.writeText(instructions)
    toast({
      title: 'Instructions Copied',
      description: 'Setup instructions copied to clipboard',
    })
  }

  const testApiConnection = async () => {
    if (!apiKey) {
      toast({
        title: 'API Key Required',
        description: 'Please enter your PageSpeed Insights API key',
        variant: 'destructive'
      })
      return
    }

    try {
      // Simple test request
      const response = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://google.com&key=${apiKey}&strategy=mobile`
      )
      
      if (response.ok) {
        toast({
          title: 'Connection Successful',
          description: 'PageSpeed Insights API is working correctly',
        })
      } else {
        toast({
          title: 'Connection Failed',
          description: 'Please check your API key and try again',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Connection Error',
        description: 'Failed to test API connection',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/performance">
                <Button variant="ghost" size="sm">
                  ← Performance Analytics
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-blue-500" />
                <h1 className="text-xl font-semibold">Performance Settings</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Performance Configuration</h2>
          <p className="text-muted-foreground text-lg">
            Configure PageSpeed Insights API and monitoring settings for EduGenius
          </p>
        </div>

        <Tabs defaultValue="api" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="api">API Configuration</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring Settings</TabsTrigger>
            <TabsTrigger value="alerts">Alerts & Notifications</TabsTrigger>
          </TabsList>

          {/* API Configuration */}
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  PageSpeed Insights API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Status */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {isConfigured ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="font-medium">API Configured</p>
                            <p className="text-sm text-muted-foreground">PageSpeed Insights API is active</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          <div>
                            <p className="font-medium">API Not Configured</p>
                            <p className="text-sm text-muted-foreground">Using demo mode with sample data</p>
                          </div>
                        </>
                      )}
                    </div>
                    <Badge variant={isConfigured ? 'default' : 'secondary'}>
                      {isConfigured ? 'Active' : 'Demo Mode'}
                    </Badge>
                  </div>
                </div>

                {/* API Key Input */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="api-key">PageSpeed Insights API Key</Label>
                    <div className="flex mt-1 space-x-2">
                      <div className="flex-1 relative">
                        <Input
                          id="api-key"
                          type={showApiKey ? 'text' : 'password'}
                          value={apiKey}
                          onChange={(e) => setApiKey(e.target.value)}
                          placeholder="Enter your PageSpeed Insights API key"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <Button onClick={testApiConnection} variant="outline">
                        Test Connection
                      </Button>
                    </div>
                  </div>

                  {!isConfigured && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-medium text-blue-900 mb-2">Setup Instructions</h3>
                          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                            <li>Go to <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
                            <li>Create a new project or select an existing one</li>
                            <li>Enable the PageSpeed Insights API</li>
                            <li>Create an API key in the Credentials section</li>
                            <li>Add the API key to your environment variables</li>
                            <li>Restart your development server</li>
                          </ol>
                          <div className="flex space-x-2 mt-3">
                            <Button size="sm" variant="outline" onClick={copySetupInstructions}>
                              <Copy className="h-3 w-3 mr-2" />
                              Copy Instructions
                            </Button>
                            <a 
                              href="https://console.cloud.google.com/apis/library/pagespeedonline.googleapis.com" 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <Button size="sm" variant="outline">
                                <ExternalLink className="h-3 w-3 mr-2" />
                                Enable API
                              </Button>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Environment Variables */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Environment Variables</h3>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-sm font-mono mb-2"># Add to your .env.local file:</p>
                    <div className="bg-gray-800 text-green-400 p-3 rounded text-sm font-mono">
                      PAGESPEED_INSIGHTS_API_KEY=your_api_key_here<br/>
                      NEXT_PUBLIC_PAGESPEED_API_KEY=your_api_key_here
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Settings */}
          <TabsContent value="monitoring">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Performance Monitoring Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Automatic Monitoring</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically check performance at regular intervals
                      </p>
                    </div>
                    <Switch 
                      checked={monitoringEnabled}
                      onCheckedChange={setMonitoringEnabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Monitoring Interval (minutes)</Label>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="number"
                        min="1"
                        max="60"
                        value={monitoringInterval}
                        onChange={(e) => setMonitoringInterval(parseInt(e.target.value) || 5)}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">
                        Check performance every {monitoringInterval} minute{monitoringInterval !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">Monitoring Features</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Real-time Core Web Vitals tracking</li>
                      <li>• Performance score monitoring</li>
                      <li>• Historical data collection</li>
                      <li>• Performance budget validation</li>
                      <li>• Automated trend analysis</li>
                    </ul>
                  </div>
                </div>

                <Button onClick={saveSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Monitoring Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts & Notifications */}
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Alerts & Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Browser Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when performance issues are detected
                      </p>
                    </div>
                    <Switch 
                      checked={alertsEnabled}
                      onCheckedChange={setAlertsEnabled}
                    />
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Notification Types</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-red-500" />
                          <span className="text-sm">Performance Budget Violations</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">Core Web Vitals Issues</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Performance Degradation</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Performance Improvements</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Settings className="h-4 w-4 text-purple-500" />
                          <span className="text-sm">Monitoring Status Updates</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Info className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">Optimization Suggestions</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Bell className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-yellow-900">Permission Required</h3>
                        <p className="text-sm text-yellow-800 mb-3">
                          Browser notifications need permission to work. Click the button below to enable notifications.
                        </p>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            if ('Notification' in window) {
                              Notification.requestPermission().then(permission => {
                                toast({
                                  title: permission === 'granted' ? 'Notifications Enabled' : 'Notifications Denied',
                                  description: permission === 'granted' 
                                    ? 'You will now receive performance alerts'
                                    : 'You can enable notifications later in browser settings',
                                })
                              })
                            }
                          }}
                        >
                          Enable Notifications
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={saveSettings}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Alert Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/performance">
                <Button variant="outline" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Basic Analytics
                </Button>
              </Link>
              <Link href="/performance/advanced">
                <Button variant="outline" className="w-full">
                  <Target className="h-4 w-4 mr-2" />
                  Advanced Analytics
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}