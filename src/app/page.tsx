import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "@/components/logo";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "EduGenius: AI-Powered Learning for Pakistani Students",
  description: "Welcome to EduGenius. Unlock your learning potential with our AI-powered platform. Summarize chapters, generate Q&As, create personalized tests, get career advice, and more. Built for students in Pakistan.",
};


export default function Home() {
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
        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none">
           <Button asChild size="lg" className="font-bold text-lg flex-1">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </main>
      <footer className="relative z-10 py-6 mt-8 text-center text-sm text-primary/60">
        <p>© {new Date().getFullYear()} EduGenius. All rights reserved.</p>
      </footer>
    </div>
  );
}
