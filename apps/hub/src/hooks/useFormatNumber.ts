import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

/**
 * A hook that provides a localized number formatter based on the active language.
 * This ensures numbers are displayed in the native script (e.g. Odia numerals for Odia).
 */
export function useFormatNumber() {
  const { i18n } = useTranslation();

  const formatNumber = useCallback((num: number | undefined | null) => {
    if (num === undefined || num === null) return '';
    
    try {
      // Map language codes to numbering systems for native scripts
      const numberingSystems: Record<string, string> = {
        hi: 'deva',    // Devanagari (Hindi)
        mr: 'deva',    // Devanagari (Marathi)
        bn: 'beng',    // Bengali
        gu: 'gujr',    // Gujarati
        ml: 'mlym',    // Malayalam
        pa: 'guru',    // Punjabi (Gurmukhi)
        as: 'beng',    // Assamese
        ur: 'arabext', // Urdu
        sa: 'deva',    // Sanskrit
        sat: 'olck',   // Santhali
        ne: 'deva',    // Nepali
        brx: 'deva',   // Bodo
        doi: 'deva',   // Dogri
        ks: 'arabext', // Kashmiri
        mai: 'deva',   // Maithili
        sd: 'arabext', // Sindhi
        mni: 'mtei',   // Manipuri (Meitei)
        or: 'orya',    // Odia (ISO)
        od: 'orya',    // Odia (Custom code used in Jigyasu)
        kn: 'knda',    // Kannada
        ta: 'tamldec', // Tamil (Decimal)
        te: 'telu',    // Telugu
      };

      const lang = i18n.language || 'en';
      const baseLang = lang.split('-')[0];
      const nu = numberingSystems[baseLang];
      
      const locale = nu ? `${lang}-u-nu-${nu}` : lang;

      // Create a formatter for the current language with native script if available
      const formatter = new Intl.NumberFormat(locale);
      return formatter.format(num);
    } catch (e) {
      // Fallback in case of an invalid locale
      return num.toString();
    }
  }, [i18n.language]);

  return formatNumber;
}
