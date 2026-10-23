"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Activity,
  MountainSnow,
} from "lucide-react";

import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface SearchResultItem {
  title?: string;
  url?: string;
  description?: string;
}

interface SearchResponse {
  results?: SearchResultItem[];
}

interface GlacierItem {
  id: string;
  name: string;
  valley: string;
  coords: [number, number];
  massBalance: string;
  velocity: string;
  threat: "Severe" | "High" | "Medium";
  lakeAreaHa: number;
  elevationM: number;
  description: string;
  image: string;
}

const GLACIERS: GlacierItem[] = [
  {
    id: "Chiantar",
      name: "Chiantar Glacier",
      valley: "Broghil / Upper Yarkhun",
      coords: [73.5358, 36.6575],
      massBalance: "-0.82 m.w.e",
      velocity: "45 m/yr",
      threat: "High",
      lakeAreaHa: 42.5,
      elevationM: 5200,
      description: "Source of the Chitral/Kunar River. Contains large coalescing supraglacial lakes dammed by fragile moraines.",
      image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "TirichMir",
      name: "Tirich Mir Glacier",
      valley: "Mulkhow / Torkhow",
      coords: [71.8427, 36.2415],
      massBalance: "-0.54 m.w.e",
      velocity: "30 m/yr",
      threat: "Medium",
      lakeAreaHa: 18.2,
      elevationM: 7708,
      description: "Beneath the highest peak in the Hindu Kush. Rapid icefall calving can trigger rock-ice avalanches and downstream gorges damming.",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "Darkot",
      name: "Darkot Glacier",
      valley: "Yarkhun Corridor",
      coords: [73.4184, 36.7554],
      massBalance: "-0.68 m.w.e",
      velocity: "35 m/yr",
      threat: "High",
      lakeAreaHa: 24.8,
      elevationM: 4950,
      description: "Critical high mountain pass glacier. Unstable lateral moraines funnel meltwater directly toward Yarkhun river settlements.",
      image: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "Bumburet",
      name: "Bumburet Icefield",
      valley: "Kalash Valley",
      coords: [71.656, 35.698],
      massBalance: "-1.12 m.w.e",
      velocity: "15 m/yr",
      threat: "Severe",
      lakeAreaHa: 31.4,
      elevationM: 4400,
      description: "Steep-gradient cirque glacier above Kalash heritage villages. Subject to violent cloudburst flash floods.",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80",
    },
    {
      id: "Golain",
      name: "Golain (Golen) Basin",
      valley: "Golen Valley",
      coords: [72.35, 35.9],
      massBalance: "-0.95 m.w.e",
      velocity: "28 m/yr",
      threat: "Severe",
      lakeAreaHa: 58.0,
      elevationM: 4850,
      description: "Site of the devastating July 2019 GLOF outburst that inundated power infrastructure and cut road links.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    },
  ];

export default function GlacierExplorer() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGlacier, setActiveGlacier] = useState<string>("Chiantar");

  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch("/api/glacier-search", {
        method: "POST",
        body: JSON.stringify({ query: searchQuery + " Chitral glacier flood" }),
      });
      const data = await res.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const initMap = async () => {
      maplibregl.setWorkerUrl("https://unpkg.com/maplibre-gl@6.12.0/dist/maplibre-gl-worker.mjs");
      const map = new maplibregl.Map({
        container: mapContainer.current!,
        style: {
          version: 8,
          sources: {
            satellite: {
              type: "raster",
              tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
              tileSize: 256,
              attribution: "© Esri, Maxar (Copernicus Simulation Engine)",
            },
          },
          layers: [
            {
              id: "satellite-layer",
              type: "raster",
              source: "satellite",
              minzoom: 0,
              maxzoom: 18,
            },
          ],
        },
        center: [72.8, 36.4],
        zoom: 8.5,
        pitch: 50,
        bearing: -15,
      });

      mapRef.current = map;
      map.addControl(new maplibregl.NavigationControl(), "bottom-right");

      let ro: ResizeObserver | null = null;

      map.on("load", () => {
        setMapLoaded(true);
        map.resize();

        // Add custom rendered markers (no raw emojis)
        GLACIERS.forEach((g) => {
          const el = document.createElement("div");
          const pinColor = g.threat === "Severe" ? "#DC2626" : g.threat === "High" ? "#EA580C" : "#D97706";

          el.innerHTML = `
            <div style="
              position: relative;
              width: 34px;
              height: 34px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            ">
              <div style="
                position: absolute;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background: ${pinColor};
                opacity: 0.35;
                animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></div>
              <div style="
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: ${pinColor};
                border: 2.5px solid #ffffff;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
              ">
                <div style="width: 6px; height: 6px; border-radius: 50%; background: #ffffff;"></div>
              </div>
            </div>
          `;

          el.addEventListener("mouseenter", () => {
            const inner = el.querySelector("div > div:last-child") as HTMLElement;
            if (inner) inner.style.transform = "scale(1.4)";
          });
          el.addEventListener("mouseleave", () => {
            const inner = el.querySelector("div > div:last-child") as HTMLElement;
            if (inner) inner.style.transform = "scale(1)";
          });

          el.addEventListener("click", () => {
            setActiveGlacier(g.id);
            map.flyTo({ center: g.coords as [number, number], zoom: 12, pitch: 65, speed: 1.2 });
          });

          new maplibregl.Marker({ element: el })
            .setLngLat(g.coords as [number, number])
            .addTo(map);
        });
      });

      if (mapContainer.current) {
        ro = new ResizeObserver(() => {
          map.resize();
        });
        ro.observe(mapContainer.current);
      }
    };

    initMap();
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  const activeData = GLACIERS.find((g) => g.id === activeGlacier) || GLACIERS[0];

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] bg-slate-950 text-slate-100 font-sans rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Top Header */}
      <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 z-10 gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
            title="Return to Main Dashboard"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-base font-extrabold tracking-tight flex items-center gap-2">
              <span>Earth Space Glaciological Observatory</span>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/30">
                Copernicus &amp; Landsat-9
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">Chitral District Alpine 3D Terrain Analysis</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative w-72 hidden sm:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search glaciers, moraines, or floods…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-full pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:border-teal-400 transition"
          />
        </form>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row relative overflow-hidden">
        {/* Map View */}
        <div className="flex-1 relative min-h-[350px] lg:min-h-0 w-full h-full">
          <div
            ref={mapContainer}
            className="w-full h-full"
            style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
          />
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm z-20">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-slate-300">Rendering 3D Hindu Kush relief…</span>
              </div>
            </div>
          )}

          {/* Overlay Status Pills */}
          <div className="absolute top-4 left-4 z-10 bg-slate-950/85 backdrop-blur-md border border-slate-800 p-3 rounded-2xl shadow-xl space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Copernicus Sentinel Engine Live
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Processing Landsat-9 &amp; Sentinel-2 MSI Multi-Spectral Tiles</p>
          </div>

          {/* Quick Glacier Switcher on bottom of map */}
          <div className="absolute bottom-4 left-4 right-4 z-10 overflow-x-auto flex gap-2 pb-1">
            {GLACIERS.map((g) => (
              <button
                key={g.id}
                onClick={() => {
                  setActiveGlacier(g.id);
                  mapRef.current?.flyTo({ center: g.coords as [number, number], zoom: 12, pitch: 65, speed: 1.2 });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-md backdrop-blur-md border flex items-center gap-1.5 ${
                  activeGlacier === g.id
                    ? "bg-teal-600 text-white border-teal-400 ring-2 ring-teal-400/30"
                    : "bg-slate-950/85 text-slate-300 border-slate-700 hover:bg-slate-800"
                }`}
              >
                <MountainSnow size={12} className={activeGlacier === g.id ? "text-amber-300" : "text-teal-400"} />
                <span>{g.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Glaciological Analytics */}
        <div className="w-full lg:w-96 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col z-10 overflow-y-auto max-h-[50vh] lg:max-h-full">
          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                  {activeData.valley}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    activeData.threat === "Severe"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : activeData.threat === "High"
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                      : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  }`}
                >
                  {activeData.threat} Threat
                </span>
              </div>
              <h2 className="text-2xl font-black text-white mt-1">{activeData.name}</h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{activeData.description}</p>
            </div>

            {/* Photo Thumbnail */}
            <div className="aspect-video rounded-xl overflow-hidden relative border border-slate-800 shadow">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeData.image} alt={activeData.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2.5">
                <span className="text-[10px] font-mono text-slate-300">
                  Elevation: {activeData.elevationM}m · Lake: {activeData.lakeAreaHa} ha
                </span>
              </div>
            </div>

            {/* Telemetry Stat Cards */}
            <div className="space-y-3">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3.5">
                <div className="p-2.5 bg-blue-500/15 text-blue-400 rounded-lg shrink-0">
                  <MountainSnow size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Mass Balance (Annual Deficit)</p>
                  <p className="text-base font-mono font-bold text-white">{activeData.massBalance}</p>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3.5">
                <div className="p-2.5 bg-cyan-500/15 text-cyan-400 rounded-lg shrink-0">
                  <Activity size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Ice Surface Displacement</p>
                  <p className="text-base font-mono font-bold text-white">{activeData.velocity}</p>
                </div>
              </div>
            </div>

            {/* Search Results or Live Intelligence */}
            <div className="space-y-3 border-t border-slate-800 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isSearching ? "Searching Live Data…" : searchResults ? "Live Web & News Results" : "Recent Satellite AI Intelligence"}
              </h3>

              {isSearching && (
                <div className="flex justify-center p-4">
                  <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {!isSearching && searchResults && (
                <div className="space-y-2">
                  {searchResults.results?.slice(0, 3).map((item: SearchResultItem, i: number) => (
                    <div key={i} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="font-bold text-teal-400 hover:underline block">
                        {item.title}
                      </a>
                      <p className="text-slate-400 text-[11px] leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {!isSearching && !searchResults && (
                <div className="space-y-3 text-xs">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 border-l-4 border-l-teal-500 space-y-1">
                    <p className="text-slate-300 leading-relaxed">
                      Sentinel-2 multispectral pass indicates supraglacial tarn expansion near terminus. High reflectance NDWI value (+0.42).
                    </p>
                    <p className="text-[10px] text-slate-500">Source: Copernicus Satellite Revisit • 4 hrs ago</p>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 border-l-4 border-l-amber-500 space-y-1">
                    <p className="text-slate-300 leading-relaxed">
                      Convective thermal warming detected in high catchment. Accelerated runoff forecasted for down-valley river gorges.
                    </p>
                    <p className="text-[10px] text-slate-500">Source: Sentinel Chitral Risk Engine • 6 hrs ago</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
