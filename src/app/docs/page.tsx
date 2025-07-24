
import type { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const metadata: Metadata = {
    title: "Documentation - EduGenius",
    description: "Learn how to use EduGenius with our official documentation. Find guides on using the AI tutor, test generator, and other features.",
};

const guides = [
    {
        id: 'getting-started',
        title: 'Getting Started',
        content: 'Welcome to EduGenius! To get started, create a free account. Once logged in, navigate to the API Settings page from the sidebar and enter your own Google Gemini API key. You can get a free key from Google AI Studio. This is required to use all the AI features. After saving your key, you can explore all the tools from the sidebar!'
    },
    {
        id: 'ai-tutor',
        title: 'How to use the AI Tutor?',
        content: 'Navigate to the AI Tutor page. Enter the subject or topic you have a question about in the "Topic" field. Then, type your specific question in the text area below and click "Ask". The AI will provide a detailed answer.'
    },
    {
        id: 'test-generator',
        title: 'How does the Test Generator work?',
        content: 'On the Test Generator page, fill in the form with details like curriculum, subject, topic, difficulty, and number of questions. Choose between "Practice" mode (shows answers) or "Exam" mode (grades you at the end). For exam mode, you can also enable AI proctoring, which uses your webcam to monitor for potential cheating.'
    },
    {
        id: 'essay-evaluator',
        title: 'How to use the Essay Evaluator?',
        content: 'Paste your essay into the text area on the Essay Evaluator page and click "Evaluate My Essay". The AI will give you a score out of 100, detailed feedback on grammar, structure, creativity, and logic, and even provide an improved sample essay for you to learn from.'
    }
]

export default function DocsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container px-4 md:px-6 py-12">
        <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <h1 className="text-4xl font-headline md:text-5xl">Documentation</h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Find everything you need to know about using EduGenius.
            </p>
        </div>
        
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Quick guides to our most popular features.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {guides.map((guide) => (
                        <AccordionItem value={guide.id} key={guide.id}>
                            <AccordionTrigger>{guide.title}</AccordionTrigger>
                            <AccordionContent>
                               {guide.content}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>

      </main>
       <footer className="py-6 text-center text-sm text-primary/60 border-t">
        <p>© {new Date().getFullYear()} EduGenius. All rights reserved.</p>
      </footer>
    </div>
  );
}
