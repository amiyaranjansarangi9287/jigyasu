import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// RTL languages
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

// Locale-specific formatters
const formatters = {
  number: new Intl.NumberFormat('en-IN'),
  currency: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }),
  date: new Intl.DateTimeFormat('en-IN'),
  time: new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' }),
};

/**
 * Check if a language is RTL
 */
export function isRTL(lang: string): boolean {
  return RTL_LANGUAGES.includes(lang);
}

/**
 * Get text direction for a language
 */
export function getTextDirection(lang: string): 'ltr' | 'rtl' {
  return isRTL(lang) ? 'rtl' : 'ltr';
}

/**
 * Update formatters for a specific locale
 */
export function updateFormatters(locale: string) {
  try {
    const numberingSystems: Record<string, string> = {
      hi: 'deva', mr: 'deva', bn: 'beng', gu: 'gujr', ml: 'mlym',
      pa: 'guru', as: 'beng', ur: 'arabext', sa: 'deva', sat: 'olck',
      ne: 'deva', brx: 'deva', doi: 'deva', ks: 'arabext', mai: 'deva',
      sd: 'arabext', mni: 'mtei', or: 'orya', od: 'orya', kn: 'knda',
      ta: 'tamldec', te: 'telu',
    };
    let baseLang = locale.split('-')[0];
    if (baseLang === 'od') baseLang = 'or';
    
    const nu = numberingSystems[baseLang];
    const numberLocale = nu ? `${baseLang}-IN-u-nu-${nu}` : locale;

    formatters.number = new Intl.NumberFormat(numberLocale);
    formatters.currency = new Intl.NumberFormat(numberLocale, { 
      style: 'currency', 
      currency: 'INR' 
    });
    formatters.date = new Intl.DateTimeFormat(numberLocale);
    formatters.time = new Intl.DateTimeFormat(numberLocale, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (error) {
    console.warn(`Failed to update formatters for locale ${locale}:`, error);
  }
}

/**
 * Format number according to locale
 */
export function formatNumber(value: number, locale?: string): string {
  if (locale) {
    try {
      return new Intl.NumberFormat(locale).format(value);
    } catch {
      return formatters.number.format(value);
    }
  }
  return formatters.number.format(value);
}

/**
 * Format currency according to locale
 */
export function formatCurrency(value: number, locale?: string): string {
  if (locale) {
    try {
      return new Intl.NumberFormat(locale, { 
        style: 'currency', 
        currency: 'INR' 
      }).format(value);
    } catch {
      return formatters.currency.format(value);
    }
  }
  return formatters.currency.format(value);
}

/**
 * Format date according to locale
 */
export function formatDate(date: Date, locale?: string): string {
  if (locale) {
    try {
      return new Intl.DateTimeFormat(locale).format(date);
    } catch {
      return formatters.date.format(date);
    }
  }
  return formatters.date.format(date);
}

/**
 * Format time according to locale
 */
export function formatTime(date: Date, locale?: string): string {
  if (locale) {
    try {
      return new Intl.DateTimeFormat(locale, { 
        hour: '2-digit', 
        minute: '2-digit' 
      }).format(date);
    } catch {
      return formatters.time.format(date);
    }
  }
  return formatters.time.format(date);
}

import en from './learnos/i18n/locales/en.json';
import hi from './learnos/i18n/locales/hi.json';
import kn from './learnos/i18n/locales/kn.json';
import te from './learnos/i18n/locales/te.json';
import ta from './learnos/i18n/locales/ta.json';
import mr from './learnos/i18n/locales/mr.json';
import bn from './learnos/i18n/locales/bn.json';
import gu from './learnos/i18n/locales/gu.json';
import ml from './learnos/i18n/locales/ml.json';
import pa from './learnos/i18n/locales/pa.json';
import as from './learnos/i18n/locales/as.json';
import ur from './learnos/i18n/locales/ur.json';
import sa from './learnos/i18n/locales/sa.json';
import sat from './learnos/i18n/locales/sat.json';
import ne from './learnos/i18n/locales/ne.json';
import brx from './learnos/i18n/locales/brx.json';
import doi from './learnos/i18n/locales/doi.json';
import ks from './learnos/i18n/locales/ks.json';
import mai from './learnos/i18n/locales/mai.json';
import sd from './learnos/i18n/locales/sd.json';
import mni from './learnos/i18n/locales/mni.json';
import od from './learnos/i18n/locales/od.json';
import es from './learnos/i18n/locales/es.json';
import fr from './learnos/i18n/locales/fr.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  kn: { translation: kn },
  te: { translation: te },
  ta: { translation: ta },
  mr: { translation: mr },
  bn: { translation: bn },
  gu: { translation: gu },
  ml: { translation: ml },
  pa: { translation: pa },
  as: { translation: as },
  ur: { translation: ur },
  sa: { translation: sa },
  sat: { translation: sat },
  ne: { translation: ne },
  brx: { translation: brx },
  doi: { translation: doi },
  ks: { translation: ks },
  mai: { translation: mai },
  sd: { translation: sd },
  mni: { translation: mni },
  od: { translation: od },
  es: { translation: es },
  fr: { translation: fr }
};

// Safely get initial language from localStorage
let initialLang = 'en';
try {
  // First try the learner-storage which is used by Zustand
  const learnerStorageRaw = localStorage.getItem('learner-storage');
  if (learnerStorageRaw) {
    const parsed = JSON.parse(learnerStorageRaw);
    if (parsed && parsed.state && parsed.state.language) {
      initialLang = parsed.state.language;
    }
  }
  // Fallback to legacy key
  if (initialLang === 'en') {
    initialLang = localStorage.getItem('learnos-language') || 'en';
  }
} catch (e) {
  console.warn('Failed to read initial language from localStorage', e);
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: initialLang,
    interpolation: {
      escapeValue: false 
    },
    // Update formatters when language changes
    react: {
      useSuspense: false,
    },
  });

// Update formatters when language changes
i18n.on('languageChanged', (lng) => {
  updateFormatters(lng);
  // Update document direction for RTL languages
  const direction = getTextDirection(lng);
  document.documentElement.dir = direction;
  document.documentElement.lang = lng;
});

export default i18n;
