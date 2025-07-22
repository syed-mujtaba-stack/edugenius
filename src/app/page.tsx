
'use client';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Logo } from "@/components/logo";
import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, FileText, Briefcase, TrendingUp } from "lucide-react";
import { HomepageChatbot } from "@/components/homepage-chatbot";

const features = [
  {
    icon: <TrendingUp className="w-8 h-8 text-primary" />,
    title: 'Personalized Learning Paths',
    description: 'AI-driven roadmaps to focus on your weak areas and achieve your goals faster.',
  },
  {
    icon: <FileText className="w-8 h-8 text-primary" />,
    title: 'AI Test Generator',
    description: 'Create custom tests for any subject and topic with various difficulty levels.',
  },
  {
    icon: <Bot className="w-8 h-8 text-primary" />,
    title: '24/7 AI Tutor',
    description: 'Get instant answers to your academic questions, anytime, anywhere.',
  },
  {
    icon: <Briefcase className="w-8 h-8 text-primary" />,
    title: 'Career Counseling',
    description: 'Discover the right career path based on your interests and get a custom roadmap.',
  },
];

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/dashboard");
      }
    });
    return () => unsubscribe();
  }, [router]);


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 flex flex-col items-center justify-center text-center px-4">
          <div className="mb-8">
            <Logo className="h-24 w-24 text-primary" />
          </div>
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold text-primary tracking-wider">
            EduGenius
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary/80">
            Your AI-Powered Learning Co-Pilot. Summarize chapters, generate Q&As, and create personalized tests in seconds.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none sm:justify-center">
            <Button asChild size="lg" className="font-bold text-lg flex-1 sm:flex-none sm:px-10">
                <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 bg-secondary">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">Features Built for Your Success</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="text-center bg-background">
                            <CardHeader className="items-center">
                                {feature.icon}
                                <CardTitle className="mt-4">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* Call to Action Section */}
        <section className="w-full py-20 md:py-28 text-center px-4">
            <h2 className="text-3xl md:text-4xl font-headline mb-4">Ready to Unlock Your Potential?</h2>
            <p className="max-w-xl mx-auto text-muted-foreground mb-8">
                Join thousands of students in Pakistan who are transforming their learning with AI.
            </p>
            <Button asChild size="lg" className="font-bold text-lg px-10">
                <Link href="/signup">Sign Up for Free</Link>
            </Button>
        </section>
      </main>

      <footer className="py-6 text-center text-sm text-primary/60 border-t">
        <p>© {new Date().getFullYear()} EduGenius. All rights reserved.</p>
      </footer>
      
      <HomepageChatbot />
    </div>
  );
}
