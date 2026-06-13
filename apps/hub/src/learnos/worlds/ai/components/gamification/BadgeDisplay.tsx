import { Badge } from '../../data/gamification';
import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';

interface BadgeDisplayProps {
  badge: Badge;
  earned?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  onClick?: () => void;
}

const tierColors = {
  bronze: 'from-amber-600 to-amber-700',
  silver: 'from-gray-300 to-gray-400',
  gold: 'from-yellow-400 to-amber-500',
  platinum: 'from-purple-400 to-pink-500',
};

const tierBorders = {
  bronze: 'border-amber-600',
  silver: 'border-gray-400',
  gold: 'border-yellow-500',
  platinum: 'border-purple-500',
};

const sizeClasses = {
  sm: 'w-12 h-12 text-xl',
  md: 'w-16 h-16 text-2xl',
  lg: 'w-24 h-24 text-4xl',
};

export default function BadgeDisplay({ 
  badge, 
  earned = true, 
  size = 'md',
  showDetails = false,
  onClick,
}: BadgeDisplayProps) {
  const { t } = useTranslation();
  return (
    <div 
      className={cn(
        "flex flex-col items-center gap-2",
        onClick && "cursor-pointer hover:scale-105 transition-transform"
      )}
      onClick={onClick}
    >
      {/* Badge Circle */}
      <div
        className={cn(
          "rounded-full flex items-center justify-center border-4 transition-all",
          sizeClasses[size],
          earned
            ? `bg-gradient-to-br ${tierColors[badge.tier]} ${tierBorders[badge.tier]} shadow-lg`
            : "bg-gray-200 border-gray-300 grayscale opacity-50"
        )}
      >
        <span className={earned ? "" : "opacity-50"}>
          {earned ? badge.emoji : '🔒'}
        </span>
      </div>

      {/* Badge Info */}
      {showDetails && (
        <div className="text-center">
          <p className={cn(
            "font-bold text-sm",
            earned ? "text-gray-800" : "text-gray-400"
          )}>
            {badge.name}
          </p>
          <p className={cn(
            "text-xs",
            earned ? "text-gray-600" : "text-gray-400"
          )}>
            {badge.description}
          </p>
        </div>
      )}
    </div>
  );
}

// Badge Grid for displaying multiple badges
interface BadgeGridProps {
  badges: Badge[];
  earnedBadgeIds: string[];
  size?: 'sm' | 'md' | 'lg';
  showLocked?: boolean;
}

export function BadgeGrid({ 
  badges, 
  earnedBadgeIds, 
  size = 'md',
  showLocked = true,
}: BadgeGridProps) {
  const earned = badges.filter(b => earnedBadgeIds.includes(b.id));
  const locked = badges.filter(b => !earnedBadgeIds.includes(b.id));

  const displayBadges = showLocked ? [...earned, ...locked] : earned;

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
      {displayBadges.map(badge => (
        <BadgeDisplay
          key={badge.id}
          badge={badge}
          earned={earnedBadgeIds.includes(badge.id)}
          size={size}
          showDetails
        />
      ))}
    </div>
  );
}
