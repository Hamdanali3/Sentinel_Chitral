"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import SentinelLogo from "@/components/SentinelLogo";
import {
  MapPin,
  MountainSnow,
  Info,
  BellRing,
  ShieldCheck,
  Menu,
  X,
  Radio,
  ExternalLink,
} from "lucide-react";

export default function SiteHeader() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      href: "/",
      label: t.navLiveMap,
      icon: MapPin,
      active: pathname === "/",
    },
    {
      href: "/glaciers",
      label: "Glacier Explorer",
      icon: MountainSnow,
      highlight: true,
      active: pathname === "/glaciers",
    },
    {
      href: "/about",
      label: t.navGlacierInfo,
      icon: Info,
      active: pathname === "/about",
    },
  ];

  return (
    <header className="bg-gradient-to-r from-[#07242C] via-[#0F4C5C] to-[#0D3B47] text-white shadow-lg sticky top-0 z-40 border-b border-teal-500/20 backdrop-blur-md">
      {/* Top micro-banner: Live Satellite & PDMA Telemetry Status */}
      <div className="bg-[#05181E] border-b border-teal-900/40 py-1 px-4 text-[11px] text-teal-200/80">
        <div className="container mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-medium tracking-wide">
              Copernicus Sentinel-2 & High-Altitude IoT Telemetry: <strong className="text-white">Active</strong>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-300">
            <span>Chitral Emergency Hotline: <strong className="text-amber-400 font-bold">1122</strong></span>
            <span>PDMA KP: <strong className="text-amber-400 font-bold">1700</strong></span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Natural Handcrafted Logo */}
        <Link
          href="/"
          className="focus:outline-none focus:ring-2 focus:ring-teal-400/50 rounded-lg py-0.5"
          onClick={() => setMobileMenuOpen(false)}
        >
          <SentinelLogo size="md" lightText={true} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all text-xs font-semibold ${
                  link.active
                    ? "bg-white/15 text-white shadow-sm ring-1 ring-white/20"
                    : link.highlight
                    ? "text-amber-300 hover:text-white hover:bg-white/10"
                    : "text-teal-100 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon size={14} className={link.highlight ? "text-amber-400" : "text-teal-300"} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <Link
            href="/subscribe"
            className="ml-2 flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2 rounded-full text-xs shadow-md transition-transform hover:scale-105"
          >
            <BellRing size={13} className="text-slate-950 stroke-[2.5]" />
            <span>{t.navGetAlerts}</span>
          </Link>

          <Link
            href="/admin/login"
            className="flex items-center gap-1 text-teal-200/80 hover:text-white px-3 py-2 rounded-full text-xs transition"
          >
            <ShieldCheck size={14} />
            <span>{t.navAdmin}</span>
          </Link>
        </nav>

        {/* Language Switcher & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#07242C] border-t border-teal-800/60 px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  link.active
                    ? "bg-white/15 text-white"
                    : "text-teal-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={16} className={link.highlight ? "text-amber-400" : "text-teal-300"} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-teal-900/60 flex flex-col gap-2">
            <Link
              href="/subscribe"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm shadow transition"
            >
              <BellRing size={16} />
              <span>{t.navGetAlerts}</span>
            </Link>

            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 text-teal-200 hover:text-white py-2 text-xs"
            >
              <ShieldCheck size={14} />
              <span>{t.navAdmin} Command Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
