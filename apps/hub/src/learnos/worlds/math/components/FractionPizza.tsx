import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { sfx } from '../lib/soundEngine';

export default function FractionPizza() {
  const { t } = useTranslation();
  const [slices, setSlices] = useState(8);
  const [eaten, setEaten] = useState<Set<number>>(new Set());
  const [mode, setMode] = useState<'explore' | 'challenge'>('explore');
  const [challenge, setChallenge] = useState<{ numerator: number; denominator: number } | null>(null);
  const [challengeFeedback, setChallengeFeedback] = useState<'correct' | 'hint' | null>(null);
  const [mastery, setMastery] = useState(0);

  const remaining = slices - eaten.size;
  const fraction = eaten.size > 0 ? `${eaten.size}/${slices}` : '0';
  const remainingFraction = remaining > 0 ? `${remaining}/${slices}` : '0';
  const percentage = Math.round((eaten.size / slices) * 100);

  const toggleSlice = (index: number) => {
    const newEaten = new Set(eaten);
    if (newEaten.has(index)) {
      newEaten.delete(index);
    } else {
      newEaten.add(index);
    }
    setEaten(newEaten);

    if (challenge && mode === 'challenge') {
      const target = challenge.numerator;
      if (newEaten.size === target && slices === challenge.denominator) {
        setChallengeFeedback('correct');
        sfx.correct();
        setMastery((s) => s + 1);
        setTimeout(() => {
          generateChallenge();
          setChallengeFeedback(null);
        }, 1200);
      } else if (newEaten.size > target) {
        setChallengeFeedback('hint');
        sfx.wrong();
        setTimeout(() => setChallengeFeedback(null), 800);
      }
    }
  };

  const generateChallenge = () => {
    const denominators = [2, 3, 4, 6, 8, 10, 12];
    const denominator = denominators[Math.floor(Math.random() * denominators.length)];
    const numerator = Math.floor(Math.random() * (denominator - 1)) + 1;
    setChallenge({ numerator, denominator });
    setSlices(denominator);
    setEaten(new Set());
    setChallengeFeedback(null);
  };

  const startChallenge = () => {
    setMode('challenge');
    generateChallenge();
  };

  const resetPizza = () => {
    setEaten(new Set());
    setChallengeFeedback(null);
  };

  const getSlicePath = (index: number, total: number, radius: number) => {
    const angle = (2 * Math.PI) / total;
    const startAngle = index * angle - Math.PI / 2;
    const endAngle = startAngle + angle;
    const x1 = Math.cos(startAngle) * radius;
    const y1 = Math.sin(startAngle) * radius;
    const x2 = Math.cos(endAngle) * radius;
    const y2 = Math.sin(endAngle) * radius;
    const largeArc = angle > Math.PI ? 1 : 0;
    return `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const pizzaSize = 280;
  const radius = pizzaSize / 2 - 10;

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">{t('math_modules.FractionPizza.title', '🍕 Fraction Pizza Party')}</h2>
        <p className="text-purple-300 text-lg">{t('math_modules.FractionPizza.subtitle', 'Learn fractions by eating pizza slices!')}</p>
      </div>

      {/* Mode toggle */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-white/5 rounded-2xl p-1 border border-white/10">
          <button
            className={`px-4 sm:px-6 py-2 rounded-xl font-medium text-sm ${
              mode === 'explore' ? 'bg-orange-500/30 text-orange-300' : 'text-gray-400'
            }`}
            onClick={() => { setMode('explore'); setChallenge(null); resetPizza(); }}
          >
            🔍 {t('math_modules.FractionPizza.explore', 'Explore')}
          </button>
          <button
            className={`px-4 sm:px-6 py-2 rounded-xl font-medium text-sm ${
              mode === 'challenge' ? 'bg-purple-500/30 text-purple-300' : 'text-gray-400'
            }`}
            onClick={startChallenge}
          >
            🎯 {t('math_modules.FractionPizza.challenge', 'Challenge')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pizza visualization */}
        <div className="flex flex-col items-center">
          <div className="relative" style={{ width: pizzaSize, height: pizzaSize }}>
            <svg width={pizzaSize} height={pizzaSize} className="drop-shadow-2xl">
              {/* Pizza base */}
              <circle cx={pizzaSize / 2} cy={pizzaSize / 2} r={radius} fill="#fbbf24" />
              <circle cx={pizzaSize / 2} cy={pizzaSize / 2} r={radius - 8} fill="#fde68a" />
              
              {/* Slices */}
              <g transform={`translate(${pizzaSize / 2}, ${pizzaSize / 2})`}>
                {Array.from({ length: slices }).map((_, i) => {
                  const isEaten = eaten.has(i);
                  return (
                    <motion.g
                      key={i}
                      onClick={() => toggleSlice(i)}
                      style={{ cursor: 'pointer' }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <path
                        d={getSlicePath(i, slices, radius - 8)}
                        fill={isEaten ? 'rgba(0,0,0,0.1)' : '#f59e0b'}
                        stroke="#92400e"
                        strokeWidth="2"
                      />
                      {!isEaten && (
                        <>
                          {/* Toppings */}
                          <circle cx={Math.cos((i + 0.5) * (2 * Math.PI / slices) - Math.PI / 2) * radius * 0.5}
                                  cy={Math.sin((i + 0.5) * (2 * Math.PI / slices) - Math.PI / 2) * radius * 0.5}
                                  r="4" fill="#dc2626" />
                          <circle cx={Math.cos((i + 0.3) * (2 * Math.PI / slices) - Math.PI / 2) * radius * 0.7}
                                  cy={Math.sin((i + 0.3) * (2 * Math.PI / slices) - Math.PI / 2) * radius * 0.7}
                                  r="3" fill="#16a34a" />
                        </>
                      )}
                      {isEaten && (
                        <text
                          x={Math.cos((i + 0.5) * (2 * Math.PI / slices) - Math.PI / 2) * radius * 0.5}
                          y={Math.sin((i + 0.5) * (2 * Math.PI / slices) - Math.PI / 2) * radius * 0.5}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="20"
                        >
                          🍽️
                        </text>
                      )}
                    </motion.g>
                  );
                })}
              </g>

              {/* Slice dividers */}
              <g transform={`translate(${pizzaSize / 2}, ${pizzaSize / 2})`}>
                {Array.from({ length: slices }).map((_, i) => {
                  const angle = (i * 2 * Math.PI) / slices - Math.PI / 2;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  return (
                    <line
                      key={i}
                      x1="0"
                      y1="0"
                      x2={x}
                      y2={y}
                      stroke="#92400e"
                      strokeWidth="2"
                      pointerEvents="none"
                    />
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Slice selector */}
          <div className="mt-4 bg-white/5 rounded-2xl p-4 border border-white/10 w-full max-w-xs">
            <p className="text-gray-400 text-sm mb-2 text-center">{t('math_modules.FractionPizza.numSlices', 'Number of slices')}</p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {[2, 3, 4, 6, 8, 10, 12].map((s) => (
                <motion.button
                  key={s}
                  className={`px-3 py-2 rounded-lg font-bold ${
                    slices === s
                      ? 'bg-orange-500 text-white'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setSlices(s); resetPizza(); }}
                  disabled={mode === 'challenge'}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Fraction display */}
        <div className="space-y-4">
          {mode === 'challenge' && challenge && (
            <motion.div
              className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 rounded-2xl border border-purple-500/30 p-4"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <p className="text-gray-400 text-sm mb-2">{t('math_modules.FractionPizza.challengeLabel', 'Challenge:')}</p>
              <p className="text-2xl font-bold text-white text-center">
                <Trans i18nKey="math_modules.FractionPizza.eatSlices" values={{ num: challenge.numerator, den: challenge.denominator }}>
                  <Trans i18nKey="auto.fractionpizza.eat">Eat</Trans> <span className="text-sky-400">{challenge.numerator}</span> <Trans i18nKey="auto.fractionpizza.out_of">out of</Trans> <span className="text-blue-400">{challenge.denominator}</span> <Trans i18nKey="auto.fractionpizza.slices">slices</Trans>
                                                  </Trans>
              </p>
              <p className="text-center text-purple-300 text-lg mt-2">
                = <span className="font-bold">{challenge.numerator}/{challenge.denominator}</span>
              </p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-yellow-400 font-bold">⭐ {mastery}</span>
                {challengeFeedback === 'correct' && (
                  <motion.span
                    className="text-green-400 font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.3, 1] }}
                  >
                    ✨ {t('math_modules.FractionPizza.correct', 'Correct!')}
                  </motion.span>
                )}
                {challengeFeedback === 'hint' && (
                  <motion.span
                    className="text-sky-400 font-bold"
                    initial={{ x: -10 }}
                    animate={{ x: [10, -10, 5, 0] }}
                  >
                    {t('math_modules.FractionPizza.tooMany', '🤔 Too many!')}
                  </motion.span>
                )}
              </div>
            </motion.div>
          )}

          <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-2xl border border-orange-500/30 p-6">
            <h3 className="text-white font-bold mb-4">{t('math_modules.FractionPizza.breakdown', '📊 Fraction Breakdown')}</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">{t('math_modules.FractionPizza.eaten', 'Eaten:')}</span>
                <span className="text-2xl font-bold text-sky-400">{fraction}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">{t('math_modules.FractionPizza.remaining', 'Remaining:')}</span>
                <span className="text-2xl font-bold text-green-400">{remainingFraction}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">{t('math_modules.FractionPizza.percentage', 'Percentage:')}</span>
                <span className="text-2xl font-bold text-blue-400">{percentage}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">{t('math_modules.FractionPizza.decimal', 'Decimal:')}</span>
                <span className="text-2xl font-bold text-purple-400">{(eaten.size / slices).toFixed(2)}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="h-4 w-full bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span><Trans i18nKey="auto.fractionpizza.0">0%</Trans></span>
                <span><Trans i18nKey="auto.fractionpizza.50">50%</Trans></span>
                <span><Trans i18nKey="auto.fractionpizza.100">100%</Trans></span>
              </div>
            </div>
          </div>

          {/* Equivalent fractions */}
          {eaten.size > 0 && (
            <motion.div
              className="bg-white/5 rounded-2xl border border-white/10 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4 className="text-white font-bold mb-2">{t('math_modules.FractionPizza.equivFractions', '🔄 Equivalent Fractions')}</h4>
              <div className="flex flex-wrap gap-2">
                {[2, 3, 4, 5].map((multiplier) => {
                  const num = eaten.size * multiplier;
                  const denom = slices * multiplier;
                  if (denom > 20) return null;
                  return (
                    <span
                      key={multiplier}
                      className="px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 text-sm font-mono"
                    >
                      {num}/{denom}
                    </span>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Fun facts */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-xl border border-yellow-500/20 p-3">
            <p className="text-sm text-yellow-300">
              <span dangerouslySetInnerHTML={{ __html: t('math_modules.FractionPizza.funFact', '💡 <strong>Fun fact:</strong>') }} />{' '}
              {eaten.size === 0 ? t('math_modules.FractionPizza.factStart', "Click slices to eat them!") : 
                eaten.size === slices ? t('math_modules.FractionPizza.factWhole', "You ate the whole pizza! 🎉") :
                eaten.size === 1 ? t('math_modules.FractionPizza.factUnit', "One slice is called a 'unit fraction'") :
                eaten.size * 2 === slices ? t('math_modules.FractionPizza.factHalf', "You ate exactly half!") :
                t('math_modules.FractionPizza.factDefault', "Fractions show parts of a whole")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
