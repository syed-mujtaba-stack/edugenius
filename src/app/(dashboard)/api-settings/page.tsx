
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
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const storedApiKey = localStorage.getItem('user-gemini-api-key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('user-gemini-api-key', apiKey);
      toast({
        title: 'API Key Saved',
        description: 'Your custom API key will now be used for AI requests.',
      });
    } else {
      localStorage.removeItem('user-gemini-api-key');
      toast({
        title: 'API Key Removed',
        description: 'The application will revert to using the default API key.',
      });
    }
     // Optional: Dispatch a custom event to notify other parts of the app
    window.dispatchEvent(new Event('apiKeyUpdated'));
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="font-headline text-3xl md:text-4xl">API Settings</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
            <CardTitle className="flex items-center gap-2"><KeyRound /> Custom API Key</CardTitle>
            <CardDescription>
                You can use your own Gemini API key. This will override the default key for all AI features.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <div className="space-y-4 max-w-lg">
                <div className="space-y-2">
                <Label htmlFor="api-key">Your Gemini API Key</Label>
                <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter your API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                    Your key is saved securely in your browser's local storage and is not sent to our servers.
                </p>
                </div>
                <Button onClick={handleSaveApiKey}>
                <Save className="mr-2 h-4 w-4" /> Save API Key
                </Button>
            </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Get a Free API Key</CardTitle>
                <CardDescription>
                    You can get a free Gemini API key from Google AI Studio for generous, free-of-charge use.
                </CardDescription>
            </CardHeader>
            <CardContent>
                 <Alert>
                    <AlertTitle className="font-semibold">How to get your key:</AlertTitle>
                    <AlertDescription className="space-y-2 mt-2">
                       <p>1. Go to Google AI Studio.</p>
                       <p>2. Click on "Get API key" and sign in with your Google account.</p>
                       <p>3. Copy the generated key and paste it in the field on the left.</p>
                    </AlertDescription>
                </Alert>
                <Button asChild className="mt-4 w-full">
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                        Go to Google AI Studio <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                </Button>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
