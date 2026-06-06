import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserProfile, useGlobalXP } from '@jigyasu/storage';
import DailyGoalRing from './DailyGoalRing';
import SearchOverlay from './SearchOverlay';
import GlobalLanguageSelector from './GlobalLanguageSelector';
import OfflineIndicator from './OfflineIndicator';
import { useTranslation } from 'react-i18next';

export default function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { profile, updateStreak } = useUserProfile();
  const xp = useGlobalXP();
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      updateStreak();
    }
  }, [profile?.id]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isExecute = location.pathname.startsWith('/execute');
  const isLanding = location.pathname === '/';
  
  const isTransparentWithWhiteText = isExecute && !scrolled;
  const isTransparentWithDarkText = isLanding && !scrolled;
  const isTransparent = isTransparentWithWhiteText || isTransparentWithDarkText;

  return (
    <div className={`w-full h-[72px] transition-all duration-300 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-[60] ${
      isTransparent 
        ? 'bg-transparent border-transparent' 
        : 'bg-white border-b border-slate-200 shadow-sm'
    }`}>
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => navigate('/')}
      >
        <span className="text-3xl group-hover:scale-110 transition-transform">🌟</span>
        <h1 className={`text-2xl font-extrabold tracking-tight transition-colors ${isTransparentWithWhiteText ? 'text-white drop-shadow-md group-hover:text-sky-300' : 'text-slate-800 group-hover:text-sky-500'}`}>Jigyasu</h1>
        <span className={`text-sm font-bold self-end mb-1 ml-1 hidden sm:block ${isTransparentWithWhiteText ? 'text-white/80' : 'text-slate-400'}`}>v1.0.0</span>
        {location.pathname !== '/' && (
          <span className={`ml-2 px-3 py-1 rounded-full text-sm font-bold hidden sm:block transition-colors ${
            isTransparentWithWhiteText 
              ? 'bg-white/20 text-white' 
              : 'bg-sky-100 text-sky-700'
          }`}>
            <span className="hidden lg:inline">{t('learn_explore', 'Learn & Explore')}</span>
            <span className="lg:hidden">{t('explore', 'Explore')}</span>
          </span>
        )}
      </div>

      <div className="hidden md:block absolute left-1/2 -translate-x-1/2">
        <OfflineIndicator />
      </div>

      <div className="flex items-center gap-4">
        {profile && (
          <div className="hidden sm:flex items-center gap-3 text-sm font-bold text-slate-700 bg-slate-100 rounded-full px-4 py-1.5 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-1.5" title={t('daily_streak', 'Daily Streak')}>
              <span className="text-orange-500 text-lg">🔥</span>
              <span>{profile.streakDays || 0}</span>
            </div>
            <div className="w-px h-4 bg-slate-300"></div>
            <div className="flex items-center gap-1.5" title={`${t('daily_goal', 'Daily Goal')}: ${profile.dailyXP || 0} / ${profile.dailyGoalXP || 50} XP`}>
              <DailyGoalRing currentXP={profile.dailyXP || 0} goalXP={profile.dailyGoalXP || 50} size={24} />
              <span>{xp} XP</span>
            </div>
          </div>
        )}

        {profile && (
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-xl shadow-sm border border-slate-200"
            title={t('search', 'Search')}
          >
            🔍
          </button>
        )}

        {profile && (
          <div className="flex items-center gap-2 bg-slate-100 pl-2 pr-4 py-1.5 rounded-full border border-slate-200 shadow-inner">
            <span className="text-xl bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm">
              {profile.avatar}
            </span>
            <span className="font-bold text-slate-700 text-sm">{profile.name}</span>
          </div>
        )}

        {/* Global Language Selector inline in TopNav */}
        <GlobalLanguageSelector />
      </div>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
