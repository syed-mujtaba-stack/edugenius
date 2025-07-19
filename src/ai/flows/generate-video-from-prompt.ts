
'use server';
/**
 * @fileOverview Converts a text prompt into a short video using the Veo model.
 *
 * - generateVideoFromPrompt - A function that takes a string prompt and returns video data.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import { MediaPart } from 'genkit';

const GenerateVideoInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate the video from.'),
  apiKey: z.string().optional().describe('Optional user-provided API key.'),
});
export type GenerateVideoInput = z.infer<typeof GenerateVideoInputSchema>;

const GenerateVideoOutputSchema = z.object({
  video: z.string().describe('The generated video as a data URI in MP4 format.'),
});
export type GenerateVideoOutput = z.infer<typeof GenerateVideoOutputSchema>;

async function downloadAndEncodeVideo(video: MediaPart, apiKey?: string): Promise<string> {
    const fetch = (await import('node-fetch')).default;
    const finalApiKey = apiKey || process.env.GEMINI_API_KEY;
    if (!finalApiKey) {
        throw new Error('GEMINI_API_KEY environment variable not set and no custom key provided.');
    }
    
    const videoUrlWithKey = `${video.media!.url}&key=${finalApiKey}`;
    const videoResponse = await fetch(videoUrlWithKey);

    if (!videoResponse.ok || !videoResponse.body) {
        throw new Error(`Failed to download video: ${videoResponse.statusText}`);
    }

    const videoBuffer = await videoResponse.buffer();
    return `data:video/mp4;base64,${videoBuffer.toString('base64')}`;
}


export async function generateVideoFromPrompt(input: GenerateVideoInput): Promise<GenerateVideoOutput> {
    return generateVideoFromPromptFlow(input);
}


const generateVideoFromPromptFlow = ai.defineFlow(
  {
    name: 'generateVideoFromPromptFlow',
    inputSchema: GenerateVideoInputSchema,
    outputSchema: GenerateVideoOutputSchema,
  },
  async ({ prompt, apiKey }) => {
    let { operation } = await ai.generate({
        model: googleAI.model('veo-2.0-generate-001'),
        prompt,
        config: {
            durationSeconds: 5,
            aspectRatio: '16:9',
        },
    }, { apiKey });

    if (!operation) {
        throw new Error('Expected the model to return an operation.');
    }

    // Poll for completion
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
        operation = await ai.checkOperation(operation, { apiKey });
    }

    if (operation.error) {
        throw new Error(`Video generation failed: ${operation.error.message}`);
    }

    const videoPart = operation.output?.message?.content.find((p) => !!p.media && p.media.contentType === 'video/mp4');
    if (!videoPart) {
        // Look for any video part if specific content type is not present
        const anyVideoPart = operation.output?.message?.content.find((p) => !!p.media && p.media.contentType?.startsWith('video/'));
        if (!anyVideoPart) {
          throw new Error('No video found in the completed operation result.');
        }
        console.warn("Video content type is not 'video/mp4', but proceeding anyway.", anyVideoPart.media);
        const videoDataUri = await downloadAndEncodeVideo(anyVideoPart, apiKey);
        return { video: videoDataUri };
    }
    
    const videoDataUri = await downloadAndEncodeVideo(videoPart, apiKey);

    return {
        video: videoDataUri,
    };
  }
);
