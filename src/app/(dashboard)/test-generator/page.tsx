'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createTest, CreateTestOutput } from '@/ai/flows/create-test';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { DownloadButton } from '@/components/download-button';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  curriculumLevel: z.string().min(1, 'Please select a curriculum level.'),
  board: z.string().optional(),
  medium: z.enum(['english', 'urdu']),
  subject: z.string().min(2, 'Subject must be at least 2 characters.'),
  topic: z.string().min(2, 'Topic must be at least 2 characters.'),
  difficultyLevel: z.enum(['easy', 'medium', 'hard']),
  numberOfQuestions: z.coerce
    .number()
    .int()
    .min(1, 'Must have at least 1 question.')
    .max(20, 'Cannot exceed 20 questions.'),
});

const curriculumLevels = [
    "Montessori",
    "Grade 1-8",
    "Matric (Grade 9-10)",
    "Intermediate (Grade 11-12)",
    "A/O Levels",
    "Graduation (BCom, BSc, BA, etc.)",
    "Computer/IT Courses",
];

const boards = [
    "Sindh Board",
    "Punjab Board",
    "Federal Board",
    "KPK Board",
    "Balochistan Board",
];


export default function TestGeneratorPage() {
  const [testResult, setTestResult] = useState<CreateTestOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      curriculumLevel: '',
      board: '',
      medium: 'english',
      subject: '',
      topic: '',
      difficultyLevel: 'medium',
      numberOfQuestions: 10,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setTestResult(null);

    try {
      const result = await createTest(values);
      setTestResult(result);
    } catch (error) {
      console.error('Error creating test:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate test. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const formatTestToText = () => {
    if (!testResult) return '';
    return testResult.testQuestions
      .map((q, i) => `${i + 1}. Question: ${q.question}\n   Answer: ${q.answer}`)
      .join('\n\n');
  };

  const selectedLevel = form.watch('curriculumLevel');
  const showBoardSelection = ["Matric (Grade 9-10)", "Intermediate (Grade 11-12)"].includes(selectedLevel);


  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-3xl md:text-4xl">AI Test Generator</h1>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create a New Test</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="curriculumLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Curriculum Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {curriculumLevels.map(level => (
                                <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {showBoardSelection && (
                    <FormField
                      control={form.control}
                      name="board"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Board</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a board" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                               {boards.map(board => (
                                <SelectItem key={board} value={board}>{board}</SelectItem>
                               ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="medium"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Medium</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="english" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                English
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="urdu" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Urdu
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Biology, Python" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Cell Structure, Data Types" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="difficultyLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Difficulty</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numberOfQuestions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Questions</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Test...
                    </>
                  ) : (
                    'Generate Test'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {testResult && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Generated Test</CardTitle>
              <DownloadButton content={formatTestToText()} filename="practice-test.txt" />
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {testResult.testQuestions.map((qa, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-left">
                      {index + 1}. {qa.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <strong>Answer:</strong> {qa.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
