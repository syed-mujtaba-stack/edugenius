
'use client';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Logo } from "@/components/logo";
import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, FileText, Briefcase, TrendingUp, Music4, FileSignature, BookText, Users, School2, Heart } from "lucide-react";
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
  {
    icon: <FileSignature className="w-8 h-8 text-primary" />,
    title: 'Essay Evaluator',
    description: 'Get instant, detailed feedback on your essays to improve your writing skills.',
  },
  {
    icon: <BookText className="w-8 h-8 text-primary" />,
    title: 'Chapter Summarizer',
    description: 'Instantly summarize long chapters into concise, easy-to-understand points.',
  },
   {
    icon: <Music4 className="w-8 h-8 text-primary" />,
    title: 'Audio Generator',
    description: 'Convert any text into high-quality audio lessons for learning on the go.',
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: 'Community Hub',
    description: 'Connect with fellow students, ask questions, and learn together in a community.',
  },
];

const whoIsItFor = [
    {
        icon: <School2 className="w-10 h-10 text-primary" />,
        title: "For Students",
        description: "Get personalized study plans, instant doubt clarification, and tools to ace your exams. Make learning fun and effective."
    },
    {
        icon: <Users className="w-10 h-10 text-primary" />,
        title: "For Teachers",
        description: "Generate lesson plans in seconds, create custom tests for your class, and track student progress with powerful AI tools."
    },
    {
        icon: <Heart className="w-10 h-10 text-primary" />,
        title: "For Parents",
        description: "Support your child's learning journey by understanding their weak areas and providing them with the best AI-powered resources."
    }
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
                        <Card key={index} className="text-center bg-background flex flex-col">
                            <CardHeader className="items-center">
                                {feature.icon}
                                <CardTitle className="mt-4 text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

         {/* How it works Section */}
        <section className="w-full py-12 md:py-24">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">Get Started in 3 Easy Steps</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
                    <div className="flex flex-col items-center">
                         <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">1</div>
                         <h3 className="text-xl font-semibold mb-2">Create Your Account</h3>
                         <p className="text-muted-foreground">Sign up for free in seconds to get immediate access to all tools.</p>
                    </div>
                     <div className="flex flex-col items-center">
                         <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">2</div>
                         <h3 className="text-xl font-semibold mb-2">Explore AI Tools</h3>
                         <p className="text-muted-foreground">Generate tests, summarize chapters, or get career advice from our AI.</p>
                    </div>
                     <div className="flex flex-col items-center">
                         <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">3</div>
                         <h3 className="text-xl font-semibold mb-2">Achieve Your Goals</h3>
                         <p className="text-muted-foreground">Use the personalized feedback and plans to boost your learning.</p>
                    </div>
                </div>
            </div>
        </section>


        {/* Who is it for Section */}
        <section id="who-is-it-for" className="w-full py-12 md:py-24 bg-secondary">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">Built for Everyone in Education</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {whoIsItFor.map((card, index) => (
                         <Card key={index} className="text-center bg-background">
                            <CardHeader className="items-center">
                                {card.icon}
                                <CardTitle className="mt-4">{card.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{card.description}</p>
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
