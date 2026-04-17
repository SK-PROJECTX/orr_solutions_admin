import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { en } from '../lib/i18n/locales/en';
import { it } from '../lib/i18n/locales/it';

type Language = 'en' | 'it';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const translations = {
  en,
  it
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang: Language) => set({ language: lang }),
      t: (key: string, params?: Record<string, any>) => {
        const { language } = get();
        const keys = key.split('.');
        let current: any = translations[language];

        for (const k of keys) {
          if (current && current[k]) {
            current = current[k];
          } else {
            return key; // Fallback to key if not found
          }
        }

        let result = typeof current === 'string' ? current : key;

        if (params && typeof result === 'string') {
          Object.keys(params).forEach(paramKey => {
            result = result.replace(new RegExp(`{${paramKey}}`, 'g'), String(params[paramKey]));
          });
        }

        return result;
      },
    }),
    {
      name: 'language-storage',
    }
  )
);
