import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shovel, Clock, Star, MapPin } from 'lucide-react';
import { CanvasProps } from '../../types';

interface Fossil {
  id: string;
  name: string;
  type: 'dinosaur' | 'plant' | 'marine' | 'mammal';
  era: string;
  age: string;
  emoji: string;
  discovered: boolean;
  x: number;
  y: number;
  depth: number;
  info: string;
  indianContext?: string;
}

const initialFossils: Fossil[] = [
  { id: 'rajasaurus', name: 'Rajasaurus', type: 'dinosaur', era: 'Cretaceous', age: '70 million years', emoji: '🦖', discovered: false, x: 25, y: 50, depth: 1, info: 'A carnivorous dinosaur discovered in Gujarat, India. Name means "King Lizard"!', indianContext: 'Found in Narmada Valley, Gujarat - one of India\'s most important dinosaur sites' },
  { id: 'isisaurus', name: 'Isisaurus', type: 'dinosaur', era: 'Cretaceous', age: '70 million years', emoji: '🦕', discovered: false, x: 60, y: 65, depth: 2, info: 'A long-necked dinosaur from India. Named after ISI (Indian Statistical Institute)!', indianContext: 'Discovered in Maharashtra, India' },
  { id: 'ammonite', name: 'Ammonite', type: 'marine', era: 'Jurassic', age: '200 million years', emoji: '🐚', discovered: false, x: 45, y: 40, depth: 1, info: 'Ancient sea creatures related to octopus. Their spiral shells are commonly found as fossils.', indianContext: 'Called "Shaligram" in India, considered sacred in Hinduism' },
  { id: 'trilobite', name: 'Trilobite', type: 'marine', era: 'Cambrian', age: '500 million years', emoji: '🪲', discovered: false, x: 75, y: 55, depth: 3, info: 'One of the earliest known animals! Had compound eyes like insects.' },
  { id: 'fern', name: 'Ancient Fern', type: 'plant', era: 'Carboniferous', age: '300 million years', emoji: '🌿', discovered: false, x: 15, y: 70, depth: 2, info: 'Giant ferns that lived before dinosaurs. Formed much of today\'s coal deposits!' },
  { id: 'mammoth', name: 'Mammoth', type: 'mammal', era: 'Pleistocene', age: '10,000 years', emoji: '🦣', discovered: false, x: 85, y: 35, depth: 1, info: 'Woolly giants that lived during the Ice Age. Some were found frozen with fur intact!' },
  { id: 'titanosaurus', name: 'Titanosaurus', type: 'dinosaur', era: 'Cretaceous', age: '70 million years', emoji: '🦕', discovered: false, x: 40, y: 80, depth: 3, info: 'First dinosaur discovered in India (1877)! One of the largest land animals ever.', indianContext: 'Found in Jabalpur, Madhya Pradesh - India\'s first dinosaur discovery' },
];

