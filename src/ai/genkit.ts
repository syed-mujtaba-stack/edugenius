
import {genkit, GenerationCommonConfig} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      // The API key will be sourced from the GEMINI_API_KEY environment variable.
      // For requests where a user provides their own key, it should be passed
      // in the `apiKey` field of the config object for that specific `generate` or `run` call.
      apiKey: process.env.GEMINI_API_KEY,
    })
  ],
  logLevel: "debug",
  model: 'googleai/gemini-2.0-flash',
});
