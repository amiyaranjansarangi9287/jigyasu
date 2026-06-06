import { useEffect } from 'react';
import type { Achievement } from '../hooks/useAchievements';

interface AchievementToastProps {
  achievement: Achievement;
  onDismiss: () => void;
}

export default function AchievementToast({ achievement, onDismiss }: AchievementToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] animate-achievement-in">
      <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 rounded-2xl shadow-2xl shadow-amber-500/30 p-1">
        <div className="bg-white dark:bg-gray-900 rounded-xl px-6 py-4 flex items-center gap-4">
          <div className="w-14 min-h-14 bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 rounded-xl flex items-center justify-center text-3xl animate-bounce-slow">
            {achievement.icon}
          </div>
          <div>
            <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Achievement Unlocked!</p>
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">{achievement.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.description}</p>
          </div>
          <button
            onClick={onDismiss}
            className="ml-4 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
           aria-label="Action button">
            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
