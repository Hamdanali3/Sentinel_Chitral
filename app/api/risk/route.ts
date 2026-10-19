import { NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/errors";
import { getCurrentRisks } from "@/lib/risk";

export async function GET() {
  try {
    return NextResponse.json(await getCurrentRisks());
  } catch (error: unknown) {
    console.error("[risk] Error:", error);
    return NextResponse.json(
      { error: "Current risk data is temporarily unavailable.", detail: getErrorMessage(error) },
      { status: 503 }
    );
  }
}
