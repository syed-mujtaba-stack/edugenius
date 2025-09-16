'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuickTestProps {
  onCompleteAction: (score: number) => void;
  onCloseAction: () => void;
}

export function QuickTest({ onCompleteAction, onCloseAction }: QuickTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswer: 2,
      explanation: 'Paris is the capital and most populous city of France.'
    },
    {
      id: '2',
      question: 'Which of these is a JavaScript framework?',
      options: ['Django', 'Flask', 'React', 'Laravel'],
      correctAnswer: 2,
      explanation: 'React is a JavaScript library for building user interfaces.'
    },
    {
      id: '3',
      question: 'What does HTML stand for?',
      options: [
        'Hyper Text Markup Language',
        'High Tech Modern Language',
        'Hyperlink and Text Markup Language',
        'Home Tool Markup Language'
      ],
      correctAnswer: 0,
      explanation: 'HTML stands for Hyper Text Markup Language.'
    }
  ]);

  const handleNext = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const finalScore = Math.round((score / questions.length) * 100);
    setTimeout(() => {
      onCompleteAction(finalScore);
      onCloseAction();
    }, 1000);
  };

  if (showResult) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Completed! 🎉</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-4xl font-bold mb-2">{Math.round((score / questions.length) * 100)}%</div>
            <p className="text-muted-foreground">
              You answered {score} out of {questions.length} questions correctly.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCloseAction}>
            Close
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Score'
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Quick Test</CardTitle>
        <div className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{questions[currentQuestion].question}</h3>
          <RadioGroup
            value={selectedAnswer !== null ? selectedAnswer.toString() : ''}
            onValueChange={(value) => setSelectedAnswer(parseInt(value))}
            className="space-y-2"
          >
            {questions[currentQuestion].options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCloseAction}>
          Cancel
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={selectedAnswer === null}
        >
          {currentQuestion === questions.length - 1 ? 'Finish Test' : 'Next Question'}
        </Button>
      </CardFooter>
    </Card>
  );
}
