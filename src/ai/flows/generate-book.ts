
'use server';
/**
 * @fileOverview An AI agent for generating a book with chapters.
 *
 * - generateBook - A function that handles the book generation process.
 * - GenerateBookInput - The input type for the generateBook function.
 * - GenerateBookOutput - The return type for the generateBook function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateBookInputSchema = z.object({
  title: z.string().describe("The title of the book."),
  numChapters: z.number().int().min(1).max(10).describe("The number of chapters the book should have."),
  purpose: z.string().describe("The main purpose or theme of the book."),
  apiKey: z.string().optional(),
});
export type GenerateBookInput = z.infer<typeof GenerateBookInputSchema>;

const ChapterSchema = z.object({
  title: z.string().describe("The title of the chapter."),
  content: z.string().describe("The full content of the chapter."),
});

const GenerateBookOutputSchema = z.object({
  title: z.string().describe("The final title of the generated book."),
  chapters: z.array(ChapterSchema).describe("An array of generated chapters for the book."),
});
export type GenerateBookOutput = z.infer<typeof GenerateBookOutputSchema>;

export async function generateBook(input: GenerateBookInput): Promise<GenerateBookOutput> {
  return generateBookFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBookPrompt',
  input: { schema: GenerateBookInputSchema },
  output: { schema: GenerateBookOutputSchema },
  prompt: `You are an expert author and educator. Your task is to write a complete book based on the user's request.

Book Title: "{{title}}"
Number of Chapters: {{numChapters}}
Purpose of the Book: "{{purpose}}"

Please write a comprehensive book with the specified number of chapters.
- The book should have a clear structure.
- Each chapter must have a meaningful title and detailed content that aligns with the book's overall purpose.
- The content should be well-researched, engaging, and easy to understand for the target audience implied by the purpose.
- Ensure the tone is appropriate for the book's subject matter.

Generate the entire book and provide the output in the specified JSON format. The final title in the output should be the same as the input title.`,
});

const generateBookFlow = ai.defineFlow(
  {
    name: 'generateBookFlow',
    inputSchema: GenerateBookInputSchema,
    outputSchema: GenerateBookOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
