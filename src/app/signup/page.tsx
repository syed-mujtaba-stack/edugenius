
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({ title: 'Account Created!', description: 'Welcome to EduGenius. You are now logged in.' });
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error during email sign up:', error);
       toast({
        title: 'Sign-up Failed',
        description: error.code === 'auth/email-already-in-use' 
            ? 'This email is already registered. Please log in.' 
            : (error.message || 'An unexpected error occurred.'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: 'Account Created!', description: 'Welcome to EduGenius. You are now logged in.' });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Error during sign-in:", error);
      let description = "Could not sign you up with Google. Please try again.";
      if (error?.code === 'auth/internal-error') {
        description = "An internal authentication error occurred. Please ensure Google Sign-in is enabled in your Firebase project's Authentication settings and that the domain is authorized.";
      }
      toast({
        title: "Sign-up Failed",
        description: description,
        variant: "destructive",
      });
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4">
                <Logo className="h-16 w-16" />
            </div>
          <CardTitle className="text-3xl font-headline">Create an Account</CardTitle>
          <CardDescription>Join EduGenius to unlock your learning potential</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">Must be at least 6 characters.</p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Create Account'}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
            </div>
          </div>
          
           <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
                 <>
                    <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4"><path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.7 1.72-4.68 1.72-5.45 0-9.88-4.45-9.88-9.88s4.43-9.88 9.88-9.88c2.63 0 4.81 1 6.35 2.54l2.73-2.73C19.75 1.95 16.46 0 12.48 0 5.88 0 0 5.88 0 12.48s5.88 12.48 12.48 12.48c6.92 0 12.08-4.81 12.08-12.08 0-.81-.09-1.61-.25-2.38z"></path></svg>
                    Google
                 </>
            )}
            </Button>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="underline hover:text-primary">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
