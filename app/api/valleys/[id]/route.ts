import { NextRequest, NextResponse } from "next/server";
import { getValleyDetail, getValleyHistory } from "@/lib/risk";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [detail, history] = await Promise.all([
      getValleyDetail(id),
      getValleyHistory(id),
    ]);

    if (!detail) {
      return NextResponse.json({ error: "Valley not found" }, { status: 404 });
    }

    return NextResponse.json({ detail, history });
  } catch (error) {
    console.error("[api/valleys/[id]] Error:", error);
    return NextResponse.json(
      { error: "Failed to load valley details" },
      { status: 500 }
    );
  }
}
