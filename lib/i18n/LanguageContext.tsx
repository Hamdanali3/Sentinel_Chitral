"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
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

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("sentinel_lang") as Language | null;
    if (saved && (saved === "en" || saved === "ur" || saved === "kw")) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("sentinel_lang", newLang);
    document.documentElement.dir = newLang === "en" ? "ltr" : "rtl";
    document.documentElement.lang = newLang;
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
