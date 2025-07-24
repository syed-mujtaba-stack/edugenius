
'use client';
import { useState, useEffect } from 'react';
import { generateQAndA } from '@/ai/flows/generate-q-and-a';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { DownloadButton } from '@/components/download-button';
import { Loader2 } from 'lucide-react';

interface QAPair {
  question: string;
  answer: string;
}

export default function QAndAPage() {
  const [topic, setTopic] = useState('');
  const [qaPairs, setQaPairs] = useState<QAPair[]>([]);
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

  const parseQAResponse = (response: string): QAPair[] => {
    const lines = response.split('\n').filter(line => line.trim() !== '');
    const pairs: QAPair[] = [];
    for (let i = 0; i < lines.length; i++) {
        // Match "Q:", "Q1:", "1. Q:", etc.
        const qMatch = lines[i].match(/^(q\d*:|q:|(\d+\.)\s*q:)/i);
        if (qMatch) {
            const question = lines[i].substring(qMatch[0].length).trim();
            let answer = '';
            // Match "A:", "A1:", "1. A:", etc. in the next line
            if (i + 1 < lines.length) {
                const aMatch = lines[i+1].match(/^(a\d*:|a:|(\d+\.)\s*a:)/i);
                if(aMatch) {
                    answer = lines[i + 1].substring(aMatch[0].length).trim();
                    i++; // Increment to skip the answer line in the next iteration
                }
            }
            pairs.push({ question, answer });
        }
    }
    return pairs;
};

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a topic.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setQaPairs([]);

    try {
      const result = await generateQAndA({ topic, apiKey: apiKey || undefined });
      const parsed = parseQAResponse(result.questionsAndAnswers);
      setQaPairs(parsed);
       if(parsed.length === 0) {
        toast({
            title: "Notice",
            description: "The AI returned a response, but it couldn't be formatted into Q&A pairs. You can still download the raw response.",
          });
        // A fallback for when parsing fails but we have a raw response
        setQaPairs([{question: "Raw AI Response", answer: result.questionsAndAnswers}])
      }
    } catch (error) {
      console.error('Error generating Q&A:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate Q&A. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatQAToText = () => {
    return qaPairs.map(qa => `Q: ${qa.question}\nA: ${qa.answer}`).join('\n\n');
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-3xl md:text-4xl">Q&A Generator</h1>
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Enter a Topic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., Photosynthesis, The American Revolution"
                className="text-base"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                disabled={isLoading}
              />
              <Button onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {qaPairs.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Generated Questions & Answers</CardTitle>
              <DownloadButton content={formatQAToText()} filename="q-and-a.txt" />
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {qaPairs.map((qa, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-left">{qa.question}</AccordionTrigger>
                    <AccordionContent>{qa.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
