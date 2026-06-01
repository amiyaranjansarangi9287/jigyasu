import React, { useEffect, useState } from 'react';

export type MascotState = 'idle' | 'loading' | 'celebrating';

interface MascotProps {
  state?: MascotState;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Mascot({ state = 'idle', className = '', size = 'lg' }: MascotProps) {
  const [blink, setBlink] = useState(false);

  // Random blinking effect
  useEffect(() => {
    if (state === 'loading') return; // Don't blink while loading

    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setBlink(true);
        setTimeout(() => setBlink(false), 150);
      }
    }, 2000);

    return () => clearInterval(blinkInterval);
  }, [state]);

  const sizeClasses = {
    sm: 'text-2xl h-8 w-8',
    md: 'text-4xl h-12 w-12',
    lg: 'text-6xl h-20 w-20',
    xl: 'text-8xl h-32 w-32'
  };

  const getAnimationClasses = () => {
    switch (state) {
      case 'loading':
        return 'animate-bounce';
      case 'celebrating':
        return 'animate-bounce hover:rotate-12 hover:scale-110';
      case 'idle':
      default:
        return 'hover:scale-110 hover:-translate-y-1 transition-transform duration-300';
    }
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Glow effect for celebration */}
      {state === 'celebrating' && (
        <div className="absolute inset-0 bg-brand-orange/20 rounded-full blur-xl animate-pulse" />
      )}

      <div
        className={`
          relative z-10 flex items-center justify-center rounded-full
          bg-white shadow-sm border-2 border-slate-100
          ${sizeClasses[size]}
          ${getAnimationClasses()}
        `}
      >
        <span
          aria-hidden="true"
          className="transition-transform duration-200"
          style={{ transform: blink ? 'scaleY(0.1)' : 'scaleY(1)' }}
        >
          🦚
        </span>

        {/* Sparkles for celebration */}
        {state === 'celebrating' && (
          <>
            <span className="absolute -top-2 -right-2 text-xl animate-ping" style={{ animationDuration: '1s' }}>✨</span>
            <span className="absolute -bottom-2 -left-2 text-xl animate-ping" style={{ animationDelay: '0.5s', animationDuration: '1.2s' }}>✨</span>
          </>
        )}
      </div>
    </div>
  );
}
