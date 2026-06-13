import { Level, getNextLevel, getXPProgress } from '../../data/gamification';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';

interface LevelDisplayProps {
  level: Level;
  xp: number;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

export default function LevelDisplay({ 
  level, 
  xp, 
  size = 'md',
  showProgress = true,
}: LevelDisplayProps) {
  const progress = getXPProgress(xp);
  const nextLevel = getNextLevel(level);

  const sizeClasses = {
    sm: { badge: 'w-10 h-10 text-lg', text: 'text-sm' },
    md: { badge: 'w-14 h-14 text-2xl', text: 'text-base' },
    lg: { badge: 'w-20 h-20 text-4xl', text: 'text-lg' },
  };

  return (
    <div className="flex items-center gap-4">
      {/* Level Badge */}
      <div
        className={cn(
          "rounded-full flex items-center justify-center bg-gradient-to-br shadow-lg",
          sizeClasses[size].badge,
          level.color
        )}
      >
        <span>{level.emoji}</span>
      </div>

      {/* Level Info */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <p className={cn("font-bold text-gray-800", sizeClasses[size].text)}>
              Level {level.level}: {level.name}
            </p>
            <p className="text-sm text-gray-500">
              {xp.toLocaleString()} XP
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {showProgress && nextLevel && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{progress.current} XP</span>
              <span>{progress.next} XP to Level {nextLevel.level}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", level.color)}
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        )}

        {!nextLevel && (
          <p className="text-sm text-purple-600 font-medium mt-1">🏆 Max Level Reached!</p>
        )}
      </div>
    </div>
  );
}

// Compact level badge for header
export function LevelBadge({ level, xp }: { level: Level; xp: number }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-full shadow-sm">
      <div className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center text-sm bg-gradient-to-br",
        level.color
      )}>
        {level.emoji}
      </div>
      <span className="text-sm font-medium text-gray-700">
        {xp.toLocaleString()} XP
      </span>
    </div>
  );
}
