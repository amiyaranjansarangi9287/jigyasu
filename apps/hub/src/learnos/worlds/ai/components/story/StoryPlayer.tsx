import { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '../../utils/cn';
import StoryNarrator from './StoryNarrator';
import PixelMascot from './PixelMascot';
import { useAudio } from '../../context/AudioContext';
import { useTranslation } from 'react-i18next';

export interface StoryPage {
  title: string;
  content: string;
  image?: string;
  illustration?: React.ReactNode;
  pixelMood?: 'excited' | 'thinking' | 'celebrating' | 'curious' | 'teaching';
  highlight: string;
}

interface StoryPlayerProps {
  pages: StoryPage[];
  conceptColor: string;
  conceptEmoji: string;
  onComplete: () => void;
}

const AUTO_PLAY_DELAY = 10000;

export default function StoryPlayer({
  pages, 
  conceptColor, 
  conceptEmoji,
  onComplete 
}: StoryPlayerProps) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [narratorKey, setNarratorKey] = useState(0);
  const [textComplete, setTextComplete] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const { speak, stopSpeaking, settings, playSound } = useAudio();

  const page = pages[currentPage];
  const isLastPage = currentPage === pages.length - 1;

  // Announce page change to screen readers
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.focus();
    }
  }, [currentPage]);

  // Narrate when page changes
  useEffect(() => {
    if (settings.narrationEnabled && !isTransitioning) {
      const fullText = `${page.title}. ${page.content}. Remember: ${page.highlight}`;
      speak(fullText);
    }
    
    return () => {
      stopSpeaking();
    };
  }, [currentPage, isTransitioning, page, settings.narrationEnabled, speak, stopSpeaking]);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying || isTransitioning) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / AUTO_PLAY_DELAY) * 100, 100);
      setProgress(newProgress);

      if (elapsed >= AUTO_PLAY_DELAY) {
        if (!isLastPage) {
          goToNextPage();
        } else {
          setIsAutoPlaying(false);
        }
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentPage, isAutoPlaying, isLastPage, isTransitioning]);

  const goToNextPage = useCallback(() => {
    if (currentPage >= pages.length - 1) return;
    
    stopSpeaking();
    playSound('whoosh');
    setIsTransitioning(true);
    setTextComplete(false);
    
    setTimeout(() => {
      setCurrentPage(p => p + 1);
      setProgress(0);
      setNarratorKey(k => k + 1);
      setIsTransitioning(false);
    }, 300);
  }, [currentPage, pages.length, stopSpeaking, playSound]);

  const goToPrevPage = useCallback(() => {
    if (currentPage <= 0) return;
    
    stopSpeaking();
    playSound('whoosh');
    setIsTransitioning(true);
    setTextComplete(false);
    
    setTimeout(() => {
      setCurrentPage(p => p - 1);
      setProgress(0);
      setNarratorKey(k => k + 1);
      setIsTransitioning(false);
    }, 300);
  }, [currentPage, stopSpeaking, playSound]);

  const goToPage = (index: number) => {
    if (index === currentPage) return;
    
    stopSpeaking();
    playSound('pop');
    setIsTransitioning(true);
    setTextComplete(false);
    
    setTimeout(() => {
      setCurrentPage(index);
      setProgress(0);
      setNarratorKey(k => k + 1);
      setIsTransitioning(false);
    }, 300);
  };

  const toggleAutoPlay = () => {
    playSound('click');
    setIsAutoPlaying(!isAutoPlaying);
    if (!isAutoPlaying) {
      setProgress(0);
    }
  };

  const handleComplete = () => {
    stopSpeaking();
    playSound('success');
    onComplete();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        if (!isLastPage) goToNextPage();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        if (currentPage > 0) goToPrevPage();
        break;
      case ' ':
        e.preventDefault();
        toggleAutoPlay();
        break;
      case 'Enter':
        e.preventDefault();
        if (isLastPage) handleComplete();
        else goToNextPage();
        break;
    }
  };

  return (
    <div 
      className="max-w-4xl mx-auto"
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Story player"
    >
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        {/* Header with progress */}
        <div className={cn("p-6 text-white relative", conceptColor)}>
          {/* Auto-play progress bar */}
          {isAutoPlaying && (
            <div 
              className="absolute top-0 left-0 right-0 h-1.5 bg-white/20"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Auto-play progress"
            >
              <div 
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl" role="img" aria-hidden="true">{conceptEmoji}</span>
              <div>
                <h2 className="text-2xl font-bold">{t('auto.learning.s867_story_time', 'Story Time!')}</h2>
                <p className="text-white/80 text-sm">{t('auto.worlds_ai_components_story_StoryPlayer.let_s_learn_together', "Let's learn together")}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={toggleAutoPlay}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                  "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-500",
                  isAutoPlaying 
                    ? "bg-white/20 hover:bg-white/30" 
                    : "bg-white/10 hover:bg-white/20"
                )}
                aria-label="{isAutoPlaying ? 'Pause auto-play' : 'Start auto-play'}"
                aria-pressed={isAutoPlaying}
              >
                {isAutoPlaying ? '⏸️ Pause' : '▶️ Play'}
              </button>
              
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm" aria-live="polite">
                {currentPage + 1} / {pages.length}
              </span>
            </div>
          </div>
        </div>

        {/* Story Content */}
        <div 
          ref={contentRef}
          className="p-4 sm:p-8"
          tabIndex={-1}
          aria-live="polite"
          aria-atomic="true"
        >
          <div className={cn(
            "transition-all duration-300",
            isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          )}>
            {/* Illustration Area */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* SVG Illustration (preferred) */}
                {page.illustration ? (
                  <div className="w-56 h-40 sm:w-72 sm:h-52 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-3 sm:p-4">
                    {page.illustration}
                  </div>) : page.image ? (
                  /* External image fallback */<img 
                    src={page.image} 
                    alt={`Illustration for ${page.title}`}
                    className="w-56 h-40 sm:w-72 sm:h-52 object-cover rounded-2xl shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />) : (
                  /* Emoji fallback */<div className={cn(
                    "w-56 h-40 sm:w-72 sm:h-52 rounded-2xl flex items-center justify-center",
                    "bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100"
                  )}>
                    <span className="text-8xl animate-float" role="img" aria-hidden="true">
                      {conceptEmoji}
                    </span>
                  </div>
                )}
                
                {/* Pixel mascot */}
                <div className="absolute -bottom-4 -right-4">
                  <PixelMascot mood={page.pixelMood || 'teaching'} size="md" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 text-center">
              {page.title}
            </h3>

            {/* Narrated Content */}
            <div className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-6 text-center max-w-2xl mx-auto min-h-[80px] sm:min-h-[120px]">
              <StoryNarrator 
                key={narratorKey}
                text={page.content} 
                speed={25}
                onComplete={() => setTextComplete(true)}
              />
            </div>

            {/* Highlight Box */}
            <div 
              className={cn(
                "border-l-4 p-4 rounded-r-xl max-w-xl mx-auto transition-all duration-500",
                textComplete ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                conceptColor.includes('purple') && "bg-purple-50 border-purple-500",
                conceptColor.includes('blue') && "bg-blue-50 border-blue-500",
                conceptColor.includes('orange') && "bg-orange-50 border-orange-500",
                conceptColor.includes('green') && "bg-green-50 border-green-500",
                conceptColor.includes('indigo') && "bg-indigo-50 border-indigo-500",
                conceptColor.includes('rose') && "bg-rose-50 border-rose-500",
                conceptColor.includes('yellow') && "bg-yellow-50 border-yellow-500",
                conceptColor.includes('teal') && "bg-teal-50 border-teal-500"
              )}
              role="note"
              aria-label="Key takeaway"
            >
              <p className={cn(
                "font-medium",
                conceptColor.includes('purple') && "text-purple-700",
                conceptColor.includes('blue') && "text-blue-700",
                conceptColor.includes('orange') && "text-orange-700",
                conceptColor.includes('green') && "text-green-700",
                conceptColor.includes('indigo') && "text-indigo-700",
                conceptColor.includes('rose') && "text-rose-700",
                conceptColor.includes('yellow') && "text-yellow-700",
                conceptColor.includes('teal') && "text-teal-700"
              )}>
                💡 <span className="font-bold">{t('auto.learning.s868_remember', 'Remember:')}</span> {page.highlight}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex justify-between items-center mt-6 sm:mt-8 gap-2" aria-label="Story navigation">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              className="px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 text-sm sm:text-base"
              aria-label="Previous page"
            >
              ← <span className="hidden sm:inline">{t('auto.learning.s869_back', 'Back')}</span>
            </button>

            {/* Page dots */}
            <div className="flex gap-2" role="tablist" aria-label="Story pages">
              {pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  role="tab"
                  aria-selected={i === currentPage}
                  aria-label="{`Go to page ${i + 1}`}"
                  className={cn(
                    "w-3 h-3 rounded-full transition-all hover:scale-125",
                    "focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2",
                    i === currentPage 
                      ? "bg-purple-500 scale-125" 
                      : i < currentPage 
                      ? "bg-purple-300"
                      : "bg-gray-300 hover:bg-gray-400"
                  )}
                />
              ))}
            </div>

            {isLastPage ? (
              <button
                onClick={handleComplete}
                className={cn(
                  "px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium text-white hover:shadow-lg transition-all hover:scale-105 text-sm sm:text-base",
                  "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2",
                  conceptColor
                )}
              >
                <span className="hidden sm:inline">I understand! </span>{t('auto.worlds_ai_components_story_StoryPlayer.let_s_learn', "Let's Learn! 🚀")}</button>) : (<button
                onClick={goToNextPage}
                className={cn(
                  "px-3 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium text-white transition-all hover:scale-105 text-sm sm:text-base",
                  "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2",
                  conceptColor
                )}
                aria-label="Next page"
              >{t('auto.learning.s870_next', 'Next →')}</button>
            )}
          </nav>
          
          {/* Keyboard hint */}
          <p className="text-center text-xs text-gray-400 mt-4">
            💡 Use arrow keys to navigate, Space to pause/play
          </p>
        </div>
      </div>
    </div>
  );
}
