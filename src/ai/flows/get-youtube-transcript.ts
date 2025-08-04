'use server';
/**
 * @fileOverview Gets the transcript of a YouTube video.
 *
 * - getYouTubeTranscript - A function that gets the transcript of a YouTube video.
 * - GetYouTubeTranscriptInput - The input type for the getYouTubeTranscript function.
 * - GetYouTubeTranscriptOutput - The return type for the getYouTubeTranscript function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { YoutubeLoader } from '@langchain/community/document_loaders/web/youtube';

const GetYouTubeTranscriptInputSchema = z.object({
  videoId: z.string().describe('The ID of the YouTube video.'),
  apiKey: z.string().optional(),
});
export type GetYouTubeTranscriptInput = z.infer<typeof GetYouTubeTranscriptInputSchema>;

const GetYouTubeTranscriptOutputSchema = z.object({
  transcript: z.string().describe('The transcript of the YouTube video.'),
});
export type GetYouTubeTranscriptOutput = z.infer<typeof GetYouTubeTranscriptOutputSchema>;

export async function getYouTubeTranscript(input: GetYouTubeTranscriptInput): Promise<GetYouTubeTranscriptOutput> {
  return getYouTubeTranscriptFlow(input);
}

const getYouTubeTranscriptFlow = ai.defineFlow(
  {
    name: 'getYouTubeTranscriptFlow',
    inputSchema: GetYouTubeTranscriptInputSchema,
    outputSchema: GetYouTubeTranscriptOutputSchema,
  },
  async (input) => {
    const loader = YoutubeLoader.createFromUrl(`https://www.youtube.com/watch?v=${input.videoId}`, {
      language: 'en',
      addVideoInfo: false,
    });
    const docs = await loader.load();
    const transcript = docs.map((doc: { pageContent: string }) => doc.pageContent).join(' ');
    return { transcript };
  }
);