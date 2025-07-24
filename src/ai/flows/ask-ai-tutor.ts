
'use server';
/**
 * @fileOverview An AI tutor that can answer student questions.
 *
 * - askAiTutor - A function that handles the AI tutoring process.
 * - AskAiTutorInput - The input type for the askAiTutor function.
 * - AskAiTutorOutput - The return type for the askAiTutor function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AskAiTutorInputSchema = z.object({
  topic: z.string().describe('The topic of the question.'),
  question: z.string().describe("The student's question."),
  apiKey: z.string().optional(),
});
export type AskAiTutorInput = z.infer<typeof AskAiTutorInputSchema>;

const AskAiTutorOutputSchema = z.object({
  answer: z.string().describe("The AI tutor's answer to the question."),
});
export type AskAiTutorOutput = z.infer<typeof AskAiTutorOutputSchema>;

export async function askAiTutor(input: AskAiTutorInput): Promise<AskAiTutorOutput> {
  return askAiTutorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askAiTutorPrompt',
  input: { schema: AskAiTutorInputSchema },
  output: { schema: AskAiTutorOutputSchema },
  prompt: `You are a friendly and knowledgeable AI Tutor for students in Pakistan. Your goal is to explain concepts clearly and simply.

A student has a question about the topic: "{{topic}}".

Student's Question: "{{question}}"

Please provide a clear, step-by-step answer to the student's question. If possible, use a simple analogy or example to help them understand. Keep the tone encouraging and supportive. Answer in the same language as the question if possible (English or Urdu).`,
});

const askAiTutorFlow = ai.defineFlow(
  {
    name: 'askAiTutorFlow',
    inputSchema: AskAiTutorInputSchema,
    outputSchema: AskAiTutorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
