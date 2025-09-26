import { config } from 'dotenv';
config();

import { generateFlashcards } from '@/ai/flows/generate-flashcards';
import {
  GenerateFlashcardsInputSchema,
  GenerateFlashcardsOutputSchema,
} from '@/ai/schemas/flashcards';

async function verify() {
  const input = {
    subject: 'Biology',
    topic: 'Cell Structure',
    focusPoints: ['Organelles', 'Cell membrane', 'Differences between plant and animal cells'],
    numberOfCards: 5,
    apiKey: process.env.GEMINI_API_KEY,
  };

  const parsedInput = GenerateFlashcardsInputSchema.safeParse(input);
  if (!parsedInput.success) {
    console.error('Input validation failed:', parsedInput.error.flatten());
    process.exit(1);
  }

  try {
    const result = await generateFlashcards(parsedInput.data);
    const parsedOutput = GenerateFlashcardsOutputSchema.safeParse(result);
    if (!parsedOutput.success) {
      console.error('Output validation failed:', parsedOutput.error.flatten());
      process.exit(1);
    }

    console.log('Flashcard generation succeeded. Sample output:');
    console.log(JSON.stringify(parsedOutput.data, null, 2));
  } catch (error) {
    console.error('Flashcard generation threw an error:', error);
    process.exit(1);
  }
}

verify();
