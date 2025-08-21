import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Read service account values from env. PRIVATE KEY may contain escaped newlines.
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;
if (privateKey && privateKey.includes('\\n')) {
  privateKey = privateKey.replace(/\\n/g, '\n');
}

if (!getApps().length) {
  if (clientEmail && privateKey && projectId) {
    initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  } else {
    // Fallback to ADC (works with emulators or GOOGLE_APPLICATION_CREDENTIALS)
    initializeApp();
  }
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();
