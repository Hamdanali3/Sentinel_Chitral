import { adminDb } from "@/lib/firebaseAdmin";
import { VALLEYS } from "@/lib/validation";

export type RiskLevel = "Low" | "Watch" | "Warning" | "Danger";

export interface TelemetryData {
  temperature_c: number;
  rainfall_24h_mm: number;
  ndwi_index: number;
  water_area_ha: number;
  melt_index: number;
}

export interface HistoryPoint {
  date: string;
  ndwi: number;
  temperature_c: number;
  rainfall_mm: number;
  risk_level: RiskLevel;
}

export interface ValleyRisk {
  id: string;
  name: string;
  coordinates: [number, number];
  riskLevel: RiskLevel;
  description: string;
  confidence: number;
  updatedAt: string;
  advisory?: string;
  telemetry?: TelemetryData;
  factors?: Record<string, unknown>;
}

const VALLEY_METADATA: Record<(typeof VALLEYS)[number], Omit<ValleyRisk, "riskLevel" | "description" | "confidence" | "updatedAt">> = {
  Bumburet: { id: "1", name: "Bumburet (Kalash)", coordinates: [71.6888, 35.7088] },
  Rumbur: { id: "2", name: "Rumbur", coordinates: [71.748, 35.795] },
  Birir: { id: "3", name: "Birir", coordinates: [71.68, 35.67] },
  Reshun: { id: "4", name: "Reshun", coordinates: [72.1, 36.14] },
  Mastuj: { id: "5", name: "Mastuj", coordinates: [72.5028, 36.2921] },
  Yarkhun: { id: "6", name: "Yarkhun", coordinates: [72.87, 36.5] },
  Torkhow: { id: "7", name: "Torkhow", coordinates: [72.18, 36.3] },
  Golain: { id: "8", name: "Golain", coordinates: [72.35, 35.9] },
};

function isRiskLevel(value: unknown): value is RiskLevel {
  return value === "Low" || value === "Watch" || value === "Warning" || value === "Danger";
}

/** Deterministic demo data returned when Firestore is unreachable (e.g. API not yet enabled). */
function getDemoRisks(): { valleys: ValleyRisk[]; syncedAt: string; demo: true } {
  const demoLevels: RiskLevel[] = ["Low", "Watch", "Low", "Low", "Watch", "Low", "Low", "Low"];
  const now = new Date().toISOString();
  const valleys = VALLEYS.map((valley, i) => ({
    ...VALLEY_METADATA[valley],
    riskLevel: demoLevels[i] ?? "Low",
    description: "Demo data — Firestore not yet configured. Enable the Cloud Firestore API to see live risk scores.",
    confidence: 0,
    updatedAt: now,
  }));
  return { valleys, syncedAt: now, demo: true };
}

