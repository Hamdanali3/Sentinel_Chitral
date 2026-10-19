export const VALLEYS = [
  "Bumburet",
  "Rumbur",
  "Birir",
  "Reshun",
  "Mastuj",
  "Yarkhun",
  "Torkhow",
  "Golain",
] as const;

export const RISK_LEVELS = ["Watch", "Warning", "Danger"] as const;
export const LANGUAGES = ["en", "ur", "kw"] as const;

type Valley = (typeof VALLEYS)[number];
type RiskLevel = (typeof RISK_LEVELS)[number];
type Language = (typeof LANGUAGES)[number];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function parseSubscriptionPayload(body: unknown):
  | { ok: true; value: { fcmToken: string; valleys: Valley[]; language: Language } }
  | { ok: false; error: string } {
  if (!isRecord(body) || !isString(body.fcmToken)) {
    return { ok: false, error: "A valid fcmToken is required." };
  }

  if (!Array.isArray(body.valleys) || body.valleys.length === 0) {
    return { ok: false, error: "At least one valley is required." };
  }

  const valleys = body.valleys.filter(
    (valley): valley is Valley =>
      typeof valley === "string" && (VALLEYS as readonly string[]).includes(valley)
  );
  if (valleys.length !== body.valleys.length) {
    return { ok: false, error: "One or more valleys are invalid." };
  }

  const language = body.language ?? "en";
  if (!(LANGUAGES as readonly string[]).includes(language as string)) {
    return { ok: false, error: "The selected language is invalid." };
  }

  return {
    ok: true,
    value: {
      fcmToken: body.fcmToken,
      valleys: [...new Set(valleys)],
      language: language as Language,
    },
  };
}

export function parseBroadcastPayload(body: unknown):
  | { ok: true; value: { valley: "ALL" | Valley; riskLevel: RiskLevel; message?: string; idToken: string } }
  | { ok: false; error: string } {
  if (!isRecord(body)) return { ok: false, error: "Invalid request body." };
  if (!isString(body.idToken)) return { ok: false, error: "Unauthorized" };

  const valley = body.valley;
  if (valley !== "ALL" && !(VALLEYS as readonly string[]).includes(valley as string)) {
    return { ok: false, error: "The selected valley is invalid." };
  }
  if (!(RISK_LEVELS as readonly string[]).includes(body.riskLevel as string)) {
    return { ok: false, error: "The selected risk level is invalid." };
  }
  if (body.message !== undefined && (typeof body.message !== "string" || body.message.length > 500)) {
    return { ok: false, error: "The message must be 500 characters or fewer." };
  }

  return {
    ok: true,
    value: {
      valley: valley as "ALL" | Valley,
      riskLevel: body.riskLevel as RiskLevel,
      message: body.message as string | undefined,
      idToken: body.idToken,
    },
  };
}
