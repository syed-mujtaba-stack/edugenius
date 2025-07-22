
'use client';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Code, Send, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const developers = [
    {
        name: 'Syed Mujtaba Abbas',
        image: 'https://mujtaba-mj.vercel.app/_next/image?url=https%3A%2F%2Fmujtaba-110.vercel.app%2F_next%2Fimage%3Furl%3D%252Fhero.jpg%26w%3D1920%26q%3D75&w=1920&q=75',
        title: 'Lead Developer & AI Engineer',
        bio: 'I\'m a full-stack developer, AI developer, and agentic AI dev. As the author and developer of EduGenius, my passion is to build intelligent solutions that make a real-world impact.',
        portfolio: 'https://mujtaba-mj.vercel.app',
    },
    {
        name: 'Syeda Noor Fatima',
        image: 'https://portfolio-nine-ebon-36.vercel.app/_next/image?url=%2Fimages%2Fprofile.jpg&w=640&q=75',
        title: 'Full Stack Developer',
        bio: 'A passionate and creative front-end developer with a love for crafting beautiful and intuitive user interfaces. I contribute to making EduGenius a seamless experience for all students.',
        portfolio: 'https://portfolio-nine-ebon-36.vercel.app',
    }
];

export default function DeveloperInfoPage() {
    const [user, loading] = useAuthState(auth);
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if(user) {
            setName(user.displayName || '');
        }
    }, [user]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast({ title: "Authentication Error", description: "You must be logged in to send a message.", variant: "destructive" });
            return;
        }
        if (!name.trim() || !message.trim()) {
            toast({ title: "Missing Information", description: "Please fill in your name and a message.", variant: "destructive" });
            return;
        }

        setIsSending(true);
        try {
            await addDoc(collection(db, "messages"), {
                name,
                email: user.email,
                message,
                uid: user.uid,
                createdAt: serverTimestamp(),
            });
            toast({ title: "Message Sent!", description: "Thank you for reaching out. We will get back to you soon." });
            setMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
            toast({ title: "Error", description: "Could not send your message. Please try again.", variant: "destructive" });
        } finally {
            setIsSending(false);
        }
    };


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-3xl md:text-4xl">Meet the Developers</h1>
      </div>
      
      <p className="text-lg text-muted-foreground">
        EduGenius is built with passion by a dedicated team.
      </p>

      <div className="grid gap-8 mt-6 md:grid-cols-2">
        {developers.map((dev) => (
            <Card key={dev.name} className="flex flex-col text-center items-center">
                <CardHeader className="items-center">
                    <div className="relative h-32 w-32 mb-4">
                        <Image
                        src={dev.image}
                        alt={`Profile picture of ${dev.name}`}
                        fill
                        className="rounded-full object-cover border-4 border-primary/10 shadow-lg"
                        />
                    </div>
                    <CardTitle className="text-2xl">{dev.name}</CardTitle>
                    <CardDescription className="text-primary font-semibold">{dev.title}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-muted-foreground">{dev.bio}</p>
                </CardContent>
                <div className="p-6 pt-0">
                     <Button asChild>
                        <a href={dev.portfolio} target="_blank" rel="noopener noreferrer">
                            View Portfolio <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                    </Button>
                </div>
            </Card>
        ))}
      </div>

       <Card className="mt-8">
            <CardHeader>
                <CardTitle>Contact Us</CardTitle>
                <CardDescription>Have a question, feedback, or a feature request? We'd love to hear from you!</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSendMessage} className="space-y-4 max-w-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="name">Your Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your full name"
                                required
                                disabled={isSending}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Your Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={user?.email || ''}
                                placeholder="Your email address"
                                required
                                disabled
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                         <Label htmlFor="message">Message</Label>
                         <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message here..."
                            required
                            className="min-h-[120px]"
                            disabled={isSending}
                         />
                    </div>
                    <Button type="submit" disabled={isSending || loading}>
                        {isSending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                            </>
                        ) : (
                            <>
                                <Send className="mr-2 h-4 w-4" /> Send Message
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    </main>
  );
}
