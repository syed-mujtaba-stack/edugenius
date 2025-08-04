
'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Youtube, Loader2, PlayCircle, Tag, Search, Bot, Sparkles, AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import YouTube from 'react-youtube';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { findAndSummarizeVideos } from '@/ai/flows/find-and-summarize-videos';
import { generateQuiz, GenerateQuizOutput } from '@/ai/flows/generate-quiz';
import { saveVideo } from '@/lib/firebase';
import { extractKeyTakeaways, ExtractKeyTakeawaysOutput } from '@/ai/flows/extract-key-takeaways';
import { suggestRelatedResources, SuggestRelatedResourcesOutput } from '@/ai/flows/suggest-related-resources';
import { getYouTubeTranscript, GetYouTubeTranscriptOutput } from '@/ai/flows/get-youtube-transcript';
import { answerQuestionAboutText, AnswerQuestionAboutTextOutput } from '@/ai/flows/answer-question-about-text';

interface YouTubeVideo {
    id: string;
    title: string;
    thumbnail: string;
    channelTitle: string;
    summary: string;
}

const tags = [
    { label: 'Featured', query: 'Learn Programming for beginners' },
    { label: 'Web Development', query: 'Web Development full course' },
    { label: 'AI & Data Science', query: 'AI and Data Science full course' },
    { label: 'Python', query: 'Python full course' },
    { label: 'Physics', query: 'Physics Matric Class Pakistan' },
    { label: 'Chemistry', query: 'Chemistry Matric Class Pakistan' }
];

