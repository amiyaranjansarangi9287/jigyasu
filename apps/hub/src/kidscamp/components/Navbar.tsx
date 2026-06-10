// CampCraft - Navigation Bar

import { useState, useEffect } from 'react';
import { useLearnerStore } from '../../learnos/store';
import { useTranslation, Trans } from 'react-i18next';
import { pillars } from '../data/categories';

interface NavbarProps {
  onNavigate: (section: string) => void;
  onOpenWorkshop: () => void;
  onOpenSettings: () => void;
  onOpenFavorites: () => void;
  favoritesCount: number;
  completedCount: number;
  selectedAge: string | null;
  onAgeClick: () => void;
}

export default function Navbar({
  onNavigate,
  onOpenWorkshop,
  onOpenSettings,
  onOpenFavorites,
  favoritesCount,
  completedCount,
  selectedAge,
  onAgeClick,
}: NavbarProps) {
  const { language, setLanguage } = useLearnerStore();
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pillarsDropdownOpen, setPillarsDropdownOpen] = useState(false);



  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const ageLabels: Record<string, string> = {
    '3-5': '🐣 3-5',
    '6-8': '🌟 6-8',
    '9-12': '🚀 9-12'
  };

  return (
    <>
      <nav
        className={`fixed top-[72px] left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg py-2'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => onNavigate('hero')}
              className="flex items-center gap-2 group"
            >
              <span className="text-3xl group-hover:animate-wiggle">🦚</span>
              <span
                className={`text-xl font-bold transition-colors ${
                  scrolled
                    ? 'text-gray-900 dark:text-white'
                    : 'text-white drop-shadow-lg'
                }`}
              >
                {t('kidscamp.title', 'Jigyasu')}
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {/* Activities Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setPillarsDropdownOpen(!pillarsDropdownOpen)}
                  onBlur={() => setTimeout(() => setPillarsDropdownOpen(false), 150)}
                  className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-1 ${
                    scrolled
                      ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {t('activities', 'Activities')}
                  <svg
                    className={`w-4 h-4 transition-transform ${pillarsDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {pillarsDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in-down">
                    <button
                      onClick={() => {
                        onNavigate('activities');
                        setPillarsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700"
                    >
                      {t('all_activities', 'All Activities')}
                    </button>
                    {pillars.map((pillar) => (
                      <button
                        key={pillar.id}
                        onClick={() => {
                          onNavigate(`pillar-${pillar.id}`);
                          setPillarsDropdownOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3"
                      >
                        <span className="text-xl">{pillar.icon}</span>
                        {/* // eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                    <span className="text-gray-700 dark:text-gray-200">{t(`pillar_${pillar.id}` as any, pillar.name)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => onNavigate('camp-weeks')}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  scrolled
                    ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {t('project_weeks', 'Project Weeks')}
              </button>

              <button
                onClick={onOpenWorkshop}
                className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                  scrolled
                    ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
               aria-label="Action button">
                {t('my_progress', 'My Progress')}
                {completedCount > 0 && (
                  <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm px-2 py-0.5 rounded-full">
                    {completedCount}
                  </span>
                )}
              </button>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center gap-2">


              {/* Age selector button */}
              <button
                onClick={onAgeClick}
                className={`hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  scrolled
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
               aria-label="Action button">
                {selectedAge ? ageLabels[selectedAge] : '👤 Age'}
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Favorites button */}
              <button
                onClick={onOpenFavorites}
                className={`relative p-2 rounded-full transition-all ${
                  scrolled
                    ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'text-white hover:bg-white/10'
                }`}
               aria-label="Action button">
                <svg className="w-6 h-6" fill={favoritesCount > 0 ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-sm rounded-full flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </button>

              {/* Settings button */}
              <button
                onClick={onOpenSettings}
                className={`p-2 rounded-full transition-all ${
                  scrolled
                    ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'text-white hover:bg-white/10'
                }`}
               aria-label="Action button">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>


              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`md:hidden p-2 rounded-full transition-all ${
                  scrolled
                    ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 shadow-2xl animate-slide-in-mobile">
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900 dark:text-white"><Trans i18nKey="auto.navbar.menu">Menu</Trans></span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-4 space-y-2">
              {/* Age selector */}
              <button
                onClick={() => {
                  onAgeClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30"
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedAge ? `Age: ${ageLabels[selectedAge]}` : 'Select Age'}
                </span>
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide px-3 py-2"><Trans i18nKey="auto.navbar.activities">Activities</Trans></p>
                {pillars.map((pillar) => (
                  <button
                    key={pillar.id}
                    onClick={() => {
                      onNavigate(`pillar-${pillar.id}`);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <span className="text-2xl">{pillar.icon}</span>
                    {/* // eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            <span className="text-gray-700 dark:text-gray-200">{t(`pillar_${pillar.id}` as any, pillar.name)}</span>
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => {
                    onNavigate('camp-weeks');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <span className="text-2xl">📅</span>
                  <span className="text-gray-700 dark:text-gray-200"><Trans i18nKey="auto.navbar.project_weeks">Project Weeks</Trans></span>
                </button>

                <button
                  onClick={() => {
                    onOpenWorkshop();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <span className="text-2xl">📊</span>
                  <span className="text-gray-700 dark:text-gray-200"><Trans i18nKey="auto.navbar.my_progress">My Progress</Trans></span>
                  {completedCount > 0 && (
                    <span className="ml-auto bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm px-2 py-0.5 rounded-full">
                      {completedCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
