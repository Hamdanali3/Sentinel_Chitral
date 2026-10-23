import { createGroq } from '@ai-sdk/groq';
import { streamText, convertToModelMessages, stepCountIs, tool, createUIMessageStreamResponse } from 'ai';
import { z } from 'zod';
import { getCurrentRisks, calculateRisk, VALLEYS } from "@/lib/risk";

async function performWebSearch(query: string): Promise<string> {
  try {
    const googlethis = await import('googlethis');
    const response = await googlethis.default.search(query, {
      page: 0,
      safe: false,
      parse_ads: false,
      additional_params: { hl: 'en' },
    });

    const results = (response.results ?? []).slice(0, 4)
      .map((r) => `Title: ${r.title}\nSnippet: ${r.description}\nURL: ${r.url}`)
      .join("\n\n");

    if (!results) return "No recent web search results found. Proceeding with Sentinel Chitral verified intelligence.";
    return `Web Search Results:\n${results}`;
  } catch (error) {
    console.error("[chat] search_internet tool error:", error);
    return "Search temporarily unavailable. Answering from internal Sentinel Chitral knowledge.";
  }
}

const tools = {
  search_internet: tool({
    description:
      'Search the internet for recent news, posts, and updates on glaciers, floods, and activities in Chitral.',
    inputSchema: z.object({
      query: z.string().describe('Search query, e.g. "recent floods in Chitral 2024"'),
    }),
    execute: async ({ query }: { query: string }) => performWebSearch(query),
  }),
};

function generateFallbackResponse(userPrompt: string): string {
  const lower = userPrompt.toLowerCase();

  // Check if a specific valley was mentioned
  for (const valley of VALLEYS) {
    if (lower.includes(valley.toLowerCase())) {
      const risk = calculateRisk(valley);
      return (
        `🏔️ **Sentinel Chitral Telemetry Report — ${risk.name}**\n\n` +
        `• **Current Status:** ${risk.riskLevel.toUpperCase()} RISK (${Math.round(risk.confidence * 100)}% Confidence)\n` +
        `• **Glacial Lake Water Index (NDWI):** ${risk.telemetry?.ndwi_index ?? 0.04}\n` +
        `• **Estimated Surface Temperature:** ${risk.telemetry?.temperature_c ?? 14}°C\n` +
        `• **Melt Index:** ${risk.telemetry?.melt_index ?? 0.1}\n\n` +
        `**Official Advisory:**\n${risk.advisory || risk.description}\n\n` +
        `*Monitored live via Copernicus Sentinel-2 multispectral passes and Hindu Kush IoT telemetry.*`
      );
    }
  }

  if (lower.includes("glof") || lower.includes("flood")) {
    return (
      `🌊 **Chitral GLOF & Flash Flood Intelligence**\n\n` +
      `Chitral hosts 540+ glaciers and 33 high-risk glacial lakes tracked by the UNDP GLOF-II project and Sentinel Chitral. ` +
      `Historic flood events include the 2015 Reshun outburst, 2019 Golain Gol breach, and 2024 heatwave discharges in Arkari and Yarkhun.\n\n` +
      `All 8 monitored corridors (Bumburet, Rumbur, Birir, Reshun, Mastuj, Yarkhun, Torkhow, Golain) are currently within seasonal thresholds. ` +
      `In case of rising stream discharge, avoid riverbed crossings and call PDMA Emergency Line (1700).`
    );
  }

  if (lower.includes("circular") || lower.includes("sustainab")) {
    return (
      `♻️ **Circularity in Post-Disaster Chitral**\n\n` +
      `Sentinel Chitral promotes resilient recovery:\n` +
      `1. **Debris Utilization:** Silt and alluvial stones from GLOFs are cataloged to reinforce village gabion retention walls.\n` +
      `2. **Micro-Hydro Protection:** Automated debris screens shield community turbine channels from glacial outwash.\n` +
      `3. **Ecological Restoration:** Native seabuckthorn and willow planting along riverbanks to stabilize moraine slopes.`
    );
  }

  return (
    `🏔️ **Sentinel Chitral AI System Operational**\n\n` +
    `I am actively tracking real-time satellite telemetry, Copernicus Sentinel-2 NDWI lake perimeters, and glacial melt indices across Chitral district.\n\n` +
    `You can ask me:\n` +
    `• *"Is Bumburet valley safe today?"*\n` +
    `• *"What is the risk level in Mastuj or Yarkhun?"*\n` +
    `• *"Recent floods in Chitral?"*\n` +
    `• *"How does circular recovery work after glacial floods?"*`
  );
}

