"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MountainSnow,
  Waves,
  AlertTriangle,
  Droplets,
  ShieldCheck,
  Activity,
  Play,
  Film,
  BookOpen,
  Layers,
  ArrowRight,
  ExternalLink,
  History,
  Radio,
  ThermometerSun,
  ShieldAlert,
  CheckCircle2,
  Share2,
} from "lucide-react";

interface DisasterEvent {
  year: string;
  title: string;
  location: string;
  severity: "Catastrophic" | "Severe" | "High";
  description: string;
  impact: string[];
  imageUrl: string;
  imageCaption: string;
}

interface GlacierProfile {
  id: string;
  name: string;
  range: string;
  lengthKm: number;
  altitudeM: number;
  threatLevel: "Severe" | "High" | "Moderate";
  dangerFactor: string;
  imageUrl: string;
  imageCaption: string;
  summary: string;
  keyHazards: string[];
}

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "glaciers" | "disasters" | "videos" | "circularity">("overview");
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  // Curated documentary and field analysis videos
  const videos = [
    {
      id: "glof-pakistan-doc",
      title: "Chitral GLOF Vulnerability & Early Warning Systems",
      duration: "09:42",
      channel: "UNDP Pakistan / Climate Risk Directorate",
      embedUrl: "https://www.youtube-nocookie.com/embed/n4p5wQ-f0uU",
      description:
        "Documenting high-altitude glacial lake formations in upper Chitral, moraine breach mechanics, and the installation of solar-powered early warning sirens in Bumburet and Reshun.",
      thumbnail:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "hindu-kush-meltdown",
      title: "The Melting Hindu Kush: Glacier Dynamics & River Surges",
      duration: "14:18",
      channel: "ICIMOD / Glaciology Field Survey",
      embedUrl: "https://www.youtube-nocookie.com/embed/YpXq4_T4R6I",
      description:
        "Scientific expedition analyzing annual mass balance deficit across Tirich Mir and Chiantar glaciers, demonstrating thermal heatwave impacts on supraglacial lakes.",
      thumbnail:
        "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: "reshun-recovery",
      title: "Reshun & Golen Valley: 2015-2023 Flood Aftermath & Rebuilding",
      duration: "11:05",
      channel: "PDMA KP Disaster Management Review",
      embedUrl: "https://www.youtube-nocookie.com/embed/5a6B89iQW_U",
      description:
        "Ground survey of the 2015 historical flood impact in Reshun and how ecological bio-engineering and satellite monitoring are protecting rebuilt communication bridges.",
      thumbnail:
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  // Comprehensive Chitral Glacier Catalog
  const glaciers: GlacierProfile[] = [
    {
      id: "chiantar",
      name: "Chiantar Glacier",
      range: "Broghil Valley / Upper Hindu Raj",
      lengthKm: 34,
      altitudeM: 5200,
      threatLevel: "High",
      dangerFactor: "Expanding Supraglacial Lake Cluster",
      imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "Terminus of Chiantar Glacier feeding the headwaters of the Yarkhun and Chitral rivers in Broghil.",
      summary:
        "The largest glacier system in eastern Hindu Kush. Melting at -0.8 meters water equivalent per year, Chiantar feeds the headwaters of the Chitral/Kunar river system. Expanding moraine-dammed lakes pose long-range surge risks to Yarkhun and Mastuj corridors.",
      keyHazards: [
        "Rapid lake coalescence at glacier terminus",
        "Over 120km downstream impact reach into Mastuj",
        "High vulnerability during July-August peak thermal melt",
      ],
    },
    {
      id: "tirich-mir",
      name: "Tirich Mir Glacier Complex",
      range: "Mulkhow / Torkhow Valley (7,708m)",
      lengthKm: 28,
      altitudeM: 7708,
      threatLevel: "Severe",
      dangerFactor: "Hanging Ice Avalanches & Steep Moraine Relief",
      imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "Towering granite ridges and tumbling ice cascades beneath the north face of Tirich Mir.",
      summary:
        "Descending from the highest summit in the Hindu Kush range. The steep gradient causes sudden surging ice tongues and unstable lateral moraines that frequently trigger catastrophic debris flows down into Mulkhow and Torkhow.",
      keyHazards: [
        "High-velocity serac collapse triggering moraine breach",
        "Debris blocking the river gorge creates sudden damming",
        "Monsoon cloudburst collisions accelerate kinetic runoff",
      ],
    },
    {
      id: "golen-gol",
      name: "Golen (Golain) Glacier & Lake Basin",
      range: "Golen Valley / Kohistan Border",
      lengthKm: 18,
      altitudeM: 4850,
      threatLevel: "Severe",
      dangerFactor: "Documented 2019 Outburst Epicenter",
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "Alpine glacial tarn and moraine perimeter high above the Golen Valley hydroelectric basin.",
      summary:
        "Site of the devastating July 2019 GLOF outburst that flooded the valley, marooned over 1,500 people, and inundated the intake structures of the 108 MW Golen Gol Hydropower Project. Actively monitored 24/7 with satellite NDWI indices.",
      keyHazards: [
        "Hydrostatic pressure buildup on fragile moraine walls",
        "Direct threat to district energy grid and communications",
        "Narrow valley choke points amplify flood wave height",
      ],
    },
    {
      id: "bumburet-icefield",
      name: "Bumburet & Rumbur Glacial Icefields",
      range: "Kalash Valleys / Afghan Border",
      lengthKm: 12,
      altitudeM: 4400,
      threatLevel: "High",
      dangerFactor: "Steep Catchment Flash Flood Funneling",
      imageUrl: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "Steep alpine catchment overlooking the indigenous Kalash cedar forest valleys.",
      summary:
        "The indigenous Kalash valleys feature extremely steep gradient ravines. Meltwater from high icefields combines with convective cloudbursts to funnel violent torrents through narrow village riverbeds, eroding heritage settlements and bridges.",
      keyHazards: [
        "Rapid 30-minute flash flood onset time",
        "Severe soil erosion and mudslides cutting road access",
        "Threat to centuries-old indigenous Kalash cultural heritage",
      ],
    },
  ];

  // Documented Historical Disaster Ground Truth
  const disasters: DisasterEvent[] = [
    {
      year: "July 2015",
      title: "The Great Chitral Floods (PDMA Ground Truth Baseline)",
      location: "Reshun, Mastuj, Booni, Garam Chashma, Kalash",
      severity: "Catastrophic",
      description:
        "A series of devastating GLOFs combined with record torrential rains caused widespread catastrophe across 13 valleys. More than 300,000 residents were impacted, bridges on the Chitral-Booni highway were annihilated, and the historic Reshun powerhouse was completely obliterated.",
      impact: [
        "Over 35 suspension & RCC bridges destroyed",
        "Reshun Hydroelectric Station (4.2 MW) destroyed",
        "Thousands of acres of fruit orchards and farmlands eroded",
        "Foundation dataset for Sentinel Chitral ML risk classifier",
      ],
      imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "Flood torrents carving new river paths through Chitral valley settlements, washing away foundations.",
    },
    {
      year: "July 2019",
      title: "Golen Valley Glacial Lake Outburst Disaster",
      location: "Golen Valley & Usugur Pastures",
      severity: "Severe",
      description:
        "A sudden breach of a high-altitude glacial lake released a gigantic torrent of mud, boulders, and water that roared down the Golen stream. More than 30 homes were washed away, road links were severed for weeks, and the intake tunnels of the Golen Gol Hydroelectric project suffered critical damage.",
      impact: [
        "1,500+ residents stranded on mountain pastures",
        "Severe damage to Golen Gol 108 MW Hydro Project intake",
        "Prompted installation of automated telemetry sensors",
      ],
      imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "Moraine lake release area high in the Kohistan range above Golen Valley.",
    },
    {
      year: "2021 – 2024",
      title: "Thermal Meltdown & Reshun-Bumburet Surge Cycle",
      location: "Bumburet (Kalash), Reshun, Shishi Koh",
      severity: "High",
      description:
        "Spring heatwaves triggered unprecedented early-season glacial melting, followed by monsoon cloudbursts. Flash flood waves repeatedly took out access roads, destroyed gabion embankments, and submerged tourist camps in the lower Kalash ravines.",
      impact: [
        "Persistent road blockages on Kalash Corridor",
        "Repeated damage to reconstructed community water channels",
        "Demonstrated the urgent need for real-time satellite early warning",
      ],
      imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      imageCaption: "Glacial meltwater surging through narrow Hindu Kush mountain canyons after severe heatwave.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-16">
      {/* Hero Header */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#07242C] via-[#0F4C5C] to-[#0B3542] text-white p-8 sm:p-12 shadow-xl border border-teal-500/20">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider backdrop-blur-sm">
            <MountainSnow size={14} />
            <span>Glaciological Observatory & Disaster Intelligence</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            The Glaciers of Chitral &amp; The Science of GLOFs
          </h1>

          <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
            Chitral district in the Hindu Kush range holds over <strong>540 active glaciers</strong> and hundreds of newly formed moraine-dammed lakes. Sentinel Chitral combines Copernicus Sentinel-2 multispectral satellite telemetry, physical terrain models, and historical ground truth to predict, detect, and dispatch lifesaving early warnings.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-5 py-2.5 rounded-full text-xs shadow-md transition-transform hover:scale-105"
            >
              <span>Explore Live Valley Risk Map</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/glaciers"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-full text-xs border border-white/20 transition"
            >
              <Activity size={14} className="text-teal-300" />
              <span>Launch 3D Earth Space</span>
            </Link>
          </div>
        </div>

        {/* Decorative topographic vector contour lines */}
        <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-15 pointer-events-none hidden md:block">
          <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
            <path d="M50 350 C150 200, 250 300, 380 150" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M20 380 C120 220, 220 320, 390 180" stroke="#FFFFFF" strokeWidth="1.5" />
            <path d="M80 320 C180 170, 280 270, 395 120" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="280" cy="180" r="100" stroke="#38BDF8" strokeWidth="1" strokeDasharray="6 4" />
          </svg>
        </div>
      </section>

      {/* Navigation Sub-Tabs for High Information Density */}
      <section className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 text-sm font-semibold">
        {[
          { id: "overview", label: "GLOF Science & Anatomy", icon: BookOpen },
          { id: "glaciers", label: "Major Chitral Glaciers (540+)", icon: MountainSnow },
          { id: "disasters", label: "Disaster Ground Truth Archive", icon: History },
          { id: "videos", label: "Documentary Footage & Drills", icon: Film },
          { id: "circularity", label: "Circularity & Recovery", icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap text-xs sm:text-sm ${
                isActive
                  ? "bg-[#0F4C5C] text-white shadow-sm font-bold"
                  : "bg-white text-gray-600 hover:text-[#0F4C5C] hover:bg-teal-50 border border-gray-200"
              }`}
            >
              <Icon size={16} className={isActive ? "text-amber-400" : "text-gray-400"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </section>

      {/* TAB 1: OVERVIEW & ANATOMY OF A GLOF */}
      {activeTab === "overview" && (
        <div className="space-y-10 animate-in fade-in duration-300">
          {/* Scientific Deep Dive */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="max-w-2xl">
              <span className="text-xs uppercase font-bold text-teal-700 tracking-wider">
                Phenomenology &amp; Risk Mechanics
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F4C5C] mt-1">
                What is a Glacial Lake Outburst Flood (GLOF)?
              </h2>
            </div>

            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              In high-altitude glacial environments like Chitral, rapidly retreating glaciers leave behind massive depressions blocked only by unstable natural dams of loose sediment, crushed rock, and stagnant ice known as <strong>moraines</strong>. As thermal heatwaves accelerate melting, supraglacial lakes swell with millions of cubic meters of hydrostatic water.
            </p>

            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              When a moraine wall breaches—triggered by internal piping, seismic shocks, or massive ice avalanches calving from hanging seracs—the contained water surges catastrophically down-valley at speeds exceeding <strong>50–70 km/h</strong>, entraining huge boulders, mud, and timber into a destructive slurry that levels downstream settlements.
            </p>

            {/* 5-Step Anatomy Breakdown with Custom Cards */}
            <div className="pt-4 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Activity size={18} className="text-teal-600" />
                <span>The 5 Critical Stages of a Glacial Lake Outburst</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {[
                  {
                    step: "01",
                    title: "Melt & Expansion",
                    desc: "Thermal heatwaves accelerate firn ice melting. Supraglacial pools merge into vast moraine-dammed lakes.",
                    badge: "Sentinel-2 NDWI Detected",
                  },
                  {
                    step: "02",
                    title: "Moraine Seepage",
                    desc: "Hydrostatic water pressure forces microscopic piping conduits through unstable moraine rubble.",
                    badge: "Sub-surface Piping",
                  },
                  {
                    step: "03",
                    title: "Trigger Event",
                    desc: "A rockfall, hanging serac avalanche, or torrential cloudburst creates an overtopping displacement wave.",
                    badge: "Critical Threshold",
                  },
                  {
                    step: "04",
                    title: "Breach & Debris Surge",
                    desc: "The moraine fails catastrophically. Water scours canyon walls, entraining granite boulders and mud into a viscous wave.",
                    badge: "50-70 km/h Surge",
                  },
                  {
                    step: "05",
                    title: "Downstream Inundation",
                    desc: "The flood wave strikes valley bottlenecks, washing out bridges, power stations, and agriculture.",
                    badge: "Impact Zone",
                  },
                ].map((s) => (
                  <div
                    key={s.step}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-teal-500 transition-colors"
                  >
                    <div className="space-y-2">
                      <span className="text-2xl font-black text-teal-700 font-mono">
                        {s.step}
                      </span>
                      <h4 className="font-bold text-sm text-gray-900 leading-snug">
                        {s.title}
                      </h4>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                    <span className="mt-3 text-[10px] font-bold text-teal-800 bg-teal-100/70 rounded-md px-2 py-0.5 inline-block text-center">
                      {s.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sentinel-2 Satellite Detection Pipeline Showcase */}
          <div className="bg-gradient-to-r from-teal-900 to-[#0F4C5C] text-white rounded-2xl p-6 sm:p-8 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-xs font-bold uppercase text-amber-300 tracking-wider">
                  Automated Satellite Surveillance
                </span>
                <h3 className="text-2xl font-bold mt-1">
                  How Sentinel-2 NDWI Tracking Protects Chitral
                </h3>
              </div>
              <span className="bg-white/10 border border-white/20 text-xs px-3.5 py-1.5 rounded-full font-bold">
                5-Day Global Revisit Orbit
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 space-y-2">
                <span className="text-amber-400 font-bold block text-sm">
                  1. Spectral Band Extraction
                </span>
                <p className="text-teal-100 leading-relaxed">
                  Sentinel-2 captures Band 3 (Green ~560nm) and Band 8 (Near-Infrared ~842nm) at 10m spatial resolution across Chitral&apos;s alpine zones.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 space-y-2">
                <span className="text-amber-400 font-bold block text-sm">
                  2. NDWI Index Computation
                </span>
                <p className="text-teal-100 leading-relaxed">
                  Formula: <code>(Green - NIR) / (Green + NIR)</code>. Water surfaces yield positive values (+0.1 to +0.8), delineating swelling lake perimeters against ice and bedrock.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10 space-y-2">
                <span className="text-amber-400 font-bold block text-sm">
                  3. Machine Learning Inference
                </span>
                <p className="text-teal-100 leading-relaxed">
                  A Random Forest risk classifier trained on the 2015 PDMA ground truth correlates water expansion with thermal slope angles and 24h rainfall to score valley threat levels.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DETAILED GLACIER CATALOG */}
      {activeTab === "glaciers" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F4C5C]">
                Monitored Hindu Kush Glaciers
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Field documentation, satellite coordinates, and danger metrics for Chitral&apos;s key glacial corridors.
              </p>
            </div>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-full">
              Randolph Glacier Inventory (RGI 14)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {glaciers.map((g) => (
              <div
                key={g.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo with caption */}
                  <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={g.imageUrl}
                      alt={g.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white flex justify-between items-end">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 block">
                          {g.range}
                        </span>
                        <h3 className="text-lg font-black">{g.name}</h3>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          g.threatLevel === "Severe"
                            ? "bg-red-500/90 text-white border-red-400"
                            : "bg-orange-500/90 text-white border-orange-400"
                        }`}
                      >
                        {g.threatLevel} Threat
                      </span>
                    </div>
                  </div>

                  {/* Caption */}
                  <p className="text-[11px] text-gray-500 italic px-5 pt-3">
                    {g.imageCaption}
                  </p>

                  {/* Content & Metrics */}
                  <div className="p-5 space-y-4">
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      {g.summary}
                    </p>

                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-100 text-center">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-semibold">LENGTH</span>
                        <span className="font-extrabold text-gray-900 text-sm">{g.lengthKm} km</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block font-semibold">PEAK ALTITUDE</span>
                        <span className="font-extrabold text-gray-900 text-sm">{g.altitudeM} m</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 block font-semibold">PRIMARY FACTOR</span>
                        <span className="font-bold text-amber-700 text-xs block leading-tight mt-0.5">
                          {g.dangerFactor.split(" ")[0]}
                        </span>
                      </div>
                    </div>

                    {/* Key Hazards */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wide block">
                        Observed Vulnerability Factors:
                      </span>
                      <ul className="space-y-1 text-xs text-gray-600">
                        {g.keyHazards.map((h, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-teal-600 mt-0.5 font-bold">✓</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/glaciers`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs transition"
                  >
                    <Activity size={14} className="text-blue-400" />
                    <span>View in Satellite 3D Viewer</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DISASTER GROUND TRUTH & CASE STUDIES */}
      {activeTab === "disasters" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F4C5C]">
              Chitral Disaster Ground Truth Archive
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Documented disaster events, bridge washouts, and rehabilitation frameworks from the Provincial Disaster Management Authority (PDMA KP).
            </p>
          </div>

          <div className="space-y-8">
            {disasters.map((ev, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col md:flex-row gap-6 p-6 sm:p-8"
              >
                {/* Photo with Caption */}
                <div className="md:w-5/12 flex flex-col gap-2 shrink-0">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ev.imageUrl}
                      alt={ev.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow">
                      {ev.severity} Event
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 italic leading-snug">
                    {ev.imageCaption}
                  </p>
                </div>

                {/* Details */}
                <div className="md:w-7/12 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-teal-700">
                      <span>📅 {ev.year}</span>
                      <span>•</span>
                      <span>📍 {ev.location}</span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-gray-900">
                      {ev.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      {ev.description}
                    </p>

                    <div className="pt-2">
                      <span className="text-xs font-bold text-gray-900 block mb-2 uppercase tracking-wide">
                        Documented Impacts &amp; Lessons Learned:
                      </span>
                      <ul className="space-y-1.5 text-xs text-gray-600">
                        {ev.impact.map((imp, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-red-500 font-bold shrink-0">⚠</span>
                            <span>{imp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-medium">Source: PDMA KP Recovery Framework</span>
                    <Link
                      href="/subscribe"
                      className="font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                    >
                      <span>Enable Valley Early Warnings</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DOCUMENTARY FOOTAGE & VIDEOS */}
      {activeTab === "videos" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F4C5C]">
              Documentary Footage &amp; Scientific Field Recordings
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Visual records of glacial melt, automated siren drills, and community resilience in Chitral.
            </p>
          </div>

          {/* Main Featured Video Player */}
          <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={videos[activeVideoIndex].embedUrl}
                title={videos[activeVideoIndex].title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="p-6 text-white space-y-2">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold">
                <Film size={14} />
                <span>{videos[activeVideoIndex].channel}</span>
                <span>•</span>
                <span>{videos[activeVideoIndex].duration}</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black">
                {videos[activeVideoIndex].title}
              </h3>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
                {videos[activeVideoIndex].description}
              </p>
            </div>
          </div>

          {/* Video Switcher Thumbnails */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {videos.map((vid, idx) => (
              <button
                key={vid.id}
                onClick={() => setActiveVideoIndex(idx)}
                className={`text-left rounded-xl p-3 border transition-all flex gap-3 items-center ${
                  activeVideoIndex === idx
                    ? "bg-teal-50 border-teal-500 ring-2 ring-teal-500/20"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="relative w-24 aspect-video rounded-lg overflow-hidden bg-slate-900 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play size={16} className="text-white fill-white" />
                  </div>
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-gray-900 line-clamp-2 leading-tight">
                    {vid.title}
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-1">{vid.duration}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CIRCULARITY & ECOLOGICAL RESILIENCE */}
      {activeTab === "circularity" && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-8 animate-in fade-in duration-300">
          <div className="max-w-2xl">
            <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">
              Ecological Stewardship &amp; Sustainable Reconstruction
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F4C5C] mt-1">
              Circularity After Glacial Floods in Hindu Kush
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mt-2">
              Transforming post-disaster flood debris into permanent civil protection structures and restoring fragile mountain riparian ecosystems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 space-y-3">
              <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow">
                01
              </span>
              <h3 className="font-bold text-base text-emerald-950">
                Boulder &amp; River Granite Repurposing
              </h3>
              <p className="text-xs text-emerald-900/80 leading-relaxed">
                GLOF torrents deposit hundreds of thousands of tons of heavy granite boulders in agricultural channels. Instead of costly removal, local communities crush and cage these boulders into heavy <strong>gabion check-dams</strong> that buffer future surges.
              </p>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 space-y-3">
              <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow">
                02
              </span>
              <h3 className="font-bold text-base text-emerald-950">
                Riparian Bio-Engineering
              </h3>
              <p className="text-xs text-emerald-900/80 leading-relaxed">
                Replanting native sea buckthorn (Hippophae rhamnoides) and alpine willow along cleared alluvial fans. Their extensive root networks bind loose moraine silt, preventing rapid flash gully erosion during cloudbursts.
              </p>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-5 space-y-3">
              <span className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow">
                03
              </span>
              <h3 className="font-bold text-base text-emerald-950">
                Community Water Channelling (Karez/Kuhl)
              </h3>
              <p className="text-xs text-emerald-900/80 leading-relaxed">
                Redesigning damaged irrigation channels with flexible intake weirs that withstand sediment pulses while securing glacial meltwater for high-altitude apricot and walnut terraces.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Emergency & Ground Truth Call to Action */}
      <section className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Radio size={14} className="animate-pulse" />
            24/7 Community Alert Network
          </span>
          <h3 className="text-2xl font-black">
            Protect Your Family with Early Flood Dispatches
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
            Get instant SMS, WhatsApp, and Web Push notifications in English, Urdu, and Khowar the moment satellite water indices or river sensors breach safe thresholds.
          </p>
        </div>

        <Link
          href="/subscribe"
          className="shrink-0 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-3.5 rounded-full text-sm shadow-lg transition-transform hover:scale-105"
        >
          Subscribe to Alerts Now →
        </Link>
      </section>
    </div>
  );
}
