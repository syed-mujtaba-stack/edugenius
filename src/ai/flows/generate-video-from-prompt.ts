
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
import { Buffer } from 'buffer';


const GenerateVideoInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate the video from.'),
  apiKey: z.string().optional().describe('Optional user-provided API key.'),
});
export type GenerateVideoInput = z.infer<typeof GenerateVideoInputSchema>;

const GenerateVideoOutputSchema = z.object({
  video: z.string().describe('The generated video as a data URI in MP4 format.'),
});
export type GenerateVideoOutput = z.infer<typeof GenerateVideoOutputSchema>;

async function downloadAndEncodeVideo(video: { media: { url: string } }, apiKey?: string): Promise<string> {
    try {
      const fetch = (await import('node-fetch')).default;
      const finalApiKey = apiKey || process.env.GEMINI_API_KEY;
      if (!finalApiKey) {
          throw new Error('GEMINI_API_KEY environment variable not set and no custom key provided.');
      }
      
      // The media URL from the operation does not contain the API key, so we add it.
      if (!video.media?.url) {
          throw new Error('Video media URL is missing.');
      }
      
      // Check if the URL already has query parameters
      const separator = video.media.url.includes('?') ? '&' : '?';
      const videoUrlWithKey = `${video.media.url}${separator}key=${finalApiKey}`;
      
      const videoResponse = await fetch(videoUrlWithKey);

      if (!videoResponse.ok || !videoResponse.body) {
          throw new Error(`Failed to download video: ${videoResponse.statusText}`);
      }

      // node-fetch in v3 returns a stream, so we need to collect chunks as Uint8Array
      const chunks: Uint8Array[] = [];
      for await (const chunk of videoResponse.body) {
          chunks.push(chunk as Uint8Array);
      }
      
      // Convert chunks to a single buffer
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const videoBuffer = Buffer.concat(chunks, totalLength);
      
      return `data:video/mp4;base64,${videoBuffer.toString('base64')}`;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error during video download';
      console.error('Error downloading video:', errorMessage);
      throw new Error(`Failed to download video: ${errorMessage}`);
    }
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
    try {
      // Create the model instance with the API key
      const model = googleAI.model('veo-2.0-generate-001');
      
      // Prepare the options object with model and config
      const options = {
        model: model.name,
        config: {
          // Add video generation specific configuration
          durationSeconds: 5,
          aspectRatio: '16:9',
        },
        // Include API key if provided
        ...(apiKey ? { apiKey } : {}),
      };

      // Call generate with the prompt and options combined in a single object
      const response = await ai.generate({
        ...options,
        prompt,
      });

      // Handle the response structure
      let operation = (response as any).operation || (response as any).candidates?.[0]?.content?.operation;
    
    if (!operation) {
      // If no operation is found, check if there's a direct media URL in the response
      const mediaUrl = (response as any).media?.url || (response as any).candidates?.[0]?.content?.media?.url;
      if (mediaUrl) {
        const videoData = await downloadAndEncodeVideo({ media: { url: mediaUrl } }, apiKey);
        return { video: videoData };
      }
      throw new Error('No operation or media URL was returned from the video generation model.');
    }

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
      // @ts-ignore - The API expects options as a second argument
      operation = await ai.checkOperation(operation, { apiKey });
    }

    if (operation.error) {
      throw new Error(`Video generation failed: ${operation.error.message}`);
    }

    // Safely access the operation output and find the video part
    const outputContent = operation.output?.message?.content || [];
    
    // Try to find the video part with the specific 'video/mp4' content type
    let videoPart = outputContent.find((p: any) => p.media?.contentType === 'video/mp4');
    
    // If not found, fall back to finding any part with a 'video/*' content type
    if (!videoPart) {
      videoPart = outputContent.find((p: any) => p.media?.contentType?.startsWith('video/'));
    }

    // As a final fallback, check for any media part if contentType is not populated
    if (!videoPart) {
      videoPart = outputContent.find((p: any) => !!p.media?.url);
    }

    if (!videoPart) {
        throw new Error('No video found in the completed operation result. The model may not have produced a video for this prompt.');
    }
    
    const videoDataUri = await downloadAndEncodeVideo(videoPart, apiKey);

    return {
        video: videoDataUri,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error during video generation';
    console.error('Error in generateVideoFromPromptFlow:', errorMessage);
    throw new Error(`Failed to generate video: ${errorMessage}`);
  }
});
