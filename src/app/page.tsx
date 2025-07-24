
'use client';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, FileText, Briefcase, TrendingUp, Music4, FileSignature, BookText, Users, School2, Heart, ArrowRight, Star } from "lucide-react";
import { HomepageChatbot } from "@/components/homepage-chatbot";
import { Navbar } from "@/components/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

const testimonials = [
    {
        name: "Aisha Khan",
        role: "Intermediate Student",
        quote: "The AI Test Generator is a game-changer! I can create practice tests for any topic, which has boosted my confidence for my board exams.",
        avatar: "https://placehold.co/100x100.png",
        dataAiHint: 'woman portrait',
    },
    {
        name: "Mr. Ahmed Ali",
        role: "Physics Teacher",
        quote: "EduGenius has saved me hours of work. The Lesson Planner helps me create engaging classes, and the community hub is great for student interaction.",
        avatar: "https://placehold.co/100x100.png",
        dataAiHint: 'man portrait',
    },
    {
        name: "Bilal Sheikh",
        role: "Matric Student",
        quote: "I was struggling with career choices, but the AI Career Counselor gave me a clear roadmap. I finally know what I want to pursue!",
        avatar: "https://placehold.co/100x100.png",
        dataAiHint: 'person portrait',
    }
];

const blogPosts = [
    {
        title: "How AI is Changing the Future of Education in Pakistan",
        excerpt: "Artificial Intelligence is no longer a futuristic concept; it's a present-day reality transforming industries, and education is no exception...",
    },
    {
        title: "5 Proven Study Techniques to Ace Your Next Exam",
        excerpt: "Exams can be stressful, but with the right strategies, you can boost your confidence and performance. Here are five proven techniques...",
    },
];


export default function Home() {
  const router = useRouter();

  // This logic should be on the page, not in the layout.
  // The layout is for logged-in users, this page is for logged-out users.
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       router.push("/dashboard");
  //     }
  //   });
  //   return () => unsubscribe();
  // }, [router]);


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
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
                <Link href="/signup">Get Started for Free</Link>
            </Button>
             <Button asChild size="lg" variant="outline" className="font-bold text-lg flex-1 sm:flex-none sm:px-10">
                <Link href="#features">Explore Features</Link>
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

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24">
            <div className="container mx-auto px-4">
                 <h2 className="text-3xl md:text-4xl font-headline text-center mb-12">What People Are Saying About Us</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     {testimonials.map((testimonial, index) => (
                        <Card key={index} className="flex flex-col items-center text-center p-6 bg-secondary">
                             <Avatar className="w-20 h-20 mb-4 border-4 border-background">
                                <AvatarImage src={testimonial.avatar} data-ai-hint={testimonial.dataAiHint} />
                                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <CardContent className="flex-grow">
                                <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                            </CardContent>
                            <div className="mt-4">
                                <h4 className="font-semibold">{testimonial.name}</h4>
                                <p className="text-sm text-primary/80">{testimonial.role}</p>
                            </div>
                        </Card>
                     ))}
                 </div>
            </div>
        </section>

        {/* From Our Blog Section */}
        <section className="w-full py-12 md:py-24 bg-secondary">
            <div className="container mx-auto px-4">
                 <h2 className="text-3xl md:text-4xl font-headline text-center mb-4">From Our Blog</h2>
                 <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">Get the latest insights on AI in education, study tips, and career guidance.</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {blogPosts.map((post, index) => (
                        <Card key={index}>
                            <CardHeader><CardTitle>{post.title}</CardTitle></CardHeader>
                            <CardContent><p className="text-muted-foreground">{post.excerpt}</p></CardContent>
                            <div className="p-6 pt-0">
                                <Button asChild variant="link" className="p-0">
                                    <Link href="/blogs">Read More <ArrowRight className="w-4 h-4 ml-2" /></Link>
                                </Button>
                            </div>
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

      <footer className="py-8 text-center text-sm text-primary/60 border-t">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} EduGenius. All rights reserved.</p>
            <div className="flex gap-4">
                <Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link>
                <Link href="/docs" className="hover:underline">Documentation</Link>
            </div>
        </div>
      </footer>
      
      <HomepageChatbot />
    </div>
  );
}
