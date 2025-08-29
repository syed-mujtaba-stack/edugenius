'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Bell,
  Settings,
  Save,
  RefreshCw
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface PerformanceBudget {
  id: string
  name: string
  enabled: boolean
  thresholds: {
    performanceScore: number
    firstContentfulPaint: number // in seconds
    largestContentfulPaint: number // in seconds
    cumulativeLayoutShift: number
    timeToInteractive: number // in seconds
  }
  alerts: {
    email: boolean
    browser: boolean
    frequency: 'immediate' | 'daily' | 'weekly'
  }
}

interface BudgetViolation {
  budgetId: string
  metric: string
  threshold: number
  actual: number
  severity: 'warning' | 'critical'
  timestamp: Date
}

export function PerformanceBudgets() {
  const [budgets, setBudgets] = useState<PerformanceBudget[]>([])
  const [violations, setViolations] = useState<BudgetViolation[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingBudget, setEditingBudget] = useState<PerformanceBudget | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadBudgets()
    loadViolations()
  }, [])

  const loadBudgets = () => {
    try {
      const stored = localStorage.getItem('performance-budgets')
      if (stored) {
        setBudgets(JSON.parse(stored))
      } else {
        // Create default budget
        const defaultBudget: PerformanceBudget = {
          id: 'default',
          name: 'EduGenius Production',
          enabled: true,
          thresholds: {
            performanceScore: 85,
            firstContentfulPaint: 1.8,
            largestContentfulPaint: 2.5,
            cumulativeLayoutShift: 0.1,
            timeToInteractive: 3.8
          },
          alerts: {
            email: false,
            browser: true,
            frequency: 'immediate'
          }
        }
        setBudgets([defaultBudget])
        saveBudgets([defaultBudget])
      }
    } catch (error) {
      console.warn('Failed to load performance budgets:', error)
    }
  }

  const loadViolations = () => {
    try {
      const stored = localStorage.getItem('performance-violations')
      if (stored) {
        const parsed = JSON.parse(stored)
        setViolations(parsed.map((v: any) => ({
          ...v,
          timestamp: new Date(v.timestamp)
        })))
      }
    } catch (error) {
      console.warn('Failed to load performance violations:', error)
    }
  }

  const saveBudgets = (newBudgets: PerformanceBudget[]) => {
    try {
      localStorage.setItem('performance-budgets', JSON.stringify(newBudgets))
    } catch (error) {
      console.warn('Failed to save performance budgets:', error)
    }
  }

  const saveViolations = (newViolations: BudgetViolation[]) => {
    try {
      localStorage.setItem('performance-violations', JSON.stringify(newViolations))
    } catch (error) {
      console.warn('Failed to save performance violations:', error)
    }
  }

  const createNewBudget = () => {
    const newBudget: PerformanceBudget = {
      id: Date.now().toString(),
      name: 'New Performance Budget',
      enabled: true,
      thresholds: {
        performanceScore: 80,
        firstContentfulPaint: 2.0,
        largestContentfulPaint: 3.0,
        cumulativeLayoutShift: 0.15,
        timeToInteractive: 4.0
      },
      alerts: {
        email: false,
        browser: true,
        frequency: 'immediate'
      }
    }
    setEditingBudget(newBudget)
    setIsEditing(true)
  }

  const editBudget = (budget: PerformanceBudget) => {
    setEditingBudget({ ...budget })
    setIsEditing(true)
  }

  const saveBudget = () => {
    if (!editingBudget) return

    const isNew = !budgets.find(b => b.id === editingBudget.id)
    const updatedBudgets = isNew 
      ? [...budgets, editingBudget]
      : budgets.map(b => b.id === editingBudget.id ? editingBudget : b)
    
    setBudgets(updatedBudgets)
    saveBudgets(updatedBudgets)
    setIsEditing(false)
    setEditingBudget(null)

    toast({
      title: 'Budget Saved',
      description: `Performance budget "${editingBudget.name}" has been saved`,
    })
  }

  const deleteBudget = (budgetId: string) => {
    const updatedBudgets = budgets.filter(b => b.id !== budgetId)
    setBudgets(updatedBudgets)
    saveBudgets(updatedBudgets)

    toast({
      title: 'Budget Deleted',
      description: 'Performance budget has been removed',
    })
  }

  const toggleBudget = (budgetId: string, enabled: boolean) => {
    const updatedBudgets = budgets.map(b => 
      b.id === budgetId ? { ...b, enabled } : b
    )
    setBudgets(updatedBudgets)
    saveBudgets(updatedBudgets)
  }

  // Simulate performance check against budgets
  const checkPerformanceBudgets = async () => {
    const newViolations: BudgetViolation[] = []
    
    // Simulate current performance metrics (in a real app, this would come from actual performance data)
    const currentMetrics = {
      performanceScore: 78,
      firstContentfulPaint: 2.1,
      largestContentfulPaint: 3.2,
      cumulativeLayoutShift: 0.08,
      timeToInteractive: 4.5
    }

    budgets.filter(b => b.enabled).forEach(budget => {
      Object.entries(budget.thresholds).forEach(([metric, threshold]) => {
        const actualValue = currentMetrics[metric as keyof typeof currentMetrics]
        
        let violated = false
        if (metric === 'performanceScore') {
          violated = actualValue < threshold
        } else if (metric === 'cumulativeLayoutShift') {
          violated = actualValue > threshold
        } else {
          violated = actualValue > threshold
        }

        if (violated) {
          const severity: 'warning' | 'critical' = 
            metric === 'performanceScore' && actualValue < threshold * 0.8 ? 'critical' :
            metric !== 'performanceScore' && actualValue > threshold * 1.5 ? 'critical' : 'warning'

          newViolations.push({
            budgetId: budget.id,
            metric,
            threshold,
            actual: actualValue,
            severity,
            timestamp: new Date()
          })
        }
      })
    })

    if (newViolations.length > 0) {
      const allViolations = [...newViolations, ...violations].slice(0, 50) // Keep last 50
      setViolations(allViolations)
      saveViolations(allViolations)

      // Show browser notifications if enabled
      if ('Notification' in window && Notification.permission === 'granted') {
        budgets.forEach(budget => {
          if (budget.alerts.browser && newViolations.some(v => v.budgetId === budget.id)) {
            new Notification('Performance Budget Violation', {
              body: `Performance issues detected for ${budget.name}`,
              icon: '/favicon.ico'
            })
          }
        })
      }

      toast({
        title: 'Budget Violations Detected',
        description: `${newViolations.length} performance issues found`,
        variant: 'destructive'
      })
    } else {
      toast({
        title: 'All Budgets Passed',
        description: 'No performance violations detected',
      })
    }
  }

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          toast({
            title: 'Notifications Enabled',
            description: 'You will receive performance alerts',
          })
        }
      })
    }
  }

  const getViolationColor = (severity: 'warning' | 'critical') => {
    return severity === 'critical' ? 'text-red-600' : 'text-yellow-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Performance Budgets
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button onClick={requestNotificationPermission} variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Enable Alerts
              </Button>
              <Button onClick={checkPerformanceBudgets} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Now
              </Button>
              <Button onClick={createNewBudget}>
                <Target className="h-4 w-4 mr-2" />
                New Budget
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Budget List */}
      {!isEditing && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {budgets.map((budget) => (
            <Card key={budget.id} className={budget.enabled ? '' : 'opacity-60'}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{budget.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={budget.enabled}
                      onCheckedChange={(enabled) => toggleBudget(budget.id, enabled)}
                    />
                    <Button variant="outline" size="sm" onClick={() => editBudget(budget)}>
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Performance Score */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Performance Score</span>
                    <span className="text-sm">≥ {budget.thresholds.performanceScore}</span>
                  </div>
                  <Progress value={budget.thresholds.performanceScore} />
                </div>

                {/* Core Web Vitals */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">FCP Threshold</div>
                    <div className="font-medium">≤ {budget.thresholds.firstContentfulPaint}s</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">LCP Threshold</div>
                    <div className="font-medium">≤ {budget.thresholds.largestContentfulPaint}s</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">CLS Threshold</div>
                    <div className="font-medium">≤ {budget.thresholds.cumulativeLayoutShift}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">TTI Threshold</div>
                    <div className="font-medium">≤ {budget.thresholds.timeToInteractive}s</div>
                  </div>
                </div>

                {/* Alert Settings */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Alerts</span>
                  <div className="flex items-center space-x-2">
                    {budget.alerts.browser && <Badge variant="outline">Browser</Badge>}
                    {budget.alerts.email && <Badge variant="outline">Email</Badge>}
                    <Badge variant="secondary">{budget.alerts.frequency}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Budget Editor */}
      {isEditing && editingBudget && (
        <Card>
          <CardHeader>
            <CardTitle>
              {budgets.find(b => b.id === editingBudget.id) ? 'Edit' : 'Create'} Performance Budget
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Budget Name */}
            <div>
              <label className="text-sm font-medium mb-2 block">Budget Name</label>
              <Input
                value={editingBudget.name}
                onChange={(e) => setEditingBudget({
                  ...editingBudget,
                  name: e.target.value
                })}
                placeholder="Enter budget name"
              />
            </div>

            {/* Performance Thresholds */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Performance Thresholds</h3>
              
              {/* Performance Score */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Minimum Performance Score: {editingBudget.thresholds.performanceScore}
                </label>
                <Slider
                  value={[editingBudget.thresholds.performanceScore]}
                  onValueChange={([value]) => setEditingBudget({
                    ...editingBudget,
                    thresholds: { ...editingBudget.thresholds, performanceScore: value }
                  })}
                  max={100}
                  min={0}
                  step={1}
                />
              </div>

              {/* First Contentful Paint */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Max First Contentful Paint: {editingBudget.thresholds.firstContentfulPaint}s
                </label>
                <Slider
                  value={[editingBudget.thresholds.firstContentfulPaint]}
                  onValueChange={([value]) => setEditingBudget({
                    ...editingBudget,
                    thresholds: { ...editingBudget.thresholds, firstContentfulPaint: value }
                  })}
                  max={5}
                  min={0.5}
                  step={0.1}
                />
              </div>

              {/* Largest Contentful Paint */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Max Largest Contentful Paint: {editingBudget.thresholds.largestContentfulPaint}s
                </label>
                <Slider
                  value={[editingBudget.thresholds.largestContentfulPaint]}
                  onValueChange={([value]) => setEditingBudget({
                    ...editingBudget,
                    thresholds: { ...editingBudget.thresholds, largestContentfulPaint: value }
                  })}
                  max={6}
                  min={1}
                  step={0.1}
                />
              </div>

              {/* Cumulative Layout Shift */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Max Cumulative Layout Shift: {editingBudget.thresholds.cumulativeLayoutShift}
                </label>
                <Slider
                  value={[editingBudget.thresholds.cumulativeLayoutShift]}
                  onValueChange={([value]) => setEditingBudget({
                    ...editingBudget,
                    thresholds: { ...editingBudget.thresholds, cumulativeLayoutShift: value }
                  })}
                  max={0.5}
                  min={0}
                  step={0.01}
                />
              </div>

              {/* Time to Interactive */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Max Time to Interactive: {editingBudget.thresholds.timeToInteractive}s
                </label>
                <Slider
                  value={[editingBudget.thresholds.timeToInteractive]}
                  onValueChange={([value]) => setEditingBudget({
                    ...editingBudget,
                    thresholds: { ...editingBudget.thresholds, timeToInteractive: value }
                  })}
                  max={10}
                  min={1}
                  step={0.1}
                />
              </div>
            </div>

            {/* Alert Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Alert Settings</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Browser Notifications</span>
                  <Switch
                    checked={editingBudget.alerts.browser}
                    onCheckedChange={(browser) => setEditingBudget({
                      ...editingBudget,
                      alerts: { ...editingBudget.alerts, browser }
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Email Alerts</span>
                  <Switch
                    checked={editingBudget.alerts.email}
                    onCheckedChange={(email) => setEditingBudget({
                      ...editingBudget,
                      alerts: { ...editingBudget.alerts, email }
                    })}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Alert Frequency</label>
                  <select 
                    value={editingBudget.alerts.frequency}
                    onChange={(e) => setEditingBudget({
                      ...editingBudget,
                      alerts: { 
                        ...editingBudget.alerts, 
                        frequency: e.target.value as 'immediate' | 'daily' | 'weekly'
                      }
                    })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="immediate">Immediate</option>
                    <option value="daily">Daily Summary</option>
                    <option value="weekly">Weekly Summary</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4 border-t">
              <Button onClick={saveBudget}>
                <Save className="h-4 w-4 mr-2" />
                Save Budget
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              {budgets.find(b => b.id === editingBudget.id) && (
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    deleteBudget(editingBudget.id)
                    setIsEditing(false)
                  }}
                >
                  Delete Budget
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Violations */}
      {violations.length > 0 && !isEditing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Recent Violations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {violations.slice(0, 10).map((violation, index) => {
                const budget = budgets.find(b => b.id === violation.budgetId)
                return (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className={`h-4 w-4 ${getViolationColor(violation.severity)}`} />
                      <div>
                        <div className="font-medium">{budget?.name || 'Unknown Budget'}</div>
                        <div className="text-sm text-muted-foreground">
                          {violation.metric} violation • {violation.timestamp.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`font-semibold ${getViolationColor(violation.severity)}`}>
                        {violation.actual.toFixed(2)} 
                        <span className="text-muted-foreground"> / {violation.threshold}</span>
                      </div>
                      <Badge variant={violation.severity === 'critical' ? 'destructive' : 'secondary'}>
                        {violation.severity}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}