import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun } from 'lucide-react';
import { CanvasProps } from '../../types';

interface WaterDroplet {
  id: string;
  x: number;
  y: number;
  stage: 'ocean' | 'evaporating' | 'cloud' | 'rain' | 'river' | 'underground';
}

export function WaterCycleCanvas({ isPlaying }: CanvasProps) {
  const [sunIntensity, setSunIntensity] = useState(50);
  const [droplets, setDroplets] = useState<WaterDroplet[]>([]);
  const [showMonsoon, setShowMonsoon] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const dropletIdRef = useRef(0);

  // Generate droplets based on sun intensity
  useEffect(() => {
    if (!isPlaying) return;

    const generateDroplet = () => {
      const newDroplet: WaterDroplet = {
        id: `drop-${dropletIdRef.current++}`,
        x: 10 + Math.random() * 30,
        y: 85,
        stage: 'ocean',
      };
      setDroplets((prev) => [...prev.slice(-30), newDroplet]);
    };

    const interval = setInterval(generateDroplet, Math.max(200, 2000 - sunIntensity * 15));
    return () => clearInterval(interval);
  }, [isPlaying, sunIntensity]);

  // Animate droplets through the cycle
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = (time: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      setDroplets((prev) =>
        prev
          .map((drop) => {
            const speed = delta * (sunIntensity / 30);
            switch (drop.stage) {
              case 'ocean':
                if (drop.y > 82) return { ...drop, stage: 'evaporating' as const };
                return drop;
              case 'evaporating':
                if (drop.y < 25) return { ...drop, stage: 'cloud' as const, x: 40 + Math.random() * 30 };
                return { ...drop, y: drop.y - speed * 30, x: drop.x + (Math.random() - 0.5) * 2 };
              case 'cloud':
                if (Math.random() < 0.01 * (sunIntensity / 50)) {
                  return { ...drop, stage: 'rain' as const };
                }
                return { ...drop, x: drop.x + speed * 5 };
              case 'rain':
                if (drop.y > 75) {
                  return Math.random() > 0.5
                    ? { ...drop, stage: 'river' as const }
                    : { ...drop, stage: 'underground' as const };
                }
                return { ...drop, y: drop.y + speed * 50 };
              case 'river':
                if (drop.x < 15) return { ...drop, stage: 'ocean' as const, y: 85 };
                return { ...drop, x: drop.x - speed * 15, y: Math.min(85, drop.y + speed * 5) };
              case 'underground':
                if (drop.x < 20) return { ...drop, stage: 'ocean' as const, y: 85, x: 20 };
                return { ...drop, x: drop.x - speed * 8 };
              default:
                return drop;
            }
          })
          .filter((drop) => drop.x > 0 && drop.x < 100)
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      lastTimeRef.current = 0;
    };
  }, [isPlaying, sunIntensity]);

  const setMonsoonMode = () => {
    setSunIntensity(80);
    setShowMonsoon(true);
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      {/* Sky Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, 
            ${sunIntensity > 70 ? '#0ea5e9' : sunIntensity > 30 ? '#38bdf8' : '#64748b'} 0%, 
            ${sunIntensity > 70 ? '#7dd3fc' : sunIntensity > 30 ? '#bae6fd' : '#94a3b8'} 50%,
            #22c55e 70%,
            #166534 100%)`,
        }}
      />

      {/* Sun */}
      <motion.div
        className="absolute right-8 top-8"
        animate={{
          scale: [1, 1.1, 1],
          opacity: sunIntensity / 100,
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div
          className="rounded-full"
          style={{
            width: 60 + sunIntensity * 0.3,
            height: 60 + sunIntensity * 0.3,
            background: 'radial-gradient(circle, #FFF700 0%, #FFD700 50%, #FF8C00 100%)',
            boxShadow: `0 0 ${40 + sunIntensity}px ${20 + sunIntensity / 2}px rgba(255, 200, 0, ${sunIntensity / 200})`,
          }}
        />
      </motion.div>

      {/* Mountains */}
      <div className="absolute bottom-[30%] left-[40%] w-0 h-0 border-l-[80px] border-r-[80px] border-b-[100px] border-l-transparent border-r-transparent border-b-emerald-700" />
      <div className="absolute bottom-[30%] left-[55%] w-0 h-0 border-l-[60px] border-r-[60px] border-b-[80px] border-l-transparent border-r-transparent border-b-emerald-600" />

      {/* Clouds */}
      <motion.div
        className="absolute top-[15%] left-[35%]"
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        <div className="relative">
          <div className="absolute h-12 w-20 rounded-full bg-white/90" />
          <div className="absolute -left-4 top-4 h-10 w-16 rounded-full bg-white/80" />
          <div className="absolute left-8 top-2 h-14 w-24 rounded-full bg-white/85" />
          {sunIntensity > 60 && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-2xl">💧</div>
          )}
        </div>
      </motion.div>

      <motion.div
        className="absolute top-[20%] left-[55%]"
        animate={{ x: [0, 15, 0] }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
      >
        <div className="relative">
          <div className="absolute h-10 w-16 rounded-full bg-white/80" />
          <div className="absolute -left-3 top-3 h-8 w-12 rounded-full bg-white/70" />
          <div className="absolute left-6 top-1 h-12 w-20 rounded-full bg-white/75" />
        </div>
      </motion.div>

      {/* Ocean */}
      <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-blue-900 via-blue-700 to-blue-500">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 10\'%3E%3Cpath fill=\'%23fff\' d=\'M0 5 Q 12.5 0, 25 5 T 50 5 T 75 5 T 100 5 V 10 H 0 Z\'/%3E%3C/svg%3E")',
            backgroundSize: '100px 10px',
          }}
        />
      </div>

      {/* River */}
      <div className="absolute bottom-[15%] left-[5%] h-2 w-[40%] rounded-full bg-blue-400/80" />
      <div className="absolute bottom-[18%] left-[35%] h-3 w-[15%] -rotate-45 rounded-full bg-blue-400/60" />

      {/* Underground Aquifer */}
      <div className="absolute bottom-[2%] left-[20%] h-3 w-[50%] rounded-full bg-blue-900/50 border border-blue-700/30" />

      {/* Water Droplets */}
      {droplets.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute"
          style={{
            left: `${drop.x}%`,
            top: `${drop.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          {drop.stage === 'evaporating' && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="h-2 w-2 rounded-full bg-sky-300/70"
            />
          )}
          {drop.stage === 'rain' && (
            <div className="h-4 w-1 rounded-full bg-sky-400" />
          )}
          {drop.stage === 'river' && (
            <div className="h-2 w-2 rounded-full bg-blue-400" />
          )}
        </motion.div>
      ))}

      {/* Labels */}
      <div className="absolute bottom-[25%] left-[5%] rounded bg-black/30 px-2 py-1 text-xs text-white backdrop-blur-sm">
        Ocean 🌊
      </div>
      <div className="absolute top-[12%] left-[45%] rounded bg-black/30 px-2 py-1 text-xs text-white backdrop-blur-sm">
        Cloud ☁️
      </div>
      <div className="absolute bottom-[20%] left-[15%] rounded bg-black/30 px-2 py-1 text-xs text-white backdrop-blur-sm">
        River 🏞️
      </div>
      <div className="absolute bottom-[5%] left-[40%] rounded bg-black/30 px-2 py-1 text-xs text-white backdrop-blur-sm">
        Groundwater 💧
      </div>

      {/* Sun Intensity Control */}
      <div className="absolute left-4 top-4 rounded-xl bg-slate-800/80 p-4 backdrop-blur">
        <div className="flex items-center gap-2 mb-2">
          <Sun className="h-5 w-5 text-amber-400" />
          <span className="text-sm text-white">Sun Intensity</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          value={sunIntensity}
          onChange={(e) => {
            setSunIntensity(parseInt(e.target.value));
            setShowMonsoon(false);
          }}
          className="w-32 accent-amber-500"
        />
        <p className="mt-2 text-xs text-slate-400">
          {sunIntensity < 30 ? '☁️ Drought' : sunIntensity > 70 ? '🌧️ Heavy Rain' : '⛅ Normal'}
        </p>
      </div>

      {/* Cycle Stage Info */}
      <div className="absolute right-4 bottom-[25%] space-y-2">
        <div className="flex items-center gap-2 rounded bg-slate-800/80 px-3 py-2 backdrop-blur">
          <div className="h-3 w-3 rounded-full bg-sky-300" />
          <span className="text-xs text-white">Evaporation</span>
        </div>
        <div className="flex items-center gap-2 rounded bg-slate-800/80 px-3 py-2 backdrop-blur">
          <div className="h-3 w-3 rounded-full bg-white" />
          <span className="text-xs text-white">Condensation</span>
        </div>
        <div className="flex items-center gap-2 rounded bg-slate-800/80 px-3 py-2 backdrop-blur">
          <div className="h-3 w-3 rounded-full bg-sky-400" />
          <span className="text-xs text-white">Precipitation</span>
        </div>
        <div className="flex items-center gap-2 rounded bg-slate-800/80 px-3 py-2 backdrop-blur">
          <div className="h-3 w-3 rounded-full bg-blue-400" />
          <span className="text-xs text-white">Collection</span>
        </div>
      </div>

      {/* Monsoon Button */}
      <button
        onClick={setMonsoonMode}
        className={`absolute right-4 top-4 flex items-center gap-2 rounded-xl px-4 py-2 transition-colors ${
          showMonsoon
            ? 'bg-amber-500 text-white'
            : 'bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30'
        }`}
      >
        <span>🇮🇳</span>
        <span className="text-sm">Monsoon</span>
      </button>

      {/* Monsoon Info */}
      <AnimatePresence>
        {showMonsoon && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute right-4 top-16 max-w-xs rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 backdrop-blur"
          >
            <h3 className="font-medium text-amber-300">🌧️ Indian Monsoon Cycle</h3>
            <p className="mt-2 text-sm text-amber-200/70">
              The Indian monsoon is one of the world's most dramatic water cycles! 
              Warm air rises over the Bay of Bengal, pulling in moisture-laden winds 
              that bring 70% of India's annual rainfall between June-September.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-amber-400">
              <span>🏞️</span>
              <span>The Ganga carries monsoon waters across 2,525 km</span>
            </div>
            <button
              onClick={() => setShowMonsoon(false)}
              className="mt-3 text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
