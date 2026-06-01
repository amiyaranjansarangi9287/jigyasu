import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { CanvasProps } from '../../types';

interface DecayParticle { id: number; x: number; y: number; vx: number; vy: number; type: 'alpha' | 'beta' | 'gamma'; life: number; }

type RadType = 'alpha' | 'beta' | 'gamma';
type ViewMode = 'decay' | 'halflife' | 'uses';

const RAD_INFO: Record<RadType, { name: string; symbol: string; emoji: string; particle: string; charge: string; penetration: string; stoppedBy: string; color: string; speed: number }> = {
  alpha: { name: 'Alpha', symbol: 'α', emoji: '🔴', particle: '²He (2p + 2n)', charge: '+2', penetration: 'Low (few cm in air)', stoppedBy: 'Paper / Skin', color: '#ef4444', speed: 2 },
  beta: { name: 'Beta', symbol: 'β', emoji: '🔵', particle: 'Electron (e⁻)', charge: '-1', penetration: 'Medium (few mm metal)', stoppedBy: 'Aluminium foil', color: '#3b82f6', speed: 5 },
  gamma: { name: 'Gamma', symbol: 'γ', emoji: '🟡', particle: 'Photon (EM wave)', charge: '0', penetration: 'High (passes through body)', stoppedBy: 'Thick lead / concrete', color: '#eab308', speed: 8 },
};

export default function RadioactivityCanvas({ isPlaying }: CanvasProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('decay');
  const [radType, setRadType] = useState<RadType>('alpha');
  const [particles, setParticles] = useState<DecayParticle[]>([]);
  const [isDecaying, setIsDecaying] = useState(false);
  const [halfLifeYears, setHalfLifeYears] = useState(10);
  const [atomsRemaining, setAtomsRemaining] = useState(100);
  const [yearsPassed, setYearsPassed] = useState(0);
  const [hlRunning, setHlRunning] = useState(false);
  const pidRef = useRef(0);

  // Decay particle animation
  useEffect(() => {
    if (!isDecaying || !isPlaying) return;

    const interval = setInterval(() => {
      // Spawn new decay particle
      const info = RAD_INFO[radType];
      setParticles(prev => [
        ...prev.filter(p => p.life > 0).slice(-30),
        {
          id: pidRef.current++,
          x: 120, y: 100,
          vx: (2 + Math.random() * info.speed) * (Math.random() > 0.5 ? 1 : -1),
          vy: (Math.random() - 0.5) * info.speed,
          type: radType,
          life: 40,
        }
      ].map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - 1 })));
    }, 80);

    return () => clearInterval(interval);
  }, [isDecaying, isPlaying, radType]);

  // Half-life simulation
  useEffect(() => {
    if (!hlRunning || !isPlaying) return;

    const interval = setInterval(() => {
      setYearsPassed(prev => {
        const next = prev + halfLifeYears / 10;
        return next;
      });
      setAtomsRemaining(prev => {
        const decayProb = 0.693 / halfLifeYears; // ln(2)/t_half
        const decayed = prev * decayProb * (halfLifeYears / 10);
        const remaining = Math.max(0.1, prev - decayed);
        if (remaining < 1) setHlRunning(false);
        return remaining;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [hlRunning, isPlaying, halfLifeYears]);

  const resetHalfLife = () => {
    setAtomsRemaining(100);
    setYearsPassed(0);
    setHlRunning(false);
  };

  const info = RAD_INFO[radType];

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-2">
        {([['decay', '☢️ Decay'], ['halflife', '⏱️ Half-Life'], ['uses', '🏥 Uses']] as [ViewMode, string][]).map(([m, label]) => (
          <button key={m} onClick={() => setViewMode(m)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold ${viewMode === m ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* DECAY MODE */}
      {viewMode === 'decay' && (
        <>
          <h3 className="text-xl font-bold text-amber-400">☢️ Radioactive Decay</h3>

          {/* Radiation type selector */}
          <div className="flex gap-2">
            {(Object.keys(RAD_INFO) as RadType[]).map(rt => (
              <button key={rt} onClick={() => setRadType(rt)}
                className={`px-4 py-2 rounded-xl text-sm font-bold ${radType === rt ? 'text-white' : 'bg-slate-700 text-slate-300'}`}
                style={radType === rt ? { backgroundColor: RAD_INFO[rt].color } : {}}>
                {RAD_INFO[rt].emoji} {RAD_INFO[rt].name} ({RAD_INFO[rt].symbol})
              </button>
            ))}
          </div>

          {/* Decay visualization */}
          <div className="relative w-72 h-48 bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
            {/* Nucleus */}
            <motion.div className="absolute left-28 top-16 w-16 h-16 bg-gradient-to-br from-amber-500 to-red-600 rounded-full flex items-center justify-center shadow-lg"
              animate={isDecaying ? { scale: [1, 0.95, 1] } : {}} transition={{ duration: 0.5, repeat: isDecaying ? Infinity : 0 }}>
              <span className="text-white font-bold text-sm">☢️</span>
            </motion.div>

            {/* Emitted particles */}
            {particles.map(p => (
              <div key={p.id} className="absolute rounded-full"
                style={{
                  left: p.x, top: p.y,
                  width: p.type === 'alpha' ? 8 : p.type === 'beta' ? 4 : 2,
                  height: p.type === 'alpha' ? 8 : p.type === 'beta' ? 4 : 2,
                  backgroundColor: RAD_INFO[p.type].color,
                  opacity: p.life / 40,
                  boxShadow: `0 0 ${p.type === 'gamma' ? 8 : 4}px ${RAD_INFO[p.type].color}`,
                }} />
            ))}

            {/* Barriers for penetration demo */}
            <div className="absolute right-16 top-4 bottom-4 w-1 bg-amber-200/40 flex flex-col justify-center">
              <span className="text-[8px] text-amber-200 -rotate-90 whitespace-nowrap">Paper</span>
            </div>
            <div className="absolute right-10 top-4 bottom-4 w-2 bg-slate-400/40 flex flex-col justify-center">
              <span className="text-[8px] text-slate-300 -rotate-90 whitespace-nowrap">Al</span>
            </div>
            <div className="absolute right-4 top-4 bottom-4 w-3 bg-slate-600/40 flex flex-col justify-center">
              <span className="text-[8px] text-slate-200 -rotate-90 whitespace-nowrap">Lead</span>
            </div>
          </div>

          <button onClick={() => setIsDecaying(!isDecaying)}
            className={`px-6 py-3 rounded-xl text-white font-bold ${isDecaying ? 'bg-red-600' : 'bg-amber-600'}`}>
            {isDecaying ? '⏹ Stop' : '▶ Emit Radiation'}
          </button>

          {/* Info card */}
          <div className="bg-slate-800/50 rounded-xl p-4 max-w-sm w-full border border-slate-700">
            <h4 className="font-bold text-white mb-2">{info.emoji} {info.name} Radiation ({info.symbol})</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-700/50 p-2 rounded"><span className="text-slate-400">Particle:</span> <span className="text-white">{info.particle}</span></div>
              <div className="bg-slate-700/50 p-2 rounded"><span className="text-slate-400">Charge:</span> <span className="text-white">{info.charge}</span></div>
              <div className="bg-slate-700/50 p-2 rounded"><span className="text-slate-400">Penetration:</span> <span className="text-white">{info.penetration}</span></div>
              <div className="bg-slate-700/50 p-2 rounded"><span className="text-slate-400">Stopped by:</span> <span className="text-white">{info.stoppedBy}</span></div>
            </div>
          </div>
        </>
      )}

      {/* HALF-LIFE MODE */}
      {viewMode === 'halflife' && (
        <>
          <h3 className="text-xl font-bold text-cyan-400">⏱️ Half-Life Simulator</h3>
          <p className="text-slate-400 text-sm">Watch atoms decay over time</p>

          {/* Atom grid */}
          <div className="w-full max-w-sm bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <div className="grid grid-cols-10 gap-1 mb-4">
              {Array.from({ length: 100 }).map((_, i) => (
                <motion.div key={i}
                  className={`w-4 h-4 rounded-sm ${i < Math.round(atomsRemaining) ? 'bg-amber-500' : 'bg-slate-700'}`}
                  animate={{ scale: i < Math.round(atomsRemaining) ? 1 : 0.6 }} />
              ))}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-amber-400 font-bold">{Math.round(atomsRemaining)}% remaining</span>
              <span className="text-slate-400">{Math.round(yearsPassed)} years</span>
            </div>
          </div>

          {/* Half-life control */}
          <div className="w-full max-w-xs">
            <div className="flex justify-between text-sm text-slate-300 mb-1">
              <span>Half-life period</span><span>{halfLifeYears} years</span>
            </div>
            <input type="range" min="1" max="50" value={halfLifeYears} onChange={e => { setHalfLifeYears(Number(e.target.value)); resetHalfLife(); }}
              className="w-full h-3 bg-gradient-to-r from-green-500 to-red-500 rounded-lg appearance-none cursor-pointer" />
          </div>

          <div className="flex gap-3">
            <button onClick={() => setHlRunning(!hlRunning)}
              className={`px-6 py-3 rounded-xl text-white font-bold ${hlRunning ? 'bg-red-600' : 'bg-cyan-600'}`}>
              {hlRunning ? '⏸ Pause' : '▶ Start Decay'}
            </button>
            <button onClick={resetHalfLife} className="px-4 py-3 bg-slate-700 rounded-xl text-white">🔄</button>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-3 max-w-sm text-xs text-slate-300">
            <p>After 1 half-life → 50% remains</p>
            <p>After 2 half-lives → 25% remains</p>
            <p>After 3 half-lives → 12.5% remains</p>
            <p className="mt-2 text-amber-400">Carbon-14 has a half-life of 5730 years — used to date ancient artifacts!</p>
          </div>
        </>
      )}

      {/* USES MODE */}
      {viewMode === 'uses' && (
        <>
          <h3 className="text-xl font-bold text-emerald-400">🏥 Peaceful Uses of Radioactivity</h3>

          <div className="w-full max-w-md space-y-3">
            {[
              { title: 'Medicine — Cancer Treatment', desc: 'Gamma rays target and destroy cancer cells. Cobalt-60 therapy saves millions of lives.', emoji: '🏥', indianContext: 'AIIMS and Tata Memorial use radiotherapy' },
              { title: 'Carbon Dating', desc: 'C-14 half-life (5730 years) tells us how old ancient objects are.', emoji: '🏛️', indianContext: 'Dated Indus Valley artifacts to 3300 BCE!' },
              { title: 'Nuclear Power', desc: 'Controlled fission of Uranium generates electricity.', emoji: '⚡', indianContext: 'Kudankulam, Tarapur — India\'s nuclear plants' },
              { title: 'Food Preservation', desc: 'Gamma irradiation kills bacteria, extending shelf life without chemicals.', emoji: '🍎', indianContext: 'BARC developed food irradiation tech for India' },
              { title: 'Smoke Detectors', desc: 'Americium-241 emits alpha particles that detect smoke.', emoji: '🔔', indianContext: 'Found in buildings across India' },
              { title: 'Thorium Fuel', desc: 'India has 25% of world\'s thorium — future nuclear fuel!', emoji: '🇮🇳', indianContext: 'India\'s 3-stage nuclear program uses thorium' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <div className="flex gap-3">
                  <span className="text-3xl">{item.emoji}</span>
                  <div>
                    <h4 className="font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400 mb-1">{item.desc}</p>
                    <p className="text-xs text-emerald-400">🇮🇳 {item.indianContext}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-3 max-w-sm text-center">
        <p className="text-sm text-emerald-200">
          <span className="font-bold">🇮🇳 Homi Bhabha's Vision:</span> India's 3-stage nuclear program plans to use 
          thorium (abundant in Kerala beach sands) for clean, sustainable energy!
        </p>
      </motion.div>
    </div>
  );
}
