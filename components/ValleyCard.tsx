"use client";

import React from "react";
import Link from "next/link";
import { ValleyRisk } from "@/lib/risk";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  ShieldCheck,
  AlertTriangle,
  Eye,
  ShieldAlert,
  Droplets,
  Thermometer,
  CloudRain,
  ArrowRight,
  MapPin,
  TrendingUp,
} from "lucide-react";

interface ValleyCardProps {
  valley: ValleyRisk;
}

const RISK_CONFIG: Record<
  string,
  {
    bg: string;
    text: string;
    border: string;
    cardBorder: string;
    icon: React.ElementType;
    badgeBg: string;
    pillClass: string;
  }
> = {
  Danger: {
    bg: "bg-red-50/70",
    text: "text-red-700",
    border: "border-red-200",
    cardBorder: "hover:border-red-400 group-hover:border-red-300",
    icon: ShieldAlert,
    badgeBg: "bg-red-600 text-white",
    pillClass: "bg-red-100 text-red-800 border-red-200",
  },
  Warning: {
    bg: "bg-orange-50/70",
    text: "text-orange-800",
    border: "border-orange-200",
    cardBorder: "hover:border-orange-400 group-hover:border-orange-300",
    icon: AlertTriangle,
    badgeBg: "bg-orange-600 text-white",
    pillClass: "bg-orange-100 text-orange-900 border-orange-200",
  },
  Watch: {
    bg: "bg-amber-50/70",
    text: "text-amber-800",
    border: "border-amber-200",
    cardBorder: "hover:border-amber-400 group-hover:border-amber-300",
    icon: Eye,
    badgeBg: "bg-amber-500 text-slate-950 font-bold",
    pillClass: "bg-amber-100 text-amber-900 border-amber-200",
  },
  Low: {
    bg: "bg-emerald-50/70",
    text: "text-emerald-800",
    border: "border-emerald-200",
    cardBorder: "hover:border-emerald-400 group-hover:border-emerald-300",
    icon: ShieldCheck,
    badgeBg: "bg-emerald-600 text-white",
    pillClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
};

export default function ValleyCard({ valley }: ValleyCardProps) {
  const { t } = useLanguage();
  const config = RISK_CONFIG[valley.riskLevel] || RISK_CONFIG.Low;
  const Icon = config.icon;
  const translatedLevel = t.riskLevels[valley.riskLevel] || valley.riskLevel;
  const cleanName = valley.name.replace(" (Kalash)", "");

  return (
    <div className={`group bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-5 flex flex-col justify-between relative overflow-hidden ${config.cardBorder}`}>
      {/* Top ambient color strip indicator */}
      <div
        className={`absolute top-0 left-0 right-0 h-1.5 ${
          valley.riskLevel === "Danger"
            ? "bg-red-500"
            : valley.riskLevel === "Warning"
            ? "bg-orange-500"
            : valley.riskLevel === "Watch"
            ? "bg-amber-500"
            : "bg-emerald-500"
        }`}
      />

      <div className="space-y-3 pt-1">
        {/* Header: Title and Status Badge */}
        <div className="flex justify-between items-start gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-teal-800/70 flex items-center gap-1">
              <MapPin size={11} className="text-teal-600" />
              Chitral Valley Corridor
            </span>
            <h3 className="font-extrabold text-lg text-[#0F4C5C] leading-snug group-hover:text-teal-700 transition">
              {valley.name}
            </h3>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border shadow-2xs ${config.pillClass}`}
          >
            <Icon size={13} className="shrink-0 stroke-[2.5]" />
            <span>{translatedLevel}</span>
          </span>
        </div>

        {/* Narrative description */}
        <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed min-h-[32px]">
          {valley.description}
        </p>

        {/* Real-time telemetry pills */}
        {valley.telemetry && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-[11px]">
            <div className="bg-slate-50/80 rounded-xl p-2 border border-gray-100 flex items-center gap-2">
              <Droplets size={14} className="text-teal-600 shrink-0" />
              <div>
                <span className="text-gray-400 block text-[10px] leading-tight">Lake NDWI</span>
                <span className="font-bold text-gray-800 font-mono">
                  {valley.telemetry.ndwi_index}
                </span>
              </div>
            </div>

            <div className="bg-slate-50/80 rounded-xl p-2 border border-gray-100 flex items-center gap-2">
              <Thermometer size={14} className="text-amber-600 shrink-0" />
              <div>
                <span className="text-gray-400 block text-[10px] leading-tight">Temp / Rain</span>
                <span className="font-bold text-gray-800 font-mono text-[10px]">
                  {valley.telemetry.temperature_c}°C · {valley.telemetry.rainfall_24h_mm}mm
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer link & Confidence Score */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <span className="text-[11px] text-gray-400 font-medium">
          ML Model: {Math.round(valley.confidence * 100)}% Conf.
        </span>

        <Link
          href={`/valley/${encodeURIComponent(cleanName)}`}
          className="font-bold text-teal-700 hover:text-teal-900 transition flex items-center gap-1 group-hover:translate-x-0.5"
        >
          <span>{t.details.viewRouteDetails}</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
