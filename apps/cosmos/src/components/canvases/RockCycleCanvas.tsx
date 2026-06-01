import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { CanvasProps } from '../../types';

interface Rock {
  id: string;
  type: 'igneous' | 'sedimentary' | 'metamorphic' | 'magma';
  name: string;
  emoji: string;
  color: string;
  description: string;
  indianExample?: string;
}

const rocks: Rock[] = [
  {
    id: 'magma',
    type: 'magma',
    name: 'Magma',
    emoji: '🔥',
    color: '#EF4444',
    description: 'Molten rock deep inside Earth, over 700°C hot!',
  },
  {
    id: 'igneous',
    type: 'igneous',
    name: 'Igneous Rock',
    emoji: '🪨',
    color: '#6B7280',
    description: 'Formed when magma cools and hardens. "Igneous" means "fire" in Latin!',
    indianExample: 'Deccan Traps - massive basalt flows covering 500,000 km² in India',
  },
  {
    id: 'sedimentary',
    type: 'sedimentary',
    name: 'Sedimentary Rock',
    emoji: '🏜️',
    color: '#D97706',
    description: 'Layers of sand, mud, and shells pressed together over millions of years.',
    indianExample: 'Vindhya Range - some of Earth\'s oldest sedimentary rocks (1.7 billion years!)',
  },
  {
    id: 'metamorphic',
    type: 'metamorphic',
    name: 'Metamorphic Rock',
    emoji: '💎',
    color: '#8B5CF6',
    description: 'Rock transformed by extreme heat and pressure deep underground.',
    indianExample: 'Rajasthan marble - used in Taj Mahal and ancient temples',
  },
];

interface CycleTransition {
  from: string;
  to: string;
  process: string;
  description: string;
}

const transitions: CycleTransition[] = [
  { from: 'magma', to: 'igneous', process: 'Cooling', description: 'Magma rises and cools to form solid igneous rock' },
  { from: 'igneous', to: 'sedimentary', process: 'Weathering & Erosion', description: 'Wind and water break rocks into tiny pieces that settle in layers' },
  { from: 'sedimentary', to: 'metamorphic', process: 'Heat & Pressure', description: 'Deep burial subjects rock to extreme conditions' },
  { from: 'metamorphic', to: 'magma', process: 'Melting', description: 'Rock melts back into magma at extreme depths' },
  { from: 'igneous', to: 'metamorphic', process: 'Heat & Pressure', description: 'Igneous rock can transform directly under pressure' },
  { from: 'sedimentary', to: 'magma', process: 'Subduction', description: 'Rock pushed into Earth\'s mantle and melts' },
];

