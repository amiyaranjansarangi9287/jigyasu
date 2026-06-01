import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, RotateCcw, Check } from 'lucide-react';
import { CanvasProps } from '../../types';

interface StarData {
  id: string;
  x: number;
  y: number;
  name?: string;
  brightness: number;
  temperature: 'blue' | 'white' | 'yellow' | 'orange' | 'red';
  distance?: string;
  constellation?: string;
}

interface Constellation {
  id: string;
  name: string;
  indianName: string;
  stars: string[];
  connections: [number, number][];
  description: string;
}

const stars: StarData[] = [
  // Orion
  { id: 'betelgeuse', x: 15, y: 25, name: 'Betelgeuse', brightness: 1, temperature: 'red', distance: '548 ly', constellation: 'orion' },
  { id: 'rigel', x: 22, y: 50, name: 'Rigel', brightness: 0.9, temperature: 'blue', distance: '860 ly', constellation: 'orion' },
  { id: 'bellatrix', x: 22, y: 25, name: 'Bellatrix', brightness: 0.7, temperature: 'blue', constellation: 'orion' },
  { id: 'mintaka', x: 17, y: 35, brightness: 0.6, temperature: 'white', constellation: 'orion' },
  { id: 'alnilam', x: 18.5, y: 37, brightness: 0.7, temperature: 'blue', constellation: 'orion' },
  { id: 'alnitak', x: 20, y: 39, brightness: 0.6, temperature: 'blue', constellation: 'orion' },
  { id: 'saiph', x: 14, y: 50, brightness: 0.6, temperature: 'blue', constellation: 'orion' },
  
  // Ursa Major (Big Dipper)
  { id: 'dubhe', x: 55, y: 15, name: 'Dubhe', brightness: 0.8, temperature: 'orange', distance: '123 ly', constellation: 'ursa-major' },
  { id: 'merak', x: 52, y: 20, brightness: 0.7, temperature: 'white', constellation: 'ursa-major' },
  { id: 'phecda', x: 57, y: 25, brightness: 0.6, temperature: 'white', constellation: 'ursa-major' },
  { id: 'megrez', x: 60, y: 22, brightness: 0.5, temperature: 'white', constellation: 'ursa-major' },
  { id: 'alioth', x: 65, y: 20, brightness: 0.7, temperature: 'white', constellation: 'ursa-major' },
  { id: 'mizar', x: 70, y: 18, name: 'Mizar', brightness: 0.8, temperature: 'white', distance: '83 ly', constellation: 'ursa-major' },
  { id: 'alkaid', x: 77, y: 22, brightness: 0.7, temperature: 'blue', constellation: 'ursa-major' },

  // Scorpius
  { id: 'antares', x: 42, y: 70, name: 'Antares', brightness: 1, temperature: 'red', distance: '550 ly', constellation: 'scorpius' },
  { id: 'graffias', x: 38, y: 60, brightness: 0.6, temperature: 'blue', constellation: 'scorpius' },
  { id: 'dschubba', x: 40, y: 62, brightness: 0.6, temperature: 'blue', constellation: 'scorpius' },
  { id: 'acrab', x: 36, y: 58, brightness: 0.5, temperature: 'blue', constellation: 'scorpius' },
  { id: 'shaula', x: 52, y: 85, name: 'Shaula', brightness: 0.7, temperature: 'blue', constellation: 'scorpius' },

  // Cassiopeia
  { id: 'schedar', x: 85, y: 30, name: 'Schedar', brightness: 0.7, temperature: 'orange', constellation: 'cassiopeia' },
  { id: 'caph', x: 90, y: 25, brightness: 0.6, temperature: 'white', constellation: 'cassiopeia' },
  { id: 'gamma-cas', x: 87, y: 35, brightness: 0.6, temperature: 'blue', constellation: 'cassiopeia' },
  { id: 'ruchbah', x: 82, y: 38, brightness: 0.5, temperature: 'white', constellation: 'cassiopeia' },
  { id: 'segin', x: 78, y: 32, brightness: 0.5, temperature: 'blue', constellation: 'cassiopeia' },

  // Random background stars
  ...Array.from({ length: 80 }).map((_, i) => ({
    id: `bg-${i}`,
    x: Math.random() * 100,
    y: Math.random() * 100,
    brightness: Math.random() * 0.3 + 0.1,
    temperature: (['white', 'yellow'] as const)[Math.floor(Math.random() * 2)],
  })),
];

