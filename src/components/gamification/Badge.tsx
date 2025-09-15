import { Badge as BadgeType } from '@/types/gamification';
import { cn } from '@/lib/utils';

interface BadgeProps {
  badge: BadgeType;
  earned?: boolean;
  showDescription?: boolean;
  className?: string;
}

export function Badge({ badge, earned = true, showDescription = true, className }: BadgeProps) {
  const getBadgeColor = () => {
    switch (badge.type) {
      case 'bronze':
        return 'bg-amber-600/20 border-amber-600/50 text-amber-500';
      case 'silver':
        return 'bg-gray-300/20 border-gray-300/50 text-gray-300';
      case 'gold':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'platinum':
        return 'bg-cyan-400/20 border-cyan-400/50 text-cyan-400';
      default:
        return 'bg-primary/20 border-primary/50 text-primary';
    }
  };

  return (
    <div className={cn("flex flex-col items-center p-4 rounded-lg border", getBadgeColor(), !earned && 'opacity-40', className)}>
      <div className="relative w-16 h-16 mb-2">
        <div className={cn("absolute inset-0 rounded-full flex items-center justify-center", getBadgeColor())}>
          <span className="text-2xl">🏆</span>
        </div>
      </div>
      <h4 className="font-medium text-center">{badge.name}</h4>
      {showDescription && (
        <p className="text-xs text-center mt-1 text-muted-foreground">
          {badge.description}
        </p>
      )}
      <div className="mt-2 text-xs font-mono px-2 py-0.5 bg-black/20 rounded">
        {badge.points} pts
      </div>
    </div>
  );
}

export function BadgeSkeleton() {
  return (
    <div className="animate-pulse flex flex-col items-center p-4 rounded-lg border border-border">
      <div className="w-16 h-16 rounded-full bg-muted mb-2"></div>
      <div className="h-4 w-20 bg-muted rounded mb-1"></div>
      <div className="h-3 w-24 bg-muted rounded"></div>
    </div>
  );
}
