import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ArtMode = 'fractals' | 'tessellations' | 'golden';

export default function MathArtStudio() {
  const [mode, setMode] = useState<ArtMode>('fractals');
  const modes = [
    { id: 'fractals' as ArtMode, emoji: '🌳', label: 'Fractals' },
    { id: 'tessellations' as ArtMode, emoji: '🔷', label: 'Tessellations' },
    { id: 'golden' as ArtMode, emoji: '🌀', label: 'Golden Ratio' },
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🎨 Math & Art Studio</h2>
        <p className="text-purple-300 text-lg">Create beauty with patterns, ratios, symmetry, and recursion.</p>
      </div>

      <div className="flex justify-center gap-2 mb-6">
        {modes.map((m) => (
          <button key={m.id} className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === m.id ? 'bg-purple-500/30 text-purple-300 border border-purple-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => setMode(m.id)}>{m.emoji} {m.label}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={mode} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {mode === 'fractals' && <FractalTree />}
          {mode === 'tessellations' && <TessellationMaker />}
          {mode === 'golden' && <GoldenRatio />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function branch(x: number, y: number, len: number, angle: number, depth: number, spread: number): { x1: number; y1: number; x2: number; y2: number; depth: number }[] {
  if (depth <= 0 || len < 2) return [];
  const rad = (angle * Math.PI) / 180;
  const x2 = x + Math.cos(rad) * len;
  const y2 = y - Math.sin(rad) * len;
  return [
    { x1: x, y1: y, x2, y2, depth },
    ...branch(x2, y2, len * 0.68, angle + spread, depth - 1, spread),
    ...branch(x2, y2, len * 0.68, angle - spread, depth - 1, spread),
  ];
}

function FractalTree() {
  const [depth, setDepth] = useState(7);
  const [spread, setSpread] = useState(28);
  const [length, setLength] = useState(72);
  const branches = useMemo(() => branch(150, 280, length, 90, depth, spread), [depth, spread, length]);
  const leaves = branches.filter((b) => b.depth <= 2);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white/5 rounded-3xl p-4 border border-white/10 flex justify-center">
        <svg width="300" height="300" viewBox="0 0 300 300" className="bg-gradient-to-b from-indigo-950/60 to-emerald-950/30 rounded-2xl">
          {branches.map((b, i) => (
            <motion.line key={i} x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2} stroke={b.depth > 3 ? '#a16207' : '#22c55e'} strokeWidth={Math.max(1, b.depth * 0.7)} strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ delay: i * 0.004 }} />
          ))}
          {leaves.map((l, i) => <motion.circle key={i} cx={l.x2} cy={l.y2} r="2.5" fill="#86efac" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 + i * 0.01 }} />)}
        </svg>
      </div>
      <div className="space-y-4">
        <Control label="Recursion depth" value={depth} min={1} max={10} setValue={setDepth} />
        <Control label="Branch angle" value={spread} min={5} max={60} setValue={setSpread} suffix="°" />
        <Control label="Trunk length" value={length} min={35} max={95} setValue={setLength} />
        <div className="bg-green-500/10 rounded-2xl p-5 border border-green-500/20">
          <h4 className="text-white font-bold mb-2">🌳 Why this is math</h4>
          <p className="text-gray-300 text-sm">A fractal repeats a rule at smaller scales. Each branch creates two smaller branches, so the count grows roughly like powers of 2.</p>
          <p className="text-green-300 font-bold mt-2">Branches drawn: {branches.length}</p>
        </div>
      </div>
    </div>
  );
}

