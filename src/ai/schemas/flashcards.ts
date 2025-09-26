import { z } from 'genkit';

export const FlashcardSchema = z.object({
  question: z.string().describe('The prompt shown on the flashcard.'),
  answer: z.string().describe('The detailed answer revealed on flip.'),
  hint: z.string().optional().describe('An optional hint to nudge the learner.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty level of the flashcard.'),
});

export const GenerateFlashcardsInputSchema = z.object({
  subject: z.string().min(2).describe('The broad subject area (e.g., "Biology").'),
  topic: z.string().min(2).describe('The specific topic to study (e.g., "Photosynthesis").'),
  focusPoints: z.array(z.string()).default([]).describe('Key subtopics or concepts to emphasize.'),
  numberOfCards: z.number().int().min(3).max(20).default(8).describe('Desired number of flashcards (3-20).'),
  apiKey: z.string().optional(),
});

export const GenerateFlashcardsOutputSchema = z.object({
  flashcards: z.array(FlashcardSchema).describe('The generated flashcards ready for study.'),
  studyTips: z.array(z.string()).describe('Actionable study tips tailored to the topic.'),
});
