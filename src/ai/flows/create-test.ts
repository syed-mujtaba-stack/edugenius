// src/ai/flows/create-test.ts
'use server';
/**
 * @fileOverview A test creation AI agent.
 *
 * - createTest - A function that handles the test creation process.
 * - CreateTestInput - The input type for the createTest function.
 * - CreateTestOutput - The return type for the createTest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateTestInputSchema = z.object({
  subject: z.string().describe('The subject of the test.'),
  topic: z.string().describe('The topic of the test.'),
  difficultyLevel: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the test.'),
  numberOfQuestions: z
    .number()
    .int()
    .positive()
    .default(10) // Providing a default value
    .describe('The number of questions to generate for the test.'),
  curriculumLevel: z.string().describe('The curriculum level for the test (e.g., Grade 12, Graduation).'),
  board: z.string().optional().describe('The educational board (e.g., Sindh, Punjab, Federal).'),
  medium: z.enum(['english', 'urdu']).describe('The language medium for the test.'),
});
export type CreateTestInput = z.infer<typeof CreateTestInputSchema>;

const CreateTestOutputSchema = z.object({
  testQuestions: z.array(
    z.object({
      question: z.string().describe('The test question.'),
      answer: z.string().describe('The answer to the test question.'),
    })
  ).describe('An array of test questions and answers.'),
});
export type CreateTestOutput = z.infer<typeof CreateTestOutputSchema>;

export async function createTest(input: CreateTestInput): Promise<CreateTestOutput> {
  return createTestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createTestPrompt',
  input: {schema: CreateTestInputSchema},
  output: {schema: CreateTestOutputSchema},
  prompt: `You are an expert test generator. Generate a practice test with {{numberOfQuestions}} questions, tailored to the student's needs based on the following parameters:

Curriculum Level: {{curriculumLevel}}
{{#if board}}Board: {{board}}{{/if}}
Subject: {{subject}}
Topic: {{topic}}
Difficulty Level: {{difficultyLevel}}
Medium: {{medium}}

The test questions should be challenging and designed to assess the student's understanding of the material. Each question should have a clear and concise answer.

Output the questions and answers in JSON format.
`,
});

const createTestFlow = ai.defineFlow(
  {
    name: 'createTestFlow',
    inputSchema: CreateTestInputSchema,
    outputSchema: CreateTestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
