import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLearnerStore } from '../learnos/store';

const LANGUAGES = [
  { code: "en", flag: "🇬🇧", name: "English", native: "English" },
  { code: "hi", flag: "🇮🇳", name: "Hindi", native: "हिन्दी" },
  { code: "ta", flag: "🇮🇳", name: "Tamil", native: "தமிழ்" },
  { code: "te", flag: "🇮🇳", name: "Telugu", native: "తెలుగు" },
  { code: "kn", flag: "🇮🇳", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "od", flag: "🇮🇳", name: "Odia", native: "ଓଡ଼ିଆ" },
];

export default function GlobalLanguageSelector() {
  const { language, setLanguage } = useLearnerStore();
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    setLanguage(code as any);
    i18n.changeLanguage(code);
    localStorage.setItem('learnos-language', code);
    setIsOpen(false);
  };

  const currentLang = LANGUAGES.find(l => l.code === (language || 'en')) || LANGUAGES[0];

  return (
    <div className="relative z-[100]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/80 hover:bg-white backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-slate-200/50 transition-all text-slate-800"
        aria-label="Select Language"
      >
        <span className="text-xl">{currentLang.flag}</span>
        <span className="font-bold text-sm hidden sm:block">{currentLang.native}</span>
        <span className="text-xs ml-1">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden py-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-orange-50 transition-colors ${
                language === lang.code ? 'bg-orange-50/50 text-orange-600 font-bold' : 'text-slate-700'
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <div className="flex flex-col">
                <span className="text-sm">{lang.native}</span>
              </div>
              {language === lang.code && (
                <span className="ml-auto text-orange-500">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
