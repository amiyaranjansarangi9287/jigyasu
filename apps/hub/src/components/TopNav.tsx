import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserProfile, useGlobalXP } from '@jigyasu/storage';
import DailyGoalRing from './DailyGoalRing';
import SearchOverlay from './SearchOverlay';

export default function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
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
  const isTransparent = isExecute && !scrolled;

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
        <h1 className={`text-2xl font-extrabold tracking-tight group-hover:text-sky-500 transition-colors ${isTransparent ? 'text-white drop-shadow-md' : 'text-slate-800'}`}>Jigyasu</h1>
        <span className="text-sm font-bold text-slate-400 self-end mb-1 ml-1 hidden sm:block">v1.0.0</span>
        {location.pathname !== '/' && (
          <span className={`ml-2 px-3 py-1 rounded-full text-sm font-bold hidden sm:block transition-colors ${
            isTransparent 
              ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm' 
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}>
            🏠 Hub
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        {profile && (
          <div className="hidden sm:flex items-center gap-3 text-sm font-bold text-slate-700 bg-slate-100 rounded-full px-4 py-1.5 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-1.5" title="Daily Streak">
              <span className="text-orange-500 text-lg">🔥</span>
              <span>{profile.streakDays || 0}</span>
            </div>
            <div className="w-px h-4 bg-slate-300"></div>
            <div className="flex items-center gap-1.5" title={`Daily Goal: ${profile.dailyXP || 0} / ${profile.dailyGoalXP || 50} XP`}>
              <DailyGoalRing currentXP={profile.dailyXP || 0} goalXP={profile.dailyGoalXP || 50} size={24} />
              <span>{xp} XP</span>
            </div>
          </div>
        )}

        {profile && (
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-xl shadow-sm border border-slate-200"
            title="Search"
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
      </div>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
