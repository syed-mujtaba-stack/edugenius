'use server';
/**
 * @fileoverview Explains runtime or compilation errors and suggests fixes.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExplainCodeErrorInputSchema = z.object({
  language: z
    .enum(['javascript', 'python', 'cpp', 'java', 'go', 'c', 'ruby', 'typescript'])
    .describe('Programming language for the submitted code.'),
  code: z.string().describe('The source code written by the student.'),
  errorOutput: z
    .string()
    .describe('The stderr or error message produced when running the code.'),
  stdin: z.string().optional().describe('Optional standard input used while executing.'),
  apiKey: z.string().optional(),
});
export type ExplainCodeErrorInput = z.infer<typeof ExplainCodeErrorInputSchema>;

const ExplainCodeErrorOutputSchema = z.object({
  explanation: z
    .string()
    .describe('Human-readable explanation of what went wrong and why.'),
  suggestions: z
    .array(z.string())
    .describe('Actionable steps the student can take to resolve the issue.'),
  correctedCode: z
    .string()
    .optional()
    .describe('An updated version of the code that addresses the error.'),
});
export type ExplainCodeErrorOutput = z.infer<typeof ExplainCodeErrorOutputSchema>;

export async function explainCodeError(
  input: ExplainCodeErrorInput,
): Promise<ExplainCodeErrorOutput> {
  return explainCodeErrorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainCodeErrorPrompt',
  input: { schema: ExplainCodeErrorInputSchema },
  output: { schema: ExplainCodeErrorOutputSchema },
  prompt: `You are an experienced programming instructor helping a Pakistani CS student debug code.

Language: {{language}}

Student code:
\n\`\`\`{{language}}
{{code}}
\`\`\`

Execution/Input (if any):
{{#if stdin}}
\`\`\`
{{stdin}}
\`\`\`
{{else}}
(none provided)
{{/if}}

Error output:
\`\`\`
{{errorOutput}}
\`\`\`

Perform the following:
1. Explain clearly (in simple English) what caused the error.
2. Provide a list of practical suggestions to fix the issue.
3. If feasible, provide a corrected version of the code. Make sure it is complete and runnable.

Keep the explanation encouraging and concise, and avoid scolding the student.`,
});

const explainCodeErrorFlow = ai.defineFlow(
  {
    name: 'explainCodeErrorFlow',
    inputSchema: ExplainCodeErrorInputSchema,
    outputSchema: ExplainCodeErrorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
