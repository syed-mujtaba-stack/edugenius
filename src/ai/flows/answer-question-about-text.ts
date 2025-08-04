'use server';
/**
 * @fileOverview Answers a question about a given text.
 *
 * - answerQuestionAboutText - A function that answers a question about a given text.
 * - AnswerQuestionAboutTextInput - The input type for the answerQuestionAboutText function.
 * - AnswerQuestionAboutTextOutput - The return type for the answerQuestionAboutText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnswerQuestionAboutTextInputSchema = z.object({
  text: z.string().describe('The text to answer a question about.'),
  question: z.string().describe('The question to answer.'),
  apiKey: z.string().optional(),
});
export type AnswerQuestionAboutTextInput = z.infer<typeof AnswerQuestionAboutTextInputSchema>;

const AnswerQuestionAboutTextOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type AnswerQuestionAboutTextOutput = z.infer<typeof AnswerQuestionAboutTextOutputSchema>;

export async function answerQuestionAboutText(input: AnswerQuestionAboutTextInput): Promise<AnswerQuestionAboutTextOutput> {
  return answerQuestionAboutTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionAboutTextPrompt',
  input: { schema: AnswerQuestionAboutTextInputSchema },
  output: { schema: AnswerQuestionAboutTextOutputSchema },
  prompt: `You are an expert at answering questions about a given text. Answer the following question based on the provided text:

Question: {{question}}

Text:
{{text}}

The output should be in the specified JSON format.`,
});

const answerQuestionAboutTextFlow = ai.defineFlow(
  {
    name: 'answerQuestionAboutTextFlow',
    inputSchema: AnswerQuestionAboutTextInputSchema,
    outputSchema: AnswerQuestionAboutTextOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);