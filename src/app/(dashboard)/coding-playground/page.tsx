'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Play, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LANGUAGES = [
  { value: 'javascript' as const, label: 'JavaScript (Node.js 18)' },
  { value: 'typescript' as const, label: 'TypeScript 4.2' },
  { value: 'python' as const, label: 'Python 3.10' },
  { value: 'cpp' as const, label: 'C++ (GCC 10)' },
  { value: 'c' as const, label: 'C (GCC 10)' },
  { value: 'java' as const, label: 'Java 15' },
  { value: 'go' as const, label: 'Go 1.16' },
  { value: 'ruby' as const, label: 'Ruby 3.0' },
];

const DEFAULT_SNIPPETS: Record<(typeof LANGUAGES)[number]['value'], string> = {
  javascript: `function greet(name) {
  return \`Hello, ${name}!\`;
}

console.log(greet('EduGenius'));
`,
  typescript: `function greet(name: string): string {
  return \`Hello, ${name}!\`;
}

console.log(greet('EduGenius'));
`,
  python: `def greet(name):
    return f"Hello, {name}!"

print(greet("EduGenius"))
`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    string name;
    getline(cin, name);
    if (name.empty()) {
        name = "EduGenius";
    }
    cout << "Hello, " << name << "!" << endl;
    return 0;
}
`,
  c: `#include <stdio.h>

int main(void) {
    char name[100];
    if (fgets(name, sizeof(name), stdin) == NULL) {
        printf("Hello, EduGenius!\n");
        return 0;
    }

    printf("Hello, %s", name);
    return 0;
}
`,
  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.hasNextLine() ? scanner.nextLine() : "EduGenius";
        System.out.println("Hello, " + name + "!");
    }
}
`,
  go: `package main

import (
    "bufio"
    "fmt"
    "os"
)

func main() {
    reader := bufio.NewReader(os.Stdin)
    name, _ := reader.ReadString('\n')
    if len(name) <= 1 {
        name = "EduGenius"
    }
    fmt.Printf("Hello, %s!\n", name)
}
`,
  ruby: `name = STDIN.gets&.strip
name = "EduGenius" if name.nil? || name.empty?

puts "Hello, #{name}!"
`,
};

type PlaygroundLanguage = (typeof LANGUAGES)[number]['value'];

interface ExecutionResult {
  stdout: string;
  stderr: string;
  output: string;
  language: PlaygroundLanguage;
  ranAt: string;
  compileOutput?: string;
}

interface AIExplanation {
  explanation: string;
  suggestions: string[];
  correctedCode?: string;
}

