
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Bot, Loader2, Send, User } from 'lucide-react';
import { answerVisitorQuestion } from '@/ai/flows/answer-visitor-questions';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from './ui/scroll-area';

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

export function HomepageChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'bot',
      content: 'Hi! I\'m the EduGenius assistant. Ask me anything about this app!',
    },
  ]);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setChatHistory((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await answerVisitorQuestion({ question: input });
      const botMessage: ChatMessage = { role: 'bot', content: result.answer };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error with chatbot:', error);
      toast({
        title: 'Error',
        description: 'Sorry, I had trouble getting an answer. Please try again.',
        variant: 'destructive',
      });
       const errorMessage: ChatMessage = { role: 'bot', content: "I'm having trouble connecting right now. Please try again in a moment." };
       setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        >
          <Bot className="h-7 w-7" />
          <span className="sr-only">Open Chatbot</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] flex flex-col h-[70vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" /> EduGenius Assistant
          </DialogTitle>
          <DialogDescription>
            Ask me any questions about the features of this application.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow h-full pr-4 -mx-2">
           <div className="flex-grow space-y-4 p-2">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 text-sm ${
                  chat.role === 'user' ? 'justify-end' : ''
                }`}
              >
                {chat.role === 'bot' && <Bot className="h-5 w-5 text-primary flex-shrink-0" />}
                <div
                  className={`rounded-lg p-2 max-w-[85%] whitespace-pre-wrap ${
                    chat.role === 'bot'
                      ? 'bg-secondary'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <p>{chat.content}</p>
                </div>
                {chat.role === 'user' && <User className="h-5 w-5 flex-shrink-0" />}
              </div>
            ))}
            {isLoading && (
                 <div className="flex items-start gap-3 text-sm">
                    <Bot className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="rounded-lg p-3 max-w-[85%] bg-secondary">
                        <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                </div>
            )}
           </div>
        </ScrollArea>
        <DialogFooter>
          <form onSubmit={handleSendMessage} className="flex w-full gap-2">
            <Input
              placeholder="e.g., What is test generation?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
