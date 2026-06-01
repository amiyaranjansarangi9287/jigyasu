import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function makeChallenge() {
  const type = Math.floor(Math.random() * 3);
  const ax = Math.floor(Math.random() * 9) - 4, ay = Math.floor(Math.random() * 9) - 4;
  const bx = Math.floor(Math.random() * 9) - 4, by = Math.floor(Math.random() * 9) - 4;
  if (type === 0) { const answer = `(${ax + bx}, ${ay + by})`; const wrongs = new Set([answer]); while (wrongs.size < 4) wrongs.add(`(${ax + bx + Math.floor(Math.random() * 5) - 2}, ${ay + by + Math.floor(Math.random() * 5) - 2})`); return { question: `(${ax},${ay}) + (${bx},${by}) = ?`, answer, options: [...wrongs].sort(() => Math.random() - 0.5), type: 'Addition' }; }
  if (type === 1) { const answer = ax * bx + ay * by; const wrongs = new Set([answer]); while (wrongs.size < 4) { const w = answer + Math.floor(Math.random() * 11) - 5; if (w !== answer) wrongs.add(w); } return { question: `(${ax},${ay}) · (${bx},${by}) = ?`, answer: String(answer), options: [...wrongs].map(String).sort(() => Math.random() - 0.5), type: 'Dot Product' }; }
  const mag = Math.sqrt(ax * ax + ay * ay); const answer = Math.round(mag * 100) / 100;
  const wrongs = new Set([answer]); while (wrongs.size < 4) { const w = Math.round((answer + (Math.random() - 0.5) * 4) * 100) / 100; if (w > 0 && w !== answer) wrongs.add(w); }
  return { question: `|(${ax},${ay})| = ?`, answer: String(answer), options: [...wrongs].map(String).sort(() => Math.random() - 0.5), type: 'Magnitude' };
}

