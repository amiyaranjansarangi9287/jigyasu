// src/constants/languages.ts

export const LANGUAGES = {
  en: {
    code: 'en' as const,
    nativeName: 'English',
    fontFamily: '"Inter", "Nunito", sans-serif',
    googleFont: 'Inter:wght@400;600;700;800',
    direction: 'ltr' as const,
    script: 'Latin',
  },
  hi: {
    code: 'hi' as const,
    nativeName: 'हिंदी',
    fontFamily: '"Noto Sans Devanagari", sans-serif',
    googleFont: 'Noto+Sans+Devanagari:wght@400;600;700;800',
    direction: 'ltr' as const,
    script: 'Devanagari',
  },
  ta: {
    code: 'ta' as const,
    nativeName: 'தமிழ்',
    fontFamily: '"Noto Sans Tamil", sans-serif',
    googleFont: 'Noto+Sans+Tamil:wght@400;600;700;800',
    direction: 'ltr' as const,
    script: 'Tamil',
  },
  te: {
    code: 'te' as const,
    nativeName: 'తెలుగు',
    fontFamily: '"Noto Sans Telugu", sans-serif',
    googleFont: 'Noto+Sans+Telugu:wght@400;600;700;800',
    direction: 'ltr' as const,
    script: 'Telugu',
  },
  kn: {
    code: 'kn' as const,
    nativeName: 'ಕನ್ನಡ',
    fontFamily: '"Noto Sans Kannada", sans-serif',
    googleFont: 'Noto+Sans+Kannada:wght@400;600;700;800',
    direction: 'ltr' as const,
    script: 'Kannada',
  },
  od: {
    code: 'od' as const,
    nativeName: 'ଓଡ଼ିଆ',
    fontFamily: '"Noto Sans Oriya", sans-serif',
    googleFont: 'Noto+Sans+Oriya:wght@400;600;700;800',
    direction: 'ltr' as const,
    script: 'Oriya',
  },
} as const;

export type LanguageCode = keyof typeof LANGUAGES;
