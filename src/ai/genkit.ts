
import {genkit, GenerationCommonConfig} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// A helper function to get the API key.
// In a real-world scenario, you might have more complex logic here.
const getApiKey = (options?: GenerationCommonConfig): string | undefined => {
  // If the user provides an API key in the options, use that.
  if (options?.apiKey) {
    return options.apiKey;
  }
  // Otherwise, fallback to the environment variable.
  return process.env.GEMINI_API_KEY;
}

export const ai = genkit({
  plugins: [
    googleAI({
      // Pass a function to dynamically resolve the API key
      apiKey: getApiKey
    })
  ],
  model: 'googleai/gemini-2.0-flash',
});
