import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Info } from 'lucide-react';
import type { CanvasProps } from '../../types';

interface PigmentComponent {
  color: string;
  name: string;
  speed: number; // Rf value: 0-1
  width: number;
}

interface Ink {
  id: string;
  name: string;
  displayColor: string;
  components: PigmentComponent[];
  indianContext?: string;
}

const INKS: Ink[] = [
  {
    id: 'black',
    name: 'Black Marker',
    displayColor: '#1a1a1a',
    components: [
      { color: '#3B82F6', name: 'Blue', speed: 0.82, width: 28 },
      { color: '#8B5CF6', name: 'Violet', speed: 0.65, width: 22 },
      { color: '#EC4899', name: 'Magenta', speed: 0.45, width: 20 },
      { color: '#F97316', name: 'Orange', speed: 0.25, width: 16 },
    ],
  },
  {
    id: 'green',
    name: 'Green Ink',
    displayColor: '#22C55E',
    components: [
      { color: '#3B82F6', name: 'Blue', speed: 0.75, width: 26 },
      { color: '#FACC15', name: 'Yellow', speed: 0.55, width: 24 },
      { color: '#22C55E', name: 'Teal', speed: 0.3, width: 18 },
    ],
    indianContext: 'Like colors in rangoli powder!',
  },
  {
    id: 'brown',
    name: 'Brown (Mehndi)',
    displayColor: '#92400E',
    components: [
      { color: '#F97316', name: 'Orange', speed: 0.7, width: 24 },
      { color: '#DC2626', name: 'Red', speed: 0.48, width: 22 },
      { color: '#92400E', name: 'Brown', speed: 0.2, width: 20 },
    ],
    indianContext: 'Henna pigments from mehndi leaves!',
  },
  {
    id: 'purple',
    name: 'Purple Dye',
    displayColor: '#8B5CF6',
    components: [
      { color: '#DC2626', name: 'Crimson', speed: 0.73, width: 22 },
      { color: '#3B82F6', name: 'Blue', speed: 0.52, width: 26 },
      { color: '#8B5CF6', name: 'Violet', speed: 0.3, width: 18 },
    ],
    indianContext: 'Traditional Holi colors!',
  },
  {
    id: 'turmeric',
    name: 'Turmeric Dye',
    displayColor: '#EAB308',
    components: [
      { color: '#FACC15', name: 'Yellow', speed: 0.8, width: 28 },
      { color: '#F97316', name: 'Orange', speed: 0.55, width: 20 },
    ],
    indianContext: 'Haldi — curcumin pigment!',
  },
  {
    id: 'rose',
    name: 'Rose Extract',
    displayColor: '#F43F5E',
    components: [
      { color: '#FB7185', name: 'Pink', speed: 0.78, width: 24 },
      { color: '#F43F5E', name: 'Rose', speed: 0.52, width: 20 },
      { color: '#9F1239', name: 'Deep Red', speed: 0.28, width: 16 },
      { color: '#FBBF24', name: 'Gold', speed: 0.88, width: 14 },
    ],
    indianContext: 'Gulab jal — rose water colors!',
  },
];

type ViewMode = 'experiment' | 'rf' | 'learn';

