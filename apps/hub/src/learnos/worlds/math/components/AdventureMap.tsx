import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useMathFeedback } from '../lib/MathContext';

interface Zone {
  id: string;
  name: string;
  emoji: string;
  x: number;
  y: number;
  color: string;
  bgGradient: string;
  description: string;
  challenge: string;
  answer: number;
  options: number[];
  unlocked: boolean;
}

const initialZones: Zone[] = [
  {
    id: 'addition-forest',
    name: 'Addition Forest',
    emoji: '🌳',
    x: 15,
    y: 60,
    color: '#22c55e',
    bgGradient: 'from-green-500/20 to-emerald-500/20',
    description: 'The magical trees grow by adding their rings together!',
    challenge: '🌳 A tree has 15 rings. It grows 27 more. How many rings total?',
    answer: 42,
    options: [42, 38, 45, 32],
    unlocked: true,
  },
  {
    id: 'subtraction-caves',
    name: 'Subtraction Caves',
    emoji: '🦇',
    x: 38,
    y: 30,
    color: '#a855f7',
    bgGradient: 'from-purple-500/20 to-violet-500/20',
    description: 'Bats leave the cave every night. How many remain?',
    challenge: '🦇 83 bats lived in the cave. 47 flew away. How many are left?',
    answer: 36,
    options: [36, 46, 26, 130],
    unlocked: true,
  },
  {
    id: 'multiply-mountains',
    name: 'Multiply Mountains',
    emoji: '⛰️',
    x: 62,
    y: 55,
    color: '#f97316',
    bgGradient: 'from-orange-500/20 to-amber-500/20',
    description: 'Each mountain peak has groups of magical crystals!',
    challenge: '⛰️ 7 peaks each have 8 crystals. How many crystals in total?',
    answer: 56,
    options: [56, 48, 63, 54],
    unlocked: true,
  },
  {
    id: 'division-desert',
    name: 'Division Desert',
    emoji: '🏜️',
    x: 80,
    y: 25,
    color: '#eab308',
    bgGradient: 'from-yellow-500/20 to-amber-500/20',
    description: 'Share the treasure equally among the desert explorers!',
    challenge: '🏜️ 96 gold coins shared among 8 explorers. How many each?',
    answer: 12,
    options: [12, 10, 14, 8],
    unlocked: true,
  },
  {
    id: 'fraction-falls',
    name: 'Fraction Falls',
    emoji: '🌊',
    x: 50,
    y: 78,
    color: '#3b82f6',
    bgGradient: 'from-blue-500/20 to-cyan-500/20',
    description: 'The waterfall splits into equal streams!',
    challenge: '🌊 What is 1/4 + 1/4 + 1/2 of the waterfall?',
    answer: 1,
    options: [1, 2, 3, 0],
    unlocked: true,
  },
];

const pathPoints = [
  { x: 15, y: 60 },
  { x: 26, y: 45 },
  { x: 38, y: 30 },
  { x: 50, y: 42 },
  { x: 62, y: 55 },
  { x: 71, y: 40 },
  { x: 80, y: 25 },
];

const pathPoints2 = [
  { x: 62, y: 55 },
  { x: 56, y: 67 },
  { x: 50, y: 78 },
];

