import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trans, useTranslation } from "react-i18next";

function fmtEq(a: number, b: number, c: number) {
  const ax = a === 1 ? 'x' : a === -1 ? '-x' : `${a}x`;
  const by = Math.abs(b) === 1 ? (b > 0 ? 'y' : '-y') : `${Math.abs(b)}y`;
  return `${ax} ${b >= 0 ? '+' : '-'} ${by} = ${c}`;
}

function makeChallenge() {
  const x = Math.floor(Math.random() * 11) - 5;
  const y = Math.floor(Math.random() * 11) - 5;
  const a1 = Math.floor(Math.random() * 5) + 1;
  const b1 = Math.floor(Math.random() * 5) + 1;
  const a2 = Math.floor(Math.random() * 5) + 1;
  let b2 = Math.floor(Math.random() * 5) + 1;
  if (a1 * b2 === a2 * b1) b2 += 1;
  const c1 = a1 * x + b1 * y;
  const c2 = a2 * x + b2 * y;
  const answer = `(${x}, ${y})`;
  const wrongs = new Set<string>([answer]);
  while (wrongs.size < 4) wrongs.add(`(${x + Math.floor(Math.random() * 5) - 2}, ${y + Math.floor(Math.random() * 5) - 2})`);
  return { eq1: fmtEq(a1, b1, c1), eq2: fmtEq(a2, b2, c2), answer, options: [...wrongs].sort(() => Math.random() - 0.5), x, y, a1, b1, c1, a2, b2, c2 };
}

