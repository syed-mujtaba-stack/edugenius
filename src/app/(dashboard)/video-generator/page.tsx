'use client';
import { useState } from 'react';
import { generateAudioFromText } from '@/ai/flows/generate-audio-from-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Music4, Download } from 'lucide-react';

export default function VideoGeneratorPage() {
  const [text, setText] = useState('');
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateAudio = async () => {
    if (!text.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some text to generate audio.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setAudioDataUri(null);

    try {
      const result = await generateAudioFromText(text);
      if (result.media) {
        setAudioDataUri(result.media);
      } else {
        throw new Error('No audio data received from AI.');
      }
    } catch (error) {
      console.error('Error generating audio:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate audio. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-3xl md:text-4xl">AI Video/Audio Generator</h1>
      </div>
       <Card>
        <CardHeader>
          <CardTitle>Text-to-Speech Converter</CardTitle>
          <CardDescription>Convert your notes or text into high-quality audio. This is the first step towards AI video generation.</CardDescription>
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
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Audio...
                </>
              ) : (
                <>
                  <Music4 className="mr-2 h-4 w-4" />
                  Generate Audio
                </>
              )}
            </Button>
        </CardContent>
      </Card>

      {audioDataUri && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Audio</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <audio controls src={audioDataUri} className="w-full">
                    Your browser does not support the audio element.
                </audio>
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
