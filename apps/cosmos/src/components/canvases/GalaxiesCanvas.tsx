import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Info, RotateCcw } from 'lucide-react';
import { CanvasProps } from '../../types';

interface CosmicObject {
  id: string;
  name: string;
  type: 'planet' | 'star' | 'solar-system' | 'galaxy' | 'cluster' | 'universe';
  emoji: string;
  scale: number; // log scale - 0 = Earth, 10 = Observable Universe
  size: string;
  description: string;
  indianContext?: string;
}

const cosmicObjects: CosmicObject[] = [
  { id: 'earth', name: 'Earth', type: 'planet', emoji: '🌍', scale: 0, size: '12,742 km', description: 'Our home planet - the only place in the universe known to have life!' },
  { id: 'moon', name: 'Moon', type: 'planet', emoji: '🌙', scale: 0.5, size: '384,400 km from Earth', description: 'Our nearest celestial neighbor, about 1.3 light-seconds away.' },
  { id: 'sun', name: 'Sun', type: 'star', emoji: '☀️', scale: 2, size: '1.4 million km diameter', description: 'Our star - so big that 1.3 million Earths could fit inside!', indianContext: 'Called Surya (सूर्य) in Sanskrit, worshipped since Vedic times' },
  { id: 'solar-system', name: 'Solar System', type: 'solar-system', emoji: '🪐', scale: 4, size: '287 billion km', description: 'Our cosmic neighborhood - 8 planets orbiting the Sun.' },
  { id: 'nearest-star', name: 'Proxima Centauri', type: 'star', emoji: '⭐', scale: 5, size: '4.24 light-years away', description: 'The closest star to our Sun - light takes 4.24 years to reach us!' },
  { id: 'milky-way', name: 'Milky Way Galaxy', type: 'galaxy', emoji: '🌌', scale: 7, size: '100,000 light-years across', description: 'Our home galaxy with 200-400 billion stars!', indianContext: 'Called Akash Ganga (आकाश गंगा) - the celestial river Ganga' },
  { id: 'andromeda', name: 'Andromeda Galaxy', type: 'galaxy', emoji: '🌀', scale: 8, size: '2.5 million light-years away', description: 'Our nearest large galaxy - heading towards us at 110 km/s!' },
  { id: 'local-group', name: 'Local Group', type: 'cluster', emoji: '✨', scale: 8.5, size: '10 million light-years', description: 'A group of 80+ galaxies including Milky Way and Andromeda.' },
  { id: 'virgo-cluster', name: 'Virgo Supercluster', type: 'cluster', emoji: '🌟', scale: 9, size: '110 million light-years', description: 'Contains 100+ galaxy groups including our Local Group.' },
  { id: 'observable-universe', name: 'Observable Universe', type: 'universe', emoji: '🔮', scale: 10, size: '93 billion light-years', description: '2 trillion galaxies! Light from the edge took 13.8 billion years to reach us.' },
];

