'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface LearningAgent {
  id: string;
  name: string;
  description: string;
  language: string;
  endpoint: string;
  code?: string;
}

export default function SelfLearningPage() {
  const [user] = useAuthState(auth);
  const [agents, setAgents] = useState<LearningAgent[]>([]);
  const [newAgent, setNewAgent] = useState({
    name: '',
    description: '',
    language: 'typescript',
    endpoint: '',
    code: '',
  });
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    let interval: number | undefined;
    const fetchAgents = async () => {
      try {
        if (user) {
          const token = await user.getIdToken();
          const response = await fetch('/api/learning-agents', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) throw new Error('Failed to fetch agents');
          const data = await response.json();
          if (Array.isArray(data)) setAgents(data);
        }
      } catch (e) {
        console.warn('Fetch agents error:', e);
      }
    };

    fetchAgents();
    // Poll every 10s for near real-time updates
    interval = window.setInterval(fetchAgents, 10000);
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAgent((prev) => ({ ...prev, [name]: value }));
  };

  const handleRunAgent = async (agent: LearningAgent) => {
    if (agent.language === 'typescript' && agent.code) {
      setRunningId(agent.id);
      try {
        const token = await user?.getIdToken();
        const response = await fetch('/api/run-agent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ code: agent.code }),
        });
        if (!response.ok) throw new Error('Run failed');
        const data = await response.json();
        setResult(data.result);
        toast({ title: 'Agent executed', description: `${agent.name} finished running.` });
      } catch (error) {
        console.error('Error running agent:', error);
        toast({ title: 'Run failed', description: 'Failed to run agent.', variant: 'destructive' });
      } finally {
        setRunningId(null);
      }
    } else {
      // Handle other languages or endpoint-based agents
      console.log('Running agent:', agent);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      if (user) {
        const token = await user.getIdToken();
        // Optimistic add
        const tempId = `temp-${Date.now()}`;
        setAgents((prev) => [
          { id: tempId, ...newAgent },
          ...prev,
        ]);

        const res = await fetch('/api/learning-agents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newAgent),
        });
        if (!res.ok) throw new Error('Create failed');
        setNewAgent({ name: '', description: '', language: 'typescript', endpoint: '', code: '' });
        toast({ title: 'Agent added', description: 'Your learning agent was created.' });
        // Refresh the list of agents to replace optimistic temp
        const response = await fetch('/api/learning-agents', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) setAgents(data);
        }
      }
    } catch (error) {
      console.error('Error creating learning agent:', error);
      toast({ title: 'Create failed', description: 'Could not create agent.', variant: 'destructive' });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Self-Learning Module</h1>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Add a New Learning Agent</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              name="name"
              value={newAgent.name}
              onChange={handleInputChange}
              placeholder="Agent Name"
            />
            <textarea
              name="description"
              value={newAgent.description}
              onChange={handleInputChange}
              placeholder="Description"
              className="w-full min-h-24 p-2 rounded border bg-background border-input focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <Input
              name="language"
              value={newAgent.language}
              onChange={handleInputChange}
              placeholder="Programming Language"
            />
            <Input
              name="endpoint"
              value={newAgent.endpoint}
              onChange={handleInputChange}
              placeholder="API Endpoint (optional)"
            />
            <textarea
              name="code"
              value={newAgent.code}
              onChange={handleInputChange}
              placeholder="Enter your TypeScript code here"
              className="w-full h-48 p-2 rounded border bg-background border-input font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <Button type="submit" disabled={isAdding}>
              {isAdding ? 'Adding...' : 'Add Agent'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Learning Agents</CardTitle>
        </CardHeader>
        <CardContent>
          {agents.length === 0 ? (
            <div className="text-sm text-muted-foreground py-6">No agents yet. Create your first learning agent above.</div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {agents.map((agent) => (
                <AccordionItem key={agent.id} value={agent.id}>
                  <AccordionTrigger>{agent.name}</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">{agent.description}</p>
                    <p className="mb-2 text-sm text-muted-foreground">
                      <strong>Language:</strong> {agent.language}
                    </p>
                    {agent.endpoint && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Endpoint:</strong> <span className="font-mono">{agent.endpoint}</span>
                      </p>
                    )}
                    {agent.language === 'typescript' && agent.code && (
                      <pre className="bg-muted p-2 rounded mt-2 overflow-auto max-h-72 text-sm">
                        <code>{agent.code}</code>
                      </pre>
                    )}
                    <Button className="mt-3" onClick={() => handleRunAgent(agent)} disabled={runningId === agent.id}>
                      {runningId === agent.id ? 'Running…' : 'Run Agent'}
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Execution Result</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-2 rounded overflow-auto max-h-96 text-sm">
              <code>{JSON.stringify(result, null, 2)}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}