function TessellationMaker() {
  const [shape, setShape] = useState<'triangles' | 'hexagons' | 'squares'>('hexagons');
  const [colors, setColors] = useState(4);

  const palette = ['#8b5cf6', '#ec4899', '#22c55e', '#f59e0b', '#3b82f6', '#ef4444'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white/5 rounded-3xl p-4 border border-white/10 flex justify-center overflow-hidden">
        <svg width="320" height="300" viewBox="0 0 320 300" className="bg-black/20 rounded-2xl">
          {shape === 'squares' && Array.from({ length: 12 }).map((_, y) => Array.from({ length: 13 }).map((__, x) => <motion.rect key={`${x}-${y}`} x={x * 26} y={y * 26} width="26" height="26" fill={palette[(x + y) % colors]} opacity="0.75" stroke="rgba(255,255,255,0.15)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: (x + y) * 0.01 }} />))}
          {shape === 'triangles' && Array.from({ length: 12 }).map((_, y) => Array.from({ length: 12 }).map((__, x) => {
            const x0 = x * 30;
            const y0 = y * 26;
            const up = (x + y) % 2 === 0;
            const points = up ? `${x0},${y0 + 26} ${x0 + 15},${y0} ${x0 + 30},${y0 + 26}` : `${x0},${y0} ${x0 + 30},${y0} ${x0 + 15},${y0 + 26}`;
            return <motion.polygon key={`${x}-${y}`} points={points} fill={palette[(x + y) % colors]} opacity="0.75" stroke="rgba(255,255,255,0.15)" initial={{ scale: 0 }} animate={{ scale: 1 }} />;
          }))}
          {shape === 'hexagons' && Array.from({ length: 8 }).map((_, row) => Array.from({ length: 8 }).map((__, col) => {
            const size = 18;
            const x = col * size * 1.75 + (row % 2 ? size * 0.9 : 0) + 8;
            const y = row * size * 1.52 + 20;
            const pts = Array.from({ length: 6 }).map((___, i) => `${x + Math.cos((Math.PI / 3) * i) * size},${y + Math.sin((Math.PI / 3) * i) * size}`).join(' ');
            return <motion.polygon key={`${row}-${col}`} points={pts} fill={palette[(row + col) % colors]} opacity="0.78" stroke="rgba(255,255,255,0.15)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: (row + col) * 0.02 }} />;
          }))}
        </svg>
      </div>
      <div className="space-y-4">
        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
          <h4 className="text-white font-bold mb-3">Choose a tile</h4>
          <div className="grid grid-cols-3 gap-2">
            {(['triangles', 'hexagons', 'squares'] as const).map((s) => <button key={s} className={`py-3 rounded-xl font-bold text-sm capitalize ${shape === s ? 'bg-purple-500/40 text-white border border-purple-400' : 'bg-white/10 text-gray-400'}`} onClick={() => setShape(s)}>{s}</button>)}
          </div>
        </div>
        <Control label="Color cycle" value={colors} min={2} max={6} setValue={setColors} />
        <div className="bg-purple-500/10 rounded-2xl p-5 border border-purple-500/20">
          <h4 className="text-white font-bold mb-2">🔷 Tessellation rule</h4>
          <p className="text-gray-300 text-sm">A tessellation covers a surface with no gaps and no overlaps. Squares, triangles, and hexagons work perfectly because their angles fit around a point.</p>
        </div>
      </div>
    </div>
  );
}

function GoldenRatio() {
  const [size, setSize] = useState(260);
  const phi = 1.61803398875;
  const rectW = size;
  const rectH = size / phi;
  const squares = useMemo(() => {
    let x = 20;
    let y = 40;
    let w = rectW;
    let h = rectH;
    const out: { x: number; y: number; s: number; dir: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const s = Math.min(w, h);
      out.push({ x, y, s, dir: i % 4 });
      if (w > h) { x += s; w -= s; } else { y += s; h -= s; }
    }
    return out;
  }, [rectW, rectH]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white/5 rounded-3xl p-4 border border-white/10 flex justify-center overflow-auto">
        <svg width="340" height="260" viewBox="0 0 340 260" className="bg-black/20 rounded-2xl">
          <rect x="20" y="40" width={rectW} height={rectH} fill="rgba(245,158,11,0.08)" stroke="#f59e0b" strokeWidth="2" />
          {squares.map((sq, i) => (
            <g key={i}>
              <motion.rect x={sq.x} y={sq.y} width={sq.s} height={sq.s} fill="none" stroke={['#a855f7', '#ec4899', '#22c55e', '#3b82f6'][i % 4]} strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <path d={arcPath(sq.x, sq.y, sq.s, sq.dir)} fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
            </g>
          ))}
          <text x="22" y="28" fill="#fbbf24" fontSize="14" fontWeight="bold">Golden rectangle: width / height ≈ φ</text>
        </svg>
      </div>
      <div className="space-y-4">
        <Control label="Rectangle width" value={size} min={160} max={300} setValue={setSize} />
        <div className="bg-yellow-500/10 rounded-2xl p-5 border border-yellow-500/20">
          <h4 className="text-white font-bold mb-2">🌀 Golden Ratio</h4>
          <p className="text-gray-300 text-sm">φ ≈ 1.618. A golden rectangle has width ÷ height = φ. Splitting it into squares creates a spiral often found in art and nature.</p>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-white/5 rounded-xl p-3 text-center"><p className="text-gray-500 text-sm">Width</p><p className="text-white font-bold">{rectW.toFixed(0)}</p></div>
            <div className="bg-white/5 rounded-xl p-3 text-center"><p className="text-gray-500 text-sm">Height</p><p className="text-white font-bold">{rectH.toFixed(1)}</p></div>
            <div className="bg-white/5 rounded-xl p-3 text-center col-span-2"><p className="text-gray-500 text-sm">Width ÷ Height</p><p className="text-yellow-400 font-bold text-2xl">{(rectW / rectH).toFixed(3)}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function arcPath(x: number, y: number, s: number, dir: number) {
  if (dir === 0) return `M ${x} ${y + s} A ${s} ${s} 0 0 1 ${x + s} ${y}`;
  if (dir === 1) return `M ${x} ${y} A ${s} ${s} 0 0 1 ${x + s} ${y + s}`;
  if (dir === 2) return `M ${x + s} ${y} A ${s} ${s} 0 0 1 ${x} ${y + s}`;
  return `M ${x + s} ${y + s} A ${s} ${s} 0 0 1 ${x} ${y}`;
}

function Control({ label, value, min, max, setValue, suffix = '' }: { label: string; value: number; min: number; max: number; setValue: (n: number) => void; suffix?: string }) {
  return (
    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
      <div className="flex justify-between text-sm mb-2"><span className="text-gray-400">{label}</span><span className="text-white font-bold">{value}{suffix}</span></div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full accent-purple-500" />
    </div>
  );
}