export default function SystemsOfEquations() {
    const { t } = useTranslation();
  const [a1, setA1] = useState(1);
  const [b1, setB1] = useState(1);
  const [c1, setC1] = useState(5);
  const [a2, setA2] = useState(2);
  const [b2, setB2] = useState(-1);
  const [c2, setC2] = useState(1);
  const [mode, setMode] = useState<'explore' | 'challenge'>('explore');
  const [challenge, setChallenge] = useState(makeChallenge);
  const [feedback, setFeedback] = useState<'correct' | 'hint' | null>(null);
  const [mastery, setMastery] = useState(0);

  const solution = useMemo(() => {
    const det = a1 * b2 - a2 * b1;
    if (det === 0) return null;
    const x = (c1 * b2 - c2 * b1) / det;
    const y = (a1 * c2 - a2 * c1) / det;
    return { x, y };
  }, [a1, b1, c1, a2, b2, c2]);

  const graphSize = 300;
  const graphRange = 10;
  const unit = graphSize / (graphRange * 2);
  const cx = graphSize / 2;
  const cy = graphSize / 2;
  const toSvgX = (x: number) => cx + x * unit;
  const toSvgY = (y: number) => cy - y * unit;

  const linePoints = (a: number, b: number, c: number) => {
    if (b === 0 && a !== 0) {
      const x = c / a;
      return { x1: toSvgX(x), y1: 0, x2: toSvgX(x), y2: graphSize };
    }
    if (b === 0) return null;
    const yAtXMin = (c - a * (-graphRange)) / b;
    const yAtXMax = (c - a * graphRange) / b;
    return { x1: toSvgX(-graphRange), y1: toSvgY(yAtXMin), x2: toSvgX(graphRange), y2: toSvgY(yAtXMax) };
  };

  const line1 = linePoints(a1, b1, c1);
  const line2 = linePoints(a2, b2, c2);

  const answerChallenge = (opt: string) => {
    if (feedback) return;
    if (opt === challenge.answer) {
      setFeedback('correct'); setMastery(m => m + 1);
      setTimeout(() => { setChallenge(makeChallenge()); setFeedback(null); }, 1200);
    } else { setFeedback('hint'); setTimeout(() => setFeedback(null), 900); }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2"><Trans i18nKey="auto.systemsofequations.systems_of_equations">🔗 Systems of Equations</Trans></h2>
        <p className="text-purple-300 text-lg"><Trans i18nKey="auto.systemsofequations.find_where_two_lines_cross">Find where two lines cross!</Trans></p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'explore' ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => setMode('explore')}><Trans i18nKey="auto.systemsofequations.explore">🔍 Explore</Trans></button>
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'challenge' ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => { setMode('challenge'); setChallenge(makeChallenge()); }}><Trans i18nKey="auto.systemsofequations.challenge">🎯 Challenge</Trans></button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'challenge' ? (
          <motion.div key="ch" className="max-w-lg mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className={`rounded-3xl p-6 border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'hint' ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between mb-4"><span className="text-yellow-400 font-bold">⭐ {mastery}</span></div>
              <p className="text-white font-bold text-center mb-1 font-mono text-lg">{challenge.eq1}</p>
              <p className="text-white font-bold text-center mb-4 font-mono text-lg">{challenge.eq2}</p>
              <p className="text-gray-400 text-center text-sm mb-4"><Trans i18nKey="auto.systemsofequations.find_x_y">Find (x, y)</Trans></p>
              <div className="grid grid-cols-2 gap-3">
                {challenge.options.map(opt => (
                  <motion.button key={opt} className={`py-3 rounded-xl text-lg font-bold font-mono ${feedback === 'correct' && opt === challenge.answer ? 'bg-green-500 text-white' : feedback ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
                    whileHover={!feedback ? { scale: 1.05 } : {}} whileTap={!feedback ? { scale: 0.95 } : {}}
                    onClick={() => answerChallenge(opt)} disabled={!!feedback}>{opt}</motion.button>
                ))}
              </div>
              {feedback === 'correct' && <p className="text-green-400 font-bold text-center mt-4"><Trans i18nKey="auto.systemsofequations.correct">✅ Correct!</Trans></p>}
              {feedback === 'hint' && <p className="text-sky-400 font-bold text-center mt-4"><Trans i18nKey="auto.systemsofequations.answer">Answer:</Trans> {challenge.answer}</p>}
            </div>
          </motion.div>
        ) : (
          <motion.div key="ex" className="grid grid-cols-1 lg:grid-cols-2 gap-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="space-y-4">
              {/* Equation inputs */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <h4 className="text-blue-400 font-bold mb-2"><Trans i18nKey="auto.systemsofequations.line_1">Line 1</Trans></h4>
                <p className="text-white font-mono text-lg mb-2">{fmtEq(a1, b1, c1)}</p>
                <div className="grid grid-cols-3 gap-2">
                  <Slider label={t('auto.attr.systemsofequations.a')} value={a1} min={-5} max={5} set={setA1} />
                  <Slider label={t('auto.attr.systemsofequations.b')} value={b1} min={-5} max={5} set={setB1} />
                  <Slider label={t('auto.attr.systemsofequations.c')} value={c1} min={-10} max={10} set={setC1} />
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <h4 className="text-sky-400 font-bold mb-2"><Trans i18nKey="auto.systemsofequations.line_2">Line 2</Trans></h4>
                <p className="text-white font-mono text-lg mb-2">{fmtEq(a2, b2, c2)}</p>
                <div className="grid grid-cols-3 gap-2">
                  <Slider label={t('auto.attr.systemsofequations.a')} value={a2} min={-5} max={5} set={setA2} />
                  <Slider label={t('auto.attr.systemsofequations.b')} value={b2} min={-5} max={5} set={setB2} />
                  <Slider label={t('auto.attr.systemsofequations.c')} value={c2} min={-10} max={10} set={setC2} />
                </div>
              </div>

              {/* Solution */}
              <div className={`rounded-2xl p-5 border-2 text-center ${solution ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                {solution ? (
                  <>
                    <p className="text-gray-400 text-sm"><Trans i18nKey="auto.systemsofequations.intersection">Intersection</Trans></p>
                    <motion.p key={`${solution.x}-${solution.y}`} className="text-3xl font-bold text-green-400" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                      ({solution.x.toFixed(2)}, {solution.y.toFixed(2)})
                    </motion.p>
                  </>
                ) : (
                  <p className="text-sky-400 font-bold"><Trans i18nKey="auto.systemsofequations.no_unique_solution_lines_are_p">No unique solution — lines are parallel</Trans></p>
                )}
              </div>
            </div>

            {/* Graph */}
            <div className="bg-white/5 rounded-3xl p-4 border border-white/10 flex justify-center">
              <svg width={graphSize} height={graphSize} className="bg-black/20 rounded-xl">
                {Array.from({ length: graphRange * 2 + 1 }).map((_, i) => {
                    const { t } = useTranslation();
                  const pos = i * unit;
                  return <g key={i}><line x1={pos} y1={0} x2={pos} y2={graphSize} stroke="rgba(255,255,255,0.05)" /><line x1={0} y1={pos} x2={graphSize} y2={pos} stroke="rgba(255,255,255,0.05)" /></g>;
                })}
                <line x1={0} y1={cy} x2={graphSize} y2={cy} stroke="rgba(255,255,255,0.3)" />
                <line x1={cx} y1={0} x2={cx} y2={graphSize} stroke="rgba(255,255,255,0.3)" />
                {line1 && <motion.line {...line1} stroke="#3b82f6" strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
                {line2 && <motion.line {...line2} stroke="#f97316" strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
                {solution && Math.abs(solution.x) <= graphRange && Math.abs(solution.y) <= graphRange && (
                  <motion.circle cx={toSvgX(solution.x)} cy={toSvgY(solution.y)} r="7" fill="#22c55e" stroke="white" strokeWidth="2"
                    initial={{ scale: 0 }} animate={{ scale: [0, 1.5, 1] }} />
                )}
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Slider({ label, value, min, max, set }: { label: string; value: number; min: number; max: number; set: (v: number) => void }) {
    const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center">
      <label className="text-gray-400 text-sm">{label}</label>
      <input type="range" min={min} max={max} value={value} onChange={e => set(Number(e.target.value))} className="w-full accent-purple-500" />
      <span className="text-white font-bold text-sm">{value}</span>
    </div>
  );
}
