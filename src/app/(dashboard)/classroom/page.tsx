
'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users, FileText } from 'lucide-react';
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
                Fill in the details for your new lesson or assignment.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input id="title" placeholder="e.g., Chapter 5 Quiz" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Input id="type" placeholder="e.g., Quiz, Assignment" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Lesson</Button>
            </DialogFooter>
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
