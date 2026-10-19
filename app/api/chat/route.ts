import { createGroq } from '@ai-sdk/groq';
import { streamText, convertToModelMessages, stepCountIs } from 'ai';
import { z } from 'zod';
import { getCurrentRisks } from "@/lib/risk";

// Initialize Groq provider
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

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

// Tool definition for internet search
const tools = {
  search_internet: {
    description:
      'Search the internet for recent news, posts, and updates on glaciers, floods, and activities in Chitral.',
    parameters: z.object({
      query: z.string().describe('Search query, e.g. "recent floods in Chitral 2024"'),
    }),
    execute: async ({ query }: { query: string }) => performWebSearch(query),
  },
};

export async function POST(req: Request) {
  if (!process.env.GROQ_API_KEY) {
    return Response.json({ error: "The assistant is not configured." }, { status: 503 });
  }

  let body: { messages?: unknown[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!Array.isArray(body?.messages)) {
    return Response.json({ error: "A messages array is required." }, { status: 400 });
  }

  const current = await getCurrentRisks();
  const riskContext = current.valleys
    .map((v) => `${v.name}: ${v.riskLevel}${current.demo ? " (demo)" : ""} — ${v.description}`)
    .join("\n");

  const demoNote = current.demo
    ? "(Note: Using simulated demo data because Firestore backend is not fully connected yet.)"
    : "";

  const systemPrompt = [
    "You are Ask AI, the world's most advanced AI and Machine Learning expert system, serving as the brain of Sentinel Chitral.",
    "You possess profound knowledge of artificial intelligence, deep learning, agentic AI, Google Earth Engine, hydrology, glaciology, and disaster management.",
    "",
    "YOUR DOMAIN KNOWLEDGE:",
    "- Chitral Glaciers & GLOFs: You know everything about Hindu Kush glaciers in Chitral (Chiantar, Tirich Mir, Darkot, Bumburet, Rumbur, Birir, Reshun, Golain, Mastuj). History of GLOFs: 2015 Reshun floods, 2021 Bumburet incident, GLOF-II project.",
    "- Cloudbursts & Climate Change: Rising temperatures, changing monsoon patterns, and cloudbursts accelerate glacial melt and trigger flash floods.",
    "- Circular Economy & Sustainability: Post-disaster recovery using circularity (reusing materials, sustainable rebuilding, ecological restoration).",
    "- Sentinel Chitral Architecture: Next.js, FastAPI, Google Earth Engine, and Firebase with real-time IoT telemetry.",
    "",
    "INSTRUCTIONS:",
    "1. Answer in a highly intelligent, expert, and deeply informative manner.",
    "2. If the user asks about recent news, current events, floods, or latest internet reports about Chitral, use the search_internet tool.",
    "3. You can answer in English, Urdu, or Khowar.",
    "4. Base your safety warnings on the current Risk Data provided below.",
    "5. When discussing glaciers, mention the Google Earth Engine integration for real-time monitoring.",
    "",
    "Current Risk Data from Sentinel Chitral Network:",
    riskContext,
    demoNote,
  ].join("\n");

  // Convert UI messages (from useChat) into the Model format expected by streamText
  const messages = await convertToModelMessages(body.messages as Parameters<typeof convertToModelMessages>[0]);

  const result = streamText({
    model: groq('qwen/qwen3.8-27b'),
    system: systemPrompt,
    messages,
    tools: tools as any,
    maxOutputTokens: 800,
    stopWhen: stepCountIs(3),
    onError: (event) => {
      console.error("[chat] streamText error:", event.error);
    },
  });

  return result.toUIMessageStreamResponse();
}
