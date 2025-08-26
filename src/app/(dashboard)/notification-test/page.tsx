'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bell, Send, TestTube, Check, X, AlertCircle } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  test: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  timestamp: number;
}

export default function NotificationTestPage() {
  const [user] = useAuthState(auth);
  const { 
    isPermissionGranted, 
    requestPermission, 
    sendNotification,
    notifications,
    unreadCount,
    fcmToken 
  } = useNotifications();
  const { toast } = useToast();
  
  const [testForm, setTestForm] = useState({
    title: 'Test Notification',
    body: 'This is a test notification from EduGenius',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    actionUrl: '/dashboard'
  });
  
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const addTestResult = (test: string, status: TestResult['status'], message: string) => {
    setTestResults(prev => [...prev, {
      test,
      status,
      message,
      timestamp: Date.now()
    }]);
  };

  const runDiagnostics = async () => {
    setIsTestRunning(true);
    setTestResults([]);

    // Test 1: Check browser notification support
    if ('Notification' in window) {
      addTestResult('Browser Support', 'success', 'Browser supports notifications');
    } else {
      addTestResult('Browser Support', 'error', 'Browser does not support notifications');
    }

    // Test 2: Check permission status
    const permission = Notification.permission;
    if (permission === 'granted') {
      addTestResult('Permission Status', 'success', 'Notification permission granted');
    } else if (permission === 'denied') {
      addTestResult('Permission Status', 'error', 'Notification permission denied');
    } else {
      addTestResult('Permission Status', 'pending', 'Notification permission not requested');
    }

    // Test 3: Check Firebase environment variables
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
    };

    const hasValidConfig = Object.values(firebaseConfig).every(value => 
      value && value !== 'your-firebase-api-key' && value !== 'your-project-id' && value !== 'your-vapid-key'
    );

    if (hasValidConfig) {
      addTestResult('Firebase Config', 'success', 'Firebase environment variables are configured');
    } else {
      addTestResult('Firebase Config', 'error', 'Firebase environment variables are missing or contain placeholder values. Check your .env.local file.');
    }

    // Test 4: Check FCM token
    if (fcmToken) {
      addTestResult('FCM Token', 'success', `Token available: ${fcmToken.substring(0, 20)}...`);
    } else {
      addTestResult('FCM Token', 'error', 'No FCM token available - Firebase may not be properly configured');
    }

    // Test 5: Check user authentication
    if (user) {
      addTestResult('User Authentication', 'success', `Authenticated as: ${user.email}`);
    } else {
      addTestResult('User Authentication', 'error', 'User not authenticated');
    }

    // Test 6: Test service worker registration
    if ('serviceWorker' in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        const fcmSW = registrations.find(reg => 
          reg.scope.includes('firebase-messaging-sw.js') || reg.active?.scriptURL.includes('firebase-messaging-sw.js')
        );
        if (fcmSW) {
          addTestResult('Service Worker', 'success', 'Firebase messaging service worker registered');
        } else {
          addTestResult('Service Worker', 'error', 'Firebase messaging service worker not found. Check firebase-messaging-sw.js configuration.');
        }
      } catch (error) {
        addTestResult('Service Worker', 'error', `Service worker check failed: ${error}`);
      }
    } else {
      addTestResult('Service Worker', 'error', 'Service worker not supported');
    }

    // Test 7: Check service worker script accessibility
    try {
      const response = await fetch('/firebase-messaging-sw.js');
      if (response.ok) {
        addTestResult('Service Worker Script', 'success', 'firebase-messaging-sw.js is accessible');
      } else {
        addTestResult('Service Worker Script', 'error', `firebase-messaging-sw.js returned ${response.status}`);
      }
    } catch (error) {
      addTestResult('Service Worker Script', 'error', `Cannot access firebase-messaging-sw.js: ${error}`);
    }

    setIsTestRunning(false);
  };

  const testInAppNotification = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "User must be authenticated to test notifications",
        variant: "destructive"
      });
      return;
    }

    try {
      await sendNotification({
        title: testForm.title,
        body: testForm.body,
        type: testForm.type,
        actionUrl: testForm.actionUrl
      });

      toast({
        title: "Success",
        description: "In-app notification sent successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send in-app notification",
        variant: "destructive"
      });
    }
  };

  const testPushNotification = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "User must be authenticated to test notifications",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          title: testForm.title,
          body: testForm.body,
          type: testForm.type,
          actionUrl: testForm.actionUrl,
          sendPush: true
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Push notification sent successfully"
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send push notification",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:gap-6 md:p-8">
      <div className="flex items-center gap-3">
        <TestTube className="h-8 w-8 text-primary" />
        <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl">Notification Testing</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              System Status
            </CardTitle>
            <CardDescription>
              Current notification system status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Permission Status</span>
              <Badge variant={isPermissionGranted ? 'default' : 'destructive'}>
                {isPermissionGranted ? 'Granted' : 'Not Granted'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Unread Notifications</span>
              <Badge variant="secondary">{unreadCount}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Total Notifications</span>
              <Badge variant="secondary">{notifications.length}</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span>FCM Token</span>
              <Badge variant={fcmToken ? 'default' : 'destructive'}>
                {fcmToken ? 'Available' : 'Missing'}
              </Badge>
            </div>

            {!isPermissionGranted && (
              <Button onClick={requestPermission} className="w-full">
                Request Notification Permission
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Test Form */}
        <Card>
          <CardHeader>
            <CardTitle>Test Notification</CardTitle>
            <CardDescription>
              Send test notifications to validate functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={testForm.title}
                onChange={(e) => setTestForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter notification title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Message</Label>
              <Textarea
                id="body"
                value={testForm.body}
                onChange={(e) => setTestForm(prev => ({ ...prev, body: e.target.value }))}
                placeholder="Enter notification message"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={testForm.type}
                onValueChange={(value) => setTestForm(prev => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="actionUrl">Action URL (optional)</Label>
              <Input
                id="actionUrl"
                value={testForm.actionUrl}
                onChange={(e) => setTestForm(prev => ({ ...prev, actionUrl: e.target.value }))}
                placeholder="/dashboard"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button onClick={testInAppNotification} variant="outline">
                Test In-App
              </Button>
              <Button onClick={testPushNotification}>
                <Send className="h-4 w-4 mr-2" />
                Test Push
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Help */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Firebase Configuration Required
            </CardTitle>
            <CardDescription>
              Firebase Cloud Messaging setup is required for notifications to work
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Setup Instructions:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-orange-700 dark:text-orange-300">
                <li>Create a Firebase project and enable Cloud Messaging</li>
                <li>Generate a VAPID key in Firebase Console</li>
                <li>Update your <code className="bg-orange-100 dark:bg-orange-800 px-1 rounded">.env.local</code> file with Firebase configuration</li>
                <li>Update <code className="bg-orange-100 dark:bg-orange-800 px-1 rounded">public/firebase-messaging-sw.js</code> with your Firebase config</li>
                <li>Restart your development server</li>
              </ol>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Need Help?</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Check the <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">FIREBASE_SETUP.md</code> file 
                in the project root for detailed setup instructions.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <h5 className="font-medium text-sm mb-1">Environment Status</h5>
                <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                              process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'your-firebase-api-key' ? 
                              'default' : 'destructive'}>
                  {process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                   process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'your-firebase-api-key' ? 
                   'Configured' : 'Not Configured'}
                </Badge>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <h5 className="font-medium text-sm mb-1">VAPID Key</h5>
                <Badge variant={process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY && 
                              process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY !== 'your-vapid-key' ? 
                              'default' : 'destructive'}>
                  {process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY && 
                   process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY !== 'your-vapid-key' ? 
                   'Set' : 'Missing'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diagnostics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>System Diagnostics</CardTitle>
            <CardDescription>
              Run comprehensive tests to check notification system health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={runDiagnostics} 
                disabled={isTestRunning}
                className="w-full"
              >
                {isTestRunning ? 'Running Diagnostics...' : 'Run Diagnostics'}
              </Button>

              {testResults.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Test Results:</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {testResults.map((result, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-lg border"
                      >
                        {getStatusIcon(result.status)}
                        <div className="flex-1">
                          <div className="font-medium">{result.test}</div>
                          <div className="text-sm text-muted-foreground">
                            {result.message}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}