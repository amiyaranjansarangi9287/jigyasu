import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { Level } from '../../data/gamification';
import { cn } from '../../utils/cn';
import { useAudio } from '../../context/AudioContext';

interface LevelUpModalProps {
  newLevel: Level | null;
  onClose: () => void;
}

export default function LevelUpModal({ newLevel, onClose }: LevelUpModalProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const { playSound } = useAudio();

  useEffect(() => {
    if (newLevel) {
      setIsVisible(true);
      playSound('levelUp');
    }
  }, [newLevel]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!newLevel || !isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
      
      <div className={cn(
        "relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center transition-all duration-500",
        "animate-slideUp"
      )}>
        {/* Sparkle border */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="absolute w-2 h-2 rounded-full animate-bounce"
              style={{
                backgroundColor: ['#fbbf24', '#a855f7', '#ec4899', '#3b82f6'][i % 4],
                left: `${(i / 16) * 100}%`,
                top: i % 2 === 0 ? '5%' : '90%',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10">
          <p className="text-purple-600 font-bold text-sm uppercase tracking-wide mb-4">🎉 Level Up! 🎉</p>
          
          <div className={cn(
            "w-24 h-24 mx-auto rounded-full flex items-center justify-center text-5xl bg-gradient-to-br shadow-lg mb-4 animate-bounce",
            newLevel.color
          )}>
            {newLevel.emoji}
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            Level {newLevel.level}
          </h2>
          <p className={cn("text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-4", newLevel.color)}>
            {newLevel.name}
          </p>

          <p className="text-gray-600 mb-6 text-sm">
            You're making amazing progress! Keep learning to reach the next level!
          </p>

          <button onClick={handleClose} className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:shadow-lg transition-all">{t('auto.learning.s822_awesome', 'Awesome! ✨')}</button>
        </div>
      </div>
    </div>
  );
}