export default function VectorsArena() {
  const [ax, setAx] = useState(3); const [ay, setAy] = useState(2);
  const [bx, setBx] = useState(-1); const [by, setBy] = useState(4);
  const [mode, setMode] = useState<'explore' | 'challenge'>('explore');
  const [challenge, setChallenge] = useState(makeChallenge);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);

  const sum = useMemo(() => ({ x: ax + bx, y: ay + by }), [ax, ay, bx, by]);
  const dot = useMemo(() => ax * bx + ay * by, [ax, ay, bx, by]);
  const magA = useMemo(() => Math.sqrt(ax * ax + ay * ay), [ax, ay]);
  const magB = useMemo(() => Math.sqrt(bx * bx + by * by), [bx, by]);
  const angle = useMemo(() => { if (magA === 0 || magB === 0) return 0; return Math.acos(Math.max(-1, Math.min(1, dot / (magA * magB)))) * 180 / Math.PI; }, [dot, magA, magB]);

  const gSize = 280, gRange = 6, unit = gSize / (gRange * 2), cx = gSize / 2, cy = gSize / 2;
  const sx = (x: number) => cx + x * unit; const sy = (y: number) => cy - y * unit;

  const answerChallenge = (opt: string) => {
    if (feedback) return;
    if (opt === challenge.answer) { setFeedback('correct'); setScore(s => s + 10); setTimeout(() => { setChallenge(makeChallenge()); setFeedback(null); }, 1200); }
    else { setFeedback('wrong'); setTimeout(() => setFeedback(null), 900); }
  };

  const Arrow = ({ x, y, color, label }: { x: number; y: number; color: string; label: string }) => {
    const len = Math.sqrt(x * x + y * y);
    if (len < 0.01) return null;
    const angle = Math.atan2(-y, x);
    const tipLen = 8;
    const ex = sx(x), ey = sy(y);
    return (
      <g>
        <motion.line x1={cx} y1={cy} x2={ex} y2={ey} stroke={color} strokeWidth="2.5" strokeLinecap="round" animate={{ x2: ex, y2: ey }} transition={{ type: 'spring', stiffness: 200 }} />
        <motion.polygon points={`${ex},${ey} ${ex - tipLen * Math.cos(angle - 0.4)},${ey + tipLen * Math.sin(angle - 0.4)} ${ex - tipLen * Math.cos(angle + 0.4)},${ey + tipLen * Math.sin(angle + 0.4)}`} fill={color} animate={{ points: `${ex},${ey} ${ex - tipLen * Math.cos(angle - 0.4)},${ey + tipLen * Math.sin(angle - 0.4)} ${ex - tipLen * Math.cos(angle + 0.4)},${ey + tipLen * Math.sin(angle + 0.4)}` }} />
        <text x={ex + 8} y={ey - 5} fill={color} fontSize="12" fontWeight="bold">{label}</text>
      </g>
    );
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🏹 Vectors Arena</h2>
        <p className="text-purple-300 text-lg">Visualize vector addition, magnitude, and dot product!</p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'explore' ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => setMode('explore')}>🔍 Explore</button>
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'challenge' ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => { setMode('challenge'); setChallenge(makeChallenge()); }}>🎯 Challenge</button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'challenge' ? (
          <motion.div key="ch" className="max-w-lg mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className={`rounded-3xl p-6 border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'wrong' ? 'bg-red-500/10 border-red-500/40' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between mb-4"><span className="text-yellow-400 font-bold">⭐ {score}</span><span className="text-xs text-gray-400">{challenge.type}</span></div>
              <p className="text-2xl font-bold text-white text-center font-mono mb-5">{challenge.question}</p>
              <div className="grid grid-cols-2 gap-3">
                {challenge.options.map(opt => (
                  <motion.button key={opt} className={`py-3 rounded-xl text-lg font-bold font-mono ${feedback === 'correct' && opt === challenge.answer ? 'bg-green-500 text-white' : feedback ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
                    whileHover={!feedback ? { scale: 1.05 } : {}} whileTap={!feedback ? { scale: 0.95 } : {}}
                    onClick={() => answerChallenge(opt)} disabled={!!feedback}>{opt}</motion.button>
                ))}
              </div>
              {feedback === 'correct' && <p className="text-green-400 font-bold text-center mt-4">✅ Correct!</p>}
              {feedback === 'wrong' && <p className="text-red-400 font-bold text-center mt-4">Answer: {challenge.answer}</p>}
            </div>
          </motion.div>
        ) : (
          <motion.div key="ex" className="grid grid-cols-1 lg:grid-cols-2 gap-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <h4 className="text-blue-400 font-bold mb-2">Vector A</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-gray-400 text-xs">x</label><input type="range" min="-5" max="5" value={ax} onChange={e => setAx(Number(e.target.value))} className="w-full accent-blue-500" /><p className="text-white font-bold text-center">{ax}</p></div>
                  <div><label className="text-gray-400 text-xs">y</label><input type="range" min="-5" max="5" value={ay} onChange={e => setAy(Number(e.target.value))} className="w-full accent-blue-500" /><p className="text-white font-bold text-center">{ay}</p></div>
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <h4 className="text-orange-400 font-bold mb-2">Vector B</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-gray-400 text-xs">x</label><input type="range" min="-5" max="5" value={bx} onChange={e => setBx(Number(e.target.value))} className="w-full accent-orange-500" /><p className="text-white font-bold text-center">{bx}</p></div>
                  <div><label className="text-gray-400 text-xs">y</label><input type="range" min="-5" max="5" value={by} onChange={e => setBy(Number(e.target.value))} className="w-full accent-orange-500" /><p className="text-white font-bold text-center">{by}</p></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-500/10 rounded-xl p-3 border border-green-500/20 text-center"><p className="text-gray-400 text-xs">A + B</p><p className="text-green-400 font-bold">({sum.x}, {sum.y})</p></div>
                <div className="bg-purple-500/10 rounded-xl p-3 border border-purple-500/20 text-center"><p className="text-gray-400 text-xs">A · B</p><p className="text-purple-400 font-bold">{dot}</p></div>
                <div className="bg-blue-500/10 rounded-xl p-3 border border-blue-500/20 text-center"><p className="text-gray-400 text-xs">|A|</p><p className="text-blue-400 font-bold">{magA.toFixed(2)}</p></div>
                <div className="bg-orange-500/10 rounded-xl p-3 border border-orange-500/20 text-center"><p className="text-gray-400 text-xs">|B|</p><p className="text-orange-400 font-bold">{magB.toFixed(2)}</p></div>
              </div>
              <div className="bg-yellow-500/10 rounded-xl p-3 border border-yellow-500/20 text-center"><p className="text-gray-400 text-xs">Angle between</p><p className="text-yellow-400 font-bold">{angle.toFixed(1)}°</p></div>
            </div>

            <div className="bg-white/5 rounded-3xl p-4 border border-white/10 flex justify-center">
              <svg width={gSize} height={gSize} className="bg-black/20 rounded-xl">
                {Array.from({ length: gRange * 2 + 1 }).map((_, i) => { const p = i * unit; return <g key={i}><line x1={p} y1={0} x2={p} y2={gSize} stroke="rgba(255,255,255,0.05)" /><line x1={0} y1={p} x2={gSize} y2={p} stroke="rgba(255,255,255,0.05)" /></g>; })}
                <line x1={0} y1={cy} x2={gSize} y2={cy} stroke="rgba(255,255,255,0.25)" /><line x1={cx} y1={0} x2={cx} y2={gSize} stroke="rgba(255,255,255,0.25)" />
                {/* Parallelogram */}
                <motion.polygon points={`${cx},${cy} ${sx(ax)},${sy(ay)} ${sx(sum.x)},${sy(sum.y)} ${sx(bx)},${sy(by)}`} fill="rgba(34,197,94,0.08)" stroke="rgba(34,197,94,0.25)" strokeWidth="1" strokeDasharray="4" />
                <Arrow x={ax} y={ay} color="#3b82f6" label="A" />
                <Arrow x={bx} y={by} color="#f97316" label="B" />
                <Arrow x={sum.x} y={sum.y} color="#22c55e" label="A+B" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
