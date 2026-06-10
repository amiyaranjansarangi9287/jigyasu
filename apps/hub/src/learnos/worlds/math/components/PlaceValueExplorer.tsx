import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trans } from "react-i18next";

type Place = 'thousands' | 'hundreds' | 'tens' | 'ones';

const placeMeta: { key: Place; label: string; value: number; color: string; bg: string; emoji: string }[] = [
  { key: 'thousands', label: 'Thousands', value: 1000, color: 'text-purple-300', bg: 'bg-purple-500/25 border-purple-400/50', emoji: '🟪' },
  { key: 'hundreds', label: 'Hundreds', value: 100, color: 'text-blue-300', bg: 'bg-blue-500/25 border-blue-400/50', emoji: '🟦' },
  { key: 'tens', label: 'Tens', value: 10, color: 'text-green-300', bg: 'bg-green-500/25 border-green-400/50', emoji: '🟩' },
  { key: 'ones', label: 'Ones', value: 1, color: 'text-yellow-300', bg: 'bg-yellow-500/25 border-yellow-400/50', emoji: '🟨' },
];

function splitDigits(value: number) {
  return {
    thousands: Math.floor(value / 1000),
    hundreds: Math.floor((value % 1000) / 100),
    tens: Math.floor((value % 100) / 10),
    ones: value % 10,
  };
}

function makeChallenge() {
  const value = Math.floor(Math.random() * 9000) + 1000;
  const places = placeMeta.filter((p) => splitDigits(value)[p.key] > 0);
  const place = places[Math.floor(Math.random() * places.length)] || placeMeta[3];
  const digit = splitDigits(value)[place.key];
  const answer = digit * place.value;
  const wrongs = new Set<number>();
  while (wrongs.size < 3) {
    const candidate = Math.max(0, answer + (Math.floor(Math.random() * 7) - 3) * place.value);
    if (candidate !== answer) wrongs.add(candidate);
  }
  return {
    value,
    place,
    answer,
    options: [answer, ...wrongs].sort(() => Math.random() - 0.5),
  };
}

