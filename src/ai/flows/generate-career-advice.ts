
'use server';
/**
 * @fileOverview Generates career advice and a roadmap for a student.
 *
 * - generateCareerAdvice - A function that creates a custom career plan.
 * - GenerateCareerAdviceInput - The input type for the function.
 * - GenerateCareerAdviceOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateCareerAdviceInputSchema = z.object({
  interests: z.array(z.string()).describe('A list of subjects or topics the student is interested in.'),
  strengths: z.array(z.string()).describe('A list of subjects or skills the student is good at.'),
  currentEducation: z.string().describe('The student\'s current level of education (e.g., "Matric Commerce", "A-Levels Pre-Engineering").'),
  apiKey: z.string().optional(),
});
export type GenerateCareerAdviceInput = z.infer<typeof GenerateCareerAdviceInputSchema>;

const CareerSuggestionSchema = z.object({
  field: z.string().describe("The suggested career field (e.g., 'Data Science', 'Graphic Design')."),
  reason: z.string().describe("A brief explanation of why this field is a good fit."),
});

const RoadmapStepSchema = z.object({
  step: z.number(),
  title: z.string().describe("The title of this step in the roadmap (e.g., 'Learn Python')."),
  description: z.string().describe("A detailed description of what to do in this step."),
  resources: z.array(z.string()).optional().describe("A list of recommended resources like courses, books, or websites."),
});

const GenerateCareerAdviceOutputSchema = z.object({
  suggestedCareers: z.array(CareerSuggestionSchema).describe("A list of 3-5 career suggestions."),
  topCareerRoadmap: z.object({
    career: z.string().describe("The top recommended career path."),
    roadmap: z.array(RoadmapStepSchema).describe("A detailed step-by-step plan to achieve this career."),
  }).describe("A detailed roadmap for the most suitable career path."),
});
export type GenerateCareerAdviceOutput = z.infer<typeof GenerateCareerAdviceOutputSchema>;

export async function generateCareerAdvice(input: GenerateCareerAdviceInput): Promise<GenerateCareerAdviceOutput> {
  return generateCareerAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCareerAdvicePrompt',
  input: { schema: GenerateCareerAdviceInputSchema },
  output: { schema: GenerateCareerAdviceOutputSchema },
  prompt: `You are an expert career counselor for Pakistani students. Your task is to provide personalized career advice and a clear, actionable roadmap.

A student has the following profile:
- Current Education: {{currentEducation}}
- Interests: {{#each interests}} - {{this}} {{/each}}
- Strengths: {{#each strengths}} - {{this}} {{/each}}

First, suggest 3-5 potential career fields that align with their profile. For each suggestion, provide a short reason.

Second, for the single BEST career path from your suggestions, create a detailed, step-by-step roadmap. The roadmap should start from their current education level and guide them on what to study next, what skills to acquire, and what kind of projects to build. Be specific and provide resource suggestions if possible. For example, if you suggest "Data Scientist", the roadmap should be like "How to become a Data Scientist after {{currentEducation}}".

Output the entire response in the specified JSON format.`,
});

const generateCareerAdviceFlow = ai.defineFlow(
  {
    name: 'generateCareerAdviceFlow',
    inputSchema: GenerateCareerAdviceInputSchema,
    outputSchema: GenerateCareerAdviceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
