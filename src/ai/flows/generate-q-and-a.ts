
'use server';
/**
 * @fileOverview AI-powered question and answer generator for a given topic.
 *
 * - generateQAndA - A function that generates questions and answers for a given topic.
 * - GenerateQAndAInput - The input type for the generateQAndA function.
 * - GenerateQAndAOutput - The return type for the generateQAndA function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQAndAInputSchema = z.object({
  topic: z.string().describe('The topic for which to generate questions and answers.'),
  apiKey: z.string().optional(),
});
export type GenerateQAndAInput = z.infer<typeof GenerateQAndAInputSchema>;

const GenerateQAndAOutputSchema = z.object({
  questionsAndAnswers: z
    .string()
    .describe('A list of questions and answers related to the topic.'),
});
export type GenerateQAndAOutput = z.infer<typeof GenerateQAndAOutputSchema>;

export async function generateQAndA(input: GenerateQAndAInput): Promise<GenerateQAndAOutput> {
  return generateQAndAFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQAndAPrompt',
  input: {schema: GenerateQAndAInputSchema},
  output: {schema: GenerateQAndAOutputSchema},
  prompt: `You are an AI learning assistant. Your task is to generate a list of potential questions and answers related to the given topic, so that students can use them for self-testing and preparation.

Topic: {{{topic}}}

Questions and Answers:`,
});

const generateQAndAFlow = ai.defineFlow(
  {
    name: 'generateQAndAFlow',
    inputSchema: GenerateQAndAInputSchema,
    outputSchema: GenerateQAndAOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
