// src/utils/localization.ts
// Number and date formatting for Indian languages

import type { Language } from '../types/shared';

const LOCALE_MAP: Record<Language, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  od: 'or-IN',
};

const CURRENCY_MAP: Record<Language, string> = {
  en: 'INR',
  hi: 'INR',
  ta: 'INR',
  te: 'INR',
  kn: 'INR',
  od: 'INR',
};

export function formatNumber(value: number, language: Language = 'en'): string {
  return new Intl.NumberFormat(LOCALE_MAP[language]).format(value);
}

export function formatCurrency(
  value: number,
  language: Language = 'en',
  showSymbol = true,
): string {
  const currency = CURRENCY_MAP[language];
  const formatted = new Intl.NumberFormat(LOCALE_MAP[language], {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);

  if (!showSymbol) {
    return formatted.replace(/[₹$]/, '').trim();
  }

  return formatted;
}

export function formatPaiseAsRupees(paise: number, language: Language = 'en'): string {
  return formatCurrency(paise / 100, language);
}

export function formatDate(
  date: number | Date,
  language: Language = 'en',
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = typeof date === 'number' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  return new Intl.DateTimeFormat(LOCALE_MAP[language], {
    ...defaultOptions,
    ...options,
  }).format(d);
}

export function formatRelativeTime(
  timestamp: number,
  language: Language = 'en',
): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  const rtf = new Intl.RelativeTimeFormat(LOCALE_MAP[language], {
    numeric: 'auto',
  });

  if (diffSec < 60) return rtf.format(0, 'second');
  if (diffMin < 60) return rtf.format(-diffMin, 'minute');
  if (diffHr < 24) return rtf.format(-diffHr, 'hour');
  if (diffDay < 7) return rtf.format(-diffDay, 'day');

  return formatDate(timestamp, language);
}

export function formatDuration(seconds: number, _language: Language = 'en'): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

export function getLocaleForLanguage(language: Language): string {
  return LOCALE_MAP[language];
}
