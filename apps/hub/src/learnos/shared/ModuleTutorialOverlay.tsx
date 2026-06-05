import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export interface TutorialSlide {
  title: string;
  description: string;
  emoji: string;
}

interface ModuleTutorialOverlayProps {
  moduleId: string;
  moduleTitle: string;
  slides?: TutorialSlide[]; // Optional custom slides
  onComplete: () => void;
  onClose: () => void;
}

export default function ModuleTutorialOverlay({
  moduleId,
  moduleTitle,
  slides,
  onComplete,
  onClose
}: ModuleTutorialOverlayProps) {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Delay appearance slightly for a better entrance effect
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const defaultSlides: TutorialSlide[] = [
    {
      title: t(`tutorials.${moduleId}.step1.title`, t('tutorials.generic.step1.title', 'Welcome!')),
      description: t(`tutorials.${moduleId}.step1.desc`, t('tutorials.generic.step1.desc', `Let's explore the world of ${moduleTitle} together!`)),
      emoji: '🦚'
    },
    {
      title: t(`tutorials.${moduleId}.step2.title`, t('tutorials.generic.step2.title', 'How to Play')),
      description: t(`tutorials.${moduleId}.step2.desc`, t('tutorials.generic.step2.desc', 'Tap, drag, and interact with the elements on the screen to see what happens.')),
      emoji: '👆'
    },
    {
      title: t(`tutorials.${moduleId}.step3.title`, t('tutorials.generic.step3.title', 'Discover')),
      description: t(`tutorials.${moduleId}.step3.desc`, t('tutorials.generic.step3.desc', 'Be curious and try different things. What patterns can you find?')),
      emoji: '✨'
    }
  ];

  const activeSlides = slides || defaultSlides;

  const handleNext = () => {
    if (currentSlide < activeSlides.length - 1) {
      setCurrentSlide(s => s + 1);
    } else {
      setIsVisible(false);
      setTimeout(onComplete, 400); // Allow exit animation to finish
    }
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onComplete, 400);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={handleSkip}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Top Bar */}
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <span className="font-bold text-slate-400 text-sm tracking-wider uppercase">
                {t('tutorials.guide_title', 'Guided Guide')}
              </span>
              <button 
                onClick={handleSkip}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                aria-label={t('tutorials.skip', 'Skip')}
              >
                ✕
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="text-7xl mb-6 select-none animate-bounce-slow">
                    {activeSlides[currentSlide].emoji}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mb-4">
                    {activeSlides[currentSlide].title}
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed max-w-sm mx-auto">
                    {activeSlides[currentSlide].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Navigation */}
            <div className="p-6 bg-slate-50 flex flex-col gap-4">
              {/* Progress Dots */}
              <div className="flex justify-center gap-2 mb-2">
                {activeSlides.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      idx === currentSlide 
                        ? 'w-8 bg-brand' 
                        : 'w-2.5 bg-slate-300'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                {currentSlide > 0 && (
                  <button
                    onClick={() => setCurrentSlide(s => s - 1)}
                    className="px-6 py-4 rounded-2xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    {t('tutorials.back', 'Back')}
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="flex-1 py-4 rounded-2xl font-bold text-white bg-brand hover:bg-brand-dark transition-colors shadow-lg shadow-orange-300/50"
                >
                  {currentSlide === activeSlides.length - 1 
                    ? t('tutorials.start', 'Start Exploring!') 
                    : t('tutorials.next', 'Next')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