export default function PlaceValueExplorer() {
  const [value, setValue] = useState(3427);
  const [mode, setMode] = useState<'explore' | 'challenge'>('explore');
  const [challenge, setChallenge] = useState(makeChallenge);
  const [feedback, setFeedback] = useState<'correct' | 'hint' | null>(null);
  const [mastery, setMastery] = useState(0);

  const digits = useMemo(() => splitDigits(value), [value]);
  const expanded = useMemo(
    () => placeMeta
      .map((p) => ({ ...p, digit: digits[p.key], amount: digits[p.key] * p.value }))
      .filter((p) => p.amount > 0),
    [digits],
  );

  const updateDigit = (place: Place, digit: number) => {
    const clamped = Math.max(0, Math.min(9, digit));
    const next = { ...digits, [place]: clamped };
    setValue(next.thousands * 1000 + next.hundreds * 100 + next.tens * 10 + next.ones);
  };

  const answerChallenge = (option: number) => {
    if (feedback) return;
    if (option === challenge.answer) {
      setFeedback('correct');
      setMastery((s) => s + 10);
      setTimeout(() => {
        setChallenge(makeChallenge());
        setFeedback(null);
      }, 1200);
    } else {
      setFeedback('hint');
      setTimeout(() => setFeedback(null), 900);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2"><Trans i18nKey="auto.placevalueexplorer.place_value_explorer">🧱 Place Value Explorer</Trans></h2>
        <p className="text-purple-300 text-lg"><Trans i18nKey="auto.placevalueexplorer.build_numbers_from_thousands_h">Build numbers from thousands, hundreds, tens, and ones.</Trans></p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'explore' ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => setMode('explore')}><Trans i18nKey="auto.placevalueexplorer.explore">🔍 Explore</Trans></button>
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'challenge' ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => { setMode('challenge'); setChallenge(makeChallenge()); }}><Trans i18nKey="auto.placevalueexplorer.challenge">🎯 Challenge</Trans></button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'challenge' ? (
          <motion.div key="challenge" className="max-w-lg mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className={`rounded-3xl p-6 border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'hint' ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between items-center mb-5">
                <span className="text-yellow-400 font-bold">⭐ {mastery}</span>
                <span className="text-sm text-gray-400"><Trans i18nKey="auto.placevalueexplorer.place_value_quiz">Place value quiz</Trans></span>
              </div>
              <p className="text-center text-gray-400 text-sm"><Trans i18nKey="auto.placevalueexplorer.in_the_number">In the number</Trans></p>
              <p className="text-center text-5xl font-bold text-white font-mono my-2">{challenge.value}</p>
              <p className="text-center text-xl font-bold text-white mb-5">
                <Trans i18nKey="auto.placevalueexplorer.what_is_the_value_of_the">What is the value of the</Trans> <span className={challenge.place.color}>{challenge.place.label}</span> <Trans i18nKey="auto.placevalueexplorer.digit">digit?</Trans>
                                            </p>
              <div className="grid grid-cols-2 gap-3">
                {challenge.options.map((option) => (
                  <motion.button key={option} className={`py-3 rounded-xl text-xl font-bold ${feedback === 'correct' && option === challenge.answer ? 'bg-green-500 text-white' : feedback ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`} whileHover={!feedback ? { scale: 1.05 } : {}} whileTap={!feedback ? { scale: 0.95 } : {}} onClick={() => answerChallenge(option)} disabled={!!feedback}>
                    {option.toLocaleString()}
                  </motion.button>
                ))}
              </div>
              {feedback === 'correct' && <p className="text-green-400 font-bold text-center mt-4"><Trans i18nKey="auto.placevalueexplorer.correct">✨ Correct!</Trans> {challenge.answer.toLocaleString()}</p>}
              {feedback === 'hint' && <p className="text-sky-400 font-bold text-center mt-4"><Trans i18nKey="auto.placevalueexplorer.try_again">Let us explore!</Trans></p>}
            </div>
          </motion.div>
        ) : (
          <motion.div key="explore" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                  <label className="text-gray-400 text-sm"><Trans i18nKey="auto.placevalueexplorer.number">Number</Trans></label>
                  <div className="flex items-center gap-3 mt-2">
                    <input type="range" min="0" max="9999" value={value} onChange={(e) => setValue(Number(e.target.value))} className="flex-1 accent-purple-500" />
                    <input type="number" min="0" max="9999" value={value} onChange={(e) => setValue(Math.max(0, Math.min(9999, Number(e.target.value) || 0)))} className="w-24 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white font-bold text-center" />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {placeMeta.map((p) => (
                    <div key={p.key} className={`rounded-2xl p-3 border ${p.bg}`}>
                      <p className="text-sm text-gray-300 text-center mb-2">{p.label}</p>
                      <div className="flex items-center justify-center gap-1">
                        <button className="w-7 h-7 rounded-full bg-black/30 text-white" onClick={() => updateDigit(p.key, digits[p.key] - 1)}>-</button>
                        <motion.span key={digits[p.key]} className="text-3xl font-bold text-white w-8 text-center" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{digits[p.key]}</motion.span>
                        <button className="w-7 h-7 rounded-full bg-black/30 text-white" onClick={() => updateDigit(p.key, digits[p.key] + 1)}>+</button>
                      </div>
                      <p className={`text-center text-sm font-bold mt-2 ${p.color}`}>{(digits[p.key] * p.value).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-5 border border-purple-500/20">
                  <p className="text-gray-400 text-sm mb-1"><Trans i18nKey="auto.placevalueexplorer.expanded_form">Expanded form</Trans></p>
                  <p className="text-2xl font-bold text-white font-mono">
                    {expanded.length ? expanded.map((p) => p.amount.toLocaleString()).join(' + ') : '0'} = <span className="text-purple-300">{value.toLocaleString()}</span>
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    <Trans i18nKey="auto.placevalueexplorer.word_form">Word form:</Trans> {value.toLocaleString()} <Trans i18nKey="auto.placevalueexplorer.has">has</Trans> {digits.thousands} <Trans i18nKey="auto.placevalueexplorer.thousands">thousands,</Trans> {digits.hundreds} <Trans i18nKey="auto.placevalueexplorer.hundreds">hundreds,</Trans> {digits.tens} <Trans i18nKey="auto.placevalueexplorer.tens_and">tens, and</Trans> {digits.ones} <Trans i18nKey="auto.placevalueexplorer.ones">ones.</Trans>
                                                            </p>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <h4 className="text-white font-bold mb-4"><Trans i18nKey="auto.placevalueexplorer.base_10_blocks">🧱 Base-10 Blocks</Trans></h4>
                <div className="space-y-4">
                  {placeMeta.map((p) => (
                    <div key={p.key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className={p.color}>{p.emoji} {p.label}</span>
                        <span className="text-gray-400">{digits[p.key]} × {p.value}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 min-h-8 bg-black/20 rounded-lg p-2">
                        {Array.from({ length: digits[p.key] }).map((_, i) => (
                          <motion.div key={i} className={`border ${p.bg} rounded ${p.key === 'thousands' ? 'w-8 h-8' : p.key === 'hundreds' ? 'w-7 h-7' : p.key === 'tens' ? 'w-5 h-7' : 'w-4 h-4'}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.03 }} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
