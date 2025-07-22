
'use client';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Code, Send, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
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

    useEffect(() => {
        if(user) {
            setName(user.displayName || '');
        }
    }, [user]);

    const handleSendWhatsApp = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            toast({ title: "Message is empty", description: "Please write a message before sending.", variant: "destructive" });
            return;
        }

        // **IMPORTANT**: Replace this with your actual WhatsApp number including the country code.
        const yourWhatsAppNumber = '+923460630802'; 
        
        const text = `*Message from EduGenius App*\n\n*Name:* ${name || 'N/A'}\n*Email:* ${user?.email || 'N/A'}\n\n*Message:*\n${message}`;
        
        const encodedText = encodeURIComponent(text);
        
        const url = `https://wa.me/${yourWhatsAppNumber.replace('+', '')}?text=${encodedText}`;
        
        window.open(url, '_blank');
        
        toast({ title: "Redirecting to WhatsApp", description: "Your message is ready to be sent." });
        setMessage('');
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
                <CardDescription>Have a question, feedback, or a feature request? Send us a message on WhatsApp!</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSendWhatsApp} className="space-y-4 max-w-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="name">Your Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Your full name"
                                required
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
                         />
                    </div>
                    <Button type="submit" disabled={loading}>
                        <Send className="mr-2 h-4 w-4" /> Send on WhatsApp
                    </Button>
                </form>
            </CardContent>
        </Card>
    </main>
  );
}
