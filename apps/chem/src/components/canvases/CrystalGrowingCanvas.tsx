import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { CanvasProps } from '../../types';

interface CrystalFacet {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  hue: number;
  opacity: number;
  generation: number;
}

type CrystalType = 'salt' | 'sugar' | 'alum' | 'copper-sulfate';
type ViewMode = 'grow' | 'compare' | 'journal';

const CRYSTAL_CONFIG: Record<CrystalType, {
  name: string; emoji: string; colorBase: string; hue: number;
  shapeSides: number; growthRate: number; formula: string;
  indianContext: string; description: string;
  steps: string[];
}> = {
  salt: {
    name: 'Salt (NaCl)', emoji: '🧂', colorBase: '#e2e8f0', hue: 210,
    shapeSides: 4, growthRate: 1.0, formula: 'NaCl',
    indianContext: 'Sambhar Lake, Rajasthan — millions of tonnes of salt evaporated from lake water!',
    description: 'Cubic crystal system — Na⁺ and Cl⁻ ions alternate in a perfect 3D grid.',
    steps: ['Dissolve salt in hot water until no more dissolves', 'Let solution cool slowly (supersaturation)', 'Hang a seed crystal on a string', 'Wait 3-7 days for growth'],
  },
  sugar: {
    name: 'Rock Sugar (Mishri)', emoji: '🍬', colorBase: '#fef3c7', hue: 45,
    shapeSides: 6, growthRate: 0.6, formula: 'C₁₂H₂₂O₁₁',
    indianContext: 'Mishri is offered as prasad in temples and used in Ayurvedic medicines!',
    description: 'Monoclinic crystal system — large sugar molecules stack in an asymmetric pattern.',
    steps: ['Make thick sugar syrup by boiling', 'Pour into moulds with cotton threads', 'Store in cool, undisturbed place', 'Wait 7-14 days — crystals grow on threads!'],
  },
  alum: {
    name: 'Alum (Fitkari)', emoji: '💎', colorBase: '#e0e7ff', hue: 240,
    shapeSides: 8, growthRate: 0.8, formula: 'KAl(SO₄)₂·12H₂O',
    indianContext: 'Fitkari has been used to purify water in Indian villages for centuries!',
    description: 'Octahedral crystal — grows into beautiful 8-faced transparent gems.',
    steps: ['Dissolve alum in hot water', 'Filter the solution', 'Hang a small seed crystal in cooled solution', 'Beautiful octahedra form in 3-5 days!'],
  },
  'copper-sulfate': {
    name: 'Copper Sulfate', emoji: '🔵', colorBase: '#3b82f6', hue: 220,
    shapeSides: 4, growthRate: 1.2, formula: 'CuSO₄·5H₂O',
    indianContext: 'Used in Bordeaux mixture to protect crops and in electroplating copper items.',
    description: 'Triclinic crystal — brilliant blue colour from Cu²⁺ ions. Handle with care!',
    steps: ['Dissolve blue crystals in warm water', 'Add a small crystal as seed', 'Place in a vibration-free spot', 'Stunning blue crystals in 2-4 days!'],
  },
};

