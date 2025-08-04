'use server';
/**
 * @fileOverview Executes TypeScript code.
 *
 * - executeTypeScriptCode - A function that executes TypeScript code.
 * - ExecuteTypeScriptCodeInput - The input type for the executeTypeScriptCode function.
 * - ExecuteTypeScriptCodeOutput - The return type for the executeTypeScriptCode function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { NodeVM } from 'vm2';

const ExecuteTypeScriptCodeInputSchema = z.object({
  code: z.string().describe('The TypeScript code to execute.'),
  apiKey: z.string().optional(),
});
export type ExecuteTypeScriptCodeInput = z.infer<typeof ExecuteTypeScriptCodeInputSchema>;

const ExecuteTypeScriptCodeOutputSchema = z.object({
  result: z.any().describe('The result of the executed code.'),
});
export type ExecuteTypeScriptCodeOutput = z.infer<typeof ExecuteTypeScriptCodeOutputSchema>;

export async function executeTypeScriptCode(input: ExecuteTypeScriptCodeInput): Promise<ExecuteTypeScriptCodeOutput> {
  return executeTypeScriptCodeFlow(input);
}

const executeTypeScriptCodeFlow = ai.defineFlow(
  {
    name: 'executeTypeScriptCodeFlow',
    inputSchema: ExecuteTypeScriptCodeInputSchema,
    outputSchema: ExecuteTypeScriptCodeOutputSchema,
  },
  async (input) => {
    const vm = new NodeVM({
      console: 'inherit',
      sandbox: {},
      require: {
        external: true,
      },
    });

    const result = vm.run(input.code);
    return { result };
  }
);