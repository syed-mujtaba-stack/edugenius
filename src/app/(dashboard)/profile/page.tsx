
'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { updateProfile, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, KeyRound, LogOut } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [user, loading] = useAuthState(auth);
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: 'Error', description: 'You must be logged in to update your profile.', variant: 'destructive' });
      return;
    }
    if (!displayName.trim()) {
      toast({ title: 'Error', description: 'Display name cannot be empty.', variant: 'destructive' });
      return;
    }

    setIsUpdating(true);
    try {
      await updateProfile(user, { displayName: displayName.trim(), photoURL: photoURL.trim() });
      toast({ title: 'Success', description: 'Your profile has been updated.' });
      window.dispatchEvent(new Event('profileUpdated'));
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast({ title: 'Update Failed', description: err.message || 'Could not update your profile. Please try again.', variant: 'destructive' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user || !user.email) {
      toast({ title: 'Error', description: 'Could not find your email address.', variant: 'destructive' });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast({ title: 'Password Reset Email Sent', description: 'Please check your inbox to reset your password.' });
    } catch (err: any) {
      console.error('Error sending password reset email:', err);
      toast({ title: 'Error', description: err.message || 'Failed to send password reset email.', variant: 'destructive' });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    } catch (error: any) {
        console.error('Error logging out: ', error);
        toast({ title: 'Logout Failed', description: error.message || 'An error occurred during logout.', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center"><Skeleton className="h-10 w-48" /></div>
        <Card>
          <CardHeader><Skeleton className="h-8 w-1/3" /><Skeleton className="h-4 w-1/2" /></CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="flex-grow space-y-2"><Skeleton className="h-6 w-1/2" /><Skeleton className="h-4 w-full" /></div>
            </div>
            <Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-24" />
          </CardContent>
        </Card>
      </main>
    );
  }
  
  if (!user) return null;

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center"><h1 className="font-headline text-3xl md:text-4xl">My Profile</h1></div>
      
      <div className="grid gap-6">
        <Card>
            <form onSubmit={handleUpdateProfile}>
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>View and update your account details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={photoURL || ''} alt={displayName || 'User'} data-ai-hint="person avatar" />
                    <AvatarFallback className="text-2xl">{displayName ? displayName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : 'U')}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <h2 className="text-xl font-bold">{displayName || "New User"}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your full name" required disabled={isUpdating} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="photoURL">Profile Picture URL</Label>
                        <Input id="photoURL" type="url" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} placeholder="https://example.com/your-image.png" disabled={isUpdating} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={user.email || ''} disabled />
                        <p className="text-xs text-muted-foreground">Email address cannot be changed.</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button type="submit" disabled={isUpdating}>
                {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Update Profile
                </Button>
            </CardFooter>
            </form>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security, like changing your password.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <h3 className="font-medium">Password</h3>
                        <p className="text-sm text-muted-foreground">Reset your password via an email link.</p>
                    </div>
                    <Button variant="outline" onClick={handlePasswordReset}>
                        <KeyRound className="mr-2 h-4 w-4" />
                        Reset Password
                    </Button>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Logout</CardTitle>
                <CardDescription>Sign out of your account on this device.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between rounded-lg border p-4">
                     <div>
                        <h3 className="font-medium">Sign Out</h3>
                        <p className="text-sm text-muted-foreground">You will be returned to the login screen.</p>
                    </div>
                    <Button variant="destructive" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
