import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function makeQuadraticChallenge() {
  const r1 = Math.floor(Math.random() * 11) - 5;
  let r2 = Math.floor(Math.random() * 11) - 5;
  if (r2 === r1) r2 += 1;
  const a = [1, 1, 1, -1][Math.floor(Math.random() * 4)];
  const b = -a * (r1 + r2);
  const c = a * r1 * r2;
  const answer = `${Math.min(r1, r2)}, ${Math.max(r1, r2)}`;
  const options = new Set<string>([answer]);
  while (options.size < 4) {
    const w1 = r1 + Math.floor(Math.random() * 5) - 2;
    const w2 = r2 + Math.floor(Math.random() * 5) - 2;
    options.add(`${Math.min(w1, w2)}, ${Math.max(w1, w2)}`);
  }
  return { a, b, c, roots: answer, options: [...options].sort(() => Math.random() - 0.5) };
}

function fmtTerm(coef: number, variable: string, first = false) {
  if (coef === 0) return '';
  const sign = coef > 0 ? (first ? '' : ' + ') : ' - ';
  const abs = Math.abs(coef);
  return `${sign}${abs === 1 && variable ? '' : abs}${variable}`;
}

function fmtEquation(a: number, b: number, c: number) {
  const parts = `${fmtTerm(a, 'x²', true)}${fmtTerm(b, 'x')}${fmtTerm(c, '')}`.trim();
  return `${parts || '0'} = 0`;
}

