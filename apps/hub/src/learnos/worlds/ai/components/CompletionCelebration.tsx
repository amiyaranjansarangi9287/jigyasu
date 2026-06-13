import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../utils/cn';
import PixelMascot from './story/PixelMascot';

interface CompletionCelebrationProps {
  conceptTitle: string;
  onBackToHome: () => void;
  onNextConcept?: () => void;
  hasNextConcept: boolean;
}

// Confetti particle
interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  delay: number;
  duration: number;
}

export default function CompletionCelebration({
  conceptTitle,
  onBackToHome,
  onNextConcept,
  hasNextConcept,
}: CompletionCelebrationProps) {
  const { t } = useTranslation();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Generate confetti particles
    const colors = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
      });
    }
    
    setParticles(newParticles);
    
    // Show content after a brief delay for dramatic effect
    setTimeout(() => setShowContent(true), 300);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full animate-bounce pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
      
      <div className={cn(
        "max-w-lg w-full bg-white rounded-3xl shadow-2xl overflow-hidden text-center transition-all duration-500",
        showContent ? "opacity-100 scale-100" : "opacity-0 scale-90"
      )}>
        {/* Celebration Header */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="mb-4">
              <PixelMascot mood="celebrating" size="lg" />
            </div>
            <h1 className="text-3xl font-bold mb-2">{t('auto.completioncelebration.congratulations', '🎉 Congratulations! 🎉')}</h1>
            <p className="text-white/90">{t('auto.worlds_ai_components_CompletionCelebration.you_ve_completed', "You've completed")}<span className="font-bold">{conceptTitle}</span>!
            </p>
          </div>
        </div>

        <div className="p-8">
          <div className="text-5xl mb-4 flex justify-center gap-2">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>⭐</span>
            <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>⭐</span>
            <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>⭐</span>
          </div>
          
          <p className="text-gray-600 mb-6 text-lg">
            {t('auto.completioncelebration.becoming_expert', "You're becoming an AI Expert!")} 
            <br />
            <span className="text-purple-600 font-medium">{t('auto.learning.s794_every_concept_you_learn_is_a_superpower', 'Every concept you learn is a superpower!')}</span>
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💜</span>
              <p className="text-purple-700 text-left">
                <span className="font-bold">{t('auto.learning.s795_pixel_says', 'Pixel says:')}</span> "{t('auto.completioncelebration.pixel_proud', "You did amazing! I'm so proud of you for learning something new today. Remember, every expert was once a beginner!")}"
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {hasNextConcept && onNextConcept && (
              <button
                onClick={onNextConcept}
                className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>{t('auto.learning.s796_continue_learning', 'Continue Learning')}</span>
                <span className="text-xl">🚀</span>
              </button>
            )}
            
            <button
              onClick={onBackToHome}
              className={cn(
                "w-full py-4 rounded-xl font-bold transition-all hover:scale-[1.02]",
                hasNextConcept 
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg"
              )}
            >
              {hasNextConcept ? t('auto.completioncelebration.back_adventures', '🏠 Back to All Adventures') : t('auto.completioncelebration.explore_adventures', '🏠 Explore More Adventures')}
            </button>
          </div>
          
          {/* Fun fact */}
          <p className="mt-6 text-sm text-gray-500 italic">
            {t('auto.completioncelebration.fun_fact', "🌟 Fun fact: You've just learned something that many adults don't know!")}
          </p>
        </div>
      </div>
    </div>
  );
}
