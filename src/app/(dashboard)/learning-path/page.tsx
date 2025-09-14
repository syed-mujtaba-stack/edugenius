'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LearningPathGenerator } from '@/components/ai/LearningPathGenerator';
import { Video, FileText, CheckCircle, BookOpen, Award } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModuleNotes } from '@/components/notes/ModuleNotes';
import { ModuleQuiz } from '@/components/quizzes/ModuleQuiz';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateLearningPath } from '@/ai/flows/generate-learning-path';

interface LearningPathOutput {
  modules: Array<{
    title: string;
    description: string;
    duration: string;
    resources: Array<{
      title: string;
      type: 'video' | 'article' | 'exercise' | 'project';
      url: string;
      duration: string;
      description?: string;
    }>;
    exercises: string[];
  }>;
}

export default function LearningPathPage() {
  const [user, loading] = useAuthState(auth);
  const [goal, setGoal] = useState('');
  const [weakTopics, setWeakTopics] = useState('');
  const [learningPlan, setLearningPlan] = useState<LearningPathOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState('resources');
  const [quizCompleted, setQuizCompleted] = useState(false);
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
        weakTopics: weakTopics.split(',').map(topic => topic.trim()).filter(Boolean),
        apiKey: apiKey || undefined,
      });
      
      // Transform the result to match our LearningPathOutput type
      const transformedPlan: LearningPathOutput = {
        modules: (result.learningSteps || []).map((step: any, index: number) => ({
          title: step.topic || `Step ${index + 1}`,
          description: step.rationale || '',
          duration: '1 day',
          resources: [{
            title: step.topic || 'Resource',
            type: step.type === 'watch_video' ? 'video' : 'article',
            url: step.resource || '#',
            duration: '15 min',
            description: step.rationale
          }],
          exercises: step.type === 'take_test' ? [step.topic] : []
        }))
      };
      
      setLearningPlan(transformedPlan);
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
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'article':
        return <FileText className="h-4 w-4" />;
      case 'exercise':
      case 'project':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
        <p className="text-muted-foreground mb-6">Please sign in to access your personalized learning path.</p>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                To generate personalized learning paths, please add your Gemini API key in the{' '}
                <a href="/dashboard/settings" className="font-medium underline text-yellow-700 hover:text-yellow-600">
                  settings
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Your Learning Path</h1>
      
      <LearningPathGenerator 
        goal={goal}
        weakTopics={weakTopics}
        apiKey={apiKey}
        learningPlan={learningPlan}
        isLoading={isLoading}
        handleGeneratePlan={handleGeneratePlan}
        getIconForStep={getIconForStep}
      />
      
      {learningPlan && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Your Learning Modules</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {/* Module List */}
            <div className="space-y-2 md:col-span-1">
              {learningPlan.modules.map((module, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedModule === index 
                      ? 'bg-primary/10 border-l-4 border-primary' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedModule(index)}
                >
                  <h3 className="font-medium">{module.title}</h3>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>
              ))}
            </div>
            
            {/* Module Details */}
            {selectedModule !== null && (
              <div className="md:col-span-3 space-y-4">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 max-w-md">
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                    <TabsTrigger value="quiz" className="relative">
                      Quiz
                      {quizCompleted && (
                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500"></span>
                      )}
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="resources" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-primary" />
                          <CardTitle>{learningPlan.modules[selectedModule].title}</CardTitle>
                        </div>
                        <CardDescription>
                          {learningPlan.modules[selectedModule].description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h4 className="font-medium mb-3">Learning Resources</h4>
                          <div className="space-y-3">
                            {learningPlan.modules[selectedModule].resources.map((resource, i) => (
                              <div key={i} className="flex items-start p-3 rounded-lg hover:bg-muted/50">
                                <div className="p-2 rounded-full bg-primary/10 mr-3 mt-1">
                                  {getIconForStep(resource.type)}
                                </div>
                                <div>
                                  <a 
                                    href={resource.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="font-medium hover:underline flex items-center gap-1"
                                  >
                                    {resource.title}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                      <polyline points="15 3 21 3 21 9"></polyline>
                                      <line x1="10" y1="14" x2="21" y2="3"></line>
                                    </svg>
                                  </a>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {resource.duration} • {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                                  </p>
                                  {resource.description && (
                                    <p className="text-sm mt-2 text-muted-foreground">
                                      {resource.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {learningPlan.modules[selectedModule].exercises.length > 0 && (
                          <div className="border-t pt-4">
                            <h4 className="font-medium mb-3">Practice Exercises</h4>
                            <ul className="space-y-2">
                              {learningPlan.modules[selectedModule].exercises.map((exercise, i) => (
                                <li key={i} className="flex items-start">
                                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span>{exercise}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="notes">
                    <ModuleNotes 
                      moduleId={`module-${selectedModule}`}
                      moduleTitle={learningPlan.modules[selectedModule].title}
                    />
                  </TabsContent>
                  
                  <TabsContent value="quiz">
                    <ModuleQuiz 
                      moduleId={`module-${selectedModule}`}
                      moduleTitle={learningPlan.modules[selectedModule].title}
                      onComplete={() => setQuizCompleted(true)}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
