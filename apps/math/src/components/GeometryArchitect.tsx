import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '../lib/soundEngine';

interface Net { name: string; emoji: string; faces: number; edges: number; vertices: number; volume: string; surfaceArea: string; netPanels: { x: number; y: number; w: number; h: number; color: string; label?: string }[]; desc: string }

const NETS: Net[] = [
  {
    name: 'Cube', emoji: '🧊', faces: 6, edges: 12, vertices: 8,
    volume: 'V = s³', surfaceArea: 'SA = 6s²',
    desc: 'A cube net is a cross of 6 squares. Fold the 4 sides up and close the top.',
    netPanels: [
      { x: 60, y: 0, w: 50, h: 50, color: '#3b82f6', label: 'Top' },
      { x: 0, y: 55, w: 50, h: 50, color: '#60a5fa', label: 'Left' },
      { x: 60, y: 55, w: 50, h: 50, color: '#2563eb', label: 'Front' },
      { x: 120, y: 55, w: 50, h: 50, color: '#60a5fa', label: 'Right' },
      { x: 180, y: 55, w: 50, h: 50, color: '#93c5fd', label: 'Back' },
      { x: 60, y: 110, w: 50, h: 50, color: '#3b82f6', label: 'Bottom' },
    ],
  },
  {
    name: 'Rectangular Prism', emoji: '📦', faces: 6, edges: 12, vertices: 8,
    volume: 'V = lwh', surfaceArea: 'SA = 2(lw+lh+wh)',
    desc: 'Like a cube net but with rectangles of different sizes for length, width, height.',
    netPanels: [
      { x: 70, y: 0, w: 60, h: 40, color: '#8b5cf6', label: 'Top' },
      { x: 0, y: 45, w: 60, h: 40, color: '#a78bfa', label: 'Left' },
      { x: 70, y: 45, w: 60, h: 40, color: '#7c3aed', label: 'Front' },
      { x: 140, y: 45, w: 60, h: 40, color: '#a78bfa', label: 'Right' },
      { x: 210, y: 45, w: 60, h: 40, color: '#c4b5fd', label: 'Back' },
      { x: 70, y: 90, w: 60, h: 40, color: '#8b5cf6', label: 'Bottom' },
    ],
  },
  {
    name: 'Triangular Prism', emoji: '🔺', faces: 5, edges: 9, vertices: 6,
    volume: 'V = ½bhl', surfaceArea: 'SA = bh + 2ls + lb',
    desc: '2 triangular ends connected by 3 rectangular sides. Think Toblerone box!',
    netPanels: [
      { x: 30, y: 0, w: 60, h: 35, color: '#22c55e', label: '△ Top' },
      { x: 0, y: 40, w: 50, h: 70, color: '#4ade80', label: 'Side' },
      { x: 55, y: 40, w: 60, h: 70, color: '#16a34a', label: 'Front' },
      { x: 120, y: 40, w: 50, h: 70, color: '#4ade80', label: 'Side' },
      { x: 55, y: 115, w: 60, h: 35, color: '#22c55e', label: '△ Bottom' },
    ],
  },
  {
    name: 'Cylinder', emoji: '🥫', faces: 3, edges: 2, vertices: 0,
    volume: 'V = πr²h', surfaceArea: 'SA = 2πr² + 2πrh',
    desc: '2 circles (top & bottom) connected by a rectangle that wraps around.',
    netPanels: [
      { x: 45, y: 0, w: 40, h: 40, color: '#f59e0b', label: '⭕ Top' },
      { x: 0, y: 50, w: 130, h: 60, color: '#fbbf24', label: '▭ Side (wraps)' },
      { x: 45, y: 120, w: 40, h: 40, color: '#f59e0b', label: '⭕ Bottom' },
    ],
  },
  {
    name: 'Square Pyramid', emoji: '🔻', faces: 5, edges: 8, vertices: 5,
    volume: 'V = ⅓s²h', surfaceArea: 'SA = s² + 2sl',
    desc: 'A square base with 4 triangular faces that meet at the apex. Like the Egyptian pyramids!',
    netPanels: [
      { x: 55, y: 0, w: 50, h: 40, color: '#ef4444', label: '△' },
      { x: 0, y: 45, w: 45, h: 50, color: '#f87171', label: '△' },
      { x: 50, y: 45, w: 60, h: 60, color: '#dc2626', label: '□ Base' },
      { x: 115, y: 45, w: 45, h: 50, color: '#f87171', label: '△' },
      { x: 55, y: 110, w: 50, h: 40, color: '#ef4444', label: '△' },
    ],
  },
];

function makeChallenge() {
  const net = NETS[Math.floor(Math.random() * NETS.length)];
  const type = Math.floor(Math.random() * 3);
  if (type === 0) {
    const answer = String(net.faces);
    const wrongs = new Set([answer]);
    while (wrongs.size < 4) wrongs.add(String(net.faces + Math.floor(Math.random() * 5) - 2));
    return { question: `How many faces does a ${net.name} have?`, answer, options: [...wrongs].sort(() => Math.random() - 0.5), netName: net.name };
  }
  if (type === 1) {
    const answer = String(net.edges);
    const wrongs = new Set([answer]);
    while (wrongs.size < 4) wrongs.add(String(net.edges + Math.floor(Math.random() * 7) - 3));
    return { question: `How many edges does a ${net.name} have?`, answer, options: [...wrongs].sort(() => Math.random() - 0.5), netName: net.name };
  }
  const answer = String(net.vertices);
  const wrongs = new Set([answer]);
  while (wrongs.size < 4) wrongs.add(String(net.vertices + Math.floor(Math.random() * 5) - 2));
  return { question: `How many vertices does a ${net.name} have?`, answer, options: [...wrongs].sort(() => Math.random() - 0.5), netName: net.name };
}

