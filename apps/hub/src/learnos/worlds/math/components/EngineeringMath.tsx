import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type EngMode = 'bridges' | 'projectile' | 'optimize';

export default function EngineeringMath() {
  const [mode, setMode] = useState<EngMode>('bridges');
  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">🏗️ Engineering Math</h2>
        <p className="text-purple-300 text-lg">Bridges, projectiles, and optimization — math in the real world!</p>
      </div>
      <div className="flex justify-center gap-2 mb-6">
        {[{ id: 'bridges' as EngMode, e: '🌉', l: 'Bridges' }, { id: 'projectile' as EngMode, e: '🚀', l: 'Projectile' }, { id: 'optimize' as EngMode, e: '📦', l: 'Optimize' }].map(m => (
          <button key={m.id} className={`px-4 py-2 rounded-xl font-bold text-sm ${mode === m.id ? 'bg-orange-500/30 text-orange-300 border border-orange-400/50' : 'bg-white/5 text-gray-400'}`} onClick={() => setMode(m.id)}>{m.e} {m.l}</button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {mode === 'bridges' && <motion.div key="b" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><BridgeLoad /></motion.div>}
        {mode === 'projectile' && <motion.div key="p" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><ProjectileMotion /></motion.div>}
        {mode === 'optimize' && <motion.div key="o" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><BoxOptimize /></motion.div>}
      </AnimatePresence>
    </div>
  );
}

function BridgeLoad() {
  const [span, setSpan] = useState(20);
  const [load, setLoad] = useState(500);
  const [beamHeight, setBeamHeight] = useState(2);

  const maxBending = useMemo(() => (load * span) / 4, [load, span]);
  const deflection = useMemo(() => (5 * load * Math.pow(span, 3)) / (384 * 200000 * (beamHeight * Math.pow(beamHeight, 2) / 6)), [load, span, beamHeight]);
  const stress = useMemo(() => maxBending / ((beamHeight * beamHeight) / 6), [maxBending, beamHeight]);

  const svgW = 400, svgH = 200;
  const sag = Math.min(40, deflection * 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl mx-auto">
      <div className="bg-white/5 rounded-3xl p-4 border border-white/10 flex justify-center">
        <svg width={svgW} height={svgH} className="bg-black/20 rounded-xl">
          {/* Supports */}
          <polygon points={`30,${svgH - 30} 20,${svgH - 10} 40,${svgH - 10}`} fill="#64748b" />
          <polygon points={`${svgW - 30},${svgH - 30} ${svgW - 40},${svgH - 10} ${svgW - 20},${svgH - 10}`} fill="#64748b" />
          {/* Beam with sag */}
          <motion.path d={`M 30,${svgH - 30} Q ${svgW / 2},${svgH - 30 + sag} ${svgW - 30},${svgH - 30}`} fill="none" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round"
            animate={{ d: `M 30,${svgH - 30} Q ${svgW / 2},${svgH - 30 + sag} ${svgW - 30},${svgH - 30}` }} />
          {/* Load arrow */}
          <motion.line x1={svgW / 2} y1={30} x2={svgW / 2} y2={svgH - 35 + sag / 2} stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrowhead)" />
          <defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" /></marker></defs>
          <text x={svgW / 2 + 10} y={45} fill="#ef4444" fontSize="12" fontWeight="bold">{load} N</text>
          <text x={svgW / 2 - 20} y={svgH - 5} fill="rgba(255,255,255,0.4)" fontSize="11">{span} m</text>
        </svg>
      </div>
      <div className="space-y-3">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-3">
          <div><label className="text-gray-400 text-sm">Span (m)</label><input type="range" min="5" max="50" value={span} onChange={e => setSpan(Number(e.target.value))} className="w-full accent-blue-500" /><p className="text-white font-bold text-center">{span} m</p></div>
          <div><label className="text-gray-400 text-sm">Load (N)</label><input type="range" min="100" max="2000" step="50" value={load} onChange={e => setLoad(Number(e.target.value))} className="w-full accent-red-500" /><p className="text-white font-bold text-center">{load} N</p></div>
          <div><label className="text-gray-400 text-sm">Beam height (m)</label><input type="range" min="0.5" max="5" step="0.5" value={beamHeight} onChange={e => setBeamHeight(Number(e.target.value))} className="w-full accent-yellow-500" /><p className="text-white font-bold text-center">{beamHeight} m</p></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-orange-500/10 rounded-xl p-3 border border-orange-500/20 text-center"><p className="text-gray-400 text-sm">Max Bending</p><motion.p key={maxBending} className="text-orange-400 font-bold text-lg" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{maxBending.toFixed(0)} Nm</motion.p></div>
          <div className={`rounded-xl p-3 border text-center ${stress > 100000 ? 'bg-red-500/20 border-red-500/30' : 'bg-green-500/10 border-green-500/20'}`}><p className="text-gray-400 text-sm">Stress</p><motion.p key={stress} className={`font-bold text-lg ${stress > 100000 ? 'text-red-400' : 'text-green-400'}`} initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{(stress / 1000).toFixed(1)} kPa</motion.p></div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-sm text-gray-300">
          <p>📝 Bending moment M = FL/4 for center-loaded simply-supported beam.</p>
          <p>📝 {stress > 100000 ? '⚠️ High stress! Increase beam height or reduce load.' : '✅ Stress within safe range.'}</p>
        </div>
      </div>
    </div>
  );
}

function ProjectileMotion() {
  const [velocity, setVelocity] = useState(20);
  const [angle, setAngle] = useState(45);
  const g = 9.81;

  const rad = (angle * Math.PI) / 180;
  const vx = velocity * Math.cos(rad);
  const vy = velocity * Math.sin(rad);
  const timeOfFlight = (2 * vy) / g;
  const maxHeight = (vy * vy) / (2 * g);
  const range = vx * timeOfFlight;

  const svgW = 400, svgH = 220;
  const scaleX = (svgW - 60) / Math.max(range, 1);
  const scaleY = (svgH - 80) / Math.max(maxHeight, 1);

  const pathPoints = useMemo(() => {
    const pts: string[] = [];
    const steps = 50;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * timeOfFlight;
      const x = vx * t;
      const y = vy * t - 0.5 * g * t * t;
      pts.push(`${30 + x * scaleX},${svgH - 40 - y * scaleY}`);
    }
    return 'M ' + pts.join(' L ');
  }, [vx, vy, timeOfFlight, scaleX, scaleY, svgH]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl mx-auto">
      <div className="bg-white/5 rounded-3xl p-4 border border-white/10 flex justify-center">
        <svg width={svgW} height={svgH} className="bg-black/20 rounded-xl">
          <line x1="30" y1={svgH - 40} x2={svgW - 10} y2={svgH - 40} stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          <motion.path d={pathPoints} fill="none" stroke="#8b5cf6" strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
          <circle cx="30" cy={svgH - 40} r="4" fill="#f59e0b" />
          <text x={svgW / 2} y={svgH - 20} fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="middle">{range.toFixed(1)} m</text>
          {/* Max height marker */}
          <line x1={30 + range * scaleX / 2} y1={svgH - 40 - maxHeight * scaleY} x2={30 + range * scaleX / 2} y2={svgH - 40} stroke="rgba(34,197,94,0.4)" strokeWidth="1" strokeDasharray="4" />
          <text x={30 + range * scaleX / 2 + 5} y={svgH - 40 - maxHeight * scaleY + 5} fill="#22c55e" fontSize="10">{maxHeight.toFixed(1)} m</text>
        </svg>
      </div>
      <div className="space-y-3">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-3">
          <div><label className="text-gray-400 text-sm">Initial velocity (m/s)</label><input type="range" min="5" max="50" value={velocity} onChange={e => setVelocity(Number(e.target.value))} className="w-full accent-purple-500" /><p className="text-white font-bold text-center">{velocity} m/s</p></div>
          <div><label className="text-gray-400 text-sm">Launch angle (°)</label><input type="range" min="5" max="85" value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full accent-orange-500" /><p className="text-white font-bold text-center">{angle}°</p></div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-blue-500/10 rounded-xl p-3 border border-blue-500/20 text-center"><p className="text-gray-400 text-sm">Range</p><motion.p key={range} className="text-blue-400 font-bold" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{range.toFixed(1)} m</motion.p></div>
          <div className="bg-green-500/10 rounded-xl p-3 border border-green-500/20 text-center"><p className="text-gray-400 text-sm">Max Height</p><motion.p key={maxHeight} className="text-green-400 font-bold" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{maxHeight.toFixed(1)} m</motion.p></div>
          <div className="bg-orange-500/10 rounded-xl p-3 border border-orange-500/20 text-center"><p className="text-gray-400 text-sm">Flight Time</p><motion.p key={timeOfFlight} className="text-orange-400 font-bold" initial={{ scale: 0.5 }} animate={{ scale: 1 }}>{timeOfFlight.toFixed(2)} s</motion.p></div>
        </div>
        <div className="bg-white/5 rounded-xl p-3 border border-white/10 text-sm text-gray-300 space-y-1">
          <p>📝 Range = v²sin(2θ)/g | Max height = v²sin²(θ)/2g</p>
          <p>📝 45° gives maximum range for a given speed.</p>
          <p>📝 vₓ = {vx.toFixed(1)} m/s, vᵧ = {vy.toFixed(1)} m/s</p>
        </div>
      </div>
    </div>
  );
}

