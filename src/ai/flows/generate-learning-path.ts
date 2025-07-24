
'use server';
/**
 * @fileOverview Generates a personalized learning path for a student.
 *
 * - generateLearningPath - A function that creates a custom study plan.
 * - GenerateLearningPathInput - The input type for the function.
 * - GenerateLearningPathOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateLearningPathInputSchema = z.object({
  goal: z.string().describe('The student\'s primary learning goal (e.g., "Pass Matric Physics Exam").'),
  weakTopics: z.array(z.string()).describe('A list of topics the student finds difficult.'),
  apiKey: z.string().optional(),
});
export type GenerateLearningPathInput = z.infer<typeof GenerateLearningPathInputSchema>;


const LearningStepSchema = z.object({
    type: z.enum(['study_chapter', 'watch_video', 'take_test']).describe("The type of learning activity."),
    topic: z.string().describe("The specific topic for this step."),
    resource: z.string().optional().describe("A suggested resource, like a chapter number or video course name."),
    rationale: z.string().describe("A brief explanation of why this step is important."),
});

const GenerateLearningPathOutputSchema = z.object({
  learningSteps: z.array(LearningStepSchema).describe("A sequence of recommended learning steps."),
  dailyRoutine: z.string().describe("A suggested daily study schedule to follow."),
});
export type GenerateLearningPathOutput = z.infer<typeof GenerateLearningPathOutputSchema>;

export async function generateLearningPath(input: GenerateLearningPathInput): Promise<GenerateLearningPathOutput> {
  return generateLearningPathFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLearningPathPrompt',
  input: { schema: GenerateLearningPathInputSchema },
  output: { schema: GenerateLearningPathOutputSchema },
  prompt: `You are an expert academic advisor for Pakistani students. Your task is to create a personalized, adaptive learning path.

A student has the following goal: "{{goal}}"
They have identified these topics as their weaknesses: {{#each weakTopics}} - {{this}} {{/each}}

Based on this, create a step-by-step learning plan. The plan should start with foundational concepts and gradually build up. Make sure to include steps that specifically address their weak topics. For each step, provide a clear action (study_chapter, watch_video, take_test) and a rationale.

Also, create a simple, realistic daily study routine that helps them build a consistent learning habit (streak).

Output the entire plan in the specified JSON format.`,
});

const generateLearningPathFlow = ai.defineFlow(
  {
    name: 'generateLearningPathFlow',
    inputSchema: GenerateLearningPathInputSchema,
    outputSchema: GenerateLearningPathOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
