import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trans } from "react-i18next";

interface ShapeInfo {
  name: string; emoji: string; sides: number | string; vertices: number | string;
  angle: string; formula: string; color: string; dim: '2D' | '3D';
  faces?: number; edges?: number;
  draw: (cx: number, cy: number, r: number) => string;
}

const shapes2D: ShapeInfo[] = [
  { name: 'Triangle', emoji: '🔺', sides: 3, vertices: 3, angle: '60° (equilateral)', formula: 'A = ½bh', color: 'text-sky-400', dim: '2D',
    draw: (cx, cy, r) => { const pts = [0, 1, 2].map(i => { const a = (i * 120 - 90) * Math.PI / 180; return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`; }); return `M ${pts.join(' L ')} Z`; } },
  { name: 'Square', emoji: '🟦', sides: 4, vertices: 4, angle: '90°', formula: 'A = s²', color: 'text-blue-400', dim: '2D',
    draw: (cx, cy, r) => { const pts = [0, 1, 2, 3].map(i => { const a = (i * 90 + 45) * Math.PI / 180; return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`; }); return `M ${pts.join(' L ')} Z`; } },
  { name: 'Pentagon', emoji: '⬠', sides: 5, vertices: 5, angle: '108°', formula: 'A = ¼√(5(5+2√5))s²', color: 'text-green-400', dim: '2D',
    draw: (cx, cy, r) => { const pts = [0, 1, 2, 3, 4].map(i => { const a = (i * 72 - 90) * Math.PI / 180; return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`; }); return `M ${pts.join(' L ')} Z`; } },
  { name: 'Hexagon', emoji: '⬡', sides: 6, vertices: 6, angle: '120°', formula: 'A = (3√3/2)s²', color: 'text-yellow-400', dim: '2D',
    draw: (cx, cy, r) => { const pts = [0, 1, 2, 3, 4, 5].map(i => { const a = (i * 60 - 90) * Math.PI / 180; return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`; }); return `M ${pts.join(' L ')} Z`; } },
  { name: 'Octagon', emoji: '🛑', sides: 8, vertices: 8, angle: '135°', formula: 'A = 2(1+√2)s²', color: 'text-sky-400', dim: '2D',
    draw: (cx, cy, r) => { const pts = [0,1,2,3,4,5,6,7].map(i => { const a = (i * 45 - 22.5) * Math.PI / 180; return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`; }); return `M ${pts.join(' L ')} Z`; } },
  { name: 'Circle', emoji: '🔴', sides: '∞', vertices: 0, angle: '—', formula: 'A = πr²', color: 'text-pink-400', dim: '2D',
    draw: (cx, cy, r) => `M ${cx - r},${cy} A ${r} ${r} 0 1 0 ${cx + r},${cy} A ${r} ${r} 0 1 0 ${cx - r},${cy}` },
];

const shapes3D: ShapeInfo[] = [
  { name: 'Tetrahedron', emoji: '🔺', sides: 4, vertices: 4, faces: 4, edges: 6, angle: '60°', formula: 'V = (√2/12)a³', color: 'text-red-300', dim: '3D',
    draw: (cx, cy, r) => { const pts = [0, 1, 2].map(i => { const a = (i * 120 - 90) * Math.PI / 180; return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`; }); return `M ${pts.join(' L ')} Z M ${pts[0]} L ${cx},${cy - r * 0.3} L ${pts[2]}`; } },
  { name: 'Cube', emoji: '🧊', sides: 6, vertices: 8, faces: 6, edges: 12, angle: '90°', formula: 'V = s³', color: 'text-cyan-300', dim: '3D',
    draw: (cx, cy, r) => `M ${cx - r * 0.7},${cy - r * 0.4} L ${cx + r * 0.3},${cy - r * 0.8} L ${cx + r * 0.9},${cy - r * 0.2} L ${cx - r * 0.1},${cy + r * 0.2} Z M ${cx - r * 0.1},${cy + r * 0.2} L ${cx - r * 0.1},${cy + r * 0.9} L ${cx + r * 0.9},${cy + r * 0.5} L ${cx + r * 0.9},${cy - r * 0.2} M ${cx - r * 0.1},${cy + r * 0.9} L ${cx - r * 0.7},${cy + r * 0.3} L ${cx - r * 0.7},${cy - r * 0.4}` },
  { name: 'Sphere', emoji: '🌐', sides: '—', vertices: 0, faces: 1, edges: 0, angle: '—', formula: 'V = 4/3πr³', color: 'text-purple-300', dim: '3D',
    draw: (cx, cy, r) => `M ${cx - r},${cy} A ${r} ${r} 0 1 0 ${cx + r},${cy} A ${r} ${r} 0 1 0 ${cx - r},${cy} M ${cx - r},${cy} Q ${cx},${cy + r * 0.35} ${cx + r},${cy} M ${cx - r},${cy} Q ${cx},${cy - r * 0.35} ${cx + r},${cy}` },
  { name: 'Cylinder', emoji: '🥫', sides: 3, vertices: 0, faces: 3, edges: 2, angle: '—', formula: 'V = πr²h', color: 'text-green-300', dim: '3D',
    draw: (cx, cy, r) => `M ${cx - r * 0.8},${cy - r * 0.5} L ${cx - r * 0.8},${cy + r * 0.5} A ${r * 0.8} ${r * 0.3} 0 0 0 ${cx + r * 0.8},${cy + r * 0.5} L ${cx + r * 0.8},${cy - r * 0.5} A ${r * 0.8} ${r * 0.3} 0 0 0 ${cx - r * 0.8},${cy - r * 0.5} A ${r * 0.8} ${r * 0.3} 0 0 1 ${cx + r * 0.8},${cy - r * 0.5}` },
  { name: 'Cone', emoji: '🍦', sides: 2, vertices: 1, faces: 2, edges: 1, angle: '—', formula: 'V = ⅓πr²h', color: 'text-amber-300', dim: '3D',
    draw: (cx, cy, r) => `M ${cx},${cy - r} L ${cx - r * 0.8},${cy + r * 0.5} A ${r * 0.8} ${r * 0.3} 0 0 0 ${cx + r * 0.8},${cy + r * 0.5} Z` },
];

