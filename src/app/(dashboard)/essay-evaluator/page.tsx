
'use client';
import { useState, useEffect } from 'react';
import { evaluateEssay, EvaluateEssayOutput } from '@/ai/flows/evaluate-essay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileSignature, Sparkles, CheckCircle, BarChart, BrainCircuit, Lightbulb, MessageSquareQuote } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function EssayEvaluatorPage() {
  const [essayText, setEssayText] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluateEssayOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
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


  const handleEvaluate = async () => {
    if (!essayText.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an essay to evaluate.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setEvaluation(null);

    try {
      const result = await evaluateEssay({ essayText, apiKey: apiKey || undefined });
      setEvaluation(result);
    } catch (error) {
      console.error('Error evaluating essay:', error);
      toast({
        title: 'Error',
        description: 'Failed to evaluate the essay. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-3xl md:text-4xl">AI Essay Evaluator</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Submit Your Essay</CardTitle>
            <CardDescription>Paste your essay below and get instant, detailed feedback from our AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Write or paste your essay here..."
              className="min-h-[40vh] text-base"
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              disabled={isLoading}
            />
            <Button onClick={handleEvaluate} disabled={isLoading} className="mt-4 w-full">
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Evaluating...</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" /> Evaluate My Essay</>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 min-h-[60vh]">
          <CardHeader>
            <CardTitle>Evaluation Results</CardTitle>
            <CardDescription>Your AI-powered feedback will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                <Loader2 className="h-16 w-16 mb-4 animate-spin" />
                <p className="text-lg font-medium">Analyzing your essay...</p>
                <p>Our AI is checking for grammar, structure, and creativity.</p>
              </div>
            )}
            {evaluation ? (
              <div className="space-y-6">
                <div>
                  <div className="text-center mb-4">
                      <p className="text-lg text-muted-foreground">Overall Score</p>
                      <p className="text-6xl font-bold text-primary">{evaluation.score}</p>
                  </div>
                  <Progress value={evaluation.score} className="w-full" />
                </div>
                
                <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Detailed Feedback</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                       <FeedbackCard icon={<CheckCircle />} title="Grammar & Spelling" content={evaluation.feedback.grammar} />
                       <FeedbackCard icon={<BarChart />} title="Structure & Organization" content={evaluation.feedback.structure} />
                       <FeedbackCard icon={<BrainCircuit />} title="Creativity & Originality" content={evaluation.feedback.creativity} />
                       <FeedbackCard icon={<Lightbulb />} title="Logic & Clarity" content={evaluation.feedback.logic} />
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>Improvement Tips</AccordionTrigger>
                    <AccordionContent>
                       <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                         {evaluation.improvementTips.map((tip, i) => <li key={i}>{tip}</li>)}
                       </ul>
                    </AccordionContent>
                  </AccordionItem>
                   <AccordionItem value="item-3">
                    <AccordionTrigger>A-Grade Sample Essay</AccordionTrigger>
                    <AccordionContent>
                       <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-md bg-secondary/50 text-sm">
                         <p className="whitespace-pre-wrap">{evaluation.sampleEssay}</p>
                       </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>


              </div>
            ) : (
              !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                  <FileSignature className="h-16 w-16 mb-4" />
                  <p className="text-lg font-medium">Ready for feedback?</p>
                  <p>Submit your essay to see a detailed evaluation.</p>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

const FeedbackCard = ({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) => (
    <div className="flex items-start gap-3 rounded-md border p-3">
        <div className="text-primary mt-1">{icon}</div>
        <div>
            <h4 className="font-semibold text-sm">{title}</h4>
            <p className="text-sm text-muted-foreground">{content}</p>
        </div>
    </div>
)
