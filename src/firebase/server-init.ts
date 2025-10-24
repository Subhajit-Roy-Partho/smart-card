import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { firebaseConfig } from './config';

// IMPORTANT: DO NOT MODIFY THIS FILE
// This file is used to initialize the Firebase Admin SDK on the server-side.
// It is separate from the client-side initialization in `src/firebase/index.ts`.

let app: App;
let firestore: Firestore;

async function initializeFirebaseAdmin() {
  if (!getApps().length) {
    // Check for service account credentials in environment variables
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccount) {
      try {
        const credentials = JSON.parse(serviceAccount);
        app = initializeApp({
          credential: cert(credentials),
          projectId: firebaseConfig.projectId,
        });
      } catch (error) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT. Initializing without credentials.", error);
        app = initializeApp({ projectId: firebaseConfig.projectId });
      }
    } else {
        console.warn("FIREBASE_SERVICE_ACCOUNT not set. Initializing without credentials. Some admin features might not work.")
        app = initializeApp({ projectId: firebaseConfig.projectId });
    }
  } else {
    app = getApps()[0];
  }
  
  firestore = getFirestore(app);

  return { app, firestore };
}

export { initializeFirebaseAdmin };
