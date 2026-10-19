"use client";

import React, { useState } from "react";
import { HistoryPoint } from "@/lib/risk";

interface RiskTrendChartProps {
  history: HistoryPoint[];
}

export default function RiskTrendChart({ history }: RiskTrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!history || history.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center bg-gray-50 border rounded-xl text-gray-400 text-sm">
        No historical trend data available.
      </div>
    );
  }

  const width = 600;
  const height = 180;
  const padding = { top: 20, right: 30, bottom: 30, left: 40 };

  const ndwiValues = history.map((h) => h.ndwi);
  const minNdwi = Math.min(...ndwiValues, 0.0);
  const maxNdwi = Math.max(...ndwiValues, 0.25);

  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const getX = (index: number) =>
    padding.left + (index / (history.length - 1)) * innerWidth;

  const getY = (val: number) =>
    padding.top +
    innerHeight -
    ((val - minNdwi) / (maxNdwi - minNdwi || 1)) * innerHeight;

  const points = history.map((h, i) => `${getX(i)},${getY(h.ndwi)}`).join(" ");

  const areaPoints = `${padding.left},${padding.top + innerHeight} ${points} ${
    padding.left + innerWidth
  },${padding.top + innerHeight}`;

  const hoveredPoint = hoveredIndex !== null ? history[hoveredIndex] : null;

  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm space-y-3">
      <div className="flex justify-between items-center text-xs flex-wrap gap-2">
        <span className="font-semibold text-gray-700">
          📈 30-Day Sentinel-2 Glacial Lake Water Index (NDWI)
        </span>
        <div className="flex items-center gap-3 text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" />
            NDWI (Water Area)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            Rainfall Event
          </span>
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-44 overflow-visible"
        >
          {/* Grid lines */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={width - padding.right}
            y2={padding.top}
            stroke="#e5e7eb"
            strokeDasharray="3 3"
          />
          <line
            x1={padding.left}
            y1={padding.top + innerHeight / 2}
            x2={width - padding.right}
            y2={padding.top + innerHeight / 2}
            stroke="#e5e7eb"
            strokeDasharray="3 3"
          />
          <line
            x1={padding.left}
            y1={padding.top + innerHeight}
            x2={width - padding.right}
            y2={padding.top + innerHeight}
            stroke="#e5e7eb"
          />

          {/* Area under curve */}
          <polygon points={areaPoints} fill="url(#teal-grad)" opacity="0.3" />

          {/* Line curve */}
          <polyline
            fill="none"
            stroke="#0F4C5C"
            strokeWidth="2.5"
            points={points}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Rainfall bars at the bottom */}
          {history.map((h, i) => {
            if (h.rainfall_mm <= 0) return null;
            const barHeight = Math.min(30, h.rainfall_mm * 1.5);
            return (
              <rect
                key={i}
                x={getX(i) - 2}
                y={padding.top + innerHeight - barHeight}
                width={4}
                height={barHeight}
                fill="#f59e0b"
                opacity="0.7"
                rx={1}
              />
            );
          })}

          {/* Points */}
          {history.map((h, i) => (
            <circle
              key={i}
              cx={getX(i)}
              cy={getY(h.ndwi)}
              r={hoveredIndex === i ? 5 : 2.5}
              fill={
                h.risk_level === "Danger"
                  ? "#C62828"
                  : h.risk_level === "Warning"
                  ? "#EF6C00"
                  : h.risk_level === "Watch"
                  ? "#F9A825"
                  : "#2E7D32"
              }
              stroke="#ffffff"
              strokeWidth="1.5"
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredIndex(i)}
            />
          ))}

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="teal-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F4C5C" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0F4C5C" stopOpacity="0.0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg pointer-events-none flex items-center gap-3 z-10">
            <span className="font-semibold">{hoveredPoint.date}</span>
            <span>NDWI: {hoveredPoint.ndwi}</span>
            <span>Temp: {hoveredPoint.temperature_c}°C</span>
            <span>Rain: {hoveredPoint.rainfall_mm}mm</span>
            <span
              className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                hoveredPoint.risk_level === "Danger"
                  ? "bg-red-600"
                  : hoveredPoint.risk_level === "Warning"
                  ? "bg-orange-600"
                  : hoveredPoint.risk_level === "Watch"
                  ? "bg-amber-600"
                  : "bg-green-600"
              }`}
            >
              {hoveredPoint.risk_level}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between text-[11px] text-gray-400 px-2">
        <span>30 Days Ago ({history[0]?.date})</span>
        <span>Today ({history[history.length - 1]?.date})</span>
      </div>
    </div>
  );
}
