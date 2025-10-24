import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// IMPORTANT: DO NOT MODIFY THIS FILE
// This file is used to initialize the Firebase Admin SDK on the server-side.
// It is separate from the client-side initialization in `src/firebase/index.ts`.

let app: App;
let firestore: Firestore;

async function initializeFirebaseAdmin() {
  if (!getApps().length) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccount) {
      try {
        const credentials = JSON.parse(serviceAccount);
        app = initializeApp({
          credential: cert(credentials),
        });
      } catch (error) {
        console.error(
          'Failed to parse FIREBASE_SERVICE_ACCOUNT. Initializing without credentials.',
          error
        );
        // This will likely fail in production but might work in some emulated environments.
        app = initializeApp();
      }
    } else {
      console.warn(
        'FIREBASE_SERVICE_ACCOUNT not set. Initializing without credentials. Admin features will not work.'
      );
      // This will rely on Application Default Credentials (ADC) if available,
      // otherwise it will fail.
      app = initializeApp();
    }
  } else {
    app = getApps()[0];
  }

  firestore = getFirestore(app);

  return { app, firestore };
}

export { initializeFirebaseAdmin };