export default function CodingPlaygroundPage() {
  const [language, setLanguage] = useState<PlaygroundLanguage>('javascript');
  const [code, setCode] = useState(DEFAULT_SNIPPETS['javascript']);
  const [stdin, setStdin] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [aiExplanation, setAiExplanation] = useState<AIExplanation | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchApiKey = () => {
      const storedKey = localStorage.getItem('user-gemini-api-key');
      setApiKey(storedKey);
    };

    fetchApiKey();
    window.addEventListener('apiKeyUpdated', fetchApiKey);
    return () => window.removeEventListener('apiKeyUpdated', fetchApiKey);
  }, []);

  const hasErrors = useMemo(() => Boolean(result?.stderr?.trim()), [result?.stderr]);

  const handleLanguageChange = (value: PlaygroundLanguage) => {
    setLanguage(value);
    setCode(DEFAULT_SNIPPETS[value]);
    setResult(null);
    setAiExplanation(null);
  };

  const runCode = async () => {
    setIsRunning(true);
    setAiExplanation(null);

    try {
      const response = await fetch('/api/code-execution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, code, stdin }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to execute code.');
      }

      const data = await response.json();
      const executed: ExecutionResult = {
        stdout: data.run?.stdout ?? '',
        stderr: data.run?.stderr ?? data.compile?.stderr ?? '',
        output: data.run?.output ?? '',
        compileOutput: data.compile?.output,
        language,
        ranAt: new Date().toISOString(),
      };
      setResult(executed);
      if (!executed.stderr) {
        toast({ title: 'Code ran successfully', description: 'Check the output tab for results.' });
      } else {
        toast({
          title: 'Execution completed with errors',
          description: 'Review stderr or ask AI for help.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Execution error:', error);
      toast({
        title: 'Failed to run code',
        description: error instanceof Error ? error.message : 'Unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsRunning(false);
    }
  };

  const explainError = async () => {
    if (!result || !result.stderr) return;
    setIsExplaining(true);

    try {
      const response = await fetch('/api/ai/explain-code-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          code,
          errorOutput: result.stderr,
          stdin,
          apiKey: apiKey ?? undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'AI could not explain the error.');
      }

      const data = (await response.json()) as AIExplanation;
      setAiExplanation(data);
      toast({ title: 'AI explanation ready', description: 'Scroll down to review suggestions.' });
    } catch (error) {
      console.error('AI explanation error:', error);
      toast({
        title: 'Failed to fetch AI help',
        description: error instanceof Error ? error.message : 'Unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-headline text-3xl md:text-4xl">Coding Playground</h1>
        <p className="text-muted-foreground">
          Practice JavaScript, TypeScript, Python, C/C++, Java, Go, or Ruby directly in your browser. Run code, view output, and let AI help you fix errors.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Editor</CardTitle>
              <CardDescription>Select a language, write code, and hit Run.</CardDescription>
            </div>
            <Select value={language} onValueChange={(value) => handleLanguageChange(value as PlaygroundLanguage)}>
              <SelectTrigger className="w-full lg:w-64">
                <SelectValue placeholder="Choose language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={code}
              onChange={(event) => setCode(event.target.value)}
              className="min-h-[320px] font-mono text-sm"
              spellCheck={false}
            />
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <Button onClick={runCode} disabled={isRunning}>
                  {isRunning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Running...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" /> Run Code
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setCode(DEFAULT_SNIPPETS[language]);
                    setResult(null);
                    setAiExplanation(null);
                  }}
                  disabled={isRunning}
                >
                  Reset
                </Button>
              </div>
              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <span>Need test input? Provide it below before running.</span>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-muted-foreground">Standard Input (optional)</label>
              <Textarea
                value={stdin}
                onChange={(event) => setStdin(event.target.value)}
                className="min-h-[100px] font-mono text-sm"
                placeholder="Input provided to your program during execution"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>Latest execution details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Language</span>
                  <Badge variant="secondary">{language.toUpperCase()}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last run</span>
                  <span>{new Date(result.ranAt).toLocaleTimeString()}</span>
                </div>
                {result.stderr ? (
                  <div className="rounded-md bg-destructive/10 p-2 text-destructive">
                    Errors detected. Use AI helper to understand and fix them.
                  </div>
                ) : (
                  <div className="rounded-md bg-emerald-100/60 p-2 text-emerald-700">
                    No errors found. Great job!
                  </div>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={!hasErrors || isExplaining}
                  onClick={explainError}
                >
                  {isExplaining ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Asking AI...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" /> Explain with AI
                    </>
                  )}
                </Button>
                {!apiKey && (
                  <p className="text-xs text-muted-foreground">
                    Add your Gemini API key in settings to unlock richer AI explanations.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Run your code to see execution status, outputs, and AI assistance options.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Execution Output</CardTitle>
          <CardDescription>Inspect stdout, stderr, and combined output.</CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <Tabs defaultValue="stdout">
              <TabsList>
                <TabsTrigger value="stdout">Stdout</TabsTrigger>
                <TabsTrigger value="stderr">Stderr</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
              <TabsContent value="stdout" className="mt-4">
                <Textarea value={result.stdout || '(no output)'} readOnly className="min-h-[150px] font-mono text-sm" />
              </TabsContent>
              <TabsContent value="stderr" className="mt-4">
                <Textarea value={result.stderr || '(no errors)'} readOnly className="min-h-[150px] font-mono text-sm" />
              </TabsContent>
              <TabsContent value="summary" className="mt-4">
                <Textarea
                  value={result.output || result.compileOutput || '(no summary available)'}
                  readOnly
                  className="min-h-[150px] font-mono text-sm"
                />
              </TabsContent>
            </Tabs>
          ) : (
            <p className="text-sm text-muted-foreground">Run your program to populate these tabs.</p>
          )}
        </CardContent>
      </Card>

      {aiExplanation && (
        <Card>
          <CardHeader>
            <CardTitle>AI Debugging Assistant</CardTitle>
            <CardDescription>Learn what went wrong and how to fix it.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">Explanation</h3>
              <Textarea value={aiExplanation.explanation} readOnly className="min-h-[140px]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Suggested Steps</h3>
              <ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                {aiExplanation.suggestions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            {aiExplanation.correctedCode && (
              <div>
                <h3 className="text-sm font-semibold">Corrected Code</h3>
                <Textarea
                  value={aiExplanation.correctedCode}
                  readOnly
                  className="min-h-[200px] font-mono text-sm"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </main>
  );
}
