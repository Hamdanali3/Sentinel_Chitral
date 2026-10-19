import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

const adminApp = getApps().length
  ? getApps()[0]
  : initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,        // karigar-b95a2
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // The private key is stored as a JSON string with literal \n — replace them with real newlines
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });

const adminDb = getFirestore(adminApp);
const adminAuth = getAuth(adminApp);
const adminMessaging = getMessaging(adminApp);

export { adminDb, adminAuth, adminMessaging };
