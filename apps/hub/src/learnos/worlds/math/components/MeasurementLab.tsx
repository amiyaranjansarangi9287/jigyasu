import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trans } from "react-i18next";

type Category = 'length' | 'weight' | 'volume';

interface ConversionUnit { name: string; short: string; factor: number; emoji: string }

const units: Record<Category, ConversionUnit[]> = {
  length: [
    { name: 'Millimeters', short: 'mm', factor: 1, emoji: '📍' },
    { name: 'Centimeters', short: 'cm', factor: 10, emoji: '📏' },
    { name: 'Meters', short: 'm', factor: 1000, emoji: '🏃' },
    { name: 'Kilometers', short: 'km', factor: 1_000_000, emoji: '🚗' },
    { name: 'Inches', short: 'in', factor: 25.4, emoji: '📐' },
    { name: 'Feet', short: 'ft', factor: 304.8, emoji: '🦶' },
    { name: 'Yards', short: 'yd', factor: 914.4, emoji: '🏈' },
    { name: 'Miles', short: 'mi', factor: 1_609_344, emoji: '🛣️' },
  ],
  weight: [
    { name: 'Milligrams', short: 'mg', factor: 1, emoji: '🧂' },
    { name: 'Grams', short: 'g', factor: 1000, emoji: '🍬' },
    { name: 'Kilograms', short: 'kg', factor: 1_000_000, emoji: '🏋️' },
    { name: 'Ounces', short: 'oz', factor: 28349.5, emoji: '📦' },
    { name: 'Pounds', short: 'lb', factor: 453592, emoji: '🎳' },
  ],
  volume: [
    { name: 'Milliliters', short: 'mL', factor: 1, emoji: '💧' },
    { name: 'Liters', short: 'L', factor: 1000, emoji: '🧴' },
    { name: 'Cups', short: 'cup', factor: 236.588, emoji: '☕' },
    { name: 'Pints', short: 'pt', factor: 473.176, emoji: '🍺' },
    { name: 'Quarts', short: 'qt', factor: 946.353, emoji: '🥛' },
    { name: 'Gallons', short: 'gal', factor: 3785.41, emoji: '🪣' },
  ],
};

function makeChallenge(cat: Category) {
  const list = units[cat];
  const fromU = list[Math.floor(Math.random() * list.length)];
  let toU = fromU;
  while (toU === fromU) toU = list[Math.floor(Math.random() * list.length)];
  const value = Math.round((Math.random() * 50 + 1) * 10) / 10;
  const answer = Math.round((value * fromU.factor / toU.factor) * 100) / 100;
  const wrongs = new Set<number>();
  while (wrongs.size < 3) {
    const w = Math.round((answer * (0.3 + Math.random() * 1.8)) * 100) / 100;
    if (w !== answer && w > 0) wrongs.add(w);
  }
  return { value, fromU, toU, answer, options: [answer, ...wrongs].sort(() => Math.random() - 0.5) };
}

