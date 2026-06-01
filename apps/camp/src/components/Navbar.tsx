// CampCraft - Navigation Bar

import { useState } from 'react';
import { pillars } from '../data/categories';
import { Navbar as SharedNavbar } from '@jigyasu/ui';

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
  onAgeClick
}: NavbarProps) {
  const [pillarsDropdownOpen, setPillarsDropdownOpen] = useState(false);

  const ageLabels: Record<string, string> = {
    '3-5': '🐣 3-5',
    '6-8': '🌟 6-8',
    '9-12': '🚀 9-12'
  };

  const desktopCenter = (
    <>
      {/* Activities Dropdown */}
      <div className="relative">
        <button
          onClick={() => setPillarsDropdownOpen(!pillarsDropdownOpen)}
          onBlur={() => setTimeout(() => setPillarsDropdownOpen(false), 150)}
          className="px-4 py-2 rounded-full font-medium transition-all flex items-center gap-1 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Activities
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
              All Activities
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
                <span className="text-gray-700 dark:text-gray-200">{pillar.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => onNavigate('camp-weeks')}
        className="px-4 py-2 rounded-full font-medium transition-all text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Camp Weeks
      </button>

      <button
        onClick={onOpenWorkshop}
        className="px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        My Progress
        {completedCount > 0 && (
          <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
            {completedCount}
          </span>
        )}
      </button>
    </>
  );

  const desktopRight = (
    <>
      <button
        onClick={onAgeClick}
        className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {selectedAge ? ageLabels[selectedAge] : '👤 Age'}
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <button
        onClick={onOpenFavorites}
        className="relative p-2 rounded-full transition-all text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <svg className="w-6 h-6" fill={favoritesCount > 0 ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        {favoritesCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
            {favoritesCount}
          </span>
        )}
      </button>

      <button
        onClick={onOpenSettings}
        className="p-2 rounded-full transition-all text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </>
  );

  const mobileMenuContent = ({ close }: { close: () => void }) => (
    <div className="p-4 space-y-2">
      {/* Age selector */}
      <button
        onClick={() => {
          onAgeClick();
          close();
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
        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide px-3 py-2">Activities</p>
        {pillars.map((pillar) => (
          <button
            key={pillar.id}
            onClick={() => {
              onNavigate(`pillar-${pillar.id}`);
              close();
            }}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <span className="text-2xl">{pillar.icon}</span>
            <span className="text-gray-700 dark:text-gray-200">{pillar.name}</span>
          </button>
        ))}
      </div>

      <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={() => {
            onNavigate('camp-weeks');
            close();
          }}
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <span className="text-2xl">📅</span>
          <span className="text-gray-700 dark:text-gray-200">Camp Weeks</span>
        </button>

        <button
          onClick={() => {
            onOpenWorkshop();
            close();
          }}
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <span className="text-2xl">📊</span>
          <span className="text-gray-700 dark:text-gray-200">My Progress</span>
          {completedCount > 0 && (
            <span className="ml-auto bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
              {completedCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <SharedNavbar
      theme="camp"
      brandIcon={<span className="text-3xl">🏕️</span>}
      brandText="CampCraft"
      onBrandClick={() => onNavigate('hero')}
      desktopCenter={desktopCenter}
      desktopRight={desktopRight}
      mobileMenuContent={mobileMenuContent}
    />
  );
}