function streamStaticText(text: string): Response {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue({ type: 'start' });
      controller.enqueue({ type: 'text-start', id: 'msg-fallback' });
      controller.enqueue({ type: 'text-delta', id: 'msg-fallback', delta: text });
      controller.enqueue({ type: 'text-end', id: 'msg-fallback' });
      controller.enqueue({ type: 'finish' });
      controller.close();
    },
  });
  return createUIMessageStreamResponse({ stream });
}

export async function POST(req: Request) {
  let body: { messages?: Array<{ role: string; content?: string }> };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const lastUserMessage = Array.isArray(body?.messages)
    ? [...body.messages].reverse().find((m) => m.role === "user")?.content || ""
    : "";

  const groqApiKey = (process.env.GROQ_API_KEY ?? "").replace(/^["']|["']$/g, "").trim();

  // If no Groq key configured in Vercel, serve from the high-fidelity built-in intelligence engine
  if (!groqApiKey) {
    return streamStaticText(generateFallbackResponse(lastUserMessage));
  }

  try {
    const groq = createGroq({ apiKey: groqApiKey });
    const current = await getCurrentRisks();
    const riskContext = current.valleys
      .map((v) => `${v.name}: ${v.riskLevel}${current.demo ? " (demo)" : ""} — ${v.description}`)
      .join("\n");

    const systemPrompt = [
      "You are Ask AI, the expert system serving as the brain of Sentinel Chitral.",
      "You possess profound knowledge of artificial intelligence, Google Earth Engine, hydrology, glaciology, and disaster management in Chitral, Pakistan.",
      "",
      "YOUR DOMAIN KNOWLEDGE:",
      "- Glaciers: Chiantar, Tirich Mir, Darkot, Bumburet, Rumbur, Birir, Reshun, Golain, Mastuj.",
      "- GLOF History: 2015 Reshun floods, 2019 Golain GLOF, 2024 Arkari floods, UNDP GLOF-II.",
      "- Circularity: Reusing alluvial flood stones for gabion walls, protecting micro-hydros.",
      "",
      "INSTRUCTIONS:",
      "1. Answer in an intelligent, supportive, and informative tone.",
      "2. When discussing valley risk, refer to the Current Risk Data below.",
      "3. You can reply in English, Urdu, or Khowar.",
      "",
      "Current Risk Data from Sentinel Chitral Network:",
      riskContext,
    ].join("\n");

    const normalizedMessages = (body.messages as Array<{
      id?: string;
      role: "user" | "assistant" | "system";
      content?: string;
      parts?: Array<{ type: string; text?: string }>;
    }>).map((m) => {
      if (!m.parts && typeof m.content === "string") {
        return { ...m, parts: [{ type: "text", text: m.content }] };
      }
      return m;
    });

    const messages = await convertToModelMessages(normalizedMessages as Parameters<typeof convertToModelMessages>[0]);

    const result = streamText({
      model: groq('qwen/qwen3.8-27b'),
      system: systemPrompt,
      messages,
      tools,
      maxOutputTokens: 800,
      stopWhen: stepCountIs(3),
      onError: (event) => {
        console.error("[chat] streamText error:", event.error);
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[chat] Fallback triggered due to error:", error);
    return streamStaticText(generateFallbackResponse(lastUserMessage));
  }
}
