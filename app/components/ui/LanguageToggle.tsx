"use client";

import { useLanguageStore } from "@/store/languageStore";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 backdrop-blur-md">
      <button
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all duration-200 ${
          language === 'en' 
            ? 'bg-primary text-background shadow-lg shadow-primary/20 scale-105' 
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('it')}
        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all duration-200 ${
          language === 'it' 
            ? 'bg-primary text-background shadow-lg shadow-primary/20 scale-105' 
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
      >
        IT
      </button>
    </div>
  );
}
