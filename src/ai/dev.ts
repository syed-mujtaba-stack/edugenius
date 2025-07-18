import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-chapter.ts';
import '@/ai/flows/generate-q-and-a.ts';
import '@/ai/flows/create-test.ts';
import '@/ai/flows/grade-answers-flow.ts';
import '@/ai/flows/generate-lesson-plan.ts';
