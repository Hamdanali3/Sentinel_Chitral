"use client";

import React, { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import { Language, translations, Translations } from "./translations";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
  isRTL: false,
});

let listeners: Array<() => void> = [];
function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function getLangSnapshot(): Language {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem("sentinel_lang") as Language | null;
  if (saved === "en" || saved === "ur" || saved === "kw") {
    return saved;
  }
  return "en";
}

function getLangServerSnapshot(): Language {
  return "en";
}

function subscribeLang(listener: () => void) {
  listeners.push(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
    window.removeEventListener("storage", listener);
  };
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribeLang, getLangSnapshot, getLangServerSnapshot);

  useEffect(() => {
    document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (newLang: Language) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sentinel_lang", newLang);
      document.documentElement.dir = newLang === "en" ? "ltr" : "rtl";
      document.documentElement.lang = newLang;
    }
    emitChange();
  };

  const isRTL = lang === "ur" || lang === "kw";

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t: translations[lang] || translations.en,
        isRTL,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