const constellations: Constellation[] = [
  {
    id: 'orion',
    name: 'Orion',
    indianName: 'Mriga (मृग) - The Deer',
    stars: ['betelgeuse', 'rigel', 'bellatrix', 'mintaka', 'alnilam', 'alnitak', 'saiph'],
    connections: [[0, 2], [2, 3], [3, 4], [4, 5], [5, 1], [0, 3], [1, 5], [6, 0], [6, 5]],
    description: 'The Hunter - one of the most recognizable constellations! In Indian astronomy, it represents Mriga, the deer chased by the hunter.',
  },
  {
    id: 'ursa-major',
    name: 'Ursa Major',
    indianName: 'Saptarishi (सप्तर्षि) - Seven Sages',
    stars: ['dubhe', 'merak', 'phecda', 'megrez', 'alioth', 'mizar', 'alkaid'],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
    description: 'The Great Bear contains the Big Dipper. In Indian tradition, these 7 stars represent the Saptarishi - seven great sages!',
  },
  {
    id: 'scorpius',
    name: 'Scorpius',
    indianName: 'Vrischika (वृश्चिक) - Scorpion',
    stars: ['antares', 'graffias', 'dschubba', 'acrab', 'shaula'],
    connections: [[3, 1], [1, 2], [2, 0], [0, 4]],
    description: 'The Scorpion with its bright red heart - Antares. Vrischika is one of the 12 zodiac signs in Indian astrology (Jyotish).',
  },
  {
    id: 'cassiopeia',
    name: 'Cassiopeia',
    indianName: 'Sharmishtha (शर्मिष्ठा)',
    stars: ['schedar', 'caph', 'gamma-cas', 'ruchbah', 'segin'],
    connections: [[0, 2], [2, 1], [2, 3], [3, 4]],
    description: 'The Queen - shaped like a W or M. Visible year-round in the Northern Hemisphere.',
  },
];

