
'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { updateProfile } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const [user, loading] = useAuthState(auth);
  const [displayName, setDisplayName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to update your profile.',
        variant: 'destructive',
      });
      return;
    }

    if (!displayName.trim()) {
      toast({
        title: 'Error',
        description: 'Display name cannot be empty.',
        variant: 'destructive',
      });
      return;
    }

    setIsUpdating(true);
    try {
      await updateProfile(user, { displayName: displayName.trim() });
      toast({
        title: 'Success',
        description: 'Your profile has been updated.',
      });
       // This is a friendly way to let other components know the user updated.
       window.dispatchEvent(new Event('profileUpdated'));
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast({
        title: 'Update Failed',
        description: err.message || 'Could not update your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
            <Skeleton className="h-10 w-48" />
        </div>
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="flex-grow space-y-2">
                        <Skeleton className="h-6 w-1/2" />
                         <Skeleton className="h-4 w-full" />
                    </div>
                </div>
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-24" />
            </CardContent>
        </Card>
      </main>
    );
  }
  
  if (!user) {
    return null; // Or a message telling the user to log in
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-3xl md:text-4xl">My Profile</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>View and update your account details.</CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} data-ai-hint="person avatar" />
                        <AvatarFallback className="text-2xl">
                            {user.displayName ? user.displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <h2 className="text-xl font-bold">{user.displayName || "New User"}</h2>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your full name"
                        required
                        disabled={isUpdating}
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={user.email || ''}
                        disabled
                    />
                     <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
                </div>
                <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Update Profile
                </Button>
            </form>
        </CardContent>
      </Card>
    </main>
  );
}
