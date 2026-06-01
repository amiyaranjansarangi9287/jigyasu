import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '../lib/soundEngine';

type PatMode = 'fibonacci' | 'symmetry' | 'nature' | 'challenge';

const PHI = 1.618033988749895;

function fib(n: number): number[] { const a = [0, 1]; for (let i = 2; i < n; i++) a.push(a[i - 1] + a[i - 2]); return a; }

function makeChallenge() {
  const type = Math.floor(Math.random() * 4);
  if (type === 0) {
    const seq = fib(10);
    const idx = Math.floor(Math.random() * 4) + 5;
    const answer = String(seq[idx]);
    const wrongs = new Set([answer]);
    while (wrongs.size < 4) wrongs.add(String(seq[idx] + Math.floor(Math.random() * 11) - 5));
    return { question: `Fibonacci: ${seq.slice(idx - 4, idx).join(', ')}, ?`, answer, options: [...wrongs].sort(() => Math.random() - 0.5), type: 'Fibonacci' };
  }
  if (type === 1) {
    const lines = [0, 1, 2, 3, 4, 5, 6][Math.floor(Math.random() * 7)];
    const shapes = ['Circle', 'Square', 'Equilateral Triangle', 'Rectangle', 'Regular Pentagon', 'Regular Hexagon', 'Star'];
    const answers = [Infinity, 4, 3, 2, 5, 6, 5];
    const shape = shapes[lines];
    const answer = lines === 0 ? '∞' : String(answers[lines]);
    const wrongs = new Set([answer]);
    while (wrongs.size < 4) { const w = lines === 0 ? String(Math.floor(Math.random() * 6) + 1) : String(answers[lines] + Math.floor(Math.random() * 5) - 2); if (w !== answer) wrongs.add(w); }
    return { question: `How many lines of symmetry does a ${shape} have?`, answer, options: [...wrongs].sort(() => Math.random() - 0.5), type: 'Symmetry' };
  }
  if (type === 2) {
    const answer = '1.618';
    return { question: 'The Golden Ratio (φ) is approximately...', answer, options: ['1.618', '1.414', '3.142', '2.718'].sort(() => Math.random() - 0.5), type: 'Golden Ratio' };
  }
  const items = [
    { q: 'Sunflower seeds spiral in patterns of...', a: 'Fibonacci numbers', opts: ['Fibonacci numbers', 'Prime numbers', 'Square numbers', 'Random'] },
    { q: 'A snowflake has what type of symmetry?', a: '6-fold rotational', opts: ['6-fold rotational', '4-fold rotational', 'Bilateral', 'No symmetry'] },
    { q: 'Honeycomb cells are shaped like...', a: 'Hexagons', opts: ['Hexagons', 'Squares', 'Triangles', 'Circles'] },
  ][Math.floor(Math.random() * 3)];
  return { question: items.q, answer: items.a, options: items.opts.sort(() => Math.random() - 0.5), type: 'Nature' };
}