export default function GeometryArchitect() {
  const [selected, setSelected] = useState(0);
  const [folded, setFolded] = useState(false);
  const [mode, setMode] = useState<'explore' | 'challenge'>('explore');
  const [challenge, setChallenge] = useState(makeChallenge);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);

  const net = NETS[selected];

  const answerChallenge = (opt: string) => {
    if (feedback) return;
    if (opt === challenge.answer) {
      setFeedback('correct'); sfx.correct(); setScore(s => s + 10);
      setTimeout(() => { setChallenge(makeChallenge()); setFeedback(null); }, 1200);
    } else {
      setFeedback('wrong'); sfx.wrong();
      setTimeout(() => setFeedback(null), 900);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🏛️ Geometry Architect</h2>
        <p className="text-purple-300 text-lg">Build 3D shapes from 2D nets — understand surface area & volume!</p>
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
              <p className="text-xl font-bold text-white text-center mb-5">{challenge.question}</p>
              <div className="grid grid-cols-2 gap-3">
                {challenge.options.map(opt => (
                  <motion.button key={opt} className={`py-3 rounded-xl text-xl font-bold ${feedback === 'correct' && opt === challenge.answer ? 'bg-green-500 text-white' : feedback ? 'bg-white/5 text-gray-500' : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'}`}
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
            {/* Net selector + visualization */}
            <div className="space-y-4">
              <div className="flex flex-wrap justify-center gap-2">
                {NETS.map((n, i) => (
                  <motion.button key={n.name}
                    className={`px-3 py-2 rounded-xl text-sm font-bold ${selected === i ? 'bg-purple-500/40 text-white border border-purple-400' : 'bg-white/10 text-gray-400'}`}
                    whileTap={{ scale: 0.95 }} onClick={() => { setSelected(i); setFolded(false); }}>{n.emoji} {n.name}</motion.button>
                ))}
              </div>

              {/* Net drawing */}
              <div className="bg-white/5 rounded-3xl p-6 border border-white/10 min-h-[220px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {!folded ? (
                    <motion.svg key="flat" width="280" height="170" viewBox="-10 -5 290 175"
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                      {net.netPanels.map((p, i) => (
                        <motion.g key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                          <rect x={p.x} y={p.y} width={p.w} height={p.h} rx="4" fill={p.color} stroke="white" strokeWidth="1.5" opacity="0.85" />
                          {p.label && <text x={p.x + p.w / 2} y={p.y + p.h / 2 + 4} fill="white" fontSize="9" textAnchor="middle" fontWeight="bold">{p.label}</text>}
                        </motion.g>
                      ))}
                      <text x="140" y="168" fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="middle">2D Net — {net.faces} faces</text>
                    </motion.svg>
                  ) : (
                    <motion.div key="3d" className="text-center" initial={{ opacity: 0, rotateY: 90 }} animate={{ opacity: 1, rotateY: 0 }}>
                      <motion.span className="text-8xl block" animate={{ rotateY: [0, 360] }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}>{net.emoji}</motion.span>
                      <p className="text-white font-bold mt-3 text-lg">{net.name}</p>
                      <p className="text-gray-400 text-sm">{net.faces} faces · {net.edges} edges · {net.vertices} vertices</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                className={`w-full py-3 rounded-xl font-bold text-lg ${folded ? 'bg-blue-600 text-white' : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'}`}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => { setFolded(!folded); sfx.click(); }}>
                {folded ? '📐 Unfold to 2D Net' : '🔨 Fold into 3D Shape!'}
              </motion.button>
            </div>

            {/* Properties */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-5 border border-blue-500/20">
                <h3 className="text-2xl font-bold text-white mb-2">{net.emoji} {net.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{net.desc}</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Faces', value: net.faces, color: 'text-blue-400' },
                    { label: 'Edges', value: net.edges, color: 'text-green-400' },
                    { label: 'Vertices', value: net.vertices, color: 'text-orange-400' },
                  ].map(p => (
                    <div key={p.label} className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
                      <p className="text-gray-400 text-xs">{p.label}</p>
                      <p className={`${p.color} font-bold text-2xl`}>{p.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                  <p className="text-gray-400 text-xs">Volume</p>
                  <p className="text-green-400 font-bold text-lg font-mono">{net.volume}</p>
                </div>
                <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/20">
                  <p className="text-gray-400 text-xs">Surface Area</p>
                  <p className="text-purple-400 font-bold text-lg font-mono">{net.surfaceArea}</p>
                </div>
              </div>

              <div className="bg-yellow-500/10 rounded-xl p-3 border border-yellow-500/20 text-sm text-yellow-300">
                💡 <strong>Euler's formula:</strong> V − E + F = {net.vertices} − {net.edges} + {net.faces} = {net.vertices - net.edges + net.faces}
                {net.vertices - net.edges + net.faces === 2 ? ' = 2 ✓' : ''}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
