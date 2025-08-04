import { NextRequest, NextResponse } from 'next/server';
import { executeTypeScriptCode } from '@/ai/flows/execute-typescript-code';

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  if (code) {
    try {
      const result = await executeTypeScriptCode({ code });
      return NextResponse.json(result);
    } catch (error) {
      console.error('Error executing code:', error);
      return NextResponse.json({ error: 'Failed to execute code' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }
}