function makeQuiz() {
  const all = [...shapes2D, ...shapes3D];
  const shape = all[Math.floor(Math.random() * all.length)];
  const props = ['sides', 'vertices', 'name'];
  const prop = props[Math.floor(Math.random() * props.length)] as 'sides' | 'vertices' | 'name';
  const answer = String(shape[prop]);
  const options = new Set<string>([answer]);
  while (options.size < 4) {
    const other = all[Math.floor(Math.random() * all.length)];
    const v = String(other[prop]);
    if (v !== answer) options.add(v);
  }
  return { shape, prop, answer, options: [...options].sort(() => Math.random() - 0.5) };
}

export default function ShapeSafari() {
  const [dim, setDim] = useState<'2D' | '3D'>('2D');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [mode, setMode] = useState<'explore' | 'quiz'>('explore');
  const [quiz, setQuiz] = useState(makeQuiz);
  const [feedback, setFeedback] = useState<'correct' | 'hint' | null>(null);
  const [mastery, setMastery] = useState(0);

  const list = dim === '2D' ? shapes2D : shapes3D;
  const selected = list[selectedIdx] || list[0];

  const answerQuiz = (opt: string) => {
    if (feedback) return;
    if (opt === quiz.answer) {
      setFeedback('correct'); setMastery(m => m + 1);
      setTimeout(() => { setQuiz(makeQuiz()); setFeedback(null); }, 1200);
    } else { setFeedback('hint'); setTimeout(() => setFeedback(null), 900); }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2"><Trans i18nKey="auto.shapesafari.shape_safari">🔷 Shape Safari</Trans></h2>
        <p className="text-purple-300 text-lg"><Trans i18nKey="auto.shapesafari.discover_2d_and_3d_shapes_and_">Discover 2D and 3D shapes and their properties!</Trans></p>
      </div>

      <div className="flex justify-center gap-2 mb-4">
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${dim === '2D' ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => { setDim('2D'); setSelectedIdx(0); }}><Trans i18nKey="auto.shapesafari.2d_shapes">🔷 2D Shapes</Trans></button>
        <button className={`px-4 py-2 rounded-xl font-bold text-sm ${dim === '3D' ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => { setDim('3D'); setSelectedIdx(0); }}><Trans i18nKey="auto.shapesafari.3d_shapes">🧊 3D Shapes</Trans></button>
      </div>
      <div className="flex justify-center gap-2 mb-6">
        <button className={`px-4 py-2 rounded-xl text-sm font-bold ${mode === 'explore' ? 'bg-green-500/30 text-green-300' : 'bg-white/5 text-gray-400'}`} onClick={() => setMode('explore')}><Trans i18nKey="auto.shapesafari.explore">🔍 Explore</Trans></button>
        <button className={`px-4 py-2 rounded-xl text-sm font-bold ${mode === 'quiz' ? 'bg-orange-500/30 text-orange-300' : 'bg-white/5 text-gray-400'}`} onClick={() => { setMode('quiz'); setQuiz(makeQuiz()); }}><Trans i18nKey="auto.shapesafari.quiz">🎯 Quiz</Trans></button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'quiz' ? (
          <motion.div key="quiz" className="max-w-lg mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className={`rounded-3xl p-6 border-2 ${feedback === 'correct' ? 'bg-green-500/10 border-green-500/40' : feedback === 'hint' ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between mb-4"><span className="text-yellow-400 font-bold">⭐ {mastery}</span></div>
              <div className="flex justify-center mb-4">
                <svg width="120" height="120" viewBox="0 0 120 120"><path d={quiz.shape.draw(60, 60, 40)} fill="rgba(168,85,247,0.2)" stroke="#a855f7" strokeWidth="2.5" /></svg>
              </div>
              <p className="text-xl font-bold text-white text-center mb-4">
                {quiz.prop === 'sides' && `How many sides does a ${quiz.shape.name} have?`}
                {quiz.prop === 'vertices' && `How many vertices does a ${quiz.shape.name} have?`}
                {quiz.prop === 'name' && 'What is this shape called?'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {quiz.options.map(opt => (
                  <motion.button key={opt} className={`py-3 rounded-xl text-lg font-bold ${feedback === 'correct' && opt === quiz.answer ? 'bg-green-500 text-white' : feedback ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`} whileHover={!feedback ? { scale: 1.05 } : {}} whileTap={!feedback ? { scale: 0.95 } : {}} onClick={() => answerQuiz(opt)} disabled={!!feedback}>{opt}</motion.button>
                ))}
              </div>
              {feedback === 'correct' && <p className="text-green-400 font-bold text-center mt-4"><Trans i18nKey="auto.shapesafari.correct">✅ Correct!</Trans></p>}
              {feedback === 'hint' && <p className="text-sky-400 font-bold text-center mt-4"><Trans i18nKey="auto.shapesafari.answer">Answer:</Trans> {quiz.answer}</p>}
            </div>
          </motion.div>
        ) : (
          <motion.div key="explore" className="grid grid-cols-1 lg:grid-cols-2 gap-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="space-y-4">
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {list.map((s, i) => (
                  <motion.button key={s.name} className={`p-3 rounded-xl border-2 text-center ${selectedIdx === i ? 'border-purple-400 bg-purple-500/20' : 'border-white/10 bg-white/5'}`}
                    whileTap={{ scale: 0.95 }} onClick={() => setSelectedIdx(i)}>
                    <span className="text-2xl">{s.emoji}</span>
                    <p className="text-white text-sm font-bold mt-1">{s.name}</p>
                  </motion.button>
                ))}
              </div>
              <div className="bg-white/5 rounded-3xl p-8 border border-white/10 flex items-center justify-center">
                <motion.svg key={selected.name} width="180" height="180" viewBox="0 0 180 180"
                  initial={{ rotate: -10, scale: 0.7 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring' }}>
                  <path d={selected.draw(90, 90, 60)} fill="rgba(168,85,247,0.15)" stroke="#a855f7" strokeWidth="3" />
                </motion.svg>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className={`text-3xl font-bold ${selected.color}`}>{selected.emoji} {selected.name}</h3>
              {[
                { label: 'Sides / Faces', value: selected.dim === '3D' ? `${selected.faces} faces, ${selected.edges} edges` : `${selected.sides} sides` },
                { label: 'Vertices', value: String(selected.vertices) },
                { label: 'Interior angle', value: selected.angle },
                { label: 'Key formula', value: selected.formula },
                { label: 'Dimension', value: selected.dim },
              ].map(p => (
                <div key={p.label} className="bg-white/5 rounded-xl px-4 py-3 border border-white/10 flex justify-between">
                  <span className="text-gray-400 text-sm">{p.label}</span>
                  <span className="text-white font-bold text-sm">{p.value}</span>
                </div>
              ))}
              {selected.dim === '3D' && (
                <div className="bg-purple-500/10 rounded-xl p-3 border border-purple-500/20 text-sm text-purple-300">
                  💡 <strong><Trans i18nKey="auto.shapesafari.euler_s_formula">Euler's formula:</Trans></strong> <Trans i18nKey="auto.shapesafari.v_e_f">V − E + F =</Trans> {selected.vertices} − {selected.edges} + {selected.faces} = {Number(selected.vertices) - Number(selected.edges) + Number(selected.faces!)} <Trans i18nKey="auto.shapesafari.always_2_for_simple_polyhedra">(always 2 for simple polyhedra)</Trans>
                                                      </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
