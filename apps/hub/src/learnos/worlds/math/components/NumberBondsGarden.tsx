import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function NumberBondsGarden() {
  const { t } = useTranslation();
  const [target, setTarget] = useState(10);
  const [selectedNum, setSelectedNum] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState<'match' | 'explore'>('explore');

  const pairs = useMemo(() => {
    const result: { a: number; b: number }[] = [];
    for (let i = 0; i <= target; i++) {
      result.push({ a: i, b: target - i });
    }
    return result;
  }, [target]);

  const leftNumbers = useMemo(() => pairs.map((p) => p.a).sort(() => Math.random() - 0.5), [pairs]);
  const rightNumbers = useMemo(() => pairs.map((p) => p.b).sort(() => Math.random() - 0.5), [pairs]);

  const handleLeftClick = (num: number) => {
    if (selectedNum === null) {
      setSelectedNum(num);
    }
  };

  const handleRightClick = (num: number) => {
    if (selectedNum === null) return;
    const pairKey = `${selectedNum}-${num}`;
    if (selectedNum + num === target) {
      setMatchedPairs((prev) => new Set([...prev, pairKey, `${num}-${selectedNum}`]));
      setScore((s) => s + 1);
      setSelectedNum(null);
    } else {
      setWrongPair(pairKey);
      setTimeout(() => setWrongPair(null), 600);
      setSelectedNum(null);
    }
  };

  const resetGarden = () => {
    setMatchedPairs(new Set());
    setSelectedNum(null);
    setWrongPair(null);
  };

  const flowerEmojis = ['🌸', '🌺', '🌻', '🌷', '🌹', '💐', '🌼', '🏵️'];
  const getFlower = (n: number) => flowerEmojis[n % flowerEmojis.length];

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">{t('math_modules.NumberBondsGarden.title', '🌻 Number Bonds Garden')}</h2>
        <p className="text-purple-300 text-lg">{t('math_modules.NumberBondsGarden.subtitle', 'Grow flowers by pairing numbers that add up to the target!')}</p>
      </div>

      {/* Target selector */}
      <div className="bg-white/5 rounded-2xl border border-white/10 p-4 mb-6">
        <p className="text-gray-400 text-sm mb-2 text-center">{t('math_modules.NumberBondsGarden.targetSum', 'Target Sum')}</p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {[5, 10, 15, 20].map((t) => (
            <motion.button
              key={t}
              className={`px-5 py-3 rounded-xl font-bold text-lg transition-all ${
                target === t
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30'
                  : 'bg-white/10 text-gray-400 hover:bg-white/20'
              }`}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setTarget(t); resetGarden(); }}
            >
              🎯 {t}
            </motion.button>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-3">
          <button
            className={`px-3 py-1 rounded-lg text-sm ${mode === 'explore' ? 'bg-green-500/30 text-green-300' : 'text-gray-400'}`}
            onClick={() => setMode('explore')}
          >
            {t('math_modules.NumberBondsGarden.exploreMode', '🔍 Explore')}
          </button>
          <button
            className={`px-3 py-1 rounded-lg text-sm ${mode === 'match' ? 'bg-purple-500/30 text-purple-300' : 'text-gray-400'}`}
            onClick={() => setMode('match')}
          >
            {t('math_modules.NumberBondsGarden.matchMode', '🎮 Match')}
          </button>
          <button
            className="px-3 py-1 rounded-lg text-sm text-gray-400 hover:text-white"
            onClick={resetGarden}
          >
            {t('math_modules.NumberBondsGarden.reset', '🔄 Reset')}
          </button>
        </div>
      </div>

      {/* Explore Mode - Visual number bonds */}
      {mode === 'explore' && (
        <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-3xl border border-green-500/30 p-6">
          <h3 className="text-center text-white font-bold mb-4">{t('math_modules.NumberBondsGarden.allBonds', '🌱 All bonds that make {{target}}', { target })}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pairs.map((pair, i) => (
              <motion.div
                key={i}
                className="bg-white/5 rounded-xl p-3 flex items-center justify-between border border-white/10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center gap-2">
                  <motion.span
                    className="text-2xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  >
                    {getFlower(i)}
                  </motion.span>
                  <span className="text-lg font-bold text-white">
                    <span className="text-blue-400">{pair.a}</span>
                    <span className="text-purple-400 mx-1">+</span>
                    <span className="text-orange-400">{pair.b}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">=</span>
                  <span className="text-green-400 font-bold text-xl">{target}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Visual representation */}
          <div className="mt-6 p-4 rounded-xl bg-black/20 border border-white/10">
            <p className="text-center text-gray-400 text-sm mb-3">{t('math_modules.NumberBondsGarden.visualDots', '📊 Visual: Making {{target}} with dots', { target })}</p>
            <div className="space-y-2">
              {pairs.slice(0, Math.min(6, pairs.length)).map((pair, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 w-8">{pair.a}+{pair.b}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: pair.a }).map((_, j) => (
                      <motion.div
                        key={j}
                        className="w-3 h-3 rounded-full bg-blue-500"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1 + j * 0.02 }}
                      />
                    ))}
                    {Array.from({ length: pair.b }).map((_, j) => (
                      <motion.div
                        key={j}
                        className="w-3 h-3 rounded-full bg-orange-500"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1 + (pair.a + j) * 0.02 }}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-green-400">= {target}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Match Mode - Interactive pairing */}
      {mode === 'match' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="bg-white/5 px-3 py-1.5 rounded-lg text-yellow-400 font-bold text-sm">
              {t('math_modules.NumberBondsGarden.matchedScore', '🌸 Matched: {{score}}', { score })}
            </span>
            <span className="text-gray-400 text-sm" dangerouslySetInnerHTML={{ __html: t('math_modules.NumberBondsGarden.pickInstruction', 'Pick one from each side that adds up to <span className="text-green-400 font-bold">{{target}}</span>', { target }) }}>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Left column */}
            <div className="space-y-2">
              <p className="text-center text-gray-400 text-sm mb-2">{t('math_modules.NumberBondsGarden.pickNumber', '🔵 Pick a number')}</p>
              {leftNumbers.map((num, i) => {
                const isMatched = Array.from(matchedPairs).some((p) => p.startsWith(`${num}-`));
                const isSelected = selectedNum === num;
                return (
                  <motion.button
                    key={`left-${i}`}
                    className={`w-full py-3 rounded-xl font-bold text-xl transition-all ${
                      isMatched
                        ? 'bg-green-500/20 text-green-300 border-2 border-green-500/50 opacity-50'
                        : isSelected
                        ? 'bg-blue-500/40 text-white border-2 border-blue-400 shadow-lg shadow-blue-500/30'
                        : 'bg-white/10 text-white border-2 border-white/20 hover:border-blue-400/50'
                    }`}
                    whileHover={!isMatched ? { scale: 1.05 } : {}}
                    whileTap={!isMatched ? { scale: 0.95 } : {}}
                    onClick={() => handleLeftClick(num)}
                    disabled={isMatched}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {isMatched ? '🌸' : '🔵'} {num}
                  </motion.button>
                );
              })}
            </div>

            {/* Right column */}
            <div className="space-y-2">
              <p className="text-center text-gray-400 text-sm mb-2">{t('math_modules.NumberBondsGarden.matchIt', '🟠 Match it')}</p>
              {rightNumbers.map((num, i) => {
                const isMatched = Array.from(matchedPairs).some((p) => p.endsWith(`-${num}`));
                const isWrong = wrongPair && wrongPair.endsWith(`-${num}`);
                return (
                  <motion.button
                    key={`right-${i}`}
                    className={`w-full py-3 rounded-xl font-bold text-xl transition-all ${
                      isMatched
                        ? 'bg-green-500/20 text-green-300 border-2 border-green-500/50 opacity-50'
                        : isWrong
                        ? 'bg-red-500/40 text-white border-2 border-red-400 animate-shake'
                        : 'bg-white/10 text-white border-2 border-white/20 hover:border-orange-400/50'
                    }`}
                    whileHover={!isMatched ? { scale: 1.05 } : {}}
                    whileTap={!isMatched ? { scale: 0.95 } : {}}
                    onClick={() => handleRightClick(num)}
                    disabled={isMatched}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {isMatched ? '🌸' : '🟠'} {num}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {matchedPairs.size / 2 >= pairs.length && (
            <motion.div
              className="mt-6 text-center p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/40"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <span className="text-4xl">🌸</span>
              <p className="text-green-400 font-bold text-xl mt-2">{t('math_modules.NumberBondsGarden.gardenComplete', 'Garden Complete!')}</p>
              <p className="text-gray-400 text-sm">{t('math_modules.NumberBondsGarden.grewAll', 'You grew all the flowers!')}</p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
