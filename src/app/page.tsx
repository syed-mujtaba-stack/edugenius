import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Logo } from "@/components/logo";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-background overflow-hidden">
      <Image
        src="https://placehold.co/1920x1080.png"
        alt="Background"
        layout="fill"
        objectFit="cover"
        className="opacity-20"
        data-ai-hint="education technology"
      />
      <div className="absolute inset-0 bg-black/60" />

      <main className="relative z-10 flex flex-col items-center justify-center text-center p-4">
        <div className="mb-8">
          <Logo className="h-24 w-24 text-primary" />
        </div>
        <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold text-primary tracking-wider">
          EduGenius
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary/80">
          Unlock Your Learning Potential with AI. Summarize chapters, generate Q&As, and create personalized tests in seconds.
        </p>
        <div className="mt-8 flex gap-4">
          <Button asChild size="lg" className="font-bold text-lg">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </main>
      <footer className="relative z-10 py-6 text-center text-sm text-primary/60">
        <p>© {new Date().getFullYear()} EduGenius. All rights reserved.</p>
      </footer>
    </div>
  );
}
