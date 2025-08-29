'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  Zap, 
  Globe, 
  Smartphone, 
  Monitor, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye,
  Gauge,
  RefreshCw,
  BarChart3,
  Settings,
  Download,
  Share,
  Target,
  Lightbulb,
  Activity
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { 
  pageSpeedService, 
  type PageSpeedResult, 
  type PerformanceHistory as PerformanceHistoryType,
  getPerformanceGrade,
  formatMetricValue,
  CORE_WEB_VITALS,
  isPageSpeedConfigured
} from '@/lib/pagespeed'
import { AIPerformanceOptimizer } from '@/components/ai-performance-optimizer'
import { PerformanceComparison } from '@/components/performance-comparison'
import { PerformanceHistory } from '@/components/performance-history'
import { PerformanceBudgets } from '@/components/performance-budgets'

interface PageSpeedDashboardProps {
  defaultUrl?: string
  showHistory?: boolean
  showRecommendations?: boolean
}

export function PageSpeedDashboard({ 
  defaultUrl = '', 
  showHistory = true, 
  showRecommendations = true 
}: PageSpeedDashboardProps) {
  const [url, setUrl] = useState(defaultUrl || 'https://edugenius.vercel.app')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentResult, setCurrentResult] = useState<PageSpeedResult | null>(null)
  const [mobileResult, setMobileResult] = useState<PageSpeedResult | null>(null)
  const [desktopResult, setDesktopResult] = useState<PageSpeedResult | null>(null)
  const [performanceHistory, setPerformanceHistory] = useState<PerformanceHistoryType | null>(null)
  const [activeStrategy, setActiveStrategy] = useState<'mobile' | 'desktop'>('mobile')
  const [autoRefresh, setAutoRefresh] = useState(false)
  const { toast } = useToast()

  // Load initial data and start real-time monitoring
  useEffect(() => {
    if (url && isPageSpeedConfigured) {
      analyzePerformance()
      loadPerformanceHistory()
    }
    
    // Start real-time monitoring
    pageSpeedService.startRealTimeMonitoring()
  }, [])

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(() => {
      if (url) analyzePerformance()
    }, 60000) // Refresh every minute
    
    return () => clearInterval(interval)
  }, [autoRefresh, url])

  const analyzePerformance = useCallback(async () => {
    if (!url.trim()) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL to analyze',
        variant: 'destructive'
      })
      return
    }

    setIsAnalyzing(true)
    
    try {
      // Get both mobile and desktop results
      const { mobile, desktop } = await pageSpeedService.compareStrategies(url)
      
      setMobileResult(mobile)
      setDesktopResult(desktop)
      setCurrentResult(activeStrategy === 'mobile' ? mobile : desktop)

      toast({
        title: 'Analysis Complete',
        description: `Performance analysis completed for ${url}`,
      })
    } catch (error) {
      console.error('Performance analysis failed:', error)
      toast({
        title: 'Analysis Failed',
        description: 'Using demo data for performance metrics',
        variant: 'default'
      })
    } finally {
      setIsAnalyzing(false)
    }
  }, [url, activeStrategy, toast])

  const loadPerformanceHistory = async () => {
    if (!url) return
    
    try {
      const history = await pageSpeedService.trackPerformanceHistory(url)
      setPerformanceHistory(history)
    } catch (error) {
      console.info('📊 Performance history using sample data')
    }
  }

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl)
    setCurrentResult(null)
    setMobileResult(null)
    setDesktopResult(null)
    setPerformanceHistory(null)
  }

  const handleStrategyChange = (strategy: 'mobile' | 'desktop') => {
    setActiveStrategy(strategy)
    setCurrentResult(strategy === 'mobile' ? mobileResult : desktopResult)
  }

  const exportReport = () => {
    if (!currentResult) return
    
    const report = {
      url: currentResult.url,
      strategy: currentResult.strategy,
      timestamp: currentResult.timestamp,
      performance: currentResult.metrics,
      recommendations: pageSpeedService.generateRecommendations(currentResult)
    }
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pagespeed-report-${Date.now()}.json`
    a.click()
    
    toast({
      title: 'Report Exported',
      description: 'Performance report downloaded successfully'
    })
  }

  const shareReport = async () => {
    if (!currentResult) return
    
    const shareData = {
      title: 'PageSpeed Insights Report',
      text: `Performance score: ${Math.round(currentResult.metrics.performanceScore)} for ${currentResult.url}`,
      url: window.location.href
    }
    
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(`${shareData.title}: ${shareData.text}`)
        toast({
          title: 'Report Shared',
          description: 'Report details copied to clipboard'
        })
      }
    } else {
      navigator.clipboard.writeText(`${shareData.title}: ${shareData.text}`)
      toast({
        title: 'Report Copied',
        description: 'Report details copied to clipboard'
      })
    }
  }

  const getMetricStatus = (value: number, thresholds: { good: number; needsImprovement: number }) => {
    if (value <= thresholds.good) return { status: 'good', color: 'text-green-600' }
    if (value <= thresholds.needsImprovement) return { status: 'needs-improvement', color: 'text-yellow-600' }
    return { status: 'poor', color: 'text-red-600' }
  }

  const performanceGrade = currentResult ? getPerformanceGrade(currentResult.metrics.performanceScore) : null

  // Configuration check component
  if (!isPageSpeedConfigured) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>PageSpeed Insights Setup</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Gauge className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">PageSpeed API Not Configured</h3>
          <p className="text-muted-foreground mb-4">
            To enable real-time performance monitoring, configure your Google PageSpeed Insights API key
          </p>
          <div className="bg-muted p-4 rounded-lg text-left">
            <p className="font-medium mb-2">🔧 Setup Instructions:</p>
            <ol className="text-sm space-y-1">
              <li>1. Get API key from Google Cloud Console</li>
              <li>2. Enable PageSpeed Insights API</li>
              <li>3. Add PAGESPEED_INSIGHTS_API_KEY to .env.local</li>
              <li>4. Restart development server</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Header and Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <span>PageSpeed Insights Dashboard</span>
              {isPageSpeedConfigured && <Badge variant="secondary">API Connected</Badge>}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? 'bg-green-50' : ''}
              >
                <Activity className="h-4 w-4 mr-2" />
                Auto-refresh
              </Button>
              {currentResult && (
                <>
                  <Button variant="outline" size="sm" onClick={exportReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={shareReport}>
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="url-input">Website URL</Label>
              <Input
                id="url-input"
                type="url"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://example.com"
                className="mt-1"
              />
            </div>
            <div className="flex items-end space-x-2">
              <Button 
                onClick={analyzePerformance} 
                disabled={isAnalyzing || !url}
                className="min-w-[120px]"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Strategy Selector */}
          <div className="flex items-center space-x-4">
            <Label>Device Strategy:</Label>
            <div className="flex space-x-2">
              <Button
                variant={activeStrategy === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStrategyChange('mobile')}
              >
                <Smartphone className="h-4 w-4 mr-2" />
                Mobile
              </Button>
              <Button
                variant={activeStrategy === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStrategyChange('desktop')}
              >
                <Monitor className="h-4 w-4 mr-2" />
                Desktop
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      {currentResult && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className={`text-3xl font-bold ${performanceGrade?.color === 'green' ? 'text-green-600' : 
                  performanceGrade?.color === 'blue' ? 'text-blue-600' :
                  performanceGrade?.color === 'yellow' ? 'text-yellow-600' :
                  performanceGrade?.color === 'orange' ? 'text-orange-600' : 'text-red-600'}`}>
                  {Math.round(currentResult.metrics.performanceScore)}
                </div>
                <div>
                  <Badge variant={performanceGrade?.grade === 'A' || performanceGrade?.grade === 'B' ? 'default' : 'destructive'}>
                    Grade {performanceGrade?.grade}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {performanceGrade?.description}
                  </p>
                </div>
              </div>
              <Progress value={currentResult.metrics.performanceScore} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                First Contentful Paint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatMetricValue(currentResult.metrics.firstContentfulPaint, 'time')}
              </div>
              <p className="text-xs text-muted-foreground">
                Time to first content
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Largest Contentful Paint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getMetricStatus(currentResult.metrics.largestContentfulPaint, CORE_WEB_VITALS.LCP).color}`}>
                {formatMetricValue(currentResult.metrics.largestContentfulPaint, 'time')}
              </div>
              <p className="text-xs text-muted-foreground">
                Loading performance
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Cumulative Layout Shift
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getMetricStatus(currentResult.metrics.cumulativeLayoutShift, CORE_WEB_VITALS.CLS).color}`}>
                {currentResult.metrics.cumulativeLayoutShift.toFixed(3)}
              </div>
              <p className="text-xs text-muted-foreground">
                Visual stability
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Analysis */}
      {currentResult && (
        <Tabs defaultValue="metrics" className="space-y-4">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="metrics">Core Metrics</TabsTrigger>
            <TabsTrigger value="ai-optimizer">AI Optimizer</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            {showHistory && <TabsTrigger value="history">History</TabsTrigger>}
          </TabsList>

          <TabsContent value="metrics">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Core Web Vitals</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">First Contentful Paint</span>
                        <span className="font-mono text-sm">
                          {formatMetricValue(currentResult.metrics.firstContentfulPaint, 'time')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Largest Contentful Paint</span>
                        <span className={`font-mono text-sm ${getMetricStatus(currentResult.metrics.largestContentfulPaint, CORE_WEB_VITALS.LCP).color}`}>
                          {formatMetricValue(currentResult.metrics.largestContentfulPaint, 'time')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cumulative Layout Shift</span>
                        <span className={`font-mono text-sm ${getMetricStatus(currentResult.metrics.cumulativeLayoutShift, CORE_WEB_VITALS.CLS).color}`}>
                          {currentResult.metrics.cumulativeLayoutShift.toFixed(3)}
                        </span>
                      </div>
                      {currentResult.metrics.firstInputDelay && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm">First Input Delay</span>
                          <span className={`font-mono text-sm ${getMetricStatus(currentResult.metrics.firstInputDelay, CORE_WEB_VITALS.FID).color}`}>
                            {formatMetricValue(currentResult.metrics.firstInputDelay, 'time')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Additional Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Speed Index</span>
                        <span className="font-mono text-sm">
                          {formatMetricValue(currentResult.metrics.speedIndex, 'time')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Blocking Time</span>
                        <span className="font-mono text-sm">
                          {formatMetricValue(currentResult.metrics.totalBlockingTime, 'time')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Time to Interactive</span>
                        <span className="font-mono text-sm">
                          {formatMetricValue(currentResult.metrics.timeToInteractive, 'time')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-optimizer">
            <AIPerformanceOptimizer 
              performanceData={currentResult}
              onOptimizationComplete={(recommendations) => {
                console.log('AI Recommendations:', recommendations)
                toast({
                  title: 'AI Analysis Complete',
                  description: 'Performance optimization recommendations generated'
                })
              }}
            />
          </TabsContent>

          <TabsContent value="opportunities">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Performance Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {currentResult.opportunities.map((opportunity, index) => (
                      <div key={opportunity.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{opportunity.title}</h4>
                          {opportunity.displayValue && (
                            <Badge variant="outline">{opportunity.displayValue}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {opportunity.description}
                        </p>
                        {opportunity.score !== undefined && (
                          <Progress value={(1 - opportunity.score) * 100} className="h-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Performance Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {pageSpeedService.generateRecommendations(currentResult).map((rec, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium flex items-center">
                            {rec.priority === 'high' && <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />}
                            {rec.priority === 'medium' && <Clock className="h-4 w-4 mr-2 text-yellow-500" />}
                            {rec.priority === 'low' && <CheckCircle className="h-4 w-4 mr-2 text-green-500" />}
                            {rec.title}
                          </h4>
                          <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                        <div className="text-xs space-y-1">
                          <p><strong>Impact:</strong> {rec.impact}</p>
                          <p><strong>Implementation:</strong> {rec.implementation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison">
            <PerformanceComparison />
          </TabsContent>

          <TabsContent value="budgets">
            <PerformanceBudgets />
          </TabsContent>

          {showHistory && (
            <TabsContent value="history">
              <PerformanceHistory />
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  )
}