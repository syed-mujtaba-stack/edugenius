'use client';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const courses = [
  {
    id: 'python-basics',
    title: 'Python for Beginners',
    description: 'A complete course for learning Python from scratch, covering all the fundamental concepts.',
    instructor: 'Javed Ali',
    price: 'Rs. 999',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'programming code',
  },
  {
    id: 'ai-fundamentals',
    title: 'AI Fundamentals',
    description: 'Explore the exciting world of Artificial Intelligence and its core principles.',
    instructor: 'Ayesha Khan',
    price: 'Rs. 1,499',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'artificial intelligence',
  },
  {
    id: 'web-development',
    title: 'Full Stack Web Development',
    description: 'Learn to build modern web applications with React, Node.js, and more.',
    instructor: 'Imran Malik',
    price: 'Rs. 2,500',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'web development',
  },
  {
    id: 'matric-physics',
    title: 'Matric Physics - Complete Guide',
    description: 'Covering the complete physics syllabus for Matric (Grade 9-10) with detailed lectures.',
    instructor: 'Sana Ahmed',
    price: 'Free',
    image: 'https://placehold.co/600x400.png',
    dataAiHint: 'physics classroom',
  },
];

export default function CoursesPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-3xl md:text-4xl">Video Courses</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {courses.map((course) => (
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
              <Badge variant={course.price === 'Free' ? 'secondary' : 'default'}>{course.price}</Badge>
              <Button asChild>
                <Link href={`/courses/${course.id}`}>View Course</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
