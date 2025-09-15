
'use client';

import { Navbar } from '@/components/navbar';
import { Logo } from '@/components/logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Users, BookOpen, Lightbulb, Target, Heart, Award, Star, Zap, BookText, GraduationCap, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const coreValues = [
  { 
    title: "Personalized Learning",
    icon: <BookOpen className="w-6 h-6 text-primary" />,
    description: "Tailored educational experiences that adapt to each student's unique learning style and pace."
  },
  { 
    title: "Accessibility",
    icon: <Zap className="w-6 h-6 text-primary" />,
    description: "Making quality education accessible to students across Pakistan, regardless of location or background."
  },
  { 
    title: "Empowerment",
    icon: <GraduationCap className="w-6 h-6 text-primary" />,
    description: "Equipping students and teachers with powerful AI tools to enhance the learning experience."
  },
  { 
    title: "Innovation",
    icon: <Lightbulb className="w-6 h-6 text-primary" />,
    description: "Continuously evolving with cutting-edge technology to improve educational outcomes."
  },
  { 
    title: "Community",
    icon: <Users className="w-6 h-6 text-primary" />,
    description: "Building a supportive learning community where students and educators can connect and grow together."
  },
  { 
    title: "Excellence",
    icon: <Award className="w-6 h-6 text-primary" />,
    description: "Committed to delivering the highest quality educational resources and support."
  }
];

const stats = [
  { value: "10,000+", label: "Active Students" },
  { value: "95%", label: "Success Rate" },
  { value: "24/7", label: "Support" },
  { value: "100+", label: "Learning Modules" }
];

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    } 
  }
} as const;

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 overflow-hidden bg-gradient-to-b from-primary/5 to-background">
          <div className="absolute inset-0 bg-grid-black/[0.05] dark:bg-grid-white/[0.05]" />
          <div className="container px-4 md:px-6 relative z-10">
            <motion.div 
              className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              <motion.div variants={fadeIn}>
                <Logo className="h-24 w-24 md:h-28 md:w-28 text-primary mx-auto" />
              </motion.div>
              <motion.h1 
                className="text-4xl md:text-6xl font-headline font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80"
                variants={fadeIn}
              >
                About EduGenius
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-muted-foreground max-w-3xl"
                variants={fadeIn}
              >
                Empowering the next generation of Pakistani students with AI-powered learning tools that make education accessible, engaging, and effective for everyone.
              </motion.p>
              <motion.div variants={fadeIn} className="pt-4">
                <Button asChild size="lg" className="rounded-full px-8 h-12 text-base">
                  <Link href="/signup">Start Learning for Free</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="w-full py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
              <motion.div 
                className="space-y-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                  Our Mission
                </div>
                <h2 className="text-3xl md:text-4xl font-headline font-bold">
                  Revolutionizing Education in Pakistan
                </h2>
                <p className="text-muted-foreground text-lg">
                  EduGenius was born from a simple yet powerful idea: every student deserves a personalized learning experience that adapts to their unique needs and learning style. We're leveraging the power of artificial intelligence to make this vision a reality for students across Pakistan.
                </p>
                <div className="space-y-4 pt-4">
                  {[
                    "AI-powered personalized learning paths",
                    "Interactive and engaging educational content",
                    "Real-time progress tracking and analytics",
                    "Accessible on any device, anytime, anywhere"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div 
                className="relative h-80 md:h-[500px] bg-muted rounded-2xl overflow-hidden border border-border/20"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20" />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="text-center space-y-4">
                    <Target className="h-12 w-12 text-primary mx-auto" />
                    <h3 className="text-xl font-semibold">Our Goal</h3>
                    <p className="text-muted-foreground">
                      To empower 1 million Pakistani students with AI-powered learning tools by 2025.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-16 bg-secondary/30">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {stats.map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  className="bg-background/80 backdrop-blur-sm p-6 rounded-xl border border-border/20 text-center"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeIn}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <motion.div 
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Our Values
              </span>
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
                What Drives Us Forward
              </h2>
              <p className="text-muted-foreground">
                These core principles guide every decision we make and every feature we build.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.map((value, index) => (
                <motion.div
                  key={value.title}
                  className="bg-background/50 backdrop-blur-sm border border-border/20 rounded-xl p-6 hover:shadow-md transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full py-16 md:py-24 bg-secondary/30">
          <div className="container px-4 md:px-6">
            <motion.div 
              className="text-center max-w-3xl mx-auto mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Our Team
              </span>
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
                Passionate Minds Behind EduGenius
              </h2>
              <p className="text-muted-foreground">
                A diverse team of educators, engineers, and designers committed to transforming education.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[
                { name: "Dr. Sarah Khan", role: "Chief Education Officer", image: "/images/team/sarah.jpg" },
                { name: "Ali Raza", role: "Head of AI Research", image: "/images/team/ali.jpg" },
                { name: "Ayesha Malik", role: "Lead Product Designer", image: "/images/team/ayesha.jpg" },
                { name: "Omar Farooq", role: "CTO & Co-founder", image: "/images/team/omar.jpg" }
              ].map((member, index) => (
                <motion.div
                  key={member.name}
                  className="group text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="relative overflow-hidden rounded-xl aspect-square mb-4 bg-muted">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <div className="text-left text-white">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-white/80">{member.role}</p>
                      </div>
                    </div>
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <User className="w-12 h-12 text-primary/50" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="container px-4 md:px-6">
            <motion.div 
              className="max-w-4xl mx-auto text-center bg-background/80 backdrop-blur-sm p-8 md:p-12 rounded-2xl border border-border/20 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <Star className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-4">
                Ready to Transform Your Learning Experience?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                Join thousands of students who are already achieving their academic goals with EduGenius.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="h-12 px-8 text-base">
                  <Link href="/signup">Get Started for Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 border-t bg-background/50 backdrop-blur-sm">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Logo className="h-8 w-8 text-primary" />
              <span className="font-semibold">EduGenius</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} EduGenius. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
