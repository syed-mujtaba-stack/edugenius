
'use server';
/**
 * @fileOverview Converts text to speech using an AI model.
 *
 * - generateAudioFromText - A function that takes a string and returns audio data.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import wav from 'wav';

// Helper function to convert raw PCM audio buffer to WAV format as a Base64 string
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000, // Gemini TTS model outputs at 24000 Hz
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (chunk) => {
      bufs.push(chunk);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const GenerateAudioInputSchema = z.object({
  text: z.string(),
  apiKey: z.string().optional(),
});
export type GenerateAudioInput = z.infer<typeof GenerateAudioInputSchema>;


const GenerateAudioOutputSchema = z.object({
  media: z.string().describe("The generated audio as a data URI in WAV format."),
});
export type GenerateAudioOutput = z.infer<typeof GenerateAudioOutputSchema>;

export async function generateAudioFromText(input: GenerateAudioInput): Promise<GenerateAudioOutput> {
  return generateAudioFromTextFlow(input);
}

const generateAudioFromTextFlow = ai.defineFlow(
  {
    name: 'generateAudioFromTextFlow',
    inputSchema: GenerateAudioInputSchema,
    outputSchema: GenerateAudioOutputSchema,
  },
  async ({ text, apiKey }) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' }, // A standard male voice
          },
        },
      },
      prompt: text,
    }, { apiKey });

    if (!media?.url) {
      throw new Error('No media was returned from the TTS model.');
    }

    // The data URI is 'data:audio/pcm;base64,....'
    // We need to extract the Base64 part and convert it to a WAV buffer
    const pcmBase64 = media.url.substring(media.url.indexOf(',') + 1);
    const audioBuffer = Buffer.from(pcmBase64, 'base64');
    
    const wavBase64 = await toWav(audioBuffer);

    return {
      media: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
