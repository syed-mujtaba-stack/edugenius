
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, KeyRound, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ApiSettingsPage() {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [openRouterApiKey, setOpenRouterApiKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const storedGeminiKey = localStorage.getItem('user-gemini-api-key');
    if (storedGeminiKey) {
      setGeminiApiKey(storedGeminiKey);
    }
    const storedOpenRouterKey = localStorage.getItem('user-openrouter-api-key');
    if (storedOpenRouterKey) {
      setOpenRouterApiKey(storedOpenRouterKey);
    }
  }, []);

  const handleSaveKeys = () => {
    // Save Gemini Key
    if (geminiApiKey.trim()) {
      localStorage.setItem('user-gemini-api-key', geminiApiKey);
    } else {
      localStorage.removeItem('user-gemini-api-key');
    }

    // Save OpenRouter Key
    if (openRouterApiKey.trim()) {
      localStorage.setItem('user-openrouter-api-key', openRouterApiKey);
    } else {
      localStorage.removeItem('user-openrouter-api-key');
    }
    
    toast({
        title: 'API Keys Saved',
        description: 'Your custom API keys will now be used for AI requests.',
    });

    // Optional: Dispatch a custom event to notify other parts of the app
    window.dispatchEvent(new Event('apiKeyUpdated'));
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-3xl md:text-4xl">API Settings</h1>
      </div>
      <Card>
          <CardHeader>
          <CardTitle className="flex items-center gap-2"><KeyRound /> Custom API Keys</CardTitle>
          <CardDescription>
              Provide your own API keys to use with EduGenius. Your keys are saved securely in your browser's local storage.
          </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 max-w-lg">
                <div className="space-y-2">
                    <Label htmlFor="openrouter-api-key">Your OpenRouter API Key</Label>
                    <Input
                        id="openrouter-api-key"
                        type="password"
                        placeholder="Enter your OpenRouter key (sk-or-....)"
                        value={openRouterApiKey}
                        onChange={(e) => setOpenRouterApiKey(e.target.value)}
                    />
                     <Button asChild variant="link" className="p-0 h-auto">
                        <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer">
                            Get an OpenRouter key <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                    </Button>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="gemini-api-key">Your Google Gemini API Key</Label>
                    <Input
                        id="gemini-api-key"
                        type="password"
                        placeholder="Enter your Gemini API key (for specific features)"
                        value={geminiApiKey}
                        onChange={(e) => setGeminiApiKey(e.target.value)}
                    />
                     <Button asChild variant="link" className="p-0 h-auto">
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                            Get a Google Gemini key <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                    </Button>
                </div>
              <Button onClick={handleSaveKeys} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" /> Save API Keys
              </Button>
            </div>
          </CardContent>
      </Card>
      <Alert>
          <AlertTitle className="font-semibold">Why Two Keys?</AlertTitle>
          <AlertDescription className="space-y-2 mt-2">
             <p>EduGenius uses <strong className="text-foreground">OpenRouter</strong> for most text-based AI features to provide flexibility and access to a wide range of models.</p>
             <p>However, some advanced features like <strong className="text-foreground">AI Audio Generation</strong> and <strong className="text-foreground">Video Generation</strong> require a direct <strong className="text-foreground">Google Gemini API Key</strong> as these models are not available through OpenRouter yet.</p>
             <p>For the best experience, please provide both keys.</p>
          </AlertDescription>
      </Alert>
    </main>
  );
}
