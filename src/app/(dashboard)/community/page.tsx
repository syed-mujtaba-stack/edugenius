
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PenSquare, MessageCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const discussions = [
  {
    topic: 'Chapter 5: Chemical Reactions',
    user: 'Aisha Ahmed',
    userHandle: 'aisha_ahmed',
    avatar: 'https://placehold.co/40x40.png',
    dataAiHint: 'woman portrait',
    question: 'Can someone explain the difference between synthesis and decomposition reactions with an example?',
    replies: 5,
  },
  {
    topic: 'Python Basics: Loops',
    user: 'Bilal Khan',
    userHandle: 'bilal_k',
    avatar: 'https://placehold.co/40x40.png',
    dataAiHint: 'man portrait',
    question: 'I\'m stuck on a `for` loop problem for my assignment. Can anyone help me debug?',
    replies: 8,
  },
];

const teachers = [
    { name: 'Mr. Javed Ali', subject: 'Physics' },
    { name: 'Ms. Sana Khan', subject: 'Chemistry' },
    { name: 'Mr. Imran Malik', subject: 'Computer Science' },
];

export default function CommunityPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="font-headline text-3xl md:text-4xl">Community Hub</h1>
        <Button className="w-full sm:w-auto">
          <PenSquare className="mr-2 h-4 w-4" /> Start a New Discussion
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Discussions</CardTitle>
              <CardDescription>Join the conversation and help fellow students.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {discussions.map((d, i) => (
                <div key={i} className="border-b pb-4 last:border-b-0">
                  <p className="text-sm font-semibold text-primary">{d.topic}</p>
                  <div className="flex items-start gap-3 mt-2">
                     <Avatar>
                        <AvatarImage src={d.avatar} alt={`@${d.userHandle}`} data-ai-hint={d.dataAiHint} />
                        <AvatarFallback>{d.user.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <p className="font-medium">{d.user} <span className="text-muted-foreground text-sm">@{d.userHandle}</span></p>
                        <p className="mt-1 text-muted-foreground">{d.question}</p>
                         <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <MessageCircle className="h-4 w-4" />
                            <span>{d.replies} replies</span>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ask a Teacher</CardTitle>
              <CardDescription>Get expert help for selected subjects.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Select a teacher/subject" />
                </SelectTrigger>
                <SelectContent>
                    {teachers.map(t => (
                        <SelectItem key={t.name} value={t.name}>
                            {t.name} - {t.subject}
                        </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Textarea placeholder="Type your question for the teacher..." />
              <Button className="w-full">Submit Question</Button>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {['Ali Raza', 'Fatima Sheikh', 'Ahmed Hassan'].map((name, i) => (
                 <div key={i} className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={`https://placehold.co/40x40.png`} alt={name} data-ai-hint="person portrait" />
                        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="font-medium">{name}</p>
                 </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
