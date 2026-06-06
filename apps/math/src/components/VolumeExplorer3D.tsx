import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Shape = 'cube' | 'rectPrism' | 'cylinder' | 'cone' | 'sphere';

const shapeMeta: { id: Shape; label: string; emoji: string; color: string }[] = [
  { id: 'cube', label: 'Cube', emoji: '🧊', color: 'from-blue-500 to-cyan-500' },
  { id: 'rectPrism', label: 'Rectangular Prism', emoji: '📦', color: 'from-purple-500 to-indigo-500' },
  { id: 'cylinder', label: 'Cylinder', emoji: '🥫', color: 'from-green-500 to-emerald-500' },
  { id: 'cone', label: 'Cone', emoji: '🍦', color: 'from-orange-500 to-amber-500' },
  { id: 'sphere', label: 'Sphere', emoji: '🌐', color: 'from-pink-500 to-rose-500' },
];

function makeVolumeChallenge() {
  const shape = shapeMeta[Math.floor(Math.random() * shapeMeta.length)].id;
  const a = Math.floor(Math.random() * 6) + 2;
  const b = Math.floor(Math.random() * 6) + 2;
  const c = Math.floor(Math.random() * 6) + 2;
  let question = '';
  let answer = 0;
  if (shape === 'cube') { question = `Cube with side ${a}: volume?`; answer = a ** 3; }
  if (shape === 'rectPrism') { question = `Prism ${a} × ${b} × ${c}: volume?`; answer = a * b * c; }
  if (shape === 'cylinder') { question = `Cylinder r=${a}, h=${b}: volume? Use π≈3.14`; answer = Math.round(Math.PI * a * a * b); }
  if (shape === 'cone') { question = `Cone r=${a}, h=${b}: volume? Use π≈3.14`; answer = Math.round((Math.PI * a * a * b) / 3); }
  if (shape === 'sphere') { question = `Sphere r=${a}: volume? Use π≈3.14`; answer = Math.round((4 / 3) * Math.PI * a ** 3); }
  const wrongs = new Set<number>();
  while (wrongs.size < 3) {
    const w = Math.max(1, answer + Math.floor((Math.random() - 0.5) * Math.max(20, answer * 0.6)));
    if (w !== answer) wrongs.add(w);
  }
  return { question, answer, options: [answer, ...wrongs].sort(() => Math.random() - 0.5) };
}

