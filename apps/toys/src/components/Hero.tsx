import { useCountUp } from '../hooks/useReveal';
import { Hero as SharedHero } from '@jigyasu/ui';

interface HeroProps {
  onScrollTo: (section: string) => void;
}

export default function Hero({ onScrollTo }: HeroProps) {
  const projectsRef = useCountUp(8, 1500);
  const levelsRef = useCountUp(3, 1200);
  const ratingsRef = useCountUp(100, 2000);

  const scrollIndicator = (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
      <span className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">Scroll</span>
      <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
        <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" />
      </div>
    </div>
  );

  return (
    <SharedHero
      imageSrc="/images/hero-toys.jpg"
      theme="toys"
      bottomScrollIndicator={scrollIndicator}
    >
      {/* Floating toy icons */}
      <div className="absolute top-[15%] right-[15%] text-4xl animate-float opacity-20 select-none hidden lg:block">🧱</div>
      <div className="absolute top-[25%] right-[25%] text-3xl animate-float-delayed opacity-15 select-none hidden lg:block">🚗</div>
      <div className="absolute bottom-[25%] right-[20%] text-5xl animate-float opacity-15 select-none hidden lg:block" style={{ animationDelay: '1s' }}>🧸</div>
      <div className="absolute top-[40%] right-[10%] text-3xl animate-float-delayed opacity-10 select-none hidden lg:block" style={{ animationDelay: '3s' }}>✈️</div>
      <div className="absolute bottom-[35%] left-[5%] text-4xl animate-float opacity-10 select-none hidden lg:block" style={{ animationDelay: '2s' }}>🤖</div>

      {/* Content */}
      <div className="max-w-3xl text-left">
        {/* Badge */}
        <div className="animate-fade-in-up inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 hover:bg-white/15 transition-colors cursor-default">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-white/90">Discover the joy of making toys</span>
        </div>

        {/* Heading */}
        <h1 className="animate-fade-in-up text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6" style={{ animationDelay: '0.1s' }}>
          Build{' '}
          <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-violet-300 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
            Amazing
          </span>
          <br />
          Toys
        </h1>

        {/* Subheading */}
        <p className="animate-fade-in-up text-lg sm:text-xl text-white/75 leading-relaxed mb-10 max-w-2xl" style={{ animationDelay: '0.2s' }}>
          From wooden cars to plush teddy bears, explore our collection of handcrafted toy projects.
          Each one comes with step-by-step instructions, materials lists, and difficulty ratings.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up flex flex-wrap gap-4" style={{ animationDelay: '0.3s' }}>
          <button
            onClick={() => onScrollTo('gallery')}
            className="group px-8 py-4 bg-white text-violet-700 font-bold rounded-2xl hover:shadow-2xl hover:shadow-white/25 transition-all duration-300 hover:-translate-y-1 active:translate-y-0 flex items-center gap-2"
          >
            Browse All Toys
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <button
            onClick={() => onScrollTo('how-it-works')}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
          >
            How It Works
          </button>
        </div>

        {/* Stats */}
        <div className="animate-fade-in-up mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8" style={{ animationDelay: '0.5s' }}>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:bg-white/10 transition-colors text-center md:text-left">
            <p className="text-3xl font-bold text-white">
              <span ref={projectsRef}>0</span>+
            </p>
            <p className="text-sm text-white/50 mt-1">Toy Projects</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:bg-white/10 transition-colors text-center md:text-left">
            <p className="text-3xl font-bold text-white">
              <span ref={levelsRef}>0</span>
            </p>
            <p className="text-sm text-white/50 mt-1">Difficulty Levels</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:bg-white/10 transition-colors text-center md:text-left">
            <p className="text-3xl font-bold text-white">Ages 3+</p>
            <p className="text-sm text-white/50 mt-1">Suitable For</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4 hover:bg-white/10 transition-colors text-center md:text-left">
            <p className="text-3xl font-bold text-white">
              <span ref={ratingsRef}>0</span>%
            </p>
            <p className="text-sm text-white/50 mt-1">Handcrafted</p>
          </div>
        </div>
      </div>
    </SharedHero>
  );
}
