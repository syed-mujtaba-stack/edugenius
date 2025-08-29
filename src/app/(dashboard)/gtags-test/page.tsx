'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  gtagEvent, 
  gtagPageView, 
  gtagEducationalEvent, 
  gtagSetUser, 
  gtagSetCustomDimensions 
} from '@/components/seo/GoogleAnalytics';
import { useTrackEvent, useGoogleAnalytics, useSessionTracking, useScrollTracking } from '@/hooks/useGoogleAnalytics';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  TestTube, 
  FileText, 
  Search, 
  User, 
  Activity,
  Target,
  Settings,
  Eye,
  TrendingUp
} from 'lucide-react';

export default function GTagsTestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [customEvent, setCustomEvent] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [userId, setUserId] = useState('');
  
  const { toast } = useToast();
  const trackEvent = useTrackEvent();
  
  // Automatically track page views, session, and scroll
  useGoogleAnalytics();
  useSessionTracking();
  useScrollTracking();

  const addResult = (message: string) => {
    setTestResults(prev => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev.slice(0, 9)]);
    toast({
      title: 'GTags Event Sent',
      description: message,
    });
  };

  const testBasicGTags = () => {
    gtagEvent('test_basic_event', {
      event_category: 'GTags Test',
      event_label: 'Basic GTags Functionality',
      value: 1
    });
    addResult('Basic GTags event sent successfully');
  };

  const testPageTracking = () => {
    gtagPageView('/gtags-test', {
      page_title: 'GTags Test Page',
      custom_parameters: {
        test_mode: true
      }
    });
    addResult('Page view tracking event sent');
  };

  const testEducationalEvents = () => {
    // Test AI tool tracking
    gtagEducationalEvent.trackAIToolUsage('Test Generator', 'Mathematics', 'Intermediate');
    addResult('AI Tool usage tracked');

    // Test assessment tracking
    gtagEducationalEvent.trackTestGeneration('Science', 'Advanced', 15);
    addResult('Test generation tracked');

    // Test essay evaluation
    gtagEducationalEvent.trackEssayEvaluation(500, 85, 'English');
    addResult('Essay evaluation tracked');

    // Test study plan
    gtagEducationalEvent.trackStudyPlanCreation(['Math', 'Science'], '2 weeks', 'Grade 10');
    addResult('Study plan creation tracked');
  };

  const testSearchTracking = () => {
    gtagEducationalEvent.trackSearch('quadratic equations', 'academic', 25);
    addResult('Search activity tracked');
  };

  const testCareerCounseling = () => {
    gtagEducationalEvent.trackCareerCounseling(
      ['Technology', 'Science', 'Mathematics'],
      ['Software Engineer', 'Data Scientist', 'AI Researcher']
    );
    addResult('Career counseling session tracked');
  };

  const testEngagementTracking = () => {
    gtagEducationalEvent.trackEngagement('feature_interaction', 120, 'study_tools');
    addResult('User engagement tracked');
  };

  const testAdminTracking = () => {
    gtagEducationalEvent.trackAdminAction('user_management', 'bulk_update', 'Updated 5 user accounts');
    addResult('Admin action tracked');
  };

  const testErrorTracking = () => {
    gtagEducationalEvent.trackError('network_error', 'Failed to load study materials', '/dashboard/study');
    addResult('Error event tracked');
  };

  const testUserIdentification = () => {
    if (userId) {
      gtagSetUser(userId, {
        user_grade: 'Grade 10',
        user_type: 'student',
        subscription: 'premium'
      });
      addResult(`User identification set for: ${userId}`);
    } else {
      toast({
        title: 'User ID Required',
        description: 'Please enter a user ID to test user identification',
        variant: 'destructive'
      });
    }
  };

  const testCustomDimensions = () => {
    gtagSetCustomDimensions({
      'custom_dimension_1': 'mathematics_focus',
      'custom_dimension_2': 'intermediate_level',
      'custom_dimension_3': 'grade_10'
    });
    addResult('Custom dimensions set');
  };

  const testCustomEvent = () => {
    if (customEvent && customCategory) {
      gtagEvent(customEvent, {
        event_category: customCategory,
        event_label: 'Custom Test Event',
        custom_parameters: {
          test_timestamp: new Date().toISOString(),
          test_source: 'gtags_test_page'
        }
      });
      addResult(`Custom event sent: ${customEvent} in category ${customCategory}`);
    } else {
      toast({
        title: 'Event Details Required',
        description: 'Please enter both event name and category',
        variant: 'destructive'
      });
    }
  };

  const testHookBasedTracking = () => {
    trackEvent.trackFeatureUsed('GTags Test Page', 'Testing Tools');
    trackEvent.trackTestGenerated('Chemistry', 'Beginner');
    trackEvent.trackEssayEvaluated(300, 92);
    addResult('Hook-based tracking methods executed');
  };

  const checkGTagsStatus = () => {
    if (typeof window !== 'undefined') {
      const hasGTags = typeof window.gtag === 'function';
      const hasDataLayer = Array.isArray(window.dataLayer);
      const trackingId = process.env.NEXT_PUBLIC_GA_TRACKING_ID || 'G-KQZSD36CPE';
      
      addResult(`GTags Status: ${hasGTags ? 'Loaded' : 'Not Loaded'}`);
      addResult(`DataLayer: ${hasDataLayer ? 'Available' : 'Not Available'}`);
      addResult(`Tracking ID: ${trackingId}`);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="font-headline text-3xl md:text-4xl">GTags Test Suite</h1>
          <p className="text-muted-foreground">Test Google Analytics GTags implementation and tracking functions</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* GTags Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              GTags Status
            </CardTitle>
            <CardDescription>Check GTags configuration and availability</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={checkGTagsStatus} className="w-full">
              Check GTags Status
            </Button>
          </CardContent>
        </Card>

        {/* Basic Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Basic Events
            </CardTitle>
            <CardDescription>Test basic GTags event tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={testBasicGTags} variant="outline" className="w-full">
              Basic Event
            </Button>
            <Button onClick={testPageTracking} variant="outline" className="w-full">
              Page Tracking
            </Button>
          </CardContent>
        </Card>

        {/* Educational Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Educational Events
            </CardTitle>
            <CardDescription>Test education-specific tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={testEducationalEvents} className="w-full">
              Test All Educational Events
            </Button>
          </CardContent>
        </Card>

        {/* Search & Discovery */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Discovery
            </CardTitle>
            <CardDescription>Test search and content discovery tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={testSearchTracking} variant="outline" className="w-full">
              Search Tracking
            </Button>
            <Button onClick={testCareerCounseling} variant="outline" className="w-full">
              Career Counseling
            </Button>
          </CardContent>
        </Card>

        {/* User Interactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              User Interactions
            </CardTitle>
            <CardDescription>Test user engagement and interaction tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={testEngagementTracking} variant="outline" className="w-full">
              Engagement
            </Button>
            <Button onClick={testAdminTracking} variant="outline" className="w-full">
              Admin Actions
            </Button>
            <Button onClick={testErrorTracking} variant="outline" className="w-full">
              Error Tracking
            </Button>
          </CardContent>
        </Card>

        {/* Advanced Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Advanced Features
            </CardTitle>
            <CardDescription>Test advanced GTags features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={testCustomDimensions} variant="outline" className="w-full">
              Custom Dimensions
            </Button>
            <Button onClick={testHookBasedTracking} variant="outline" className="w-full">
              Hook-based Tracking
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Custom Event Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Custom Event Testing
          </CardTitle>
          <CardDescription>Test custom events and user identification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="custom-event">Custom Event Name</Label>
              <Input
                id="custom-event"
                placeholder="e.g., custom_interaction"
                value={customEvent}
                onChange={(e) => setCustomEvent(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="custom-category">Event Category</Label>
              <Input
                id="custom-category"
                placeholder="e.g., Custom Tests"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-id">User ID (for user identification)</Label>
            <Input
              id="user-id"
              placeholder="e.g., user_12345"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={testCustomEvent} className="flex-1">
              Send Custom Event
            </Button>
            <Button onClick={testUserIdentification} variant="outline" className="flex-1">
              Set User ID
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Test Results Log
          </CardTitle>
          <CardDescription>Real-time log of GTags events sent (last 10 events)</CardDescription>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No events sent yet. Click any test button to start tracking.
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
                  <Badge variant="secondary">{index + 1}</Badge>
                  <span className="flex-1">{result}</span>
                </div>
              ))}
            </div>
          )}
          {testResults.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => setTestResults([])} 
              className="w-full mt-4"
            >
              Clear Log
            </Button>
          )}
        </CardContent>
      </Card>

      {/* GTags Configuration Info */}
      <Card>
        <CardHeader>
          <CardTitle>GTags Configuration</CardTitle>
          <CardDescription>Current GTags implementation details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Tracking ID:</span>
              <Badge variant="outline">{process.env.NEXT_PUBLIC_GA_TRACKING_ID || 'G-KQZSD36CPE'}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Implementation:</span>
              <Badge variant="secondary">GTags (gtag.js)</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Features:</span>
              <div className="flex gap-1">
                <Badge variant="outline" className="text-xs">Page Views</Badge>
                <Badge variant="outline" className="text-xs">Events</Badge>
                <Badge variant="outline" className="text-xs">Educational</Badge>
                <Badge variant="outline" className="text-xs">Enhanced</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}