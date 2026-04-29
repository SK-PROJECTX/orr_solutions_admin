import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { en } from '../lib/i18n/locales/en';
import { it } from '../lib/i18n/locales/it';

type Language = 'en' | 'it';
type Currency = 'USD' | 'EUR' | 'GBP';

interface LanguageState {
  language: Language;
  currency: Currency;
  setLanguage: (lang: Language) => void;
  setCurrency: (curr: Currency) => void;
  formatCurrency: (amount: number) => string;
  t: (key: string, params?: Record<string, any>) => string;
}

const translations = {
  en,
  it
};

const CURRENCY_RATES: Record<Currency, { rate: number; symbol: string }> = {
  USD: { rate: 1, symbol: '$' },
  EUR: { rate: 0.92, symbol: '€' },
  GBP: { rate: 0.79, symbol: '£' }
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'en',
      currency: 'USD',
      setLanguage: (lang: Language) => set({ language: lang }),
      setCurrency: (curr: Currency) => set({ currency: curr }),
      formatCurrency: (amount: number) => {
        const { currency } = get();
        const { rate, symbol } = CURRENCY_RATES[currency];
        const converted = amount * rate;
        
        return `${symbol}${converted.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`;
      },
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