export function FossilsCanvas(_props: CanvasProps) {
  const [fossils, setFossils] = useState(initialFossils);
  const [selectedFossil, setSelectedFossil] = useState<Fossil | null>(null);
  const [diggingAt, setDiggingAt] = useState<{ x: number; y: number } | null>(null);
  const [digProgress, setDigProgress] = useState(0);
  const [showTimeline, setShowTimeline] = useState(false);
  const [discoveries, setDiscoveries] = useState(0);

  const handleDig = (x: number, y: number) => {
    // Check if near a fossil
    const nearbyFossil = fossils.find(
      (f) => !f.discovered && Math.abs(f.x - x) < 15 && Math.abs(f.y - y) < 15
    );

    if (nearbyFossil) {
      setDiggingAt({ x, y });
      
      // Simulate digging
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setDigProgress(progress);
        
        if (progress >= nearbyFossil.depth * 30) {
          clearInterval(interval);
          setFossils((prev) =>
            prev.map((f) =>
              f.id === nearbyFossil.id ? { ...f, discovered: true } : f
            )
          );
          setSelectedFossil(nearbyFossil);
          setDiscoveries((prev) => prev + 1);
          setDiggingAt(null);
          setDigProgress(0);
        }
      }, 100);
    }
  };

  const resetDig = () => {
    setFossils(initialFossils);
    setSelectedFossil(null);
    setDiscoveries(0);
    setDiggingAt(null);
    setDigProgress(0);
  };

  const getEraColor = (era: string) => {
    switch (era) {
      case 'Cretaceous': return 'text-red-400 bg-red-500/20';
      case 'Jurassic': return 'text-green-400 bg-green-500/20';
      case 'Cambrian': return 'text-blue-400 bg-blue-500/20';
      case 'Carboniferous': return 'text-amber-400 bg-amber-500/20';
      case 'Pleistocene': return 'text-cyan-400 bg-cyan-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const eras = [
    { name: 'Cambrian', age: '541-485 Ma', color: '#3b82f6' },
    { name: 'Carboniferous', age: '359-299 Ma', color: '#f59e0b' },
    { name: 'Jurassic', age: '201-145 Ma', color: '#22c55e' },
    { name: 'Cretaceous', age: '145-66 Ma', color: '#ef4444' },
    { name: 'Pleistocene', age: '2.6 Ma-11,700 y', color: '#06b6d4' },
  ];

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      {/* Sky */}
      <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-amber-200 via-amber-100 to-amber-50" />
      
      {/* Ground Layers */}
      <div className="absolute inset-x-0 top-1/4 bottom-0">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900" />
        {/* Rock layers */}
        <div className="absolute inset-x-0 top-[20%] h-[2px] bg-amber-600/50" />
        <div className="absolute inset-x-0 top-[40%] h-[3px] bg-stone-600/50" />
        <div className="absolute inset-x-0 top-[60%] h-[2px] bg-amber-950/50" />
        <div className="absolute inset-x-0 top-[80%] h-[3px] bg-stone-800/50" />
      </div>

      {/* Dig Site Grid */}
      <div 
        className="absolute inset-x-4 top-[25%] bottom-4 grid grid-cols-10 grid-rows-6 gap-1 cursor-crosshair"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          handleDig(x, y);
        }}
      >
        {/* Fossils */}
        {fossils.map((fossil) => (
          <div
            key={fossil.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all"
            style={{ left: `${fossil.x}%`, top: `${fossil.y}%` }}
          >
            {fossil.discovered ? (
              <motion.button
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFossil(fossil);
                }}
                className="text-4xl hover:scale-110 transition-transform drop-shadow-lg"
              >
                {fossil.emoji}
              </motion.button>
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-dashed border-amber-500/30" />
            )}
          </div>
        ))}

        {/* Digging Animation */}
        {diggingAt && (
          <motion.div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${diggingAt.x}%`, top: `${diggingAt.y}%` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <div className="relative">
              <Shovel className="h-8 w-8 text-amber-300 animate-bounce" />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-2 rounded-full bg-slate-700 overflow-hidden">
                <motion.div
                  className="h-full bg-amber-500"
                  animate={{ width: `${digProgress}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* UI Controls */}
      <div className="absolute top-4 left-4 rounded-xl bg-slate-800/90 p-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <Shovel className="h-5 w-5 text-amber-400" />
          <div>
            <p className="text-sm font-medium text-white">Fossil Hunt</p>
            <p className="text-xs text-slate-400">Click to dig!</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Star className="h-4 w-4 text-amber-400" />
          <span className="text-sm text-white">{discoveries}/{fossils.length} found</span>
        </div>
      </div>

      {/* Timeline Toggle */}
      <button
        onClick={() => setShowTimeline(!showTimeline)}
        className={`absolute top-4 right-4 flex items-center gap-2 rounded-xl px-4 py-2 transition-colors ${
          showTimeline
            ? 'bg-purple-500 text-white'
            : 'bg-slate-800/90 text-slate-300 hover:bg-slate-700'
        }`}
      >
        <Clock className="h-4 w-4" />
        <span className="text-sm">Timeline</span>
      </button>

      {/* Geological Timeline */}
      <AnimatePresence>
        {showTimeline && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-16 right-4 w-48 rounded-xl bg-slate-800/95 p-3 backdrop-blur border border-slate-700"
          >
            <h3 className="text-sm font-medium text-white mb-2">Geological Time</h3>
            <div className="space-y-2">
              {eras.map((era) => (
                <div key={era.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: era.color }}
                  />
                  <div className="flex-1">
                    <p className="text-xs text-white">{era.name}</p>
                    <p className="text-xs text-slate-500">{era.age}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">Ma = Million years ago</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Fossil Info */}
      <AnimatePresence>
        {selectedFossil && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-96 max-w-[calc(100%-2rem)] rounded-2xl bg-slate-800/95 p-4 backdrop-blur border border-slate-700"
          >
            <button
              onClick={() => setSelectedFossil(null)}
              className="absolute right-3 top-3 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <div className="flex items-start gap-4">
              <span className="text-5xl">{selectedFossil.emoji}</span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{selectedFossil.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${getEraColor(selectedFossil.era)}`}>
                    {selectedFossil.era}
                  </span>
                  <span className="text-xs text-slate-400">{selectedFossil.age} old</span>
                </div>
                <p className="mt-2 text-sm text-slate-300">{selectedFossil.info}</p>
                {selectedFossil.indianContext && (
                  <div className="mt-2 rounded-lg bg-amber-500/10 p-2">
                    <p className="text-xs text-amber-300 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      🇮🇳 {selectedFossil.indianContext}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset & Help */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        <button
          onClick={resetDig}
          className="rounded-xl bg-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-600"
        >
          Reset Site
        </button>
      </div>

      {/* Indian Discoveries Note */}
      <div className="absolute bottom-4 right-4 max-w-xs rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2">
        <p className="text-xs text-amber-300">
          🇮🇳 India has rich fossil sites! Dinosaurs were first discovered in Jabalpur (1828) 
          and the Narmada Valley is famous for Cretaceous fossils.
        </p>
      </div>
    </div>
  );
}
