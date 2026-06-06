import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { CanvasProps } from '../../types';

interface CorrosionSpot {
  id: number;
  x: number;
  y: number;
  size: number;
  age: number;
}

type MetalSample = 'iron' | 'copper' | 'aluminium' | 'silver' | 'gold';
type Environment = 'dry' | 'humid' | 'saltwater' | 'acid';
type Coating = 'none' | 'paint' | 'oil' | 'zinc' | 'chrome';

const METAL_CONFIG: Record<MetalSample, { name: string; emoji: string; color: string; corrosionColor: string; corrosionRate: Record<Environment, number>; corrosionName: string }> = {
  iron: { name: 'Iron', emoji: '🔩', color: '#6b7280', corrosionColor: '#92400e', corrosionRate: { dry: 0.2, humid: 1.5, saltwater: 4, acid: 6 }, corrosionName: 'Rust (Fe₂O₃)' },
  copper: { name: 'Copper', emoji: '🟤', color: '#c2410c', corrosionColor: '#16a34a', corrosionRate: { dry: 0.05, humid: 0.5, saltwater: 1.5, acid: 3 }, corrosionName: 'Patina (CuCO₃)' },
  aluminium: { name: 'Aluminium', emoji: '🪩', color: '#d1d5db', corrosionColor: '#e5e7eb', corrosionRate: { dry: 0, humid: 0.1, saltwater: 0.8, acid: 2 }, corrosionName: 'Oxide layer (Al₂O₃)' },
  silver: { name: 'Silver', emoji: '🥈', color: '#e2e8f0', corrosionColor: '#1e293b', corrosionRate: { dry: 0.02, humid: 0.3, saltwater: 0.5, acid: 1 }, corrosionName: 'Tarnish (Ag₂S)' },
  gold: { name: 'Gold', emoji: '🥇', color: '#eab308', corrosionColor: '#eab308', corrosionRate: { dry: 0, humid: 0, saltwater: 0, acid: 0.01 }, corrosionName: 'Almost none!' },
};

const COATING_CONFIG: Record<Coating, { name: string; emoji: string; protection: number; description: string }> = {
  none: { name: 'No Coating', emoji: '❌', protection: 1, description: 'No protection' },
  paint: { name: 'Paint', emoji: '🎨', protection: 0.15, description: 'Blocks air and moisture' },
  oil: { name: 'Oil/Grease', emoji: '🫒', protection: 0.3, description: 'Water-repelling barrier' },
  zinc: { name: 'Galvanizing (Zinc)', emoji: '🛡️', protection: 0.05, description: 'Zinc corrodes instead of iron!' },
  chrome: { name: 'Chrome Plating', emoji: '✨', protection: 0.02, description: 'Shiny and durable' },
};

type ViewMode = 'simulate' | 'protect' | 'learn';

