import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { CanvasProps } from '../../types';

interface GasParticle { id: number; x: number; y: number; vx: number; vy: number; }

type LawMode = 'boyle' | 'charles' | 'combined' | 'realworld';

const HISTORY_LENGTH = 40;

export default function GasLawsCanvas({ isPlaying }: CanvasProps) {
  const [lawMode, setLawMode] = useState<LawMode>('boyle');
  const [pressure, setPressure] = useState(1);
  const [volume, setVolume] = useState(100);
  const [temperature, setTemperature] = useState(300);
  const [particles, setParticles] = useState<GasParticle[]>([]);
  const [graphHistory, setGraphHistory] = useState<{ p: number; v: number; t: number }[]>([]);
  const [showFormula] = useState(true);
  const [balloonSize, setBalloonSize] = useState(60);
  const animRef = useRef<number | null>(null);

  // Gas law calculations
  useEffect(() => {
    if (lawMode === 'boyle') {
      const newVol = Math.round(100 / pressure);
      setVolume(newVol);
      setBalloonSize(30 + newVol * 0.5);
    }
  }, [pressure, lawMode]);

  useEffect(() => {
    if (lawMode === 'charles') {
      const newVol = Math.round((temperature / 300) * 100);
      setVolume(newVol);
      setBalloonSize(30 + newVol * 0.5);
    }
  }, [temperature, lawMode]);

  useEffect(() => {
    if (lawMode === 'combined') {
      const newVol = Math.round((temperature / 300) * (1 / pressure) * 100);
      setVolume(newVol);
      setBalloonSize(30 + newVol * 0.5);
    }
  }, [pressure, temperature, lawMode]);

  // Record graph history
  useEffect(() => {
    setGraphHistory(prev => [...prev.slice(-HISTORY_LENGTH + 1), { p: pressure, v: volume, t: temperature }]);
  }, [pressure, volume, temperature]);

  // Init particles
  useEffect(() => {
    const pts: GasParticle[] = [];
    for (let i = 0; i < 24; i++) {
      pts.push({
        id: i,
        x: 20 + Math.random() * 140,
        y: 15 + Math.random() * 110,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
      });
    }
    setParticles(pts);
  }, []);

  const animate = useCallback(() => {
    if (!isPlaying) return;
    const containerW = Math.max(50, (volume / 100) * 180);
    const containerH = 140;
    const speed = (temperature / 300) * (0.8 + pressure * 0.3);

    setParticles(prev => prev.map(p => {
      let nx = p.x + p.vx * speed;
      let ny = p.y + p.vy * speed;
      let nvx = p.vx;
      let nvy = p.vy;

      if (nx < 4 || nx > containerW - 4) { nvx = -nvx * 0.95; nx = Math.max(4, Math.min(containerW - 4, nx)); }
      if (ny < 4 || ny > containerH - 4) { nvy = -nvy * 0.95; ny = Math.max(4, Math.min(containerH - 4, ny)); }
      if (Math.random() < 0.03) { nvx += (Math.random() - 0.5) * 0.8; nvy += (Math.random() - 0.5) * 0.8; }

      return { ...p, x: nx, y: ny, vx: nvx, vy: nvy };
    }));
    animRef.current = requestAnimationFrame(animate);
  }, [isPlaying, volume, temperature, pressure]);

  useEffect(() => {
    if (isPlaying) animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isPlaying, animate]);

  const containerWidth = Math.max(50, (volume / 100) * 180);

  // Collision counter for pressure visualization
  const wallHits = particles.filter(p => p.x < 8 || p.x > containerWidth - 8 || p.y < 8 || p.y > 132).length;

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Tabs */}
      <div className="flex gap-1.5 flex-wrap justify-center">
        {([
          ['boyle', "📦 Boyle's"],
          ['charles', "🌡️ Charles's"],
          ['combined', '⚗️ Combined'],
          ['realworld', '🌍 Real World'],
        ] as [LawMode, string][]).map(([m, label]) => (
          <button key={m} onClick={() => { setLawMode(m); setGraphHistory([]); }}
            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
              lawMode === m ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Title + Formula */}
      <div className="text-center">
        <h3 className="text-lg font-bold text-cyan-400">
          {lawMode === 'boyle' ? "Boyle's Law" : lawMode === 'charles' ? "Charles's Law" :
           lawMode === 'combined' ? "Combined Gas Law" : "Real-World Applications"}
        </h3>
        {showFormula && lawMode !== 'realworld' && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-sm font-mono text-amber-400 mt-1 bg-slate-800 px-4 py-1 rounded-full inline-block">
            {lawMode === 'boyle' && `P₁V₁ = P₂V₂  →  ${pressure.toFixed(1)} × ${volume} = const`}
            {lawMode === 'charles' && `V₁/T₁ = V₂/T₂  →  ${volume}/${temperature} = const`}
            {lawMode === 'combined' && `P₁V₁/T₁ = P₂V₂/T₂  →  ${pressure.toFixed(1)}×${volume}/${temperature}`}
          </motion.p>
        )}
      </div>

      {lawMode !== 'realworld' && (
        <>
          {/* Main Visualization Area: Piston + Graph side by side */}
          <div className="flex gap-4 items-start">
            {/* Piston Container */}
            <div className="relative" style={{ height: 170, width: 200 }}>
              <motion.div
                className="absolute bottom-2 left-0 border-2 border-cyan-500/80 rounded-b-lg bg-cyan-950/40 overflow-hidden"
                animate={{ width: containerWidth }}
                transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                style={{ height: 144 }}
              >
                {/* Particles */}
                {particles.map(p => (
                  <motion.div key={p.id}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      left: Math.min(p.x, containerWidth - 6),
                      top: p.y,
                      backgroundColor: `hsl(${190 + (temperature - 200) * 0.3}, 80%, ${55 + wallHits}%)`,
                      boxShadow: `0 0 4px hsla(${190 + (temperature - 200) * 0.3}, 80%, 55%, 0.5)`,
                    }}
                  />
                ))}

                {/* Wall collision sparkles */}
                {pressure > 2 && (
                  <motion.div className="absolute right-0 top-0 bottom-0 w-1 bg-yellow-400/30"
                    animate={{ opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 0.3, repeat: Infinity }} />
                )}
              </motion.div>

              {/* Piston wall */}
              <motion.div
                className="absolute bottom-2 w-3 bg-gradient-to-r from-slate-400 to-slate-300 rounded-r shadow-md"
                animate={{ left: containerWidth }}
                transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                style={{ height: 144 }}
              >
                {/* Handle */}
                <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-8 bg-slate-500 rounded-r" />
              </motion.div>

              {/* Labels */}
              <div className="absolute top-0 left-1 text-[10px] text-cyan-400">V = {volume}</div>
            </div>

            {/* Live P-V or V-T Graph */}
            <div className="bg-slate-800/60 rounded-xl border border-slate-700 p-3" style={{ width: 160, height: 170 }}>
              <p className="text-[10px] text-slate-500 text-center mb-1">
                {lawMode === 'boyle' ? 'P vs V' : lawMode === 'charles' ? 'V vs T' : 'P·V vs T'}
              </p>
              <svg width="140" height="120" className="overflow-visible">
                {/* Grid */}
                {[0, 30, 60, 90, 120].map(y => (
                  <line key={y} x1="0" y1={y} x2="140" y2={y} stroke="#334155" strokeWidth="0.5" />
                ))}
                {/* Axes */}
                <line x1="0" y1="120" x2="140" y2="120" stroke="#64748b" strokeWidth="1" />
                <line x1="0" y1="0" x2="0" y2="120" stroke="#64748b" strokeWidth="1" />

                {/* Plot data */}
                {graphHistory.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={graphHistory.map((pt, i) => {
                      const x = (i / HISTORY_LENGTH) * 140;
                      let y: number;
                      if (lawMode === 'boyle') y = 120 - (pt.v / 200) * 120;
                      else if (lawMode === 'charles') y = 120 - (pt.v / 200) * 120;
                      else y = 120 - ((pt.p * pt.v) / 400) * 120;
                      return `${x},${y}`;
                    }).join(' ')}
                  />
                )}

                {/* Current point dot */}
                {graphHistory.length > 0 && (() => {
                  const last = graphHistory[graphHistory.length - 1];
                  const x = ((graphHistory.length - 1) / HISTORY_LENGTH) * 140;
                  let y: number;
                  if (lawMode === 'boyle') y = 120 - (last.v / 200) * 120;
                  else if (lawMode === 'charles') y = 120 - (last.v / 200) * 120;
                  else y = 120 - ((last.p * last.v) / 400) * 120;
                  return <circle cx={x} cy={y} r="4" fill="#10b981" />;
                })()}

                {/* Axis labels */}
                <text x="70" y="135" fill="#64748b" fontSize="9" textAnchor="middle">
                  {lawMode === 'boyle' ? 'Time →' : lawMode === 'charles' ? 'Time →' : 'Time →'}
                </text>
                <text x="-5" y="60" fill="#64748b" fontSize="9" textAnchor="middle" transform="rotate(-90, -5, 60)">
                  {lawMode === 'boyle' ? 'Volume' : lawMode === 'charles' ? 'Volume' : 'P×V'}
                </text>
              </svg>
            </div>
          </div>

          {/* Live Values */}
          <div className="flex gap-4 text-center">
            <div className={`px-4 py-2 rounded-xl ${lawMode === 'boyle' || lawMode === 'combined' ? 'bg-red-600/20 border border-red-500/30' : 'bg-slate-800'}`}>
              <p className="text-xl font-bold text-red-400">{pressure.toFixed(1)}</p>
              <p className="text-xs text-slate-400">P (atm)</p>
            </div>
            <div className="bg-cyan-600/20 border border-cyan-500/30 px-4 py-2 rounded-xl">
              <p className="text-xl font-bold text-cyan-400">{volume}</p>
              <p className="text-xs text-slate-400">V (units)</p>
            </div>
            <div className={`px-4 py-2 rounded-xl ${lawMode === 'charles' || lawMode === 'combined' ? 'bg-amber-600/20 border border-amber-500/30' : 'bg-slate-800'}`}>
              <p className="text-xl font-bold text-amber-400">{temperature}K</p>
              <p className="text-xs text-slate-400">T ({temperature - 273}°C)</p>
            </div>
          </div>

          {/* Sliders */}
          <div className="w-full max-w-sm space-y-3">
            {(lawMode === 'boyle' || lawMode === 'combined') && (
              <div>
                <div className="flex justify-between text-sm text-slate-300 mb-1">
                  <span>🔴 Pressure</span><span className="font-mono">{pressure.toFixed(1)} atm</span>
                </div>
                <input type="range" min="0.3" max="4" step="0.1" value={pressure}
                  onChange={e => setPressure(Number(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-lg appearance-none cursor-pointer" />
              </div>
            )}
            {(lawMode === 'charles' || lawMode === 'combined') && (
              <div>
                <div className="flex justify-between text-sm text-slate-300 mb-1">
                  <span>🟡 Temperature</span><span className="font-mono">{temperature}K ({temperature - 273}°C)</span>
                </div>
                <input type="range" min="200" max="600" step="10" value={temperature}
                  onChange={e => setTemperature(Number(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded-lg appearance-none cursor-pointer" />
              </div>
            )}
          </div>

          {/* Balloon visualization */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <motion.div
                className="rounded-full bg-gradient-to-br from-red-400 to-pink-500 mx-auto flex items-center justify-center shadow-lg"
                animate={{ width: balloonSize, height: balloonSize * 1.2 }}
                transition={{ type: 'spring', stiffness: 150 }}
                style={{ borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%' }}
              >
                <span className="text-white text-xs font-bold">V={volume}</span>
              </motion.div>
              <div className="w-1 h-4 bg-slate-500 mx-auto" />
              <div className="w-2 h-2 bg-slate-500 rounded-full mx-auto" />
              <p className="text-xs text-slate-500 mt-1">Balloon</p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-3 text-xs text-slate-300 max-w-[200px]">
              {lawMode === 'boyle' && <p>⬆️ Pressure → ⬇️ Volume<br/>Squeeze the balloon and it shrinks!</p>}
              {lawMode === 'charles' && <p>⬆️ Temperature → ⬆️ Volume<br/>Heat the balloon and it expands!</p>}
              {lawMode === 'combined' && <p>P and T both affect V.<br/>PV/T stays constant!</p>}
            </div>
          </div>
        </>
      )}

      {/* REAL WORLD MODE */}
      {lawMode === 'realworld' && (
        <div className="w-full max-w-md space-y-3">
          {[
            { title: 'Pressure Cooker', emoji: '🍲', law: "Boyle's + Gay-Lussac's", desc: 'At 2 atm, water boils at 121°C — cooks dal 3x faster! The sealed lid traps steam, increasing pressure.', indianContext: 'Every Indian kitchen has one — saving time and fuel daily!' },
            { title: 'Scuba Diving', emoji: '🤿', law: "Boyle's Law", desc: 'At 10m depth, pressure doubles → lung volume halves. Divers must ascend slowly to avoid "the bends".', indianContext: 'Andaman Islands and Lakshadweep are India\'s diving hotspots!' },
            { title: 'Hot Air Balloon', emoji: '🎈', law: "Charles's Law", desc: 'Heated air expands and becomes less dense than surrounding cool air, creating buoyant lift.', indianContext: 'Hot air balloon festivals in Jaipur and Hampi!' },
            { title: 'Altitude Cooking', emoji: '🏔️', law: 'Pressure effect', desc: 'At 3000m altitude, air pressure is ~0.7 atm. Water boils at 90°C — noodles take longer!', indianContext: 'Ladakh, Leh, Spiti — pressure cookers are essential here!' },
            { title: 'Car Tyre Pressure', emoji: '🚗', law: "Gay-Lussac's Law", desc: 'Long drives heat tyres → pressure increases. Check tyre pressure when cold!', indianContext: 'IOCL recommends checking tyre pressure in Indian summers (45°C+)!' },
            { title: 'Spray Can', emoji: '🧴', law: "Boyle's Law", desc: 'Compressed gas pushes liquid out when you press the nozzle. Lower pressure inside = gas expands.', indianContext: 'Mosquito repellent sprays work on this principle!' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
              <div className="flex gap-3">
                <span className="text-3xl flex-shrink-0">{item.emoji}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-white">{item.title}</h4>
                    <span className="text-[10px] px-2 py-0.5 bg-cyan-600/20 text-cyan-400 rounded-full">{item.law}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-1">{item.desc}</p>
                  <p className="text-xs text-emerald-400">🇮🇳 {item.indianContext}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Indian Context Footer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-3 max-w-sm text-center">
        <p className="text-sm text-emerald-200">
          <span className="font-bold">🇮🇳 Pressure Cooker Science:</span> Indian kitchens use pressure cookers daily! 
          At ~2 atm, water boils at 121°C — cooking dal and rice much faster while saving fuel.
        </p>
      </motion.div>
    </div>
  );
}
