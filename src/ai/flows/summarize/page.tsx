
'use client';
import { useState, useEffect } from 'react';
import { summarizeChapter, SummarizeChapterOutput } from '@/ai/flows/summarize-chapter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { DownloadButton } from '@/components/download-button';
import { Loader2 } from 'lucide-react';

export default function SummarizePage() {
  const [chapterText, setChapterText] = useState('');
  const [summaryResult, setSummaryResult] = useState<SummarizeChapterOutput | null>(null);
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

  const handleSummarize = async () => {
    if (!chapterText.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some text to summarize.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setSummaryResult(null);

    try {
      const result = await summarizeChapter({ chapterText, apiKey: apiKey || undefined });
      setSummaryResult(result);
    } catch (error) {
      console.error('Error summarizing chapter:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate summary. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-3xl md:text-4xl">Chapter Summarizer</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Enter Chapter Text</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste the text from your textbook chapter here..."
              className="min-h-[250px] text-base"
              value={chapterText}
              onChange={(e) => setChapterText(e.target.value)}
              disabled={isLoading}
            />
            <Button onClick={handleSummarize} disabled={isLoading} className="mt-4">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                'Generate Summary'
              )}
            </Button>
          </CardContent>
        </Card>

        {summaryResult && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Generated Summary</CardTitle>
              <DownloadButton
                content={summaryResult.summary}
                filename="summary.txt"
              />
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <p>{summaryResult.summary}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
