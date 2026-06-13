import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trans } from "react-i18next";
import { useTranslation } from 'react-i18next';

function makeChallenge() {
  const type = Math.floor(Math.random() * 4);
  let question: string, answer: number;
  const r2 = () => Math.round((Math.random() * 9 + 0.5) * 100) / 100;
  if (type === 0) { const a = r2(); const b = r2(); answer = Math.round((a + b) * 100) / 100; question = `${a} + ${b}`; }
  else if (type === 1) { const a = r2() + 5; const b = r2(); answer = Math.round((a - b) * 100) / 100; question = `${a.toFixed(2)} - ${b.toFixed(2)}`; }
  else if (type === 2) { const a = Math.round((Math.random() * 5 + 1) * 10) / 10; const b = Math.round((Math.random() * 5 + 1) * 10) / 10; answer = Math.round(a * b * 100) / 100; question = `${a} × ${b}`; }
  else { const b = [0.2, 0.25, 0.5, 2, 4, 5][Math.floor(Math.random() * 6)]; const ans = Math.floor(Math.random() * 8) + 2; answer = ans; const a = Math.round(b * ans * 100) / 100; question = `${a} ÷ ${b}`; }
  const wrongs = new Set<number>();
  while (wrongs.size < 3) { const w = Math.round((answer + (Math.random() - 0.5) * 4) * 100) / 100; if (w !== answer && w > 0) wrongs.add(w); }
  return { question, answer, options: [answer, ...wrongs].sort(() => Math.random() - 0.5) };
}

