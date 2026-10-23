import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getMessaging, type Messaging } from "firebase-admin/messaging";

let cachedApp: App | null = null;
let cachedDb: Firestore | null = null;
let cachedAuth: Auth | null = null;
let cachedMessaging: Messaging | null = null;

function getAdminApp(): App {
  if (cachedApp) return cachedApp;

  const existingApps = getApps();
  if (existingApps.length > 0) {
    cachedApp = existingApps[0];
    return cachedApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    const missing = [
      !projectId && "FIREBASE_PROJECT_ID",
      !clientEmail && "FIREBASE_CLIENT_EMAIL",
      !privateKey && "FIREBASE_PRIVATE_KEY",
    ].filter(Boolean);

    throw new Error(
      `Firebase Admin credential error: Missing required environment variable(s): ${missing.join(
        ", "
      )}. Ensure they are added to your Vercel Project Settings > Environment Variables.`
    );
  }

  // Strip wrapping quotes if user pasted them into Vercel
  if (
    (privateKey.startsWith('"') && privateKey.endsWith('"')) ||
    (privateKey.startsWith("'") && privateKey.endsWith("'"))
  ) {
    privateKey = privateKey.slice(1, -1);
  }

  // Replace literal '\n' strings with real newline characters
  privateKey = privateKey.replace(/\\n/g, "\n");

  cachedApp = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  return cachedApp;
}

function createLazyProxy<T extends object>(getService: () => T, name: string): T {
  let serviceInstance: T | null = null;

  return new Proxy({} as T, {
    get(_target, prop) {
      if (prop === "then" || prop === "$$typeof") {
        return undefined;
      }
      if (prop === Symbol.toStringTag) {
        return name;
      }
      if (!serviceInstance) {
        serviceInstance = getService();
      }
      const val = (serviceInstance as any)[prop];
      return typeof val === "function" ? val.bind(serviceInstance) : val;
    },
  });
}

export const adminDb: Firestore = createLazyProxy<Firestore>(
  () => (cachedDb ??= getFirestore(getAdminApp())),
  "Firestore"
);

export const adminAuth: Auth = createLazyProxy<Auth>(
  () => (cachedAuth ??= getAuth(getAdminApp())),
  "Auth"
);

export const adminMessaging: Messaging = createLazyProxy<Messaging>(
  () => (cachedMessaging ??= getMessaging(getAdminApp())),
  "Messaging"
);

