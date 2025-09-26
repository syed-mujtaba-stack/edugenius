import { NextResponse } from 'next/server';
import { generateFlashcards } from '@/ai/flows/generate-flashcards';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      subject,
      topic,
      focusPoints = [],
      numberOfCards = 8,
      apiKey,
    } = body ?? {};

    if (!subject || !topic) {
      return NextResponse.json(
        { error: 'Subject and topic are required.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(focusPoints)) {
      return NextResponse.json(
        { error: 'focusPoints must be an array of strings.' },
        { status: 400 }
      );
    }

    const result = await generateFlashcards({
      subject,
      topic,
      focusPoints,
      numberOfCards,
      apiKey,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json(
      { error: 'Failed to generate flashcards.' },
      { status: 500 }
    );
  }
}
