import { NextResponse } from 'next/server';
import { explainCodeError } from '@/ai/flows/explain-code-error';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { language, code, errorOutput, stdin, apiKey } = body ?? {};

    if (!language || !code || !errorOutput) {
      return NextResponse.json(
        { error: 'language, code, and errorOutput are required.' },
        { status: 400 },
      );
    }

    const result = await explainCodeError({
      language,
      code,
      errorOutput,
      stdin,
      apiKey,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error explaining code failure:', error);
    return NextResponse.json({ error: 'Failed to explain code error.' }, { status: 500 });
  }
}
