
'use client';
import { useState, useEffect } from 'react';
import { askAiTutor } from '@/ai/flows/ask-ai-tutor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Bot, User } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

export default function AskAiPage() {
  const [topic, setTopic] = useState('');
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
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


  const handleAsk = async () => {
    if (!topic.trim() || !question.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a topic and your question.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const userMessage: ChatMessage = { role: 'user', content: question };
    setChatHistory(prev => [...prev, userMessage]);

    try {
      const result = await askAiTutor({ topic, question, apiKey: apiKey || undefined });
      const botMessage: ChatMessage = { role: 'bot', content: result.answer };
      setChatHistory(prev => [...prev, botMessage]);
      setQuestion(''); // Clear input after sending
    } catch (error: any) {
      console.error('Error asking AI Tutor:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to get an answer. Please make sure your Gemini API KEY is set correctly and try again.',
        variant: 'destructive',
      });
       // remove the user message if the bot fails to respond
      setChatHistory(prev => prev.slice(0, prev.length -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-3xl md:text-4xl">AI Tutor</h1>
      </div>
      <Card className="flex flex-col h-[75vh]">
        <CardHeader>
          <CardTitle>Ask a Question</CardTitle>
          <CardDescription>Get instant help from your AI-powered learning assistant.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto space-y-4 pr-6">
          {chatHistory.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Bot className="h-12 w-12 mb-4" />
                <p>I'm here to help you with your studies.</p>
                <p>Start by entering a topic and your question below.</p>
             </div>
          ) : (
            chatHistory.map((chat, index) => (
              <div key={index} className={`flex items-start gap-3 ${chat.role === 'user' ? 'justify-end' : ''}`}>
                {chat.role === 'bot' && <Bot className="h-6 w-6 text-primary flex-shrink-0" />}
                <div className={`rounded-lg p-3 max-w-xl ${chat.role === 'bot' ? 'bg-secondary' : 'bg-primary text-primary-foreground'}`}>
                  <p className="text-sm whitespace-pre-wrap">{chat.content}</p>
                </div>
                 {chat.role === 'user' && <User className="h-6 w-6 text-primary flex-shrink-0" />}
              </div>
            ))
          )}
        </CardContent>
        <div className="p-4 border-t">
          <div className="grid gap-2">
             <Input
                placeholder="Enter the topic (e.g., Photosynthesis)"
                className="text-base"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isLoading}
              />
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your question here..."
                className="text-base"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleAsk()}
                disabled={isLoading}
              />
              <Button onClick={handleAsk} disabled={isLoading || !topic || !question}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Ask'
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}
