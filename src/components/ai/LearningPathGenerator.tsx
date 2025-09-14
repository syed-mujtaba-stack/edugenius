'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import { Slider } from '../ui/slider';
import { Book, CheckCircle, FileText, Video, Clock, Loader2 } from 'lucide-react';

type LearningStyle = 'visual' | 'auditory' | 'reading' | 'kinesthetic';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

type Resource = {
  title: string;
  type: 'video' | 'article' | 'exercise' | 'project';
  url: string;
  duration: string;
};

type Module = {
  title: string;
  description: string;
  duration: string;
  resources: Resource[];
  exercises: string[];
};

type LearningPath = {
  modules: Module[];
};

interface LearningPathGeneratorProps {
  goal?: string;
  weakTopics?: string;
  learningPlan?: any;
  isLoading?: boolean;
  apiKey?: string | null;
  handleGeneratePlan?: () => Promise<void>;
  getIconForStep?: (type: string) => React.ReactNode;
}

export function LearningPathGenerator({
  goal: propGoal = '',
  weakTopics: propWeakTopics = '',
  learningPlan: propLearningPlan = null,
  isLoading: propIsLoading = false,
  apiKey = null,
  handleGeneratePlan: propHandleGeneratePlan,
  getIconForStep: propGetIconForStep
}: LearningPathGeneratorProps) {
  const [learningStyle, setLearningStyle] = useState<LearningStyle>('visual');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [topics, setTopics] = useState(propWeakTopics || '');
  const [goal, setGoal] = useState(propGoal || '');
  const [timeCommitment, setTimeCommitment] = useState(5);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(propLearningPlan);
  const [isLoading, setIsLoading] = useState(propIsLoading);
  const [progress, setProgress] = useState(0);
  const [isControlled] = useState(propHandleGeneratePlan !== undefined);

  const generateLearningPath = async () => {
    if (isControlled && propHandleGeneratePlan) {
      return propHandleGeneratePlan();
    }

    setIsLoading(true);
    setProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const response = await fetch('/api/ai/generate-learning-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey && { 'Authorization': `Bearer ${apiKey}` })
        },
        body: JSON.stringify({
          learningStyle,
          difficulty,
          topics: topics.split(',').map(t => t.trim()).filter(Boolean),
          timeCommitment,
          goal
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate learning path');
      }

      const data = await response.json();
      setLearningPath(data);
      setProgress(100);
    } catch (error) {
      console.error('Error generating learning path:', error);
      throw error; // Re-throw to allow parent component to handle the error
    } finally {
      setIsLoading(false);
      clearInterval(interval);
    }
  };

  useEffect(() => {
    if (propLearningPlan) {
      setLearningPath(propLearningPlan);
    }
  }, [propLearningPlan]);

  useEffect(() => {
    setIsLoading(propIsLoading);
  }, [propIsLoading]);

  const getIconForStep = (type: string) => {
    if (propGetIconForStep) return propGetIconForStep(type);
    
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'article':
        return <FileText className="w-4 h-4" />;
      case 'exercise':
        return <CheckCircle className="w-4 h-4" />;
      case 'project':
        return <Book className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Personalized Learning Path Generator</CardTitle>
        <CardDescription>
          Get a customized learning path based on your preferences and goals.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="goal">Learning Goal</Label>
          <Input
            id="goal"
            placeholder="What do you want to learn?"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            disabled={isLoading || isControlled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="topics">Topics to Focus On (comma-separated)</Label>
          <Input
            id="topics"
            placeholder="e.g., machine learning, react, data structures"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            disabled={isLoading || isControlled}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="learning-style">Learning Style</Label>
            <Select 
              value={learningStyle} 
              onValueChange={(v) => setLearningStyle(v as LearningStyle)}
              disabled={isLoading || isControlled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select learning style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visual">Visual</SelectItem>
                <SelectItem value="auditory">Auditory</SelectItem>
                <SelectItem value="reading">Reading/Writing</SelectItem>
                <SelectItem value="kinesthetic">Kinesthetic</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select 
              value={difficulty} 
              onValueChange={(v) => setDifficulty(v as Difficulty)}
              disabled={isLoading || isControlled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <Label htmlFor="time-commitment">Weekly Time Commitment: {timeCommitment} hours</Label>
            <span className="text-sm text-muted-foreground">
              {timeCommitment < 3 ? 'Casual' : timeCommitment < 8 ? 'Moderate' : 'Intensive'}
            </span>
          </div>
          <Slider
            id="time-commitment"
            min={1}
            max={20}
            step={1}
            value={[timeCommitment]}
            onValueChange={([value]) => setTimeCommitment(value)}
            className="py-4"
            disabled={isLoading || isControlled}
          />
        </div>

        <Button 
          onClick={generateLearningPath} 
          disabled={isLoading || (!isControlled && (!topics.trim() || !goal.trim()))}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Learning Path'
          )}
        </Button>

        {(isLoading || propIsLoading) && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Creating your personalized learning path...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {learningPath && !isLoading && !propIsLoading && (
          <div className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Your Learning Path</h3>
              <div className="text-sm text-muted-foreground">
                {learningPath.modules?.length} weeks • {learningPath.modules?.reduce((total: number, module: any) => total + (module.resources?.length || 0), 0)} resources
              </div>
            </div>
            
            <div className="space-y-6">
              {learningPath.modules?.map((module: any, index: number) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/50 px-6 py-4 border-b">
                    <h4 className="font-semibold text-lg">
                      Week {index + 1}: {module.title || `Module ${index + 1}`}
                    </h4>
                    {module.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {module.description}
                      </p>
                    )}
                    {module.duration && (
                      <div className="mt-2 flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1.5" />
                        <span>{module.duration}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-muted-foreground">Resources</h5>
                      <div className="space-y-2">
                        {module.resources?.map((resource: any, i: number) => (
                          <div 
                            key={i} 
                            className="flex items-start p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                          >
                            <div className="bg-primary/10 p-1.5 rounded-md mr-3 mt-0.5">
                              {getIconForStep(resource.type || 'article')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium text-foreground hover:underline truncate"
                                >
                                  {resource.title}
                                </a>
                                {resource.duration && (
                                  <span className="ml-2 text-xs text-muted-foreground whitespace-nowrap">
                                    {resource.duration}
                                  </span>
                                )}
                              </div>
                              {resource.description && (
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {resource.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {module.exercises?.length > 0 && (
                      <div className="space-y-3 pt-4 border-t">
                        <h5 className="text-sm font-medium text-muted-foreground">Exercises</h5>
                        <ul className="space-y-2">
                          {module.exercises.map((exercise: string, i: number) => (
                            <li key={i} className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                              <span className="text-sm">{exercise}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
