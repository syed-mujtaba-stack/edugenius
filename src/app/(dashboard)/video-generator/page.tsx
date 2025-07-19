'use client';
import { useState } from 'react';
import { generateAudioFromText } from '@/ai/flows/generate-audio-from-text';
import { generateVideoFromPrompt } from '@/ai/flows/generate-video-from-prompt';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Music4, Download, Clapperboard, Film } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function VideoGeneratorPage() {
  // TTS State
  const [text, setText] = useState('');
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  
  // Video State
  const [prompt, setPrompt] = useState('');
  const [videoDataUri, setVideoDataUri] = useState<string | null>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  const { toast } = useToast();

  const handleGenerateAudio = async () => {
    if (!text.trim()) {
      toast({ title: 'Error', description: 'Please enter some text to generate audio.', variant: 'destructive' });
      return;
    }
    setIsAudioLoading(true);
    setAudioDataUri(null);
    try {
      const result = await generateAudioFromText(text);
      setAudioDataUri(result.media);
    } catch (error) {
      console.error('Error generating audio:', error);
      toast({ title: 'Error', description: 'Failed to generate audio. Please try again.', variant: 'destructive' });
    } finally {
      setIsAudioLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) {
      toast({ title: 'Error', description: 'Please enter a prompt to generate the video.', variant: 'destructive' });
      return;
    }
    setIsVideoLoading(true);
    setVideoDataUri(null);
    try {
      const result = await generateVideoFromPrompt({ prompt });
      setVideoDataUri(result.video);
      toast({ title: 'Success!', description: 'Your video has been generated.' });
    } catch (error) {
      console.error('Error generating video:', error);
      toast({ title: 'Error', description: 'Failed to generate video. This is an experimental feature and may fail. Please try again.', variant: 'destructive' });
    } finally {
      setIsVideoLoading(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-3xl md:text-4xl">AI Video Generator</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Film />AI Text-to-Video Generator (Experimental)</CardTitle>
          <CardDescription>Create a short video from a text description using AI. This may take up to a minute.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="e.g., A majestic dragon soaring over a mystical forest at dawn"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isVideoLoading}
              className="text-base"
            />
            <Button onClick={handleGenerateVideo} disabled={isVideoLoading || !prompt}>
              {isVideoLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Clapperboard className="mr-2 h-4 w-4" /> Generate Video</>}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {isVideoLoading && (
        <Card>
            <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
                <Loader2 className="h-12 w-12 mb-4 animate-spin" />
                <p className="font-semibold">Your video is being created...</p>
                <p className="text-sm text-muted-foreground">This can take up to a minute. Please be patient.</p>
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
      
      <Separator className="my-4" />

       <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Music4 />Text-to-Speech Converter</CardTitle>
          <CardDescription>Convert your notes or text into high-quality audio.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your text here to convert it into audio..."
              className="min-h-[150px] text-base"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isAudioLoading}
            />
            <Button onClick={handleGenerateAudio} disabled={isAudioLoading || !text}>
              {isAudioLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Audio...</> : 'Generate Audio'}
            </Button>
        </CardContent>
      </Card>

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
