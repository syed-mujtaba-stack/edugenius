'use client';

import { ProgressTracker } from '@/components/gamification/ProgressTracker';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProgressPage() {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={
        <div className="space-y-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      }>
        <ProgressTracker />
      </Suspense>
    </div>
  );
}
