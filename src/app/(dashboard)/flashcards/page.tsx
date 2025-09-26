'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const MIN_CARDS = 3;
const MAX_CARDS = 20;

export type FlashcardDifficulty = 'easy' | 'medium' | 'hard';

interface Flashcard {
  question: string;
  answer: string;
  hint?: string;
  difficulty: FlashcardDifficulty;
}

interface FlashcardResponse {
  flashcards: Flashcard[];
  studyTips: string[];
}

export default function FlashcardStudioPage() {
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [focusPointsInput, setFocusPointsInput] = useState('');
  const [numberOfCards, setNumberOfCards] = useState(8);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [studyTips, setStudyTips] = useState<string[]>([]);
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

  const parsedFocusPoints = useMemo(() => {
    return focusPointsInput
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }, [focusPointsInput]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!subject.trim() || !topic.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please provide both subject and topic to generate flashcards.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setFlashcards([]);
    setStudyTips([]);

    try {
      const response = await fetch('/api/ai/generate-flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: subject.trim(),
          topic: topic.trim(),
          focusPoints: parsedFocusPoints,
          numberOfCards,
          apiKey: apiKey ?? undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate flashcards.');
      }

      const data = (await response.json()) as FlashcardResponse;
      if (!data.flashcards?.length) {
        throw new Error('The AI did not return any flashcards.');
      }

      setFlashcards(data.flashcards);
      setStudyTips(data.studyTips ?? []);
      toast({ title: 'Flashcards ready!', description: 'Scroll down to start revising.' });
    } catch (error) {
      console.error('Flashcard generation error:', error);
      toast({
        title: 'Generation failed',
        description: error instanceof Error ? error.message : 'Unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl md:text-4xl">Flashcard Studio</h1>
          <p className="text-muted-foreground mt-1">Generate smart revision flashcards tailored to your subject.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Create a Flashcard Set</CardTitle>
            <CardDescription>
              Provide the subject, topic, and optional focus points. The AI will craft exam-ready flashcards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium" htmlFor="subject">
                  Subject
                </label>
                <Input
                  id="subject"
                  placeholder="e.g., Biology"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium" htmlFor="topic">
                  Topic
                </label>
                <Input
                  id="topic"
                  placeholder="e.g., Photosynthesis"
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium" htmlFor="focusPoints">
                  Focus Points (optional)
                </label>
                <Textarea
                  id="focusPoints"
                  placeholder="List key concepts on separate lines or comma-separated"
                  value={focusPointsInput}
                  onChange={(event) => setFocusPointsInput(event.target.value)}
                  disabled={isLoading}
                  rows={4}
                />
                {parsedFocusPoints.length > 0 && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Parsed focus points: {parsedFocusPoints.length}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium" htmlFor="numberOfCards">
                  Number of Flashcards
                </label>
                <Input
                  id="numberOfCards"
                  type="number"
                  min={MIN_CARDS}
                  max={MAX_CARDS}
                  value={numberOfCards}
                  onChange={(event) => setNumberOfCards(Math.min(MAX_CARDS, Math.max(MIN_CARDS, Number(event.target.value))))}
                  disabled={isLoading}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Choose between {MIN_CARDS} and {MAX_CARDS} cards (default {numberOfCards}).
                </p>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating flashcards...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" /> Generate Flashcards
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Your Flashcards</CardTitle>
            <CardDescription>
              Revise each card. Hover or tap to reveal answers on mobile, or read directly on desktop.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <Loader2 className="mb-4 h-10 w-10 animate-spin" />
                <p>Crafting personalized flashcards…</p>
              </div>
            )}

            {!isLoading && flashcards.length === 0 && (
              <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
                <p className="text-lg font-medium">Flashcards will appear here once generated.</p>
                <p className="mt-1 text-sm">Fill out the form and click generate to get started.</p>
              </div>
            )}

            {!isLoading && flashcards.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {flashcards.map((card, index) => (
                  <div key={index} className="rounded-xl border p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">Card {index + 1}</h3>
                      <Badge variant="secondary" className="uppercase">
                        {card.difficulty}
                      </Badge>
                    </div>
                    <p className="mt-2 font-semibold">{card.question}</p>
                    <p className="mt-3 text-sm text-muted-foreground whitespace-pre-line">{card.answer}</p>
                    {card.hint && (
                      <p className="mt-3 rounded-md bg-muted p-2 text-xs text-muted-foreground">
                        Hint: {card.hint}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!isLoading && studyTips.length > 0 && (
              <div className="rounded-lg bg-muted p-4">
                <h3 className="text-sm font-semibold">Study Tips</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {studyTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