export default function QuadraticSolver() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-5);
  const [c, setC] = useState(6);
  const [mode, setMode] = useState<'explore' | 'challenge'>('explore');
  const [challenge, setChallenge] = useState(makeQuadraticChallenge);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);

  const calc = useMemo(() => {
    const d = b * b - 4 * a * c;
    const vertexX = -b / (2 * a);
    const vertexY = a * vertexX * vertexX + b * vertexX + c;
    const roots = d >= 0 ? [(-b - Math.sqrt(d)) / (2 * a), (-b + Math.sqrt(d)) / (2 * a)] : [];
    const factorable = roots.length === 2 && roots.every((r) => Math.abs(r - Math.round(r)) < 1e-9);
    return { d, vertexX, vertexY, roots, factorable };
  }, [a, b, c]);

  const answerChallenge = (option: string) => {
    if (feedback) return;
    if (option === challenge.roots) {
      setFeedback('correct');
      setScore((s) => s + 15);
      setTimeout(() => { setChallenge(makeQuadraticChallenge()); setFeedback(null); }, 1200);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 900);
    }
  };

  const graph = useMemo(() => {
    const size = 300;
    const range = 10;
    const unit = size / (range * 2);
    const cx = size / 2;
    const cy = size / 2;
    const sx = (x: number) => cx + x * unit;
    const sy = (y: number) => cy - y * unit;
    const points: { x: number; y: number }[] = [];
    for (let x = -10; x <= 10; x += 0.15) {
      const y = a * x * x + b * x + c;
      if (y >= -12 && y <= 12) points.push({ x, y });
    }
    return { size, range, unit, cx, cy, sx, sy, path: points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.x)} ${sy(p.y)}`).join(' ') };
  }, [a, b, c]);

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">📈 Quadratic Solver</h2>
        <p className="text-purple-300 text-lg">Explore roots, vertex, discriminant, and the quadratic formula.</p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'explore' ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => setMode('explore')}>🔍 Explore</button>
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'challenge' ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => { setMode('challenge'); setChallenge(makeQuadraticChallenge()); }}>🎯 Challenge</button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'challenge' ? (
          <motion.div key="challenge" className="max-w-lg mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className={`rounded-3xl p-6 border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'wrong' ? 'bg-red-500/10 border-red-500/40' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between mb-4"><span className="text-yellow-400 font-bold">⭐ {score}</span><span className="text-gray-400 text-sm">Find both roots</span></div>
              <p className="text-center text-3xl font-bold text-white font-mono mb-5">{fmtEquation(challenge.a, challenge.b, challenge.c)}</p>
              <div className="grid grid-cols-2 gap-3">
                {challenge.options.map((opt) => <motion.button key={opt} className={`py-3 rounded-xl text-lg font-bold ${feedback === 'correct' && opt === challenge.roots ? 'bg-green-500 text-white' : feedback ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`} whileHover={!feedback ? { scale: 1.05 } : {}} whileTap={!feedback ? { scale: 0.95 } : {}} onClick={() => answerChallenge(opt)} disabled={!!feedback}>x = {opt}</motion.button>)}
              </div>
              {feedback === 'correct' && <p className="text-green-400 text-center font-bold mt-4">✅ Correct roots!</p>}
              {feedback === 'wrong' && <p className="text-red-400 text-center font-bold mt-4">Try factoring or the formula.</p>}
            </div>
          </motion.div>
        ) : (
          <motion.div key="explore" className="grid grid-cols-1 lg:grid-cols-2 gap-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <p className="text-center text-2xl sm:text-3xl font-bold text-white font-mono mb-4">{fmtEquation(a, b, c)}</p>
                <CoeffSlider label="a" value={a} setValue={setA} min={-5} max={5} avoidZero />
                <CoeffSlider label="b" value={b} setValue={setB} min={-10} max={10} />
                <CoeffSlider label="c" value={c} setValue={setC} min={-10} max={10} />
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex justify-center">
                <svg width={graph.size} height={graph.size} className="bg-black/20 rounded-xl">
                  {Array.from({ length: graph.range * 2 + 1 }).map((_, i) => {
                    const pos = i * graph.unit;
                    return <g key={i}><line x1={pos} y1={0} x2={pos} y2={graph.size} stroke="rgba(255,255,255,0.05)" /><line x1={0} y1={pos} x2={graph.size} y2={pos} stroke="rgba(255,255,255,0.05)" /></g>;
                  })}
                  <line x1={0} y1={graph.cy} x2={graph.size} y2={graph.cy} stroke="rgba(255,255,255,0.3)" />
                  <line x1={graph.cx} y1={0} x2={graph.cx} y2={graph.size} stroke="rgba(255,255,255,0.3)" />
                  <motion.path d={graph.path} fill="none" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
                  {calc.roots.map((root, i) => Math.abs(root) <= 10 ? <g key={i}><circle cx={graph.sx(root)} cy={graph.sy(0)} r="5" fill="#22c55e" /><text x={graph.sx(root)} y={graph.sy(0) - 8} fill="#22c55e" fontSize="10" textAnchor="middle">{root.toFixed(1)}</text></g> : null)}
                  {Math.abs(calc.vertexX) <= 10 && Math.abs(calc.vertexY) <= 10 && <g><circle cx={graph.sx(calc.vertexX)} cy={graph.sy(calc.vertexY)} r="5" fill="#f59e0b" /><text x={graph.sx(calc.vertexX) + 8} y={graph.sy(calc.vertexY) - 8} fill="#f59e0b" fontSize="10">vertex</text></g>}
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              <InfoCard title="Discriminant" value={`D = ${calc.d.toFixed(2)}`} desc={calc.d > 0 ? 'Two real roots' : calc.d === 0 ? 'One repeated root' : 'No real roots'} color="text-yellow-400" />
              <InfoCard title="Vertex" value={`(${calc.vertexX.toFixed(2)}, ${calc.vertexY.toFixed(2)})`} desc={a > 0 ? 'Minimum point' : 'Maximum point'} color="text-orange-400" />
              <InfoCard title="Roots" value={calc.roots.length ? calc.roots.map((r) => r.toFixed(2)).join(', ') : 'No real roots'} desc={calc.factorable ? 'Factorable with integer roots' : 'Use formula or graph'} color="text-green-400" />
              <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                <h4 className="text-white font-bold mb-2">📝 Quadratic Formula</h4>
                <p className="text-gray-300 font-mono text-sm">x = (-b ± √(b² - 4ac)) / 2a</p>
                <p className="text-gray-500 text-sm mt-2">Here: x = ({-b} ± √{calc.d.toFixed(2)}) / {2 * a}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CoeffSlider({ label, value, setValue, min, max, avoidZero }: { label: string; value: number; setValue: (v: number) => void; min: number; max: number; avoidZero?: boolean }) {
  const update = (next: number) => setValue(avoidZero && next === 0 ? 1 : next);
  return (
    <div className="flex items-center gap-3 mb-3">
      <label className="text-purple-300 font-bold w-6">{label}</label>
      <input type="range" min={min} max={max} value={value} onChange={(e) => update(Number(e.target.value))} className="flex-1 accent-purple-500" />
      <span className="text-white font-bold w-8 text-right">{value}</span>
    </div>
  );
}

function InfoCard({ title, value, desc, color }: { title: string; value: string; desc: string; color: string }) {
  return (
    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
      <p className="text-gray-400 text-sm">{title}</p>
      <motion.p key={value} className={`text-2xl font-bold ${color}`} initial={{ scale: 0.7 }} animate={{ scale: 1 }}>{value}</motion.p>
      <p className="text-gray-500 text-sm mt-1">{desc}</p>
    </div>
  );
}
