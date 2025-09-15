'use client';

import { Trophy, Award, Star, CheckCircle } from 'lucide-react';
import { Badge } from './Badge';
import { Leaderboard } from './Leaderboard';
import { useGamification } from '@/contexts/GamificationContext';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';

interface ProgressTrackerProps {
  className?: string;
}

export function ProgressTracker({ className }: ProgressTrackerProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    userProgress,
    availableBadges = [],
    leaderboard = [],
    isLoading,
    getAchievementProgress = () => ({} as any),
  } = useGamification?.() || {};

  const earnedBadges = availableBadges.filter(badge => {
    const progress = getAchievementProgress(badge.id);
    return progress?.completed;
  });

  const inProgressBadges = availableBadges.filter(badge => {
    const progress = getAchievementProgress(badge.id);
    return progress && !progress.completed;
  });

  if (!isClient || isLoading || !userProgress) {
    return <ProgressTrackerSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Points Summary */}
      <div className="bg-card rounded-xl p-6 shadow-sm border">
        <h2 className="text-2xl font-bold mb-6">Your Learning Journey</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Total Points</div>
            <div className="text-3xl font-bold">{userProgress.points.total}</div>
            <div className="text-xs text-muted-foreground mt-1">Earned all time</div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Weekly Points</div>
            <div className="text-3xl font-bold">{userProgress.points.weekly}</div>
            <div className="text-xs text-muted-foreground mt-1">This week</div>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="text-sm text-muted-foreground">Current Streak</div>
            <div className="text-3xl font-bold">{userProgress.currentStreak} days</div>
            <div className="text-xs text-muted-foreground mt-1">
              Longest: {userProgress.longestStreak} days
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Learning Progress</span>
            <span>{Math.round((userProgress.completedLessons.length / 50) * 100)}%</span>
          </div>
          <Progress value={(userProgress.completedLessons.length / 50) * 100} className="h-2" />
        </div>
      </div>

      {/* Badges */}
      <div className="bg-card rounded-xl p-6 shadow-sm border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Badges</h2>
          <div className="text-sm text-muted-foreground">
            {earnedBadges.length} of {availableBadges.length} earned
          </div>
        </div>
        
        {earnedBadges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {earnedBadges.map((badge) => (
              <Badge key={badge.id} badge={badge} earned={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No badges earned yet. Keep learning to earn your first badge!</p>
          </div>
        )}

        {inProgressBadges.length > 0 && (
          <>
            <h3 className="text-lg font-medium mb-4">Keep going to earn:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {inProgressBadges.slice(0, 6).map((badge) => {
                const progress = getAchievementProgress(badge.id);
                return (
                  <div key={badge.id} className="relative">
                    <Badge badge={badge} earned={false} />
                    {progress && (
                      <div className="absolute -bottom-2 left-0 right-0 px-2">
                        <Progress 
                          value={progress.progress * 100} 
                          className="h-1.5 bg-background"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Leaderboard */}
      <div className="bg-card rounded-xl p-6 shadow-sm border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Leaderboard</h2>
          <div className="text-sm text-muted-foreground">
            Your rank: #{userProgress.leaderboardPosition || '--'}
          </div>
        </div>
        
        <Leaderboard 
          entries={leaderboard} 
          currentUserId={userProgress.userId}
          limit={10}
        />
      </div>
    </div>
  );
}

function ProgressTrackerSkeleton() {
  return (
    <div className="space-y-8">
      <div className="bg-card rounded-xl p-6 shadow-sm border">
        <Skeleton className="h-8 w-48 mb-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-muted/50 p-4 rounded-lg">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
      </div>
      
      <div className="bg-card rounded-xl p-6 shadow-sm border">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col items-center p-4 rounded-lg border">
              <Skeleton className="w-16 h-16 rounded-full mb-2" />
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-card rounded-xl p-6 shadow-sm border">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center p-3 rounded-lg">
              <Skeleton className="w-8 h-8 rounded-full mr-3" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="w-6 h-6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
