"use client";

import { getFirebaseMessaging } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";
import type { MessagePayload } from "firebase/messaging";

// Your VAPID key — get this from Firebase Console:
// Project Settings -> Cloud Messaging -> Web Push Certificates -> Key pair
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? "";

/**
 * Requests FCM permission and returns the device token.
 * Store this token in Firestore under the user's subscription.
 */
export async function requestNotificationPermission(): Promise<string | null> {
  try {
    if (!VAPID_KEY) {
      console.error("Firebase Web Push VAPID key is not configured.");
      return null;
    }
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission denied.");
      return null;
    }

    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    console.log("FCM Token:", token);
    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
}

/**
 * Listen for foreground messages (when the tab is active).
 * Background messages are handled by the service worker.
 */
export async function onForegroundMessage(
  callback: (payload: MessagePayload) => void
): Promise<() => void> {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return () => {};
  return onMessage(messaging, callback);
}
