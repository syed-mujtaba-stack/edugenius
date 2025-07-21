import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, UserSquare, Code } from 'lucide-react';

export const metadata: Metadata = {
    title: "About the Developers",
    description: "Meet the talented developers behind EduGenius: Syed Mujtaba Abbas and Maham Zehra.",
};

const developers = [
    {
        name: 'Syed Mujtaba Abbas',
        image: 'https://mujtaba-mj.vercel.app/_next/image?url=https%3A%2F%2Fmujtaba-110.vercel.app%2F_next%2Fimage%3Furl%3D%252Fhero.jpg%26w%3D1920%26q%3D75&w=1920&q=75',
        title: 'Lead Developer & AI Engineer',
        bio: 'I\'m a full-stack developer, AI developer, and agentic AI dev. As the author and developer of EduGenius, my passion is to build intelligent solutions that make a real-world impact.',
        portfolio: 'https://mujtaba-mj.vercel.app',
    },
    {
        name: 'Maham Zehra',
        image: 'https://portfolio-nine-ebon-36.vercel.app/my-passport-photo.jpg',
        title: 'Full Stack Developer',
        bio: 'A passionate and creative front-end developer with a love for crafting beautiful and intuitive user interfaces. I contribute to making EduGenius a seamless experience for all students.',
        portfolio: 'https://portfolio-nine-ebon-36.vercel.app',
    }
]

export default function DeveloperInfoPage() {
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
    </main>
  );
}
