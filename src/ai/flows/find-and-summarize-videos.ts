'use server';
/**
 * @fileOverview An AI agent that finds YouTube videos on a topic and summarizes their descriptions.
 *
 * - findAndSummarizeVideos - Finds and summarizes YouTube videos.
 * - FindAndSummarizeVideosInput - Input type for the function.
 * - FindAndSummarizeVideosOutput - Return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

// Define schemas and types inside the file, but do not export them directly.
const FindAndSummarizeVideosInputSchema = z.object({
  topic: z.string().describe('The topic the user wants to learn about.'),
  apiKey: z.string().optional(),
});
export type FindAndSummarizeVideosInput = z.infer<typeof FindAndSummarizeVideosInputSchema>;

const VideoResultSchema = z.object({
    id: z.string(),
    title: z.string(),
    thumbnail: z.string(),
    channelTitle: z.string(),
    summary: z.string().describe('An AI-generated summary of the video description.'),
});

const FindAndSummarizeVideosOutputSchema = z.object({
  videos: z.array(VideoResultSchema).describe('A list of found videos with their summaries.'),
});
export type FindAndSummarizeVideosOutput = z.infer<typeof FindAndSummarizeVideosOutputSchema>;

// Define a prompt template for summarization
const summarizePrompt = ai.definePrompt({
    name: 'summarizeVideoDescription',
    input: { schema: z.object({ description: z.string() }) },
    output: { schema: z.string() },
    prompt: `Please provide a concise, one-paragraph summary of the following video description. Focus on the main topics covered in the video. If the description is very short or unhelpful, just state "No summary available."\n\nDescription:\n"""\n{{description}}\n"""\n\nSummary:`,
});

// The main flow
const findAndSummarizeVideosFlow = ai.defineFlow(
  {
    name: 'findAndSummarizeVideosFlow',
    inputSchema: FindAndSummarizeVideosInputSchema,
    outputSchema: FindAndSummarizeVideosOutputSchema,
  },
  async ({ topic, apiKey }) => {
    if (!YOUTUBE_API_KEY) {
        throw new Error('YouTube API key is not configured on the server.');
    }
    
    // Step 1: Search for videos on YouTube
    const searchParams = new URLSearchParams({
        part: 'snippet',
        q: `${topic} tutorial full course`, // Make the query more specific
        type: 'video',
        maxResults: '6', // Limit to 6 to avoid too many API calls
        key: YOUTUBE_API_KEY,
    });

    const youtubeResponse = await fetch(`${YOUTUBE_API_URL}?${searchParams.toString()}`);
    const youtubeData = await youtubeResponse.json();

    if (youtubeData.error) {
        console.error('YouTube API Error:', youtubeData.error.message);
        throw new Error(`YouTube API Error: ${youtubeData.error.message}`);
    }

    if (!youtubeData.items || youtubeData.items.length === 0) {
        return { videos: [] };
    }

    // Step 2: Summarize the description for each video
    const summarizedVideos = await Promise.all(
      youtubeData.items.map(async (item: any) => {
        const description = item.snippet.description;
        let summary = 'No summary available.';

        if (description && description.trim().length > 50) { // Only summarize if description is meaningful
            try {
                const { output } = await summarizePrompt({ description }, { apiKey });
                summary = output || 'Could not generate summary.';
            } catch (e) {
                console.warn(`Could not summarize description for video ${item.id.videoId}`, e);
                summary = "AI summary failed for this video."
            }
        }
        
        return {
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.high.url,
          channelTitle: item.snippet.channelTitle,
          summary: summary,
        };
      })
    );
    
    return { videos: summarizedVideos };
  }
);


// Main exported function - This is the only export that Next.js will see.
export async function findAndSummarizeVideos(input: FindAndSummarizeVideosInput): Promise<FindAndSummarizeVideosOutput> {
  return findAndSummarizeVideosFlow(input);
}
