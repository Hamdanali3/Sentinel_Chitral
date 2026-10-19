"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ValleyRisk } from "@/lib/risk";
import ValleyCard from "@/components/ValleyCard";
import SentinelLogo from "@/components/SentinelLogo";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import {
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Navigation,
  MountainSnow,
  Activity,
  Users,
  BellRing,
  Satellite,
  Cpu,
  Radio,
  Clock,
  ArrowRight,
  Droplets,
  ExternalLink,
  PhoneCall,
  Search,
  Filter,
} from "lucide-react";

// MapLibre uses browser-only APIs — client-side only
const RiskMap = dynamic(() => import("@/components/RiskMap"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-2xl border border-gray-200 shadow-inner flex items-center justify-center bg-gray-100/80"
      style={{ height: "540px" }}
    >
      <div className="flex flex-col items-center gap-3 text-gray-500">
        <div className="w-9 h-9 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold tracking-wide">Initializing Hindu Kush topography…</span>
      </div>
    </div>
  ),
});

// Chatbot uses browser APIs
const Chatbot = dynamic(() => import("@/components/Chatbot"), { ssr: false });

export default function Home() {
  const { t } = useLanguage();
  const [risks, setRisks] = useState<{
    valleys: ValleyRisk[];
    syncedAt: string;
    demo?: true;
  } | null>(null);
  const [riskError, setRiskError] = useState<string | null>(null);
  const [selectedRouteValley, setSelectedRouteValley] = useState<string>("");
  const [filterMode, setFilterMode] = useState<"all" | "warnings" | "kalash">("all");

  useEffect(() => {
    fetch("/api/risk")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setRisks(data);
        if (data.valleys && data.valleys.length > 0) {
          setSelectedRouteValley(data.valleys[0].name.replace(" (Kalash)", ""));
        }
      })
      .catch((error: unknown) =>
        setRiskError(
          error instanceof Error ? error.message : "Risk data unavailable."
        )
      );
  }, []);

  const activeWarnings =
    risks?.valleys.filter(
      (valley) =>
        valley.riskLevel === "Warning" || valley.riskLevel === "Danger"
    ).length ?? 0;

  const filteredValleys = risks?.valleys.filter((v) => {
    if (filterMode === "warnings") {
      return v.riskLevel === "Warning" || v.riskLevel === "Danger" || v.riskLevel === "Watch";
    }
    if (filterMode === "kalash") {
      return v.name.toLowerCase().includes("kalash") || ["bumburet", "rumbur", "birir"].some((k) => v.name.toLowerCase().includes(k));
    }
    return true;
  }) || [];

  const currentSelectedRisk = risks?.valleys.find(
    (v) =>
      v.name.toLowerCase().includes(selectedRouteValley.toLowerCase()) ||
      v.name.replace(" (Kalash)", "").toLowerCase() ===
        selectedRouteValley.toLowerCase()
  );

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Humanized, Atmospheric Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#093541] via-[#0F4C5C] to-[#0A303B] text-white p-8 sm:p-14 shadow-2xl border border-teal-500/25">
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          {/* Natural Vector Logo Centerpiece */}
          <div className="flex justify-center mb-2">
            <SentinelLogo size="xl" lightText={true} />
          </div>

          <div className="inline-flex items-center gap-2 bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-wider backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Copernicus Sentinel-2 &amp; IoT Telemetry Synchronized</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
            Guarding Chitral’s Valleys with Real-Time Satellite Intelligence
          </h1>

          <p className="text-base sm:text-lg text-teal-100 max-w-2xl mx-auto leading-relaxed font-normal">
            Protecting over 500,000 residents and high-altitude travelers from Glacial Lake Outburst Floods (GLOFs), cloudburst torrents, and debris surges across 540+ Hindu Kush glaciers.
          </p>

          <div className="flex justify-center gap-3 sm:gap-4 flex-wrap pt-3">
            <Link
              href="/subscribe"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-7 py-3.5 rounded-full transition-all shadow-lg hover:shadow-amber-400/20 hover:scale-105 text-sm"
            >
              <BellRing size={16} className="text-slate-950 stroke-[2.5]" />
              <span>Subscribe for Free Alerts</span>
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 border border-white/30 bg-white/10 hover:bg-white/20 text-white font-bold px-7 py-3.5 rounded-full transition text-sm backdrop-blur-sm"
            >
              <MountainSnow size={16} className="text-teal-300" />
              <span>Glacier &amp; Disaster Info</span>
            </Link>
          </div>
        </div>

        {/* Ambient background glow & radial gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Demo Simulation Notice if Applicable */}
      {risks?.demo && (
        <div className="rounded-2xl border border-amber-300/80 bg-amber-50/90 p-4 text-xs sm:text-sm text-amber-900 flex items-start gap-3 shadow-xs">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>Simulation Telemetry Active:</strong> Running in deterministic baseline mode. Live satellite scoring will stream automatically once the GCP Firestore backend or FastAPI risk service is online.
          </div>
        </div>
      )}

      {/* Field Route Sentinel & Valley Navigator Widget (Replacing raw AI emojis) */}
      <section className="bg-gradient-to-br from-[#062028] via-[#0F4C5C] to-[#0A3844] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-teal-500/20 space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
              <Navigation size={14} />
              <span>{t.routeCheckerTitle}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Real-Time Mountain Corridor Safety Check
            </h2>
            <p className="text-teal-100 text-xs sm:text-sm mt-0.5">
              {t.routeCheckerDesc}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-black/25 px-3 py-1.5 rounded-full border border-white/10 text-xs text-teal-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Updated with Sentinel Passes</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <select
              value={selectedRouteValley}
              onChange={(e) => setSelectedRouteValley(e.target.value)}
              className="w-full bg-white text-slate-900 font-bold px-4 py-3.5 rounded-2xl border-none shadow-md focus:ring-2 focus:ring-amber-400 text-sm appearance-none cursor-pointer"
            >
              {risks?.valleys.map((v) => {
                const cleanName = v.name.replace(" (Kalash)", "");
                return (
                  <option key={v.id} value={cleanName}>
                    {v.name} — [{t.riskLevels[v.riskLevel] || v.riskLevel}]
                  </option>
                );
              })}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
              ▼
            </div>
          </div>

          {selectedRouteValley && (
            <Link
              href={`/valley/${encodeURIComponent(selectedRouteValley)}`}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black px-7 py-3.5 rounded-2xl transition shadow-md whitespace-nowrap text-sm"
            >
              <span>{t.routeCheckerBtn}</span>
              <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {/* Dynamic Route Condition Card */}
        {currentSelectedRisk && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white font-bold shadow ${
                  currentSelectedRisk.riskLevel === "Danger"
                    ? "bg-red-600"
                    : currentSelectedRisk.riskLevel === "Warning"
                    ? "bg-orange-600"
                    : currentSelectedRisk.riskLevel === "Watch"
                    ? "bg-amber-500 text-slate-950"
                    : "bg-emerald-600"
                }`}
              >
                {currentSelectedRisk.riskLevel === "Danger" ? (
                  <ShieldAlert size={18} />
                ) : currentSelectedRisk.riskLevel === "Warning" ? (
                  <AlertTriangle size={18} />
                ) : currentSelectedRisk.riskLevel === "Watch" ? (
                  <AlertTriangle size={18} />
                ) : (
                  <ShieldCheck size={18} />
                )}
              </div>

              <div>
                <p className="font-extrabold text-sm sm:text-base text-white">
                  {currentSelectedRisk.name}:{" "}
                  <span className="text-amber-300">
                    {currentSelectedRisk.riskLevel === "Danger"
                      ? t.routeStatusDanger
                      : currentSelectedRisk.riskLevel === "Warning" ||
                        currentSelectedRisk.riskLevel === "Watch"
                      ? t.routeStatusCaution
                      : t.routeStatusSafe}
                  </span>
                </p>
                <p className="text-teal-200 text-xs mt-0.5">
                  {currentSelectedRisk.advisory || currentSelectedRisk.description}
                </p>
              </div>
            </div>

            <Link
              href={`/valley/${encodeURIComponent(
                currentSelectedRisk.name.replace(" (Kalash)", "")
              )}`}
              className="inline-flex items-center gap-1 font-bold text-amber-300 hover:text-white underline underline-offset-4 text-xs shrink-0"
            >
              <span>Inspect Telemetry &amp; Contacts</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </section>

      {/* Live Operational Metrics Ribbon */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: t.statValleysMonitored,
            value: risks?.valleys.length.toString() ?? "8",
            sub: "Main drainage corridors",
            icon: Navigation,
            color: "text-[#0F4C5C]",
          },
          {
            label: t.statGlaciersTracked,
            value: "540+",
            sub: "Copernicus multispectral",
            icon: MountainSnow,
            color: "text-blue-700",
          },
          {
            label: t.statActiveWarnings,
            value: risks ? activeWarnings.toString() : "0",
            sub: activeWarnings > 0 ? "Immediate alert state" : "Normal conditions",
            icon: ShieldAlert,
            color: activeWarnings > 0 ? "text-red-600" : "text-emerald-700",
            alert: activeWarnings > 0,
          },
          {
            label: t.statSubscribers,
            value: "1,250+",
            sub: "SMS, WhatsApp & Push",
            icon: Users,
            color: "text-[#0F4C5C]",
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={`bg-white rounded-2xl border p-5 shadow-xs transition-all hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between ${
                s.alert ? "border-red-300 bg-red-50/30" : "border-gray-200/90"
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs text-gray-500 font-semibold">{s.label}</span>
                <Icon size={16} className={s.color} />
              </div>
              <div className="mt-3">
                <p className={`text-3xl font-black font-sans ${s.color}`}>
                  {s.value}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">{s.sub}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Live Map & Satellite Radar Control */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200/90 space-y-5">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                {t.liveStatusTitle}
              </h2>
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1">
              <Clock size={13} className="text-gray-400" />
              <span>{t.lastSatelliteSync}</span>
              <span className="font-semibold text-gray-700">
                {risks ? new Date(risks.syncedAt).toLocaleString() : "Syncing…"}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full border ${
                activeWarnings > 0
                  ? "text-red-700 bg-red-50 border-red-200"
                  : "text-emerald-700 bg-emerald-50 border-emerald-200"
              }`}
            >
              <span className="relative flex h-2 w-2">
                {activeWarnings > 0 && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex h-2 w-2 rounded-full ${
                    activeWarnings > 0 ? "bg-red-500" : "bg-emerald-500"
                  }`}
                />
              </span>
              <span>
                {risks
                  ? `${activeWarnings} Active Warning${activeWarnings === 1 ? "" : "s"}`
                  : "Syncing satellite status"}
              </span>
            </span>
          </div>
        </div>

        {riskError ? (
          <>
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
              {riskError}
            </div>
            <RiskMap valleys={[]} />
          </>
        ) : risks ? (
          <RiskMap valleys={risks.valleys} />
        ) : (
          <div className="h-[540px] rounded-2xl border bg-gray-100 flex items-center justify-center text-gray-500 text-xs">
            Loading current risk data…
          </div>
        )}
      </section>

      {/* Monitored Valleys Grid with Interactive Filtering */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
          <div>
            <h2 className="text-2xl font-black text-[#0F4C5C] tracking-tight">
              Monitored Chitral Valleys ({risks?.valleys.length ?? 8})
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Real-time glacial lake telemetry, NDWI trends, elevation relief, and road travel advisories.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="inline-flex items-center bg-gray-100 p-1 rounded-xl text-xs font-bold text-gray-600 gap-1">
            <button
              onClick={() => setFilterMode("all")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterMode === "all" ? "bg-white text-[#0F4C5C] shadow-xs" : "hover:text-gray-900"
              }`}
            >
              All Valleys ({risks?.valleys.length ?? 8})
            </button>
            <button
              onClick={() => setFilterMode("warnings")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterMode === "warnings" ? "bg-white text-red-700 shadow-xs" : "hover:text-gray-900"
              }`}
            >
              Watch &amp; Warnings
            </button>
            <button
              onClick={() => setFilterMode("kalash")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterMode === "kalash" ? "bg-white text-teal-800 shadow-xs" : "hover:text-gray-900"
              }`}
            >
              Kalash Valleys
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredValleys.map((valley) => (
            <ValleyCard key={valley.id} valley={valley} />
          ))}
        </div>
      </section>

      {/* Glacier Science & Historical Disaster Highlights Showcase */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              <MountainSnow size={14} />
              <span>Chitral Glaciological Observatory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              Understanding the Threat: Glaciers &amp; Historical Floods
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Inspect documented moraine breaches, historical 2015 flood damage, and scientific drone surveys of Chitral’s critical glaciers.
            </p>
          </div>

          <Link
            href="/about"
            className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-5 py-2.5 rounded-full text-xs shadow transition shrink-0"
          >
            <span>Open Full Glacier Intelligence Archive</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 3 Visual Highlights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Tirich Mir & Mulkhow Icefields",
              desc: "Standing at 7,708m, Tirich Mir's hanging glaciers generate intense seasonal meltwater surges into Mulkhow and Torkhow.",
              badge: "7,708m Peak",
              img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
            },
            {
              title: "The 2015 Reshun Catastrophe",
              desc: "Historic PDMA baseline event: massive flash floods destroyed 35 bridges and the Reshun power station, affecting 300,000 residents.",
              badge: "PDMA Ground Truth",
              img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
            },
            {
              title: "Chiantar Glacier Supraglacial Lakes",
              desc: "A 34km-long glacial river feeding the Chitral/Kunar river. Rapidly expanding tarns pose long-range surge hazards downstream.",
              badge: "Broghil Basin",
              img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-slate-900/80 rounded-2xl overflow-hidden border border-slate-800 hover:border-teal-500/50 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm text-teal-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-white/10">
                    {item.badge}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-white transition"
                >
                  <span>Explore Case Study &amp; Photos</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works (Replacing raw AI emojis) */}
      <section className="space-y-6 pt-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs uppercase font-bold text-teal-700 tracking-wider">
            Architecture &amp; Data Integration
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F4C5C]">
            How Sentinel Chitral Operates
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            A tripartite pipeline combining Copernicus space assets, terrain physics, and community telecommunications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Satellite,
              title: "Copernicus Sentinel-2 Tracking",
              desc: "Automated analysis of 10-meter resolution multispectral passes computing the Normalized Difference Water Index (NDWI) over Chitral's 540+ glaciers every 5 days.",
              color: "text-blue-600 bg-blue-50 border-blue-100",
            },
            {
              icon: Cpu,
              title: "Physics-Informed ML Core",
              desc: "Machine learning classifier combining elevation relief, seasonal thermal melt cycles, and the 2015-2023 PDMA historical flood ground truth into 4 actionable risk levels.",
              color: "text-teal-700 bg-teal-50 border-teal-100",
            },
            {
              icon: Radio,
              title: "Multilingual Outbound Dispatches",
              desc: "Automated instant push alerts delivered via Web Push, SMS, and WhatsApp in English, Urdu (اردو), and Khowar (کھوار) even in low-connectivity valleys.",
              color: "text-amber-700 bg-amber-50 border-amber-100",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs hover:shadow-lg transition-all text-center space-y-4 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center border ${item.color}`}>
                  <Icon size={26} />
                </div>
                <h3 className="font-extrabold text-base text-[#0F4C5C]">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Emergency Hotline Ribbon */}
      <section className="bg-red-50 border border-red-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
            <PhoneCall size={20} />
          </div>
          <div>
            <span className="font-black text-red-900 block text-sm">
              24/7 District Emergency Disaster Hotlines
            </span>
            <span className="text-red-700 text-xs">
              Direct emergency coordination for flash floods, landslides, and road blockages across Chitral.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="bg-white border border-red-200 text-red-900 px-3 py-1.5 rounded-lg font-bold">
            Rescue 1122: <strong className="text-red-600">1122</strong>
          </span>
          <span className="bg-white border border-red-200 text-red-900 px-3 py-1.5 rounded-lg font-bold">
            PDMA KP: <strong className="text-red-600">1700</strong>
          </span>
          <span className="bg-white border border-red-200 text-red-900 px-3 py-1.5 rounded-lg font-bold">
            Levies: <strong className="text-red-600">15</strong>
          </span>
        </div>
      </section>

      {/* AI Assistant */}
      <Chatbot />
    </div>
  );
}