export function GalaxiesCanvas({ isPlaying }: CanvasProps) {
  const [zoomLevel, setZoomLevel] = useState(0);
  const [autoZoom, setAutoZoom] = useState(false);
  const animationRef = useRef<number | null>(null);

  const currentObject = cosmicObjects.find((obj) => 
    Math.abs(obj.scale - zoomLevel) < 0.5
  ) || cosmicObjects[0];

  // Auto zoom animation
  useEffect(() => {
    if (!autoZoom || !isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    let lastTime = 0;
    const animate = (time: number) => {
      if (lastTime === 0) lastTime = time;
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      setZoomLevel((prev) => {
        const next = prev + delta * 0.5;
        if (next >= 10) {
          setAutoZoom(false);
          return 10;
        }
        return next;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [autoZoom, isPlaying]);

  const getBackgroundStyle = () => {
    if (zoomLevel < 2) return 'from-blue-900 via-indigo-950 to-black';
    if (zoomLevel < 5) return 'from-slate-900 via-purple-950 to-black';
    if (zoomLevel < 8) return 'from-indigo-950 via-black to-purple-950';
    return 'from-black via-purple-950 to-black';
  };

  const getObjectOpacity = (obj: CosmicObject) => {
    const diff = Math.abs(obj.scale - zoomLevel);
    if (diff < 1) return 1;
    if (diff < 2) return 0.5;
    return 0.2;
  };

  return (
    <div className={`relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-b ${getBackgroundStyle()} transition-all duration-1000`}>
      {/* Stars background */}
      <div className="absolute inset-0">
        {Array.from({ length: 150 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={isPlaying ? {
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            } : {}}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Central Display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentObject.id}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <motion.span
              className="text-8xl block"
              animate={isPlaying ? { 
                rotate: currentObject.type === 'galaxy' ? 360 : 0,
                scale: [1, 1.1, 1]
              } : {}}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity }
              }}
            >
              {currentObject.emoji}
            </motion.span>
            <h2 className="mt-4 text-2xl font-bold text-white">{currentObject.name}</h2>
            <p className="text-sky-400">{currentObject.size}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scale Indicator */}
      <div className="absolute left-4 top-4 bottom-4 w-16 flex flex-col justify-between py-4">
        {cosmicObjects.map((obj) => {
          const position = (obj.scale / 10) * 100;
          const isCurrent = obj.id === currentObject.id;
          return (
            <motion.button
              key={obj.id}
              className="absolute left-0 right-0 flex items-center gap-2 transition-all"
              style={{ top: `${position}%` }}
              animate={{ opacity: getObjectOpacity(obj), scale: isCurrent ? 1.1 : 1 }}
              onClick={() => setZoomLevel(obj.scale)}
            >
              <span className={`text-lg ${isCurrent ? 'text-2xl' : ''}`}>{obj.emoji}</span>
              <span className={`text-xs text-white truncate ${isCurrent ? 'font-bold' : 'opacity-60'}`}>
                {obj.name.split(' ')[0]}
              </span>
            </motion.button>
          );
        })}
        
        {/* Current position indicator */}
        <motion.div
          className="absolute left-0 w-1 h-4 bg-sky-500 rounded-full"
          animate={{ top: `${(zoomLevel / 10) * 100}%` }}
          transition={{ type: 'spring', stiffness: 100 }}
        />
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 left-4 space-y-2">
        <div className="flex gap-2 rounded-xl bg-slate-800/80 p-2">
          <button
            onClick={() => setZoomLevel(Math.max(0, zoomLevel - 1))}
            className="rounded-lg bg-slate-700 p-2 text-white hover:bg-slate-600"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <button
            onClick={() => setZoomLevel(Math.min(10, zoomLevel + 1))}
            className="rounded-lg bg-slate-700 p-2 text-white hover:bg-slate-600"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
          <button
            onClick={() => setZoomLevel(0)}
            className="rounded-lg bg-slate-700 p-2 text-white hover:bg-slate-600"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>

        {/* Zoom Slider */}
        <div className="rounded-xl bg-slate-800/80 p-3">
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
            className="w-32 accent-sky-500"
          />
          <p className="text-xs text-slate-400 mt-1">Scale: 10^{zoomLevel.toFixed(1)}</p>
        </div>
      </div>

      {/* Auto Zoom Button */}
      <button
        onClick={() => {
          setZoomLevel(0);
          setAutoZoom(true);
        }}
        className={`absolute bottom-4 right-4 flex items-center gap-2 rounded-xl px-4 py-2 transition-colors ${
          autoZoom
            ? 'bg-sky-500 text-white'
            : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
        }`}
      >
        <span>🚀</span>
        <span className="text-sm">{autoZoom ? 'Zooming...' : 'Cosmic Journey'}</span>
      </button>

      {/* Info Panel */}
      <div className="absolute top-4 right-4 max-w-xs rounded-xl bg-slate-800/90 p-4 backdrop-blur border border-slate-700">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-4 w-4 text-sky-400" />
          <span className="text-sm font-medium text-white">Current View</span>
        </div>
        <p className="text-sm text-slate-300">{currentObject.description}</p>
        {currentObject.indianContext && (
          <div className="mt-2 rounded-lg bg-amber-500/10 p-2">
            <p className="text-xs text-amber-300">🇮🇳 {currentObject.indianContext}</p>
          </div>
        )}
      </div>

      {/* Distance Scale */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl bg-slate-800/80 px-4 py-2">
        <p className="text-xs text-center text-slate-400">
          {zoomLevel < 3 ? '🌍 Human Scale' : 
           zoomLevel < 6 ? '⭐ Stellar Scale' :
           zoomLevel < 9 ? '🌌 Galactic Scale' : '🔮 Cosmic Scale'}
        </p>
      </div>
    </div>
  );
}
