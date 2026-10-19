"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Language } from "@/lib/i18n/translations";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  const options: { code: Language; label: string; full: string }[] = [
    { code: "en", label: "EN", full: "English" },
    { code: "ur", label: "اردو", full: "Urdu" },
    { code: "kw", label: "کھوار", full: "Khowar" },
  ];

  return (
    <div className="inline-flex items-center rounded-full bg-black/25 p-1 border border-teal-500/30 text-xs backdrop-blur-xs">
      <div className="pl-1.5 pr-1 text-teal-300">
        <Globe size={13} />
      </div>
      {options.map((opt) => (
        <button
          key={opt.code}
          onClick={() => setLang(opt.code)}
          className={`px-2.5 py-0.5 rounded-full font-bold transition-all text-[11px] ${
            lang === opt.code
              ? "bg-white text-[#0F4C5C] shadow-xs"
              : "text-teal-100 hover:text-white hover:bg-white/10"
          }`}
          title={`Switch language to ${opt.full}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
