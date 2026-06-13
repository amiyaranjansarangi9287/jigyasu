import AudioSettings from './AudioSettings';
import { LevelBadge } from './gamification/LevelDisplay';
import StreakDisplay from './gamification/StreakDisplay';
import { useProgress } from '../context/ProgressContext';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  onHome: () => void;
  onProfile?: () => void;
  currentConcept?: string;
}

export default function Header({ onHome, onProfile, currentConcept }: HeaderProps) {
  const { t } = useTranslation();
  const { level, xp, streak } = useProgress();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-purple-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={onHome}
          className="flex items-center gap-2 hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-lg"
          aria-label="Go to home page"
        >
          <span className="text-3xl">🚀</span>
          <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hidden sm:block">{t('auto.header.ai_explorers', 'AI Explorers')}</span>
        </button>
        
        {/* Current concept indicator */}
        {currentConcept && (
          <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-full">
            <span className="text-sm text-purple-600 font-medium">
              {currentConcept}
            </span>
          </div>
        )}
        
        {/* Right side: Stats & Settings */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak */}
          <div className="hidden sm:block">
            <StreakDisplay streak={streak} size="sm" />
          </div>
          
          {/* Level & XP - Clickable to open profile */}
          <button
            onClick={onProfile}
            className="hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-purple-400 rounded-full"
            aria-label="View profile and progress"
          >
            <LevelBadge level={level} xp={xp} />
          </button>
          
          {/* Audio Settings */}
          <AudioSettings />
        </div>
      </div>
    </header>
  );
}
