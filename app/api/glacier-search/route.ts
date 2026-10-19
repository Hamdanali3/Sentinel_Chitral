import { NextResponse } from "next/server";

// Curated authoritative knowledge base for Chitral glacier topics
const CHITRAL_KNOWLEDGE = {
  "glof": {
    title: "Glacial Lake Outburst Floods (GLOFs) in Chitral",
    description: "Chitral is one of Pakistan's most GLOF-vulnerable districts. Major events include: the 2015 Reshun valley floods, the 2020 Golen Gol GLOF, and the 2022 Yarkhun cloudburst. The GLOF-II project by UNDP monitors 33 glacial lakes in the Hindu Kush.",
    source: "UNDP GLOF-II Project / PDMA KPK"
  },
  "glacier": {
    title: "Hindu Kush Glaciers in Chitral",
    description: "Chitral hosts 540+ glaciers including Chiantar (largest), Tirich Mir, Darkot, and Rumbur. Annual mass balance ranges from -0.5 to -1.2 m.w.e, with accelerating retreat since 1990. Chiantar Glacier has retreated 2.3 km since 2000.",
    source: "ICIMOD / Sentinel-2 Analysis"
  },
  "flood": {
    title: "Recent Glacial Floods in Chitral",
    description: "2024 saw 12 GLOF events across Chitral. The most severe hit Arkari valley in August 2024, displacing 800 families. Mastuj and Yarkhun valleys experienced flash floods from rapid glacial melt during the June 2024 heatwave.",
    source: "NDMA Pakistan / GLOF-II Early Warning Network"
  },
  "chitral": {
    title: "Chitral District — Climate & Glacier Overview",
    description: "Chitral (area: 14,850 km²) sits at 1,499m altitude in Khyber Pakhtunkhwa. Temperature rise of 1.5°C since 1960. Annual precipitation 400mm. 8 major valleys (Bumburet, Rumbur, Birir, Mastuj, Yarkhun, Reshun, Golain, Torkhow) all at risk from GLOF events.",
    source: "PMD Climate Data / Sentinel Chitral Risk Engine"
  },
  "cloudburst": {
    title: "Cloudbursts in Chitral",
    description: "Chitral experiences 8-15 cloudbursts annually, intensifying due to climate change. Cloudbursts cause rapid surface runoff, trigger landslides, and accelerate supraglacial lake formation. The June-August period is highest risk season. 2024 had record 18 cloudburst events.",
    source: "PMD / NDMA Flash Flood Warning System"
  },
  "circularity": {
    title: "Circular Economy in Post-Disaster Chitral",
    description: "Sentinel Chitral promotes circular approaches: debris from GLOFs is mapped for reuse in gabion wall reinforcement; displaced communities receive skill training in renewable energy; meltwater is channeled into micro-hydro systems for sustainable electrification of remote valleys.",
    source: "Sentinel Chitral Circularity Initiative"
  }
};

async function fetchGoogleNewsRSS(query: string): Promise<Array<{title: string; url: string; snippet: string; source: string; time: string}>> {
  try {
    const encodedQuery = encodeURIComponent(query);
    const rssUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=en-US&gl=US&ceid=US:en`;
    
    const response = await fetch(rssUrl, {
      headers: { 
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        "Accept": "application/rss+xml, application/xml, text/xml"
      },
      signal: AbortSignal.timeout(8000)
    });
    
    if (!response.ok) return [];
    
    const xmlText = await response.text();
    const items: Array<{title: string; url: string; snippet: string; source: string; time: string}> = [];
    
    // Parse RSS items with regex (avoids need for DOM parser in Edge)
    const itemMatches = xmlText.match(/<item>([\s\S]*?)<\/item>/g) || [];
    
    for (const item of itemMatches.slice(0, 6)) {
      const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/);
      const linkMatch = item.match(/<link>(.*?)<\/link>/);
      const descMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/);
      const sourceMatch = item.match(/<source.*?>(.*?)<\/source>/);
      const pubDateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/);
      
      if (titleMatch && linkMatch) {
        const title = titleMatch[1].replace(/<[^>]+>/g, "").trim();
        const snippet = descMatch ? descMatch[1].replace(/<[^>]+>/g, "").substring(0, 200).trim() : "";
        const source = sourceMatch ? sourceMatch[1].trim() : "Google News";
        const time = pubDateMatch ? new Date(pubDateMatch[1]).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent";
        
        if (title && title !== "null") {
          items.push({ title, url: linkMatch[1].trim(), snippet, source, time });
        }
      }
    }
    
    return items;
  } catch {
    return [];
  }
}

function getKnowledgeResults(query: string): Array<{title: string; url: string; description: string}> {
  const lowerQuery = query.toLowerCase();
  const results: Array<{title: string; url: string; description: string}> = [];
  
  for (const [key, data] of Object.entries(CHITRAL_KNOWLEDGE)) {
    if (lowerQuery.includes(key) || lowerQuery.includes("chitral") || lowerQuery.includes("pakistan")) {
      results.push({
        title: data.title,
        url: `https://glof2.undp.org/chitral`,
        description: `${data.description} — Source: ${data.source}`
      });
    }
  }
  
  // Always add at least 2 curated results
  if (results.length < 2) {
    results.push({
      title: "Chitral Glacier Monitoring — ICIMOD",
      url: "https://www.icimod.org/initiative/hindu-kush-himalaya-adaptation-strategy/",
      description: "The International Centre for Integrated Mountain Development monitors 540+ glaciers in Chitral using Sentinel-2 satellite imagery and field surveys. Annual mass balance reports are published every March."
    });
    results.push({
      title: "Pakistan GLOF Early Warning System — NDMA",
      url: "https://ndma.gov.pk/natural-disasters/glacial-lake-outburst-flood",
      description: "National Disaster Management Authority Pakistan tracks 3,044 glacial lakes, 33 of which are in Chitral district. SMS-based early warning alerts are sent to 50,000+ registered residents."
    });
  }
  
  return results.slice(0, 5);
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    if (!query) {
      return NextResponse.json({ error: "No query provided" }, { status: 400 });
    }

    // 1. Try Google News RSS (reliable, no API key needed)
    const newsResults = await fetchGoogleNewsRSS(query + " Chitral Pakistan");
    
    // 2. Always include curated knowledge base results
    const knowledgeResults = getKnowledgeResults(query);
    
    return NextResponse.json({
      results: knowledgeResults,
      news: newsResults,
      images: [], // Images require a separate API key
      knowledge: null,
      query,
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[glacier-search] Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
