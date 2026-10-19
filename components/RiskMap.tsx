"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import {
  Satellite,
  Layers,
  CloudRain,
  MapPin,
  ShieldAlert,
  AlertTriangle,
  Eye,
  ShieldCheck,
  Maximize2,
} from "lucide-react";

interface Valley {
  id: string;
  name: string;
  coordinates: [number, number];
  riskLevel: "Low" | "Watch" | "Warning" | "Danger";
  description?: string;
}

interface RiskMapProps {
  valleys: Valley[];
}

const RISK_COLORS: Record<string, string> = {
  Danger: "#DC2626",
  Warning: "#EA580C",
  Watch: "#D97706",
  Low: "#16A34A",
};

const RISK_BADGE_BG: Record<string, string> = {
  Danger: "bg-red-600",
  Warning: "bg-orange-600",
  Watch: "bg-amber-500",
  Low: "bg-emerald-600",
};

import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function RiskMap({ valleys }: RiskMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showWeather, setShowWeather] = useState(false);
  const [showSatellite, setShowSatellite] = useState(false);
  const [radarTimestamp, setRadarTimestamp] = useState<number | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  // Fetch the latest RainViewer radar timestamp
  useEffect(() => {
    fetch("https://api.rainviewer.com/public/weather-maps.json")
      .then((r) => r.json())
      .then((data) => {
        const ts = data?.radar?.past?.at(-1)?.time;
        if (ts) setRadarTimestamp(ts);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    let map: MapLibreMap | undefined;

    const initMap = async () => {
      maplibregl.setWorkerUrl("https://unpkg.com/maplibre-gl@6.12.0/dist/maplibre-gl-worker.mjs");

      map = new maplibregl.Map({
        container: mapContainer.current!,
        style: {
          version: 8,
          sources: {
            "osm-tiles": {
              type: "raster",
              tiles: [
                "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
              ],
              tileSize: 256,
              attribution: "© OpenStreetMap contributors",
            },
            "satellite-tiles": {
              type: "raster",
              tiles: [
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
              ],
              tileSize: 256,
              attribution: "© Esri, Maxar, Earthstar Geographics",
            },
          },
          layers: [
            {
              id: "osm-layer",
              type: "raster",
              source: "osm-tiles",
              minzoom: 0,
              maxzoom: 19,
            },
            {
              id: "satellite-layer",
              type: "raster",
              source: "satellite-tiles",
              minzoom: 0,
              maxzoom: 19,
              layout: { visibility: "none" },
            },
          ],
        },
        center: [71.7978, 35.851], // Chitral district center
        zoom: 8,
        minZoom: 6,
        maxZoom: 16,
        attributionControl: false,
      });

      mapRef.current = map;

      map.addControl(new maplibregl.NavigationControl(), "top-right");
      map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
      map.addControl(
        new maplibregl.ScaleControl({ maxWidth: 100, unit: "metric" }),
        "bottom-left"
      );

      map.on("load", () => {
        setMapLoaded(true);
        const currentMap = map;
        if (!currentMap) return;

        // Add custom rendered markers with high-contrast radar pulses
        valleys.forEach((valley) => {
          const el = document.createElement("div");
          const pinColor = RISK_COLORS[valley.riskLevel] || "#16A34A";
          const isHighRisk = valley.riskLevel === "Danger" || valley.riskLevel === "Warning";

          el.innerHTML = `
            <div class="sentinel-map-pin" style="
              position: relative;
              width: 32px;
              height: 32px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            ">
              ${
                isHighRisk
                  ? `<div style="
                      position: absolute;
                      width: 100%;
                      height: 100%;
                      border-radius: 50%;
                      background-color: ${pinColor};
                      opacity: 0.45;
                      animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                    "></div>`
                  : ""
              }
              <div style="
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: ${pinColor};
                border: 2.5px solid #ffffff;
                box-shadow: 0 4px 10px rgba(0,0,0,0.35);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
              ">
                <div style="width: 7px; height: 7px; border-radius: 50%; background: #ffffff;"></div>
              </div>
            </div>
          `;

          el.addEventListener("mouseenter", () => {
            const inner = el.querySelector(".sentinel-map-pin > div:last-child") as HTMLElement;
            if (inner) inner.style.transform = "scale(1.35)";
          });
          el.addEventListener("mouseleave", () => {
            const inner = el.querySelector(".sentinel-map-pin > div:last-child") as HTMLElement;
            if (inner) inner.style.transform = "scale(1)";
          });

          const cleanName = valley.name.replace(" (Kalash)", "");
          const popup = new maplibregl.Popup({ offset: 18, closeButton: true }).setHTML(`
            <div style="font-family: inherit; min-width: 190px; padding: 2px;">
              <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; color: #0F4C5C;">
                Chitral Valley
              </span>
              <h3 style="margin: 2px 0 6px; font-size: 15px; font-weight: 800; color: #0f172a;">${valley.name}</h3>
              <div style="
                display: inline-flex;
                align-items: center;
                gap: 5px;
                padding: 3px 10px;
                border-radius: 9999px;
                background: ${pinColor};
                color: #ffffff;
                font-size: 11px;
                font-weight: 700;
              ">
                <span>●</span>
                <span>${valley.riskLevel} Risk</span>
              </div>
              ${
                valley.description
                  ? `<p style="margin: 8px 0; font-size: 11px; line-height: 1.45; color: #475569;">${valley.description}</p>`
                  : ""
              }
              <div style="margin-top: 8px; border-top: 1px solid #e2e8f0; padding-top: 6px;">
                <a href="/valley/${encodeURIComponent(cleanName)}" style="
                  display: inline-block;
                  font-size: 11px;
                  font-weight: 700;
                  color: #0F4C5C;
                  text-decoration: underline;
                ">
                  Inspect Real-Time Advisory →
                </a>
              </div>
            </div>
          `);

          new maplibregl.Marker({ element: el })
            .setLngLat(valley.coordinates)
            .setPopup(popup)
            .addTo(currentMap);
        });

        currentMap.on("error", (event) => {
          console.error("[risk-map] Map service error:", event.error);
          setMapError("Some map tiles could not be loaded. Check your connection or try the street map.");
        });
      });
    };

    initMap();

    return () => {
      if (map) map.remove();
      mapRef.current = null;
    };
  }, [valleys]);

  // Toggle Esri satellite imagery
  useEffect(() => {
    const map = mapRef.current;
    if (!mapLoaded || !map || !map.getLayer("satellite-layer")) return;
    map.setLayoutProperty("satellite-layer", "visibility", showSatellite ? "visible" : "none");
    map.setLayoutProperty("osm-layer", "visibility", showSatellite ? "none" : "visible");
  }, [showSatellite, mapLoaded]);

  // Toggle RainViewer weather radar layer
  useEffect(() => {
    const map = mapRef.current;
    if (!mapLoaded || !map || !radarTimestamp) return;

    const sourceId = "rainviewer-radar";
    const layerId = "rainviewer-layer";

    if (showWeather) {
      if (!map.getSource(sourceId)) {
        map.addSource(sourceId, {
          type: "raster",
          tiles: [
            `https://tilecache.rainviewer.com/v2/radar/${radarTimestamp}/256/{z}/{x}/{y}/4/1_1.png`,
          ],
          tileSize: 256,
          attribution: "RainViewer",
          maxzoom: 10,
        });
        map.addLayer({
          id: layerId,
          type: "raster",
          source: sourceId,
          paint: { "raster-opacity": 0.6 },
        });
      }
    } else {
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    }
  }, [showWeather, mapLoaded, radarTimestamp]);

  return (
    <div className="relative space-y-3">
      {/* Map Controls & Visual Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowSatellite((value) => !value)}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all shadow-xs ${
              showSatellite
                ? "bg-slate-900 text-white border-slate-900 ring-2 ring-slate-800/20"
                : "bg-white text-gray-700 border-gray-300 hover:border-slate-500 hover:bg-gray-50"
            }`}
          >
            <Satellite size={14} className={showSatellite ? "text-amber-400" : "text-teal-700"} />
            <span>{showSatellite ? "Street Topography" : "Copernicus Satellite Mode"}</span>
          </button>

          <button
            onClick={() => setShowWeather((v) => !v)}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all shadow-xs ${
              showWeather
                ? "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-500/20"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }`}
          >
            <CloudRain size={14} className={showWeather ? "text-white" : "text-blue-600"} />
            <span>{showWeather ? "Hide Doppler Radar" : "Live Rainfall Radar"}</span>
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-700 bg-white border border-gray-200 rounded-full px-3.5 py-1.5 shadow-2xs">
          <span className="text-gray-400 font-medium text-[10px] uppercase tracking-wider">Severity:</span>
          {Object.entries(RISK_COLORS).map(([level, color]) => (
            <span key={level} className="flex items-center gap-1.5">
              <span
                style={{ background: color }}
                className="w-2.5 h-2.5 rounded-full ring-2 ring-white inline-block shadow-xs"
              />
              <span>{level}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Map Container Canvas */}
      <div
        ref={mapContainer}
        className="w-full rounded-2xl border border-gray-300/80 shadow-md overflow-hidden relative"
        style={{ height: "540px", background: "#e8e0d8" }}
      />

      {mapError && (
        <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5">
          {mapError}
        </p>
      )}

      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/90 rounded-2xl backdrop-blur-xs z-20">
          <div className="flex flex-col items-center gap-3 text-gray-600">
            <div className="w-9 h-9 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-bold tracking-wide">Syncing Hindu Kush satellite coordinates…</span>
          </div>
        </div>
      )}
    </div>
  );
}
