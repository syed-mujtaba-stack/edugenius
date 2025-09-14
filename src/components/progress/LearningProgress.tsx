'use client';

import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, CheckCircle, Clock, Award } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useEffect, useState } from 'react';

export function LearningProgress() {
  const [user] = useAuthState(auth);
  const [progress, setProgress] = useState(0);
  const [completedModules, setCompletedModules] = useState(0);
  const [totalModules, setTotalModules] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // In a real app, this would fetch from your backend
    const fetchProgress = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data - replace with actual API call
      setProgress(65); // 65% overall progress
      setCompletedModules(13);
      setTotalModules(20);
      setStreak(7); // 7-day streak
    };

    if (user) {
      fetchProgress();
    }
  }, [user]);

  const stats = [
    {
      name: 'Overall Progress',
      value: `${progress}%`,
      icon: BookOpen,
    },
    {
      name: 'Modules Completed',
      value: `${completedModules}/${totalModules}`,
      icon: CheckCircle,
    },
    {
      name: 'Current Streak',
      value: `${streak} days`,
      icon: Award,
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Your Learning Journey</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Course Completion</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.name}</p>
                <p className="text-lg font-semibold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
