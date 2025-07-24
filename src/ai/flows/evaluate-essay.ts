
'use server';
/**
 * @fileOverview An AI agent for evaluating student essays.
 *
 * - evaluateEssay - A function that handles the essay evaluation process.
 * - EvaluateEssayInput - The input type for the evaluateEssay function.
 * - EvaluateEssayOutput - The return type for the evaluateEssay function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EvaluateEssayInputSchema = z.object({
  essayText: z.string().describe("The full text of the student's essay."),
  apiKey: z.string().optional(),
});
export type EvaluateEssayInput = z.infer<typeof EvaluateEssayInputSchema>;

const FeedbackSchema = z.object({
  grammar: z.string().describe("Feedback on the essay's grammar and spelling."),
  structure: z.string().describe("Feedback on the essay's structure and organization."),
  creativity: z.string().describe("Feedback on the essay's creativity and originality."),
  logic: z.string().describe("Feedback on the essay's logic, arguments, and clarity."),
});

const EvaluateEssayOutputSchema = z.object({
  score: z.number().describe('The overall score for the essay out of 100.'),
  feedback: FeedbackSchema,
  overallComments: z.string().describe("A summary of the essay's strengths and weaknesses."),
  improvementTips: z.array(z.string()).describe("Actionable tips for the student to improve their writing."),
  sampleEssay: z.string().describe("An A-grade sample essay on the same topic for comparison."),
});
export type EvaluateEssayOutput = z.infer<typeof EvaluateEssayOutputSchema>;

export async function evaluateEssay(input: EvaluateEssayInput): Promise<EvaluateEssayOutput> {
  return evaluateEssayFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evaluateEssayPrompt',
  input: { schema: EvaluateEssayInputSchema },
  output: { schema: EvaluateEssayOutputSchema },
  prompt: `You are an expert English teacher and essay evaluator. A student has submitted an essay for review.

Your task is to perform a comprehensive evaluation of the following essay:
---
{{essayText}}
---

First, infer the topic of the essay.

Then, evaluate the essay based on the following criteria:
1.  **Grammar & Spelling:** Check for correctness.
2.  **Structure & Organization:** Assess the flow, paragraphing, and coherence.
3.  **Creativity & Originality:** Judge the uniqueness of ideas and expression.
4.  **Logic & Clarity:** Evaluate the strength of arguments and clarity of thought.

Provide a score out of 100.

Give specific, constructive feedback for each criterion. Also, provide a summary of overall comments and a list of actionable improvement tips.

Finally, write a short, A-grade sample essay on the same topic that the student can use as a reference.

Output the entire evaluation in the specified JSON format.`,
});

const evaluateEssayFlow = ai.defineFlow(
  {
    name: 'evaluateEssayFlow',
    inputSchema: EvaluateEssayInputSchema,
    outputSchema: EvaluateEssayOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
