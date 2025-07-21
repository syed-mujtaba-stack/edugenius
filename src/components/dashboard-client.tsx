'use client';

import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardCharts = dynamic(() => import('@/components/dashboard-charts').then(mod => mod.DashboardCharts), {
  ssr: false,
  loading: () => (
    <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
            <CardHeader><Skeleton className="h-8 w-1/3" /></CardHeader>
            <CardContent><Skeleton className="h-48 w-full" /></CardContent>
        </Card>
        <Card>
            <CardHeader><Skeleton className="h-8 w-2/3" /></CardHeader>
            <CardContent className="flex justify-center items-center"><Skeleton className="h-48 w-48 rounded-full" /></CardContent>
        </Card>
    </div>
  )
});

export function DashboardClient() {
    return <DashboardCharts />;
}
