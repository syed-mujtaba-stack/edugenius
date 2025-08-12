
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Configure genkit with Google AI plugin
export const ai = genkit({
  plugins: [
    googleAI({
      // API key will be read from GEMINI_API_KEY environment variable
      // No additional configuration needed here
    }),
  ],
  // Configure default model for generation
  model: googleAI.model('gemini-2.0-flash'),
});
