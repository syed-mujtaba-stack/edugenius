
'use client';
import { useEffect, useState } from 'react';
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Shield, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// No metadata in client components, but we keep the idea for reference
// export const metadata: Metadata = {
//     title: "Admin Dashboard",
//     description: "System overview for administrators. Manage users, teachers, students, and system settings from the central control panel.",
// };

export default function AdminDashboardPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        // Only run on client
        if (typeof window !== 'undefined') {
            const adminCreds = sessionStorage.getItem('admin-authed');
            if (adminCreds === 'true') {
                setIsAuthenticated(true);
            } else {
                const username = prompt('Enter admin username:');
                const password = prompt('Enter admin password:');

                if (username === 'admin' && password === '123admin') {
                    sessionStorage.setItem('admin-authed', 'true');
                    setIsAuthenticated(true);
                    toast({
                        title: 'Authentication Successful',
                        description: 'Welcome, Admin!',
                    });
                } else {
                    toast({
                        title: 'Authentication Failed',
                        description: 'Incorrect username or password. Redirecting...',
                        variant: 'destructive',
                    });
                    router.push('/dashboard');
                }
            }
        }
    }, [router, toast]);

    if (!isAuthenticated) {
        return (
            <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Authenticating...</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Please wait while we verify your credentials.</p>
                    </CardContent>
                </Card>
            </main>
        );
    }

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex items-center">
                <h1 className="font-headline text-3xl md:text-4xl">Admin Dashboard</h1>
            </div>
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Admin Access</AlertTitle>
                <AlertDescription>
                    You are currently in the admin section. Changes made here can affect the entire application.
                </AlertDescription>
            </Alert>
            <Card>
                <CardHeader>
                <CardTitle>System Overview</CardTitle>
                <CardDescription>Manage users and system settings.</CardDescription>
                </CardHeader>
                <CardContent>
                <p>This is the central control panel for the entire application.</p>
                </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1,257</div>
                    <p className="text-xs text-muted-foreground">+120 this month</p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Teachers</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">42</div>
                    <p className="text-xs text-muted-foreground">+5 new teachers</p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1,215</div>
                    <p className="text-xs text-muted-foreground">+115 new students</p>
                </CardContent>
                </Card>
            </div>
        </main>
    );
}
