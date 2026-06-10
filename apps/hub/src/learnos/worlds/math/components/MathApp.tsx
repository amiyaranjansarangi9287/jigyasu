// src/worlds/math/components/MathApp.tsx
import { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from './Confetti';
import SoundToggle from './shared/SoundToggle';
import { MathProvider, useMathFeedback } from '../lib/MathContext';
import Breadcrumbs from '../../../../components/Breadcrumbs';
import LoadingCharacter from '../../../../components/LoadingCharacter';
import withWonderFirst from '../../../core/modules/withWonderFirst';

// Lazy-load heavy components for code-splitting and wrap with Wonder-First pedagogy
const AdventureMap = lazy(() => import('./AdventureMap'));
const Visualizer3D = lazy(async () => { const m = await import('./Visualizer3D'); return { default: withWonderFirst(m.default, 'math', 'math-visualizer') }; });
const NumberCrunchGame = lazy(async () => { const m = await import('./NumberCrunchGame'); return { default: withWonderFirst(m.default, 'math', 'number-crunch') }; });
const PatternHub = lazy(async () => { const m = await import('./PatternHub'); return { default: withWonderFirst(m.default, 'math', 'pattern-hub') }; });
const SkillsAcademy = lazy(async () => { const m = await import('./SkillsAcademy'); return { default: withWonderFirst(m.default, 'math', 'skills-academy') }; });
const AdvancedHub = lazy(async () => { const m = await import('./AdvancedHub'); return { default: withWonderFirst(m.default, 'math', 'advanced-hub') }; });
const DailyChallenge = lazy(async () => { const m = await import('./DailyChallenge'); return { default: withWonderFirst(m.default, 'math', 'math-daily') }; });
const ExplorersHub = lazy(async () => { const m = await import('./ExplorersHub'); return { default: withWonderFirst(m.default, 'math', 'explorers-hub') }; });
const WorksheetGenerator = lazy(() => import('./shared/WorksheetGenerator'));

type Tab = 'home' | 'map' | 'visualizer' | 'game' | 'pattern' | 'skills' | 'advanced' | 'daily' | 'explorers' | 'worksheet';

const tabs: { id: Tab; label: string; emoji: string; color: string; desc: string }[] = [
  { id: 'home', label: 'Home', emoji: '🏠', color: 'from-purple-500 to-indigo-600', desc: 'Welcome' },
  { id: 'daily', label: 'Daily', emoji: '🎯', color: 'from-yellow-500 to-amber-600', desc: 'Daily challenge' },
  { id: 'explorers', label: 'Explore', emoji: '🧭', color: 'from-violet-500 to-purple-600', desc: 'Visual topics' },
  { id: 'map', label: 'Map', emoji: '🗺️', color: 'from-green-500 to-emerald-600', desc: 'Explore zones' },
  { id: 'visualizer', label: '3D', emoji: '📊', color: 'from-blue-500 to-cyan-600', desc: 'See math in 3D' },
  { id: 'skills', label: 'Skills', emoji: '🎓', color: 'from-rose-500 to-pink-600', desc: 'Build foundations' },
  { id: 'advanced', label: 'Advanced', emoji: '🔥', color: 'from-red-500 to-orange-600', desc: 'Higher level' },
  { id: 'game', label: 'Game', emoji: '🎮', color: 'from-pink-500 to-rose-600', desc: 'Race the clock' },
  { id: 'pattern', label: 'Patterns', emoji: '🧩', color: 'from-amber-500 to-orange-600', desc: 'Find patterns' },
  { id: 'worksheet', label: 'Print', emoji: '📝', color: 'from-gray-500 to-slate-600', desc: 'Worksheets' },
];

function TabContent({ tab, onComplete }: { tab: Tab; onComplete?: () => void }) {
  switch (tab) {
    case 'map': return <AdventureMap onComplete={onComplete || (() => {})} />;
    case 'visualizer': return <Visualizer3D />;
    case 'game': return <NumberCrunchGame />;
    case 'pattern': return <PatternHub />;
    case 'skills': return <SkillsAcademy />;
    case 'advanced': return <AdvancedHub />;
    case 'daily': return <DailyChallenge />;
    case 'explorers': return <ExplorersHub />;
    case 'worksheet': return <WorksheetGenerator />;
    default: return null;
  }
}

function MathAppInner() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showConfetti, setShowConfetti] = useState(false);
  const { totalXP, celebrate } = useMathFeedback();
  const [stars, setStars] = useState(() => {
    try {
      return parseInt(localStorage.getItem('mathkingdom_stars') || '0');
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mathkingdom_stars', String(stars));
    } catch {}
  }, [stars]);

  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      // Swiped right -> prev tab
      const currentIndex = tabs.findIndex(t => t.id === activeTab);
      if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id);
    } else if (info.offset.x < -swipeThreshold) {
      // Swiped left -> next tab
      const currentIndex = tabs.findIndex(t => t.id === activeTab);
      if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const handleMapComplete = () => {
    setShowConfetti(true);
    setStars((prev) => prev + 5);
    celebrate('Adventure Map Complete! ⭐+5');
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const starConfig = useMemo(() => {
    return [...Array(30)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 2 + Math.random() * 4,
      delay: Math.random() * 3,
    }));
  }, []);

  return (
    <div className="min-h-screen relative">
      <Confetti active={showConfetti} />

      {/* Animated background stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {starConfig.map((config, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: config.left,
              top: config.top,
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: config.duration,
              repeat: Infinity,
              delay: config.delay,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 backdrop-blur-md bg-[#0f0b1e]/80">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <motion.span
              className="text-3xl sm:text-4xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🧙‍♂️
            </motion.span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent">
                {t('math.header.title', 'Math Kingdom')}
              </h1>
              <p className="text-sm text-gray-500 hidden sm:block">{t('math.header.subtitle', 'Where numbers come alive! ✨')}</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-2 sm:gap-3">
            <SoundToggle />
            <motion.div
              className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/30 rounded-full px-3 py-1.5"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              title={t('auto.attr.mathapp.experience_points_earned_acros')}
            >
              <span className="text-purple-400 text-sm">⚡</span>
              <span className="text-purple-400 font-bold text-sm">{totalXP}</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-3 py-1.5"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <span className="text-yellow-400 text-sm">⭐</span>
              <span className="text-yellow-400 font-bold text-sm">{stars}</span>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-white/5 backdrop-blur-md bg-[#0f0b1e]/60 overflow-x-auto">
        <div className="max-w-6xl mx-auto px-2 flex">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              className={`relative px-3 sm:px-5 py-3 font-medium text-sm sm:text-base transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ y: -1 }}
              whileTap={{ y: 1 }}
            >
              <span className="text-lg">{tab.emoji}</span>
              <span className="hidden sm:inline">{t(`math.tabs.${tab.id}.label`, tab.label)}</span>
              {activeTab === tab.id && (
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${tab.color}`}
                  layoutId="activeTab"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <motion.main 
        className="relative z-10 max-w-6xl mx-auto px-4 py-8 touch-pan-y"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
      >
        <Breadcrumbs items={[
          { label: t('math.tabs.home.label', 'Home'), href: '/', emoji: '🏠' },
          { label: t('common.app_name', 'LearnOS'), href: '/', emoji: '🧠' },
          { label: t('math.header.title', 'Math Kingdom'), emoji: '🧙‍♂️' },
          ...(activeTab !== 'home' ? [{ label: t(`math.tabs.${activeTab}.label`, tabs.find(t => t.id === activeTab)?.label || 'Module'), emoji: tabs.find(t => t.id === activeTab)?.emoji }] : [])
        ]} />
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <HomePage onNavigate={setActiveTab} />
            </motion.div>
          )}
          {activeTab !== 'home' && (
            <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <Suspense fallback={<LoadingCharacter message={t('math.preparing', 'Preparing your math adventure...')} />}>
                <TabContent tab={activeTab} onComplete={handleMapComplete} />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 border-t border-white/5">
        <p className="text-gray-600 text-sm">{t('math.footer', 'Made with 💜 for math wizards of all levels ✨')}</p>
        <p className="text-gray-700 text-sm mt-1">{t('math.footer_stats', '50+ activities · 350+ challenges · Ages 5–18+')}</p>
      </footer>
    </div>
  );
}

function HomePage({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const { t } = useTranslation();
  const features = [
    { tab: 'daily' as Tab, emoji: '🎯', title: t('math.features.daily.title', 'Daily Challenge'), description: t('math.features.daily.description', 'A fresh challenge every day! Build your streak and sharpen your skills with a new problem each morning!'), color: 'from-yellow-500/20 to-amber-500/20', border: 'border-yellow-500/30', buttonColor: 'from-yellow-600 to-amber-600' },
    { tab: 'explorers' as Tab, emoji: '🧭', title: t('math.features.explorers.title', 'Explorers Guild'), description: t('math.features.explorers.description', '20 visual adventures! From counting coins to chess strategy, sports stats, and engineering math.'), color: 'from-violet-500/20 to-purple-500/20', border: 'border-violet-500/30', buttonColor: 'from-violet-600 to-purple-600' },
    { tab: 'map' as Tab, emoji: '🗺️', title: t('math.features.map.title', 'Adventure Map'), description: t('math.features.map.description', 'Explore the Math Kingdom! Travel through Addition Forest, Subtraction Caves, and more. Solve challenges to earn stars!'), color: 'from-green-500/20 to-emerald-500/20', border: 'border-green-500/30', buttonColor: 'from-green-600 to-emerald-600' },
    { tab: 'visualizer' as Tab, emoji: '📊', title: t('math.features.visualizer.title', '3D Math Visualizer'), description: t('math.features.visualizer.description', 'See numbers come alive! Watch addition build towers, multiplication create grids, and division split groups — all in 3D!'), color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30', buttonColor: 'from-blue-600 to-cyan-600' },
    { tab: 'skills' as Tab, emoji: '🎓', title: t('math.features.skills.title', 'Skills Academy'), description: t('math.features.skills.description', 'Build core math foundations! Master times tables, grow number bonds, and explore fractions with pizza!'), color: 'from-rose-500/20 to-pink-500/20', border: 'border-rose-500/30', buttonColor: 'from-rose-600 to-pink-600' },
    { tab: 'advanced' as Tab, emoji: '🔥', title: t('math.features.advanced.title', 'Advanced Math'), description: t('math.features.advanced.description', 'Algebra, trig, vectors, matrices, logs, calculus, complex numbers, statistics, probability — plus SAT/ACT practice and Math Olympiad!'), color: 'from-red-500/20 to-orange-500/20', border: 'border-red-500/30', buttonColor: 'from-red-600 to-orange-600' },
    { tab: 'game' as Tab, emoji: '🎮', title: t('math.features.game.title', 'Number Crunch Quest'), description: t('math.features.game.description', 'Race against the clock! Solve math puzzles as fast as you can. Build combos and reach legendary wizard status!'), color: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/30', buttonColor: 'from-pink-600 to-rose-600' },
    { tab: 'pattern' as Tab, emoji: '🧩', title: t('math.features.pattern.title', 'Patterns & Memory'), description: t('math.features.pattern.description', 'Discover hidden patterns in number sequences — each type has a whimsical theme! Also play Memory Match to train your mind!'), color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30', buttonColor: 'from-amber-600 to-orange-600' },
  ];

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="text-center py-8 sm:py-12 relative">
        <div className="absolute inset-0 -z-10 rounded-3xl overflow-hidden opacity-15">
          <img src="/images/math-kingdom-hero.webp" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0f0b1e]" />
        </div>
        <motion.div className="inline-block" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
          <div className="flex items-center justify-center gap-3 text-5xl sm:text-7xl mb-4">
            <motion.span animate={{ y: [0, -15, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }}>🧙‍♂️</motion.span>
            <motion.span animate={{ y: [0, -15, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}>🐉</motion.span>
            <motion.span animate={{ y: [0, -15, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}>🦄</motion.span>
            <motion.span animate={{ y: [0, -15, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}>🏰</motion.span>
          </div>
        </motion.div>

        <motion.h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 via-amber-400 to-green-400 bg-clip-text text-transparent">{t('math.title_part1', 'Welcome to the')}</span>
          <br />
          <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">{t('math.title_part2', 'Math Kingdom!')}</span>
        </motion.h2>

        <motion.p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          {t('math.subtitle', 'A whimsical world where numbers dance, patterns hide, and every math problem is an adventure waiting to be solved! 🌟')}
        </motion.p>

        <motion.div className="flex justify-center gap-4 sm:gap-8 mt-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          {[
            { label: t('math.stats.activities', 'Activities'), value: '50+', emoji: '🎯' },
            { label: t('math.stats.challenges', 'Challenges'), value: '350+', emoji: '⚔️' },
            { label: t('math.stats.fun_level', 'Fun Level'), value: '∞', emoji: '🎉' },
          ].map((stat) => (
            <div key={stat.label} className="backdrop-blur-md bg-white/5 rounded-xl px-4 py-3 border border-white/10">
              <span className="text-2xl">{stat.emoji}</span>
              <p className="text-white font-bold text-lg">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.tab}
            className={`relative overflow-hidden rounded-2xl border ${feature.border} bg-gradient-to-br ${feature.color} backdrop-blur-sm p-5 sm:p-6 group cursor-pointer`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.08 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate(feature.tab)}
          >
            <div className="flex flex-col h-full relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <motion.span className="text-4xl sm:text-5xl" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}>
                  {feature.emoji}
                </motion.span>
                <h3 className="text-lg sm:text-xl font-bold text-white">{feature.title}</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4 flex-1 leading-relaxed">{feature.description}</p>
              <motion.button
                className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${feature.buttonColor} text-white font-bold text-sm shadow-lg transition-shadow hover:shadow-xl`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {t('math.start_exploring', 'Start Exploring →')}
              </motion.button>
            </div>

            <motion.div className="absolute -top-6 -right-6 text-7xl opacity-[0.06] group-hover:opacity-[0.14] transition-opacity" animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}>
              {feature.emoji}
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Fun math facts */}
      <motion.div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 rounded-2xl border border-purple-500/20 p-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <h3 className="text-lg font-bold text-white mb-3">{t('math.did_you_know', '✨ Did You Know?')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <span className="text-3xl">🔢</span>
            <p className="text-sm text-gray-300 mt-2" dangerouslySetInnerHTML={{ __html: t('math.facts.fact1', '<strong class="text-white">111,111,111 × 111,111,111</strong> = 12,345,678,987,654,321 — a perfect palindrome!') }} />
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <span className="text-3xl">🍕</span>
            <p className="text-sm text-gray-300 mt-2" dangerouslySetInnerHTML={{ __html: t('math.facts.fact2', 'A pizza that has radius <strong class="text-white">"z"</strong> and height <strong class="text-white">"a"</strong> has volume = Pi × z × z × a') }} />
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <span className="text-3xl">♾️</span>
            <p className="text-sm text-gray-300 mt-2" dangerouslySetInnerHTML={{ __html: t('math.facts.fact3', 'The word <strong class="text-white">"hundred"</strong> comes from the old Norse word <strong class="text-white">"hundrath"</strong> meaning 120!') }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function MathApp() {
    const { t } = useTranslation();
  return (
    <MathProvider>
      <MathAppInner />
    </MathProvider>
  );
}
