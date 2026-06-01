import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function makeChallenge() {
  const type = Math.floor(Math.random() * 3);
  const r = () => Math.floor(Math.random() * 9) - 4;
  const a1 = r(), b1 = r(), a2 = r(), b2 = r();
  if (type === 0) { const ra = a1 + a2, rb = b1 + b2; const answer = `${ra}${rb >= 0 ? '+' : ''}${rb}i`; const wrongs = new Set([answer]); while (wrongs.size < 4) wrongs.add(`${ra + r()}${(rb + r()) >= 0 ? '+' : ''}${rb + r()}i`); return { question: `(${a1}${b1 >= 0 ? '+' : ''}${b1}i) + (${a2}${b2 >= 0 ? '+' : ''}${b2}i)`, answer, options: [...wrongs].sort(() => Math.random() - 0.5), type: 'Addition' }; }
  if (type === 1) { const ra = a1 * a2 - b1 * b2, rb = a1 * b2 + a2 * b1; const answer = `${ra}${rb >= 0 ? '+' : ''}${rb}i`; const wrongs = new Set([answer]); while (wrongs.size < 4) wrongs.add(`${ra + r()}${(rb + r()) >= 0 ? '+' : ''}${rb + r()}i`); return { question: `(${a1}${b1 >= 0 ? '+' : ''}${b1}i) × (${a2}${b2 >= 0 ? '+' : ''}${b2}i)`, answer, options: [...wrongs].sort(() => Math.random() - 0.5), type: 'Multiplication' }; }
  const mag = Math.round(Math.sqrt(a1 * a1 + b1 * b1) * 100) / 100; const answer = String(mag); const wrongs = new Set([answer]); while (wrongs.size < 4) { const w = String(Math.round((mag + (Math.random() - 0.5) * 4) * 100) / 100); if (w !== answer) wrongs.add(w); }
  return { question: `|${a1}${b1 >= 0 ? '+' : ''}${b1}i| = ?`, answer, options: [...wrongs].sort(() => Math.random() - 0.5), type: 'Modulus' };
}

