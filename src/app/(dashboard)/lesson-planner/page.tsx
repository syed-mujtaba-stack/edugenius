
'use client';
import { useState, useEffect } from 'react';
import { generateLessonPlan, GenerateLessonPlanOutput } from '@/ai/flows/generate-lesson-plan';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BookCopy, Sparkles, Clock, ListChecks, Target } from 'lucide-react';

export default function LessonPlannerPage() {
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('');
  const [objective, setObjective] = useState('');
  const [lessonPlan, setLessonPlan] = useState<GenerateLessonPlanOutput | null>(null);
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
    if (!topic.trim() || !duration.trim() || !objective.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill out all fields to generate a lesson plan.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setLessonPlan(null);

    try {
      const result = await generateLessonPlan({
        topic,
        duration,
        objective,
        apiKey: apiKey || undefined,
      });
      setLessonPlan(result);
    } catch (error) {
      console.error('Error generating lesson plan:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate the lesson plan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-3xl md:text-4xl">AI Lesson Planner</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create a Lesson Plan</CardTitle>
              <CardDescription>An exclusive tool for teachers to instantly generate comprehensive lesson plans.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="topic">Topic</label>
                <Input
                  id="topic"
                  placeholder="e.g., Photosynthesis"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="duration">Lesson Duration</label>
                <Input
                  id="duration"
                  placeholder="e.g., 45 minutes"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="objective">Learning Objective</label>
                <Textarea
                  id="objective"
                  placeholder="e.g., Students will be able to explain the process of photosynthesis."
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button onClick={handleGeneratePlan} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Plan...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Generate Lesson Plan</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="min-h-[70vh]">
            <CardHeader>
              <CardTitle>Your Generated Lesson Plan</CardTitle>
              <CardDescription>A structured plan complete with modules, activities, and assessment strategies.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                 <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                    <Loader2 className="h-16 w-16 mb-4 animate-spin" />
                    <p className="text-lg font-medium">Crafting your lesson plan...</p>
                    <p>Our AI is designing the perfect structure for your class!</p>
                </div>
              )}
              {lessonPlan ? (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold font-headline text-primary">{lessonPlan.lessonTitle}</h2>
                    <div className="space-y-4">
                        {lessonPlan.modules.map((module, index) => (
                           <div key={index} className="p-4 border rounded-lg">
                               <h3 className="font-semibold flex items-center gap-2"><ListChecks /> {module.title}</h3>
                               <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1"><Clock className="h-4 w-4" /> Est. Duration: {module.duration}</p>
                               <div className="mt-3">
                                   <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Activities</h4>
                                   <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                                     {module.activities.map((activity, i) => <li key={i}>{activity}</li>)}
                                   </ul>
                               </div>
                           </div>
                        ))}
                    </div>
                     <div className="p-4 border rounded-lg bg-secondary/50">
                        <h3 className="font-semibold flex items-center gap-2"><Target /> Assessment Suggestion</h3>
                        <p className="text-sm text-muted-foreground mt-2">{lessonPlan.assessment}</p>
                     </div>
                </div>
              ) : (
                !isLoading && (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                    <BookCopy className="h-16 w-16 mb-4" />
                    <p className="text-lg font-medium">Your generated lesson plan will appear here.</p>
                    <p>Fill in the details to start planning your next amazing lesson!</p>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