export default function CoursesPage() {
    const [videos, setVideos] = useState<YouTubeVideo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
    const [activeTag, setActiveTag] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [aiTopic, setAiTopic] = useState('');
    const { toast } = useToast();
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isAiFinderOpen, setIsAiFinderOpen] = useState(false);
    const [quiz, setQuiz] = useState<GenerateQuizOutput | null>(null);
    const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
    const [keyTakeaways, setKeyTakeaways] = useState<ExtractKeyTakeawaysOutput | null>(null);
    const [relatedResources, setRelatedResources] = useState<SuggestRelatedResourcesOutput | null>(null);
    const [transcript, setTranscript] = useState<GetYouTubeTranscriptOutput | null>(null);
    const [isQnaDialogOpen, setIsQnaDialogOpen] = useState(false);
    const [qna, setQna] = useState<{ question: string, answer: string } | null>(null);
    const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
    const [notes, setNotes] = useState<any[]>([]);


    useEffect(() => {
        handleTagClick(tags[0].label);
    }, []);

     useEffect(() => {
        const fetchApiKey = () => {
            const storedKey = localStorage.getItem('user-gemini-api-key');
            setApiKey(storedKey);
        };
        fetchApiKey();
        window.addEventListener('apiKeyUpdated', fetchApiKey);
        return () => window.removeEventListener('apiKeyUpdated', fetchApiKey);
    }, []);

    const fetchVideosWithAi = async (topic: string) => {
        setIsAiLoading(true);
        setVideos([]);
        try {
            const result = await findAndSummarizeVideos({ topic, apiKey: apiKey || undefined });
            setVideos(result.videos);
            if (result.videos.length === 0) {
                 toast({
                    title: 'No Videos Found',
                    description: 'The AI could not find any videos for this topic. Try being more specific.',
                    variant: 'destructive'
                });
            }
        } catch (error: any) {
            console.error("Error fetching AI-powered videos:", error);
             toast({
                title: 'AI Agent Error',
                description: error.message || 'The AI agent failed to fetch videos. Please try again.',
                variant: 'destructive'
            });
        } finally {
            setIsAiLoading(false);
        }
    };
    
    const handleAiSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!aiTopic.trim()) {
            toast({ title: 'Topic is required', variant: 'destructive' });
            return;
        }
        setActiveTag('');
        setSearchQuery('');
        setIsAiFinderOpen(false);
        fetchVideosWithAi(aiTopic.trim());
    }

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
             setActiveTag('');
             fetchVideosWithAi(searchQuery.trim());
        }
    };

    const handleTagClick = (tagLabel: string) => {
        const currentTag = tags.find(t => t.label === tagLabel);
        if(currentTag) {
            setSearchQuery('');
            setActiveTag(tagLabel);
            fetchVideosWithAi(currentTag.query);
        }
    };

    const handleGenerateQuiz = async (video: YouTubeVideo) => {
        setIsAiLoading(true);
        try {
            const result = await generateQuiz({ text: video.summary, apiKey: apiKey || undefined });
            setQuiz(result);
            setIsQuizDialogOpen(true);
        } catch (error: any) {
            console.error("Error generating quiz:", error);
            toast({
                title: 'Quiz Generation Error',
                description: error.message || 'The AI failed to generate a quiz. Please try again.',
                variant: 'destructive'
            });
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleExtractKeyTakeaways = async (video: YouTubeVideo) => {
        setIsAiLoading(true);
        try {
            const result = await extractKeyTakeaways({ text: video.summary, apiKey: apiKey || undefined });
            setKeyTakeaways(result);
        } catch (error: any) {
            console.error("Error extracting key takeaways:", error);
            toast({
                title: 'Key Takeaways Extraction Error',
                description: error.message || 'The AI failed to extract key takeaways. Please try again.',
                variant: 'destructive'
            });
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleSuggestRelatedResources = async (video: YouTubeVideo) => {
        setIsAiLoading(true);
        try {
            const result = await suggestRelatedResources({ topic: video.title, apiKey: apiKey || undefined });
            setRelatedResources(result);
        } catch (error: any) {
            console.error("Error suggesting related resources:", error);
            toast({
                title: 'Related Resources Suggestion Error',
                description: error.message || 'The AI failed to suggest related resources. Please try again.',
                variant: 'destructive'
            });
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleGetTranscript = async (video: YouTubeVideo) => {
        setIsAiLoading(true);
        try {
            const result = await getYouTubeTranscript({ videoId: video.id, apiKey: apiKey || undefined });
            setTranscript(result);
        } catch (error: any) {
            console.error("Error getting transcript:", error);
            toast({
                title: 'Transcript Error',
                description: error.message || 'Failed to get the video transcript. Please try again.',
                variant: 'destructive'
            });
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleAskQuestion = async (question: string) => {
        if (!transcript) return;
        setIsAiLoading(true);
        try {
            const result = await answerQuestionAboutText({ text: transcript.transcript, question, apiKey: apiKey || undefined });
            setQna({ question, answer: result.answer });
        } catch (error: any) {
            console.error("Error asking question:", error);
            toast({
                title: 'Q&A Error',
                description: error.message || 'The AI failed to answer the question. Please try again.',
                variant: 'destructive'
            });
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleSaveNote = async (content: string) => {
        if (!selectedVideo) return;
        setIsAiLoading(true);
        try {
            const token = await auth.currentUser?.getIdToken();
            await fetch('/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ videoId: selectedVideo.id, content }),
            });
            toast({ title: 'Note saved!' });
            // Refresh notes
            const response = await fetch(`/api/notes?videoId=${selectedVideo.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setNotes(data);
        } catch (error: any) {
            console.error("Error saving note:", error);
            toast({
                title: 'Note Error',
                description: error.message || 'Failed to save the note. Please try again.',
                variant: 'destructive'
            });
        } finally {
            setIsAiLoading(false);
        }
    };

    const memoizedVideos = useMemo(() => videos, [videos]);

    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
          autoplay: 1,
        },
    };

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className="font-headline text-3xl md:text-4xl">Free Video Courses</h1>
                     <Dialog open={isAiFinderOpen} onOpenChange={setIsAiFinderOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Bot className="mr-2 h-4 w-4" /> Find with AI
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2"><Bot /> AI Video Finder</DialogTitle>
                                <DialogDescription>Tell the AI what you want to learn, and it will find relevant videos and summarize them for you.</DialogDescription>
                            </DialogHeader>
                             <form onSubmit={handleAiSubmit} className="flex flex-col sm:flex-row gap-2 pt-4">
                                 <Textarea 
                                    placeholder="e.g., I want to learn about the basics of Quantum Physics"
                                    value={aiTopic}
                                    onChange={(e) => setAiTopic(e.target.value)}
                                    disabled={isAiLoading}
                                    className="bg-background"
                                />
                                <Button type="submit" disabled={isAiLoading || !aiTopic.trim()}>
                                    {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                    Find
                                </Button>
                            </form>
                        </DialogContent>
                     </Dialog>
                </div>

                 <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search for courses by topic..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        disabled={isAiLoading}
                    />
                </div>
                
                 <div>
                    <h2 className="text-xl font-semibold mb-3">Or Browse by Category</h2>
                     <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                             <Button 
                                key={tag.label} 
                                variant={activeTag === tag.label ? 'default' : 'secondary'}
                                onClick={() => handleTagClick(tag.label)}
                                disabled={isAiLoading}
                             >
                                <Tag className="mr-2 h-4 w-4" />
                                {tag.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                {(isLoading || isAiLoading) ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader><Skeleton className="h-40 w-full" /></CardHeader>
                            <CardContent className="space-y-2 pt-4">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardContent>
                            <CardFooter>
                                <Skeleton className="h-6 w-24" />
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    memoizedVideos.map((video) => (
                        <Card key={video.id} className="flex flex-col">
                            <CardHeader className="p-0">
                                <div className="relative h-40 w-full group cursor-pointer" onClick={() => setSelectedVideo(video)}>
                                    <Image
                                        src={video.thumbnail}
                                        alt={video.title}
                                        fill
                                        className="rounded-t-md object-cover"
                                        unoptimized
                                    />
                                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PlayCircle className="h-12 w-12 text-white/90" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow pt-4">
                                <CardTitle className="text-base leading-tight line-clamp-2 mb-2">{video.title}</CardTitle>
                                <p className="text-sm text-muted-foreground line-clamp-3">{video.summary}</p>
                            </CardContent>
                             <CardFooter className="flex justify-between items-center">
                                <Badge variant='secondary' className="flex items-center gap-1.5">
                                    <Youtube className="h-4 w-4 text-red-600"/> 
                                    {video.channelTitle}
                                </Badge>
                                 <Button variant="link" size="sm" onClick={() => setSelectedVideo(video)}>
                                     Watch Now
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => {
                                  const userId = localStorage.getItem('userId');
                                  if (userId) {
                                    saveVideo(video.id, userId);
                                    toast({ title: 'Video saved to bookmarks!' });
                                  } else {
                                    toast({ title: 'User not logged in', description: 'Please log in to save videos.', variant: 'destructive' });
                                  }
                                }}>
                                    Save
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleGenerateQuiz(video)}>
                                    Generate Quiz
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>

            <Dialog open={!!selectedVideo} onOpenChange={(isOpen) => !isOpen && setSelectedVideo(null)}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{selectedVideo?.title}</DialogTitle>
                        <DialogDescription>
                            Playing video from YouTube channel: {selectedVideo?.channelTitle}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedVideo && <YouTube videoId={selectedVideo.id} opts={opts} className="rounded-lg overflow-hidden mt-4"/>}
                    <div className="flex gap-2 mt-4">
                        <Button onClick={() => handleExtractKeyTakeaways(selectedVideo!)} disabled={isAiLoading}>
                            {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Key Takeaways
                        </Button>
                        <Button onClick={() => handleSuggestRelatedResources(selectedVideo!)} disabled={isAiLoading}>
                            {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Related Resources
                        </Button>
                        <Button onClick={() => handleGetTranscript(selectedVideo!)} disabled={isAiLoading}>
                            {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Show Transcript
                        </Button>
                        <Button onClick={() => setIsQnaDialogOpen(true)} disabled={!transcript}>
                            Q&A with AI
                        </Button>
                        <Button onClick={() => setIsNotesDialogOpen(true)}>
                            Take Notes
                        </Button>
                    </div>
                    {transcript && (
                        <div className="mt-4">
                            <h3 className="font-semibold">Transcript:</h3>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{transcript.transcript}</p>
                        </div>
                    )}
                    {keyTakeaways && (
                        <div className="mt-4">
                            <h3 className="font-semibold">Key Takeaways:</h3>
                            <ul className="list-disc list-inside">
                                {keyTakeaways.takeaways.map((item, index) => (
                                    <li key={index}>{item.takeaway}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {relatedResources && (
                        <div className="mt-4">
                            <h3 className="font-semibold">Related Resources:</h3>
                            <ul className="list-disc list-inside">
                                {relatedResources.resources.map((item, index) => (
                                    <li key={index}>
                                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                            {item.title} ({item.type})
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <QuizDialog quiz={quiz} open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen} />
            <QnaDialog
                open={isQnaDialogOpen}
                onOpenChange={setIsQnaDialogOpen}
                onAskQuestion={handleAskQuestion}
                qna={qna}
                isLoading={isAiLoading}
            />
            <NotesDialog
                open={isNotesDialogOpen}
                onOpenChange={setIsNotesDialogOpen}
                onSaveNote={handleSaveNote}
                notes={notes}
                isLoading={isAiLoading}
            />
        </main>
    );
}

const QuizDialog = ({ quiz, open, onOpenChange }: { quiz: GenerateQuizOutput | null, open: boolean, onOpenChange: (open: boolean) => void }) => {
    if (!quiz) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Quiz Time!</DialogTitle>
                    <DialogDescription>
                        Test your knowledge with this quiz based on the video summary.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                    {quiz.quiz.map((q, index) => (
                        <div key={index}>
                            <p className="font-semibold">{index + 1}. {q.question}</p>
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                {q.options.map((option, i) => (
                                    <li key={i}>{option}</li>
                                ))}
                            </ul>
                            <p className="text-sm text-muted-foreground mt-2">Answer: {q.answer}</p>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};

const NotesDialog = ({ open, onOpenChange, onSaveNote, notes, isLoading }: { open: boolean, onOpenChange: (open: boolean) => void, onSaveNote: (content: string) => void, notes: any[], isLoading: boolean }) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveNote(content);
        setContent('');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>My Notes</DialogTitle>
                    <DialogDescription>
                        Take notes while watching the video.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                    {notes.map((note) => (
                        <div key={note.id} className="border-b py-2">
                            <p>{note.content}</p>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Take a note..."
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !content.trim()}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const QnaDialog = ({ open, onOpenChange, onAskQuestion, qna, isLoading }: { open: boolean, onOpenChange: (open: boolean) => void, onAskQuestion: (question: string) => void, qna: { question: string, answer: string } | null, isLoading: boolean }) => {
    const [question, setQuestion] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAskQuestion(question);
        setQuestion('');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Q&A with AI</DialogTitle>
                    <DialogDescription>
                        Ask a question about the video and get an answer from the AI.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
                    <Input
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask a question..."
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !question.trim()}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Ask
                    </Button>
                </form>
                {qna && (
                    <div className="mt-4">
                        <p className="font-semibold">{qna.question}</p>
                        <p className="text-sm text-muted-foreground mt-2">{qna.answer}</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
