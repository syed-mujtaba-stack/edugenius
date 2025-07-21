
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI() // The API key is automatically sourced from the GEMINI_API_KEY environment variable.
  ],
  logLevel: "debug",
  model: 'googleai/gemini-2.0-flash', // Set a default model for all generate calls
});
