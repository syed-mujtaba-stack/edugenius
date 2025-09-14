'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LearningPathGenerator } from '@/components/ai/LearningPathGenerator';
import { Video, FileText, CheckCircle } from 'lucide-react';
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
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Personalized Learning Path</h1>
        <p className="text-muted-foreground mt-2">
          Get a customized learning plan tailored to your goals and learning style
        </p>
      </div>
      
      <LearningPathGenerator 
        goal={goal}
        weakTopics={weakTopics}
        learningPlan={learningPlan}
        isLoading={isLoading}
        apiKey={apiKey}
        handleGeneratePlan={handleGeneratePlan}
        getIconForStep={getIconForStep}
      />
    </div>
  );
}
