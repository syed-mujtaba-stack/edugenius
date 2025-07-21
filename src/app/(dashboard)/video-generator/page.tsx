
'use client';
import { useState, useEffect } from 'react';
import { generateVideoFromPrompt } from '@/ai/flows/generate-video-from-prompt';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Clapperboard, Download } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function VideoGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [videoDataUri, setVideoDataUri] = useState<string | null>(null);
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

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) {
      toast({ title: 'Error', description: 'Please enter a prompt to generate the video.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setVideoDataUri(null);
    try {
      const result = await generateVideoFromPrompt({ prompt, apiKey: apiKey || undefined });
      setVideoDataUri(result.video);
    } catch (error: any) {
      console.error('Error generating video:', error);
      toast({ 
          title: 'Error Generating Video', 
          description: error.message || 'Failed to generate video. The model may be unavailable or under high load. Please try again later.', 
          variant: 'destructive',
          duration: 9000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-3xl md:text-4xl">AI Video Generator</h1>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Clapperboard />Text-to-Video Generator</CardTitle>
          <CardDescription>Describe a scene or concept, and the AI will generate a short video clip for you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., A majestic dragon soaring over a mystical forest at dawn."
              className="min-h-[150px] text-base"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
            />
            <Button onClick={handleGenerateVideo} disabled={isLoading || !prompt}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Video...</> : 'Generate Video'}
            </Button>
            <Alert variant="destructive">
                <AlertTitle>Experimental Feature</AlertTitle>
                <AlertDescription>
                    Video generation is a new technology and can be slow (taking up to a minute) or fail unexpectedly. Please be patient.
                </AlertDescription>
            </Alert>
        </CardContent>
      </Card>

      {isLoading && !videoDataUri && (
          <Card>
            <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
                <Loader2 className="h-12 w-12 mb-4 animate-spin" />
                <p className="font-semibold">Your video is being created...</p>
                <p className="text-sm text-muted-foreground">This can take up to a minute. Please don't navigate away.</p>
            </CardContent>
        </Card>
      )}

      {videoDataUri && (
          <Card>
            <CardHeader><CardTitle>Generated Video</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <video controls src={videoDataUri} className="w-full rounded-md" />
                 <Button asChild variant="outline">
                    <a href={videoDataUri} download="generated-video.mp4">
                        <Download className="mr-2 h-4 w-4" />
                        Download Video
                    </a>
                </Button>
            </CardContent>
          </Card>
      )}
    </main>
  );
}
