// CampCraft - Hero Section

import { useEffect, useState, useRef } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useCountUp } from '../hooks/useReveal';
import { useFormatNumber } from '../../hooks/useFormatNumber';
import { Button } from '@jigyasu/ui';
interface HeroProps {
  onGetStarted: () => void;
  onExploreCampWeeks: () => void;
  totalActivities: number;
  totalPillars: number;
}

export default function Hero({
  onGetStarted,
  onExploreCampWeeks,
  totalActivities,
  totalPillars
}: HeroProps) {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Animated counters
  const { t } = useTranslation();
  const formatNumber = useFormatNumber();
  const { count: activitiesCount, start: startActivities } = useCountUp(totalActivities, 2000, true);
  const { count: pillarsCount, start: startPillars } = useCountUp(totalPillars, 1500, true);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Trigger counter animations after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
      startActivities();
      startPillars();
    }, 300);
    return () => clearTimeout(timer);
  }, [startActivities, startPillars]);

  const floatingIcons = [
    { icon: '🧸', delay: 0, x: '10%', y: '20%' },
    { icon: '🔬', delay: 0.5, x: '85%', y: '15%' },
    { icon: '🎨', delay: 1, x: '15%', y: '70%' },
    { icon: '🌿', delay: 1.5, x: '80%', y: '75%' },
    { icon: '⭐', delay: 2, x: '50%', y: '10%' },
    { icon: '🎯', delay: 0.8, x: '90%', y: '45%' },
    { icon: '🚀', delay: 1.2, x: '5%', y: '45%' },
  ];

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${scrollY * 0.4}px)`,
        }}
      >
        <img
          src="/images/hero-camp.webp"
          alt={t('auto.attr.hero.kids_camp_activities')}
          className="w-full h-[120%] object-cover"
          onError={(e) => {
            e.currentTarget.src = '/images/fallback-placeholder.png';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/70 via-purple-900/60 to-indigo-900/80" />
      </div>

      {/* Animated mesh gradient overlay */}
      <div className="absolute inset-0 z-0 opacity-40 mesh-gradient" />

      {/* Floating Icons */}
      {floatingIcons.map((item, index) => (
        <div
          key={index}
          className="absolute z-10 text-4xl md:text-5xl animate-float-slow pointer-events-none"
          style={{
            left: item.x,
            top: item.y,
            animationDelay: `${item.delay}s`,
            opacity: 0.8,
          }}
        >
          {item.icon}
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 text-center">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <span className="animate-bounce-slow">🦚</span>
            <span className="text-white/90 text-sm font-medium">{t('maker_space.badge', 'Jigyasu Maker Space')}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {t('maker_space.spark_creativity', 'Spark Creativity.')} {' '}
            <span className="text-gradient bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">{t('maker_space.build_memories', 'Build Memories.')}</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-8">
            {t('maker_space.description', { activitiesCount: totalActivities, defaultValue: 'Experience science and wonder through ' + totalActivities + '+ interactive builds and visual labs. Perfect for ages 2 to 80+.' })}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-orange-500/25 px-8 btn-wonder h-auto py-3"
            >
              <div className="flex items-center gap-2 whitespace-normal break-words text-left">
                <span>{t('maker_space.get_started', 'Get Started')}</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Button>
            <Button
              onClick={onExploreCampWeeks}
              variant="glass"
              size="lg"
              className="px-8 btn-wonder h-auto py-3"
            >
              <div className="flex items-center gap-2 whitespace-normal break-words text-left">
                <span className="shrink-0">📅</span>
                <span>{t('maker_space.explore_weeks', 'Explore Project Weeks')}</span>
              </div>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-8">
            <div className="text-center min-w-[120px] break-words">
              <div className="text-4xl md:text-5xl font-bold text-white mb-1">
                {formatNumber(activitiesCount)}+
              </div>
              <div className="text-white/70 text-sm break-words">{t('maker_space.activities', 'Activities')}</div>
            </div>
            <div className="text-center min-w-[120px] break-words">
              <div className="text-4xl md:text-5xl font-bold text-white mb-1">
                {formatNumber(pillarsCount)}
              </div>
              <div className="text-white/70 text-sm break-words">{t('maker_space.learning_realms', 'Learning Realms')}</div>
            </div>
            <div className="text-center min-w-[120px] break-words">
              <div className="text-4xl md:text-5xl font-bold text-white mb-1">
                <Trans i18nKey="auto.hero.100">100%</Trans>
              </div>
              <div className="text-white/70 text-sm break-words">{t('maker_space.ad_free', 'Ad-Free Fun')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-sm">{t('maker_space.scroll_explore', 'Scroll to explore')}</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-[#FFFBF5] dark:fill-[#1A1A2E]"
          />
        </svg>
      </div>
    </section>
  );
}
