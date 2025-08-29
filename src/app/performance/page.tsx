'use client'

import { PageSpeedDashboard } from '@/components/pagespeed-dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Zap, 
  TrendingUp, 
  Globe, 
  Smartphone, 
  Monitor,
  BarChart3,
  Settings,
  AlertTriangle,
  CheckCircle,
  Lightbulb
} from 'lucide-react'
import Link from 'next/link'
import { isPageSpeedConfigured } from '@/lib/pagespeed'

export default function PerformancePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  ← Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-blue-500" />
                <h1 className="text-xl font-semibold">Performance Analytics</h1>
                <Badge variant={isPageSpeedConfigured ? 'default' : 'secondary'}>
                  {isPageSpeedConfigured ? 'API Connected' : 'Demo Mode'}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/performance/advanced">
                <Button variant="default" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Advanced Analytics
                </Button>
              </Link>
              <Link href="/performance/settings">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Website Performance Analysis</h2>
            <p className="text-muted-foreground text-lg">
              Monitor your website's performance using Google PageSpeed Insights API and optimize for better user experience
            </p>
          </div>

          {/* Features Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Real-time Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Live performance monitoring with Core Web Vitals
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Performance Insights</h3>
                    <p className="text-sm text-muted-foreground">
                      Detailed optimization recommendations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Lightbulb className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI-Powered Tips</h3>
                    <p className="text-sm text-muted-foreground">
                      Smart recommendations for performance optimization
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Why Performance Matters for EduGenius
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-green-600">✅ Better Learning Experience</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Faster AI tool loading improves student engagement</li>
                  <li>• Reduced bounce rate keeps students in learning sessions</li>
                  <li>• Smooth video playback for educational content</li>
                  <li>• Quick search results enhance research efficiency</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-blue-600">🚀 SEO & Accessibility Benefits</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Higher Google rankings for educational searches</li>
                  <li>• Better mobile performance for student devices</li>
                  <li>• Improved accessibility for all learners</li>
                  <li>• Enhanced Core Web Vitals scores</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">85</div>
                <p className="text-xs text-muted-foreground">Average Score</p>
                <Badge variant="default" className="mt-2">Good</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Monitor className="h-4 w-4 mr-2" />
                Desktop Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">92</div>
                <p className="text-xs text-muted-foreground">Average Score</p>
                <Badge variant="default" className="mt-2">Excellent</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Pages Monitored
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">12</div>
                <p className="text-xs text-muted-foreground">Active URLs</p>
                <Badge variant="outline" className="mt-2">Live Monitoring</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Dashboard */}
        <PageSpeedDashboard 
          defaultUrl="https://edugenius.vercel.app"
          showHistory={true}
          showRecommendations={true}
        />

        {/* Educational Content about Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
              Performance Optimization Tips for Educational Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold">🎯 Core Web Vitals Focus</h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Largest Contentful Paint (LCP):</strong> Keep under 2.5s for educational content to load quickly</p>
                  <p><strong>First Input Delay (FID):</strong> Ensure interactive elements respond within 100ms</p>
                  <p><strong>Cumulative Layout Shift (CLS):</strong> Prevent layout shifts that disrupt learning</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold">🔧 Optimization Strategies</h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Image Optimization:</strong> Use WebP format and lazy loading for course images</p>
                  <p><strong>Code Splitting:</strong> Load AI tools only when needed to reduce bundle size</p>
                  <p><strong>CDN Usage:</strong> Serve static assets from CDN for global students</p>
                  <p><strong>Caching Strategy:</strong> Cache API responses and static content effectively</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        {!isPageSpeedConfigured && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-800">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Enhance Your Performance Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700 mb-4">
                Get real-time performance insights by configuring the PageSpeed Insights API. 
                This will enable live monitoring, historical tracking, and automated alerts.
              </p>
              <div className="flex space-x-3">
                <Link href="/performance/settings">
                  <Button>
                    <Settings className="h-4 w-4 mr-2" />
                    Setup API Key
                  </Button>
                </Link>
                <Button variant="outline">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}