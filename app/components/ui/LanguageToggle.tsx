"use client";

import { useLanguageStore } from "@/store/languageStore";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div 
      className="relative flex items-center bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md w-[88px] h-[34px] shadow-inner transition-colors hover:bg-white/10 group"
      role="radiogroup"
      aria-label="Language Toggle"
    >
      {/* Sliding Indicator */}
      <div
        className={`absolute left-1 top-1 bottom-1 w-[40px] bg-primary rounded-full transition-transform duration-300 ease-in-out shadow-[0_2px_8px_rgba(0,0,0,0.15)] ${
          language === 'it' ? 'translate-x-[40px]' : 'translate-x-0'
        }`}
      />
      
      {/* English Button */}
      <button
        role="radio"
        onClick={() => setLanguage('en')}
        className={`relative z-10 flex-1 h-full flex justify-center items-center text-xs font-bold tracking-widest transition-all duration-300 outline-none rounded-full ${
          language === 'en' 
            ? 'text-background drop-shadow-sm' 
            : 'text-white/60 hover:text-white active:scale-95'
        }`}
        aria-checked={language === 'en'}
      >
        <span className="mt-[1px]">EN</span>
      </button>

      {/* Italian Button */}
      <button
        role="radio"
        onClick={() => setLanguage('it')}
        className={`relative z-10 flex-1 h-full flex justify-center items-center text-xs font-bold tracking-widest transition-all duration-300 outline-none rounded-full ${
          language === 'it' 
            ? 'text-background drop-shadow-sm' 
            : 'text-white/60 hover:text-white active:scale-95'
        }`}
        aria-checked={language === 'it'}
      >
        <span className="mt-[1px]">IT</span>
      </button>
    </div>
  );
}
