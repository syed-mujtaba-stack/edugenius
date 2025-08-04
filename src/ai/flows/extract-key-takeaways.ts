'use server';
/**
 * @fileOverview Extracts key takeaways from a given text.
 *
 * - extractKeyTakeaways - A function that extracts key takeaways from a given text.
 * - ExtractKeyTakeawaysInput - The input type for the extractKeyTakeaways function.
 * - ExtractKeyTakeawaysOutput - The return type for the extractKeyTakeaways function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const KeyTakeawaySchema = z.object({
  takeaway: z.string().describe('A key takeaway from the text.'),
});

const ExtractKeyTakeawaysInputSchema = z.object({
  text: z.string().describe('The text to extract key takeaways from.'),
  apiKey: z.string().optional(),
});
export type ExtractKeyTakeawaysInput = z.infer<typeof ExtractKeyTakeawaysInputSchema>;

const ExtractKeyTakeawaysOutputSchema = z.object({
  takeaways: z.array(KeyTakeawaySchema).describe('A list of key takeaways.'),
});
export type ExtractKeyTakeawaysOutput = z.infer<typeof ExtractKeyTakeawaysOutputSchema>;

export async function extractKeyTakeaways(input: ExtractKeyTakeawaysInput): Promise<ExtractKeyTakeawaysOutput> {
  return extractKeyTakeawaysFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractKeyTakeawaysPrompt',
  input: { schema: ExtractKeyTakeawaysInputSchema },
  output: { schema: ExtractKeyTakeawaysOutputSchema },
  prompt: `You are an expert at extracting key takeaways from a text. Extract the 5 most important key takeaways from the following text:

{{text}}

The output should be in the specified JSON format.`,
});

const extractKeyTakeawaysFlow = ai.defineFlow(
  {
    name: 'extractKeyTakeawaysFlow',
    inputSchema: ExtractKeyTakeawaysInputSchema,
    outputSchema: ExtractKeyTakeawaysOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);