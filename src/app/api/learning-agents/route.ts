import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';

export async function POST(req: NextRequest) {
  const { name, description, language, endpoint } = await req.json();
  const token = req.headers.get('Authorization')?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decodedToken = await auth().verifyIdToken(token);
    const ownerId = decodedToken.uid;

    const docRef = await addDoc(collection(db, 'learningAgents'), {
      name,
      description,
      language,
      endpoint,
      ownerId,
    });

    return NextResponse.json({ id: docRef.id });
  } catch (error) {
    console.error('Error adding document: ', error);
    return NextResponse.json({ error: 'Failed to create learning agent' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')?.split('Bearer ')[1];

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decodedToken = await auth().verifyIdToken(token);
    const ownerId = decodedToken.uid;

    const q = query(collection(db, 'learningAgents'), where('ownerId', '==', ownerId));
    const querySnapshot = await getDocs(q);
    const agents = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return NextResponse.json(agents);
  } catch (error) {
    console.error('Error getting documents: ', error);
    return NextResponse.json({ error: 'Failed to get learning agents' }, { status: 500 });
  }
}