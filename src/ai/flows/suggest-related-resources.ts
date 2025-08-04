'use server';
/**
 * @fileOverview Suggests related resources for a given topic.
 *
 * - suggestRelatedResources - A function that suggests related resources for a given topic.
 * - SuggestRelatedResourcesInput - The input type for the suggestRelatedResources function.
 * - SuggestRelatedResourcesOutput - The return type for the suggestRelatedResources function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ResourceSchema = z.object({
  title: z.string().describe('The title of the resource.'),
  url: z.string().describe('The URL of the resource.'),
  type: z.enum(['article', 'book', 'video']).describe('The type of the resource.'),
});

const SuggestRelatedResourcesInputSchema = z.object({
  topic: z.string().describe('The topic to suggest related resources for.'),
  apiKey: z.string().optional(),
});
export type SuggestRelatedResourcesInput = z.infer<typeof SuggestRelatedResourcesInputSchema>;

const SuggestRelatedResourcesOutputSchema = z.object({
  resources: z.array(ResourceSchema).describe('A list of related resources.'),
});
export type SuggestRelatedResourcesOutput = z.infer<typeof SuggestRelatedResourcesOutputSchema>;

export async function suggestRelatedResources(input: SuggestRelatedResourcesInput): Promise<SuggestRelatedResourcesOutput> {
  return suggestRelatedResourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelatedResourcesPrompt',
  input: { schema: SuggestRelatedResourcesInputSchema },
  output: { schema: SuggestRelatedResourcesOutputSchema },
  prompt: `You are an expert at suggesting related resources. Suggest 3-5 related resources (articles, books, or videos) for the following topic:

{{topic}}

The output should be in the specified JSON format.`,
});

const suggestRelatedResourcesFlow = ai.defineFlow(
  {
    name: 'suggestRelatedResourcesFlow',
    inputSchema: SuggestRelatedResourcesInputSchema,
    outputSchema: SuggestRelatedResourcesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);