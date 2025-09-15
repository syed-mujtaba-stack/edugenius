'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProgress, UserPoints, UserAchievement, Badge, LeaderboardEntry } from '@/types/gamification';

interface GamificationContextType {
  userProgress: UserProgress | null;
  leaderboard: LeaderboardEntry[];
  availableBadges: Badge[];
  isLoading: boolean;
  error: string | null;
  addPoints: (points: number, reason: string) => void;
  completeCourse: (courseId: string) => void;
  completeLesson: (lessonId: string) => void;
  getAchievementProgress: (badgeId: string) => UserAchievement | undefined;
  getUserRank: () => number;
  getTopUsers: (limit?: number) => LeaderboardEntry[];
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

// Mock data - Replace with actual API calls in production
const MOCK_BADGES: Badge[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first lesson',
    image: '/badges/first-steps.svg',
    type: 'bronze',
    points: 10,
    criteria: { type: 'course_completion', target: 1 }
  },
  {
    id: 'fast_learner',
    name: 'Fast Learner',
    description: 'Complete 5 lessons in a day',
    image: '/badges/fast-learner.svg',
    type: 'silver',
    points: 50,
    criteria: { type: 'streak', target: 5 }
  },
  {
    id: 'course_master',
    name: 'Course Master',
    description: 'Complete your first course',
    image: '/badges/course-master.svg',
    type: 'gold',
    points: 100,
    criteria: { type: 'course_completion', target: 1 }
  },
];

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize user progress (in a real app, this would be fetched from an API)
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const initialProgress: UserProgress = {
          userId: 'user-123', // Replace with actual user ID
          completedCourses: [],
          completedLessons: [],
          currentStreak: 0,
          longestStreak: 0,
          lastActive: new Date().toISOString(),
          achievements: [],
          points: { total: 0, weekly: 0, monthly: 0, lastUpdated: new Date().toISOString() },
          leaderboardPosition: 0
        };
        
        setUserProgress(initialProgress);
        // Load mock leaderboard data
        setLeaderboard(generateMockLeaderboard());
      } catch (err) {
        setError('Failed to load gamification data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Generate mock leaderboard data
  const generateMockLeaderboard = (): LeaderboardEntry[] => {
    const names = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey', 'Riley', 'Quinn', 'Avery'];
    return Array.from({ length: 20 }, (_, i) => ({
      userId: `user-${i + 1}`,
      name: i === 0 ? 'You' : names[Math.floor(Math.random() * names.length)],
      avatar: `/avatars/avatar-${Math.floor(Math.random() * 10) + 1}.png`,
      points: 1000 - (i * 50) + Math.floor(Math.random() * 100),
      rank: i + 1,
      badges: Math.floor(Math.random() * 10)
    }));
  };

  // Add points to user's total
  const addPoints = (points: number, reason: string) => {
    if (!userProgress) return;
    
    const now = new Date();
    const lastUpdated = new Date(userProgress.points.lastUpdated);
    const isNewDay = now.getDate() !== lastUpdated.getDate();
    const isNewWeek = isNewDay && (now.getDay() < lastUpdated.getDay() || now.getTime() - lastUpdated.getTime() > 7 * 24 * 60 * 60 * 1000);
    const isNewMonth = isNewDay && now.getMonth() !== lastUpdated.getMonth();

    setUserProgress(prev => {
      if (!prev) return null;
      
      const updated: UserProgress = {
        ...prev,
        points: {
          total: prev.points.total + points,
          weekly: isNewWeek ? points : prev.points.weekly + points,
          monthly: isNewMonth ? points : prev.points.monthly + points,
          lastUpdated: now.toISOString()
        }
      };

      // Check for point-based achievements
      checkAchievements(updated);
      
      return updated;
    });
  };

  // Mark a course as completed
  const completeCourse = (courseId: string) => {
    if (!userProgress || userProgress.completedCourses.includes(courseId)) return;

    setUserProgress(prev => {
      if (!prev) return null;
      
      const updated: UserProgress = {
        ...prev,
        completedCourses: [...prev.completedCourses, courseId]
      };

      // Award points for course completion
      addPoints(100, 'Course completed');
      
      // Check for course completion achievements
      checkAchievements(updated);
      
      return updated;
    });
  };

  // Mark a lesson as completed
  const completeLesson = (lessonId: string) => {
    if (!userProgress || userProgress.completedLessons.includes(lessonId)) return;

    setUserProgress(prev => {
      if (!prev) return null;
      
      const updated: UserProgress = {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId]
      };

      // Award points for lesson completion
      addPoints(10, 'Lesson completed');
      
      // Check for lesson completion achievements
      checkAchievements(updated);
      
      return updated;
    });
  };

  // Check and update achievements
  const checkAchievements = (progress: UserProgress) => {
    const newAchievements: UserAchievement[] = [...progress.achievements];
    const now = new Date().toISOString();
    let pointsAwarded = false;

    MOCK_BADGES.forEach(badge => {
      // Skip if already earned
      if (newAchievements.some(a => a.badgeId === badge.id && a.completed)) return;

      let progress = 0;
      let completed = false;

      switch (badge.criteria.type) {
        case 'course_completion': {
          const completedCourses = userProgress?.completedCourses?.length || 0;
          progress = Math.min(completedCourses / badge.criteria.target, 1);
          completed = completedCourses >= badge.criteria.target;
          break;
        }
        case 'points_earned': {
          const totalPoints = userProgress?.points?.total || 0;
          progress = Math.min(totalPoints / badge.criteria.target, 1);
          completed = totalPoints >= badge.criteria.target;
          break;
        }
        case 'streak': {
          const currentStreak = userProgress?.currentStreak || 0;
          progress = Math.min(currentStreak / badge.criteria.target, 1);
          completed = currentStreak >= badge.criteria.target;
          break;
        }
      }

      if (completed) {
        newAchievements.push({
          badgeId: badge.id,
          earnedAt: now,
          progress: 1,
          completed: true
        });
        
        // Award points for the badge
        addPoints(badge.points, `Badge earned: ${badge.name}`);
        pointsAwarded = true;
      }
    });

    if (newAchievements.length > progress.achievements.length) {
      setUserProgress({
        ...progress,
        achievements: newAchievements
      });
    }
  };

  // Get achievement progress
  const getAchievementProgress = (badgeId: string) => {
    return userProgress?.achievements.find(a => a.badgeId === badgeId);
  };

  // Get user's rank
  const getUserRank = () => {
    return userProgress?.leaderboardPosition || 0;
  };

  // Get top users
  const getTopUsers = (limit: number = 10) => {
    return [...leaderboard].sort((a, b) => a.rank - b.rank).slice(0, limit);
  };

  return (
    <GamificationContext.Provider
      value={{
        userProgress,
        leaderboard,
        availableBadges: MOCK_BADGES,
        isLoading,
        error,
        addPoints,
        completeCourse,
        completeLesson,
        getAchievementProgress,
        getUserRank,
        getTopUsers,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = (): GamificationContextType => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};
