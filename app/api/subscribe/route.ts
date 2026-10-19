import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { getErrorMessage } from "@/lib/errors";
import { parseSubscriptionPayload } from "@/lib/validation";

/**
 * POST /api/subscribe
 *
 * Saves an FCM token and valley preferences to Firestore.
 * Body: { fcmToken: string, valleys: string[], language: "en" | "ur" | "kw" }
 */
export async function POST(req: NextRequest) {
  try {
    const parsed = parseSubscriptionPayload(await req.json());
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
    const { fcmToken, valleys, language } = parsed.value;

    // Upsert: use the FCM token as the document ID so re-subscribing updates the record
    await adminDb.collection("subscriptions").doc(fcmToken).set({
      fcmToken,
      valleys,
      language: language ?? "en",
      active: true,
      subscribedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    return NextResponse.json({ message: "Subscribed successfully" });
  } catch (err: unknown) {
    console.error("[subscribe] Error:", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}

/**
 * DELETE /api/subscribe
 *
 * Deactivates an FCM subscription.
 * Body: { fcmToken: string }
 */
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const fcmToken = body?.fcmToken;
    if (typeof fcmToken !== "string" || !fcmToken.trim()) {
      return NextResponse.json({ error: "A valid fcmToken is required." }, { status: 400 });
    }

    await adminDb.collection("subscriptions").doc(fcmToken).set({
      active: false,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    return NextResponse.json({ message: "Unsubscribed successfully" });
  } catch (err: unknown) {
    console.error("[unsubscribe] Error:", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
