import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Info } from 'lucide-react';
import { CanvasProps } from '../../types';

type EclipseType = 'solar' | 'lunar';
type EclipsePhase = 'none' | 'partial' | 'total' | 'annular';

export function EclipseCanvas({ isPlaying }: CanvasProps) {
  const [eclipseType, setEclipseType] = useState<EclipseType>('solar');
  const [phase, setPhase] = useState(0); // 0-100
  const [speed, setSpeed] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Animate eclipse
  useEffect(() => {
    if (!isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const animate = (time: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      setPhase((prev) => {
        const next = prev + delta * speed * 10;
        if (next >= 100) return 0;
        return next;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      lastTimeRef.current = 0;
    };
  }, [isPlaying, speed]);

  const getEclipsePhase = (): EclipsePhase => {
    if (phase < 20 || phase > 80) return 'none';
    if (phase < 35 || phase > 65) return 'partial';
    if (phase >= 45 && phase <= 55) return 'total';
    return 'partial';
  };

  const currentPhase = getEclipsePhase();

  // Calculate positions
  const getMoonPosition = () => {
    if (eclipseType === 'solar') {
      // Moon moves across the Sun
      const x = (phase / 100) * 200 - 100;
      return { x, y: 0 };
    } else {
      // Moon moves through Earth's shadow
      const x = (phase / 100) * 200 - 100;
      return { x, y: 0 };
    }
  };

  const moonPos = getMoonPosition();

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-b from-slate-950 via-indigo-950 to-black">
      {/* Stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: currentPhase === 'total' ? 0.8 : 0.3,
            }}
          />
        ))}
      </div>

      {/* Eclipse Type Selector */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex rounded-xl bg-slate-800/80 p-1 backdrop-blur">
        <button
          onClick={() => setEclipseType('solar')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
            eclipseType === 'solar'
              ? 'bg-amber-500 text-white'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <span>☀️</span>
          <span>Solar Eclipse</span>
        </button>
        <button
          onClick={() => setEclipseType('lunar')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
            eclipseType === 'lunar'
              ? 'bg-red-500 text-white'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          <span>🌙</span>
          <span>Lunar Eclipse</span>
        </button>
      </div>

      {/* Eclipse Visualization */}
      <div className="absolute inset-0 flex items-center justify-center">
        {eclipseType === 'solar' ? (
          /* Solar Eclipse */
          <div className="relative">
            {/* Sun */}
            <motion.div
              className="relative rounded-full"
              style={{
                width: 150,
                height: 150,
                background: 'radial-gradient(circle, #FFF700 0%, #FFD700 50%, #FF8C00 100%)',
                boxShadow: currentPhase === 'total'
                  ? '0 0 100px 50px rgba(255, 200, 0, 0.3)'
                  : '0 0 60px 20px rgba(255, 200, 0, 0.5)',
              }}
              animate={{
                scale: currentPhase === 'total' ? 1.1 : 1,
              }}
            >
              {/* Corona (visible during total eclipse) */}
              {currentPhase === 'total' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, transparent 45%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                    transform: 'scale(1.5)',
                  }}
                />
              )}
            </motion.div>

            {/* Moon */}
            <motion.div
              className="absolute top-1/2 left-1/2 rounded-full bg-slate-900"
              style={{
                width: 145,
                height: 145,
                marginLeft: -72.5,
                marginTop: -72.5,
              }}
              animate={{
                x: moonPos.x,
              }}
            />

            {/* Labels */}
            {showLabels && (
              <>
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 text-center">
                  <span className="text-amber-400 text-sm">☀️ Sun</span>
                </div>
                <div 
                  className="absolute top-1/2 -translate-y-1/2 text-center"
                  style={{ left: `calc(50% + ${moonPos.x}px)`, marginLeft: -30 }}
                >
                  <span className="text-slate-400 text-sm">🌑 Moon</span>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Lunar Eclipse */
          <div className="relative flex items-center gap-8">
            {/* Sun (off to the side) */}
            <div className="absolute -left-40 flex flex-col items-center">
              <div
                className="rounded-full"
                style={{
                  width: 60,
                  height: 60,
                  background: 'radial-gradient(circle, #FFF700 0%, #FFD700 50%, #FF8C00 100%)',
                  boxShadow: '0 0 30px 10px rgba(255, 200, 0, 0.4)',
                }}
              />
              {showLabels && <span className="mt-2 text-xs text-amber-400">Sun</span>}
            </div>

            {/* Earth with Shadow */}
            <div className="relative">
              <div
                className="rounded-full"
                style={{
                  width: 100,
                  height: 100,
                  background: 'linear-gradient(135deg, #4169E1 0%, #2563eb 50%, #1e40af 100%)',
                  boxShadow: '0 0 20px 5px rgba(59, 130, 246, 0.3)',
                }}
              />
              {/* Earth's Shadow Cone */}
              <div
                className="absolute top-0 left-full h-full"
                style={{
                  width: 200,
                  background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                  clipPath: 'polygon(0 20%, 100% 40%, 100% 60%, 0 80%)',
                }}
              />
              {showLabels && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-blue-400">
                  Earth
                </span>
              )}
            </div>

            {/* Moon */}
            <motion.div
              className="relative"
              animate={{ x: moonPos.x }}
            >
              <div
                className="rounded-full overflow-hidden"
                style={{
                  width: 50,
                  height: 50,
                  background: currentPhase === 'total'
                    ? 'radial-gradient(circle, #8B0000 0%, #4a0000 50%, #1a0000 100%)'
                    : 'linear-gradient(135deg, #d4d4d4 0%, #a3a3a3 50%, #525252 100%)',
                  boxShadow: currentPhase === 'total'
                    ? '0 0 30px 10px rgba(139, 0, 0, 0.4)'
                    : '0 0 10px 3px rgba(255, 255, 255, 0.2)',
                }}
              />
              {showLabels && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-slate-400 whitespace-nowrap">
                  Moon {currentPhase === 'total' ? '(Blood Moon)' : ''}
                </span>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* Phase Indicator */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`rounded-full px-4 py-2 text-center ${
              currentPhase === 'total'
                ? 'bg-purple-500/30 text-purple-300'
                : currentPhase === 'partial'
                ? 'bg-amber-500/30 text-amber-300'
                : 'bg-slate-700/30 text-slate-400'
            }`}
          >
            {currentPhase === 'total' && '🌑 Total Eclipse!'}
            {currentPhase === 'partial' && '🌗 Partial Eclipse'}
            {currentPhase === 'none' && '⏳ Approaching...'}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 space-y-2">
        <div className="flex gap-2 rounded-xl bg-slate-800/80 p-2 backdrop-blur">
          <button
            onClick={() => setPhase(0)}
            className="rounded-lg bg-slate-700 p-2 text-slate-300 hover:bg-slate-600"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 px-2">
            <span className="text-xs text-slate-400">Speed</span>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.5"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-20 accent-sky-500"
            />
            <span className="text-xs text-white">{speed}x</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-800/80 p-3 backdrop-blur">
          <p className="text-xs text-slate-400 mb-1">Eclipse Progress</p>
          <div className="h-2 w-32 rounded-full bg-slate-700 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-sky-500 to-purple-500"
              animate={{ width: `${phase}%` }}
            />
          </div>
        </div>
      </div>

      {/* Toggle Labels */}
      <button
        onClick={() => setShowLabels(!showLabels)}
        className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl bg-slate-800/80 px-3 py-2 text-slate-300 hover:bg-slate-700"
      >
        <Info className="h-4 w-4" />
        <span className="text-sm">Labels</span>
      </button>

      {/* Indian Context */}
      <div className="absolute top-4 right-4 max-w-xs rounded-xl bg-amber-500/10 border border-amber-500/30 p-3">
        <p className="text-sm font-medium text-amber-300">🇮🇳 Rahu & Ketu</p>
        <p className="text-xs text-amber-200/70 mt-1">
          {eclipseType === 'solar'
            ? 'In Hindu mythology, Rahu (राहु) swallows the Sun during a solar eclipse. The lunar nodes where eclipses occur are called Rahu (north) and Ketu (south).'
            : 'Lunar eclipses happen when the Moon passes through Earth\'s shadow. The red "Blood Moon" color comes from sunlight bent by Earth\'s atmosphere.'}
        </p>
      </div>

      {/* Explanation Panel */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-lg rounded-xl bg-slate-800/60 px-4 py-2 backdrop-blur text-center">
        <p className="text-xs text-slate-300">
          {eclipseType === 'solar'
            ? '☀️ Solar Eclipse: Moon passes between Earth and Sun, blocking sunlight'
            : '🌙 Lunar Eclipse: Earth passes between Sun and Moon, casting shadow on Moon'}
        </p>
      </div>
    </div>
  );
}
