'use server';
/**
 * @fileOverview AI agent that generates flashcards for rapid revision.
 *
 * - generateFlashcards - Creates tailored flashcards for a topic.
 * - GenerateFlashcardsInput - Input type for the flashcard generator.
 * - GenerateFlashcardsOutput - Output type produced by the generator.
 */

import { ai } from '@/ai/genkit';
import {
  GenerateFlashcardsInputSchema,
  GenerateFlashcardsOutputSchema,
} from '@/ai/schemas/flashcards';
import { z } from 'genkit';

export type GenerateFlashcardsInput = z.infer<typeof GenerateFlashcardsInputSchema>;
export type GenerateFlashcardsOutput = z.infer<typeof GenerateFlashcardsOutputSchema>;

export async function generateFlashcards(input: GenerateFlashcardsInput): Promise<GenerateFlashcardsOutput> {
  return generateFlashcardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFlashcardsPrompt',
  input: { schema: GenerateFlashcardsInputSchema },
  output: { schema: GenerateFlashcardsOutputSchema },
  prompt: `You are an expert Pakistani study coach. Create a concise flashcard set to help a student revise.

Subject: {{subject}}
Topic: {{topic}}
Important focus points:
{{#if focusPoints}}
{{#each focusPoints}}- {{this}}
{{/each}}
{{else}}
- Cover the most exam-relevant concepts.
{{/if}}

Generate {{numberOfCards}} flashcards. Vary the difficulty to keep learners engaged (easy, medium, hard). Each flashcard must include:
- question: short and direct for quick recall.
- answer: accurate and exam-ready explanation.
- hint: optional mnemonic or clue (keep blank if not needed).
- difficulty: easy|medium|hard.

Also provide 3-5 crisp study tips tailored to the student.

Return everything in the specified JSON schema. Do not include extra commentary.`,
});

const generateFlashcardsFlow = ai.defineFlow(
  {
    name: 'generateFlashcardsFlow',
    inputSchema: GenerateFlashcardsInputSchema,
    outputSchema: GenerateFlashcardsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
