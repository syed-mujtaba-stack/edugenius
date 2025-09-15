'use client';

import { useState, useEffect } from 'react';
import { generateCertificate } from '@/lib/certificate-generator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Loader2, Award, CheckCircle, XCircle, ArrowLeft, ArrowRight, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

type Subject = {
  id: string;
  name: string;
  description: string;
};

type Question = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
};

type QuizResult = {
  score: number;
  total: number;
  passed: boolean;
  correctAnswers: number;
};

const subjects: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    description: 'Test your knowledge in various mathematical concepts',
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Explore questions from physics, chemistry, and biology',
  },
  {
    id: 'history',
    name: 'History',
    description: 'Test your knowledge of historical events and figures',
  },
  {
    id: 'programming',
    name: 'Programming',
    description: 'Challenge yourself with programming concepts and problem-solving',
  },
  {
    id: 'english',
    name: 'English',
    description: 'Test your grammar, vocabulary, and language skills',
  },
  {
    id: 'general_knowledge',
    name: 'General Knowledge',
    description: 'Test your knowledge of various topics',
  },
];



export default function CertificateGenerator() {
    // State management
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [programmingLanguage, setProgrammingLanguage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [quizStarted, setQuizStarted] = useState<boolean>(false);
    const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
    const [result, setResult] = useState<QuizResult | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(1800); // 30 minutes in seconds
    const [timerActive, setTimerActive] = useState<boolean>(false);
    
    const { toast } = useToast();
  
    // Timer effect
    useEffect(() => {
      let interval: NodeJS.Timeout;
      
      if (timerActive && timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft(prev => prev - 1);
        }, 1000);
      } else if (timeLeft === 0 && quizStarted && !quizCompleted) {
        calculateResult(questions);
        setQuizCompleted(true);
        setTimerActive(false);
      }
  
      return () => clearInterval(interval);
    }, [timeLeft, timerActive, quizStarted, quizCompleted, questions]);
  
    // Format time as MM:SS
    const formatTime = (seconds: number): string => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
  
    // Event handlers
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    };

    const handleSubjectChange = (value: string) => {
      setSelectedSubject(value);
      // Reset programming language when subject changes
      if (value !== 'programming') {
        setProgrammingLanguage('');
      }
    };

    const generateQuiz = async () => {
      if (!selectedSubject || !name.trim()) {
        toast({
          title: "Error",
          description: "Please select a subject and enter your name",
          variant: "destructive",
        });
        return;
      }
      
      // Additional validation for programming subject
      if (selectedSubject === 'programming' && !programmingLanguage.trim()) {
        toast({
          title: "Error",
          description: "Please specify a programming language or skill",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      try {
        const subjectName = subjects.find(s => s.id === selectedSubject)?.name || selectedSubject;
        const isProgramming = selectedSubject === 'programming';
        
        // Prepare request body
        const requestBody: any = {
          subject: selectedSubject,
          subjectName: subjectName,
          difficulty: 'medium',
          numberOfQuestions: 10,
        };
        
        // Only add languageOrSkill if it's a programming quiz and language is provided
        if (isProgramming && programmingLanguage) {
          requestBody.languageOrSkill = programmingLanguage;
        }
        
        console.log('Sending request with body:', JSON.stringify(requestBody, null, 2));
        
        // Call the API to generate quiz questions
        const response = await fetch('/api/ai/generate-quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        
        if (!response.ok) {
          console.error('API Error:', data);
          throw new Error(data.error || 'Failed to generate quiz. Please try again.');
        }

        // Use fallback questions if AI generation fails
        const questionsToUse = data.questions || [];
        
        if (questionsToUse.length === 0) {
          throw new Error('No questions were generated');
        }
        
        // Transform questions to match our Question type
        const generatedQuestions: Question[] = questionsToUse.map((q: any, i: number) => ({
          id: `q${i + 1}`,
          question: q.question || `Question ${i + 1} about ${subjectName}`,
          options: q.options || ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
          correctAnswer: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
        }));
        
        setQuestions(generatedQuestions);
        setQuizStarted(true);
        setQuizCompleted(false);
        setCurrentQuestionIndex(0);
        setResult(null);
        setTimeLeft(1800); // 30 minutes in seconds
        setTimerActive(true);
      } catch (error) {
        console.error('Error generating quiz:', error);
        toast({
          title: "Error",
          description: "Failed to generate quiz. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    const handleAnswer = (answerIndex: number) => {
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestionIndex].userAnswer = answerIndex;
      setQuestions(updatedQuestions);
      
      // Move to next question or complete quiz
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        calculateResult(updatedQuestions);
        setQuizCompleted(true);
        setTimerActive(false);
      }
    };
    
    const calculateResult = (answeredQuestions: Question[]) => {
      const correctAnswers = answeredQuestions.filter(
        (q) => q.userAnswer === q.correctAnswer
      ).length;
      const total = answeredQuestions.length;
      const score = Math.round((correctAnswers / total) * 100);
      const passed = score >= 70;
  
      setResult({
        score,
        total,
        passed,
        correctAnswers,
      });
    };
  
    const handleGenerateCertificate = async () => {
      if (!result) return;
      
      try {
        setIsLoading(true);
        
        // Generate the certificate with AI-generated message
        const pdfBlob = await generateCertificate({
          name,
          subject: subjects.find(s => s.id === selectedSubject)?.name || selectedSubject,
          date: new Date().toISOString(),
          score: result.score
        });
        
        // Create a download link for the certificate
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `EduGenius_Certificate_${name.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: 'Success!',
          description: 'Your certificate has been downloaded.',
        });
      } catch (error) {
        console.error('Error generating certificate:', error);
        toast({
          title: 'Error',
          description: 'Failed to generate certificate. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    const resetQuiz = () => {
      setQuizStarted(false);
      setQuizCompleted(false);
      setQuestions([]);
      setCurrentQuestionIndex(0);
      setResult(null);
      setTimeLeft(1800);
      setTimerActive(false);
    };
  
    // Render loading state
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
            <p className="text-lg font-medium">Generating your quiz...</p>
            <p className="text-sm text-muted-foreground">This may take a moment</p>
          </div>
        </div>
      );
    }
  
    // Render quiz in progress
    if (quizStarted && !quizCompleted) {
      const currentQuestion = questions[currentQuestionIndex];
      return (
        <div className="max-w-4xl mx-auto space-y-6 p-4">
          {/* Quiz header with timer */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {subjects.find(s => s.id === selectedSubject)?.name} Quiz
              </h1>
              <p className="text-muted-foreground">
                Complete the quiz to earn your certificate
              </p>
            </div>
            <div className="bg-muted/50 px-4 py-2 rounded-md text-sm font-medium">
              Time Remaining: {formatTime(timeLeft)}
            </div>
          </div>
  
          <Card>
            {/* Quiz progress */}
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
                <div className="text-sm font-medium">
                  {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
                </div>
              </div>
              <Progress 
                value={((currentQuestionIndex + 1) / questions.length) * 100} 
                className="h-2" 
              />
            </CardHeader>
            
            {/* Current question */}
            <CardContent className="pt-6 space-y-6">
              <h2 className="text-xl font-medium">
                {currentQuestion?.question}
              </h2>
              
              <RadioGroup 
                value={currentQuestion?.userAnswer?.toString() || ''}
                onValueChange={(value) => handleAnswer(parseInt(value))}
                className="space-y-3"
              >
                {currentQuestion?.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value={index.toString()} 
                      id={`option-${index}`} 
                    />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="text-base font-normal cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            
            {/* Navigation buttons */}
            <CardFooter className="border-t flex justify-between pt-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              <Button 
                onClick={() => {
                  if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(prev => prev + 1);
                  } else {
                    calculateResult(questions);
                    setQuizCompleted(true);
                    setTimerActive(false);
                  }
                }}
                disabled={typeof currentQuestion?.userAnswer === 'undefined'}
              >
                {currentQuestionIndex === questions.length - 1 ? 'Submit Quiz' : 'Next'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }
  
    // Render quiz results
    if (quizCompleted && result) {
      return (
        <div className="max-w-2xl mx-auto space-y-8 p-4">
          <Card className="border-primary">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                {result.passed ? (
                  <CheckCircle className="h-10 w-10 text-green-500" />
                ) : (
                  <XCircle className="h-10 w-10 text-red-500" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {result.passed ? 'Quiz Completed!' : 'Quiz Completed'}
              </CardTitle>
              <CardDescription>
                {result.passed 
                  ? `Congratulations, ${name}! You've passed the quiz.`
                  : `You scored ${result.score}%. You need 70% to pass.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="space-y-2">
                <div className="text-4xl font-bold">{result.score}%</div>
                <div className="text-muted-foreground">
                  {result.correctAnswers} out of {result.total} questions correct
                </div>
              </div>
              
              {result.passed ? (
                <div className="space-y-4">
                  <Button 
                    size="lg" 
                    className="gap-2"
                    onClick={handleGenerateCertificate}
                  >
                    <Award className="h-5 w-5" />
                    Generate Certificate
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Download your certificate and share your achievement!
                  </p>
                </div>
              ) : (
                <Button 
                  variant="outline"
                  onClick={resetQuiz}
                >
                  Try Again
                </Button>
              )}
            </CardContent>
          </Card>
          
          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={resetQuiz}
            >
              Take Another Quiz
            </Button>
          </div>
        </div>
      );
    }
  
    // Initial form state
    return (
      <div className="max-w-4xl mx-auto space-y-8 p-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Certificate Generator</h1>
          <p className="text-muted-foreground">
            Take a quiz and earn a certificate upon successful completion
          </p>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Start Your Quiz</CardTitle>
            <CardDescription>
              Select a subject and enter your name to begin the quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={handleNameChange}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label>Select Subject</Label>
                <Select onValueChange={handleSubjectChange} value={selectedSubject} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedSubject === 'programming' && (
                <div className="space-y-2">
                  <Label htmlFor="language">Programming Language/Skill</Label>
                  <Input
                    id="language"
                    placeholder="e.g., JavaScript, Python, React, etc."
                    value={programmingLanguage}
                    onChange={(e) => setProgrammingLanguage(e.target.value)}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the specific language or framework you want to be quizzed on
                  </p>
                </div>
              )}
              {selectedSubject && (
                <p className="text-sm text-muted-foreground">
                  {subjects.find(s => s.id === selectedSubject)?.description}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Quiz Details</Label>
              <div className="bg-muted/50 p-4 rounded-md space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Questions:</span>
                  <span className="text-sm font-medium">10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Time Limit:</span>
                  <span className="text-sm font-medium">30 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Passing Score:</span>
                  <span className="text-sm font-medium">70%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Difficulty:</span>
                  <span className="text-sm font-medium">Medium</span>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full mt-2" 
              size="lg"
              onClick={generateQuiz}
              disabled={!selectedSubject || !name.trim() || isLoading}
            >
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }