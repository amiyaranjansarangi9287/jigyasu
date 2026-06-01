import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Flame, Thermometer, Activity, MapPin } from 'lucide-react';
import { CanvasProps } from '../../types';

type VolcanoState = 'dormant' | 'active' | 'erupting';

interface Volcano {
  id: string;
  name: string;
  location: string;
  state: VolcanoState;
  lastEruption?: string;
  info: string;
  isIndian?: boolean;
}

const volcanoes: Volcano[] = [
  { id: 'barren', name: 'Barren Island', location: 'Andaman Islands, India', state: 'active', lastEruption: '2021', info: 'India\'s only active volcano! Located 135 km from Port Blair.', isIndian: true },
  { id: 'narcondam', name: 'Narcondam Island', location: 'Andaman Islands, India', state: 'dormant', info: 'A dormant volcano that last erupted thousands of years ago.', isIndian: true },
  { id: 'deccan', name: 'Deccan Traps', location: 'Western India', state: 'dormant', lastEruption: '66 million years ago', info: 'Ancient volcanic eruptions that covered 500,000 km²!', isIndian: true },
  { id: 'fuji', name: 'Mount Fuji', location: 'Japan', state: 'dormant', lastEruption: '1707', info: 'Japan\'s iconic stratovolcano at 3,776 meters.' },
  { id: 'krakatoa', name: 'Krakatoa', location: 'Indonesia', state: 'active', lastEruption: '2020', info: 'Famous for its 1883 eruption heard 4,800 km away!' },
];

interface LavaParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export function VolcanoesCanvas({ isPlaying }: CanvasProps) {
  const [selectedVolcano, setSelectedVolcano] = useState(volcanoes[0]);
  const [volcanoState, setVolcanoState] = useState<VolcanoState>('dormant');
  const [pressure, setPressure] = useState(0);
  const [temperature] = useState(800);
  const [lavaParticles, setLavaParticles] = useState<LavaParticle[]>([]);
  const [showCrossSection, setShowCrossSection] = useState(true);
  const particleIdRef = useRef(0);

  // Auto-increase pressure when playing
  useEffect(() => {
    if (!isPlaying || volcanoState === 'erupting') return;

    const interval = setInterval(() => {
      setPressure((prev) => {
        const next = prev + 0.5;
        if (next >= 100) {
          setVolcanoState('erupting');
          return 100;
        }
        if (next >= 50) setVolcanoState('active');
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, volcanoState]);

  // Eruption particle simulation
  useEffect(() => {
    if (volcanoState !== 'erupting' || !isPlaying) return;

    const interval = setInterval(() => {
      // Add new particles
      const newParticles: LavaParticle[] = Array.from({ length: 5 }).map(() => ({
        id: particleIdRef.current++,
        x: 50 + (Math.random() - 0.5) * 10,
        y: 30,
        vx: (Math.random() - 0.5) * 8,
        vy: -10 - Math.random() * 15,
        life: 100,
      }));

      setLavaParticles((prev) => {
        const updated = prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * 0.1,
            y: p.y + p.vy * 0.1,
            vy: p.vy + 0.5, // gravity
            life: p.life - 2,
          }))
          .filter((p) => p.life > 0 && p.y < 100);

        return [...updated, ...newParticles].slice(-100);
      });
    }, 50);

    // Stop eruption after some time
    const timeout = setTimeout(() => {
      setVolcanoState('active');
      setPressure(30);
      setLavaParticles([]);
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [volcanoState, isPlaying]);

  const triggerEruption = () => {
    setPressure(100);
    setVolcanoState('erupting');
  };

  const reset = () => {
    setPressure(0);
    setVolcanoState('dormant');
    setLavaParticles([]);
  };

  const getVolcanoColor = () => {
    if (volcanoState === 'erupting') return 'from-red-600 to-orange-700';
    if (volcanoState === 'active') return 'from-amber-700 to-stone-700';
    return 'from-stone-600 to-stone-800';
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950">
      {/* Sky with smoke */}
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-slate-700 to-transparent">
        {volcanoState !== 'dormant' && (
          <div className="absolute inset-0 flex justify-center">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-slate-600/50"
                style={{
                  width: 50 + Math.random() * 50,
                  height: 50 + Math.random() * 50,
                }}
                initial={{ x: (Math.random() - 0.5) * 50, y: 100, opacity: 0.8, scale: 0.5 }}
                animate={{
                  y: -200,
                  opacity: 0,
                  scale: 2,
                  x: (Math.random() - 0.5) * 200,
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Volcano Shape */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <svg viewBox="0 0 200 100" className="w-[400px] h-[200px]">
          {/* Mountain */}
          <path
            d={`M 0 100 L 70 100 L 85 30 Q 100 20 115 30 L 130 100 L 200 100 Z`}
            className={`fill-gradient bg-gradient-to-b ${getVolcanoColor()}`}
            fill="url(#volcanoGradient)"
          />
          <defs>
            <linearGradient id="volcanoGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={volcanoState === 'erupting' ? '#dc2626' : '#78716c'} />
              <stop offset="100%" stopColor="#1c1917" />
            </linearGradient>
          </defs>
          
          {/* Crater glow */}
          {volcanoState !== 'dormant' && (
            <ellipse
              cx="100"
              cy="25"
              rx="15"
              ry="8"
              fill={volcanoState === 'erupting' ? '#fbbf24' : '#f97316'}
              className="animate-pulse"
            />
          )}

          {/* Lava streams */}
          {volcanoState === 'erupting' && (
            <>
              <path
                d="M 95 30 Q 80 60 75 100"
                stroke="#f97316"
                strokeWidth="8"
                fill="none"
                className="animate-pulse"
              />
              <path
                d="M 105 30 Q 120 60 125 100"
                stroke="#ef4444"
                strokeWidth="6"
                fill="none"
                className="animate-pulse"
              />
            </>
          )}
        </svg>
      </div>

      {/* Lava Particles */}
      {lavaParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: `radial-gradient(circle, #fbbf24 0%, #ef4444 50%, #7f1d1d 100%)`,
            boxShadow: '0 0 10px #f97316',
            opacity: particle.life / 100,
          }}
        />
      ))}

      {/* Cross Section View */}
      {showCrossSection && (
        <div className="absolute bottom-0 left-4 w-48 h-32 rounded-t-xl overflow-hidden border border-slate-600 bg-slate-900/80">
          <div className="absolute inset-0">
            {/* Magma Chamber */}
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-full"
              style={{
                width: '80%',
                height: '60%',
                background: 'radial-gradient(ellipse at bottom, #ef4444 0%, #991b1b 50%, #450a0a 100%)',
              }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            {/* Conduit */}
            <div
              className="absolute bottom-[60%] left-1/2 -translate-x-1/2 w-4 bg-gradient-to-t from-red-600 to-orange-500"
              style={{ height: '40%' }}
            />
            {/* Labels */}
            <div className="absolute bottom-2 left-2 text-xs text-red-300">Magma Chamber</div>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-orange-300">Conduit</div>
          </div>
          <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-stone-700 to-transparent h-6" />
        </div>
      )}

      {/* Pressure & Temperature Gauges */}
      <div className="absolute top-4 left-4 space-y-3">
        <div className="rounded-xl bg-slate-800/80 p-3 backdrop-blur">
          <div className="flex items-center gap-2 text-orange-400 mb-2">
            <Activity className="h-4 w-4" />
            <span className="text-sm">Pressure</span>
          </div>
          <div className="h-2 w-32 rounded-full bg-slate-700 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: pressure > 80 ? '#ef4444' : pressure > 50 ? '#f97316' : '#22c55e',
              }}
              animate={{ width: `${pressure}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">{pressure.toFixed(0)}%</p>
        </div>

        <div className="rounded-xl bg-slate-800/80 p-3 backdrop-blur">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <Thermometer className="h-4 w-4" />
            <span className="text-sm">Magma Temp</span>
          </div>
          <p className="text-xl font-bold text-white">{temperature}°C</p>
        </div>
      </div>

      {/* Volcano Selector */}
      <div className="absolute top-4 right-4 rounded-xl bg-slate-800/80 p-3 backdrop-blur max-w-xs">
        <h3 className="text-sm font-medium text-white mb-2">🌋 Select Volcano</h3>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {volcanoes.map((volcano) => (
            <button
              key={volcano.id}
              onClick={() => setSelectedVolcano(volcano)}
              className={`w-full flex items-center gap-2 rounded-lg p-2 text-left transition-colors ${
                selectedVolcano.id === volcano.id
                  ? 'bg-orange-500/20 border border-orange-500/50'
                  : 'hover:bg-slate-700'
              }`}
            >
              <MapPin className={`h-4 w-4 ${volcano.isIndian ? 'text-amber-400' : 'text-slate-400'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{volcano.name}</p>
                <p className="text-xs text-slate-500">{volcano.location}</p>
              </div>
              {volcano.isIndian && <span className="text-xs">🇮🇳</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Volcano Info */}
      <div className="absolute bottom-4 right-4 max-w-xs rounded-xl bg-slate-800/90 p-4 backdrop-blur border border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <h3 className="font-bold text-white">{selectedVolcano.name}</h3>
        </div>
        <p className="text-sm text-slate-300">{selectedVolcano.info}</p>
        {selectedVolcano.lastEruption && (
          <p className="text-xs text-slate-500 mt-2">Last eruption: {selectedVolcano.lastEruption}</p>
        )}
        {selectedVolcano.isIndian && (
          <div className="mt-2 rounded-lg bg-amber-500/10 p-2">
            <p className="text-xs text-amber-300">🇮🇳 Located in India</p>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        <button
          onClick={triggerEruption}
          disabled={volcanoState === 'erupting'}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-colors ${
            volcanoState === 'erupting'
              ? 'bg-red-500/50 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600'
          }`}
        >
          <Flame className="h-5 w-5" />
          {volcanoState === 'erupting' ? 'Erupting!' : 'Trigger Eruption'}
        </button>
        <button
          onClick={reset}
          className="rounded-xl bg-slate-700 px-4 py-2 text-slate-300 hover:bg-slate-600"
        >
          Reset
        </button>
        <button
          onClick={() => setShowCrossSection(!showCrossSection)}
          className={`rounded-xl px-4 py-2 ${
            showCrossSection ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-300'
          }`}
        >
          Cross Section
        </button>
      </div>
    </div>
  );
}
