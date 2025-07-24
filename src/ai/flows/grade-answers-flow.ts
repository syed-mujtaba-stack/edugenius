'use server';
/**
 * @fileOverview An AI agent for grading student answers and detecting potential cheating.
 *
 * - gradeAnswers - A function that handles the answer grading process.
 * - GradeAnswersInput - The input type for the gradeAnswers function.
 * - GradeAnswersOutput - The return type for the gradeAnswers function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const QuestionAnswerSchema = z.object({
  question: z.string(),
  correctAnswer: z.string(),
  studentAnswer: z.string(),
});

const GradeAnswersInputSchema = z.object({
  answers: z.array(QuestionAnswerSchema),
  // No apiKey here, as grading should use the system's key for consistency.
});
export type GradeAnswersInput = z.infer<typeof GradeAnswersInputSchema>;

const GradedAnswerSchema = z.object({
  question: z.string(),
  isCorrect: z.boolean(),
  feedback: z.string(),
});

const GradeAnswersOutputSchema = z.object({
  score: z.number().describe('The final score as a percentage.'),
  results: z.array(GradedAnswerSchema).describe('An array of graded answers with feedback.'),
  cheatingAnalysis: z.string().describe('An analysis of the student\'s answers for any signs of cheating, such as copy-pasting from an external source, answers that are too perfect, or if they switched tabs during the exam.'),
});
export type GradeAnswersOutput = z.infer<typeof GradeAnswersOutputSchema>;

export async function gradeAnswers(input: GradeAnswersInput): Promise<GradeAnswersOutput> {
  return gradeAnswersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'gradeAnswersPrompt',
  input: { schema: GradeAnswersInputSchema },
  output: { schema: GradeAnswersOutputSchema },
  prompt: `You are an AI teacher. Your task is to grade the student's answers and also analyze for potential cheating.

First, for each question, determine if the student's answer is correct. For non-MCQ questions, the answer might be phrased differently but still be correct. Provide brief, constructive feedback for each answer, especially if it's incorrect.

Second, analyze the set of answers for any signs of academic dishonesty. Look for answers that seem copy-pasted, use vocabulary inconsistent with the student's level, or are suspiciously perfect. Take into account any warnings about tab-switching. Provide a brief cheating analysis summary.

Finally, calculate the total score as a percentage based on the number of correct answers.

Here are the questions and answers:
{{#each answers}}
- Question: {{this.question}}
- Correct Answer: {{this.correctAnswer}}
- Student's Answer: {{this.studentAnswer}}
---
{{/each}}

Provide the grading results in the specified JSON format.`,
});

const gradeAnswersFlow = ai.defineFlow(
  {
    name: 'gradeAnswersFlow',
    inputSchema: GradeAnswersInputSchema,
    outputSchema: GradeAnswersOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