export default function VolumeExplorer3D() {
  const [shape, setShape] = useState<Shape>('cube');
  const [a, setA] = useState(4);
  const [b, setB] = useState(6);
  const [c, setC] = useState(5);
  const [mode, setMode] = useState<'explore' | 'challenge'>('explore');
  const [challenge, setChallenge] = useState(makeVolumeChallenge);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);

  const calc = useMemo(() => {
    switch (shape) {
      case 'cube': return { volume: a ** 3, surface: 6 * a * a, formula: `V = s³ = ${a}³`, surfaceFormula: `SA = 6s² = 6 × ${a}²` };
      case 'rectPrism': return { volume: a * b * c, surface: 2 * (a * b + a * c + b * c), formula: `V = lwh = ${a}×${b}×${c}`, surfaceFormula: `SA = 2(lw+lh+wh)` };
      case 'cylinder': return { volume: Math.PI * a * a * b, surface: 2 * Math.PI * a * (a + b), formula: `V = πr²h = π×${a}²×${b}`, surfaceFormula: `SA = 2πr(r+h)` };
      case 'cone': return { volume: (Math.PI * a * a * b) / 3, surface: Math.PI * a * (a + Math.sqrt(a * a + b * b)), formula: `V = ⅓πr²h = ⅓π×${a}²×${b}`, surfaceFormula: `SA = πr(r+√(r²+h²))` };
      case 'sphere': return { volume: (4 / 3) * Math.PI * a ** 3, surface: 4 * Math.PI * a * a, formula: `V = 4/3πr³ = 4/3π×${a}³`, surfaceFormula: `SA = 4πr²` };
    }
  }, [shape, a, b, c]);

  const answerChallenge = (opt: number) => {
    if (feedback) return;
    if (opt === challenge.answer) {
      setFeedback('correct');
      setScore((s) => s + 10);
      setTimeout(() => { setChallenge(makeVolumeChallenge()); setFeedback(null); }, 1200);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 900);
    }
  };

  const renderShape = () => {
    const active = shapeMeta.find((s) => s.id === shape)!;
    if (shape === 'cube' || shape === 'rectPrism') {
      return (
        <motion.div className="relative w-44 h-44 preserve-3d" animate={{ rotateX: [18, 28, 18], rotateY: [20, 45, 20] }} transition={{ duration: 6, repeat: Infinity }}>
          <div className={`absolute inset-8 bg-gradient-to-br ${active.color} opacity-70 border border-white/30`} style={{ transform: 'translateZ(42px)' }} />
          <div className={`absolute inset-8 bg-gradient-to-br ${active.color} opacity-40 border border-white/20`} style={{ transform: 'rotateY(90deg) translateZ(42px)' }} />
          <div className={`absolute inset-8 bg-gradient-to-br ${active.color} opacity-55 border border-white/20`} style={{ transform: 'rotateX(90deg) translateZ(42px)' }} />
          <div className="absolute inset-0 flex items-center justify-center text-5xl">{active.emoji}</div>
        </motion.div>
      );
    }
    if (shape === 'cylinder') {
      return <motion.div className="relative w-40 min-h-48" animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity }}><div className="absolute top-4 left-6 w-28 h-10 rounded-full bg-green-400/70 border-2 border-green-200" /><div className="absolute top-9 left-6 w-28 h-28 bg-gradient-to-b from-green-400/70 to-emerald-700/70 border-x-2 border-green-200" /><div className="absolute bottom-6 left-6 w-28 h-10 rounded-full bg-emerald-500/70 border-2 border-green-200" /><span className="absolute inset-0 flex items-center justify-center text-5xl">🥫</span></motion.div>;
    }
    if (shape === 'cone') {
      return <motion.div className="relative w-44 min-h-48" animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity }}><div className="absolute left-8 top-6 w-0 h-0 border-l-[56px] border-r-[56px] border-b-[130px] border-l-transparent border-r-transparent border-b-orange-400/70" /><div className="absolute bottom-4 left-8 w-28 h-10 rounded-full bg-amber-500/70 border-2 border-amber-200" /><span className="absolute inset-0 flex items-center justify-center text-5xl">🍦</span></motion.div>;
    }
    return <motion.div className="w-40 min-h-40 rounded-full bg-gradient-to-br from-white/50 via-pink-400/70 to-rose-800/80 shadow-2xl shadow-pink-500/30 flex items-center justify-center text-5xl" animate={{ rotate: [0, 360], y: [0, -8, 0] }} transition={{ rotate: { duration: 10, repeat: Infinity, ease: 'linear' }, y: { duration: 3, repeat: Infinity } }}>🌐</motion.div>;
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">📦 3D Volume Explorer</h2>
        <p className="text-purple-300 text-lg">Rotate shapes in your mind and calculate volume and surface area.</p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'explore' ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => setMode('explore')}>🔍 Explore</button>
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === 'challenge' ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => { setMode('challenge'); setChallenge(makeVolumeChallenge()); }}>🎯 Challenge</button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'challenge' ? (
          <motion.div key="challenge" className="max-w-lg mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className={`rounded-3xl p-6 border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'wrong' ? 'bg-red-500/10 border-red-500/40' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between mb-4"><span className="text-yellow-400 font-bold">⭐ {score}</span><span className="text-gray-400 text-sm">Round answers</span></div>
              <p className="text-2xl font-bold text-white text-center mb-5">{challenge.question}</p>
              <div className="grid grid-cols-2 gap-3">
                {challenge.options.map((option) => <motion.button key={option} className={`py-3 rounded-xl text-xl font-bold ${feedback === 'correct' && option === challenge.answer ? 'bg-green-500 text-white' : feedback ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`} whileHover={!feedback ? { scale: 1.05 } : {}} whileTap={!feedback ? { scale: 0.95 } : {}} onClick={() => answerChallenge(option)} disabled={!!feedback}>{option}</motion.button>)}
              </div>
              {feedback === 'correct' && <p className="text-green-400 font-bold text-center mt-4">✅ Correct!</p>}
              {feedback === 'wrong' && <p className="text-red-400 font-bold text-center mt-4">Try again.</p>}
            </div>
          </motion.div>
        ) : (
          <motion.div key="explore" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap justify-center gap-2">
                {shapeMeta.map((s) => <button key={s.id} className={`px-3 py-2 rounded-xl text-sm font-bold ${shape === s.id ? 'bg-purple-500/40 text-white border border-purple-400' : 'bg-white/10 text-gray-400'}`} onClick={() => setShape(s.id)}>{s.emoji} {s.label}</button>)}
              </div>
              <div className="bg-white/5 rounded-3xl p-8 border border-white/10 flex items-center justify-center min-h-72 perspective-1000">{renderShape()}</div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-3">
                <Slider label={shape === 'cube' ? 'Side' : shape === 'sphere' ? 'Radius' : 'Radius / Length'} value={a} setValue={setA} color="accent-blue-500" />
                {shape !== 'cube' && shape !== 'sphere' && <Slider label="Height / Width" value={b} setValue={setB} color="accent-green-500" />}
                {shape === 'rectPrism' && <Slider label="Depth" value={c} setValue={setC} color="accent-yellow-500" />}
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20">
                <p className="text-gray-400 text-sm">Volume formula</p>
                <p className="text-white font-mono text-lg font-bold">{calc.formula}</p>
                <motion.p key={calc.volume} className="text-4xl font-bold text-blue-400 mt-3" initial={{ scale: 0.6 }} animate={{ scale: 1 }}>V = {calc.volume.toFixed(2)}</motion.p>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20">
                <p className="text-gray-400 text-sm">Surface area formula</p>
                <p className="text-white font-mono text-lg font-bold">{calc.surfaceFormula}</p>
                <motion.p key={calc.surface} className="text-4xl font-bold text-green-400 mt-3" initial={{ scale: 0.6 }} animate={{ scale: 1 }}>SA = {calc.surface.toFixed(2)}</motion.p>
              </div>
              <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20 text-sm text-purple-200">
                💡 Volume measures how much space is inside. Surface area measures the total outside skin.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Slider({ label, value, setValue, color }: { label: string; value: number; setValue: (v: number) => void; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-gray-400 text-sm w-28">{label}</label>
      <input type="range" min="1" max="12" value={value} onChange={(e) => setValue(Number(e.target.value))} className={`flex-1 ${color}`} />
      <span className="text-white font-bold w-8 text-right">{value}</span>
    </div>
  );
}
