
'use client';
import { useState, useEffect } from 'react';
import { generateCareerAdvice, GenerateCareerAdviceOutput } from '@/ai/flows/generate-career-advice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Briefcase, GraduationCap, Sparkles, Lightbulb, Map } from 'lucide-react';

export default function CareerCounselingPage() {
  const [interests, setInterests] = useState('');
  const [strengths, setStrengths] = useState('');
  const [currentEducation, setCurrentEducation] = useState('');
  const [advice, setAdvice] = useState<GenerateCareerAdviceOutput | null>(null);
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

  const handleGenerateAdvice = async () => {
    if (!interests.trim() || !strengths.trim() || !currentEducation.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill out all fields to get advice.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setAdvice(null);

    try {
      const result = await generateCareerAdvice({
        interests: interests.split(',').map(i => i.trim()),
        strengths: strengths.split(',').map(s => s.trim()),
        currentEducation,
        apiKey: apiKey || undefined,
      });
      setAdvice(result);
    } catch (error) {
      console.error('Error generating career advice:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate career advice. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-3xl md:text-4xl">AI Career Counselor</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Find Your Path</CardTitle>
              <CardDescription>Tell us about yourself and let our AI find the best career path for you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="currentEducation">Current Education</label>
                <Input
                  id="currentEducation"
                  placeholder="e.g., Matric Commerce, FSc Pre-Engineering"
                  value={currentEducation}
                  onChange={(e) => setCurrentEducation(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="interests">Your Interests</label>
                <Textarea
                  id="interests"
                  placeholder="e.g., Computers, playing games, sketching"
                  value={interests}
                  onChange={(e) => setInterests(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">Separate with commas.</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="strengths">Your Strengths</label>
                <Textarea
                  id="strengths"
                  placeholder="e.g., Math, problem solving, good communication"
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">Separate with commas.</p>
              </div>
              <Button onClick={handleGenerateAdvice} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Advice...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Get Career Advice</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="min-h-[70vh]">
            <CardHeader>
              <CardTitle>Your AI-Generated Career Plan</CardTitle>
              <CardDescription>Discover career paths tailored to your profile and a roadmap to success.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                 <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                    <Loader2 className="h-16 w-16 mb-4 animate-spin" />
                    <p className="text-lg font-medium">Analyzing your profile...</p>
                    <p>Our AI is crafting the perfect career plan for you!</p>
                </div>
              )}
              {advice ? (
                <div className="space-y-8">
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2"><Lightbulb /> Suggested Career Fields</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {advice.suggestedCareers.map((career, index) => (
                        <Card key={index} className="p-4">
                          <CardTitle className="text-base mb-1">{career.field}</CardTitle>
                          <CardDescription>{career.reason}</CardDescription>
                        </Card>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2"><Map /> Roadmap to Become a {advice.topCareerRoadmap.career}</h3>
                    <div className="relative pl-6">
                        <div className="absolute left-2.5 top-0 h-full w-0.5 bg-primary/20"></div>
                        {advice.topCareerRoadmap.roadmap.map((step, index) => (
                           <div key={index} className="relative mb-6">
                               <div className="absolute -left-[18px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">
                                {step.step}
                               </div>
                               <h4 className="font-bold text-md mb-1 ml-4">{step.title}</h4>
                               <p className="text-sm text-muted-foreground ml-4">{step.description}</p>
                               {step.resources && step.resources.length > 0 && (
                                   <div className="mt-2 ml-4">
                                       <h5 className="text-xs font-semibold">Recommended Resources:</h5>
                                       <ul className="list-disc list-inside text-xs text-muted-foreground">
                                            {step.resources.map((res, i) => <li key={i}>{res}</li>)}
                                       </ul>
                                   </div>
                               )}
                           </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                !isLoading && (
                  <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                    <GraduationCap className="h-16 w-16 mb-4" />
                    <p className="text-lg font-medium">Your personalized career advice will appear here.</p>
                    <p>Fill in your details to unlock your future!</p>
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
