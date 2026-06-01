import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Mountain, Flame, Activity } from 'lucide-react';
import { CanvasProps } from '../../types';

interface Plate {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  info: string;
}

const initialPlates: Plate[] = [
  { id: 'eurasian', name: 'Eurasian Plate', color: '#3B82F6', x: 50, y: 20, width: 45, height: 30, info: 'Covers Europe and Asia' },
  { id: 'indian', name: 'Indian Plate', color: '#F59E0B', x: 55, y: 55, width: 20, height: 25, info: 'Moving north at 5cm per year!' },
  { id: 'pacific', name: 'Pacific Plate', color: '#8B5CF6', x: 80, y: 40, width: 35, height: 40, info: 'Largest tectonic plate on Earth' },
  { id: 'african', name: 'African Plate', color: '#10B981', x: 30, y: 50, width: 25, height: 35, info: 'Moving north-east slowly' },
  { id: 'american', name: 'American Plate', color: '#EF4444', x: 5, y: 30, width: 25, height: 50, info: 'North and South Americas' },
];

type EventType = 'earthquake' | 'volcano' | 'mountain';

interface GeoEvent {
  type: EventType;
  x: number;
  y: number;
  id: string;
}

export function TectonicPlatesCanvas({ isPlaying }: CanvasProps) {
  const [plates, setPlates] = useState(initialPlates);
  const [selectedPlate, setSelectedPlate] = useState<Plate | null>(null);
  const [events, setEvents] = useState<GeoEvent[]>([]);
  const [showHimalaya, setShowHimalaya] = useState(false);
  const [himalayaProgress, setHimalayaProgress] = useState(0);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Animate Indian plate collision
  useEffect(() => {
    if (!showHimalaya) {
      setHimalayaProgress(0);
      return;
    }

    if (himalayaProgress >= 100) return;

    const interval = setInterval(() => {
      setHimalayaProgress((prev) => Math.min(100, prev + 2));
    }, 100);

    return () => clearInterval(interval);
  }, [showHimalaya, himalayaProgress]);

  // Plate drift animation
  useEffect(() => {
    if (!isPlaying || showHimalaya) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const animate = (time: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      setPlates((prev) =>
        prev.map((plate) => {
          if (plate.id === 'indian') {
            // Indian plate moves north
            return { ...plate, y: Math.max(35, plate.y - delta * 2) };
          }
          return plate;
        })
      );

      // Check for collisions and create events
      setPlates((prev) => {
        const indian = prev.find((p) => p.id === 'indian');
        const eurasian = prev.find((p) => p.id === 'eurasian');
        if (indian && eurasian && indian.y <= eurasian.y + eurasian.height + 5) {
          // Collision detected!
          const eventId = Date.now().toString();
          setEvents((e) => [
            ...e.slice(-5),
            { type: 'mountain', x: indian.x + indian.width / 2, y: indian.y, id: eventId },
          ]);
        }
        return prev;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      lastTimeRef.current = 0;
    };
  }, [isPlaying, showHimalaya]);

  const triggerEvent = (type: EventType) => {
    // Create event at a random plate boundary
    const x = 30 + Math.random() * 40;
    const y = 40 + Math.random() * 20;
    setEvents((prev) => [...prev.slice(-10), { type, x, y, id: Date.now().toString() }]);
  };

  const resetPlates = () => {
    setPlates(initialPlates);
    setEvents([]);
    setShowHimalaya(false);
    setHimalayaProgress(0);
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950">
      {/* World Map Background */}
      <div className="absolute inset-0 opacity-20">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <rect fill="#1e3a5f" width="100" height="100" />
          {/* Simplified continent outlines */}
          <ellipse cx="50" cy="50" rx="45" ry="35" fill="none" stroke="#4ade80" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Tectonic Plates */}
      {plates.map((plate) => (
        <motion.div
          key={plate.id}
          className="absolute cursor-pointer rounded-lg border-2 transition-all"
          style={{
            left: `${plate.x}%`,
            top: `${plate.y}%`,
            width: `${plate.width}%`,
            height: `${plate.height}%`,
            backgroundColor: `${plate.color}30`,
            borderColor: plate.color,
          }}
          animate={{
            y: showHimalaya && plate.id === 'indian' ? -himalayaProgress * 0.8 : 0,
          }}
          whileHover={{ scale: 1.02, zIndex: 10 }}
          onClick={() => setSelectedPlate(plate)}
        >
          <div className="p-2">
            <p
              className="text-xs font-medium truncate"
              style={{ color: plate.color }}
            >
              {plate.name}
            </p>
          </div>

          {/* Movement Arrow for Indian Plate */}
          {plate.id === 'indian' && (
            <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-amber-400"
              >
                ↑
              </motion.div>
            </div>
          )}
        </motion.div>
      ))}

      {/* Geological Events */}
      <AnimatePresence>
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${event.x}%`, top: `${event.y}%` }}
          >
            {event.type === 'earthquake' && (
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 2, 1], opacity: [1, 0.5, 0] }}
                  transition={{ duration: 1, repeat: 2 }}
                  className="absolute inset-0 rounded-full bg-red-500/50"
                  style={{ width: 40, height: 40, marginLeft: -20, marginTop: -20 }}
                />
                <Activity className="h-6 w-6 text-red-500" />
              </div>
            )}
            {event.type === 'volcano' && (
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                <Flame className="h-8 w-8 text-orange-500" />
              </motion.div>
            )}
            {event.type === 'mountain' && (
              <Mountain className="h-6 w-6 text-emerald-400" />
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Himalaya Formation Animation */}
      {showHimalaya && (
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl bg-slate-800/90 p-4 backdrop-blur border border-amber-500/30"
          >
            <p className="text-lg font-bold text-white">🏔️ Himalaya Formation</p>
            <p className="text-sm text-slate-300">50 million years ago...</p>
            <div className="mt-3 h-2 w-48 rounded-full bg-slate-700 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                style={{ width: `${himalayaProgress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-amber-400">
              {himalayaProgress < 50
                ? 'Indian plate approaching...'
                : himalayaProgress < 100
                ? 'Collision! Mountains rising!'
                : 'Mount Everest formed! 🏆'}
            </p>
          </motion.div>
        </div>
      )}

      {/* Control Panel */}
      <div className="absolute left-4 top-4 space-y-2">
        <div className="flex gap-2">
          <button
            onClick={() => triggerEvent('earthquake')}
            className="flex items-center gap-2 rounded-lg bg-red-500/20 px-3 py-2 text-red-400 hover:bg-red-500/30 transition-colors"
          >
            <Activity className="h-4 w-4" />
            <span className="text-sm">Earthquake</span>
          </button>
          <button
            onClick={() => triggerEvent('volcano')}
            className="flex items-center gap-2 rounded-lg bg-orange-500/20 px-3 py-2 text-orange-400 hover:bg-orange-500/30 transition-colors"
          >
            <Flame className="h-4 w-4" />
            <span className="text-sm">Volcano</span>
          </button>
        </div>
        <button
          onClick={resetPlates}
          className="flex items-center gap-2 rounded-lg bg-slate-700 px-3 py-2 text-slate-300 hover:bg-slate-600 transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="text-sm">Reset</span>
        </button>
      </div>

      {/* Himalaya Button */}
      <button
        onClick={() => setShowHimalaya(!showHimalaya)}
        className={`absolute right-4 top-4 flex items-center gap-2 rounded-xl px-4 py-2 transition-colors ${
          showHimalaya
            ? 'bg-amber-500 text-white'
            : 'bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30'
        }`}
      >
        <span>🇮🇳</span>
        <span className="text-sm">Himalaya Formation</span>
      </button>

      {/* Plate Info Panel */}
      <AnimatePresence>
        {selectedPlate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 rounded-xl bg-slate-800/95 p-4 backdrop-blur border border-slate-700"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded"
                    style={{ backgroundColor: selectedPlate.color }}
                  />
                  <h3 className="font-bold text-white">{selectedPlate.name}</h3>
                </div>
                <p className="mt-1 text-sm text-slate-300">{selectedPlate.info}</p>
                {selectedPlate.id === 'indian' && (
                  <p className="mt-2 text-xs text-amber-400">
                    🇮🇳 The Indian plate separated from Africa 130 million years ago and has been
                    moving north ever since, creating the Himalayas!
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedPlate(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 rounded-xl bg-slate-800/80 p-3 backdrop-blur text-xs">
        <p className="font-medium text-slate-300 mb-2">Boundary Types:</p>
        <div className="space-y-1 text-slate-400">
          <p>🏔️ Convergent = Mountains</p>
          <p>🌋 Divergent = Volcanoes</p>
          <p>📍 Transform = Earthquakes</p>
        </div>
      </div>
    </div>
  );
}
