import { LeaderboardEntry } from '@/types/gamification';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Award, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  className?: string;
  limit?: number;
}

export function Leaderboard({ entries, currentUserId, className, limit = 10 }: LeaderboardProps) {
  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return <Trophy className="w-5 h-5 text-yellow-500" />;
    } else if (rank === 2) {
      return <Award className="w-5 h-5 text-gray-400" />;
    } else if (rank === 3) {
      return <Award className="w-5 h-5 text-amber-600" />;
    }
    return <span className="w-5 h-5 flex items-center justify-center">{rank}</span>;
  };

  const sortedEntries = [...entries]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, limit);

  if (sortedEntries.length === 0) {
    return (
      <div className={cn("text-center p-8 text-muted-foreground", className)}>
        <p>No leaderboard data available yet.</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {sortedEntries.map((entry) => (
        <div
          key={entry.userId}
          className={cn(
            "flex items-center p-3 rounded-lg transition-colors",
            entry.userId === currentUserId
              ? "bg-primary/10 border border-primary/20"
              : "hover:bg-accent/50"
          )}
        >
          <div className="flex items-center w-8">
            {getRankBadge(entry.rank)}
          </div>
          <div className="flex items-center flex-1 min-w-0">
            <Avatar className="h-8 w-8 mr-3">
              <AvatarImage src={entry.avatar} alt={entry.name} />
              <AvatarFallback>
                {entry.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium truncate">
                {entry.name}
                {entry.userId === currentUserId && (
                  <span className="ml-2 text-xs text-primary">(You)</span>
                )}
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{entry.points} pts</span>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <Star className="w-3 h-3 mr-1 text-yellow-500 fill-yellow-500" />
                  {entry.badges}
                </div>
              </div>
            </div>
          </div>
          <div className="text-sm font-mono font-medium">
            #{entry.rank}
          </div>
        </div>
      ))}
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center p-3 rounded-lg">
          <div className="w-8 h-8 bg-muted rounded-full mr-3 animate-pulse"></div>
          <div className="flex-1">
            <div className="h-4 w-24 bg-muted rounded animate-pulse mb-1"></div>
            <div className="h-3 w-16 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="w-6 h-6 bg-muted rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}
