'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Loader2, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizResult {
  score: number;
  total: number;
  answers: {
    questionId: string;
    isCorrect: boolean;
    selectedAnswer: number;
  }[];
}

const sampleQuestions: Question[] = [
  {
    id: '1',
    question: 'What is the main purpose of React hooks?',
    options: [
      'To handle CSS styling in React',
      'To use state and other React features without writing classes',
      'To create new HTML elements',
      'To manage server-side rendering'
    ],
    correctAnswer: 1,
    explanation: 'React Hooks let you use state and other React features without writing classes.'
  },
  {
    id: '2',
    question: 'Which hook is used to perform side effects in a component?',
    options: [
      'useState',
      'useEffect',
      'useContext',
      'useReducer'
    ],
    correctAnswer: 1,
    explanation: 'The useEffect Hook allows you to perform side effects in function components.'
  }
];

export function ModuleQuiz({ moduleId, moduleTitle, onComplete }: { 
  moduleId: string; 
  moduleTitle: string;
  onComplete?: (result: QuizResult) => void;
}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<QuizResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, fetch questions from your backend based on moduleId
    const fetchQuestions = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setQuestions(sampleQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast({
          title: 'Error',
          description: 'Failed to load quiz questions. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [moduleId, toast]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isAnswerSelected = currentQuestion?.id in selectedAnswers;

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (!isAnswerSelected && !isSubmitted) return;

    if (!isSubmitted) {
      // Calculate score
      const score = questions.reduce((acc, question) => {
        return acc + (selectedAnswers[question.id] === question.correctAnswer ? 1 : 0);
      }, 0);

      const quizResult: QuizResult = {
        score,
        total: questions.length,
        answers: questions.map(question => ({
          questionId: question.id,
          isCorrect: selectedAnswers[question.id] === question.correctAnswer,
          selectedAnswer: selectedAnswers[question.id] || -1,
        })),
      };

      setResult(quizResult);
      setIsSubmitted(true);
      
      // Call the onComplete callback with the result
      if (onComplete) {
        onComplete(quizResult);
      }

      // Show success message
      toast({
        title: 'Quiz Submitted!',
        description: `You scored ${score} out of ${questions.length}`,
      });
    }
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const getQuestionStatus = (questionIndex: number) => {
    if (questionIndex < currentQuestionIndex) return 'answered';
    if (questionIndex === currentQuestionIndex) return 'current';
    return 'upcoming';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading quiz...</span>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Quiz Available</CardTitle>
          <CardDescription>There are no quiz questions available for this module yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Module Quiz: {moduleTitle}</CardTitle>
            <CardDescription>
              Test your knowledge with these {questions.length} questions
            </CardDescription>
          </div>
          {!isSubmitted && (
            <div className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          )}
        </div>

        {/* Progress indicator */}
        {!isSubmitted && (
          <div className="flex space-x-1 pt-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'h-2 flex-1 rounded-full',
                  getQuestionStatus(index) === 'answered' && 'bg-primary',
                  getQuestionStatus(index) === 'current' && 'bg-primary/50',
                  getQuestionStatus(index) === 'upcoming' && 'bg-muted'
                )}
              />
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {!isSubmitted ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
              <RadioGroup
                value={selectedAnswers[currentQuestion.id]?.toString() ?? ''}
                onValueChange={(value) => handleAnswerSelect(currentQuestion.id, parseInt(value))}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              
              {!isLastQuestion ? (
                <Button 
                  onClick={handleNextQuestion}
                  disabled={!isAnswerSelected}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmitQuiz}
                  disabled={!isAnswerSelected}
                >
                  Submit Quiz
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">
                Quiz Completed!
              </h3>
              <p className="mt-2 text-muted-foreground">
                You scored {result?.score} out of {result?.total} ({Math.round((result?.score || 0) / (result?.total || 1) * 100)}%)
              </p>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                Retake Quiz
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Review your answers:</h4>
              <div className="space-y-6">
                {questions.map((question, qIndex) => {
                  const answer = result?.answers.find(a => a.questionId === question.id);
                  const isCorrect = answer?.isCorrect;
                  const selectedOption = answer?.selectedAnswer;
                  
                  return (
                    <div key={question.id} className="space-y-3">
                      <div className="flex items-start">
                        <div className={cn(
                          'mr-3 mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full',
                          isCorrect ? 'bg-green-100' : 'bg-red-100'
                        )}>
                          {isCorrect ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {qIndex + 1}. {question.question}
                          </p>
                          <p className={cn(
                            'mt-1 text-sm',
                            isCorrect ? 'text-green-600' : 'text-red-600'
                          )}>
                            {isCorrect ? 'Correct!' : `Incorrect. The correct answer is: ${question.options[question.correctAnswer]}`}
                          </p>
                          {!isCorrect && selectedAnswers[question.id] !== undefined && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              You selected: {question.options[selectedAnswers[question.id]]}
                            </p>
                          )}
                          <p className="mt-2 text-sm text-muted-foreground">
                            {question.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