export function RockCycleCanvas(_props: CanvasProps) {
  const [selectedRock, setSelectedRock] = useState<Rock | null>(null);
  const [currentRock, setCurrentRock] = useState<string>('magma');
  const [showTransition, setShowTransition] = useState<CycleTransition | null>(null);
  const [cycleHistory, setCycleHistory] = useState<string[]>(['magma']);

  const transformRock = (toType: string) => {
    const transition = transitions.find(
      (t) => t.from === currentRock && t.to === toType
    );
    if (transition) {
      setShowTransition(transition);
      setTimeout(() => {
        setCurrentRock(toType);
        setCycleHistory((prev) => [...prev, toType]);
        setShowTransition(null);
      }, 1500);
    }
  };

  const getAvailableTransitions = () => {
    return transitions.filter((t) => t.from === currentRock);
  };

  const resetCycle = () => {
    setCurrentRock('magma');
    setCycleHistory(['magma']);
    setSelectedRock(null);
    setShowTransition(null);
  };

  const currentRockData = rocks.find((r) => r.id === currentRock)!;

  // Position rocks in a cycle
  const getRockPosition = (rockId: string) => {
    const positions: Record<string, { x: number; y: number }> = {
      magma: { x: 50, y: 80 },
      igneous: { x: 20, y: 50 },
      sedimentary: { x: 50, y: 20 },
      metamorphic: { x: 80, y: 50 },
    };
    return positions[rockId];
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-b from-amber-950 via-stone-900 to-slate-950">
      {/* Underground Pattern */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"
            style={{
              top: `${5 + i * 5}%`,
              left: 0,
              right: 0,
            }}
          />
        ))}
      </div>

      {/* Rock Cycle Diagram */}
      <div className="absolute inset-8">
        {/* Connection Lines */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
            </marker>
          </defs>
          {/* Main cycle arrows */}
          <path d="M 35 68 Q 15 60 22 48" stroke="#64748b" strokeWidth="1" fill="none" markerEnd="url(#arrowhead)" />
          <path d="M 25 38 Q 30 20 45 22" stroke="#64748b" strokeWidth="1" fill="none" markerEnd="url(#arrowhead)" />
          <path d="M 55 22 Q 70 20 75 38" stroke="#64748b" strokeWidth="1" fill="none" markerEnd="url(#arrowhead)" />
          <path d="M 78 52 Q 85 70 65 78" stroke="#64748b" strokeWidth="1" fill="none" markerEnd="url(#arrowhead)" />
        </svg>

        {/* Rock Nodes */}
        {rocks.map((rock) => {
          const pos = getRockPosition(rock.id);
          const isCurrent = rock.id === currentRock;
          const isAvailable = getAvailableTransitions().some((t) => t.to === rock.id);

          return (
            <motion.div
              key={rock.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              animate={isCurrent ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <button
                onClick={() => {
                  if (isAvailable) {
                    transformRock(rock.id);
                  } else {
                    setSelectedRock(rock);
                  }
                }}
                className={`relative flex flex-col items-center rounded-2xl p-4 transition-all ${
                  isCurrent
                    ? 'bg-white/10 border-2 shadow-lg scale-110'
                    : isAvailable
                    ? 'bg-white/5 border border-dashed hover:bg-white/10 cursor-pointer'
                    : 'bg-white/5 border border-slate-700/50 opacity-60'
                }`}
                style={{
                  borderColor: isCurrent ? rock.color : isAvailable ? rock.color : undefined,
                  boxShadow: isCurrent ? `0 0 30px ${rock.color}40` : undefined,
                }}
              >
                <span className="text-4xl">{rock.emoji}</span>
                <span
                  className="mt-2 text-sm font-medium"
                  style={{ color: rock.color }}
                >
                  {rock.name}
                </span>
                {isAvailable && !isCurrent && (
                  <span className="mt-1 text-xs text-slate-400">Click to transform</span>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Transition Animation */}
      <AnimatePresence>
        {showTransition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="rounded-2xl bg-slate-800 p-6 text-center border border-slate-700"
            >
              <div className="flex items-center justify-center gap-4">
                <span className="text-4xl">{rocks.find((r) => r.id === showTransition.from)?.emoji}</span>
                <motion.div
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <ArrowRight className="h-8 w-8 text-sky-400" />
                </motion.div>
                <span className="text-4xl">{rocks.find((r) => r.id === showTransition.to)?.emoji}</span>
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">{showTransition.process}</h3>
              <p className="mt-2 text-sm text-slate-300">{showTransition.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Rock Info */}
      <div className="absolute left-4 top-4 max-w-xs rounded-xl bg-slate-800/90 p-4 backdrop-blur border border-slate-700">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{currentRockData.emoji}</span>
          <div>
            <h3 className="font-bold text-white">{currentRockData.name}</h3>
            <p className="text-sm text-slate-400">Current Stage</p>
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-300">{currentRockData.description}</p>

        {/* Available Transformations */}
        <div className="mt-3 pt-3 border-t border-slate-700">
          <p className="text-xs text-slate-500 mb-2">Transform to:</p>
          <div className="flex flex-wrap gap-2">
            {getAvailableTransitions().map((t) => {
              const targetRock = rocks.find((r) => r.id === t.to)!;
              return (
                <button
                  key={t.to}
                  onClick={() => transformRock(t.to)}
                  className="flex items-center gap-1 rounded-lg bg-slate-700 px-2 py-1 text-xs hover:bg-slate-600 transition-colors"
                >
                  <span>{targetRock.emoji}</span>
                  <span className="text-slate-300">{t.process}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cycle History */}
      <div className="absolute right-4 top-4 rounded-xl bg-slate-800/80 p-3 backdrop-blur">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">Journey</span>
          <button
            onClick={resetCycle}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {cycleHistory.map((rockId, idx) => {
            const rock = rocks.find((r) => r.id === rockId)!;
            return (
              <div key={idx} className="flex items-center">
                <span className="text-lg">{rock.emoji}</span>
                {idx < cycleHistory.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-slate-600 mx-1" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Indian Context */}
      {currentRockData.indianExample && (
        <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
          <div className="flex items-start gap-2">
            <span>🇮🇳</span>
            <div>
              <p className="text-sm font-medium text-amber-300">Indian Example</p>
              <p className="text-xs text-amber-200/70">{currentRockData.indianExample}</p>
            </div>
          </div>
        </div>
      )}

      {/* Rock Details Modal */}
      <AnimatePresence>
        {selectedRock && selectedRock.id !== currentRock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedRock(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="mx-4 max-w-sm rounded-2xl bg-slate-800 p-6 border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="text-5xl">{selectedRock.emoji}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedRock.name}</h3>
                  <p
                    className="text-sm font-medium"
                    style={{ color: selectedRock.color }}
                  >
                    {selectedRock.type.charAt(0).toUpperCase() + selectedRock.type.slice(1)}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-slate-300">{selectedRock.description}</p>
              {selectedRock.indianExample && (
                <div className="mt-4 rounded-lg bg-amber-500/10 p-3">
                  <p className="text-sm text-amber-300">🇮🇳 {selectedRock.indianExample}</p>
                </div>
              )}
              <button
                onClick={() => setSelectedRock(null)}
                className="mt-4 w-full rounded-lg bg-sky-500 py-2 text-white font-medium hover:bg-sky-600 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
