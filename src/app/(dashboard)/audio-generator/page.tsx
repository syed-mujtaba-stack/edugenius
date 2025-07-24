'use client';
import { useState, useEffect } from 'react';
import { generateAudioFromText } from '@/ai/flows/generate-audio-from-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Music4, Download, AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function AudioGeneratorPage() {
  const [text, setText] = useState('');
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
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

  const handleGenerateAudio = async () => {
    if (!text.trim()) {
      toast({ title: 'Error', description: 'Please enter some text to generate audio.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setAudioDataUri(null);
    try {
      const result = await generateAudioFromText({ text, apiKey: apiKey || undefined });
      setAudioDataUri(result.media);
    } catch (error: any) {
      console.error('Error generating audio:', error);
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to generate audio. Please ensure you have set a valid Google Gemini API key in the settings.', 
        variant: 'destructive',
        duration: 7000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-3xl md:text-4xl">AI Audio Generator</h1>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Music4 />Text-to-Speech Converter</CardTitle>
          <CardDescription>Convert your notes or any pasted text into high-quality audio.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your text here to convert it into audio..."
              className="min-h-[200px] text-base"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
            />
            <Button onClick={handleGenerateAudio} disabled={isLoading || !text}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Audio...</> : 'Generate Audio'}
            </Button>
             <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Google Gemini API Key Required</AlertTitle>
                <AlertDescription>
                    This feature uses Google's advanced TTS model directly. Please make sure you have entered a valid Google Gemini API Key in the API Settings page.
                </AlertDescription>
            </Alert>
        </CardContent>
      </Card>

      {isLoading && !audioDataUri && (
          <Card>
            <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
                <Loader2 className="h-12 w-12 mb-4 animate-spin" />
                <p className="font-semibold">Your audio is being created...</p>
                <p className="text-sm text-muted-foreground">This may take a few moments.</p>
            </CardContent>
        </Card>
      )}

      {audioDataUri && (
          <Card>
            <CardHeader><CardTitle>Generated Audio</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <audio controls src={audioDataUri} className="w-full" />
                 <Button asChild variant="outline">
                    <a href={audioDataUri} download="generated-audio.wav">
                        <Download className="mr-2 h-4 w-4" />
                        Download Audio
                    </a>
                </Button>
            </CardContent>
          </Card>
      )}
    </main>
  );
}