export default function PatternDecipher() {
  const [mode, setMode] = useState<PatMode>('fibonacci');
  const [fibCount, setFibCount] = useState(12);
  const [challenge, setChallenge] = useState(makeChallenge);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);

  const sequence = useMemo(() => fib(fibCount), [fibCount]);
  const ratios = useMemo(() => sequence.slice(2).map((v, i) => Math.round((v / sequence[i + 1]) * 10000) / 10000), [sequence]);

  const answerChallenge = (opt: string) => {
    if (feedback) return;
    if (opt === challenge.answer) { setFeedback('correct'); sfx.correct(); setScore(s => s + 10); setTimeout(() => { setChallenge(makeChallenge()); setFeedback(null); }, 1200); }
    else { setFeedback('wrong'); sfx.wrong(); setTimeout(() => setFeedback(null), 900); }
  };

  // Fibonacci spiral points
  const spiralSquares = useMemo(() => {
    const sq: { x: number; y: number; s: number; dir: number }[] = [];
    let x = 80, y = 60, lastW = 0, lastH = 0;
    for (let i = 2; i < Math.min(fibCount, 9); i++) {
      const s = sequence[i] * 3;
      const dir = (i - 2) % 4;
      if (dir === 0) { x += lastW; }
      else if (dir === 1) { y += lastH - s; x += lastW - s; }
      else if (dir === 2) { x -= s; y -= s; }
      else { y += lastH; }
      sq.push({ x, y, s, dir });
      lastW = s; lastH = s;
    }
    return sq;
  }, [sequence, fibCount]);

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🔍 Pattern Decipher</h2>
        <p className="text-purple-300 text-lg">Fibonacci, symmetry, and the Golden Ratio — patterns in nature!</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {[
          { id: 'fibonacci' as PatMode, e: '🌀', l: 'Fibonacci' },
          { id: 'symmetry' as PatMode, e: '🦋', l: 'Symmetry' },
          { id: 'nature' as PatMode, e: '🌻', l: 'In Nature' },
          { id: 'challenge' as PatMode, e: '🎯', l: 'Challenge' },
        ].map(m => (
          <button key={m.id} className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === m.id ? 'bg-amber-500/30 text-amber-300 border border-amber-400/50' : 'bg-white/5 text-gray-400'}`}
            onClick={() => { setMode(m.id); if (m.id === 'challenge') setChallenge(makeChallenge()); }}>{m.e} {m.l}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === 'fibonacci' && (
          <motion.div key="fib" className="max-w-3xl mx-auto space-y-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <label className="text-gray-400 text-sm">Terms:</label>
                <input type="range" min="5" max="18" value={fibCount} onChange={e => setFibCount(Number(e.target.value))} className="flex-1 accent-amber-500" />
                <span className="text-amber-400 font-bold">{fibCount}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {sequence.map((n, i) => (
                  <motion.span key={i} className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold font-mono text-sm border border-amber-500/30"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.04 }}>{n}</motion.span>
                ))}
              </div>
              <p className="text-gray-400 text-sm">Rule: each number = sum of the two before it. <span className="text-white font-mono">F(n) = F(n-1) + F(n-2)</span></p>
            </div>

            {/* Ratio convergence to phi */}
            <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-2xl p-5 border border-yellow-500/20">
              <h4 className="text-white font-bold mb-3">🌀 Ratios → Golden Ratio (φ ≈ 1.618)</h4>
              <div className="space-y-1">
                {ratios.slice(0, 10).map((r, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-gray-500 text-xs w-20">{sequence[i + 2]}/{sequence[i + 1]}</span>
                    <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-amber-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${Math.min(100, (r / 2) * 100)}%` }} transition={{ delay: i * 0.1 }} />
                    </div>
                    <span className={`text-xs font-mono w-14 text-right ${Math.abs(r - PHI) < 0.01 ? 'text-green-400' : 'text-gray-400'}`}>{r.toFixed(4)}</span>
                  </div>
                ))}
              </div>
              <p className="text-yellow-300 text-xs mt-3">As n increases, F(n)/F(n-1) → φ = {PHI.toFixed(6)}...</p>
            </div>

            {/* Spiral visualization */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex justify-center">
              <svg width="300" height="200" viewBox="0 0 300 200" className="bg-black/20 rounded-xl">
                {spiralSquares.map((sq, i) => (
                  <motion.rect key={i} x={sq.x} y={sq.y} width={sq.s} height={sq.s} fill="none" stroke={`hsl(${40 + i * 15}, 80%, 60%)`} strokeWidth="1.5" rx="2"
                    initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.7, scale: 1 }} transition={{ delay: i * 0.15 }} />
                ))}
              </svg>
            </div>
          </motion.div>
        )}

        {mode === 'symmetry' && (
          <motion.div key="sym" className="max-w-2xl mx-auto space-y-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <h4 className="text-white font-bold mb-4">🦋 Types of Symmetry</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: 'Reflective (Line)', emoji: '🦋', desc: 'A mirror line divides the shape into two identical halves.', example: 'Butterfly wings, human face', lines: 'fold in half' },
                  { name: 'Rotational', emoji: '🌀', desc: 'Shape looks the same after rotating less than 360°.', example: 'Starfish (5-fold), snowflake (6-fold)', lines: 'rotate & match' },
                  { name: 'Translational', emoji: '➡️', desc: 'Pattern repeats by sliding in one direction.', example: 'Brick wall, wallpaper patterns', lines: 'slide & repeat' },
                ].map(s => (
                  <div key={s.name} className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
                    <span className="text-4xl">{s.emoji}</span>
                    <h5 className="text-white font-bold mt-2 text-sm">{s.name}</h5>
                    <p className="text-gray-400 text-xs mt-1">{s.desc}</p>
                    <p className="text-amber-300 text-xs mt-2">📍 {s.example}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <h4 className="text-white font-bold mb-3">📐 Lines of Symmetry by Shape</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { shape: '○ Circle', lines: '∞' },
                  { shape: '□ Square', lines: '4' },
                  { shape: '△ Eq Triangle', lines: '3' },
                  { shape: '▭ Rectangle', lines: '2' },
                  { shape: '⬠ Pentagon', lines: '5' },
                  { shape: '⬡ Hexagon', lines: '6' },
                  { shape: '◇ Rhombus', lines: '2' },
                  { shape: '☆ Star (5pt)', lines: '5' },
                ].map(s => (
                  <div key={s.shape} className="bg-white/5 rounded-lg p-3 text-center border border-white/10">
                    <p className="text-white text-sm font-bold">{s.shape}</p>
                    <p className="text-amber-400 font-bold text-xl mt-1">{s.lines}</p>
                    <p className="text-gray-500 text-xs">lines</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {mode === 'nature' && (
          <motion.div key="nat" className="max-w-2xl mx-auto space-y-4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-5 border border-green-500/20">
              <h4 className="text-white font-bold mb-4">🌻 Math Patterns in Nature</h4>
              <div className="space-y-4">
                {[
                  { emoji: '🌻', title: 'Sunflower Spirals', desc: 'Seeds arrange in 21 and 34 spirals — consecutive Fibonacci numbers! This packing maximizes seeds per area.', pattern: 'Fibonacci' },
                  { emoji: '🐚', title: 'Nautilus Shell', desc: 'Each chamber is ~1.618× larger than the previous — a logarithmic spiral based on the Golden Ratio.', pattern: 'Golden Ratio' },
                  { emoji: '❄️', title: 'Snowflakes', desc: 'Every snowflake has 6-fold rotational symmetry because water molecules bond at 120° angles.', pattern: '6-fold Symmetry' },
                  { emoji: '🍍', title: 'Pineapple Scales', desc: 'Count the spirals: 8 going one way, 13 the other. Both Fibonacci numbers!', pattern: 'Fibonacci' },
                  { emoji: '🌿', title: 'Leaf Arrangement', desc: 'Leaves grow at angles of ~137.5° (the golden angle) to avoid blocking sunlight from leaves below.', pattern: 'Golden Angle' },
                  { emoji: '🐝', title: 'Honeycomb', desc: 'Hexagonal tiling is the most efficient way to divide a surface into equal areas with minimal perimeter.', pattern: 'Tessellation' },
                ].map(item => (
                  <motion.div key={item.title} className="bg-white/5 rounded-xl p-4 border border-white/10 flex gap-4 items-start"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <span className="text-4xl">{item.emoji}</span>
                    <div>
                      <h5 className="text-white font-bold">{item.title}</h5>
                      <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
                      <span className="inline-block mt-2 text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">{item.pattern}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {mode === 'challenge' && (
          <motion.div key="ch" className="max-w-lg mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className={`rounded-3xl p-6 border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'wrong' ? 'bg-red-500/10 border-red-500/40' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between mb-4"><span className="text-yellow-400 font-bold">⭐ {score}</span><span className="text-xs text-gray-400">{challenge.type}</span></div>
              <p className="text-xl font-bold text-white text-center mb-5">{challenge.question}</p>
              <div className="grid grid-cols-2 gap-3">
                {challenge.options.map(opt => (
                  <motion.button key={opt} className={`py-3 rounded-xl text-sm font-bold ${feedback === 'correct' && opt === challenge.answer ? 'bg-green-500 text-white' : feedback ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
                    whileHover={!feedback ? { scale: 1.05 } : {}} whileTap={!feedback ? { scale: 0.95 } : {}}
                    onClick={() => answerChallenge(opt)} disabled={!!feedback}>{opt}</motion.button>
                ))}
              </div>
              {feedback === 'correct' && <p className="text-green-400 font-bold text-center mt-4">✅ Correct!</p>}
              {feedback === 'wrong' && <p className="text-red-400 font-bold text-center mt-4">Answer: {challenge.answer}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
