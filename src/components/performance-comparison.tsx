'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Trash2, 
  Play, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Trophy,
  Target,
  Zap,
  Smartphone,
  Monitor,
  RefreshCw
} from 'lucide-react'
import { pageSpeedService, type PageSpeedResult, getPerformanceGrade } from '@/lib/pagespeed'
import { useToast } from '@/hooks/use-toast'

interface ComparisonResult extends PageSpeedResult {
  rank?: number
  percentageDiff?: number
}

interface ComparisonSite {
  id: string
  name: string
  url: string
  result?: ComparisonResult
  loading?: boolean
  error?: string
}

export function PerformanceComparison() {
  const [sites, setSites] = useState<ComparisonSite[]>([
    { id: '1', name: 'Your Site', url: 'https://edugenius.vercel.app' }
  ])
  const [newSiteName, setNewSiteName] = useState('')
  const [newSiteUrl, setNewSiteUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [strategy, setStrategy] = useState<'mobile' | 'desktop'>('mobile')
  const { toast } = useToast()

  const addSite = () => {
    if (newSiteName && newSiteUrl) {
      const newSite: ComparisonSite = {
        id: Date.now().toString(),
        name: newSiteName,
        url: newSiteUrl
      }
      setSites([...sites, newSite])
      setNewSiteName('')
      setNewSiteUrl('')
    }
  }

  const removeSite = (id: string) => {
    setSites(sites.filter(site => site.id !== id))
  }

  const runComparison = async () => {
    setIsAnalyzing(true)
    
    try {
      const results: ComparisonSite[] = []
      
      for (const site of sites) {
        try {
          setSites(prev => prev.map(s => 
            s.id === site.id ? { ...s, loading: true, error: undefined } : s
          ))
          
          const result = await pageSpeedService.analyzeUrl(site.url, strategy)
          results.push({ ...site, result: result as ComparisonResult, loading: false })
        } catch (error) {
          results.push({ 
            ...site, 
            loading: false, 
            error: 'Failed to analyze' 
          })
        }
      }
      
      // Rank results and calculate differences
      const sortedResults = results
        .filter(site => site.result)
        .sort((a, b) => (b.result!.metrics.performanceScore) - (a.result!.metrics.performanceScore))
      
      const bestScore = sortedResults[0]?.result?.metrics.performanceScore || 0
      
      sortedResults.forEach((site, index) => {
        if (site.result) {
          site.result.rank = index + 1
          site.result.percentageDiff = ((site.result.metrics.performanceScore - bestScore) / bestScore) * 100
        }
      })
      
      // Update sites with results
      setSites(prevSites => 
        prevSites.map(site => {
          const updatedSite = results.find(r => r.id === site.id)
          return updatedSite || { ...site, loading: false }
        })
      )
      
      toast({
        title: 'Comparison Complete',
        description: `Analyzed ${results.length} websites successfully`
      })
    } catch (error) {
      toast({
        title: 'Analysis Error', 
        description: 'Some sites could not be analyzed',
        variant: 'destructive'
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getRankColor = (rank?: number) => {
    if (!rank) return 'text-muted-foreground'
    if (rank === 1) return 'text-yellow-600'
    if (rank === 2) return 'text-gray-500' 
    if (rank === 3) return 'text-orange-600'
    return 'text-muted-foreground'
  }

  const getRankIcon = (rank?: number) => {
    if (rank === 1) return <Trophy className="h-4 w-4" />
    return <Target className="h-4 w-4" />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Performance Comparison
          </span>
          <div className="flex items-center space-x-2">
            <Tabs value={strategy} onValueChange={(val) => setStrategy(val as 'mobile' | 'desktop')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="mobile" className="text-xs">
                  <Smartphone className="h-3 w-3 mr-1" />
                  Mobile
                </TabsTrigger>
                <TabsTrigger value="desktop" className="text-xs">
                  <Monitor className="h-3 w-3 mr-1" />
                  Desktop
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Add New Site */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input
            placeholder="Site name (e.g., Competitor A)"
            value={newSiteName}
            onChange={(e) => setNewSiteName(e.target.value)}
          />
          <Input
            placeholder="https://example.com"
            value={newSiteUrl}
            onChange={(e) => setNewSiteUrl(e.target.value)}
          />
          <Button onClick={addSite} disabled={!newSiteName || !newSiteUrl}>
            <Plus className="h-4 w-4 mr-2" />
            Add Site
          </Button>
        </div>

        {/* Sites List */}
        <div className="space-y-3">
          {sites.map((site) => (
            <div key={site.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {site.result?.rank && getRankIcon(site.result.rank)}
                  <span className={`font-medium ${getRankColor(site.result?.rank)}`}>
                    {site.name}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {new URL(site.url).hostname}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                {site.loading && <RefreshCw className="h-4 w-4 animate-spin" />}
                {site.error && <Badge variant="destructive">{site.error}</Badge>}
                {site.result && (
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {Math.round(site.result.metrics.performanceScore)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getPerformanceGrade(site.result.metrics.performanceScore).grade}
                      </div>
                    </div>
                    {site.result.percentageDiff !== undefined && site.result.rank !== 1 && (
                      <div className="flex items-center text-sm">
                        <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                        <span className="text-red-600">
                          {Math.abs(site.result.percentageDiff).toFixed(1)}%
                        </span>
                      </div>
                    )}
                    {site.result.rank === 1 && (
                      <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                        <Trophy className="h-3 w-3 mr-1" />
                        Winner
                      </Badge>
                    )}
                  </div>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeSite(site.id)}
                  disabled={sites.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Run Comparison */}
        <div className="flex justify-center">
          <Button 
            onClick={runComparison} 
            disabled={isAnalyzing || sites.length < 2}
            className="min-w-[200px]"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Sites...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Comparison
              </>
            )}
          </Button>
        </div>

        {/* Comparison Results */}
        {sites.some(site => site.result) && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Comparison Results</h3>
            
            {/* Performance Metrics Comparison */}
            <div className="grid grid-cols-1 gap-4">
              {['performanceScore', 'firstContentfulPaint', 'largestContentfulPaint', 'cumulativeLayoutShift'].map((metric) => (
                <Card key={metric} className="p-4">
                  <h4 className="font-medium mb-3 capitalize">
                    {metric.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </h4>
                  <div className="space-y-2">
                    {sites
                      .filter(site => site.result && site.result.metrics)
                      .sort((a, b) => {
                        const aMetrics = a.result?.metrics
                        const bMetrics = b.result?.metrics
                        if (!aMetrics || !bMetrics) return 0
                        
                        const aVal = metric === 'cumulativeLayoutShift' 
                          ? -(aMetrics[metric as keyof typeof aMetrics] as number)
                          : metric === 'performanceScore'
                          ? -(aMetrics[metric as keyof typeof aMetrics] as number)
                          : (aMetrics[metric as keyof typeof aMetrics] as number)
                        const bVal = metric === 'cumulativeLayoutShift'
                          ? -(bMetrics[metric as keyof typeof bMetrics] as number)
                          : metric === 'performanceScore'
                          ? -(bMetrics[metric as keyof typeof bMetrics] as number)
                          : (bMetrics[metric as keyof typeof bMetrics] as number)
                        return aVal - bVal
                      })
                      .map((site) => {
                        const siteResult = site.result
                        const siteMetrics = siteResult?.metrics
                        if (!siteResult || !siteMetrics) return null
                        
                        const value = siteMetrics[metric as keyof typeof siteMetrics] as number
                        const displayValue = metric === 'performanceScore' 
                          ? Math.round(value)
                          : metric.includes('Paint') || metric === 'timeToInteractive'
                          ? `${(value / 1000).toFixed(1)}s`
                          : metric === 'cumulativeLayoutShift'
                          ? value.toFixed(3)
                          : Math.round(value)
                        
                        const maxValue = Math.max(...sites
                          .filter(s => s.result?.metrics)
                          .map(s => {
                            const resultMetrics = s.result?.metrics
                            return resultMetrics ? (resultMetrics[metric as keyof typeof resultMetrics] as number) : 0
                          })
                        )
                        
                        const progressValue = metric === 'performanceScore'
                          ? value
                          : metric === 'cumulativeLayoutShift'
                          ? ((0.3 - value) / 0.3) * 100
                          : ((maxValue - value) / maxValue) * 100
                        
                        return (
                          <div key={site.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 min-w-[120px]">
                              <span className="text-sm font-medium">{site.name}</span>
                            </div>
                            <div className="flex items-center space-x-3 flex-1">
                              <Progress 
                                value={Math.max(0, Math.min(100, progressValue))} 
                                className="flex-1" 
                              />
                              <span className="text-sm font-mono min-w-[60px] text-right">
                                {displayValue}
                              </span>
                            </div>
                          </div>
                        )
                      })
                      .filter(Boolean)}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}