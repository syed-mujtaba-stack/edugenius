'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { FileText, Download, PlayCircle, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';


const courseData = {
    'python-basics': {
        title: 'Python for Beginners',
        instructor: 'Javed Ali',
        description: 'A complete course for learning Python from scratch, covering all the fundamental concepts.',
        modules: [
            { title: 'Introduction to Python', duration: '15 mins', content: 'History, features, and setup.' },
            { title: 'Variables and Data Types', duration: '25 mins', content: 'Numbers, strings, lists, tuples, dictionaries.' },
            { title: 'Control Flow', duration: '30 mins', content: 'If-else statements, for/while loops.' },
        ],
        resources: [
            { name: 'Course Syllabus.pdf', type: 'note' },
            { name: 'Chapter 1 Quiz.zip', type: 'quiz' },
        ],
        progress: 100, // example progress
    },
     'web-development': {
        title: 'Full Stack Web Development',
        instructor: 'Imran Malik',
        description: 'Learn to build modern web applications with React, Node.js, and more.',
        modules: [
            { title: 'HTML & CSS Fundamentals', duration: '45 mins', content: 'Structure and style your first webpage.' },
            { title: 'JavaScript Essentials', duration: '1 hour', content: 'Learn the core language of the web.' },
            { title: 'React for Beginners', duration: '1.5 hours', content: 'Build dynamic user interfaces.' },
        ],
        resources: [
            { name: 'Project Setup Guide.pdf', type: 'note' },
            { name: 'Final Project Brief.pdf', type: 'assignment' },
        ],
        progress: 50,
    }
    // Add other course data here...
};

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const course = courseData[params.courseId as keyof typeof courseData] || courseData['python-basics']; // Fallback to a default

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl md:text-4xl">{course.title}</h1>
        <Badge variant="secondary">By {course.instructor}</Badge>
      </div>
      
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardContent className="p-0">
                    <div className="aspect-video bg-muted flex items-center justify-center rounded-t-lg">
                        <PlayCircle className="h-16 w-16 text-muted-foreground" />
                    </div>
                </CardContent>
                <CardHeader>
                    <CardTitle>About this course</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{course.description}</p>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Resources</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                       {course.resources.map(res => (
                         <li key={res.name} className="flex items-center justify-between rounded-md border p-3">
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <span>{res.name}</span>
                            </div>
                            <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Download</Button>
                         </li>
                       ))}
                    </ul>
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Course Progress</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <Progress value={course.progress} className="w-full" />
                        <span className="font-bold">{course.progress}%</span>
                    </div>
                    {course.progress === 100 && (
                        <Button className="w-full mt-4">
                            <Award className="mr-2 h-4 w-4" />
                            Generate Certificate
                        </Button>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Course Content</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {course.modules.map((mod, index) => (
                             <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>
                                    <div className="flex flex-col text-left">
                                        <span>{index + 1}. {mod.title}</span>
                                        <span className="text-xs text-muted-foreground">{mod.duration}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    {mod.content}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}
