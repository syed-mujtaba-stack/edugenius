
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
  const { toast } = useToast();

  useEffect(() => {
    const storedGeminiKey = localStorage.getItem('user-gemini-api-key');
    if (storedGeminiKey) {
      setGeminiApiKey(storedGeminiKey);
    }
  }, []);

  const handleSaveKey = () => {
    if (geminiApiKey.trim()) {
      localStorage.setItem('user-gemini-api-key', geminiApiKey);
    } else {
      localStorage.removeItem('user-gemini-api-key');
    }
    
    toast({
        title: 'API Key Saved',
        description: 'Your custom Gemini API key will now be used for AI requests.',
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
          <CardTitle className="flex items-center gap-2"><KeyRound /> Custom API Key</CardTitle>
          <CardDescription>
              Provide your own Google Gemini API key to use with EduGenius. Your key is saved securely in your browser's local storage.
          </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 max-w-lg">
                 <div className="space-y-2">
                    <Label htmlFor="gemini-api-key">Your Google Gemini API Key</Label>
                    <Input
                        id="gemini-api-key"
                        type="password"
                        placeholder="Enter your Gemini API key"
                        value={geminiApiKey}
                        onChange={(e) => setGeminiApiKey(e.target.value)}
                    />
                     <Button asChild variant="link" className="p-0 h-auto">
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                            Get a Google Gemini key <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                    </Button>
                </div>
              <Button onClick={handleSaveKey} className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" /> Save API Key
              </Button>
            </div>
          </CardContent>
      </Card>
      <Alert>
          <AlertTitle className="font-semibold">Why do I need a key?</AlertTitle>
          <AlertDescription className="space-y-2 mt-2">
             <p>EduGenius uses Google Gemini for its AI features. To prevent misuse, the app requires you to provide your own free API key from Google AI Studio.</p>
             <p>Your key is stored only in your browser and is never sent to our servers.</p>
          </AlertDescription>
      </Alert>
    </main>
  );
}
