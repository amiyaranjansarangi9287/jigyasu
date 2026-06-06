import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { CanvasProps } from '../../types';

type ExperimentType = 'reflection' | 'refraction' | 'rainbow' | 'lens';

export function LightOpticsCanvas({ isPlaying }: CanvasProps) {
  const [experiment, setExperiment] = useState<ExperimentType>('reflection');
  const [lightAngle, setLightAngle] = useState(45);
  const [mirrorAngle, setMirrorAngle] = useState(0);
  const [waterLevel, setWaterLevel] = useState(50);
  const [lensType, setLensType] = useState<'convex' | 'concave'>('convex');
  const [showRainbow, setShowRainbow] = useState(false);

  // Calculate reflection angle
  const reflectionAngle = 180 - lightAngle + 2 * mirrorAngle;

  // Calculate refraction (Snell's law simplified)
  const refractionAngle = Math.asin(Math.sin((lightAngle * Math.PI) / 180) / 1.33) * (180 / Math.PI);

  const rainbowColors = [
    { color: '#EF4444', name: 'Red', wavelength: '700 nm' },
    { color: '#F97316', name: 'Orange', wavelength: '620 nm' },
    { color: '#EAB308', name: 'Yellow', wavelength: '580 nm' },
    { color: '#22C55E', name: 'Green', wavelength: '530 nm' },
    { color: '#3B82F6', name: 'Blue', wavelength: '470 nm' },
    { color: '#6366F1', name: 'Indigo', wavelength: '445 nm' },
    { color: '#8B5CF6', name: 'Violet', wavelength: '400 nm' },
  ];

  useEffect(() => {
    if (experiment === 'rainbow' && isPlaying) {
      const timer = setTimeout(() => setShowRainbow(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setShowRainbow(false);
    }
  }, [experiment, isPlaying]);

  const renderExperiment = () => {
    switch (experiment) {
      case 'reflection':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Mirror */}
            <div
              className="absolute w-40 h-2 bg-gradient-to-r from-slate-300 via-white to-slate-300 rounded-full shadow-lg"
              style={{
                transform: `rotate(${mirrorAngle}deg)`,
                boxShadow: '0 0 20px rgba(255,255,255,0.5)',
              }}
            />

            {/* Incident Ray */}
            <motion.div
              className="absolute h-1 bg-gradient-to-r from-yellow-300 to-yellow-500 origin-right"
              style={{
                width: 150,
                right: '50%',
                transform: `rotate(${lightAngle}deg)`,
              }}
              animate={isPlaying ? { opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            />

            {/* Reflected Ray */}
            <motion.div
              className="absolute h-1 bg-gradient-to-l from-yellow-300 to-yellow-500 origin-left"
              style={{
                width: 150,
                left: '50%',
                transform: `rotate(${-reflectionAngle}deg)`,
              }}
              animate={isPlaying ? { opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
            />

            {/* Angle Labels */}
            <div className="absolute -top-20 text-center">
              <p className="text-sm text-slate-300">Incident Angle: {lightAngle}°</p>
              <p className="text-sm text-amber-400">Reflected Angle: {(180 - reflectionAngle).toFixed(1)}°</p>
            </div>

            {/* Law */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-xl bg-slate-800/80 p-3">
              <p className="text-xs text-slate-400 text-center">
                📐 Law: Angle of Incidence = Angle of Reflection
              </p>
            </div>
          </div>
        );

      case 'refraction':
        return (
          <div className="absolute inset-0">
            {/* Air */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-sky-900/50 to-sky-800/30" />
            
            {/* Water */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-blue-500/40 to-blue-700/60"
              style={{ height: `${waterLevel}%` }}
              animate={isPlaying ? { opacity: [0.5, 0.7, 0.5] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Water waves */}
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </motion.div>

            {/* Water surface line */}
            <div
              className="absolute left-0 right-0 h-0.5 bg-white/30"
              style={{ top: `${100 - waterLevel}%` }}
            />

            {/* Incident Ray (in air) */}
            <motion.div
              className="absolute h-1 bg-gradient-to-r from-yellow-300 to-yellow-500 origin-bottom-right"
              style={{
                width: 120,
                right: '50%',
                bottom: `${waterLevel}%`,
                transform: `rotate(${lightAngle}deg)`,
              }}
              animate={isPlaying ? { opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 0.5, repeat: Infinity }}
            />

            {/* Refracted Ray (in water) */}
            <motion.div
              className="absolute h-1 bg-gradient-to-l from-yellow-200 to-yellow-400 origin-top-left"
              style={{
                width: 120,
                left: '50%',
                top: `${100 - waterLevel}%`,
                transform: `rotate(${refractionAngle}deg)`,
              }}
              animate={isPlaying ? { opacity: [0.6, 0.9, 0.6] } : {}}
              transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
            />

            {/* Labels */}
            <div className="absolute top-4 left-4 text-sm text-white">
              <p>Air (n = 1.0)</p>
            </div>
            <div className="absolute bottom-4 left-4 text-sm text-sky-300">
              <p>Water (n = 1.33)</p>
            </div>

            {/* Angle Display */}
            <div className="absolute top-4 right-4 rounded-xl bg-slate-800/80 p-3">
              <p className="text-xs text-slate-400">Incident: {lightAngle}°</p>
              <p className="text-xs text-sky-400">Refracted: {refractionAngle.toFixed(1)}°</p>
            </div>

            {/* Explanation */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl bg-amber-500/20 border border-amber-500/30 p-3">
              <p className="text-xs text-amber-300 text-center">
                🇮🇳 This is why a stick looks bent in water - discovered by Indian mathematician Aryabhata!
              </p>
            </div>
          </div>
        );

      case 'rainbow':
        return (
          <div className="absolute inset-0">
            {/* Rain/Mist */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900">
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-6 w-0.5 bg-sky-400/30 rounded-full"
                  initial={{ y: -20, x: `${Math.random() * 100}%` }}
                  animate={isPlaying ? { y: '120%' } : {}}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* Sun */}
            <motion.div
              className="absolute left-8 top-1/3"
              animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div
                className="min-h-16 w-16 rounded-full"
                style={{
                  background: 'radial-gradient(circle, #FFF700 0%, #FFD700 50%, #FF8C00 100%)',
                  boxShadow: '0 0 60px 20px rgba(255, 200, 0, 0.4)',
                }}
              />
            </motion.div>

            {/* White light ray */}
            <motion.div
              className="absolute h-1 bg-gradient-to-r from-yellow-300 to-white origin-left"
              style={{ width: 200, left: 90, top: '33%', transform: 'rotate(20deg)' }}
              animate={isPlaying ? { opacity: [0.5, 1, 0.5] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />

            {/* Rainbow */}
            <AnimatePresence>
              {showRainbow && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-8 top-1/4"
                >
                  <div className="relative">
                    {rainbowColors.map((c, idx) => (
                      <div
                        key={c.name}
                        className="absolute rounded-full border-4"
                        style={{
                          width: 200 - idx * 20,
                          height: 100 - idx * 10,
                          borderColor: c.color,
                          borderBottomColor: 'transparent',
                          left: idx * 10,
                          top: idx * 5,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* VIBGYOR Label */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl bg-slate-800/80 p-4">
              <p className="text-sm text-white text-center mb-2">VIBGYOR - Colors of Rainbow</p>
              <div className="flex gap-1">
                {rainbowColors.slice().reverse().map((c) => (
                  <div
                    key={c.name}
                    className="w-8 h-8 rounded flex items-center justify-center text-xs text-white font-bold"
                    style={{ backgroundColor: c.color }}
                    title={`${c.name}: ${c.wavelength}`}
                  >
                    {c.name[0]}
                  </div>
                ))}
              </div>
              <p className="text-xs text-amber-400 text-center mt-2">
                🇮🇳 Violet, Indigo, Blue, Green, Yellow, Orange, Red
              </p>
            </div>
          </div>
        );

      case 'lens':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Lens */}
            <div className="relative">
              <div
                className={`w-4 min-h-32 rounded-full border-2 border-sky-400/50 ${
                  lensType === 'convex'
                    ? 'bg-sky-400/20'
                    : 'bg-transparent'
                }`}
                style={{
                  borderRadius: lensType === 'convex' ? '50%' : '0',
                  transform: lensType === 'concave' ? 'scaleX(0.3)' : '',
                }}
              />
            </div>

            {/* Parallel light rays */}
            {[-40, -20, 0, 20, 40].map((offset, idx) => (
              <motion.div
                key={idx}
                className="absolute h-0.5 bg-gradient-to-r from-yellow-300 to-yellow-500"
                style={{
                  width: 100,
                  right: '55%',
                  top: `calc(50% + ${offset}px)`,
                }}
                animate={isPlaying ? { opacity: [0.5, 1, 0.5] } : {}}
                transition={{ duration: 0.5, repeat: Infinity, delay: idx * 0.1 }}
              />
            ))}

            {/* Converging/Diverging rays */}
            {[-40, -20, 0, 20, 40].map((offset, idx) => {
              const angle = lensType === 'convex'
                ? offset * 0.5
                : -offset * 0.3;
              return (
                <motion.div
                  key={`out-${idx}`}
                  className="absolute h-0.5 bg-gradient-to-r from-yellow-500 to-yellow-300 origin-left"
                  style={{
                    width: 100,
                    left: '52%',
                    top: `calc(50% + ${offset}px)`,
                    transform: `rotate(${angle}deg)`,
                  }}
                  animate={isPlaying ? { opacity: [0.5, 1, 0.5] } : {}}
                  transition={{ duration: 0.5, repeat: Infinity, delay: idx * 0.1 + 0.3 }}
                />
              );
            })}

            {/* Focal point indicator */}
            {lensType === 'convex' && (
              <motion.div
                className="absolute w-3 h-3 rounded-full bg-red-500"
                style={{ left: '70%', top: '50%', transform: 'translate(-50%, -50%)' }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}

            {/* Lens Type Toggle */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
              <button
                onClick={() => setLensType('convex')}
                className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                  lensType === 'convex'
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                Convex (Converging)
              </button>
              <button
                onClick={() => setLensType('concave')}
                className={`rounded-lg px-4 py-2 text-sm transition-colors ${
                  lensType === 'concave'
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                Concave (Diverging)
              </button>
            </div>

            {/* Info */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl bg-slate-800/80 p-3 text-center">
              <p className="text-sm text-white">
                {lensType === 'convex'
                  ? '🔍 Convex lens focuses light to a point (magnifying glass)'
                  : '👓 Concave lens spreads light out (used in glasses for nearsightedness)'}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      {/* Experiment Selector */}
      <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
        {([
          { id: 'reflection', emoji: '🪞', label: 'Reflection' },
          { id: 'refraction', emoji: '💧', label: 'Refraction' },
          { id: 'rainbow', emoji: '🌈', label: 'Rainbow' },
          { id: 'lens', emoji: '🔍', label: 'Lenses' },
        ] as const).map((exp) => (
          <button
            key={exp.id}
            onClick={() => setExperiment(exp.id)}
            className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm transition-colors ${
              experiment === exp.id
                ? 'bg-sky-500 text-white'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span>{exp.emoji}</span>
            <span>{exp.label}</span>
          </button>
        ))}
      </div>

      {/* Experiment Area */}
      {renderExperiment()}

      {/* Controls */}
      {experiment === 'reflection' && (
        <div className="absolute bottom-4 left-4 space-y-2 rounded-xl bg-slate-800/80 p-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 w-16">Light</span>
            <input
              type="range"
              min="10"
              max="80"
              value={lightAngle}
              onChange={(e) => setLightAngle(parseInt(e.target.value))}
              className="w-24 accent-yellow-500"
            />
            <span className="text-xs text-white">{lightAngle}°</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 w-16">Mirror</span>
            <input
              type="range"
              min="-45"
              max="45"
              value={mirrorAngle}
              onChange={(e) => setMirrorAngle(parseInt(e.target.value))}
              className="w-24 accent-slate-400"
            />
            <span className="text-xs text-white">{mirrorAngle}°</span>
          </div>
        </div>
      )}

      {experiment === 'refraction' && (
        <div className="absolute top-20 left-4 space-y-2 rounded-xl bg-slate-800/80 p-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Angle</span>
            <input
              type="range"
              min="10"
              max="80"
              value={lightAngle}
              onChange={(e) => setLightAngle(parseInt(e.target.value))}
              className="w-20 accent-yellow-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Water</span>
            <input
              type="range"
              min="30"
              max="70"
              value={waterLevel}
              onChange={(e) => setWaterLevel(parseInt(e.target.value))}
              className="w-20 accent-sky-500"
            />
          </div>
        </div>
      )}

      {/* Reset Button */}
      <button
        onClick={() => {
          setLightAngle(45);
          setMirrorAngle(0);
          setWaterLevel(50);
        }}
        className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-2 text-slate-300 hover:bg-slate-600"
      >
        <RotateCcw className="h-4 w-4" />
        <span className="text-sm">Reset</span>
      </button>
    </div>
  );
}
