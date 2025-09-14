'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Trophy, Award, Star, Zap, BookOpen, CheckCircle } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  unlocked: boolean;
  progress: number;
  target: number;
  category: 'learning' | 'engagement' | 'mastery' | 'streak';
};

type UserStats = {
  totalXp: number;
  level: number;
  streak: number;
  completedLessons: number;
  completedQuizzes: number;
  createdContent: number;
};

export function AchievementSystem() {
  const [user] = useAuthState(auth);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalXp: 0,
    level: 1,
    streak: 0,
    completedLessons: 0,
    completedQuizzes: 0,
    createdContent: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from your backend
    const fetchUserStats = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data - replace with actual API call
        const stats: UserStats = {
          totalXp: 1250,
          level: 5,
          streak: 7,
          completedLessons: 12,
          completedQuizzes: 8,
          createdContent: 3
        };
        
        setUserStats(stats);
        updateAchievements(stats);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStats();
  }, [user]);

  const updateAchievements = (stats: UserStats) => {
    const allAchievements: Achievement[] = [
      {
        id: 'fast-learner',
        title: 'Fast Learner',
        description: 'Complete 5 lessons',
        icon: <Zap className="w-4 h-4" />,
        points: 100,
        unlocked: stats.completedLessons >= 5,
        progress: Math.min(stats.completedLessons, 5),
        target: 5,
        category: 'learning'
      },
      {
        id: 'quiz-master',
        title: 'Quiz Master',
        description: 'Complete 10 quizzes',
        icon: <Award className="w-4 h-4" />,
        points: 200,
        unlocked: stats.completedQuizzes >= 10,
        progress: Math.min(stats.completedQuizzes, 10),
        target: 10,
        category: 'mastery'
      },
      {
        id: 'streak-starter',
        title: 'Streak Starter',
        description: 'Maintain a 7-day streak',
        icon: <Trophy className="w-4 h-4" />,
        points: 150,
        unlocked: stats.streak >= 7,
        progress: Math.min(stats.streak, 7),
        target: 7,
        category: 'streak'
      },
      {
        id: 'content-creator',
        title: 'Content Creator',
        description: 'Create 5 pieces of content',
        icon: <BookOpen className="w-4 h-4" />,
        points: 250,
        unlocked: stats.createdContent >= 5,
        progress: Math.min(stats.createdContent, 5),
        target: 5,
        category: 'engagement'
      },
      {
        id: 'early-bird',
        title: 'Early Bird',
        description: 'Log in 5 days in a row',
        icon: <Star className="w-4 h-4" />,
        points: 100,
        unlocked: stats.streak >= 5,
        progress: Math.min(stats.streak, 5),
        target: 5,
        category: 'streak'
      }
    ];

    setAchievements(allAchievements);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'learning':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'mastery':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'engagement':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'streak':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* User Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-sm font-medium">Level</CardDescription>
            <CardTitle className="text-3xl font-bold">{userStats.level}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {userStats.totalXp} XP • {userStats.level * 1000 - userStats.totalXp} XP to next level
            </div>
            <Progress value={(userStats.totalXp % 1000) / 10} className="h-2 mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-sm font-medium">Current Streak</CardDescription>
            <CardTitle className="text-3xl font-bold flex items-center">
              <FlameIcon className="w-6 h-6 text-orange-500 mr-2" />
              {userStats.streak} days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Keep it up!
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-sm font-medium">Lessons</CardDescription>
            <CardTitle className="text-3xl font-bold">{userStats.completedLessons}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Completed
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-sm font-medium">Achievements</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {unlockedAchievements.length} / {achievements.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Unlocked
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Your Achievements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlockedAchievements.map((achievement) => (
              <Card key={achievement.id} className="border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/20">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400">
                        {achievement.icon}
                      </div>
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      +{achievement.points} XP
                    </Badge>
                  </div>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span>Unlocked!</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Available Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedAchievements.map((achievement) => (
              <Card key={achievement.id} className="opacity-70">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-full bg-muted">
                        {achievement.icon}
                      </div>
                      <CardTitle className="text-lg">???</CardTitle>
                    </div>
                    <Badge variant="outline" className={getCategoryColor(achievement.category)}>
                      {achievement.points} XP
                    </Badge>
                  </div>
                  <CardDescription>Complete challenges to unlock</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground mb-2">
                    Progress: {achievement.progress} / {achievement.target}
                  </div>
                  <Progress value={(achievement.progress / achievement.target) * 100} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FlameIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}
