"use client";

import { useState } from "react";
import { requestNotificationPermission } from "@/lib/notifications";
import {
  BellRing,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Globe,
  ShieldCheck,
  MessageSquare,
  Send,
  Loader2,
} from "lucide-react";

const ALL_VALLEYS = ["Bumburet", "Rumbur", "Birir", "Reshun", "Mastuj", "Yarkhun", "Torkhow", "Golain"];

export default function SubscribePage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [language, setLanguage] = useState<"en" | "ur" | "kw">("en");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const toggle = (valley: string) =>
    setSelected((prev) =>
      prev.includes(valley) ? prev.filter((v) => v !== valley) : [...prev, valley]
    );

  const handleSubscribe = async () => {
    if (selected.length === 0) {
      setMessage("Please select at least one valley corridor to monitor.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setMessage("");

    const token = await requestNotificationPermission();
    if (!token) {
      setStatus("error");
      setMessage("Notification permission denied. Please allow notifications in your browser settings to receive emergency alerts.");
      return;
    }

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fcmToken: token, valleys: selected, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus("success");
      setMessage("Subscription confirmed! Your device is registered for high-altitude emergency flood dispatches.");
    } catch (error: unknown) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong while connecting. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200/80 text-teal-700 flex items-center justify-center mx-auto shadow-xs">
          <BellRing size={26} className="text-[#0F4C5C]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#0F4C5C] tracking-tight">
          Community Alert Dispatch
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
          Receive real-time early warnings directly on your device the moment Copernicus Sentinel-2 satellite passes or river sensors detect surging flood risks.
        </p>
      </div>

      {/* Main Subscription Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-200/90 space-y-6">
        {/* Delivery Channels */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between text-xs text-gray-600 gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 font-bold text-gray-800">
            <Radio size={14} className="text-teal-600" />
            <span>Dispatched via:</span>
          </div>
          <div className="flex items-center gap-3 font-semibold text-[11px] text-gray-700">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-600" /> Web Push
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-600" /> Twilio SMS
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={12} className="text-emerald-600" /> WhatsApp
            </span>
          </div>
        </div>

        {/* Valley Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-sm text-gray-900">
              Select Monitored Valleys ({selected.length}/{ALL_VALLEYS.length})
            </h2>
            <button
              type="button"
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 underline"
              onClick={() => setSelected(selected.length === ALL_VALLEYS.length ? [] : [...ALL_VALLEYS])}
            >
              {selected.length === ALL_VALLEYS.length ? "Deselect all" : "Select all valleys"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {ALL_VALLEYS.map((valley) => {
              const isSelected = selected.includes(valley);
              return (
                <button
                  key={valley}
                  type="button"
                  onClick={() => toggle(valley)}
                  className={`py-2.5 px-3.5 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
                    isSelected
                      ? "bg-[#0F4C5C] text-white border-[#0F4C5C] shadow-xs"
                      : "bg-white text-gray-700 border-gray-200 hover:border-teal-400 hover:bg-teal-50/50"
                  }`}
                >
                  <span>{valley}</span>
                  {isSelected && <CheckCircle2 size={14} className="text-amber-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred Language Selection */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <h2 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
            <Globe size={15} className="text-teal-600" />
            <span>Preferred Alert Language</span>
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {[
              { code: "en", label: "English", sub: "Global" },
              { code: "ur", label: "اردو", sub: "National" },
              { code: "kw", label: "کھوار", sub: "Indigenous" },
            ].map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code as typeof language)}
                className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center gap-0.5 ${
                  language === lang.code
                    ? "bg-teal-800 text-white border-teal-800 shadow-xs"
                    : "bg-white text-gray-700 border-gray-200 hover:border-teal-400"
                }`}
              >
                <span>{lang.label}</span>
                <span className={`text-[10px] font-normal ${language === lang.code ? "text-teal-200" : "text-gray-400"}`}>
                  {lang.sub}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`p-4 rounded-xl text-xs font-medium border flex items-start gap-2.5 ${
              status === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-red-50 border-red-200 text-red-900"
            }`}
          >
            {status === "success" ? (
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
            )}
            <p className="leading-relaxed">{message}</p>
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={handleSubscribe}
          disabled={status === "loading"}
          className="w-full bg-gradient-to-r from-[#0F4C5C] to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white font-extrabold py-3.5 rounded-2xl transition shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
        >
          {status === "loading" ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Registering Device with Firebase…</span>
            </>
          ) : (
            <>
              <BellRing size={16} className="text-amber-300" />
              <span>Enable Flood Alerts</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-gray-400 text-center leading-relaxed">
          Free public safety service provided by Sentinel Chitral in partnership with PDMA KP. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
