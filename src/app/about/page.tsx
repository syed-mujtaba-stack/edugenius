
import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { Logo } from '@/components/logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
    title: "About EduGenius",
    description: "Learn about the mission, vision, and the story behind EduGenius, the AI-powered learning platform for Pakistani students.",
};

const coreValues = [
    "Personalized Learning",
    "Accessibility for All",
    "Empowering Teachers",
    "Fostering Curiosity",
    "Building Community",
    "Technological Innovation"
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <Logo className="h-20 w-20 text-primary" />
              <h1 className="text-4xl font-headline md:text-5xl">About EduGenius</h1>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Our mission is to revolutionize education in Pakistan by providing accessible, personalized, and intelligent learning tools powered by AI.
              </p>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-secondary">
            <div className="container px-4 md:px-6">
                <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tighter">Our Story</h2>
                        <p className="text-muted-foreground">
                            EduGenius was born from a simple idea: every student deserves a co-pilot on their learning journey. Recognizing the challenges faced by students in Pakistan—from one-size-fits-all education to a lack of personalized guidance—we set out to build a solution. We believe that technology, specifically Artificial Intelligence, can bridge this gap.
                        </p>
                        <p className="text-muted-foreground">
                            Our goal is to create a platform that doesn't just provide information, but understands each student's unique needs, adapts to their learning style, and empowers them to achieve their full potential.
                        </p>
                    </div>
                    <div className="space-y-4">
                         <h2 className="text-3xl font-bold tracking-tighter">Our Vision</h2>
                        <p className="text-muted-foreground">
                            We envision a future where every student in Pakistan has access to a world-class education, regardless of their background or location. We aim to be the most trusted educational companion, helping students not only to excel academically but also to discover their passions and build successful careers.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section className="w-full py-12 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-headline">Our Core Values</h2>
                    <p className="max-w-[700px] text-muted-foreground">
                        These are the principles that guide our work every day.
                    </p>
                </div>
                <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 py-12 sm:grid-cols-3">
                    {coreValues.map((value, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <Check className="h-5 w-5 text-primary" />
                            <span className="font-medium">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section className="w-full py-12 md:py-24 text-center px-4 bg-secondary">
            <h2 className="text-3xl md:text-4xl font-headline mb-4">Join Us on Our Mission</h2>
            <p className="max-w-xl mx-auto text-muted-foreground mb-8">
                Whether you're a student, teacher, or parent, become a part of the educational revolution in Pakistan.
            </p>
            <Button asChild size="lg" className="font-bold text-lg px-10">
                <Link href="/signup">Get Started for Free</Link>
            </Button>
        </section>

      </main>
       <footer className="py-6 text-center text-sm text-primary/60 border-t">
        <p>© {new Date().getFullYear()} EduGenius. All rights reserved.</p>
      </footer>
    </div>
  );
}
