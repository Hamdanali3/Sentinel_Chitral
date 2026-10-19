import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import SiteHeader from "@/components/SiteHeader";
import SentinelLogo from "@/components/SentinelLogo";
import { PhoneCall, ShieldCheck, Satellite, MountainSnow, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Sentinel Chitral | Hindu Kush Early Warning & Glacier Network",
  description: "Glacial Lake Outburst Flood (GLOF) and flash flood early warning system for Chitral District, Khyber Pakhtunkhwa, Pakistan.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
        <LanguageProvider>
          <SiteHeader />
          <main className="flex-1 container mx-auto px-4 py-8 sm:py-10">
            {children}
          </main>
          <footer className="bg-[#05181E] text-slate-400 py-12 border-t border-teal-950 text-xs">
            <div className="container mx-auto px-4 space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-teal-900/60">
                <SentinelLogo size="md" lightText={true} />
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-teal-200">
                  <Link href="/" className="hover:text-white transition">Live District Map</Link>
                  <Link href="/glaciers" className="hover:text-white transition">3D Glacier Space</Link>
                  <Link href="/about" className="hover:text-white transition">GLOF Science &amp; History</Link>
                  <Link href="/subscribe" className="hover:text-white transition">Alert Dispatch</Link>
                  <Link href="/admin/login" className="hover:text-white transition">Command Portal</Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-400">
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-200 text-sm">Sentinel Chitral Platform</h4>
                  <p className="leading-relaxed text-[11px]">
                    Autonomous early warning network combining Copernicus Sentinel-2 multispectral passes, high-altitude meteorological sensors, and PDMA KP ground truth datasets.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-200 text-sm">Emergency Hotlines (24/7)</h4>
                  <p className="text-[11px]">
                    Rescue 1122 Chitral: <strong className="text-amber-400 font-bold">1122 / 0943-412952</strong>
                  </p>
                  <p className="text-[11px]">
                    PDMA KP Disaster Control Room: <strong className="text-amber-400 font-bold">1700</strong>
                  </p>
                  <p className="text-[11px]">
                    District Police / Levies: <strong className="text-amber-400 font-bold">15 / 0943-412122</strong>
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-200 text-sm">Community Stewardship</h4>
                  <p className="leading-relaxed text-[11px]">
                    Dedicated to protecting over 500,000 residents across Lower and Upper Chitral, including the indigenous Kalash valleys of Bumburet, Rumbur, and Birir.
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-teal-950/80 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-500">
                <p>© {new Date().getFullYear()} Sentinel Chitral Network. Khyber Pakhtunkhwa, Pakistan.</p>
                <p>Designed with natural cartography &amp; scientific satellite telemetry.</p>
              </div>
            </div>
          </footer>
        </LanguageProvider>
      </body>
    </html>
  );
}
