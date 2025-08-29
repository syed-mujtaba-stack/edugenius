'use client'

import { PageSpeedDashboard } from '@/components/pagespeed-dashboard'
import { PerformanceMonitor } from '@/components/performance-monitor'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Lightbulb,
  Target,
  Clock,
  Activity,
  Eye,
  Gauge,
  Users,
  Cpu,
  Database,
  Cloud
} from 'lucide-react'
import Link from 'next/link'
import { isPageSpeedConfigured } from '@/lib/pagespeed'

export default function AdvancedPerformancePage() {
  const performanceFeatures = [
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: 'Real-time Analytics',
      description: 'Live performance monitoring with Core Web Vitals tracking',
      status: 'active'
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: 'Competitive Analysis',
      description: 'Compare your site performance against competitors',
      status: 'active'
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: 'Historical Tracking',
      description: 'Track performance improvements over time with automated monitoring',
      status: 'active'
    },
    {
      icon: <Target className="h-5 w-5" />,
      title: 'Performance Budgets',
      description: 'Set performance goals and receive alerts when thresholds are exceeded',
      status: 'active'
    },
    {
      icon: <Lightbulb className="h-5 w-5" />,
      title: 'AI-Powered Optimization',
      description: 'Get personalized recommendations using Google Gemini 2.0 Flash',
      status: 'active'
    },
    {
      icon: <Activity className="h-5 w-5" />,
      title: 'Automated Monitoring',
      description: 'Continuous performance checks with smart alerting system',
      status: 'active'
    }
  ]

  const performanceMetrics = [
    {
      title: 'Core Web Vitals',
      description: 'Essential metrics for user experience',
      metrics: [
        { name: 'Largest Contentful Paint', target: '≤ 2.5s', current: '2.1s', status: 'good' },
        { name: 'First Input Delay', target: '≤ 100ms', current: '45ms', status: 'good' },
        { name: 'Cumulative Layout Shift', target: '≤ 0.1', current: '0.08', status: 'good' }
      ]
    },
    {
      title: 'Performance Metrics',
      description: 'Additional performance indicators',
      metrics: [
        { name: 'First Contentful Paint', target: '≤ 1.8s', current: '1.2s', status: 'excellent' },
        { name: 'Time to Interactive', target: '≤ 3.8s', current: '3.2s', status: 'good' },
        { name: 'Speed Index', target: '≤ 3.4s', current: '2.8s', status: 'good' }
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-100'
      case 'poor': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'good': return <CheckCircle className="h-4 w-4" />
      case 'needs-improvement': return <AlertTriangle className="h-4 w-4" />
      case 'poor': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

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
                <h1 className="text-xl font-semibold">Advanced Performance Analytics</h1>
                <Badge variant={isPageSpeedConfigured ? 'default' : 'secondary'}>
                  {isPageSpeedConfigured ? 'API Connected' : 'Demo Mode'}
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/performance">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Basic Analytics
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
            <h2 className="text-3xl font-bold mb-2">Performance Command Center</h2>
            <p className="text-muted-foreground text-lg">
              Advanced performance monitoring, competitive analysis, and AI-powered optimization for EduGenius
            </p>
          </div>

          {/* Performance Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Gauge className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">92</div>
                    <p className="text-sm text-muted-foreground">Performance Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">3/3</div>
                    <p className="text-sm text-muted-foreground">Core Web Vitals</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">24/7</div>
                    <p className="text-sm text-muted-foreground">Monitoring</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">+15%</div>
                    <p className="text-sm text-muted-foreground">Improvement</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Feature Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cpu className="h-5 w-5 mr-2 text-blue-500" />
              Advanced Performance Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {performanceFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm">{feature.title}</h3>
                      <Badge variant="default" className="text-xs">Active</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {performanceMetrics.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.metrics.map((metric, metricIndex) => (
                    <div key={metricIndex} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-1 rounded ${getStatusColor(metric.status)}`}>
                          {getStatusIcon(metric.status)}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{metric.name}</div>
                          <div className="text-xs text-muted-foreground">Target: {metric.target}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{metric.current}</div>
                        <Badge 
                          variant={metric.status === 'excellent' || metric.status === 'good' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {metric.status === 'excellent' ? 'Excellent' :
                           metric.status === 'good' ? 'Good' :
                           metric.status === 'needs-improvement' ? 'Needs Work' : 'Poor'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Monitor Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <PerformanceMonitor showActions={true} />
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-800">Strengths</span>
                    </div>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Excellent mobile performance</li>
                      <li>• Fast server response times</li>
                      <li>• Optimized image loading</li>
                      <li>• Stable visual layout</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">Opportunities</span>
                    </div>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Reduce JavaScript execution time</li>
                      <li>• Enable text compression</li>
                      <li>• Optimize CSS delivery</li>
                      <li>• Leverage browser caching</li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-800">AI Recommendations</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Based on your educational platform usage patterns, focus on optimizing AI tool loading times 
                    and video content delivery for better student engagement. Consider implementing progressive 
                    loading for content-heavy pages.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Advanced Analytics Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Full Dashboard</TabsTrigger>
            <TabsTrigger value="comparison">Competitive Analysis</TabsTrigger>
            <TabsTrigger value="history">Historical Tracking</TabsTrigger>
            <TabsTrigger value="budgets">Performance Budgets</TabsTrigger>
            <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <PageSpeedDashboard 
              defaultUrl="https://edugenius.vercel.app"
              showHistory={true}
              showRecommendations={true}
            />
          </TabsContent>

          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Competitive Performance Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Use the comparison tab in the Full Dashboard above to analyze your performance against competitors.
                </p>
                <Link href="#" onClick={() => {
                  const comparisonTab = document.querySelector('[value="comparison"]') as HTMLElement;
                  comparisonTab?.click();
                }}>
                  <Button>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Open Comparison Tool
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Performance History & Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Track your performance improvements over time with automated monitoring and historical data.
                </p>
                <Link href="#" onClick={() => {
                  const historyTab = document.querySelector('[value="history"]') as HTMLElement;
                  historyTab?.click();
                }}>
                  <Button>
                    <Activity className="h-4 w-4 mr-2" />
                    View Historical Data
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budgets">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Performance Budget Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Set performance goals and receive alerts when thresholds are exceeded.
                </p>
                <Link href="#" onClick={() => {
                  const budgetsTab = document.querySelector('[value="budgets"]') as HTMLElement;
                  budgetsTab?.click();
                }}>
                  <Button>
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Budgets
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Real-time Performance Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">✓ Active</div>
                    <p className="text-sm text-muted-foreground">Monitoring Status</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">5min</div>
                    <p className="text-sm text-muted-foreground">Check Interval</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
                    <p className="text-sm text-muted-foreground">Coverage</p>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-2">Monitoring Features</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Continuous performance monitoring every 5 minutes</li>
                    <li>• Browser notifications for performance issues</li>
                    <li>• Performance budget violation alerts</li>
                    <li>• Historical data storage and trending</li>
                    <li>• AI-powered optimization recommendations</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Educational Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2 text-green-500" />
              Performance Impact on EduGenius Learning Platform
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-green-600">🎓 Student Experience Benefits</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Faster AI tool loading keeps students engaged</li>
                  <li>• Smooth video playback for educational content</li>
                  <li>• Quick search results enhance research efficiency</li>
                  <li>• Mobile optimization for student devices</li>
                  <li>• Reduced cognitive load with fast interactions</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-blue-600">📈 Platform Growth Benefits</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Higher Google rankings for educational searches</li>
                  <li>• Improved SEO visibility and organic traffic</li>
                  <li>• Better accessibility for diverse learners</li>
                  <li>• Increased user retention and engagement</li>
                  <li>• Enhanced reputation and credibility</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}