export function ConstellationsCanvas({ isPlaying }: CanvasProps) {
  const [selectedStar, setSelectedStar] = useState<StarData | null>(null);
  const [drawnConstellation, setDrawnConstellation] = useState<string | null>(null);
  const [showNakshatras, setShowNakshatras] = useState(false);
  const [dragMode, setDragMode] = useState(false);
  const [connections, setConnections] = useState<[string, string][]>([]);
  const [firstStar, setFirstStar] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const getStarColor = (temp: StarData['temperature']) => {
    const colors = {
      blue: '#60a5fa',
      white: '#f8fafc',
      yellow: '#fde047',
      orange: '#fb923c',
      red: '#f87171',
    };
    return colors[temp];
  };

  const handleStarClick = (star: StarData) => {
    if (dragMode) {
      if (firstStar === null) {
        setFirstStar(star.id);
      } else if (firstStar !== star.id) {
        setConnections((prev) => [...prev, [firstStar, star.id]]);
        setFirstStar(null);
        
        // Check if a constellation is complete
        constellations.forEach((const_) => {
          const constStars = new Set(const_.stars);
          const connectedStars = new Set<string>();
          connections.forEach(([a, b]) => {
            if (constStars.has(a)) connectedStars.add(a);
            if (constStars.has(b)) connectedStars.add(b);
          });
          if (constStars.size <= connectedStars.size + 2) {
            setDrawnConstellation(const_.id);
          }
        });
      }
    } else {
      setSelectedStar(star);
    }
  };

  const showConstellation = (constId: string) => {
    const const_ = constellations.find((c) => c.id === constId);
    if (const_) {
      const newConnections: [string, string][] = const_.connections.map(([a, b]) => [
        const_.stars[a],
        const_.stars[b],
      ]);
      setConnections(newConnections);
      setDrawnConstellation(constId);
    }
  };

  const resetCanvas = () => {
    setConnections([]);
    setDrawnConstellation(null);
    setFirstStar(null);
  };

  return (
    <div
      ref={canvasRef}
      className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-b from-slate-950 via-indigo-950 to-black"
    >
      {/* Milky Way */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(200,200,255,0.1) 50%, transparent 70%)',
        }}
      />

      {/* Connection Lines */}
      <svg className="absolute inset-0 h-full w-full pointer-events-none">
        {connections.map(([startId, endId], idx) => {
          const startStar = stars.find((s) => s.id === startId);
          const endStar = stars.find((s) => s.id === endId);
          if (!startStar || !endStar) return null;
          return (
            <motion.line
              key={`${startId}-${endId}-${idx}`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5 }}
              x1={`${startStar.x}%`}
              y1={`${startStar.y}%`}
              x2={`${endStar.x}%`}
              y2={`${endStar.y}%`}
              stroke="#60a5fa"
              strokeWidth="1"
            />
          );
        })}
        {/* Current selection line */}
        {firstStar && (
          <circle
            cx={`${stars.find((s) => s.id === firstStar)?.x}%`}
            cy={`${stars.find((s) => s.id === firstStar)?.y}%`}
            r="8"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2"
          />
        )}
      </svg>

      {/* Stars */}
      {stars.map((star) => (
        <motion.button
          key={star.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: 4 + star.brightness * 8,
            height: 4 + star.brightness * 8,
            backgroundColor: getStarColor(star.temperature),
            boxShadow: `0 0 ${star.brightness * 15}px ${star.brightness * 5}px ${getStarColor(star.temperature)}50`,
          }}
          animate={isPlaying ? { opacity: [0.7, 1, 0.7] } : {}}
          transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
          whileHover={{ scale: 1.5 }}
          onClick={() => handleStarClick(star)}
        />
      ))}

      {/* Control Panel */}
      <div className="absolute left-4 top-4 space-y-2">
        <button
          onClick={() => setDragMode(!dragMode)}
          className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
            dragMode
              ? 'bg-sky-500 text-white'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Star className="h-4 w-4" />
          <span className="text-sm">{dragMode ? 'Drawing Mode' : 'View Mode'}</span>
        </button>
        <button
          onClick={resetCanvas}
          className="flex items-center gap-2 rounded-lg bg-slate-800/80 px-3 py-2 text-slate-300 hover:bg-slate-700"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="text-sm">Clear</span>
        </button>
      </div>

      {/* Constellation Buttons */}
      <div className="absolute right-4 top-4 space-y-2">
        {constellations.map((const_) => (
          <button
            key={const_.id}
            onClick={() => showConstellation(const_.id)}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
              drawnConstellation === const_.id
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {drawnConstellation === const_.id && <Check className="h-4 w-4" />}
            <span>{const_.name}</span>
          </button>
        ))}
      </div>

      {/* Nakshatra Button */}
      <button
        onClick={() => setShowNakshatras(!showNakshatras)}
        className={`absolute right-4 bottom-4 flex items-center gap-2 rounded-xl px-4 py-2 transition-colors ${
          showNakshatras
            ? 'bg-amber-500 text-white'
            : 'bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30'
        }`}
      >
        <span>🇮🇳</span>
        <span className="text-sm">Nakshatra System</span>
      </button>

      {/* Star Info Panel */}
      <AnimatePresence>
        {selectedStar && selectedStar.name && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 max-w-xs rounded-xl bg-slate-800/95 p-4 backdrop-blur border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="h-6 w-6 rounded-full"
                  style={{
                    backgroundColor: getStarColor(selectedStar.temperature),
                    boxShadow: `0 0 15px 5px ${getStarColor(selectedStar.temperature)}50`,
                  }}
                />
                <div>
                  <h3 className="font-bold text-white">{selectedStar.name}</h3>
                  {selectedStar.distance && (
                    <p className="text-xs text-slate-400">{selectedStar.distance} away</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedStar(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="mt-3 flex gap-4 text-sm">
              <div>
                <p className="text-slate-500">Temperature</p>
                <p className="capitalize text-white">{selectedStar.temperature}</p>
              </div>
              <div>
                <p className="text-slate-500">Brightness</p>
                <p className="text-white">{(selectedStar.brightness * 100).toFixed(0)}%</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Constellation Info Panel */}
      <AnimatePresence>
        {drawnConstellation && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute left-4 top-24 max-w-xs rounded-xl bg-slate-800/95 p-4 backdrop-blur border border-slate-700"
          >
            {(() => {
              const const_ = constellations.find((c) => c.id === drawnConstellation);
              if (!const_) return null;
              return (
                <>
                  <h3 className="text-lg font-bold text-white">{const_.name}</h3>
                  <p className="text-sm text-amber-400">{const_.indianName}</p>
                  <p className="mt-2 text-sm text-slate-300">{const_.description}</p>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nakshatra Info */}
      <AnimatePresence>
        {showNakshatras && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute right-4 bottom-16 max-w-sm rounded-xl bg-amber-500/10 border border-amber-500/20 p-4 backdrop-blur"
          >
            <h3 className="font-medium text-amber-300">⭐ 27 Nakshatras</h3>
            <p className="mt-2 text-sm text-amber-200/70">
              In Vedic astronomy, the sky is divided into 27 lunar mansions called Nakshatras. 
              The Moon visits one Nakshatra each day during its monthly cycle.
            </p>
            <div className="mt-3 grid grid-cols-3 gap-1 text-xs text-amber-300/80">
              {['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra'].map((n) => (
                <span key={n} className="rounded bg-amber-500/10 px-1 py-0.5">{n}</span>
              ))}
            </div>
            <p className="mt-2 text-xs text-amber-400">...and 21 more!</p>
            <button
              onClick={() => setShowNakshatras(false)}
              className="mt-3 text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-slate-800/60 px-4 py-2 backdrop-blur">
        <p className="text-xs text-slate-400 text-center">
          {dragMode
            ? '🌟 Click two stars to connect them'
            : '✨ Click a star to learn about it, or select a constellation'}
        </p>
      </div>
    </div>
  );
}
