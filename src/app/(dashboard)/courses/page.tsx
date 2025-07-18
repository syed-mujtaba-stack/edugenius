'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Search, Youtube } from 'lucide-react';

const courses = [
  {
    id: 'python-basics',
    title: 'Python for Beginners (Complete Course)',
    description: 'Learn Python from scratch with this comprehensive course from freeCodeCamp.',
    instructor: 'freeCodeCamp.org',
    youtubeUrl: 'https://www.youtube.com/watch?v=eWRfhZUzrAc',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'programming code python',
    category: 'Programming Languages'
  },
  {
    id: 'ai-fundamentals',
    title: 'AI for Everyone',
    description: 'A non-technical course by Andrew Ng to understand AI, its applications, and its impact.',
    instructor: 'DeepLearning.AI',
    youtubeUrl: 'https://www.youtube.com/watch?v=2z-f9T12tCg',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'artificial intelligence brain',
    category: 'AI & Data Science'
  },
  {
    id: 'web-development',
    title: 'Full Stack Web Development for Beginners',
    description: 'A complete guide to becoming a full-stack developer, covering HTML, CSS, JS, Node.js and more.',
    instructor: 'Dave Gray',
    youtubeUrl: 'https://www.youtube.com/watch?v=EzKkl62c-pc',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'web development code',
    category: 'Web Development'
  },
  {
    id: 'matric-physics',
    title: 'Physics Class 9th - Chapter 1',
    description: 'A detailed lecture on the first chapter of 9th-grade physics, tailored for Pakistani students.',
    instructor: 'ilmkidunya',
    youtubeUrl: 'https://www.youtube.com/watch?v=sF_3-gV_w6s',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'physics classroom science',
    category: 'Science'
  },
];

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="font-headline text-3xl md:text-4xl">Free Video Courses</h1>
        <div className="relative md:w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search courses from YouTube..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="flex flex-col">
            <CardHeader>
              <div className="relative h-40 w-full mb-4">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="rounded-md object-cover"
                  data-ai-hint={course.dataAiHint}
                />
              </div>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription>By {course.instructor}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{course.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Badge variant='secondary'>Free on YouTube</Badge>
              <Button asChild>
                <a href={course.youtubeUrl} target="_blank" rel="noopener noreferrer">
                    <Youtube className="mr-2 h-4 w-4" />
                    Watch Now
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
