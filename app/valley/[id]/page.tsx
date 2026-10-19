"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { ValleyRisk, HistoryPoint } from "@/lib/risk";
import RiskTrendChart from "@/components/RiskTrendChart";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  ShieldAlert,
  AlertTriangle,
  Eye,
  ShieldCheck,
  ArrowLeft,
  MapPin,
  Clock,
  Droplets,
  MountainSnow,
  Thermometer,
  CloudRain,
  PhoneCall,
  BellRing,
  Activity,
  Layers,
  ChevronRight,
} from "lucide-react";

const RISK_THEMES: Record<
  string,
  {
    bg: string;
    border: string;
    text: string;
    badgeBg: string;
    badgeText: string;
    icon: React.ElementType;
  }
> = {
  Danger: {
    bg: "bg-red-50/80",
    border: "border-red-300",
    text: "text-red-950",
    badgeBg: "bg-red-600",
    badgeText: "text-white",
    icon: ShieldAlert,
  },
  Warning: {
    bg: "bg-orange-50/80",
    border: "border-orange-300",
    text: "text-orange-950",
    badgeBg: "bg-orange-600",
    badgeText: "text-white",
    icon: AlertTriangle,
  },
  Watch: {
    bg: "bg-amber-50/80",
    border: "border-amber-300",
    text: "text-amber-950",
    badgeBg: "bg-amber-500",
    badgeText: "text-slate-950 font-bold",
    icon: Eye,
  },
  Low: {
    bg: "bg-emerald-50/80",
    border: "border-emerald-300",
    text: "text-emerald-950",
    badgeBg: "bg-emerald-600",
    badgeText: "text-white",
    icon: ShieldCheck,
  },
};

