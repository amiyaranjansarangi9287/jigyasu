import { useLearnerStore } from '../store';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const LANGUAGES = [
  { code: "en" as const, flag: "🇬🇧", name: "English", native: "English" },
  { code: "hi" as const, flag: "🇮🇳", name: "Hindi", native: "हिन्दी" },
  { code: "ta" as const, flag: "🇮🇳", name: "Tamil", native: "தமிழ்" },
  { code: "te" as const, flag: "🇮🇳", name: "Telugu", native: "తెలుగు" },
  { code: "kn" as const, flag: "🇮🇳", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "od" as const, flag: "🇮🇳", name: "Odia", native: "ଓଡ଼ିଆ" },
];

export default function LanguagePicker() {
  const { language, setLanguage } = useLearnerStore();
  const { t, i18n } = useTranslation();

  // Initialize i18n with stored language on mount
  useEffect(() => {
    if (language && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  const handleSelect = (code: string) => {
    setLanguage(code as typeof language);
    i18n.changeLanguage(code);
    // Persist to localStorage for consistency
    localStorage.setItem('jigyasu-language', code);
  };

  return (
    <section className="mx-auto max-w-6xl px-5 py-8">
      <div className="rounded-3xl border border-orange-100 bg-white/70 p-6 shadow-sm backdrop-blur md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-brand">{t('landing.language.step', 'Step 3')}</span>
            <h2 className="font-display text-2xl font-bold text-slate-900 md:text-3xl">
              {t('landing.language.title', 'Choose Your Language')} 🌍
            </h2>
            <p className="mt-1 text-slate-600">{t('landing.language.description', 'Select your preferred language for learning')}</p>
          </div>
          <span className="text-sm text-slate-500">
            {t('landing.language.selected', 'Selected')}:{" "}
            <span className="font-bold text-slate-800">
              {LANGUAGES.find((l) => l.code === language)?.native || 'English'}
            </span>
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {LANGUAGES.map((lang) => {
            const active = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                aria-label={`Select ${lang.name}`}
                aria-pressed={active}
                className={`group relative flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-4 transition active:scale-95 ${
                  active
                    ? "border-brand bg-orange-50 shadow-md shadow-orange-200/60"
                    : "border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50/50"
                }`}
              >
                <span className="text-3xl transition group-hover:scale-110">{lang.flag}</span>
                <span className="font-display text-lg font-bold text-slate-900">{lang.native}</span>
                <span className="text-sm text-slate-500">{lang.name}</span>
                {active && (
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-sm font-bold text-white shadow-md">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
