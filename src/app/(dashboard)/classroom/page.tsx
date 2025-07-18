'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users, FileText, Bot } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { generateLessonPlan } from '@/ai/flows/generate-lesson-plan';
import { useToast } from '@/hooks/use-toast';

const students = [
  { name: 'Ali Raza', progress: 85 },
  { name: 'Fatima Sheikh', progress: 92 },
  { name: 'Bilal Ahmed', progress: 78 },
  { name: 'Sana Javed', progress: 88 },
];

const lessons = [
    { title: 'Introduction to Algebra', type: 'note' },
    { title: 'Quiz: Chapter 1', type: 'quiz' },
    { title: 'Homework: Solving Equations', type: 'assignment' },
];

export default function ClassroomPage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();

    const handleGenerateLesson = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const topic = formData.get('topic') as string;
        const duration = formData.get('duration') as string;
        const objective = formData.get('objective') as string;
        
        if (!topic || !duration || !objective) {
            toast({ title: "Error", description: "Please fill all fields.", variant: "destructive" });
            return;
        }

        setIsGenerating(true);
        try {
            const result = await generateLessonPlan({ topic, duration, objective });
            // For now, just show a success toast with the generated title.
            // In a real app, you'd add the lesson to your state/DB.
            toast({
                title: "Lesson Plan Generated!",
                description: `Successfully created plan for: ${result.lessonTitle}`,
            });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to generate lesson plan.", variant: "destructive" });
        } finally {
            setIsGenerating(false);
        }
    }


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl md:text-4xl">My Classroom</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Lesson
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Lesson</DialogTitle>
              <DialogDescription>
                You can create a lesson manually or let our AI help you generate a complete lesson plan.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleGenerateLesson}>
                <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="topic" className="text-right">Topic</Label>
                    <Input id="topic" name="topic" placeholder="e.g., Photosynthesis" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="duration" className="text-right">Duration</Label>
                    <Input id="duration" name="duration" placeholder="e.g., 45 minutes" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="objective" className="text-right">Objective</Label>
                    <Textarea id="objective" name="objective" placeholder="What will students learn?" className="col-span-3" />
                </div>
                </div>
                <DialogFooter>
                <Button type="button" variant="outline">Create Manually</Button>
                <Button type="submit" disabled={isGenerating}>
                    <Bot className="mr-2 h-4 w-4" /> {isGenerating ? 'Generating...' : 'Generate with AI'}
                </Button>
                </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Class Lessons & Materials</CardTitle>
            <CardDescription>All the notes, quizzes, and assignments for your class.</CardDescription>
          </CardHeader>
          <CardContent>
             <ul className="space-y-3">
                {lessons.map((lesson, index) => (
                    <li key={index} className="flex items-center justify-between rounded-md border p-3">
                        <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <span className="font-medium">{lesson.title}</span>
                        </div>
                        <span className="text-sm capitalize text-muted-foreground">{lesson.type}</span>
                    </li>
                ))}
             </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>{students.length} students enrolled</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
                {students.map((student, index) => (
                    <li key={index} className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                            <span className="font-bold text-primary">{student.name.charAt(0)}</span>
                        </div>
                        <div className="flex-grow">
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">Progress: {student.progress}%</p>
                        </div>
                    </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
