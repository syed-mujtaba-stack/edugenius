'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

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
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      if (user) {
        const token = await user.getIdToken();
        const response = await fetch('/api/learning-agents', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setAgents(data);
        }
      }
    };

    fetchAgents();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAgent((prev) => ({ ...prev, [name]: value }));
  };

  const handleRunAgent = async (agent: LearningAgent) => {
    if (agent.language === 'typescript' && agent.code) {
      setLoading(true);
      try {
        const response = await fetch('/api/run-agent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: agent.code }),
        });
        const data = await response.json();
        setResult(data.result);
      } catch (error) {
        console.error('Error running agent:', error);
        alert('Failed to run agent.');
      } finally {
        setLoading(false);
      }
    } else {
      // Handle other languages or endpoint-based agents
      console.log('Running agent:', agent);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (user) {
        const token = await user.getIdToken();
        await fetch('/api/learning-agents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newAgent),
        });
        setNewAgent({ name: '', description: '', language: 'typescript', endpoint: '', code: '' });
        // Refresh the list of agents
        const response = await fetch('/api/learning-agents', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (Array.isArray(data)) {
          setAgents(data);
        }
      }
    } catch (error) {
      console.error('Error creating learning agent:', error);
    } finally {
      setLoading(false);
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
            <Input
              name="description"
              value={newAgent.description}
              onChange={handleInputChange}
              placeholder="Description"
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
              className="w-full h-48 p-2 border rounded"
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Agent'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Learning Agents</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {agents.map((agent) => (
              <AccordionItem key={agent.id} value={agent.id}>
                <AccordionTrigger>{agent.name}</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">{agent.description}</p>
                  <p className="mb-2">
                    <strong>Language:</strong> {agent.language}
                  </p>
                  <p>
                    <strong>Endpoint:</strong> {agent.endpoint}
                  </p>
                  {agent.language === 'typescript' && (
                    <pre className="bg-gray-100 p-2 rounded mt-2">
                      <code>{agent.code}</code>
                    </pre>
                  )}
                  <Button className="mt-2" onClick={() => handleRunAgent(agent)}>Run Agent</Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Execution Result</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-2 rounded">
              <code>{JSON.stringify(result, null, 2)}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}