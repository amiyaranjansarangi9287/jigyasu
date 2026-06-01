import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function makeChallenge() {
  const ops = ['+', '-', '×'] as const;
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number, b: number, answer: number;
  if (op === '+') { a = Math.floor(Math.random() * 21) - 10; b = Math.floor(Math.random() * 21) - 10; answer = a + b; }
  else if (op === '-') { a = Math.floor(Math.random() * 21) - 10; b = Math.floor(Math.random() * 21) - 10; answer = a - b; }
  else { a = Math.floor(Math.random() * 11) - 5; b = Math.floor(Math.random() * 11) - 5; answer = a * b; }
  const wrongs = new Set<number>();
  while (wrongs.size < 3) { const w = answer + Math.floor(Math.random() * 11) - 5; if (w !== answer) wrongs.add(w); }
  const displayA = a < 0 ? `(${a})` : String(a);
  const displayB = b < 0 ? `(${b})` : String(b);
  return { a, b, op, answer, display: `${displayA} ${op} ${displayB}`, options: [answer, ...wrongs].sort(() => Math.random() - 0.5) };
}

export default function IntegersNumberLine() {
  const [mode, setMode] = useState<'explore' | 'challenge'>('explore');
  const [value, setValue] = useState(0);
  const [rangeStart, setRangeStart] = useState(-10);
  const [rangeEnd, setRangeEnd] = useState(10);
  const [challenge, setChallenge] = useState(makeChallenge);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [opA, setOpA] = useState(-3);
  const [opB, setOpB] = useState(5);
  const [opType, setOpType] = useState<'+' | '-' | '×'>('+');

  const result = useMemo(() => {
    if (opType === '+') return opA + opB;
    if (opType === '-') return opA - opB;
    return opA * opB;
  }, [opA, opB, opType]);

  const lineWidth = 600;
  const range = rangeEnd - rangeStart || 1;
  const toX = useCallback((n: number) => ((n - rangeStart) / range) * lineWidth, [rangeStart, range]);

  const answerChallenge = (opt: number) => {
    if (feedback) return;
    if (opt === challenge.answer) {
      setFeedback('correct'); setScore(s => s + 10);
      setTimeout(() => { setChallenge(makeChallenge()); setFeedback(null); }, 1200);
    } else { setFeedback('wrong'); setTimeout(() => setFeedback(null), 900); }
  };

  const nums = useMemo(() => {
    const step = Math.max(1, Math.ceil(range / 20));
    const arr: number[] = [];
    for (let i = rangeStart; i <= rangeEnd; i += step) arr.push(i);
    return arr;
  }, [rangeStart, rangeEnd, range]);

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🔢 Integers & Number Line</h2>
        <p className="text-purple-300 text-lg">Explore negative numbers, zero, and integer operations.</p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'explore' ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => setMode('explore')}>🔍 Explore</button>
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'challenge' ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => { setMode('challenge'); setChallenge(makeChallenge()); }}>🎯 Challenge</button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'challenge' ? (
          <motion.div key="ch" className="max-w-lg mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className={`rounded-3xl p-6 border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'wrong' ? 'bg-red-500/10 border-red-500/40' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between mb-4"><span className="text-yellow-400 font-bold">⭐ {score}</span></div>
              <p className="text-3xl font-bold text-white text-center font-mono mb-5">{challenge.display} = ?</p>
              <div className="grid grid-cols-2 gap-3">
                {challenge.options.map(opt => (
                  <motion.button key={opt} className={`py-3 rounded-xl text-xl font-bold ${feedback === 'correct' && opt === challenge.answer ? 'bg-green-500 text-white' : feedback ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`} whileHover={!feedback ? { scale: 1.05 } : {}} whileTap={!feedback ? { scale: 0.95 } : {}} onClick={() => answerChallenge(opt)} disabled={!!feedback}>{opt}</motion.button>
                ))}
              </div>
              {feedback === 'correct' && <p className="text-green-400 font-bold text-center mt-4">✅ Correct!</p>}
              {feedback === 'wrong' && <p className="text-red-400 font-bold text-center mt-4">Answer: {challenge.answer}</p>}
            </div>
          </motion.div>
        ) : (
          <motion.div key="ex" className="space-y-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Number line */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10 overflow-x-auto">
              <h4 className="text-white font-bold mb-3 text-center">Number Line</h4>
              <div className="flex items-center gap-3 mb-3 justify-center">
                <label className="text-gray-400 text-xs">Range</label>
                <input type="number" value={rangeStart} onChange={e => setRangeStart(Number(e.target.value))} className="w-16 bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm text-center" />
                <span className="text-gray-400">to</span>
                <input type="number" value={rangeEnd} onChange={e => setRangeEnd(Math.max(Number(e.target.value), rangeStart + 1))} className="w-16 bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm text-center" />
              </div>
              <svg width={lineWidth + 40} height="80" viewBox={`-20 0 ${lineWidth + 40} 80`} className="mx-auto">
                <line x1="0" y1="40" x2={lineWidth} y2="40" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                {/* Zero marker */}
                {rangeStart <= 0 && rangeEnd >= 0 && <line x1={toX(0)} y1="25" x2={toX(0)} y2="55" stroke="#a855f7" strokeWidth="3" />}
                {/* Ticks */}
                {nums.map(n => (
                  <g key={n}>
                    <line x1={toX(n)} y1="32" x2={toX(n)} y2="48" stroke={n === 0 ? '#a855f7' : n < 0 ? '#ef4444' : '#22c55e'} strokeWidth={n === 0 ? 3 : 1.5} />
                    <text x={toX(n)} y="65" fill={n === 0 ? '#a855f7' : n < 0 ? '#f87171' : '#86efac'} fontSize="11" textAnchor="middle" fontWeight={n === 0 ? 'bold' : 'normal'}>{n}</text>
                  </g>
                ))}
                {/* Current value dot */}
                {value >= rangeStart && value <= rangeEnd && (
                  <motion.g animate={{ x: toX(value) }}>
                    <circle cx={0} cy={40} r="8" fill="#f59e0b" />
                    <text x={0} y={22} fill="#f59e0b" fontSize="14" fontWeight="bold" textAnchor="middle">{value}</text>
                  </motion.g>
                )}
              </svg>
              <div className="flex justify-center mt-2">
                <input type="range" min={rangeStart} max={rangeEnd} value={value} onChange={e => setValue(Number(e.target.value))} className="w-64 accent-yellow-500" />
              </div>
              <p className="text-center text-gray-400 text-xs mt-1">
                {value < 0 ? '🔴 Negative' : value === 0 ? '🟣 Zero' : '🟢 Positive'} integer: <span className="text-white font-bold">{value}</span> — Absolute value |{value}| = {Math.abs(value)}
              </p>
            </div>

            {/* Operations calculator */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <h4 className="text-white font-bold mb-3 text-center">Integer Operations</h4>
              <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                <input type="number" value={opA} onChange={e => setOpA(Number(e.target.value))} className="w-20 bg-white/10 border border-blue-400/30 rounded-lg px-3 py-2 text-blue-400 font-bold text-center text-xl" />
                <div className="flex gap-1">
                  {(['+', '-', '×'] as const).map(o => (
                    <button key={o} className={`w-10 h-10 rounded-lg font-bold text-xl ${opType === o ? 'bg-purple-500/40 text-purple-300' : 'bg-white/10 text-gray-400'}`} onClick={() => setOpType(o)}>{o}</button>
                  ))}
                </div>
                <input type="number" value={opB} onChange={e => setOpB(Number(e.target.value))} className="w-20 bg-white/10 border border-orange-400/30 rounded-lg px-3 py-2 text-orange-400 font-bold text-center text-xl" />
                <span className="text-gray-400 text-2xl">=</span>
                <motion.span key={result} className="text-green-400 font-bold text-3xl" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{result}</motion.span>
              </div>

              {/* Rules */}
              <div className="bg-black/20 rounded-xl p-4 text-sm space-y-1">
                <p className="text-gray-300">📘 <strong className="text-blue-300">Adding:</strong> same signs → add & keep sign. Different signs → subtract & keep sign of larger absolute.</p>
                <p className="text-gray-300">📙 <strong className="text-orange-300">Subtracting:</strong> change to adding the opposite. a - b = a + (-b)</p>
                <p className="text-gray-300">📗 <strong className="text-green-300">Multiplying:</strong> same signs → positive. Different signs → negative.</p>
                <p className="text-gray-300 mt-2">Example: <span className="text-white font-mono">{opA < 0 ? `(${opA})` : opA} {opType} {opB < 0 ? `(${opB})` : opB} = {result}</span></p>
              </div>
            </div>

            {/* Ordering */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <h4 className="text-white font-bold mb-3 text-center">Number Order</h4>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {[...Array(11)].map((_, i) => {
                  const n = i - 5;
                  return (
                    <motion.div key={n} className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${n < 0 ? 'bg-red-500/20 text-red-300' : n === 0 ? 'bg-purple-500/30 text-purple-300' : 'bg-green-500/20 text-green-300'}`}
                      whileHover={{ scale: 1.2 }} onClick={() => setValue(n)}>
                      {n}
                    </motion.div>
                  );
                })}
              </div>
              <p className="text-center text-gray-500 text-xs mt-2">-5 &lt; -4 &lt; … &lt; 0 &lt; … &lt; 4 &lt; 5</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
