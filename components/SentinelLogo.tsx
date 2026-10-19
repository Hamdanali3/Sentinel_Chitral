import React from "react";

interface SentinelLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  lightText?: boolean;
}

export default function SentinelLogo({
  className = "",
  size = "md",
  showText = true,
  lightText = true,
}: SentinelLogoProps) {
  const pixelSizes = {
    sm: 32,
    md: 40,
    lg: 52,
    xl: 72,
  };

  const px = pixelSizes[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Handcrafted Natural Vector Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={px}
          height={px}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:scale-105"
        >
          <defs>
            {/* Mountain rock gradient */}
            <linearGradient id="scRidge" x1="12" y1="18" x2="52" y2="52" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0B3C49" />
              <stop offset="0.6" stopColor="#0F4C5C" />
              <stop offset="1" stopColor="#1E6578" />
            </linearGradient>

            {/* Snow & glacial cap gradient */}
            <linearGradient id="scSnowCap" x1="32" y1="8" x2="32" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.45" stopColor="#E0F2FE" />
              <stop offset="1" stopColor="#BAE6FD" />
            </linearGradient>

            {/* Glacial stream & meltwater flow gradient */}
            <linearGradient id="scStream" x1="32" y1="36" x2="32" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="0.5" stopColor="#0EA5E9" />
              <stop offset="1" stopColor="#0284C7" />
            </linearGradient>

            {/* Protective circular radar/sentinel ring */}
            <linearGradient id="scArc" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" />
              <stop offset="0.5" stopColor="#14B8A6" />
              <stop offset="1" stopColor="#0F4C5C" />
            </linearGradient>

            {/* Soft shadow */}
            <filter id="scShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Outer Protective Contour Arc (Sentinel Guardian Orbit) */}
          <circle
            cx="32"
            cy="32"
            r="29"
            stroke="url(#scArc)"
            strokeWidth="1.75"
            strokeDasharray="4 2"
            className="opacity-70 animate-[spin_60s_linear_infinite]"
          />
          <circle
            cx="32"
            cy="32"
            r="26.5"
            stroke="#0D9488"
            strokeWidth="0.75"
            className="opacity-40"
          />

          {/* Background circular hill terrain tone */}
          <circle cx="32" cy="32" r="25" fill="#06202A" fillOpacity="0.85" />

          {/* Rear High Mountain (Tirich Mir East Peak) */}
          <path
            d="M20 38 L32 14 L44 38 Z"
            fill="#093541"
            opacity="0.9"
          />

          {/* Main Hindu Kush Twin Massif */}
          <g filter="url(#scShadow)">
            {/* Left Ridge */}
            <path
              d="M10 50 L27 19 L36 34 L40 50 Z"
              fill="url(#scRidge)"
            />
            {/* Right Ridge (Shaded Aspect) */}
            <path
              d="M27 19 L46 22 L54 50 L40 50 L36 34 Z"
              fill="#082A33"
            />
          </g>

          {/* Glacial Ice & Firn Cap (Natural jagged mountain crest) */}
          <path
            d="M27 19 L32 28 L29 31 L24 25 Z"
            fill="url(#scSnowCap)"
          />
          <path
            d="M27 19 L34 25 L32 28 Z"
            fill="#FFFFFF"
          />
          <path
            d="M40 25 L46 22 L44 30 L40 28 Z"
            fill="url(#scSnowCap)"
            opacity="0.9"
          />

          {/* Glacial Valley Carving & Flowing River Stream (Chitral River) */}
          <path
            d="M32 32 C30 38, 34 42, 28 48 C26 50, 24 53, 23 56"
            stroke="url(#scStream)"
            strokeWidth="2.75"
            strokeLinecap="round"
          />
          <path
            d="M34 38 C35 44, 38 48, 37 56"
            stroke="#7DD3FC"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Real-time Telemetry Sentinel Beacon (Peak Apex Pulse) */}
          <circle cx="27" cy="19" r="2" fill="#F59E0B" />
          <circle
            cx="27"
            cy="19"
            r="4.5"
            stroke="#F59E0B"
            strokeWidth="1"
            className="animate-ping opacity-75"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col text-left leading-none">
          <span
            className={`font-black tracking-tight font-sans ${
              size === "sm"
                ? "text-base"
                : size === "md"
                ? "text-lg sm:text-xl"
                : size === "lg"
                ? "text-2xl"
                : "text-3xl"
            } ${lightText ? "text-white" : "text-[#0F4C5C]"}`}
          >
            Sentinel<span className="text-amber-400 font-extrabold ml-1">Chitral</span>
          </span>
          <span
            className={`text-[9px] uppercase tracking-[0.2em] font-semibold mt-1 ${
              lightText ? "text-teal-200/90" : "text-teal-800"
            }`}
          >
            Hindu Kush Flood & Glacier Network
          </span>
        </div>
      )}
    </div>
  );
}
