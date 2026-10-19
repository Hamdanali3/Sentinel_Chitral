import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminMessaging, adminAuth } from "@/lib/firebaseAdmin";
import { getErrorMessage } from "@/lib/errors";
import { parseBroadcastPayload } from "@/lib/validation";

/**
 * POST /api/alerts/broadcast
 *
 * Admin-only route. Sends a push notification via FCM to all subscribers
 * of a given valley (or all valleys).
 *
 * Body: { valley: string, riskLevel: string, message: string, idToken: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = parseBroadcastPayload({ ...body, idToken: req.cookies.get("sentinel_session")?.value });
    if (!parsed.ok) {
      return NextResponse.json(
        { error: parsed.error },
        { status: parsed.error === "Unauthorized" ? 401 : 400 }
      );
    }
    const { valley, riskLevel, message, idToken } = parsed.value;

    // 1. Verify the caller is an authenticated admin
    const decoded = await adminAuth.verifySessionCookie(idToken, true);
    const adminDoc = await adminDb.collection("admins").doc(decoded.uid).get();
    if (!adminDoc.exists) {
      return NextResponse.json({ error: "Forbidden: not an admin" }, { status: 403 });
    }

    // 2. Fetch all FCM tokens subscribed to this valley (or "all")
    const subsRef = adminDb.collection("subscriptions");
    const query = valley === "ALL"
      ? subsRef.where("active", "==", true)
      : subsRef.where("valleys", "array-contains", valley).where("active", "==", true);

    const snapshot = await query.get();
    const tokenDocs = snapshot.docs.filter((doc) => typeof doc.data().fcmToken === "string");
    const tokens = tokenDocs.map((doc) => doc.data().fcmToken as string);

    if (tokens.length === 0) {
      return NextResponse.json({ message: "No subscribers found", sent: 0 });
    }

    // FCM accepts at most 500 tokens per multicast request.
    let successCount = 0;
    let failureCount = 0;
    const invalidTokenDocs: string[] = [];
    for (let index = 0; index < tokens.length; index += 500) {
      const batchTokens = tokens.slice(index, index + 500);
      const response = await adminMessaging.sendEachForMulticast({
        tokens: batchTokens,
        notification: {
          title: `⚠️ Sentinel Chitral: ${riskLevel.toUpperCase()} ALERT`,
          body: message ?? `${valley} valley has been flagged as ${riskLevel}. Take immediate precautions.`,
        },
        data: { valley, riskLevel, url: "/" },
        webpush: {
          notification: {
            icon: "/icon-192x192.png",
            badge: "/icon-192x192.png",
            requireInteraction: true,
          },
          fcmOptions: { link: "/" },
        },
      });
      successCount += response.successCount;
      failureCount += response.failureCount;
      response.responses.forEach((result, responseIndex) => {
        if (result.success) return;
        const code = result.error?.code;
        if (code === "messaging/registration-token-not-registered" || code === "messaging/invalid-registration-token") {
          invalidTokenDocs.push(tokenDocs[index + responseIndex].id);
        }
      });
    }

    if (invalidTokenDocs.length > 0) {
      const cleanup = adminDb.batch();
      invalidTokenDocs.forEach((id) => cleanup.delete(adminDb.collection("subscriptions").doc(id)));
      await cleanup.commit();
    }

    // 4. Log the broadcast in Firestore
    await adminDb.collection("alertLogs").add({
      valley,
      riskLevel,
      message,
      sentBy: decoded.email,
      sentAt: new Date().toISOString(),
      successCount,
      failureCount,
      removedInvalidTokens: invalidTokenDocs.length,
    });

    return NextResponse.json({
      message: "Broadcast sent",
      successCount,
      failureCount,
      removedInvalidTokens: invalidTokenDocs.length,
    });
  } catch (err: unknown) {
    console.error("[broadcast] Error:", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
