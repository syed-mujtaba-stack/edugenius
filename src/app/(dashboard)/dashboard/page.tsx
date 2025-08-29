'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardClient } from '@/components/dashboard-client';
import { RealtimeDashboardStats } from '@/components/realtime-dashboard-stats';
import { RealtimeChat } from '@/components/realtime-chat';
import { SupabaseSetupIndicator } from '@/components/supabase-setup-indicator';
import { PerformanceMonitor } from '@/components/performance-monitor';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

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
    <main className="flex flex-1 flex-col gap-3 sm:gap-4 md:gap-6">
      {/* Page Header */}
      <div className="flex items-center">
        <h1 className="font-headline text-xl sm:text-2xl md:text-3xl lg:text-4xl">Dashboard</h1>
      </div>

      {/* Supabase Setup Indicator */}
      <SupabaseSetupIndicator />

      {/* Realtime Dashboard Stats */}
      <RealtimeDashboardStats userId={user.uid} />

      {/* Charts / DashboardClient, Performance Monitor, and Realtime Chat */}
      <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 w-full">
        <div className="lg:col-span-2">
          <DashboardClient />
        </div>
        <div className="lg:col-span-1">
          <PerformanceMonitor showActions={true} />
        </div>
        <div className="lg:col-span-1">
          <RealtimeChat userId={user.uid} />
        </div>
      </div>
    </main>
  );
}
