import { useEffect, useState } from 'react';
import { Badge } from '../../data/gamification';
import { cn } from '../../utils/cn';
import { useAudio } from '../../context/AudioContext';
import { useTranslation } from 'react-i18next';

interface AchievementPopupProps {
  badge: Badge | null;
  onClose: () => void;
}

export default function AchievementPopup({ badge, onClose }: AchievementPopupProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const { playSound } = useAudio();

  useEffect(() => {
    if (badge) {
      setIsVisible(true);
      setIsLeaving(false);
      playSound('levelUp');

      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [badge]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!badge || !isVisible) return null;

  const tierColors = {
    bronze: 'from-amber-500 to-amber-700',
    silver: 'from-gray-300 to-gray-500',
    gold: 'from-yellow-400 to-amber-600',
    platinum: 'from-purple-500 to-pink-600',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
      {/* Backdrop */}
      <div 
        className={cn(
          "absolute inset-0 bg-black/30 transition-opacity pointer-events-auto",
          isLeaving ? "opacity-0" : "opacity-100"
        )}
        onClick={handleClose}
      />
      
      {/* Popup */}
      <div
        className={cn(
          "relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center pointer-events-auto transition-all duration-300",
          isLeaving 
            ? "opacity-0 scale-90 translate-y-4" 
            : "opacity-100 scale-100 translate-y-0"
        )}
      >
        {/* Confetti effect */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-bounce"
              style={{
                backgroundColor: ['#fbbf24', '#a855f7', '#ec4899', '#3b82f6', '#10b981'][i % 5],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                animationDelay: `${Math.random() * 1}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10">
          <p className="text-purple-600 font-bold text-sm uppercase tracking-wide mb-2">🎉 Achievement Unlocked!</p>
          
          {/* Badge */}
          <div className="my-6">
            <div
              className={cn(
                "w-24 h-24 mx-auto rounded-full flex items-center justify-center text-5xl",
                "bg-gradient-to-br shadow-lg animate-bounce",
                tierColors[badge.tier]
              )}
            >
              {badge.emoji}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {badge.name}
          </h2>
          <p className="text-gray-600 mb-6">
            {badge.description}
          </p>

          {/* Tier indicator */}
          <div className={cn(
            "inline-block px-3 py-1 rounded-full text-sm font-medium capitalize",
            badge.tier === 'bronze' && "bg-amber-100 text-amber-700",
            badge.tier === 'silver' && "bg-gray-200 text-gray-700",
            badge.tier === 'gold' && "bg-yellow-100 text-yellow-700",
            badge.tier === 'platinum' && "bg-purple-100 text-purple-700"
          )}>
            {badge.tier} Badge
          </div>

          <button
            onClick={handleClose}
            className="mt-6 w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >Awesome! 🎉</button>
        </div>
      </div>
    </div>
  );
}
