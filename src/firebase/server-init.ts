
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// IMPORTANT: DO NOT MODIFY THIS FILE
// This file is used to initialize the Firebase Admin SDK on the server-side.

let app: App;
let firestore: Firestore;

// This is the projectId of the Firebase project your client-side app is configured with.
const projectId = 'studio-7539869871-a3f37';

async function initializeFirebaseAdmin() {
  // Check if there are no initialized apps
  if (!getApps().length) {
    // When running in a Google Cloud environment, the SDK will automatically
    // use the project's service account credentials. Explicitly passing the 
    // projectId ensures it always connects to the correct project.
    app = initializeApp({ projectId });
  } else {
    // If an app is already initialized, get that instance.
    app = getApps()[0];
  }

  firestore = getFirestore(app);

  return { app, firestore };
}

export { initializeFirebaseAdmin };