export default function CorrosionCanvas({ isPlaying }: CanvasProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('simulate');
  const [metal, setMetal] = useState<MetalSample>('iron');
  const [environment, setEnvironment] = useState<Environment>('humid');
  const [coating, setCoating] = useState<Coating>('none');
  const [spots, setSpots] = useState<CorrosionSpot[]>([]);
  const [elapsedDays, setElapsedDays] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeSpeed, setTimeSpeed] = useState(1);
  const spotIdRef = useRef(0);

  const metalConfig = METAL_CONFIG[metal];
  const coatingConfig = COATING_CONFIG[coating];
  const effectiveRate = metalConfig.corrosionRate[environment] * coatingConfig.protection;

  const resetSimulation = useCallback(() => {
    setSpots([]);
    setElapsedDays(0);
    setIsRunning(false);
  }, []);

  // Simulation loop
  useEffect(() => {
    if (!isRunning || !isPlaying) return;

    const interval = setInterval(() => {
      setElapsedDays(prev => prev + timeSpeed);

      // Spawn corrosion spots based on rate
      if (Math.random() < effectiveRate * 0.15 * timeSpeed) {
        setSpots(prev => {
          if (prev.length > 50) return prev;
          return [...prev, {
            id: spotIdRef.current++,
            x: 10 + Math.random() * 80,
            y: 10 + Math.random() * 80,
            size: 2 + Math.random() * 4,
            age: 0,
          }];
        });
      }

      // Grow existing spots
      setSpots(prev => prev.map(s => ({
        ...s,
        size: Math.min(s.size + effectiveRate * 0.05 * timeSpeed, 25),
        age: s.age + timeSpeed,
      })));
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, isPlaying, effectiveRate, timeSpeed]);

  const corrosionPercentage = Math.min(100, spots.reduce((sum, s) => sum + s.size, 0) / 3);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Mode Tabs */}
      <div className="flex gap-2">
        {([['simulate', '⏱️ Simulate'], ['protect', '🛡️ Protect'], ['learn', '📖 Learn']] as [ViewMode, string][]).map(([m, label]) => (
          <button key={m} onClick={() => { setViewMode(m); resetSimulation(); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${viewMode === m ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* SIMULATE MODE */}
      {(viewMode === 'simulate' || viewMode === 'protect') && (
        <>
          <h3 className="text-xl font-bold text-amber-400">🔩 Corrosion Lab — Day {Math.floor(elapsedDays)}</h3>

          {/* Metal selector */}
          <div className="flex gap-2 flex-wrap justify-center">
            {(Object.entries(METAL_CONFIG) as [MetalSample, typeof METAL_CONFIG['iron']][]).map(([key, cfg]) => (
              <button key={key} onClick={() => { setMetal(key); resetSimulation(); }}
                className={`px-3 py-2 rounded-xl text-sm ${metal === key ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                {cfg.emoji} {cfg.name}
              </button>
            ))}
          </div>

          {/* Environment selector */}
          <div className="flex gap-2 flex-wrap justify-center">
            {([['dry', '☀️ Dry'], ['humid', '💧 Humid'], ['saltwater', '🌊 Saltwater'], ['acid', '🧪 Acid Rain']] as [Environment, string][]).map(([env, label]) => (
              <button key={env} onClick={() => { setEnvironment(env); resetSimulation(); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${environment === env ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Coating selector (protect mode) */}
          {viewMode === 'protect' && (
            <div className="flex gap-2 flex-wrap justify-center">
              {(Object.entries(COATING_CONFIG) as [Coating, typeof COATING_CONFIG['none']][]).map(([key, cfg]) => (
                <button key={key} onClick={() => { setCoating(key); resetSimulation(); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${coating === key ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                  {cfg.emoji} {cfg.name}
                </button>
              ))}
            </div>
          )}

          {/* Metal Sample Visualization */}
          <div className="relative w-56 min-h-40 rounded-xl overflow-hidden border-2 border-slate-600 shadow-inner"
            style={{ backgroundColor: metalConfig.color }}>
            
            {/* Coating layer visual */}
            {coating !== 'none' && (
              <div className="absolute inset-0 border-4 rounded-lg"
                style={{ borderColor: coating === 'paint' ? '#3b82f6' : coating === 'oil' ? '#a3a3a3' : coating === 'zinc' ? '#d4d4d8' : '#e2e8f0', opacity: 0.6 }} />
            )}

            {/* Corrosion spots */}
            {spots.map(spot => (
              <motion.div
                key={spot.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.7 + Math.random() * 0.3 }}
                className="absolute rounded-full"
                style={{
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  width: spot.size,
                  height: spot.size,
                  backgroundColor: metalConfig.corrosionColor,
                  transform: 'translate(-50%, -50%)',
                  filter: `blur(${spot.size > 10 ? 1 : 0}px)`,
                }}
              />
            ))}

            {/* Metal label */}
            <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-xs text-white">
              {metalConfig.emoji} {metalConfig.name}
            </div>

            {/* Environment particles */}
            {environment === 'humid' && isRunning && Array.from({ length: 5 }).map((_, i) => (
              <motion.div key={i} className="absolute w-1 h-1 bg-cyan-400/60 rounded-full"
                animate={{ y: [0, 140], x: [20 + i * 40, 25 + i * 40], opacity: [0, 0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} />
            ))}
            {environment === 'saltwater' && isRunning && (
              <motion.div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-cyan-600/30 to-transparent"
                animate={{ height: ['20%', '25%', '20%'] }} transition={{ duration: 2, repeat: Infinity }} />
            )}
          </div>

          {/* Corrosion meter */}
          <div className="w-full max-w-xs">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Corrosion: {metalConfig.corrosionName}</span>
              <span className={corrosionPercentage > 60 ? 'text-red-400' : corrosionPercentage > 30 ? 'text-amber-400' : 'text-green-400'}>
                {Math.round(corrosionPercentage)}%
              </span>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full"
                style={{ width: `${corrosionPercentage}%`, backgroundColor: metalConfig.corrosionColor }} />
            </div>
          </div>

          {/* Speed & Controls */}
          <div className="flex items-center gap-3">
            <button onClick={() => setIsRunning(!isRunning)}
              className={`px-6 py-3 rounded-xl text-white font-bold ${isRunning ? 'bg-red-600 hover:bg-red-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}>
              {isRunning ? '⏸ Pause' : '▶ Start'}
            </button>
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-xl">
              <span className="text-xs text-slate-400">Speed:</span>
              {[1, 5, 20].map(s => (
                <button key={s} onClick={() => setTimeSpeed(s)}
                  className={`px-2 py-1 rounded text-xs font-bold ${timeSpeed === s ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                  {s}x
                </button>
              ))}
            </div>
            <button onClick={resetSimulation} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white text-sm">🔄</button>
          </div>
        </>
      )}

      {/* LEARN MODE */}
      {viewMode === 'learn' && (
        <>
          <h3 className="text-xl font-bold text-amber-400">📖 Understanding Corrosion</h3>

          <div className="w-full max-w-md space-y-3">
            {[
              { title: 'What is corrosion?', desc: 'A chemical reaction where metals react with oxygen, water, or acids and degrade over time.', emoji: '⚗️' },
              { title: 'Rusting = Iron + O₂ + H₂O', desc: 'Iron forms iron oxide (Fe₂O₃) — the reddish-brown layer we call rust.', emoji: '🔩' },
              { title: 'Patina on Copper', desc: 'Copper reacts with CO₂ to form green copper carbonate — like the Statue of Liberty!', emoji: '🗽' },
              { title: 'Noble metals resist corrosion', desc: 'Gold and platinum barely corrode, which is why they\'re prized for jewelry.', emoji: '🥇' },
              { title: 'Prevention methods', desc: 'Painting, oiling, galvanizing (zinc coating), alloying (stainless steel), and chrome plating.', emoji: '🛡️' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 flex gap-3">
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <p className="font-bold text-white text-sm">{item.title}</p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Indian Context */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-3 max-w-sm text-center">
        <p className="text-sm text-emerald-200">
          <span className="font-bold">🇮🇳 Iron Pillar of Delhi:</span> This 1600-year-old iron pillar barely rusts! 
          Ancient Indian metallurgists used high-phosphorus iron that creates a protective misawite layer.
        </p>
      </motion.div>
    </div>
  );
}
