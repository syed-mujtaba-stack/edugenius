'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings, Save, RotateCcw, Check, X } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreferences {
  enablePushNotifications: boolean;
  enableEmailNotifications: boolean;
  enableInAppNotifications: boolean;
  categories: {
    learningReminders: boolean;
    testResults: boolean;
    communityUpdates: boolean;
    systemAnnouncements: boolean;
    careerAdvice: boolean;
    weeklyProgress: boolean;
  };
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
  frequency: 'immediate' | 'daily' | 'weekly';
}

const defaultPreferences: NotificationPreferences = {
  enablePushNotifications: true,
  enableEmailNotifications: true,
  enableInAppNotifications: true,
  categories: {
    learningReminders: true,
    testResults: true,
    communityUpdates: true,
    systemAnnouncements: true,
    careerAdvice: true,
    weeklyProgress: true,
  },
  quietHours: {
    enabled: false,
    startTime: '22:00',
    endTime: '08:00',
  },
  frequency: 'immediate',
};

export default function NotificationSettingsPage() {
  const [user] = useAuthState(auth);
  const { isPermissionGranted, requestPermission, disableNotifications } = useNotifications();
  const { toast } = useToast();
  
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load user preferences
  useEffect(() => {
    if (!user) return;

    const loadPreferences = async () => {
      try {
        const response = await fetch(`/api/notifications/preferences?userId=${user.uid}`);
        const data = await response.json();
        
        if (data.success) {
          setPreferences(data.preferences);
        }
      } catch (error) {
        console.error('Failed to load notification preferences:', error);
        toast({
          title: "Error",
          description: "Failed to load notification settings",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user, toast]);

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => {
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        if (parent === 'categories') {
          return {
            ...prev,
            categories: {
              ...prev.categories,
              [child]: value as boolean
            }
          };
        } else if (parent === 'quietHours') {
          return {
            ...prev,
            quietHours: {
              ...prev.quietHours,
              [child]: value
            }
          };
        }
        return prev;
      } else {
        // Handle top-level properties
        if (key === 'enablePushNotifications') {
          return { ...prev, enablePushNotifications: value as boolean };
        } else if (key === 'enableEmailNotifications') {
          return { ...prev, enableEmailNotifications: value as boolean };
        } else if (key === 'enableInAppNotifications') {
          return { ...prev, enableInAppNotifications: value as boolean };
        } else if (key === 'frequency') {
          return { ...prev, frequency: value as 'immediate' | 'daily' | 'weekly' };
        }
        return prev;
      }
    });
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          preferences,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setHasChanges(false);
        toast({
          title: "Settings Saved",
          description: "Your notification preferences have been updated",
        });

        // Handle permission changes
        if (preferences.enablePushNotifications && !isPermissionGranted) {
          await requestPermission();
        } else if (!preferences.enablePushNotifications && isPermissionGranted) {
          await disableNotifications();
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setPreferences(defaultPreferences);
    setHasChanges(true);
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast({
        title: "Permissions Granted",
        description: "You will now receive push notifications",
      });
    } else {
      toast({
        title: "Permission Denied",
        description: "Push notifications are disabled",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:gap-6 md:p-8">
        <div className="flex items-center">
          <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl">Notification Settings</h1>
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:gap-6 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl">Notification Settings</h1>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Badge variant="secondary">Unsaved changes</Badge>
          )}
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            disabled={isSaving}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            size="sm"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Push Notification Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Push Notification Status
            </CardTitle>
            <CardDescription>
              Manage your browser notification permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isPermissionGranted ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <p className="font-medium">
                    {isPermissionGranted ? 'Enabled' : 'Disabled'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isPermissionGranted 
                      ? 'You will receive browser push notifications'
                      : 'Click to enable browser notifications'
                    }
                  </p>
                </div>
              </div>
              {!isPermissionGranted && (
                <Button onClick={handleRequestPermission} variant="outline">
                  Enable Notifications
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications in your browser
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={preferences.enablePushNotifications}
                onCheckedChange={(checked) => 
                  handlePreferenceChange('enablePushNotifications', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={preferences.enableEmailNotifications}
                onCheckedChange={(checked) => 
                  handlePreferenceChange('enableEmailNotifications', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="in-app-notifications">In-App Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Show notifications within the app
                </p>
              </div>
              <Switch
                id="in-app-notifications"
                checked={preferences.enableInAppNotifications}
                onCheckedChange={(checked) => 
                  handlePreferenceChange('enableInAppNotifications', checked)
                }
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="frequency">Notification Frequency</Label>
              <Select
                value={preferences.frequency}
                onValueChange={(value) => handlePreferenceChange('frequency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="daily">Daily Digest</SelectItem>
                  <SelectItem value="weekly">Weekly Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Categories</CardTitle>
            <CardDescription>
              Choose which types of notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries({
              learningReminders: 'Learning Reminders',
              testResults: 'Test Results',
              communityUpdates: 'Community Updates',
              systemAnnouncements: 'System Announcements',
              careerAdvice: 'Career Advice',
              weeklyProgress: 'Weekly Progress Reports',
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key}>{label}</Label>
                <Switch
                  id={key}
                  checked={preferences.categories[key as keyof typeof preferences.categories]}
                  onCheckedChange={(checked) => 
                    handlePreferenceChange(`categories.${key}`, checked)
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quiet Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Quiet Hours</CardTitle>
            <CardDescription>
              Set times when you don't want to receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="quiet-hours">Enable Quiet Hours</Label>
              <Switch
                id="quiet-hours"
                checked={preferences.quietHours.enabled}
                onCheckedChange={(checked) => 
                  handlePreferenceChange('quietHours.enabled', checked)
                }
              />
            </div>

            {preferences.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={preferences.quietHours.startTime}
                    onChange={(e) => 
                      handlePreferenceChange('quietHours.startTime', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={preferences.quietHours.endTime}
                    onChange={(e) => 
                      handlePreferenceChange('quietHours.endTime', e.target.value)
                    }
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}