'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LearningPathGenerator } from '../ai/LearningPathGenerator';
import { AchievementSystem } from '../gamification/AchievementSystem';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RealtimeDashboardStats } from '../realtime-dashboard-stats';
import { RealtimeChat } from '../realtime-chat';
import { PerformanceMonitor } from '../performance-monitor';
import { BookOpen, Target, Trophy, BarChart3, Plus, CheckCircle, Clock } from 'lucide-react';
// Using direct API call instead of import
const generateLearningPath = async (params: {
  goal: string;
  weakTopics: string[];
  apiKey?: string;
}) => {
  const response = await fetch('/api/ai/generate-learning-path', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      learningStyle: 'visual', // Default value, can be made configurable
      difficulty: 'intermediate', // Default value, can be made configurable
      topics: params.weakTopics,
      timeCommitment: 5, // Default value, can be made configurable
      apiKey: params.apiKey,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate learning path');
  }

  return response.json();
};

interface LearningPathOutput {
  modules: Array<{
    title: string;
    description: string;
    duration: string;
    resources: Array<{
      title: string;
      type: 'video' | 'article' | 'exercise' | 'project';
      url: string;
      duration: string;
      description?: string;
    }>;
    exercises: string[];
  }>;
}

export function DashboardTabs() {
  const [user] = useAuthState(auth);
  const [goal, setGoal] = useState('');
  const [weakTopics, setWeakTopics] = useState('');
  const [learningPlan, setLearningPlan] = useState<LearningPathOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchApiKey = () => {
      const storedKey = localStorage.getItem('user-gemini-api-key');
      setApiKey(storedKey);
    };

    fetchApiKey();
    window.addEventListener('apiKeyUpdated', fetchApiKey);

    return () => {
      window.removeEventListener('apiKeyUpdated', fetchApiKey);
    };
  }, []);

  const handleGeneratePlan = async () => {
    if (!goal.trim() || !weakTopics.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your goal and topics to focus on.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setLearningPlan(null);

    try {
      const result = await generateLearningPath({
        goal,
        weakTopics: weakTopics.split(',').map(topic => topic.trim()).filter(Boolean),
        apiKey: apiKey || undefined,
      });
      
      const transformedPlan: LearningPathOutput = {
        modules: result.weeks.map((week: any, index: number) => ({
          title: week.theme || `Week ${index + 1}`,
          description: week.focus || '',
          duration: '1 week',
          resources: (week.topics || []).flatMap((topic: any) => 
            (topic.resources || []).map((resource: any) => ({
              title: resource.title || 'Resource',
              type: resource.type || 'article',
              url: resource.url || '#',
              duration: resource.duration || '15 min',
              description: resource.description
            }))
          ),
          exercises: (week.topics || []).flatMap((topic: any) => 
            topic.exercises || []
          )
        }))
      };
      
      setLearningPlan(transformedPlan);
    } catch (error) {
      console.error('Error generating learning path:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate a learning plan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getIconForStep = (type: string) => {
    switch (type) {
      case 'video':
        return <BookOpen className="h-4 w-4" />;
      case 'article':
        return <BookOpen className="h-4 w-4" />;
      case 'exercise':
      case 'project':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          <span>Overview</span>
        </TabsTrigger>
        <TabsTrigger value="learning-path" className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          <span>Learning Path</span>
        </TabsTrigger>
        <TabsTrigger value="achievements" className="flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          <span>Achievements</span>
        </TabsTrigger>
        <TabsTrigger value="performance" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          <span>Performance</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <RealtimeDashboardStats userId={user?.uid || ''} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">+180.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12</div>
              <p className="text-xs text-muted-foreground">+19% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7 days</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42.5h</div>
              <p className="text-xs text-muted-foreground">+5.2h from last month</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <RealtimeChat userId={user?.uid || ''} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent learning activity</CardDescription>
            </CardHeader>
            <CardContent>
              <RealtimeDashboardStats userId={user?.uid || ''} />
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="achievements" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Achievements</CardTitle>
              <Button variant="outline" size="sm">
                View All Badges
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <AchievementSystem />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Trophy className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Achievement Unlocked</p>
                      <p className="text-sm text-muted-foreground">You've completed your first module!</p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Next Milestone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Complete 5 Modules</h4>
                      <p className="text-sm text-muted-foreground">You're 2/5 of the way there!</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full w-2/5" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-right">40% Complete</p>
                  </div>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">3-Day Streak</h4>
                      <p className="text-sm text-muted-foreground">Learn for 2 more days to unlock!</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full w-1/3" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-right">33% Complete</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="performance" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Performance Analytics</CardTitle>
            <CardDescription>
              Monitor your learning progress and performance metrics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceMonitor />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
