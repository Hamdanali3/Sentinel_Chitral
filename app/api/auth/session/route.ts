import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { getErrorMessage } from "@/lib/errors";

const SESSION_COOKIE = "sentinel_session";
const SESSION_MAX_AGE = 60 * 60 * 8;

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    if (typeof idToken !== "string" || !idToken) {
      return NextResponse.json({ error: "A Firebase ID token is required." }, { status: 400 });
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    const adminDoc = await adminDb.collection("admins").doc(decoded.uid).get();
    if (!adminDoc.exists) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: SESSION_MAX_AGE * 1000 });
    const response = NextResponse.json({ message: "Session created" });
    response.cookies.set(SESSION_COOKIE, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });
    return response;
  } catch (error: unknown) {
    console.error("[session] Create error:", error);
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 401 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ message: "Session cleared" });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, maxAge: 0, path: "/" });
  return response;
}
