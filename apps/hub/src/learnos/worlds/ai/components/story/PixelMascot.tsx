import { useTranslation } from 'react-i18next';
import { cn } from '../../utils/cn';

type Mood = 'excited' | 'thinking' | 'celebrating' | 'curious' | 'teaching' | 'waving';
type Size = 'sm' | 'md' | 'lg';

interface PixelMascotProps {
  mood?: Mood;
  size?: Size;
  message?: string;
  className?: string;
}

const sizeClasses: Record<Size, string> = {
  sm: 'w-12 h-12 text-2xl',
  md: 'w-16 h-16 text-3xl',
  lg: 'w-24 h-24 text-5xl',
};

const moodEmojis: Record<Mood, string> = {
  excited: '🤖',
  thinking: '🤔',
  celebrating: '🎉',
  curious: '🧐',
  teaching: '📚',
  waving: '👋',
};

const moodAnimations: Record<Mood, string> = {
  excited: 'animate-bounce',
  thinking: 'animate-pulse',
  celebrating: 'animate-bounce',
  curious: 'animate-pulse',
  teaching: '',
  waving: 'animate-bounce',
};

export default function PixelMascot({
  mood = 'teaching', 
  size = 'md',
  message,
  className 
}: PixelMascotProps) {
  const { t } = useTranslation();
  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      {/* Speech bubble */}
      {message && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white rounded-xl px-3 py-1.5 shadow-lg text-sm font-medium text-gray-700 whitespace-nowrap z-10">
          {message}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white transform rotate-45" />
        </div>
      )}
      
      {/* Robot character */}
      <div 
        className={cn(
          "rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg",
          sizeClasses[size],
          moodAnimations[mood]
        )}
      >
        <span>{moodEmojis[mood]}</span>
      </div>
      
      {/* Label */}
      <span className="text-xs font-medium text-purple-600 mt-1">{t('auto.learning.s866_pixel', 'Pixel')}</span>
    </div>
  );
}

// Pre-built Pixel states for common scenarios
export function PixelWelcome() {
  const { t } = useTranslation();
  return <PixelMascot mood="waving" size="lg" message="Hi there! Let's learn together!" />;
}

export function PixelThinking() {
  const { t } = useTranslation();
  return <PixelMascot mood="thinking" size="md" message="Hmm, let me think..." />;
}

export function PixelCelebrating() {
  const { t } = useTranslation();
  return <PixelMascot mood="celebrating" size="lg" message="You did it! 🎉" />;
}

export function PixelEncouraging() {
  const { t } = useTranslation();
  return <PixelMascot mood="excited" size="md" message="You've got this!" />;
}
