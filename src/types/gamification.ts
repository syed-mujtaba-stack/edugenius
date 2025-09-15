export type BadgeType = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Badge {
  id: string;
  name: string;
  description: string;
  image: string;
  type: BadgeType;
  points: number;
  criteria: {
    type: 'course_completion' | 'points_earned' | 'streak' | 'custom';
    target: number;
    courseId?: string; // For course-specific badges
  };
}

export interface UserPoints {
  total: number;
  weekly: number;
  monthly: number;
  lastUpdated: string;
}

export interface UserAchievement {
  badgeId: string;
  earnedAt: string;
  progress: number;
  completed: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  badges: number;
}

export interface UserProgress {
  userId: string;
  completedCourses: string[];
  completedLessons: string[];
  currentStreak: number;
  longestStreak: number;
  lastActive: string;
  achievements: UserAchievement[];
  points: UserPoints;
  leaderboardPosition: number;
}
