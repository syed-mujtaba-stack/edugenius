
'use client';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Bot, FileText, Briefcase, TrendingUp, Music4, FileSignature, BookText, Users, School2, Heart, ArrowRight, Star, Check, Play, Zap, BarChart3, Award, Clock, UserCheck, BookOpen, Video, Mail, ChevronRight, CheckCircle2 } from "lucide-react";
import { HomepageChatbot } from "@/components/homepage-chatbot";
import { Navbar } from "@/components/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Typewriter from "@/components/Typewriter";
import ThreeHeroBg from "@/components/ThreeHeroBg";
import Script from "next/script";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { motion } from "framer-motion";
// Animation variants
import type { Variants } from 'framer-motion';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    } 
  }
};

// Glass card component
interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const GlassCard = ({ children, className = "", ...props }: GlassCardProps) => (
  <div 
    className={`backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-2xl shadow-primary/10 overflow-hidden ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Floating animation
const floating = {
  initial: { y: 0 },
  animate: { 
    y: [-10, 10, -10],
    transition: { 
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Stats counter component
interface CounterProps {
  end: number;
  suffix?: string;
  duration?: number;
}

const Counter = ({ end, suffix = "", duration = 2 }: CounterProps) => {
  const [count, setCount] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (!inView) return;
    
    const start = 0;
    const increment = end / (duration * 60); // 60fps
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 1000 / 60);
    
    return () => clearInterval(timer);
  }, [inView, end, duration]);

  return <span ref={ref} className="text-4xl font-bold text-primary">{count}{suffix}</span>;
};

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
      <Script id="ld-json-org" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "EduGenius",
          url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002",
          logo: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/app.png`,
          sameAs: [
            // add social URLs if available
          ],
        })}
      </Script>
      <Script id="ld-json-website" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "EduGenius",
          url: process.env.NEXT_PUBLIC_SITE_URL || "mj-edugenius.vercel.app",
          potentialAction: {
            "@type": "SearchAction",
            target: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        })}
      </Script>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-16 sm:py-20 md:py-32 lg:py-40 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 overflow-hidden">
          <ThreeHeroBg />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background/50 to-secondary/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          />
          <motion.div 
            className="mb-6 sm:mb-8 relative z-10"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Logo className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 text-primary drop-shadow-lg" />
          </motion.div>
          <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-primary tracking-wider">
            EduGenius
          </h1>
          <div className="mt-3 text-lg sm:text-xl md:text-2xl font-semibold text-primary px-2">
            <Typewriter
              words={[
                "Personalized Learning Paths",
                "AI Test Generator",
                "24/7 AI Tutor",
                "Career Counseling",
                "Essay Evaluator",
                "Chapter Summarizer",
              ]}
              typingSpeed={55}
              deletingSpeed={40}
              pauseBetweenWords={1100}
              className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600"
            />
          </div>
          <p className="mt-4 max-w-2xl text-base sm:text-lg md:text-xl text-primary/80 px-4">
            Your AI-Powered Learning Co-Pilot. Summarize chapters, generate Q&As, and create personalized tests in seconds.
          </p>
          <motion.div 
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-sm sm:max-w-none px-4 sm:px-0 sm:justify-center relative z-10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-1">
              <Button asChild size="lg" className="font-bold text-base sm:text-lg w-full sm:w-auto sm:px-8 md:px-10 h-12 sm:h-14 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                  <Link href="/signup">
                    <Zap className="w-4 h-4 mr-2 fill-current" />
                    Get Started for Free
                  </Link>
              </Button>
            </GlassCard>
            <Button 
              asChild 
              size="lg" 
              variant="outline" 
              className="font-bold text-base sm:text-lg w-full sm:w-auto sm:px-8 md:px-10 h-12 sm:h-14 bg-background/50 backdrop-blur-sm border-white/20 hover:bg-background/80"
            >
              <Link href="#features">
                <BarChart3 className="w-4 h-4 mr-2" />
                Explore Features
              </Link>
            </Button>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
          <div className="absolute -right-32 -top-32 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl" />
          <div className="absolute -left-32 -bottom-32 w-64 h-64 bg-secondary/10 rounded-full filter blur-3xl" />
            
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <motion.h2 
                  className="text-2xl sm:text-3xl md:text-4xl font-headline text-center mb-8 sm:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  Features Built for Your Success
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="h-full"
                      >
                        <GlassCard className="h-full p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                          <CardHeader className="items-center pb-4">
                            <div className="mb-3 sm:mb-4">
                              {feature.icon}
                            </div>
                            <CardTitle className="text-lg sm:text-xl font-bold">{feature.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                          </CardContent>
                        </GlassCard>
                      </motion.div>
                    ))}
                </div>
            </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-8 sm:py-12 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
              <motion.div 
                className="p-4 sm:p-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeIn}
              >
                <div className="flex flex-col items-center">
                  <Users className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-2 sm:mb-4" />
                  <Counter end={10000} suffix="+" />
                  <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">Active Students</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="p-4 sm:p-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeIn}
                transition={{ delay: 0.1 }}
              >
                <div className="flex flex-col items-center">
                  <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-2 sm:mb-4" />
                  <Counter end={5000} suffix="+" />
                  <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">Lessons Completed</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="p-4 sm:p-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeIn}
                transition={{ delay: 0.2 }}
              >
                <div className="flex flex-col items-center">
                  <Award className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-2 sm:mb-4" />
                  <Counter end={95} suffix="%" />
                  <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">Success Rate</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="p-4 sm:p-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeIn}
                transition={{ delay: 0.3 }}
              >
                <div className="flex flex-col items-center">
                  <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-primary mb-2 sm:mb-4" />
                  <Counter end={24} suffix="/7" />
                  <p className="mt-1 sm:mt-2 text-sm sm:text-base text-muted-foreground">Support Available</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section className="w-full py-12 md:py-24 bg-background/50">
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl font-headline text-center mb-8 sm:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Get Started in 3 Easy Steps
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
              <motion.div 
                className="flex flex-col items-center p-6 bg-background/50 rounded-xl backdrop-blur-sm border border-border/20 shadow-sm hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 text-primary font-bold text-xl sm:text-2xl mb-4">1</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-center">Create Your Account</h3>
                <p className="text-sm sm:text-base text-muted-foreground text-center">Sign up for free in seconds to get immediate access to all tools.</p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center p-6 bg-background/50 rounded-xl backdrop-blur-sm border border-border/20 shadow-sm hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 text-primary font-bold text-xl sm:text-2xl mb-4">2</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-center">Explore AI Tools</h3>
                <p className="text-sm sm:text-base text-muted-foreground text-center">Generate tests, summarize chapters, or get career advice from our AI.</p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col items-center p-6 bg-background/50 rounded-xl backdrop-blur-sm border border-border/20 shadow-sm hover:shadow-md transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 text-primary font-bold text-xl sm:text-2xl mb-4">3</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-center">Achieve Your Goals</h3>
                <p className="text-sm sm:text-base text-muted-foreground text-center">Use the personalized feedback and plans to boost your learning.</p>
              </motion.div>
            </div>
          </div>
        </section>


        {/* Who is it for Section */}
        <section id="who-is-it-for" className="w-full py-12 md:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl font-headline text-center mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Built for Everyone in Education
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {whoIsItFor.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full text-center bg-background/80 backdrop-blur-sm border-border/20 hover:shadow-md transition-shadow">
                    <CardHeader className="items-center p-6 pb-0">
                      <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
                        {React.cloneElement(card.icon, { className: "w-8 h-8 sm:w-10 sm:h-10" })}
                      </div>
                      <CardTitle className="text-xl sm:text-2xl">{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-2">
                      <p className="text-sm sm:text-base text-muted-foreground">{card.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 md:py-24 bg-background/50">
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl font-headline text-center mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              What People Are Saying
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col items-center text-center p-6 bg-background/80 backdrop-blur-sm border-border/20 hover:shadow-md transition-shadow">
                    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 mb-4 border-4 border-background">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm sm:text-base text-muted-foreground italic mb-4">"{testimonial.quote}"</p>
                    <div className="mt-auto">
                      <h4 className="font-semibold text-sm sm:text-base">{testimonial.name}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </Card>
                </motion.div>
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