function BoxOptimize() {
  const [volume, setVolume] = useState(1000);
  const [length, setLength] = useState(10);

  const optimalSide = useMemo(() => Math.pow(volume, 1 / 3), [volume]);
  const width = useMemo(() => Math.max(1, Math.sqrt(volume / length)), [volume, length]);
  const height = useMemo(() => volume / (length * width), [volume, length, width]);
  const surfaceArea = useMemo(() => 2 * (length * width + length * height + width * height), [length, width, height]);
  const optimalSA = useMemo(() => 6 * Math.pow(optimalSide, 2), [optimalSide]);
  const efficiency = useMemo(() => Math.round((optimalSA / surfaceArea) * 100), [optimalSA, surfaceArea]);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
        <h4 className="text-white font-bold mb-3">📦 Box Optimization: Minimize surface area for a given volume</h4>
        <div className="space-y-3">
          <div><label className="text-gray-400 text-sm">Target Volume (cm³)</label><input type="range" min="100" max="5000" step="100" value={volume} onChange={e => setVolume(Number(e.target.value))} className="w-full accent-purple-500" /><p className="text-white font-bold text-center">{volume} cm³</p></div>
          <div><label className="text-gray-400 text-sm">Length (cm)</label><input type="range" min="1" max="30" step="0.5" value={length} onChange={e => setLength(Number(e.target.value))} className="w-full accent-blue-500" /><p className="text-white font-bold text-center">{length} cm</p></div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-blue-500/10 rounded-xl p-3 border border-blue-500/20 text-center"><p className="text-gray-400 text-sm">L × W × H</p><p className="text-blue-400 font-bold text-sm">{length.toFixed(1)} × {width.toFixed(1)} × {height.toFixed(1)}</p></div>
        <div className="bg-orange-500/10 rounded-xl p-3 border border-orange-500/20 text-center"><p className="text-gray-400 text-sm">Surface Area</p><p className="text-orange-400 font-bold">{surfaceArea.toFixed(0)} cm²</p></div>
        <div className="bg-green-500/10 rounded-xl p-3 border border-green-500/20 text-center"><p className="text-gray-400 text-sm">Optimal (cube)</p><p className="text-green-400 font-bold">{optimalSA.toFixed(0)} cm²</p></div>
        <div className={`rounded-xl p-3 border text-center ${efficiency > 90 ? 'bg-green-500/20 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/20'}`}><p className="text-gray-400 text-sm">Efficiency</p><p className={`font-bold ${efficiency > 90 ? 'text-green-400' : 'text-yellow-400'}`}>{efficiency}%</p></div>
      </div>
      <div className="bg-purple-500/10 rounded-xl p-3 border border-purple-500/20 text-sm text-purple-300">
        💡 A <strong>cube</strong> (all sides equal = {optimalSide.toFixed(1)} cm) uses the least material for a given volume. The optimal side = ∛Volume. Try adjusting the length to see how efficiency changes!
      </div>
    </div>
  );
}