export default function CrystalGrowingCanvas({ isPlaying }: CanvasProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grow');
  const [crystalType, setCrystalType] = useState<CrystalType>('salt');
  const [facets, setFacets] = useState<CrystalFacet[]>([]);
  const [isGrowing, setIsGrowing] = useState(false);
  const [saturation, setSaturation] = useState(50);
  const [temperature, setTemperature] = useState(60);
  const [daysPassed, setDaysPassed] = useState(0);
  const [seedPlaced, setSeedPlaced] = useState(false);
  const [growthLog, setGrowthLog] = useState<string[]>([]);
  const idRef = useRef(0);

  const config = CRYSTAL_CONFIG[crystalType];
  const isSuperSaturated = saturation > 70 && temperature < 40;

  const resetGrowth = () => {
    setFacets([]);
    setIsGrowing(false);
    setDaysPassed(0);
    setSeedPlaced(false);
    setSaturation(50);
    setTemperature(60);
    setGrowthLog([]);
  };

  const placeSeed = () => {
    setSeedPlaced(true);
    setGrowthLog(['Day 0: Seed crystal placed in solution.']);
    const seedFacets: CrystalFacet[] = [];
    for (let i = 0; i < config.shapeSides; i++) {
      const angle = (i / config.shapeSides) * 360;
      seedFacets.push({
        id: idRef.current++,
        x: 130 + Math.cos((angle * Math.PI) / 180) * 8,
        y: 110 + Math.sin((angle * Math.PI) / 180) * 8,
        size: 6,
        rotation: angle,
        hue: config.hue + (Math.random() - 0.5) * 20,
        opacity: 0.85,
        generation: 0,
      });
    }
    setFacets(seedFacets);
  };

  // Growth simulation
  useEffect(() => {
    if (!isGrowing || !isPlaying || !seedPlaced || !isSuperSaturated) return;

    const interval = setInterval(() => {
      setDaysPassed(prev => {
        const next = prev + 1;
        if (next % 5 === 0) {
          const totalSize = facets.reduce((s, f) => s + f.size, 0);
          setGrowthLog(prev => [...prev, `Day ${next}: Crystal mass ~${Math.round(totalSize)} units. ${totalSize > 200 ? 'Beautiful structure forming!' : 'Steady growth...'}`]);
        }
        return next;
      });

      setFacets(prev => {
        // Grow existing facets
        const grown = prev.map(f => ({
          ...f,
          size: Math.min(f.size + config.growthRate * 0.2 * (saturation / 80), f.generation === 0 ? 30 : 18),
        }));

        // Branch new facets from random existing ones
        if (Math.random() < 0.12 * config.growthRate && prev.length < 60) {
          const parent = prev[Math.floor(Math.random() * prev.length)];
          const angle = parent.rotation + (Math.random() - 0.5) * 90;
          const dist = parent.size * 0.6 + 4;
          grown.push({
            id: idRef.current++,
            x: parent.x + Math.cos((angle * Math.PI) / 180) * dist,
            y: parent.y + Math.sin((angle * Math.PI) / 180) * dist,
            size: 3 + Math.random() * 3,
            rotation: angle + (Math.random() - 0.5) * 30,
            hue: config.hue + (Math.random() - 0.5) * 30,
            opacity: 0.6 + Math.random() * 0.35,
            generation: parent.generation + 1,
          });
        }

        return grown;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isGrowing, isPlaying, seedPlaced, isSuperSaturated, config, saturation, facets]);

  const renderCrystalShape = (f: CrystalFacet) => {
    const sides = config.shapeSides;
    const r = f.size;
    const points = Array.from({ length: sides }, (_, i) => {
      const a = ((i / sides) * 360 + f.rotation) * (Math.PI / 180);
      return `${Math.cos(a) * r},${Math.sin(a) * r}`;
    }).join(' ');

    return (
      <motion.g key={f.id} initial={{ scale: 0 }} animate={{ scale: 1 }}>
        <polygon
          points={points}
          transform={`translate(${f.x}, ${f.y})`}
          fill={`hsla(${f.hue}, 60%, 70%, ${f.opacity * 0.5})`}
          stroke={`hsla(${f.hue}, 70%, 80%, ${f.opacity})`}
          strokeWidth="1"
        />
        {/* Inner highlight for 3D depth */}
        <polygon
          points={Array.from({ length: sides }, (_, i) => {
            const a = ((i / sides) * 360 + f.rotation + 15) * (Math.PI / 180);
            return `${Math.cos(a) * r * 0.5},${Math.sin(a) * r * 0.5}`;
          }).join(' ')}
          transform={`translate(${f.x}, ${f.y})`}
          fill={`hsla(${f.hue}, 50%, 85%, ${f.opacity * 0.3})`}
          stroke="none"
        />
      </motion.g>
    );
  };

  const totalMass = Math.round(facets.reduce((s, f) => s + f.size, 0));

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Tabs */}
      <div className="flex gap-2">
        {([['grow', '💎 Grow'], ['compare', '⚖️ Compare'], ['journal', '📓 Journal']] as [ViewMode, string][]).map(([m, l]) => (
          <button key={m} onClick={() => setViewMode(m)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold ${viewMode === m ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Crystal type selector */}
      <div className="flex gap-2 flex-wrap justify-center">
        {(Object.entries(CRYSTAL_CONFIG) as [CrystalType, typeof config][]).map(([key, cfg]) => (
          <button key={key} onClick={() => { setCrystalType(key); resetGrowth(); }}
            className={`px-3 py-1.5 rounded-xl text-sm ${crystalType === key ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
            {cfg.emoji} {cfg.name.split(' (')[0]}
          </button>
        ))}
      </div>

      {/* GROW MODE */}
      {viewMode === 'grow' && (
        <>
          <h3 className="text-lg font-bold text-purple-400">💎 Growing {config.name}</h3>

          {/* Beaker with SVG crystals */}
          <div className="relative w-64 h-56 border-4 border-slate-500 border-t-0 rounded-b-3xl overflow-hidden bg-slate-900/60">
            {/* Solution */}
            <motion.div className="absolute bottom-0 left-0 right-0"
              style={{ height: '80%', background: `linear-gradient(to top, hsla(${config.hue}, 40%, 30%, 0.4), transparent)` }}
              animate={isSuperSaturated ? { opacity: [0.3, 0.5, 0.3] } : { opacity: 0.3 }}
              transition={{ duration: 2, repeat: Infinity }} />

            {/* String */}
            {seedPlaced && (
              <line x1="130" y1="0" x2="130" y2="100"
                stroke="#94a3b8" strokeWidth="1"
                style={{ position: 'absolute' } as React.CSSProperties} />
            )}

            {/* SVG Crystal rendering */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 260 220">
              {seedPlaced && <line x1="130" y1="0" x2="130" y2="100" stroke="#64748b" strokeWidth="1" />}
              {facets.map(f => renderCrystalShape(f))}
            </svg>

            {/* Status */}
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-1 rounded text-[10px] font-bold ${isSuperSaturated ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                {isSuperSaturated ? '✨ Supersaturated!' : 'Not ready'}
              </span>
            </div>
            <div className="absolute top-2 right-2 text-[10px] text-slate-400">Day {daysPassed}</div>
            <div className="absolute bottom-2 right-2 text-[10px] text-slate-400">Mass: {totalMass}</div>
          </div>

          {/* Controls */}
          <div className="w-full max-w-sm space-y-3">
            <div>
              <div className="flex justify-between text-sm text-slate-300 mb-1">
                <span>Saturation</span>
                <span className={isSuperSaturated ? 'text-purple-400 font-bold' : ''}>{saturation}%</span>
              </div>
              <input type="range" min="10" max="100" value={saturation} onChange={e => setSaturation(Number(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-slate-600 via-purple-400 to-purple-600 rounded-lg appearance-none cursor-pointer" />
            </div>
            <div>
              <div className="flex justify-between text-sm text-slate-300 mb-1">
                <span>Temperature</span><span>{temperature}°C</span>
              </div>
              <input type="range" min="10" max="90" value={temperature} onChange={e => setTemperature(Number(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-blue-500 to-red-500 rounded-lg appearance-none cursor-pointer" />
              <p className="text-[10px] text-slate-500 mt-1">💡 Dissolve in hot water, then cool below 40°C for supersaturation!</p>
            </div>
          </div>

          <div className="flex gap-3">
            {!seedPlaced ? (
              <button onClick={placeSeed} disabled={!isSuperSaturated}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-600 disabled:opacity-50 rounded-xl text-white font-bold">
                {isSuperSaturated ? '💎 Place Seed Crystal' : '⚠️ Make supersaturated first'}
              </button>
            ) : (
              <button onClick={() => setIsGrowing(!isGrowing)} disabled={!isSuperSaturated}
                className={`px-6 py-3 rounded-xl text-white font-bold ${isGrowing ? 'bg-red-600' : 'bg-emerald-600'}`}>
                {isGrowing ? '⏸ Pause' : '▶ Grow'}
              </button>
            )}
            <button onClick={resetGrowth} className="px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white">🔄</button>
          </div>

          {/* Crystal info */}
          <div className="bg-slate-800/50 rounded-xl p-4 max-w-sm w-full border border-slate-700">
            <p className="text-xs text-slate-400 font-mono mb-1">{config.formula}</p>
            <p className="text-sm text-slate-300">{config.description}</p>
            <p className="text-sm text-emerald-400 mt-2">🇮🇳 {config.indianContext}</p>
          </div>
        </>
      )}

      {/* COMPARE MODE */}
      {viewMode === 'compare' && (
        <>
          <h3 className="text-lg font-bold text-purple-400">⚖️ Crystal Comparison</h3>
          <div className="grid grid-cols-2 gap-3 w-full max-w-md">
            {(Object.entries(CRYSTAL_CONFIG) as [CrystalType, typeof config][]).map(([key, cfg]) => (
              <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{cfg.emoji}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{cfg.name.split(' (')[0]}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{cfg.formula}</p>
                  </div>
                </div>
                {/* Mini crystal shape preview */}
                <svg width="60" height="40" className="mx-auto my-2">
                  <polygon
                    points={Array.from({ length: cfg.shapeSides }, (_, i) => {
                      const a = (i / cfg.shapeSides) * Math.PI * 2;
                      return `${30 + Math.cos(a) * 15},${20 + Math.sin(a) * 15}`;
                    }).join(' ')}
                    fill={`hsla(${cfg.hue}, 50%, 65%, 0.5)`}
                    stroke={`hsla(${cfg.hue}, 60%, 75%, 0.8)`}
                    strokeWidth="1.5"
                  />
                </svg>
                <p className="text-[10px] text-slate-400">
                  Shape: {cfg.shapeSides === 4 ? 'Cubic' : cfg.shapeSides === 6 ? 'Hexagonal' : 'Octahedral'}
                  • Speed: {'●'.repeat(Math.round(cfg.growthRate * 3))}{'○'.repeat(3 - Math.round(cfg.growthRate * 3))}
                </p>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* JOURNAL MODE */}
      {viewMode === 'journal' && (
        <>
          <h3 className="text-lg font-bold text-amber-400">📓 Growth Journal</h3>

          {/* How-to steps */}
          <div className="bg-slate-800/50 rounded-xl p-4 max-w-sm w-full border border-slate-700">
            <h4 className="text-sm font-bold text-white mb-3">📋 Steps for {config.name}:</h4>
            {config.steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="flex gap-3 items-start mb-2 last:mb-0">
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm text-slate-300">{step}</p>
              </motion.div>
            ))}
          </div>

          {/* Growth log */}
          {growthLog.length > 0 && (
            <div className="bg-slate-800/50 rounded-xl p-4 max-w-sm w-full border border-slate-700 max-min-h-48 overflow-y-auto">
              <h4 className="text-sm font-bold text-white mb-2">📊 Experiment Log:</h4>
              {growthLog.map((entry, i) => (
                <p key={i} className="text-xs text-slate-400 mb-1 font-mono">{entry}</p>
              ))}
            </div>
          )}

          {growthLog.length === 0 && (
            <p className="text-slate-500 text-sm">Start growing a crystal to see the log here!</p>
          )}
        </>
      )}

      {/* Footer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-3 max-w-sm text-center">
        <p className="text-sm text-emerald-200">
          <span className="font-bold">🧪 Science Tip:</span> The slower you cool the solution, 
          the larger and more perfect your crystals will be! Patience is key.
        </p>
      </motion.div>
    </div>
  );
}
