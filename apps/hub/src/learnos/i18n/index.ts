// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import hi from './locales/hi.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import kn from './locales/kn.json';
import od from './locales/od.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  ta: { translation: ta },
  te: { translation: te },
  kn: { translation: kn },
  od: { translation: od },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'ta', 'te', 'kn', 'od'],
    defaultNS: 'translation',
    ns: ['translation'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'learnos-language',
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
