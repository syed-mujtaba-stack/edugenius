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
import { runInNewContext, createContext } from 'vm';
import { promisify } from 'util';
import * as ts from 'typescript';

const ExecuteTypeScriptCodeInputSchema = z.object({
  code: z.string().describe('The TypeScript code to execute.'),
  apiKey: z.string().optional(),
});
export type ExecuteTypeScriptCodeInput = z.infer<typeof ExecuteTypeScriptCodeInputSchema>;

const ExecuteTypeScriptCodeOutputSchema = z.object({
  result: z.any().describe('The result of the executed code.'),
  error: z.string().optional().describe('Error message if execution fails'),
});
export type ExecuteTypeScriptCodeOutput = z.infer<typeof ExecuteTypeScriptCodeOutputSchema>;

// Simple TypeScript to JavaScript transpiler
function transpileTypeScript(code: string): string {
  try {
    return ts.transpileModule(code, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
        skipLibCheck: true,
      },
    }).outputText;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during TypeScript transpilation';
    console.error('TypeScript transpilation error:', errorMessage);
    throw new Error(`TypeScript compilation failed: ${errorMessage}`);
  }
}

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
    try {
      // Transpile TypeScript to JavaScript
      const jsCode = transpileTypeScript(input.code);
      
      // Create a safe context for code execution
      const context = createContext({
        console: {
          log: (...args: any[]) => console.log(...args),
          error: (...args: any[]) => console.error(...args),
          warn: (...args: any[]) => console.warn(...args),
        },
        // Add any other safe globals you want to expose
        setTimeout: promisify(setTimeout),
        setImmediate: promisify(setImmediate),
        // Note: Be very careful about what you expose here
      });

      // Execute the code in the sandboxed context
      const result = runInNewContext(jsCode, context, {
        timeout: 5000, // 5 second timeout
        displayErrors: true,
      });

      return { 
        result: result instanceof Promise ? await result : result 
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during code execution';
      console.error('Code execution error:', errorMessage);
      return { 
        result: null,
        error: errorMessage
      };
    }
  }
);