export async function getCurrentRisks(): Promise<{ valleys: ValleyRisk[]; syncedAt: string; demo?: true }> {
  // ── Step 1: Try Firestore ───────────────────────────────────────────────────
  let records = new Map<string, Record<string, unknown>>();
  try {
    const snapshot = await adminDb.collection("valleyRisks").get();
    records = new Map(snapshot.docs.map((doc) => [doc.id, doc.data() as Record<string, unknown>]));
  } catch (error: unknown) {
    const code = (error as { code?: number | string })?.code;
    const reason = (error as { reason?: string })?.reason;
    if (code === 7 || reason === "SERVICE_DISABLED") {
      console.warn(
        "[risk] Firestore disabled. Attempting risk engine fallback at " +
          (process.env.RISK_ENGINE_URL || "default")
      );
    } else {
      console.warn("[risk] Firestore read failed:", error);
    }
  }

  // ── Step 2: Supplement missing valleys from the risk engine (if configured) ─
  if (process.env.RISK_ENGINE_URL) {
    await Promise.all(
      VALLEYS.filter((valley) => !records.has(valley)).map(async (valley) => {
        try {
          const response = await fetch(
            `${process.env.RISK_ENGINE_URL}/api/valleys/${encodeURIComponent(valley)}/risk`,
            { signal: AbortSignal.timeout(5000), cache: "no-store" }
          );
          if (!response.ok) return;
          const result = await response.json();
          if (isRiskLevel(result.risk_level) && typeof result.timestamp === "string") {
            records.set(valley, {
              riskLevel: result.risk_level,
              confidence: result.confidence,
              description: "Risk score supplied by the configured risk engine.",
              updatedAt: result.timestamp,
            });
          }
        } catch (error: unknown) {
          console.error(`[risk] Engine request failed for ${valley}:`, error);
        }
      })
    );
  }

  // ── Step 3: Build the response ──────────────────────────────────────────────
  const missing: string[] = [];
  const valleys = VALLEYS.map((valley) => {
    const record = records.get(valley);
    if (!record || !isRiskLevel(record.riskLevel) || typeof record.updatedAt !== "string") {
      missing.push(valley);
      return null;
    }

    const result: ValleyRisk = {
      ...VALLEY_METADATA[valley],
      riskLevel: record.riskLevel,
      description: typeof record.description === "string" ? record.description : "No additional details available.",
      confidence: typeof record.confidence === "number" ? record.confidence : 0,
      updatedAt: record.updatedAt,
      advisory: typeof record.advisory === "string" ? record.advisory : undefined,
      telemetry: record.telemetry as TelemetryData | undefined,
      factors: record.factors as Record<string, unknown> | undefined,
    };
    return result;
  }).filter((v): v is ValleyRisk => v !== null);

  if (missing.length > 0) {
    console.warn(`[risk] Missing records for: ${missing.join(", ")} — returning demo data`);
    return getDemoRisks();
  }

  const syncedAt = valleys.reduce(
    (latest, valley) => valley.updatedAt > latest ? valley.updatedAt : latest,
    valleys[0]?.updatedAt ?? new Date(0).toISOString()
  );
  return { valleys, syncedAt };
}

export async function getValleyDetail(valleyId: string): Promise<ValleyRisk | null> {
  const engineUrl = process.env.RISK_ENGINE_URL || "http://127.0.0.1:8000";
  try {
    const res = await fetch(`${engineUrl}/api/valleys/${encodeURIComponent(valleyId)}/risk`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const data = await res.json();
      return {
        id: data.valley_id,
        name: data.name,
        coordinates: data.coordinates,
        riskLevel: data.risk_level,
        confidence: data.confidence,
        description: data.description,
        advisory: data.advisory,
        updatedAt: data.timestamp,
        telemetry: data.telemetry,
        factors: data.factors,
      };
    }
  } catch (err) {
    console.warn(`[risk] Detail fetch failed for ${valleyId}:`, err);
  }

  // Fallback to local metadata & baseline score
  const { valleys } = await getCurrentRisks();
  return (
    valleys.find(
      (v) =>
        v.id === valleyId ||
        v.name.toLowerCase().includes(valleyId.toLowerCase())
    ) ?? null
  );
}

export async function getValleyHistory(valleyId: string): Promise<HistoryPoint[]> {
  const engineUrl = process.env.RISK_ENGINE_URL || "http://127.0.0.1:8000";
  try {
    const res = await fetch(`${engineUrl}/api/valleys/${encodeURIComponent(valleyId)}/history`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const data = await res.json();
      return data.history || [];
    }
  } catch (err) {
    console.warn(`[risk] History fetch failed for ${valleyId}:`, err);
  }

  // Fallback deterministic 30-day baseline
  const now = new Date();
  const history: HistoryPoint[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    history.push({
      date: d.toISOString().slice(0, 10),
      ndwi: +(0.06 + Math.sin(i / 5) * 0.04).toFixed(3),
      temperature_c: +(12 + Math.cos(i / 7) * 5).toFixed(1),
      rainfall_mm: +(Math.max(0, Math.sin(i / 3) * 6)).toFixed(1),
      risk_level: i > 20 ? "Low" : i > 10 ? "Watch" : "Low",
    });
  }
  return history;
}