export default function ComplexNumbers() {
  const [a1, setA1] = useState(3); const [b1, setB1] = useState(2);
  const [a2, setA2] = useState(1); const [b2, setB2] = useState(-4);
  const [mode, setMode] = useState<'explore' | 'challenge'>('explore');
  const [challenge, setChallenge] = useState(makeChallenge);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);

  const results = useMemo(() => {
    const sumR = a1 + a2, sumI = b1 + b2;
    const mulR = a1 * a2 - b1 * b2, mulI = a1 * b2 + a2 * b1;
    const mag1 = Math.sqrt(a1 * a1 + b1 * b1);
    const mag2 = Math.sqrt(a2 * a2 + b2 * b2);
    const arg1 = Math.atan2(b1, a1) * 180 / Math.PI;
    const conjR = a1, conjI = -b1;
    return { sumR, sumI, mulR, mulI, mag1, mag2, arg1, conjR, conjI };
  }, [a1, b1, a2, b2]);

  const fmt = (r: number, i: number) => `${r}${i >= 0 ? '+' : ''}${i}i`;

  const gSize = 280, gRange = 8, unit = gSize / (gRange * 2), cx = gSize / 2, cy = gSize / 2;
  const sx = (x: number) => cx + x * unit, sy = (y: number) => cy - y * unit;

  const answerChallenge = useCallback((opt: string) => {
    if (feedback) return;
    if (opt === challenge.answer) { setFeedback('correct'); setScore(s => s + 15); setTimeout(() => { setChallenge(makeChallenge()); setFeedback(null); }, 1200); }
    else { setFeedback('wrong'); setTimeout(() => setFeedback(null), 900); }
  }, [feedback, challenge]);

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">ℂ Complex Numbers</h2>
        <p className="text-purple-300 text-lg">Explore i, the Argand diagram, and complex arithmetic!</p>
      </div>
      <div className="flex justify-center gap-2 mb-6">
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'explore' ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => setMode('explore')}>🔍 Explore</button>
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'challenge' ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => { setMode('challenge'); setChallenge(makeChallenge()); }}>🎯 Challenge</button>
      </div>
      <AnimatePresence mode="wait">
        {mode === 'challenge' ? (
          <motion.div key="ch" className="max-w-lg mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className={`rounded-3xl p-6 border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'wrong' ? 'bg-red-500/10 border-red-500/40' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between mb-4"><span className="text-yellow-400 font-bold">⭐ {score}</span><span className="text-sm text-gray-400">{challenge.type}</span></div>
              <p className="text-xl font-bold text-white text-center font-mono mb-5">{challenge.question}</p>
              <div className="grid grid-cols-2 gap-3">{challenge.options.map(opt => <motion.button key={opt} className={`py-3 rounded-xl text-lg font-bold font-mono ${feedback === 'correct' && opt === challenge.answer ? 'bg-green-500 text-white' : feedback ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`} whileHover={!feedback ? { scale: 1.05 } : {}} whileTap={!feedback ? { scale: 0.95 } : {}} onClick={() => answerChallenge(opt)} disabled={!!feedback}>{opt}</motion.button>)}</div>
              {feedback === 'correct' && <p className="text-green-400 font-bold text-center mt-4">✅ Correct!</p>}
              {feedback === 'wrong' && <p className="text-red-400 font-bold text-center mt-4">Answer: {challenge.answer}</p>}
            </div>
          </motion.div>
        ) : (
          <motion.div key="ex" className="grid grid-cols-1 lg:grid-cols-2 gap-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <h4 className="text-blue-400 font-bold mb-2">z₁ = {fmt(a1, b1)}</h4>
                <div className="grid grid-cols-2 gap-2"><div><label className="text-gray-400 text-sm">Real</label><input type="range" min="-6" max="6" value={a1} onChange={e => setA1(Number(e.target.value))} className="w-full accent-blue-500" /><p className="text-white font-bold text-center">{a1}</p></div><div><label className="text-gray-400 text-sm">Imaginary</label><input type="range" min="-6" max="6" value={b1} onChange={e => setB1(Number(e.target.value))} className="w-full accent-blue-500" /><p className="text-white font-bold text-center">{b1}i</p></div></div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <h4 className="text-orange-400 font-bold mb-2">z₂ = {fmt(a2, b2)}</h4>
                <div className="grid grid-cols-2 gap-2"><div><label className="text-gray-400 text-sm">Real</label><input type="range" min="-6" max="6" value={a2} onChange={e => setA2(Number(e.target.value))} className="w-full accent-orange-500" /><p className="text-white font-bold text-center">{a2}</p></div><div><label className="text-gray-400 text-sm">Imaginary</label><input type="range" min="-6" max="6" value={b2} onChange={e => setB2(Number(e.target.value))} className="w-full accent-orange-500" /><p className="text-white font-bold text-center">{b2}i</p></div></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-500/10 rounded-xl p-3 border border-green-500/20 text-center"><p className="text-gray-400 text-sm">z₁ + z₂</p><p className="text-green-400 font-bold font-mono">{fmt(results.sumR, results.sumI)}</p></div>
                <div className="bg-purple-500/10 rounded-xl p-3 border border-purple-500/20 text-center"><p className="text-gray-400 text-sm">z₁ × z₂</p><p className="text-purple-400 font-bold font-mono">{fmt(results.mulR, results.mulI)}</p></div>
                <div className="bg-cyan-500/10 rounded-xl p-3 border border-cyan-500/20 text-center"><p className="text-gray-400 text-sm">|z₁|</p><p className="text-cyan-400 font-bold">{results.mag1.toFixed(2)}</p></div>
                <div className="bg-pink-500/10 rounded-xl p-3 border border-pink-500/20 text-center"><p className="text-gray-400 text-sm">z̄₁ (conjugate)</p><p className="text-pink-400 font-bold font-mono">{fmt(results.conjR, results.conjI)}</p></div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-sm text-gray-300 space-y-1">
                <p>📝 i² = -1</p>
                <p>📝 |a+bi| = √(a² + b²)</p>
                <p>📝 (a+bi)(c+di) = (ac−bd) + (ad+bc)i</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-3xl p-4 border border-white/10 flex justify-center">
              <svg width={gSize} height={gSize} className="bg-black/20 rounded-xl">
                {Array.from({ length: gRange * 2 + 1 }).map((_, i) => { const p = i * unit; return <g key={i}><line x1={p} y1={0} x2={p} y2={gSize} stroke="rgba(255,255,255,0.05)" /><line x1={0} y1={p} x2={gSize} y2={p} stroke="rgba(255,255,255,0.05)" /></g>; })}
                <line x1={0} y1={cy} x2={gSize} y2={cy} stroke="rgba(255,255,255,0.25)" /><line x1={cx} y1={0} x2={cx} y2={gSize} stroke="rgba(255,255,255,0.25)" />
                <text x={gSize - 20} y={cy - 5} fill="rgba(255,255,255,0.4)" fontSize="11">Re</text>
                <text x={cx + 5} y={14} fill="rgba(255,255,255,0.4)" fontSize="11">Im</text>
                <motion.line x1={cx} y1={cy} x2={sx(a1)} y2={sy(b1)} stroke="#3b82f6" strokeWidth="2.5" animate={{ x2: sx(a1), y2: sy(b1) }} /><motion.circle cx={sx(a1)} cy={sy(b1)} r="5" fill="#3b82f6" animate={{ cx: sx(a1), cy: sy(b1) }} />
                <text x={sx(a1) + 8} y={sy(b1) - 5} fill="#60a5fa" fontSize="11" fontWeight="bold">z₁</text>
                <motion.line x1={cx} y1={cy} x2={sx(a2)} y2={sy(b2)} stroke="#f97316" strokeWidth="2.5" animate={{ x2: sx(a2), y2: sy(b2) }} /><motion.circle cx={sx(a2)} cy={sy(b2)} r="5" fill="#f97316" animate={{ cx: sx(a2), cy: sy(b2) }} />
                <text x={sx(a2) + 8} y={sy(b2) - 5} fill="#fb923c" fontSize="11" fontWeight="bold">z₂</text>
                <motion.circle cx={sx(results.sumR)} cy={sy(results.sumI)} r="5" fill="#22c55e" animate={{ cx: sx(results.sumR), cy: sy(results.sumI) }} />
                <text x={sx(results.sumR) + 8} y={sy(results.sumI) - 5} fill="#4ade80" fontSize="10">z₁+z₂</text>
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