export default function DecimalsDeepDive() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'explore' | 'convert' | 'challenge'>('explore');
  const [value, setValue] = useState(3.14);
  const [challenge, setChallenge] = useState(makeChallenge);
  const [feedback, setFeedback] = useState<'correct' | 'hint' | null>(null);
  const [mastery, setMastery] = useState(0);

  const parts = useMemo(() => {
    const str = value.toFixed(4);
    const [intPart, decPart] = str.split('.');
    const digits = decPart.split('').map((d, i) => ({
      digit: Number(d),
      place: ['tenths', 'hundredths', 'thousandths', 'ten-thousandths'][i],
      value: Number(d) / Math.pow(10, i + 1),
    }));
    return { integer: Number(intPart), digits };
  }, [value]);

  const fraction = useMemo(() => {
    const dec = Math.round((value % 1) * 10000);
    if (dec === 0) return { num: 0, den: 1 };
    const num = dec, den = 10000;
    const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
    const g = gcd(num, den);
    return { num: num / g, den: den / g };
  }, [value]);

  const lineMin = Math.floor(value);
  const lineMax = lineMin + 1;
  const zoomTicks = useMemo(() => Array.from({ length: 11 }, (_, i) => lineMin + i * 0.1), [lineMin]);

  const answerChallenge = useCallback((opt: number) => {
    if (feedback) return;
    if (opt === challenge.answer) {
      setFeedback('correct'); setMastery(m => m + 1);
      setTimeout(() => { setChallenge(makeChallenge()); setFeedback(null); }, 1200);
    } else { setFeedback('hint'); setTimeout(() => setFeedback(null), 900); }
  }, [feedback, challenge]);

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2"><Trans i18nKey="auto.decimalsdeepdive.decimals_deep_dive">🔢 Decimals Deep Dive</Trans></h2>
        <p className="text-purple-300 text-lg"><Trans i18nKey="auto.decimalsdeepdive.place_value_conversions_and_op">Place value, conversions, and operations with decimals!</Trans></p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        {[{ id: 'explore' as const, emoji: '🔍', label: 'Explore', k: 'auto.decimalsdeepdive.explore' }, { id: 'convert' as const, emoji: '🔄', label: 'Convert', k: 'auto.decimalsdeepdive.convert' }, { id: 'challenge' as const, emoji: '🎯', label: 'Challenge', k: 'auto.decimalsdeepdive.challenge' }].map(m => (
          <button key={m.id} className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === m.id ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50' : 'bg-white/5 text-gray-400'}`}
            onClick={() => { setMode(m.id); if (m.id === 'challenge') setChallenge(makeChallenge()); }}>{m.emoji} {t(m.k, m.label)}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === 'explore' && (
          <motion.div key="ex" className="max-w-2xl mx-auto space-y-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <input type="range" min="0" max="10" step="0.01" value={value} onChange={e => setValue(Number(e.target.value))} className="w-full accent-blue-500 mb-2" />
              <input type="number" step="0.01" value={value} onChange={e => setValue(Math.max(0, Number(e.target.value) || 0))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-3xl font-bold text-center font-mono" />
            </div>

            {/* Place value breakdown */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <h4 className="text-white font-bold mb-3"><Trans i18nKey="auto.decimalsdeepdive.decimal_place_value">Decimal Place Value</Trans></h4>
              <div className="grid grid-cols-5 gap-2 text-center">
                <div className="bg-purple-500/20 rounded-lg p-2 border border-purple-400/40"><p className="text-gray-400 text-sm"><Trans i18nKey="auto.decimalsdeepdive.ones">Ones</Trans></p><p className="text-purple-300 font-bold text-2xl">{parts.integer}</p></div>
                <div className="text-gray-500 flex items-center justify-center text-3xl font-bold">.</div>
                {parts.digits.slice(0, 3).map((d, i) => (
                  <div key={i} className={`rounded-lg p-2 border ${d.digit > 0 ? 'bg-blue-500/20 border-blue-400/40' : 'bg-white/5 border-white/10'}`}>
                    <p className="text-gray-400 text-sm">{d.place}</p>
                    <p className="text-blue-300 font-bold text-2xl">{d.digit}</p>
                    <p className="text-gray-500 text-sm">{d.value.toFixed(i + 1)}</p>
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-3 text-center">
                {parts.integer} + {parts.digits.filter(d => d.digit > 0).map(d => d.value.toFixed(4).replace(/0+$/, '')).join(' + ') || '0'} = <span className="text-white font-bold">{value}</span>
              </p>
            </div>

            {/* Number line zoom */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <h4 className="text-white font-bold mb-3"><Trans i18nKey="auto.decimalsdeepdive.number_line_zoom">🔎 Number Line Zoom (</Trans>{lineMin}–{lineMax})</h4>
              <svg width="100%" height="60" viewBox="0 0 500 60">
                <line x1="20" y1="30" x2="480" y2="30" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                {zoomTicks.map((t, i) => {
                  const x = 20 + i * 46;
                  return <g key={i}><line x1={x} y1="22" x2={x} y2="38" stroke="rgba(255,255,255,0.4)" strokeWidth={i % 5 === 0 ? 2 : 1} /><text x={x} y="52" fill="rgba(255,255,255,0.5)" fontSize="9" textAnchor="middle">{t.toFixed(1)}</text></g>;
                })}
                {value >= lineMin && value <= lineMax && (
                  <motion.g animate={{ x: 20 + ((value - lineMin) / (lineMax - lineMin)) * 460 }}>
                    <circle cx={0} cy={30} r="6" fill="#3b82f6" /><text x={0} y={16} fill="#60a5fa" fontSize="11" fontWeight="bold" textAnchor="middle">{value.toFixed(2)}</text>
                  </motion.g>
                )}
              </svg>
            </div>
          </motion.div>
        )}

        {mode === 'convert' && (
          <motion.div key="conv" className="max-w-lg mx-auto space-y-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 text-center">
              <input type="number" step="0.01" value={value} onChange={e => setValue(Math.max(0, Number(e.target.value) || 0))}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white text-2xl font-bold text-center font-mono mb-4" />
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20"><p className="text-gray-400 text-sm"><Trans i18nKey="auto.decimalsdeepdive.decimal">Decimal</Trans></p><motion.p key={value} className="text-blue-400 font-bold text-xl font-mono" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{value}</motion.p></div>
                <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20"><p className="text-gray-400 text-sm"><Trans i18nKey="auto.decimalsdeepdive.fraction">Fraction</Trans></p><motion.p key={`${fraction.num}/${fraction.den}`} className="text-green-400 font-bold text-xl font-mono" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{parts.integer > 0 && fraction.num > 0 ? `${parts.integer} ` : ''}{fraction.num}/{fraction.den}</motion.p></div>
                <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20"><p className="text-gray-400 text-sm"><Trans i18nKey="auto.decimalsdeepdive.percentage">Percentage</Trans></p><motion.p key={value} className="text-purple-400 font-bold text-xl font-mono" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{(value * 100).toFixed(1)}%</motion.p></div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-white font-bold mb-2"><Trans i18nKey="auto.decimalsdeepdive.quick_conversions">Quick conversions</Trans></h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[0.1, 0.25, 0.333, 0.5, 0.75, 1.5].map(v => (
                  <button key={v} className="bg-white/5 rounded-lg px-3 py-2 text-left hover:bg-white/10" onClick={() => setValue(v)}>
                    <span className="text-white font-mono">{v}</span> = <span className="text-green-400">{v === 0.333 ? '1/3' : `${Math.round(v * 1000) % 1000 === 0 ? Math.round(v) : v}`}</span> = <span className="text-purple-400">{(v * 100).toFixed(1)}%</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {mode === 'challenge' && (
          <motion.div key="ch" className="max-w-lg mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className={`rounded-3xl p-6 border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'hint' ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between mb-4"><span className="text-yellow-400 font-bold">⭐ {mastery}</span></div>
              <p className="text-3xl font-bold text-white text-center font-mono mb-5">{challenge.question} = ?</p>
              <div className="grid grid-cols-2 gap-3">
                {challenge.options.map(opt => (
                  <motion.button key={opt} className={`py-3 rounded-xl text-xl font-bold font-mono ${feedback === 'correct' && opt === challenge.answer ? 'bg-green-500 text-white' : feedback ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
                    whileHover={!feedback ? { scale: 1.05 } : {}} whileTap={!feedback ? { scale: 0.95 } : {}}
                    onClick={() => answerChallenge(opt)} disabled={!!feedback}>{opt}</motion.button>
                ))}
              </div>
              {feedback === 'correct' && <p className="text-green-400 font-bold text-center mt-4"><Trans i18nKey="auto.decimalsdeepdive.correct">✅ Correct!</Trans></p>}
              {feedback === 'hint' && <p className="text-sky-400 font-bold text-center mt-4"><Trans i18nKey="auto.decimalsdeepdive.answer">Answer:</Trans> {challenge.answer}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
