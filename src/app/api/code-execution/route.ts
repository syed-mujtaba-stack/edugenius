import { NextResponse } from 'next/server';

interface ExecuteRequestBody {
  language:
    | 'javascript'
    | 'python'
    | 'cpp'
    | 'java'
    | 'go'
    | 'c'
    | 'ruby'
    | 'typescript';
  code: string;
  stdin?: string;
}

const LANGUAGE_MAP: Record<ExecuteRequestBody['language'], { language: string; version: string }> = {
  javascript: { language: 'javascript', version: '18.15.0' },
  python: { language: 'python', version: '3.10.0' },
  cpp: { language: 'cpp', version: '10.2.0' },
  java: { language: 'java', version: '15.0.2' },
  go: { language: 'go', version: '1.16.2' },
  c: { language: 'c', version: '10.2.0' },
  ruby: { language: 'ruby', version: '3.0.0' },
  typescript: { language: 'typescript', version: '4.2.3' },
};

const FILE_EXTENSION_MAP: Record<ExecuteRequestBody['language'], string> = {
  javascript: 'js',
  python: 'py',
  cpp: 'cpp',
  java: 'java',
  go: 'go',
  c: 'c',
  ruby: 'rb',
  typescript: 'ts',
};

const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ExecuteRequestBody;

    if (!body || !body.language || !body.code) {
      return NextResponse.json({ error: 'language and code are required.' }, { status: 400 });
    }

    const mapping = LANGUAGE_MAP[body.language];
    if (!mapping) {
      return NextResponse.json({ error: 'Unsupported language.' }, { status: 400 });
    }

    const payload = {
      language: mapping.language,
      version: mapping.version,
      files: [
        {
          name: `main.${FILE_EXTENSION_MAP[body.language]}`,
          content: body.code,
        },
      ],
      stdin: body.stdin ?? '',
    };

    const response = await fetch(PISTON_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Piston API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error executing code:', error);
    return NextResponse.json({ error: 'Failed to execute code.' }, { status: 500 });
  }
}
