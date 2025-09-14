'use client';
import { useState, useEffect, useRef } from 'react';
import { askAiTutor } from '@/ai/flows/ask-ai-tutor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Bot, User, Bookmark, History, X, Menu, Send, Plus, Edit, Trash2, Search } from 'lucide-react';
import { MarkdownRenderer } from '@/components/ai/MarkdownRenderer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isBookmarked?: boolean;
  feedback?: 'helpful' | 'not-helpful' | null;
}

export default function AskAiPage() {
  const [topic, setTopic] = useState('');
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'saved'>('history');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);
  
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
    if ((!topic.trim() || !question.trim()) && !editingMessageId) {
      toast({
        title: 'Error',
        description: 'Please enter a topic and your question.',
        variant: 'destructive',
      });
      return;
    }

    if (editingMessageId) {
      // Handle message edit
      setChatHistory(prev => prev.map(msg => 
        msg.id === editingMessageId 
          ? { ...msg, content: editContent }
          : msg
      ));
      setEditingMessageId(null);
      setEditContent('');
      return;
    }

    setIsLoading(true);
    const userMessage: ChatMessage = { 
      id: Date.now().toString(),
      role: 'user', 
      content: question,
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, userMessage]);
    setQuestion('');

    try {
      setIsTyping(true);
      const result = await askAiTutor({ 
        topic, 
        question: userMessage.content, 
        apiKey: apiKey || undefined 
      });
      
      const botMessage: ChatMessage = { 
        id: Date.now().toString(),
        role: 'bot', 
        content: result.answer,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Error asking AI Tutor:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to get an answer. Please make sure your Gemini API KEY is set correctly and try again.',
        variant: 'destructive',
      });
      setChatHistory(prev => prev.slice(0, prev.length - 1));
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const savedMessages = chatHistory.filter(msg => msg.isBookmarked);
  
  const filteredMessages = searchQuery
    ? chatHistory.filter(chat => 
        chat.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chatHistory;

  const handleEditMessage = (message: ChatMessage) => {
    setEditingMessageId(message.id);
    setEditContent(message.content);
    setQuestion(message.content);
    // Scroll to bottom to show the input
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDeleteMessage = (messageId: string) => {
    setChatHistory(prev => prev.filter(msg => msg.id !== messageId));
    toast({
      title: 'Message deleted',
      variant: 'default',
    });
  };

  return (
    <TooltipProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transition-transform duration-300 ease-in-out transform',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'md:relative md:translate-x-0 md:flex md:flex-col md:border-r md:border-gray-200 dark:border-gray-800',
          'flex flex-col h-full'
        )}>
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">AI Tutor</h2>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex mt-4 border-b">
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-2 text-sm font-medium ${activeTab === 'history' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <History className="h-4 w-4" />
                  <span>History</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`flex-1 py-2 text-sm font-medium ${activeTab === 'saved' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  <span>Saved</span>
                  {savedMessages.length > 0 && (
                    <span className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
                      {savedMessages.length}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {activeTab === 'history' ? (
              chatHistory.length > 0 ? (
                <div className="space-y-2">
                  {chatHistory
                    .filter(msg => msg.role === 'user')
                    .map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => {
                          setTopic(msg.content.split(':')[0] || '');
                          setQuestion(msg.content);
                          setIsSidebarOpen(false);
                        }}
                        className="w-full text-left p-2 rounded hover:bg-accent text-sm truncate"
                        title={msg.content}
                      >
                        {msg.content.length > 30 ? `${msg.content.substring(0, 30)}...` : msg.content}
                      </button>
                    ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground text-sm p-4">
                  No chat history yet
                </div>
              )
            ) : savedMessages.length > 0 ? (
              <div className="space-y-2">
                {savedMessages.map((msg) => (
                  <div key={msg.id} className="p-2 rounded border bg-accent/50">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs text-muted-foreground">
                        {msg.timestamp.toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => {
                          setChatHistory(prev => prev.map(m => 
                            m.id === msg.id ? { ...m, isBookmarked: false } : m
                          ));
                        }}
                        className="text-muted-foreground hover:text-foreground"
                        title="Remove from saved"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-sm line-clamp-2">
                      {msg.content.length > 100 ? `${msg.content.substring(0, 100)}...` : msg.content}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground text-sm p-4">
                No saved messages yet
              </div>
            )}
          </div>
          <div className="p-4 border-t">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setChatHistory([]);
                setTopic('');
                setQuestion('');
                setIsSidebarOpen(false);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <header className="border-b h-16 flex items-center px-4 md:px-6">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden mr-2"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-headline text-xl md:text-2xl">AI Tutor</h1>
          </header>
          
          {/* 🔥 FIXED SECTION */}
          <div className="p-2 border-b">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search messages..."
                className="pl-10 pr-4 py-2 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          {/* 🔥 FIX END */}

          <div className="flex-1 overflow-y-auto p-4">
            {isTyping && (
              <div className="flex items-start gap-3">
                <Bot className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div className="bg-secondary rounded-lg p-3 max-w-xl">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            {filteredMessages.length === 0 && searchQuery ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Search className="h-12 w-12 mb-4 opacity-50" />
                <p>No messages found matching "{searchQuery}"</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Bot className="h-12 w-12 mb-4" />
                <p>I'm here to help you with your studies.</p>
                <p>Start by entering a topic and your question below.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map((chat) => (
                  <div 
                    key={chat.id} 
                    className={`flex items-start gap-3 ${chat.role === 'user' ? 'justify-end' : ''}`}
                  >
                    {chat.role === 'bot' && <Bot className="h-6 w-6 text-primary flex-shrink-0 mt-1" />}
                    <div 
                      className={`rounded-lg p-3 max-w-xl relative group ${
                        chat.role === 'bot' ? 'bg-secondary' : 'bg-primary text-primary-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs opacity-70">
                          {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => navigator.clipboard.writeText(chat.content)}
                            className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                            title="Copy to clipboard"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                          </button>
                          {chat.role === 'bot' && (
                            <button 
                              onClick={() => {
                                setChatHistory(prev => prev.map(msg => 
                                  msg.id === chat.id 
                                    ? { ...msg, isBookmarked: !msg.isBookmarked } 
                                    : msg
                                ));
                                toast({
                                  title: chat.isBookmarked ? 'Removed from bookmarks' : 'Bookmarked!',
                                  description: chat.isBookmarked 
                                    ? 'Message removed from your bookmarks' 
                                    : 'You can find this in your saved messages',
                                });
                              }}
                              className={`p-1 rounded ${
                                chat.isBookmarked 
                                  ? 'text-yellow-500' 
                                  : 'hover:bg-black/10 dark:hover:bg-white/10'
                              }`}
                              title={chat.isBookmarked ? 'Remove bookmark' : 'Bookmark this message'}
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill={chat.isBookmarked ? 'currentColor' : 'none'} 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                              >
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="prose dark:prose-invert max-w-none">
                        <MarkdownRenderer content={chat.content} />
                      </div>
                      {chat.role === 'bot' && (
                        <div className="flex items-center justify-end mt-2 gap-2">
                          <span className="text-xs opacity-50">Was this helpful?</span>
                          <button 
                            onClick={() => {
                              setChatHistory(prev => prev.map(msg => 
                                msg.id === chat.id 
                                  ? { ...msg, feedback: msg.feedback === 'helpful' ? null : 'helpful' } 
                                  : msg
                              ));
                            }}
                            className={`text-xs p-1 rounded ${
                              chat.feedback === 'helpful' 
                                ? 'bg-green-100 dark:bg-green-900' 
                                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            👍
                          </button>
                          <button 
                            onClick={() => {
                              setChatHistory(prev => prev.map(msg => 
                                msg.id === chat.id 
                                  ? { ...msg, feedback: msg.feedback === 'not-helpful' ? null : 'not-helpful' } 
                                  : msg
                              ));
                            }}
                            className={`text-xs p-1 rounded ${
                              chat.feedback === 'not-helpful' 
                                ? 'bg-red-100 dark:bg-red-900' 
                                : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            👎
                          </button>
                        </div>
                      )}
                    </div>
                    {chat.role === 'user' && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditMessage(chat)}
                          className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded"
                          title="Edit message"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(chat.id)}
                          className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded text-red-500"
                          title="Delete message"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    {chat.role === 'user' && <User className="h-6 w-6 text-primary flex-shrink-0 mt-1" />}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="max-w-3xl mx-auto flex flex-col gap-3">
              <Input
                placeholder="Topic (e.g. Physics, History, Math)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={isLoading}
              />
              <div className="flex gap-2">
                <Input
                  placeholder={editingMessageId ? "Edit your message..." : "Ask a question..."}
                  value={editingMessageId ? editContent : question}
                  onChange={(e) => editingMessageId ? setEditContent(e.target.value) : setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAsk();
                    }
                  }}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={handleAsk} 
                  disabled={isLoading || (!question.trim() && !editContent.trim())}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              {editingMessageId && (
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>Editing your message</span>
                  <button 
                    onClick={() => {
                      setEditingMessageId(null);
                      setEditContent('');
                      setQuestion('');
                    }}
                    className="text-primary hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
