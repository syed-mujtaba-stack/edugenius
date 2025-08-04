import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';

export async function POST(req: NextRequest) {
  const { videoId, content } = await req.json();
  const token = req.headers.get('Authorization')?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decodedToken = await auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const docRef = await addDoc(collection(db, 'notes'), {
      videoId,
      content,
      userId,
    });

    return NextResponse.json({ id: docRef.id });
  } catch (error) {
    console.error('Error adding document: ', error);
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')?.split('Bearer ')[1];
  const videoId = req.nextUrl.searchParams.get('videoId');

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decodedToken = await auth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const q = query(collection(db, 'notes'), where('userId', '==', userId), where('videoId', '==', videoId));
    const querySnapshot = await getDocs(q);
    const notes = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error getting documents: ', error);
    return NextResponse.json({ error: 'Failed to get notes' }, { status: 500 });
  }
}