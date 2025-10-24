
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// IMPORTANT: DO NOT MODIFY THIS FILE
// This file is used to initialize the Firebase Admin SDK on the server-side.
// It is separate from the client-side initialization in `src/firebase/index.ts`.

let app: App;
let firestore: Firestore;

// This is the projectId of the Firebase project your client-side app is configured with.
// It's being explicitly set here to prevent mismatches in server environments.
const CORRECT_PROJECT_ID = 'studio-7539869871-a3f37';

async function initializeFirebaseAdmin() {
  if (!getApps().length) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccount) {
      try {
        const credentials = JSON.parse(serviceAccount);
        // Ensure the service account's projectId matches if it exists, but
        // explicitly setting projectId in the options is the safest bet.
        if (credentials.project_id && credentials.project_id !== CORRECT_PROJECT_ID) {
            console.warn(`Warning: Service account's project ID (${credentials.project_id}) does not match the configured project ID (${CORRECT_PROJECT_ID}).`);
        }
        
        app = initializeApp({
          credential: cert(credentials),
          projectId: CORRECT_PROJECT_ID, // Explicitly set the project ID here.
        });
      } catch (error) {
        console.error(
          'Failed to parse FIREBASE_SERVICE_ACCOUNT. Initializing without credentials, but with correct project ID.',
          error
        );
        // This will rely on Application Default Credentials (ADC) if available, but scoped to the correct project.
        app = initializeApp({ projectId: CORRECT_PROJECT_ID });
      }
    } else {
      console.warn(
        'FIREBASE_SERVICE_ACCOUNT not set. Initializing without credentials. Admin features may not work without ADC.'
      );
      // This will rely on Application Default Credentials (ADC) if available, but scoped to the correct project.
      app = initializeApp({ projectId: CORRECT_PROJECT_ID });
    }
  } else {
    app = getApps()[0];
  }

  firestore = getFirestore(app);

  return { app, firestore };
}

export { initializeFirebaseAdmin };
