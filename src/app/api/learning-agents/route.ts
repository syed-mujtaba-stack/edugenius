export const runtime = 'nodejs';
import { adminDb, adminAuth } from '@/lib/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

const isProd = process.env.NODE_ENV === 'production';

export async function POST(req: NextRequest) {
  const { name, description, language, endpoint } = await req.json();
  const token = req.headers.get('Authorization')?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const ownerId = decodedToken.uid;

    const docRef = await adminDb.collection('learningAgents').add({
      name,
      description,
      language,
      endpoint,
      ownerId,
    });

    return NextResponse.json({ id: docRef.id });
  } catch (error: any) {
    console.error('Error adding document: ', error);
    const missingCreds = !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY;
    const details = !isProd ? { message: String(error?.message || error), stack: error?.stack, hint: missingCreds ? 'Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY or configure GOOGLE_APPLICATION_CREDENTIALS / emulator.' : undefined } : undefined;
    return NextResponse.json({ error: 'Failed to create learning agent', ...details }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const ownerId = decodedToken.uid;

    const snapshot = await adminDb
      .collection('learningAgents')
      .where('ownerId', '==', ownerId)
      .get();
    const agents = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    return NextResponse.json(agents);
  } catch (error: any) {
    console.error('Error getting documents: ', error);
    const missingCreds = !process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY;
    const details = !isProd ? { message: String(error?.message || error), stack: error?.stack, hint: missingCreds ? 'Missing Firebase Admin credentials. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY or configure GOOGLE_APPLICATION_CREDENTIALS / emulator.' : undefined } : undefined;
    return NextResponse.json({ error: 'Failed to get learning agents', ...details }, { status: 500 });
  }
}