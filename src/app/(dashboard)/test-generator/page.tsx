'use client';
import { useState, useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createTest, CreateTestOutput } from '@/ai/flows/create-test';
import { gradeAnswers, GradeAnswersOutput } from '@/ai/flows/grade-answers-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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
import { Download, Loader2, AlertTriangle, FileDown, Camera } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import jsPDF from 'jspdf';


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
    .max(10, 'Cannot exceed 10 questions for now.'),
  questionType: z.enum(['mcq', 'short', 'long']),
  testMode: z.enum(['practice', 'exam']),
  proctoringEnabled: z.boolean().default(false),
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

type Question = {
    question: string;
    answer: string;
    options?: string[];
};

export default function TestGeneratorPage() {
  const [testResult, setTestResult] = useState<CreateTestOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [gradingResult, setGradingResult] = useState<GradeAnswersOutput | null>(null);
  const [cheatingAlerts, setCheatingAlerts] = useState(0);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const testContentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchApiKey = () => {
      const storedKey = localStorage.getItem('user-gemini-api-key');
      setApiKey(storedKey);
    };

    fetchApiKey();
    window.addEventListener('apiKeyUpdated', fetchApiKey);

    return () => {
      window.removeEventListener('apiKeyUpdated', fetchApiKey);
    };
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      curriculumLevel: '',
      board: '',
      medium: 'english',
      subject: '',
      topic: '',
      difficultyLevel: 'medium',
      numberOfQuestions: 5,
      questionType: 'mcq',
      testMode: 'practice',
      proctoringEnabled: false,
    },
  });

  const examForm = useForm<{ answers: { value: string }[] }>({
    defaultValues: {
      answers: [],
    },
  });

  const testMode = form.watch('testMode');
  const proctoringEnabled = form.watch('proctoringEnabled');

  useEffect(() => {
    if (testMode !== 'exam' || !proctoringEnabled || !testResult || gradingResult) return;
    
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use proctoring.',
        });
      }
    };

    getCameraPermission();

    // Cleanup function to stop video stream
    return () => {
        if(videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [testMode, proctoringEnabled, testResult, gradingResult, toast]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && testResult && form.getValues('testMode') === 'exam' && !gradingResult) {
        setCheatingAlerts(prev => prev + 1);
        toast({
          title: 'Warning: Tab Switch Detected',
          description: `You have switched tabs ${cheatingAlerts + 1} time(s). This is not allowed during an exam.`,
          variant: 'destructive',
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [testResult, gradingResult, form, toast, cheatingAlerts]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setTestResult(null);
    setGradingResult(null);
    setCheatingAlerts(0);
    setHasCameraPermission(null);
    examForm.reset({ answers: [] });
    
    try {
      const result = await createTest({...values, apiKey: apiKey || undefined});
      setTestResult(result);
      const questionCount = (result.mcqs?.length || 0) + (result.shortQuestions?.length || 0) + (result.longQuestions?.length || 0);
      if (questionCount > 0) {
        examForm.reset({ answers: Array(questionCount).fill({ value: '' }) });
      } else {
        toast({
            title: "No Questions Generated",
            description: "The AI didn't generate any questions for the given parameters. Please try again with a different topic or settings.",
            variant: "destructive"
        })
      }
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

  const allQuestions: Question[] = [
    ...(testResult?.mcqs || []),
    ...(testResult?.shortQuestions || []),
    ...(testResult?.longQuestions || [])
  ];

  async function onExamSubmit(data: { answers: { value: string }[] }) {
    setIsGrading(true);
    const answersToGrade = allQuestions.map((q, i) => ({
      question: q.question,
      correctAnswer: q.answer,
      studentAnswer: data.answers[i].value,
    }));

    try {
      // Add number of cheating alerts to the prompt for grading
      const result = await gradeAnswers({ answers: answersToGrade });
      let cheatingAnalysis = result.cheatingAnalysis;
      if (cheatingAlerts > 0) {
        cheatingAnalysis += ` The student also switched tabs ${cheatingAlerts} time(s) during the exam.`;
      }
      setGradingResult({ ...result, cheatingAnalysis });

    } catch (error)
 {
      console.error('Error grading test:', error);
      toast({
        title: 'Grading Failed',
        description: 'The AI failed to grade your test. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGrading(false);
    }
  }
  
  const handleExportToPdf = () => {
    if (!testContentRef.current) return;
    const doc = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
    doc.html(testContentRef.current, {
      async callback(doc) {
        doc.save('practice-test.pdf');
      },
      margin: [40, 40, 40, 40],
      autoPaging: 'text',
      width: 515,
      windowWidth: testContentRef.current.scrollWidth,
    });
  };

  const selectedLevel = form.watch('curriculumLevel');
  const showBoardSelection = ["Matric (Grade 9-10)", "Intermediate (Grade 11-12)"].includes(selectedLevel);

  const renderPracticeMode = () => (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <CardTitle>Generated Practice Test</CardTitle>
        <Button onClick={handleExportToPdf} variant="outline" size="sm">
            <FileDown className="mr-2 h-4 w-4" />
            Export to PDF
        </Button>
      </CardHeader>
      <CardContent ref={testContentRef} className="prose dark:prose-invert max-w-none">
        {testResult?.mcqs && testResult.mcqs.length > 0 && (
          <>
            <h3>Multiple Choice Questions</h3>
            <Accordion type="single" collapsible className="w-full">
                {testResult.mcqs.map((qa, index) => (
                <AccordionItem value={`mcq-${index}`} key={`mcq-${index}`}>
                    <AccordionTrigger className="text-left">
                    {index + 1}. {qa.question}
                    </AccordionTrigger>
                    <AccordionContent>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        {qa.options.map((opt, i) => (
                        <li key={i} className={opt === qa.answer ? 'font-bold text-primary' : ''}>
                            {opt}
                        </li>
                        ))}
                    </ul>
                    <p className="mt-2"><strong>Correct Answer:</strong> {qa.answer}</p>
                    </AccordionContent>
                </AccordionItem>
                ))}
            </Accordion>
          </>
        )}
        {[
            {title: "Short Questions", questions: testResult?.shortQuestions},
            {title: "Long Questions", questions: testResult?.longQuestions},
        ].map((section, sIndex) => (
            section.questions && section.questions.length > 0 && (
                <div key={sIndex}>
                    <h3 className="mt-6">{section.title}</h3>
                    <Accordion type="single" collapsible className="w-full">
                        {section.questions.map((qa, index) => (
                        <AccordionItem value={`qa-${sIndex}-${index}`} key={`qa-${sIndex}-${index}`}>
                            <AccordionTrigger className="text-left">
                            {index + 1}. {qa.question}
                            </AccordionTrigger>
                            <AccordionContent>
                            <strong>Answer:</strong> {qa.answer}
                            </AccordionContent>
                        </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            )
        ))}
      </CardContent>
    </Card>
  );

  const renderExamMode = () => (
     <Card>
        <CardHeader>
            <CardTitle>Exam Mode</CardTitle>
            <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Cheating Warning</AlertTitle>
                <AlertDescription>
                    Switching tabs during the exam is prohibited. Your activity is being monitored.
                </AlertDescription>
            </Alert>
        </CardHeader>
        <CardContent>
             {gradingResult ? (
                <div className="space-y-6">
                    <div>
                        <CardTitle className="mb-4">Exam Results</CardTitle>
                        <div className="text-center">
                            <p className="text-lg text-muted-foreground">Your Score</p>
                            <p className="text-6xl font-bold text-primary">{gradingResult.score}%</p>
                        </div>
                        <Progress value={gradingResult.score} className="mt-4" />
                         <Alert className="mt-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>AI Cheating Analysis</AlertTitle>
                            <AlertDescription>
                                {gradingResult.cheatingAnalysis}
                            </AlertDescription>
                        </Alert>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-2">Detailed Feedback</h3>
                        <Accordion type="single" collapsible className="w-full">
                            {gradingResult.results.map((res, index) => (
                                <AccordionItem value={`res-${index}`} key={`res-${index}`}>
                                <AccordionTrigger className={`text-left ${res.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                                    {index + 1}. {res.question}
                                </AccordionTrigger>
                                <AccordionContent className="space-y-2">
                                    <p><strong>Your Answer:</strong> {examForm.getValues(`answers.${index}.value`)}</p>
                                    <p><strong>Feedback:</strong> {res.feedback}</p>
                                </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
             ) : (
                <>
                {proctoringEnabled && (
                    <Card className="mb-6">
                        <CardHeader><CardTitle className="flex items-center gap-2"><Camera /> AI Proctoring</CardTitle></CardHeader>
                        <CardContent>
                             <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted />
                             {hasCameraPermission === false && (
                                <Alert variant="destructive" className="mt-2">
                                    <AlertTitle>Camera Access Required</AlertTitle>
                                    <AlertDescription>Please allow camera access to use proctoring.</AlertDescription>
                                </Alert>
                             )}
                        </CardContent>
                    </Card>
                )}
                <Form {...examForm}>
                    <form onSubmit={examForm.handleSubmit(onExamSubmit)} className="space-y-8">
                        {allQuestions.map((q, index) => (
                            <FormField
                            key={index}
                            control={examForm.control}
                            name={`answers.${index}.value`}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>{index + 1}. {q.question}</FormLabel>
                                <FormControl>
                                    {form.getValues('questionType') === 'mcq' && q.options ? (
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="space-y-1"
                                    >
                                        {q.options.map((option, optIndex) => (
                                            <FormItem className="flex items-center space-x-3 space-y-0" key={optIndex}>
                                                <FormControl>
                                                <RadioGroupItem value={option} />
                                                </FormControl>
                                                <FormLabel className="font-normal">{option}</FormLabel>
                                            </FormItem>
                                        ))}
                                    </RadioGroup>
                                    ) : (
                                    <Textarea placeholder="Type your answer here..." {...field} />
                                    )}
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        ))}
                        <Button type="submit" disabled={isGrading} className="w-full">
                            {isGrading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Grading...</>) : ('Submit for Grading')}
                        </Button>
                    </form>
                </Form>
                </>
             )}
        </CardContent>
     </Card>
  );

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-3xl md:text-4xl">AI Test Generator</h1>
      </div>
      <div className="grid gap-6">
        {!testResult && (
            <Card>
            <CardHeader>
                <CardTitle>Create a New Test</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name="curriculumLevel"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Curriculum Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select a level" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>{curriculumLevels.map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}</SelectContent>
                            </Select><FormMessage />
                        </FormItem>
                        )}
                    />
                    {showBoardSelection && (
                        <FormField control={form.control} name="board"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Board</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select a board" /></SelectTrigger></FormControl>
                                <SelectContent>{boards.map(board => <SelectItem key={board} value={board}>{board}</SelectItem>)}</SelectContent>
                            </Select><FormMessage />
                            </FormItem>
                        )}
                        />
                    )}
                    <FormField control={form.control} name="subject"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl><Input placeholder="e.g., Biology, Python" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField control={form.control} name="topic"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Topic</FormLabel>
                            <FormControl><Input placeholder="e.g., Cell Structure, Data Types" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField control={form.control} name="difficultyLevel"
                        render={({ field }) => (
                        <FormItem><FormLabel>Difficulty</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                            </Select><FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="questionType"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Question Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="mcq">MCQ</SelectItem>
                                <SelectItem value="short">Short Answer</SelectItem>
                                <SelectItem value="long">Long Answer</SelectItem>
                            </SelectContent>
                            </Select><FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField control={form.control} name="numberOfQuestions"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Number of Questions</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField control={form.control} name="medium" render={({ field }) => (
                        <FormItem className="space-y-3"><FormLabel>Medium</FormLabel>
                            <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="english" /></FormControl><FormLabel className="font-normal">English</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="urdu" /></FormControl><FormLabel className="font-normal">Urdu</FormLabel></FormItem>
                            </RadioGroup>
                            </FormControl><FormMessage />
                        </FormItem>
                        )}
                    />
                    <div className="space-y-3">
                        <FormField control={form.control} name="testMode" render={({ field }) => (
                            <FormItem><FormLabel>Mode</FormLabel>
                            <FormControl>
                                <RadioGroup onValueChange={(value) => {field.onChange(value); if(value === 'practice') {form.setValue('proctoringEnabled', false)}}} defaultValue={field.value} className="flex space-x-4">
                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="practice" /></FormControl><FormLabel className="font-normal">Practice</FormLabel></FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="exam" /></FormControl><FormLabel className="font-normal">Exam</FormLabel></FormItem>
                                </RadioGroup>
                            </FormControl><FormMessage />
                            </FormItem>
                        )}
                        />
                        {testMode === 'exam' && (
                            <FormField
                                control={form.control}
                                name="proctoringEnabled"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        <div className="space-y-0.5">
                                            <FormLabel>AI Proctoring</FormLabel>
                                            <p className="text-xs text-muted-foreground">Enable webcam to monitor test.</p>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating Test...</>) : ('Generate Test')}
                    </Button>
                </form>
                </Form>
            </CardContent>
            </Card>
        )}


        {isLoading && (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4 text-lg">AI is generating your test, please wait...</p>
            </div>
        )}

        {testResult && allQuestions.length > 0 && (
            <>
                <div className="flex justify-end">
                    <Button variant="outline" onClick={() => { setTestResult(null); setGradingResult(null); form.reset(form.getValues()); }}>
                        Create New Test
                    </Button>
                </div>
                {form.getValues('testMode') === 'practice' ? renderPracticeMode() : renderExamMode()}
            </>
        )}
      </div>
    </main>
  );
}
