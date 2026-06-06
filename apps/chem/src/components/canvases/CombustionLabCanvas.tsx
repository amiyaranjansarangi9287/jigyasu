import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CanvasProps } from '../../types';

interface FlameParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  type: 'flame' | 'smoke' | 'spark' | 'co2' | 'h2o';
}

type FuelType = 'candle' | 'wood' | 'gas';

export default function CombustionLabCanvas({ isPlaying }: CanvasProps) {
  const [oxygenLevel, setOxygenLevel] = useState(50);
  const [isLit, setIsLit] = useState(true);
  const [fuelType, setFuelType] = useState<FuelType>('candle');
  const [addedSubstance, setAddedSubstance] = useState<'water' | 'oil' | 'sand' | 'lid' | null>(null);
  const [particles, setParticles] = useState<FlameParticle[]>([]);
  const [message, setMessage] = useState('');
  const [showTriangle, setShowTriangle] = useState(false);
  const animRef = useRef<number | null>(null);
  const pidRef = useRef(0);

  const flameIntensity = Math.max(0, Math.min(1, oxygenLevel / 50));
  const isCompleteCombuston = oxygenLevel > 40;

  // Particle system
  const spawnParticle = useCallback((type: FlameParticle['type']): FlameParticle => {
    const baseX = 144;
    const baseY = fuelType === 'candle' ? 120 : fuelType === 'wood' ? 130 : 110;
    const id = pidRef.current++;

    switch (type) {
      case 'flame':
        return {
          id, type,
          x: baseX + (Math.random() - 0.5) * 20 * flameIntensity,
          y: baseY,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -(Math.random() * 3 + 1) * flameIntensity,
          life: 25 + Math.random() * 15,
          maxLife: 40,
          size: 6 + Math.random() * 8 * flameIntensity,
        };
      case 'smoke':
        return {
          id, type,
          x: baseX + (Math.random() - 0.5) * 30,
          y: baseY - 40,
          vx: (Math.random() - 0.5) * 2,
          vy: -(Math.random() * 1.5 + 0.5),
          life: 50 + Math.random() * 30,
          maxLife: 80,
          size: 4 + Math.random() * 6,
        };
      case 'spark':
        return {
          id, type,
          x: baseX + (Math.random() - 0.5) * 10,
          y: baseY - 10,
          vx: (Math.random() - 0.5) * 4,
          vy: -(Math.random() * 5 + 2),
          life: 15 + Math.random() * 10,
          maxLife: 25,
          size: 2 + Math.random() * 3,
        };
      case 'co2':
        return {
          id, type,
          x: baseX + (Math.random() - 0.5) * 40,
          y: baseY - 50 - Math.random() * 20,
          vx: (Math.random() - 0.5) * 1,
          vy: -(Math.random() * 0.8 + 0.3),
          life: 60 + Math.random() * 30,
          maxLife: 90,
          size: 8,
        };
      default: // h2o
        return {
          id, type: 'h2o',
          x: baseX + (Math.random() - 0.5) * 40,
          y: baseY - 60 - Math.random() * 20,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(Math.random() * 0.6 + 0.2),
          life: 50 + Math.random() * 30,
          maxLife: 80,
          size: 6,
        };
    }
  }, [flameIntensity, fuelType]);

  const animate = useCallback(() => {
    if (!isPlaying) return;

    setParticles(prev => {
      let next = prev
        .map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.type === 'spark' ? p.vy + 0.15 : p.vy,
          vx: p.vx + (Math.random() - 0.5) * 0.3,
          life: p.life - 1,
          size: p.type === 'smoke' ? p.size * 1.02 : p.size * 0.97,
        }))
        .filter(p => p.life > 0 && p.y > -10);

      // Spawn new particles when lit
      if (isLit) {
        const spawnRate = flameIntensity;
        if (Math.random() < spawnRate * 0.5) next.push(spawnParticle('flame'));
        if (Math.random() < spawnRate * 0.5) next.push(spawnParticle('flame'));
        if (Math.random() < (isCompleteCombuston ? 0.02 : 0.12)) next.push(spawnParticle('smoke'));
        if (Math.random() < spawnRate * 0.08) next.push(spawnParticle('spark'));
        if (Math.random() < 0.03) next.push(spawnParticle('co2'));
        if (Math.random() < 0.02) next.push(spawnParticle('h2o'));
      }

      return next.slice(-120);
    });

    animRef.current = requestAnimationFrame(animate);
  }, [isPlaying, isLit, flameIntensity, isCompleteCombuston, spawnParticle]);

  useEffect(() => {
    if (isPlaying) {
      animRef.current = requestAnimationFrame(animate);
    }
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isPlaying, animate]);

  // Auto-extinguish at very low oxygen
  useEffect(() => {
    if (oxygenLevel < 8 && isLit) {
      setIsLit(false);
      setMessage('🕯️ Flame extinguished — not enough oxygen!');
    }
  }, [oxygenLevel, isLit]);

  const addSubstance = (substance: 'water' | 'oil' | 'sand' | 'lid') => {
    if (!isPlaying || !isLit) return;
    setAddedSubstance(substance);

    setTimeout(() => {
      switch (substance) {
        case 'water':
          setIsLit(false);
          setMessage('💧 Water cools the fuel below ignition temperature!');
          break;
        case 'oil':
          setOxygenLevel(prev => Math.min(100, prev + 30));
          setMessage('⚠️ OIL FIRE! Oil splashes spread flames. NEVER use water on oil fires!');
          // Spawn extra flame particles
          for (let i = 0; i < 20; i++) {
            setParticles(prev => [...prev, spawnParticle('flame'), spawnParticle('spark')]);
          }
          break;
        case 'sand':
          setIsLit(false);
          setMessage('🏖️ Sand smothers the flame — cuts off oxygen supply!');
          break;
        case 'lid':
          setIsLit(false);
          setMessage('🫙 Lid cuts off oxygen completely — flame goes out!');
          break;
      }
      setTimeout(() => setAddedSubstance(null), 2000);
    }, 500);
  };

  const relight = () => {
    if (!isPlaying) return;
    setIsLit(true);
    setOxygenLevel(50);
    setMessage('');
    setAddedSubstance(null);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const getParticleStyle = (p: FlameParticle) => {
    const lifeRatio = p.life / p.maxLife;
    switch (p.type) {
      case 'flame': {
        const hue = oxygenLevel > 70 ? 220 : lifeRatio > 0.7 ? 50 : lifeRatio > 0.3 ? 30 : 10;
        return {
          backgroundColor: `hsla(${hue}, 100%, ${50 + lifeRatio * 30}%, ${lifeRatio * 0.9})`,
          borderRadius: '50%',
          filter: `blur(${(1 - lifeRatio) * 2}px)`,
          boxShadow: `0 0 ${p.size}px hsla(${hue}, 100%, 60%, ${lifeRatio * 0.5})`,
        };
      }
      case 'smoke':
        return {
          backgroundColor: `rgba(100, 100, 100, ${lifeRatio * 0.25})`,
          borderRadius: '50%',
          filter: `blur(${(1 - lifeRatio) * 4 + 2}px)`,
        };
      case 'spark':
        return {
          backgroundColor: `rgba(255, 200, 50, ${lifeRatio})`,
          borderRadius: '50%',
          boxShadow: `0 0 4px rgba(255, 150, 0, ${lifeRatio})`,
        };
      case 'co2':
        return { opacity: lifeRatio * 0.7 };
      case 'h2o':
        return { opacity: lifeRatio * 0.6 };
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h3 className="text-xl font-bold text-emerald-400">🔥 Combustion Lab</h3>

      {/* Fuel Selector */}
      <div className="flex gap-2">
        {[
          { type: 'candle' as FuelType, label: '🕯️ Candle' },
          { type: 'wood' as FuelType, label: '🪵 Wood' },
          { type: 'gas' as FuelType, label: '🔵 Gas Burner' },
        ].map(f => (
          <button key={f.type} onClick={() => { setFuelType(f.type); relight(); }}
            className={`px-3 py-2 rounded-xl text-sm font-semibold ${fuelType === f.type ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Scene */}
      <div className="relative w-72 min-h-64 bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl overflow-hidden border-2 border-slate-700">
        {/* Glow */}
        {isLit && (
          <div className="absolute inset-0" style={{
            background: `radial-gradient(circle at 50% ${fuelType === 'candle' ? '55%' : '60%'}, 
              rgba(251, 191, 36, ${flameIntensity * 0.15}) 0%, transparent 50%)`,
          }} />
        )}

        {/* Particles */}
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute pointer-events-none"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              transform: 'translate(-50%, -50%)',
              ...getParticleStyle(p),
            }}
          >
            {p.type === 'co2' && <span className="text-[8px] text-slate-500 font-mono">CO₂</span>}
            {p.type === 'h2o' && <span className="text-[8px] text-cyan-500 font-mono">H₂O</span>}
          </div>
        ))}

        {/* Fuel */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          {fuelType === 'candle' && (
            <>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-3 bg-gray-700" />
              <div className="w-10 min-h-16 bg-gradient-to-b from-amber-100 to-amber-200 rounded-t-sm rounded-b-lg shadow-md" />
            </>
          )}
          {fuelType === 'wood' && (
            <div className="flex gap-1 items-end">
              <div className="w-5 h-8 bg-amber-800 rounded-sm -rotate-12" />
              <div className="w-5 h-10 bg-amber-700 rounded-sm" />
              <div className="w-5 h-7 bg-amber-900 rounded-sm rotate-12" />
            </div>
          )}
          {fuelType === 'gas' && (
            <div className="flex flex-col items-center">
              <div className="w-4 h-8 bg-slate-400 rounded-t" />
              <div className="w-16 h-4 bg-slate-500 rounded" />
            </div>
          )}
        </div>

        {/* Substance effects */}
        <AnimatePresence>
          {addedSubstance === 'water' && (
            <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 60, opacity: 1 }} exit={{ opacity: 0 }} className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl">💧💧</motion.div>
          )}
          {addedSubstance === 'oil' && (
            <motion.div initial={{ scale: 1 }} animate={{ scale: [1, 2, 1.5] }} className="absolute bottom-20 left-1/2 -translate-x-1/2 text-3xl">🔥🔥🔥</motion.div>
          )}
          {addedSubstance === 'sand' && (
            <motion.div initial={{ y: -30 }} animate={{ y: 50 }} className="absolute top-10 left-1/2 -translate-x-1/2 text-2xl">⏬🏖️</motion.div>
          )}
          {addedSubstance === 'lid' && (
            <motion.div initial={{ y: -30 }} animate={{ y: 30 }} className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-3 bg-slate-400 rounded" />
          )}
        </AnimatePresence>

        {/* Combustion type label */}
        {isLit && (
          <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-[10px] font-bold ${
            isCompleteCombuston ? 'bg-green-600/80 text-white' : 'bg-amber-600/80 text-white'
          }`}>
            {isCompleteCombuston ? '✓ Complete' : '⚠ Incomplete'}
          </div>
        )}
      </div>

      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`px-4 py-2 rounded-xl text-sm max-w-sm text-center font-medium ${message.includes('NEVER') || message.includes('OIL') ? 'bg-red-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Oxygen Control */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-slate-300">🫧 Oxygen</span>
          <span className="text-sm font-mono text-white">{oxygenLevel}%</span>
        </div>
        <input type="range" min="0" max="100" value={oxygenLevel}
          onChange={(e) => setOxygenLevel(Number(e.target.value))} disabled={!isLit}
          className="w-full h-3 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-lg appearance-none cursor-pointer" />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>Suffocate</span>
          <span>Normal</span>
          <span>Oxygen-rich</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { id: 'water', label: '💧 Water', disabled: !isLit },
          { id: 'oil', label: '🫒 Oil', disabled: !isLit },
          { id: 'sand', label: '🏖️ Sand', disabled: !isLit },
          { id: 'lid', label: '🫙 Lid', disabled: !isLit },
        ].map(btn => (
          <motion.button key={btn.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => addSubstance(btn.id as 'water' | 'oil' | 'sand' | 'lid')}
            disabled={btn.disabled || !isPlaying}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 rounded-xl text-white text-sm">
            {btn.label}
          </motion.button>
        ))}
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={relight} disabled={isLit}
          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 rounded-xl text-white text-sm">
          🔥 Relight
        </motion.button>
      </div>

      {/* Fire Triangle Toggle */}
      <button onClick={() => setShowTriangle(!showTriangle)} className="text-sm text-amber-400 hover:text-amber-300">
        🔺 {showTriangle ? 'Hide' : 'Show'} Fire Triangle
      </button>

      <AnimatePresence>
        {showTriangle && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="bg-slate-800/50 rounded-xl p-4 max-w-sm">
            <h4 className="font-bold text-slate-300 mb-3 text-center">🔺 Fire Triangle</h4>
            <div className="flex justify-around text-center text-sm mb-3">
              <div><span className="text-3xl block mb-1">⛽</span><p className="text-slate-400">Fuel</p><p className="text-xs text-slate-500">Wood, wax, gas</p></div>
              <div><span className="text-3xl block mb-1">🌡️</span><p className="text-slate-400">Heat</p><p className="text-xs text-slate-500">Ignition temp</p></div>
              <div><span className="text-3xl block mb-1">🫧</span><p className="text-slate-400">Oxygen</p><p className="text-xs text-slate-500">From air</p></div>
            </div>
            <p className="text-xs text-slate-500 text-center">Remove any one side to extinguish fire! Water removes heat, sand/lid removes oxygen, and running out of fuel stops it.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indian Context */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-3 max-w-sm text-center">
        <p className="text-sm text-emerald-200">
          <span className="font-bold">🪔 Diwali Diyas:</span> Clay diyas use ghee or oil as fuel. The flame flickers in wind 
          because oxygen flow changes — that&apos;s the fire triangle at work!
        </p>
      </motion.div>
    </div>
  );
}