export default function AdventureMap({ onComplete }: { onComplete: () => void }) {
  const { t } = useTranslation();
  const math = useMathFeedback();
  const [zones] = useState(initialZones);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [answer, setAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [solvedCount, setSolvedCount] = useState(0);
  const [solvedZones, setSolvedZones] = useState<Set<string>>(new Set());
  const [stars, setStars] = useState(0);

  const handleAnswer = (option: number) => {
    if (!selectedZone || solvedZones.has(selectedZone.id)) return;
    setAnswer(option);
    if (option === selectedZone.answer) {
      setFeedback('correct');
      math.correct('adventure-map', 10);
      setSolvedZones(prev => new Set([...prev, selectedZone.id]));
      setSolvedCount(prev => prev + 1);
      setStars(prev => prev + 1);
      setTimeout(() => {
        setSelectedZone(null);
        setFeedback(null);
        setAnswer(null);
        if (solvedCount + 1 >= zones.length) {
          onComplete();
        }
      }, 1500);
    } else {
      setFeedback('wrong');
      math.wrong('adventure-map');
      setTimeout(() => {
        setFeedback(null);
        setAnswer(null);
      }, 1000);
    }
  };

  const generatePathD = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx1 = prev.x + (curr.x - prev.x) * 0.5;
      const cpy1 = prev.y;
      const cpx2 = prev.x + (curr.x - prev.x) * 0.5;
      const cpy2 = curr.y;
      d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
    }
    return d;
  };

  return (
    <div className="relative w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">
          {t('math_modules.AdventureMap.title', '🗺️ Math Kingdom Adventure Map')}
        </h2>
        <p className="text-purple-300 text-lg">{t('math_modules.AdventureMap.subtitle', 'Click on a zone to solve its challenge!')}</p>
        <div className="flex items-center justify-center gap-4 mt-3">
          <span className="text-yellow-400 text-xl">⭐ {stars} / {zones.length}</span>
          <div className="h-3 w-48 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
              animate={{ width: `${(solvedCount / zones.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden border-4 border-purple-500/30 bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-blue-900/60 backdrop-blur-sm">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xl opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {['✨', '🌟', '💫', '⭐'][Math.floor(Math.random() * 4)]}
            </motion.div>
          ))}
        </div>

        {/* SVG Paths */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d={generatePathD(pathPoints)}
            fill="none"
            stroke="rgba(168, 85, 247, 0.4)"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />
          <path
            d={generatePathD(pathPoints2)}
            fill="none"
            stroke="rgba(59, 130, 246, 0.4)"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />
        </svg>

        {/* Zone Nodes */}
        {zones.map((zone, index) => {
          const isSolved = solvedZones.has(zone.id);
          return (
            <motion.button
              key={zone.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
              style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.15, type: 'spring', stiffness: 200 }}
              onClick={() => { setSelectedZone(zone); setAnswer(null); setFeedback(null); }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className={`relative flex flex-col items-center`}>
                <motion.div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-3xl sm:text-4xl border-4 ${
                    isSolved
                      ? 'border-yellow-400 bg-yellow-400/20 shadow-lg shadow-yellow-400/30'
                      : 'border-white/30 bg-white/10'
                  }`}
                  animate={isSolved ? {} : { y: [0, -6, 0] }}
                  transition={{ duration: 2 + index * 0.3, repeat: Infinity }}
                  style={{
                    boxShadow: isSolved ? undefined : `0 0 20px ${zone.color}40`,
                  }}
                >
                  {zone.emoji}
                  {isSolved && (
                    <motion.span
                      className="absolute -top-1 -right-1 text-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring' }}
                    >
                      ⭐
                    </motion.span>
                  )}
                </motion.div>
                <span className="mt-1 text-sm sm:text-sm font-bold text-white bg-black/50 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {t(`math_modules.AdventureMap.zones.${zone.id}.name`, zone.name)}
                </span>
              </div>
            </motion.button>
          );
        })}

        {/* Wizard character */}
        <motion.div
          className="absolute bottom-4 left-4 text-4xl"
          animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          🧙‍♂️
        </motion.div>
        <motion.div
          className="absolute top-4 right-4 text-3xl"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🐉
        </motion.div>
      </div>

      {/* Challenge Modal */}
      <AnimatePresence>
        {selectedZone && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setSelectedZone(null); setFeedback(null); setAnswer(null); }}
          >
            <motion.div
              className={`relative max-w-lg w-full rounded-3xl p-6 sm:p-8 border-2 bg-gradient-to-br ${selectedZone.bgGradient} bg-gray-900/95 backdrop-blur-lg`}
              style={{ borderColor: selectedZone.color }}
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
                onClick={() => { setSelectedZone(null); setFeedback(null); setAnswer(null); }}
              >
                ✕
              </button>

              <div className="text-center">
                <span className="text-5xl">{selectedZone.emoji}</span>
                <h3 className="text-2xl font-bold text-white mt-2">{t(`math_modules.AdventureMap.zones.${selectedZone.id}.name`, selectedZone.name)}</h3>
                <p className="text-purple-300 mt-1 text-sm">{t(`math_modules.AdventureMap.zones.${selectedZone.id}.description`, selectedZone.description)}</p>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white text-lg font-medium text-center">
                  {t(`math_modules.AdventureMap.zones.${selectedZone.id}.challenge`, selectedZone.challenge)}
                </p>
              </div>

              {solvedZones.has(selectedZone.id) ? (
                <motion.div
                  className="mt-6 text-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <span className="text-4xl">🏆</span>
                  <p className="text-yellow-400 font-bold text-lg mt-2">{t('math_modules.AdventureMap.conquered', 'Already Conquered!')}</p>
                  <p className="text-gray-400">{t('math_modules.AdventureMap.answer', 'Answer: {{answer}}', { answer: selectedZone.answer })}</p>
                </motion.div>
              ) : (
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {selectedZone.options.map((option) => (
                    <motion.button
                      key={option}
                      className={`py-3 px-4 rounded-xl text-xl font-bold transition-all ${
                        answer === option && feedback === 'correct'
                          ? 'bg-green-500 text-white ring-4 ring-green-400/50'
                          : answer === option && feedback === 'wrong'
                          ? 'bg-red-500 text-white ring-4 ring-red-400/50'
                          : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-white/40'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAnswer(option)}
                      disabled={feedback !== null}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
              )}

              {feedback === 'correct' && (
                <motion.p
                  className="text-center mt-4 text-green-400 font-bold text-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                >
                  {t('math_modules.AdventureMap.correct', '✨ Brilliant! You\'re a Math Wizard! ✨')}
                </motion.p>
              )}
              {feedback === 'wrong' && (
                <motion.p
                  className="text-center mt-4 text-red-400 font-bold text-lg"
                  initial={{ x: -10 }}
                  animate={{ x: [10, -10, 10, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  {t('math_modules.AdventureMap.wrong', '🤔 Try again, brave explorer!')}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
