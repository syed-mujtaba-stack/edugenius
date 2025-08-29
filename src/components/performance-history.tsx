'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Download,
  Settings,
  Play,
  Pause
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { pageSpeedService, type PageSpeedResult } from '@/lib/pagespeed'
import { useToast } from '@/hooks/use-toast'

interface PerformanceHistoryEntry {
  id: string
  url: string
  timestamp: Date
  result: PageSpeedResult
}

interface PerformanceTrend {
  date: string
  score: number
  lcp: number
  fcp: number
  cls: number
  tti: number
}

export function PerformanceHistory() {
  const [history, setHistory] = useState<PerformanceHistoryEntry[]>([])
  const [trends, setTrends] = useState<PerformanceTrend[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [monitoringInterval, setMonitoringInterval] = useState<NodeJS.Timeout | null>(null)
  const [selectedUrl, setSelectedUrl] = useState('https://edugenius.vercel.app')
  const { toast } = useToast()

  // Load historical data on component mount
  useEffect(() => {
    loadHistoricalData()
    
    // Check if monitoring was active
    const wasMonitoring = localStorage.getItem('performance-monitoring') === 'true'
    if (wasMonitoring) {
      startMonitoring()
    }
  }, [])

  // Update trends when history changes
  useEffect(() => {
    updateTrends()
  }, [history])

  const loadHistoricalData = () => {
    try {
      const stored = localStorage.getItem('performance-history')
      if (stored) {
        const parsed = JSON.parse(stored)
        setHistory(parsed.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        })))
      }
    } catch (error) {
      console.warn('Failed to load performance history:', error)
    }
  }

  const saveHistoricalData = (newHistory: PerformanceHistoryEntry[]) => {
    try {
      localStorage.setItem('performance-history', JSON.stringify(newHistory))
    } catch (error) {
      console.warn('Failed to save performance history:', error)
    }
  }

  const updateTrends = () => {
    const urlHistory = history.filter(entry => entry.url === selectedUrl)
    const trendData = urlHistory
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .slice(-30) // Last 30 entries
      .map(entry => ({
        date: entry.timestamp.toLocaleDateString(),
        score: Math.round(entry.result.metrics.performanceScore),
        lcp: Math.round(entry.result.metrics.largestContentfulPaint / 1000 * 10) / 10,
        fcp: Math.round(entry.result.metrics.firstContentfulPaint / 1000 * 10) / 10,
        cls: Math.round(entry.result.metrics.cumulativeLayoutShift * 1000) / 1000,
        tti: Math.round(entry.result.metrics.timeToInteractive / 1000 * 10) / 10
      }))
    
    setTrends(trendData)
  }

  const runSingleAnalysis = async () => {
    setIsLoading(true)
    
    try {
      const result = await pageSpeedService.analyzeUrl(selectedUrl)
      
      const newEntry: PerformanceHistoryEntry = {
        id: Date.now().toString(),
        url: selectedUrl,
        timestamp: new Date(),
        result
      }
      
      const updatedHistory = [newEntry, ...history].slice(0, 100) // Keep last 100 entries
      setHistory(updatedHistory)
      saveHistoricalData(updatedHistory)
      
      toast({
        title: 'Analysis Complete',
        description: `Performance score: ${Math.round(result.metrics.performanceScore)}`,
      })
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: 'Unable to analyze performance at this time',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const startMonitoring = () => {
    if (monitoringInterval) return
    
    setIsMonitoring(true)
    localStorage.setItem('performance-monitoring', 'true')
    
    const interval = setInterval(async () => {
      try {
        const result = await pageSpeedService.analyzeUrl(selectedUrl)
        
        const newEntry: PerformanceHistoryEntry = {
          id: Date.now().toString(),
          url: selectedUrl,
          timestamp: new Date(),
          result
        }
        
        setHistory(prev => {
          const updated = [newEntry, ...prev].slice(0, 100)
          saveHistoricalData(updated)
          return updated
        })
      } catch (error) {
        console.warn('Automated monitoring failed:', error)
      }
    }, 300000) // Every 5 minutes
    
    setMonitoringInterval(interval)
    
    toast({
      title: 'Monitoring Started',
      description: 'Performance will be checked every 5 minutes',
    })
  }

  const stopMonitoring = () => {
    if (monitoringInterval) {
      clearInterval(monitoringInterval)
      setMonitoringInterval(null)
    }
    
    setIsMonitoring(false)
    localStorage.setItem('performance-monitoring', 'false')
    
    toast({
      title: 'Monitoring Stopped',
      description: 'Automated performance checks disabled',
    })
  }

  const exportData = () => {
    const dataStr = JSON.stringify(history, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `performance-history-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast({
      title: 'Data Exported',
      description: 'Performance history downloaded successfully',
    })
  }

  const getLatestScore = () => {
    const latest = history.find(entry => entry.url === selectedUrl)
    return latest ? Math.round(latest.result.metrics.performanceScore) : null
  }

  const getScoreChange = () => {
    const urlHistory = history.filter(entry => entry.url === selectedUrl).slice(0, 2)
    if (urlHistory.length < 2) return null
    
    const current = urlHistory[0].result.metrics.performanceScore
    const previous = urlHistory[1].result.metrics.performanceScore
    return Math.round(current - previous)
  }

  const getUniqueUrls = () => {
    return [...new Set(history.map(entry => entry.url))]
  }

  const latestScore = getLatestScore()
  const scoreChange = getScoreChange()
  const uniqueUrls = getUniqueUrls()

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Performance History & Monitoring
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant={isMonitoring ? 'default' : 'secondary'}>
                {isMonitoring ? 'Monitoring Active' : 'Manual Mode'}
              </Badge>
              <Button variant="outline" onClick={exportData} disabled={history.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* URL Selection and Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <select 
              value={selectedUrl} 
              onChange={(e) => setSelectedUrl(e.target.value)}
              className="flex-1 p-2 border rounded-md"
            >
              <option value="https://edugenius.vercel.app">EduGenius (Main Site)</option>
              {uniqueUrls
                .filter(url => url !== 'https://edugenius.vercel.app')
                .map(url => (
                  <option key={url} value={url}>
                    {new URL(url).hostname}
                  </option>
                ))
              }
            </select>
            
            <Button onClick={runSingleAnalysis} disabled={isLoading}>
              <Play className="h-4 w-4 mr-2" />
              {isLoading ? 'Analyzing...' : 'Analyze Now'}
            </Button>
            
            {isMonitoring ? (
              <Button onClick={stopMonitoring} variant="destructive">
                <Pause className="h-4 w-4 mr-2" />
                Stop Monitoring
              </Button>
            ) : (
              <Button onClick={startMonitoring} variant="default">
                <Play className="h-4 w-4 mr-2" />
                Start Monitoring
              </Button>
            )}
          </div>
          
          {/* Current Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold mb-1">
                  {latestScore || '--'}
                </div>
                <p className="text-sm text-muted-foreground mb-2">Current Score</p>
                {scoreChange !== null && (
                  <div className="flex items-center justify-center">
                    {scoreChange > 0 ? (
                      <>
                        <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
                        <span className="text-green-600">+{scoreChange}</span>
                      </>
                    ) : scoreChange < 0 ? (
                      <>
                        <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
                        <span className="text-red-600">{scoreChange}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">No change</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold mb-1">
                  {history.filter(entry => entry.url === selectedUrl).length}
                </div>
                <p className="text-sm text-muted-foreground">Total Checks</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold mb-1">
                  {history.length > 0 
                    ? Math.round((new Date().getTime() - new Date(Math.max(...history.map(h => h.timestamp.getTime()))).getTime()) / (1000 * 60))
                    : '--'
                  }m
                </div>
                <p className="text-sm text-muted-foreground">Last Check</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Performance Trends Chart */}
      {trends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Performance Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Core Web Vitals History */}
      {trends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Core Web Vitals History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="lcp" 
                    stroke="#ef4444" 
                    name="LCP (s)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fcp" 
                    stroke="#10b981" 
                    name="FCP (s)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tti" 
                    stroke="#8b5cf6" 
                    name="TTI (s)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recent Performance Checks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {history
                .filter(entry => entry.url === selectedUrl)
                .slice(0, 20)
                .map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-sm text-muted-foreground">
                        {entry.timestamp.toLocaleString()}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {entry.result.strategy}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-semibold">
                          {Math.round(entry.result.metrics.performanceScore)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Score
                        </div>
                      </div>
                      
                      <div className="text-right text-sm">
                        <div>LCP: {(entry.result.metrics.largestContentfulPaint / 1000).toFixed(1)}s</div>
                        <div className="text-xs text-muted-foreground">
                          CLS: {entry.result.metrics.cumulativeLayoutShift.toFixed(3)}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        {entry.result.metrics.performanceScore >= 90 ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : entry.result.metrics.performanceScore >= 50 ? (
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              
              {history.filter(entry => entry.url === selectedUrl).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No performance data available yet.</p>
                  <p className="text-sm">Run an analysis or start monitoring to begin tracking.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}