export default function ValleyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const decodedId = decodeURIComponent(id);
  const { t } = useLanguage();

  const [valley, setValley] = useState<ValleyRisk | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/valleys/${encodeURIComponent(decodedId)}`)
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to load valley");
        }
        return res.json();
      })
      .then((data) => {
        setValley(data.detail);
        setHistory(data.history || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading valley:", err);
        setError(err instanceof Error ? err.message : "Error loading valley");
        setLoading(false);
      });
  }, [decodedId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-semibold text-sm">
          Loading {decodedId} glacial lake telemetry and risk assessment…
        </p>
      </div>
    );
  }

  if (error || !valley) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-5 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
          <MountainSnow size={32} />
        </div>
        <h1 className="text-2xl font-black text-gray-900">Valley Advisory Not Found</h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Could not find monitoring records for &quot;{decodedId}&quot;. Please return to the live district map.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#0F4C5C] text-white px-6 py-3 rounded-full font-bold hover:bg-teal-800 transition text-sm shadow"
        >
          <ArrowLeft size={16} />
          <span>Return to Live Map</span>
        </Link>
      </div>
    );
  }

  const theme = RISK_THEMES[valley.riskLevel] || RISK_THEMES.Low;
  const Icon = theme.icon;
  const translatedLevel = t.riskLevels[valley.riskLevel] || valley.riskLevel;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-semibold text-gray-500">
        <Link
          href="/"
          className="hover:text-teal-800 transition flex items-center gap-1.5 text-teal-700"
        >
          <ArrowLeft size={14} />
          <span>Back to Live District Map</span>
        </Link>
        <span className="flex items-center gap-1 text-gray-400 font-mono">
          <MapPin size={12} className="text-teal-600" />
          <span>[{valley.coordinates[0].toFixed(3)}°E, {valley.coordinates[1].toFixed(3)}°N]</span>
        </span>
      </div>

      {/* Main Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider font-extrabold text-teal-800 bg-teal-50 border border-teal-200/60 px-3 py-1 rounded-md inline-block">
              Chitral Drainage Corridor
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0F4C5C] tracking-tight">
              {valley.name}
            </h1>
            <p className="text-xs text-gray-400 flex items-center gap-1.5 pt-0.5">
              <Clock size={12} />
              <span>Last Sentinel pass: {new Date(valley.updatedAt).toLocaleString()}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm tracking-wide shadow-xs flex items-center gap-2 ${theme.badgeBg} ${theme.badgeText}`}
            >
              <Icon size={16} className="shrink-0 stroke-[2.5]" />
              <span>{translatedLevel.toUpperCase()} RISK</span>
            </span>
          </div>
        </div>

        {/* Advisory Banner */}
        <div className={`p-5 rounded-2xl border ${theme.bg} ${theme.border} ${theme.text} space-y-2`}>
          <div className="flex items-center gap-2 font-bold text-sm">
            <Icon size={16} className="shrink-0" />
            <span>Safety &amp; Mountain Route Advisory:</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed">
            {valley.advisory || valley.description}
          </p>
        </div>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-teal-700">
            <span className="text-xs text-gray-400 font-semibold">NDWI Water Index</span>
            <Droplets size={16} />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-teal-800 font-mono">
              {valley.telemetry?.ndwi_index ?? "0.08"}
            </span>
            <span className="text-[10px] text-gray-400 block mt-0.5">Sentinel-2 reflectance</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#0F4C5C]">
            <span className="text-xs text-gray-400 font-semibold">Lake Surface Area</span>
            <MountainSnow size={16} />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-[#0F4C5C] font-mono">
              {valley.telemetry?.water_area_ha ? `${valley.telemetry.water_area_ha} ha` : "—"}
            </span>
            <span className="text-[10px] text-gray-400 block mt-0.5">Glacial perimeter</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs text-gray-400 font-semibold">Alpine Temperature</span>
            <Thermometer size={16} />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-amber-600 font-mono">
              {valley.telemetry ? `${valley.telemetry.temperature_c}°C` : "—"}
            </span>
            <span className="text-[10px] text-gray-400 block mt-0.5">Thermal melt index</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs text-gray-400 font-semibold">24h Precipitation</span>
            <CloudRain size={16} />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black text-blue-600 font-mono">
              {valley.telemetry ? `${valley.telemetry.rainfall_24h_mm} mm` : "0.0 mm"}
            </span>
            <span className="text-[10px] text-gray-400 block mt-0.5">Rainfall &amp; runoff</span>
          </div>
        </div>
      </div>

      {/* 30-Day Historical Trend Graph */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-sm space-y-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">
            {t.details.recentTrend}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Derived from 5-day Copernicus Sentinel-2 passes correlated with automated meteorological telemetry.
          </p>
        </div>
        <RiskTrendChart history={history} />
      </div>

      {/* Emergency Assistance & Contacts */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/90 shadow-sm space-y-5">
        <div>
          <h2 className="text-xl font-black text-red-700 flex items-center gap-2">
            <PhoneCall size={20} className="text-red-600" />
            <span>{t.details.emergencyContacts}</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {t.details.emergencyDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="p-4 bg-red-50/70 border border-red-200 rounded-2xl space-y-1">
            <span className="text-xs font-bold text-red-800 block">PDMA KP Disaster Control Room</span>
            <span className="text-2xl font-black text-red-700 font-mono block">1700</span>
            <span className="text-[11px] text-red-600 block">24/7 Provincial Early Warning Center</span>
          </div>

          <div className="p-4 bg-red-50/70 border border-red-200 rounded-2xl space-y-1">
            <span className="text-xs font-bold text-red-800 block">Rescue 1122 Chitral Headquarters</span>
            <span className="text-2xl font-black text-red-700 font-mono block">1122</span>
            <span className="text-[11px] text-red-600 block">0943-412952 (Rapid Response)</span>
          </div>

          <div className="p-4 bg-red-50/70 border border-red-200 rounded-2xl space-y-1">
            <span className="text-xs font-bold text-red-800 block">Chitral Police / District Levies</span>
            <span className="text-2xl font-black text-red-700 font-mono block">15</span>
            <span className="text-[11px] text-red-600 block">0943-412122 (Roads &amp; Passes)</span>
          </div>
        </div>
      </div>

      {/* Subscribe Banner */}
      <div className="bg-gradient-to-r from-teal-900 to-[#0F4C5C] text-white p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xl border border-teal-500/20">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase">
            <BellRing size={14} />
            <span>Automated Early Warning Delivery</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            Get instant push alerts for {valley.name}
          </h3>
          <p className="text-teal-100 text-xs sm:text-sm max-w-lg leading-relaxed">
            Receive automated SMS, WhatsApp, and Web Push notifications in English, Urdu, and Khowar if water thresholds trigger a Warning or Danger alert.
          </p>
        </div>

        <Link
          href="/subscribe"
          className="shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3 rounded-full text-xs sm:text-sm shadow-md transition-transform hover:scale-105"
        >
          Subscribe to Alerts
        </Link>
      </div>
    </div>
  );
}
