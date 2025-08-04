'use server';
/**
 * @fileOverview A self-learning module generator.
 *
 * - generateSelfLearningModule - A function that generates a self-learning module.
 * - GenerateSelfLearningModuleInput - The input type for the generateSelfLearningModule function.
 * - GenerateSelfLearningModuleOutput - The return type for the generateSelfLearningModule function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const LessonSchema = z.object({
  title: z.string().describe('The title of the lesson.'),
  summary: z.string().describe('A summary of the lesson content.'),
  resources: z.array(z.string()).describe('A list of URLs to relevant articles and videos.'),
  quiz: z.array(z.object({
    question: z.string().describe('The quiz question.'),
    options: z.array(z.string()).describe('An array of 4-5 options for the question.'),
    answer: z.string().describe('The correct option.'),
  })).describe('A short quiz to check understanding.'),
});

const GenerateSelfLearningModuleInputSchema = z.object({
  topic: z.string().describe('The topic to learn.'),
  apiKey: z.string().optional(),
});
export type GenerateSelfLearningModuleInput = z.infer<typeof GenerateSelfLearningModuleInputSchema>;

const GenerateSelfLearningModuleOutputSchema = z.object({
  learningPath: z.array(LessonSchema).describe('A step-by-step learning path with lessons, resources, and quizzes.'),
});
export type GenerateSelfLearningModuleOutput = z.infer<typeof GenerateSelfLearningModuleOutputSchema>;

export async function generateSelfLearningModule(input: GenerateSelfLearningModuleInput): Promise<GenerateSelfLearningModuleOutput> {
  return generateSelfLearningModuleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSelfLearningModulePrompt',
  input: { schema: GenerateSelfLearningModuleInputSchema },
  output: { schema: GenerateSelfLearningModuleOutputSchema },
  prompt: `You are an expert instructional designer. Create a comprehensive self-learning module for the topic: "{{topic}}".

The module should include a step-by-step learning path with the following for each lesson:
- A clear and concise title.
- A summary of the key concepts.
- A list of 2-3 relevant articles and videos (as URLs).
- A short quiz with 2-3 multiple-choice questions to check understanding.

Generate a learning path with at least 3-5 lessons. The output should be in the specified JSON format.`,
});

const generateSelfLearningModuleFlow = ai.defineFlow(
  {
    name: 'generateSelfLearningModuleFlow',
    inputSchema: GenerateSelfLearningModuleInputSchema,
    outputSchema: GenerateSelfLearningModuleOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);