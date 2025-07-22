
'use server';
/**
 * @fileOverview An AI agent that answers visitor questions about the EduGenius app.
 *
 * - answerVisitorQuestion - A function that handles the conversation.
 * - AnswerVisitorQuestionInput - The input type for the function.
 * - AnswerVisitorQuestionOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnswerVisitorQuestionInputSchema = z.object({
  question: z.string().describe("The visitor's question about the app."),
  // No API key here, as this is a public-facing flow and will use the system's key.
});
export type AnswerVisitorQuestionInput = z.infer<typeof AnswerVisitorQuestionInputSchema>;

const AnswerVisitorQuestionOutputSchema = z.object({
  answer: z.string().describe("The AI's answer to the visitor's question."),
});
export type AnswerVisitorQuestionOutput = z.infer<typeof AnswerVisitorQuestionOutputSchema>;

export async function answerVisitorQuestion(input: AnswerVisitorQuestionInput): Promise<AnswerVisitorQuestionOutput> {
  return answerVisitorQuestionFlow(input);
}

const appFeaturesContext = `
EduGenius - Your AI-Powered Learning Co-Pilot for students in Pakistan.

Core Features:
1. Personalized AI Learning Paths: Analyzes goals, identifies weaknesses, and creates a custom study roadmap with daily routines.
2. AI Audio Generator: Converts text notes into downloadable, high-quality audio voice-overs.
3. Career Counseling & Skill Mapping: Suggests career paths based on interests and provides a step-by-step roadmap.
4. AI Essay Evaluator: Gives instant feedback on essays (grammar, structure, creativity, logic), a score, and an A-grade sample.
5. Chapter Summarizer & Q&A Generator: Summarizes long chapters and creates questions & answers from any topic.
6. AI Test Generator & Proctoring: Creates custom tests (MCQs, Short/Long Questions) with practice and secure exam modes, including optional AI proctoring to detect cheating.
7. Download Center: Allows users to download generated notes, summaries, and tests as TXT or PDF files.
8. Free Tech Courses: A curated library of free YouTube courses on web development, AI, and programming.
9. Community Hub & AI Tutor: An AI chatbot for instant doubt solving and a community discussion area.
10. Advanced Features: Voice assistant, custom API key support, smart search, and bookmarking.
11. Admin & Teacher Panels: Dashboards for system admins and teachers to manage users and classes.
`;

const prompt = ai.definePrompt({
  name: 'answerVisitorQuestionPrompt',
  input: { schema: AnswerVisitorQuestionInputSchema },
  output: { schema: AnswerVisitorQuestionOutputSchema },
  prompt: `You are a friendly and helpful chatbot for a web app called "EduGenius". Your only purpose is to answer questions about what EduGenius is and what it can do.

Use the following context to answer the user's question. Be concise and helpful.

Context about EduGenius:
---
${appFeaturesContext}
---

IMPORTANT: Do NOT answer any questions that are not related to EduGenius. If the user asks about anything else (e.g., "what is the capital of France?", "write me a poem", "who are you?"), you must politely decline and steer the conversation back to the app. For example, say: "I can only answer questions about the EduGenius application. Would you like to know about its features, like the AI Test Generator or Career Counseling?"

Visitor's Question: "{{question}}"

Answer the question based *only* on the provided context.`,
});

const answerVisitorQuestionFlow = ai.defineFlow(
  {
    name: 'answerVisitorQuestionFlow',
    inputSchema: AnswerVisitorQuestionInputSchema,
    outputSchema: AnswerVisitorQuestionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input); // Uses the system's default API key
    return output!;
  }
);
