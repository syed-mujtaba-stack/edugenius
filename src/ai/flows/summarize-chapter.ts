
// SummarizeChapter AI
'use server';
/**
 * @fileOverview Summarizes a chapter from a textbook.
 *
 * - summarizeChapter - A function that summarizes a chapter from a textbook.
 * - SummarizeChapterInput - The input type for the summarizeChapter function.
 * - SummarizeChapterOutput - The return type for the summarizeChapter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeChapterInputSchema = z.object({
  chapterText: z.string().describe('The text content of the chapter to summarize.'),
  apiKey: z.string().optional(),
});
export type SummarizeChapterInput = z.infer<typeof SummarizeChapterInputSchema>;

const SummarizeChapterOutputSchema = z.object({
  summary: z.string().describe('A summary of the key points in the chapter.'),
  progress: z.string().describe('Progress summary'),
});
export type SummarizeChapterOutput = z.infer<typeof SummarizeChapterOutputSchema>;

export async function summarizeChapter(input: SummarizeChapterInput): Promise<SummarizeChapterOutput> {
  return summarizeChapterFlow(input);
}

const summarizeChapterPrompt = ai.definePrompt({
  name: 'summarizeChapterPrompt',
  input: {schema: SummarizeChapterInputSchema},
  output: {schema: SummarizeChapterOutputSchema},
  prompt: `You are an expert summarizer, able to extract the key points from a chapter of a textbook.

  Please provide a concise summary of the following chapter text:

  {{chapterText}}`,
});

const summarizeChapterFlow = ai.defineFlow(
  {
    name: 'summarizeChapterFlow',
    inputSchema: SummarizeChapterInputSchema,
    outputSchema: SummarizeChapterOutputSchema,
  },
  async input => {
    const {output} = await summarizeChapterPrompt(input);
    return {
      ...output!,
      progress: 'Generated a summary of the chapter.',
    };
  }
);
