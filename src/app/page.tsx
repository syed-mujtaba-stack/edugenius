
'use client';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { Logo } from "@/components/logo";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: "Login Successful",
        description: "Welcome to EduGenius!",
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error during sign-in:", error);
      let description = "Could not sign you in with Google. Please try again.";
      if (error && error.code === 'auth/internal-error') {
        description = "An internal authentication error occurred. Please ensure Google Sign-in is enabled in your Firebase project's Authentication settings and that the domain is authorized.";
      }
      toast({
        title: "Login Failed",
        description: description,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4">
      <main className="relative z-10 flex flex-col items-center justify-center text-center">
        <div className="mb-8">
          <Logo className="h-24 w-24 text-primary" />
        </div>
        <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold text-primary tracking-wider">
          EduGenius
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary/80">
          Unlock Your Learning Potential with AI. Summarize chapters, generate Q&As, and create personalized tests in seconds.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none sm:justify-center">
           <Button onClick={handleSignIn} size="lg" className="font-bold text-lg flex-1 sm:flex-none sm:px-10">
            Sign in with Google
          </Button>
        </div>
      </main>
      <footer className="relative z-10 py-6 mt-8 text-center text-sm text-primary/60">
        <p>© {new Date().getFullYear()} EduGenius. All rights reserved.</p>
      </footer>
    </div>
  );
}
