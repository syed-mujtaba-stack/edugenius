'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Zap, 
  Gauge, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  RefreshCw,
  ExternalLink,
  Activity
} from 'lucide-react'
import { 
  pageSpeedService, 
  type PageSpeedResult,
  getPerformanceGrade,
  isPageSpeedConfigured
} from '@/lib/pagespeed'
import Link from 'next/link'

interface PerformanceMonitorProps {
  className?: string
  showActions?: boolean
}

export function PerformanceMonitor({ 
  className = '', 
  showActions = true 
}: PerformanceMonitorProps) {
  const [performanceData, setPerformanceData] = useState<PageSpeedResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Load performance data for current domain
  useEffect(() => {
    loadCurrentSitePerformance()
    
    // Set up periodic refresh
    const interval = setInterval(loadCurrentSitePerformance, 300000) // 5 minutes
    return () => clearInterval(interval)
  }, [])

  const loadCurrentSitePerformance = async () => {
    if (!isPageSpeedConfigured) {
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      
      // Get current site URL or use default
      const currentUrl = typeof window !== 'undefined' 
        ? window.location.origin 
        : 'https://edugenius.vercel.app'
      
      const result = await pageSpeedService.analyzeUrl(currentUrl, 'mobile')
      setPerformanceData(result)
      setLastUpdated(new Date())
    } catch (error) {
      console.info('📊 Performance monitoring using demo data')
      // Still show demo data for UI consistency
      const mockResult = await pageSpeedService.analyzeUrl('https://edugenius.vercel.app', 'mobile')
      setPerformanceData(mockResult)
    } finally {
      setIsLoading(false)
    }
  }

  const performanceGrade = performanceData ? getPerformanceGrade(performanceData.metrics.performanceScore) : null

  // Core Web Vitals status
  const getCoreWebVitalsStatus = () => {
    if (!performanceData) return null
    
    const { metrics } = performanceData
    const vitals = [
      { name: 'LCP', value: metrics.largestContentfulPaint, threshold: 2500 },
      { name: 'FID', value: metrics.firstInputDelay || 0, threshold: 100 },
      { name: 'CLS', value: metrics.cumulativeLayoutShift, threshold: 0.1 }
    ]
    
    const passed = vitals.filter(v => v.value <= v.threshold).length
    return { passed, total: vitals.length, percentage: (passed / vitals.length) * 100 }
  }

  const coreVitalsStatus = getCoreWebVitalsStatus()

  // Configuration check
  if (!isPageSpeedConfigured) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-sm flex items-center">
            <Gauge className="h-4 w-4 mr-2" />
            Performance Monitor
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <Activity className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground mb-3">
            PageSpeed API not configured
          </p>
          {showActions && (
            <Link href="/performance">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-3 w-3 mr-2" />
                Setup Monitoring
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    )
  }

  if (isLoading && !performanceData) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-sm flex items-center">
            <Gauge className="h-4 w-4 mr-2" />
            Performance Monitor
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Analyzing performance...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center">
            <Gauge className="h-4 w-4 mr-2" />
            Performance Monitor
          </CardTitle>
          <Badge variant={isPageSpeedConfigured ? 'default' : 'secondary'}>
            {isPageSpeedConfigured ? 'Live' : 'Demo'}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {performanceData && (
          <>
            {/* Performance Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Performance Score</span>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={performanceGrade?.grade === 'A' || performanceGrade?.grade === 'B' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {performanceGrade?.grade}
                  </Badge>
                  <span className={`text-lg font-bold ${
                    performanceGrade?.color === 'green' ? 'text-green-600' : 
                    performanceGrade?.color === 'blue' ? 'text-blue-600' :
                    performanceGrade?.color === 'yellow' ? 'text-yellow-600' :
                    performanceGrade?.color === 'orange' ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {Math.round(performanceData.metrics.performanceScore)}
                  </span>
                </div>
              </div>
              <Progress value={performanceData.metrics.performanceScore} />
            </div>

            {/* Core Web Vitals */}
            {coreVitalsStatus && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Core Web Vitals</span>
                  <div className="flex items-center space-x-1">
                    {coreVitalsStatus.passed === coreVitalsStatus.total ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-sm text-muted-foreground">
                      {coreVitalsStatus.passed}/{coreVitalsStatus.total}
                    </span>
                  </div>
                </div>
                <Progress value={coreVitalsStatus.percentage} />
              </div>
            )}

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-muted-foreground mb-1">LCP</p>
                <p className="font-mono">
                  {(performanceData.metrics.largestContentfulPaint / 1000).toFixed(1)}s
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">CLS</p>
                <p className="font-mono">
                  {performanceData.metrics.cumulativeLayoutShift.toFixed(3)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">FCP</p>
                <p className="font-mono">
                  {(performanceData.metrics.firstContentfulPaint / 1000).toFixed(1)}s
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">TTI</p>
                <p className="font-mono">
                  {(performanceData.metrics.timeToInteractive / 1000).toFixed(1)}s
                </p>
              </div>
            </div>

            {/* Opportunities Count */}
            {performanceData.opportunities.length > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Optimization opportunities</span>
                <Badge variant="outline">{performanceData.opportunities.length}</Badge>
              </div>
            )}

            {/* Last Updated */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Updated {lastUpdated.toLocaleTimeString()}</span>
              {isLoading && <RefreshCw className="h-3 w-3 animate-spin" />}
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex space-x-2 pt-2">
                <Link href="/performance" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <TrendingUp className="h-3 w-3 mr-2" />
                    View Details
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={loadCurrentSitePerformance}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}