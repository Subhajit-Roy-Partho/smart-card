
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// IMPORTANT: DO NOT MODIFY THIS FILE
// This file is used to initialize the Firebase Admin SDK on the server-side.

let app: App;
let firestore: Firestore;

// This is the projectId of the Firebase project your client-side app is configured with.
const projectId = 'studio-7539869871-a3f37';

async function initializeFirebaseAdmin() {
  if (!getApps().length) {
    // When running in a Google Cloud environment, the SDK will automatically
    // use the project's service account credentials.
    app = initializeApp({ projectId });
  } else {
    app = getApps()[0];
  }

  firestore = getFirestore(app);

  return { app, firestore };
}

export { initializeFirebaseAdmin };
