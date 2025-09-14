'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { SupabaseSetupIndicator } from '@/components/supabase-setup-indicator';
import { RealtimeDashboardStats } from '@/components/realtime-dashboard-stats';
import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-3 sm:gap-4 md:gap-6">
        <div className="flex items-center">
          <h1 className="font-headline text-xl sm:text-2xl md:text-3xl lg:text-4xl">Dashboard</h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex flex-1 flex-col gap-3 sm:gap-4 md:gap-6">
        <div className="flex items-center">
          <h1 className="font-headline text-xl sm:text-2xl md:text-3xl lg:text-4xl">Dashboard</h1>
        </div>
        <div className="text-center py-8">
          <p>Please log in to view your dashboard.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user.displayName || 'Learner'}!</h1>
        <SupabaseSetupIndicator />
      </div>
      
      <div className="space-y-6">
        <Card className="p-6">
          <RealtimeDashboardStats userId={user.uid} />
        </Card>
        
        <DashboardTabs />
      </div>
    </main>
  );
}
