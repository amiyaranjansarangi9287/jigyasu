import { useEffect, useState, useRef, ReactNode } from 'react';
import { cn } from '@jigyasu/utils';

export interface HeroProps {
  imageSrc: string;
  theme?: 'camp' | 'toys' | 'learn';
  children: ReactNode;
  bottomScrollIndicator?: ReactNode;
}

export function Hero({ imageSrc, theme = 'camp', children, bottomScrollIndicator }: HeroProps) {
  const [offset, setOffset] = useState(0);
  const heroRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (heroRef.current) {
            const rect = heroRef.current.getBoundingClientRect();
            // Only parallax if in view
            if (rect.bottom > 0) {
              setOffset(window.scrollY * 0.4);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Trigger initial animations
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const isToys = theme === 'toys';

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${offset}px)`,
        }}
      >
        <img
          src={imageSrc}
          alt="Hero background"
          className="w-full h-[120%] object-cover"
        />
        {/* Gradients */}
        {isToys ? (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-900/90 via-indigo-900/80 to-purple-900/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-orange-900/70 via-purple-900/60 to-indigo-900/80" />
        )}
      </div>

      {/* Overlays / Decorations */}
      {isToys ? (
        <>
          <div className="absolute top-20 left-[10%] w-64 h-64 bg-violet-500/15 animate-blob blur-3xl" />
          <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-pink-500/10 animate-blob blur-3xl" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-cyan-500/10 animate-blob blur-3xl" style={{ animationDelay: '4s' }} />
        </>
      ) : (
        <div className="absolute inset-0 z-0 opacity-40 mesh-gradient" />
      )}

      {/* Main Content Area */}
      <div className={cn(
        "relative z-20 w-full",
        isToys ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12" : "max-w-5xl mx-auto px-4 text-center"
      )}>
        <div className={cn(
          "transition-all duration-1000",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          {children}
        </div>
      </div>

      {/* Bottom Wave/Scroll Indicator */}
      {bottomScrollIndicator}
    </section>
  );
}
