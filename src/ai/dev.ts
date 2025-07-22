
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-chapter.ts';
import '@/ai/flows/generate-q-and-a.ts';
import '@/ai/flows/create-test.ts';
import '@/ai/flows/grade-answers-flow.ts';
import '@/ai/flows/generate-learning-path.ts';
import '@/ai/flows/ask-ai-tutor.ts';
import '@/ai/flows/generate-career-advice.ts';
import '@/ai/flows/evaluate-essay.ts';
import '@/ai/flows/generate-audio-from-text.ts';
import '@/ai/flows/generate-lesson-plan.ts';