export default function ChromatographyCanvas({ isPlaying }: CanvasProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('experiment');
  const [selectedInk, setSelectedInk] = useState<Ink | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [solventFront, setSolventFront] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);

  const STRIP_HEIGHT = 300;
  const SPOT_BOTTOM = 45; // px from bottom of strip

  const startSeparation = () => {
    if (!selectedInk || !isPlaying) return;
    setIsRunning(true);
    setProgress(0);
    setShowResults(false);
    setSolventFront(0);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    if (!isRunning) return;

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min(elapsed / 6000, 1);

      setProgress(newProgress);
      setSolventFront(newProgress * (STRIP_HEIGHT - 70));

      if (newProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsRunning(false);
        setShowResults(true);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning]);

  const resetExperiment = () => {
    setSelectedInk(null);
    setProgress(0);
    setShowResults(false);
    setIsRunning(false);
    setSolventFront(0);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Mode Tabs */}
      <div className="flex gap-2">
        {[
          { mode: 'experiment' as ViewMode, label: '🧪 Experiment' },
          { mode: 'rf' as ViewMode, label: '📏 Rf Values' },
          { mode: 'learn' as ViewMode, label: '📖 Learn' },
        ].map(({ mode, label }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              viewMode === mode ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* EXPERIMENT VIEW */}
      {viewMode === 'experiment' && (
        <>
          <h3 className="text-xl font-bold text-emerald-400">🎨 Paper Chromatography</h3>

          {/* Paper Strip Container */}
          <div className="relative w-72 h-80 bg-slate-800/50 rounded-2xl border-2 border-slate-600 overflow-hidden">
            {/* Beaker water */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500/40 to-cyan-400/10"
              style={{ height: 50 }}
              animate={isRunning ? { opacity: [0.4, 0.7, 0.4] } : { opacity: 0.5 }}
              transition={{ duration: 1.5, repeat: isRunning ? Infinity : 0 }}
            />

            {/* Filter paper strip */}
            <div
              className="absolute left-1/2 -translate-x-1/2 w-20 rounded-b-sm"
              style={{ top: 16, height: STRIP_HEIGHT, background: 'linear-gradient(to bottom, #fafaf9, #e7e5e4)' }}
            >
              {/* Solvent front line */}
              {progress > 0 && (
                <motion.div
                  className="absolute left-0 right-0 border-t-2 border-dashed border-cyan-400/60"
                  style={{ bottom: SPOT_BOTTOM + solventFront }}
                />
              )}

              {/* Water climbing */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-300/40 to-transparent"
                style={{ height: `${progress * 75}%` }}
              />

              {/* Original ink spot */}
              {selectedInk && (
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    bottom: SPOT_BOTTOM - 4,
                    width: 16,
                    height: 8,
                    backgroundColor: selectedInk.displayColor,
                    opacity: progress > 0.05 ? 0.3 : 1,
                  }}
                />
              )}

              {/* Separated pigment bands */}
              {selectedInk && progress > 0 && selectedInk.components.map((comp) => {
                const bandProgress = Math.max(0, progress * 1.1 - (1 - comp.speed) * 0.25);
                const yOffset = bandProgress * comp.speed * (STRIP_HEIGHT - 100);

                return (
                  <motion.div
                    key={comp.name}
                    className="absolute left-1/2 -translate-x-1/2 rounded-sm"
                    style={{
                      width: comp.width,
                      height: Math.max(2, bandProgress * 6),
                      backgroundColor: comp.color,
                      bottom: SPOT_BOTTOM + yOffset,
                      opacity: bandProgress > 0 ? Math.min(bandProgress * 3, 0.95) : 0,
                      boxShadow: `0 0 ${bandProgress * 6}px ${comp.color}40`,
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: bandProgress > 0 ? 1 : 0 }}
                  />
                );
              })}

              {/* Pencil baseline */}
              <div className="absolute left-0 right-0 border-t border-gray-400/40" style={{ bottom: SPOT_BOTTOM }} />
              <span className="absolute text-[8px] text-gray-500" style={{ bottom: SPOT_BOTTOM + 2, right: -20 }}>baseline</span>

              {/* Paper clip */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-5 bg-slate-400 rounded-t-full border-2 border-slate-500" />
            </div>

            {/* Labels */}
            <span className="absolute top-3 right-3 text-xs text-slate-500">Paper</span>
            <span className="absolute bottom-1 right-3 text-xs text-slate-500">Solvent</span>
          </div>

          {/* Progress */}
          {isRunning && (
            <div className="w-full max-w-xs">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Separating pigments…</span>
                <span>{Math.round(progress * 100)}%</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500" style={{ width: `${progress * 100}%` }} />
              </div>
            </div>
          )}

          {/* Results */}
          <AnimatePresence>
            {showResults && selectedInk && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-slate-800 rounded-xl p-4 w-full max-w-sm border border-slate-700">
                <h4 className="font-bold text-white text-center mb-3">🔬 {selectedInk.name} — {selectedInk.components.length} pigments found</h4>
                <div className="space-y-2">
                  {selectedInk.components.map((comp, i) => (
                    <motion.div key={comp.name} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.12 }}
                      className="flex items-center gap-3 p-2 bg-slate-700/50 rounded-lg">
                      <div className="w-6 h-6 rounded-full shadow-md" style={{ backgroundColor: comp.color }} />
                      <span className="flex-1 text-sm text-white">{comp.name}</span>
                      <span className="text-xs text-slate-400 font-mono">Rf {comp.speed.toFixed(2)}</span>
                    </motion.div>
                  ))}
                </div>
                {selectedInk.indianContext && (
                  <p className="text-sm text-emerald-400 text-center mt-3">🇮🇳 {selectedInk.indianContext}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ink Selection */}
          <div className="w-full max-w-sm">
            <p className="text-sm text-slate-400 text-center mb-2">Select an ink to analyze:</p>
            <div className="grid grid-cols-3 gap-2">
              {INKS.map(ink => (
                <motion.button key={ink.id} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                  onClick={() => { setSelectedInk(ink); setProgress(0); setShowResults(false); }}
                  disabled={isRunning}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                    selectedInk?.id === ink.id ? 'ring-2 ring-emerald-400 bg-slate-700' : 'bg-slate-700/50 hover:bg-slate-700'
                  }`}>
                  <div className="w-8 h-8 rounded-full border-2 border-slate-500 shadow-inner" style={{ backgroundColor: ink.displayColor }} />
                  <span className="text-[11px] text-slate-300">{ink.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startSeparation} disabled={!selectedInk || isRunning || !isPlaying}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 disabled:opacity-50 rounded-xl text-white font-bold">
              <Play className="w-4 h-4" /> Start
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={resetExperiment}
              className="flex items-center gap-2 px-4 py-3 bg-slate-600 hover:bg-slate-500 rounded-xl text-white">
              <RotateCcw className="w-4 h-4" /> Reset
            </motion.button>
          </div>
        </>
      )}

      {/* Rf VALUES VIEW */}
      {viewMode === 'rf' && (
        <>
          <h3 className="text-xl font-bold text-cyan-400">📏 Rf Value Calculator</h3>

          <div className="bg-slate-800/50 rounded-xl p-4 max-w-sm w-full border border-slate-700">
            <div className="flex items-start gap-4 mb-4">
              <Info className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-slate-300">
                <strong className="text-white">Rf = distance of pigment / distance of solvent</strong><br/>
                A higher Rf means the pigment travels farther — it's smaller and lighter.
              </p>
            </div>

            {/* Rf comparison table */}
            <div className="space-y-3">
              {INKS.map(ink => (
                <div key={ink.id} className="bg-slate-700/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: ink.displayColor }} />
                    <span className="text-sm font-bold text-white">{ink.name}</span>
                  </div>
                  <div className="flex gap-1">
                    {ink.components.map(comp => (
                      <div key={comp.name} className="flex-1 text-center">
                        <div className="h-2 rounded-full mb-1" style={{ backgroundColor: comp.color, opacity: 0.8 }} />
                        <span className="text-[10px] text-slate-400 block">{comp.name}</span>
                        <span className="text-[10px] text-cyan-400 font-mono">{comp.speed.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* LEARN VIEW */}
      {viewMode === 'learn' && (
        <>
          <h3 className="text-xl font-bold text-amber-400">📖 How Chromatography Works</h3>

          <div className="w-full max-w-sm space-y-4">
            {[
              { step: 1, title: 'Spot the ink', desc: 'Place a small dot of ink on the pencil baseline', emoji: '✏️' },
              { step: 2, title: 'Add solvent', desc: 'Dip the paper bottom in water (just below the ink spot)', emoji: '💧' },
              { step: 3, title: 'Capillary action', desc: 'Water climbs up the paper, carrying pigments along', emoji: '⬆️' },
              { step: 4, title: 'Separation!', desc: 'Lighter pigments travel farther; heavier ones stay behind', emoji: '🌈' },
              { step: 5, title: 'Measure Rf', desc: 'Rf = pigment distance ÷ solvent front distance', emoji: '📏' },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                <div className="w-10 h-10 bg-amber-600/20 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                  {item.emoji}
                </div>
                <div>
                  <p className="font-bold text-white">{item.step}. {item.title}</p>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-3 max-w-sm text-center">
            <p className="text-sm text-amber-200">
              <span className="font-bold">🔬 Real-world uses:</span> Forensics (matching ink), food safety (detecting dyes),
              drug testing, and studying plant pigments!
            </p>
          </div>
        </>
      )}

      {/* Indian Context Footer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-3 max-w-sm text-center">
        <p className="text-sm text-emerald-200">
          <span className="font-bold">🎨 Rangoli Science:</span> Ancient Indian artisans used natural pigments from flowers, 
          turmeric, and indigo — each separable by chromatography!
        </p>
      </motion.div>
    </div>
  );
}
