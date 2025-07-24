
'use client';
import { useState, useEffect } from 'react';
import { generateLearningPath, GenerateLearningPathOutput } from '@/ai/flows/generate-learning-path';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, TrendingUp, CheckCircle, Book, Video, FileText, Calendar, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function LearningPathPage() {
  const [goal, setGoal] = useState('');
  const [weakTopics, setWeakTopics] = useState('');
  const [learningPlan, setLearningPlan] = useState<GenerateLearningPathOutput | null>(null);
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

  const handleGeneratePlan = async () => {
    if (!goal.trim() || !weakTopics.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your goal and weak topics.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setLearningPlan(null);

    try {
      const result = await generateLearningPath({
        goal,
        weakTopics: weakTopics.split(',').map(topic => topic.trim()),
        apiKey: apiKey || undefined,
      });
      setLearningPlan(result);
    } catch (error) {
      console.error('Error generating learning path:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate a learning plan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getIconForStep = (type: string) => {
    switch (type) {
        case 'study_chapter': return <Book className="h-5 w-5 text-primary" />;
        case 'watch_video': return <Video className="h-5 w-5 text-primary" />;
        case 'take_test': return <FileText className="h-5 w-5 text-primary" />;
        default: return <CheckCircle className="h-5 w-5 text-primary" />;
    }
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-3xl md:text-4xl">Personalized Learning Path</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
            <Card>
            <CardHeader>
                <CardTitle>Create Your Plan</CardTitle>
                <CardDescription>Tell the AI about your goals and weaknesses to generate a custom study plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="goal">Your Goal</label>
                    <Input
                        id="goal"
                        placeholder="e.g., Ace my Final Physics Exam"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        disabled={isLoading}
                    />
                </div>
                <div className="space-y-2">
                     <label htmlFor="weak-topics">Weak Topics</label>
                    <Textarea
                        id="weak-topics"
                        placeholder="e.g., Thermodynamics, Optics, Quantum Mechanics"
                        value={weakTopics}
                        onChange={(e) => setWeakTopics(e.target.value)}
                        disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">Separate topics with a comma.</p>
                </div>
                 <Button onClick={handleGeneratePlan} disabled={isLoading} className="w-full">
                    {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Plan...
                    </>
                    ) : (
                    'Generate AI Learning Path'
                    )}
                </Button>
            </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Flame /> Your Streak</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-4xl font-bold">5 Days</p>
                    <p className="text-muted-foreground">Keep up the great work!</p>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2">
            <Card className="min-h-[60vh]">
                 <CardHeader>
                    <CardTitle>Your AI-Generated Plan</CardTitle>
                    <CardDescription>Follow these steps to achieve your learning goal.</CardDescription>
                </CardHeader>
                <CardContent>
                    {learningPlan ? (
                        <div className="space-y-6">
                            <div>
                               <h3 className="font-semibold mb-2 flex items-center gap-2"><TrendingUp /> Learning Steps</h3>
                               <ul className="space-y-4">
                                 {learningPlan.learningSteps.map((step, index) => (
                                     <li key={index} className="flex items-start gap-4 p-3 border rounded-lg">
                                        <div className="mt-1">{getIconForStep(step.type)}</div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-center">
                                                <p className="font-medium">{step.topic}</p>
                                                <Badge variant="secondary" className="capitalize">{step.type.replace('_', ' ')}</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">{step.rationale}</p>
                                            {step.resource && <p className="text-xs mt-2">Resource: <span className="font-semibold">{step.resource}</span></p>}
                                        </div>
                                     </li>
                                 ))}
                               </ul>
                            </div>
                             <div>
                               <h3 className="font-semibold mb-2 flex items-center gap-2"><Calendar /> Daily Routine Suggestion</h3>
                               <p className="text-sm text-muted-foreground whitespace-pre-wrap">{learningPlan.dailyRoutine}</p>
                            </div>
                        </div>
                    ): (
                         <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                            <TrendingUp className="h-16 w-16 mb-4" />
                            <p className="text-lg font-medium">Your plan will appear here.</p>
                            <p>Fill in your details and let AI guide your learning journey!</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>

    </main>
  );
}
