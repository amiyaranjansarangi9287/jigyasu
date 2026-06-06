import { useState } from 'react';
import { useLearnerStore } from '../store';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { language, setLanguage } = useLearnerStore();
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);



  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-cream/70 border-b border-orange-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="/" className="flex items-center gap-2.5" aria-label="Jigyasu home">
          <span className="text-3xl">🦚</span>
          <span className="font-display text-2xl font-bold text-brand">Jigyasu</span>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex" aria-label="Main navigation">
          <a href="#worlds" className="hover:text-brand transition">{t('landing.header.nav_worlds', 'Worlds')}</a>
          <a href="#how" className="hover:text-brand transition">{t('landing.header.nav_how', 'How It Works')}</a>
          <a href="#parents" className="hover:text-brand transition">{t('landing.header.nav_parents', 'Parents')}</a>
          <a href="#voices" className="hover:text-brand transition">{t('landing.header.nav_voices', 'Voices')}</a>
        </nav>

        <div className="flex items-center gap-2">

          <a
            href="#worlds"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white shadow-lg shadow-orange-300/50 hover:bg-brand-dark transition active:scale-95 min-h-[44px]"
          >
            {t('landing.header.start_free', 'Start Free')}
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/80 border border-orange-200 text-slate-700 hover:border-brand hover:text-brand transition"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-orange-100 bg-cream/95 backdrop-blur">
          <nav className="mx-auto max-w-6xl px-5 py-4 flex flex-col gap-2" aria-label="Mobile navigation">
            <a href="#worlds" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 rounded-xl text-base font-semibold text-slate-700 hover:bg-orange-50 hover:text-brand transition min-h-[44px]">{t('landing.header.nav_worlds', 'Worlds')}</a>
            <a href="#how" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 rounded-xl text-base font-semibold text-slate-700 hover:bg-orange-50 hover:text-brand transition min-h-[44px]">{t('landing.header.nav_how', 'How It Works')}</a>
            <a href="#parents" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 rounded-xl text-base font-semibold text-slate-700 hover:bg-orange-50 hover:text-brand transition min-h-[44px]">{t('landing.header.nav_parents', 'Parents')}</a>
            <a href="#voices" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 rounded-xl text-base font-semibold text-slate-700 hover:bg-orange-50 hover:text-brand transition min-h-[44px]">{t('landing.header.nav_voices', 'Voices')}</a>
            <a href="#worlds" onClick={() => setMobileMenuOpen(false)} className="mt-2 py-3 px-4 rounded-xl text-base font-bold text-center bg-brand text-white shadow-lg shadow-orange-300/50 min-h-[44px]">{t('landing.header.start_free', 'Start Free')}</a>
          </nav>
        </div>
      )}
    </header>
  );
}
