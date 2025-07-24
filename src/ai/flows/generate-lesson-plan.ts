
'use server';
/**
 * @fileOverview AI-powered lesson plan generator.
 *
 * - generateLessonPlan - A function that generates a lesson plan.
 * - GenerateLessonPlanInput - The input type for the generateLessonPlan function.
 * - GenerateLessonPlanOutput - The return type for the generateLessonPlan function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateLessonPlanInputSchema = z.object({
  topic: z.string().describe('The main topic for the lesson plan.'),
  duration: z.string().describe('The total duration of the lesson (e.g., 45 minutes).'),
  objective: z.string().describe('The learning objective for this lesson.'),
  apiKey: z.string().optional(),
});
export type GenerateLessonPlanInput = z.infer<typeof GenerateLessonPlanInputSchema>;

const LessonModuleSchema = z.object({
    title: z.string().describe("The title of the lesson module."),
    duration: z.string().describe("The estimated time for this module."),
    activities: z.array(z.string()).describe("A list of activities for this module."),
});

const GenerateLessonPlanOutputSchema = z.object({
  lessonTitle: z.string().describe('The overall title of the lesson.'),
  modules: z.array(LessonModuleSchema).describe('An array of lesson modules.'),
  assessment: z.string().describe('A suggestion for how to assess student learning.'),
});
export type GenerateLessonPlanOutput = z.infer<typeof GenerateLessonPlanOutputSchema>;

export async function generateLessonPlan(input: GenerateLessonPlanInput): Promise<GenerateLessonPlanOutput> {
  return generateLessonPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLessonPlanPrompt',
  input: { schema: GenerateLessonPlanInputSchema },
  output: { schema: GenerateLessonPlanOutputSchema },
  prompt: `You are an expert instructional designer. Create a detailed lesson plan for a teacher based on the following parameters:

Topic: {{topic}}
Lesson Duration: {{duration}}
Learning Objective: {{objective}}

The lesson plan should be broken down into logical modules, each with a title, estimated duration, and a list of engaging activities suitable for a classroom.
Also, provide a creative suggestion for a final assessment to check for student understanding.

Output the entire lesson plan in the specified JSON format.`,
});

const generateLessonPlanFlow = ai.defineFlow(
  {
    name: 'generateLessonPlanFlow',
    inputSchema: GenerateLessonPlanInputSchema,
    outputSchema: GenerateLessonPlanOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
