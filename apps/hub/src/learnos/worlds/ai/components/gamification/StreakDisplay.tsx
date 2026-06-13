import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';

interface StreakDisplayProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function StreakDisplay({ streak, size = 'md' }: StreakDisplayProps) {
  const { t } = useTranslation();
  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-1.5',
    lg: 'text-lg px-4 py-2',
  };

  if (streak === 0) {
    return (
      <div className={cn(
        "flex items-center gap-1 bg-gray-100 rounded-full text-gray-500",
        sizeClasses[size]
      )}>
        <span>🔥</span>
        <span className="font-medium">{t('auto.learning.s833_start_a_streak', 'Start a streak!')}</span>
      </div>
    );
  }

  const isHot = streak >= 7;
  const isOnFire = streak >= 14;

  return (<div className={cn(
      "flex items-center gap-1 rounded-full font-medium",
      sizeClasses[size],
      isOnFire
        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
        : isHot
        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
        : "bg-orange-100 text-orange-700"
    )}>
      <span className={isOnFire ? "animate-pulse" : ""}>
        {isOnFire ? '🔥🔥' : '🔥'}
      </span>
      <span>{streak} day{streak !== 1 ? 's' : ''}</span>
    </div>
  );
}

// Weekly streak calendar
export function StreakCalendar({ streak }: { streak: number }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const today = new Date().getDay();
  const adjustedToday = today === 0 ? 6 : today - 1; // Adjust for Monday start

  return (
    <div className="flex gap-1">
      {days.map((day, i) => {
        const isActive = i <= adjustedToday && i >adjustedToday - streak;
        const isToday = i === adjustedToday;

        return (<div
            key={i}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all",
              isActive
                ? "bg-gradient-to-br from-orange-400 to-red-500 text-white"
                : "bg-gray-100 text-gray-400",
              isToday && "ring-2 ring-orange-400 ring-offset-2"
            )}
          >
            {isActive ? '🔥' : day}
          </div>
        );
      })}
    </div>
  );
}