export default function MeasurementLab() {
  const [category, setCategory] = useState<Category>('length');
  const [inputVal, setInputVal] = useState(1);
  const [fromIdx, setFromIdx] = useState(2);
  const [mode, setMode] = useState<'explore' | 'challenge'>('explore');
  const [challenge, setChallenge] = useState(() => makeChallenge('length'));
  const [feedback, setFeedback] = useState<'correct' | 'hint' | null>(null);
  const [mastery, setMastery] = useState(0);

  const list = units[category];
  const fromUnit = list[fromIdx] || list[0];

  const converted = useMemo(() =>
    list.map(u => ({
      ...u,
      result: Math.round((inputVal * fromUnit.factor / u.factor) * 10000) / 10000,
    })),
    [inputVal, fromUnit, list],
  );

  const cats: { id: Category; emoji: string; label: string }[] = [
    { id: 'length', emoji: '📏', label: 'Length' },
    { id: 'weight', emoji: '⚖️', label: 'Weight' },
    { id: 'volume', emoji: '🧪', label: 'Volume' },
  ];

  const answerChallenge = (opt: number) => {
    if (feedback) return;
    if (opt === challenge.answer) {
      setFeedback('correct');
      setMastery(m => m + 1);
      setTimeout(() => { setChallenge(makeChallenge(category)); setFeedback(null); }, 1200);
    } else {
      setFeedback('hint');
      setTimeout(() => setFeedback(null), 900);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2"><Trans i18nKey="auto.measurementlab.measurement_lab">📏 Measurement Lab</Trans></h2>
        <p className="text-purple-300 text-lg"><Trans i18nKey="auto.measurementlab.convert_between_units_of_lengt">Convert between units of length, weight, and volume!</Trans></p>
      </div>

      <div className="flex justify-center gap-2 mb-4">
        {cats.map(c => (
          <button key={c.id} className={`px-4 py-2 rounded-xl font-bold text-sm ${category === c.id ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50' : 'bg-white/5 text-gray-400'}`}
            onClick={() => { setCategory(c.id); setFromIdx(Math.min(fromIdx, units[c.id].length - 1)); }}>{c.emoji} {c.label}</button>
        ))}
      </div>
      <div className="flex justify-center gap-2 mb-6">
        <button className={`px-4 py-2 rounded-xl text-sm font-bold ${mode === 'explore' ? 'bg-green-500/30 text-green-300 border border-green-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => setMode('explore')}><Trans i18nKey="auto.measurementlab.explore">🔍 Explore</Trans></button>
        <button className={`px-4 py-2 rounded-xl text-sm font-bold ${mode === 'challenge' ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => { setMode('challenge'); setChallenge(makeChallenge(category)); }}><Trans i18nKey="auto.measurementlab.challenge">🎯 Challenge</Trans></button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'challenge' ? (
          <motion.div key="ch" className="max-w-lg mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className={`rounded-3xl p-6 border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'hint' ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between mb-4"><span className="text-yellow-400 font-bold">⭐ {mastery}</span></div>
              <p className="text-2xl font-bold text-white text-center mb-5">
                {challenge.value} {challenge.fromU.short} = ? {challenge.toU.short}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {challenge.options.map(opt => (
                  <motion.button key={opt} className={`py-3 rounded-xl text-lg font-bold ${feedback === 'correct' && opt === challenge.answer ? 'bg-green-500 text-white' : feedback ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`} whileHover={!feedback ? { scale: 1.05 } : {}} whileTap={!feedback ? { scale: 0.95 } : {}} onClick={() => answerChallenge(opt)} disabled={!!feedback}>
                    {opt} {challenge.toU.short}
                  </motion.button>
                ))}
              </div>
              {feedback === 'correct' && <p className="text-green-400 font-bold text-center mt-4"><Trans i18nKey="auto.measurementlab.correct">✅ Correct!</Trans></p>}
              {feedback === 'hint' && <p className="text-sky-400 font-bold text-center mt-4"><Trans i18nKey="auto.measurementlab.answer">Answer:</Trans> {challenge.answer} {challenge.toU.short}</p>}
            </div>
          </motion.div>
        ) : (
          <motion.div key="ex" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 mb-4 max-w-lg mx-auto">
              <div className="flex items-center gap-3 mb-3">
                <input type="number" value={inputVal} onChange={e => setInputVal(Math.max(0, Number(e.target.value)))}
                  className="w-24 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white font-bold text-center focus:outline-none" />
                <select value={fromIdx} onChange={e => setFromIdx(Number(e.target.value))}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
                  {list.map((u, i) => <option key={u.short} value={i}>{u.emoji} {u.name} ({u.short})</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {converted.map(u => (
                <motion.div key={u.short}
                  className={`bg-white/5 rounded-xl p-4 border border-white/10 text-center ${u.short === fromUnit.short ? 'ring-2 ring-purple-400' : ''}`}
                  initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                  <span className="text-2xl">{u.emoji}</span>
                  <motion.p key={u.result} className="text-xl font-bold text-white mt-1" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                    {u.result < 0.01 ? u.result.toExponential(2) : u.result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                  </motion.p>
                  <p className="text-gray-400 text-sm">{u.name} ({u.short})</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
