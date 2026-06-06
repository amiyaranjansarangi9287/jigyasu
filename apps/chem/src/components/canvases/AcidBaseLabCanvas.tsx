import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, HelpCircle, RotateCcw, Sparkles } from 'lucide-react';
import type { CanvasProps } from '../../types';

interface Substance {
  id: string;
  name: string;
  emoji: string;
  ph: number;
  indianContext?: string;
}

const SUBSTANCES: Substance[] = [
  { id: 'lemon', name: 'Lemon', emoji: '🍋', ph: 2, indianContext: 'Nimbu pani!' },
  { id: 'vinegar', name: 'Vinegar', emoji: '🫗', ph: 3, indianContext: 'Sirka for pickles' },
  { id: 'tamarind', name: 'Tamarind', emoji: '🌰', ph: 2.5, indianContext: 'Imli chutney' },
  { id: 'orange', name: 'Orange Juice', emoji: '🍊', ph: 3.5, indianContext: 'Santra juice' },
  { id: 'coffee', name: 'Coffee', emoji: '☕', ph: 5, indianContext: 'Filter kaapi' },
  { id: 'milk', name: 'Milk', emoji: '🥛', ph: 6.5, indianContext: 'Doodh for chai' },
  { id: 'water', name: 'Water', emoji: '💧', ph: 7 },
  { id: 'blood', name: 'Blood', emoji: '🩸', ph: 7.4, indianContext: 'Our body maintains this!' },
  { id: 'baking-soda', name: 'Baking Soda', emoji: '🧂', ph: 8.5, indianContext: 'Meetha soda for dhokla' },
  { id: 'soap', name: 'Soap', emoji: '🧼', ph: 9.5, indianContext: 'Neem soap' },
  { id: 'ammonia', name: 'Ammonia', emoji: '🧪', ph: 11, indianContext: 'Used in fertilizers' },
  { id: 'ash-water', name: 'Ash Water', emoji: '🪣', ph: 12, indianContext: 'Traditional village cleaning' },
];

const MYSTERY_SUBSTANCES = [
  { id: 'mystery-1', actualId: 'lemon', hints: ['Sour taste', 'Yellow fruit', 'Makes good drinks'] },
  { id: 'mystery-2', actualId: 'soap', hints: ['Slippery', 'Used for cleaning', 'Makes bubbles'] },
  { id: 'mystery-3', actualId: 'milk', hints: ['White liquid', 'Comes from cows', 'Good for bones'] },
  { id: 'mystery-4', actualId: 'vinegar', hints: ['Used in pickles', 'Strong smell', 'Acidic'] },
  { id: 'mystery-5', actualId: 'baking-soda', hints: ['White powder', 'Makes cakes fluffy', 'Slightly basic'] },
];

const getPHColor = (ph: number): string => {
  if (ph < 3) return 'bg-red-500';
  if (ph < 5) return 'bg-orange-500';
  if (ph < 6) return 'bg-yellow-500';
  if (ph < 8) return 'bg-green-500';
  if (ph < 10) return 'bg-blue-500';
  if (ph < 12) return 'bg-indigo-500';
  return 'bg-purple-500';
};

const getPHGradient = (ph: number): string => {
  if (ph < 3) return 'from-red-600 to-red-400';
  if (ph < 5) return 'from-orange-600 to-orange-400';
  if (ph < 6) return 'from-yellow-600 to-yellow-400';
  if (ph < 8) return 'from-green-600 to-green-400';
  if (ph < 10) return 'from-blue-600 to-blue-400';
  if (ph < 12) return 'from-indigo-600 to-indigo-400';
  return 'from-purple-600 to-purple-400';
};

type GameMode = 'explore' | 'mystery' | 'neutralize';

export default function AcidBaseLabCanvas({ isPlaying }: CanvasProps) {
  const [gameMode, setGameMode] = useState<GameMode>('explore');
  const [placedSubstances, setPlacedSubstances] = useState<Substance[]>([]);
  const [draggedSubstance, setDraggedSubstance] = useState<Substance | null>(null);
  const [selectedSubstance, setSelectedSubstance] = useState<Substance | null>(null);
  
  // Mystery mode state
  const [currentMystery, setCurrentMystery] = useState(0);
  const [mysteryGuess, setMysteryGuess] = useState<string | null>(null);
  const [mysteryScore, setMysteryScore] = useState(0);
  const [showHint, setShowHint] = useState(0);
  
  // Neutralization mode state
  const [beakerPH, setBeakerPH] = useState(7);
  const [targetPH, setTargetPH] = useState(7);
  const [neutralizeScore, setNeutralizeScore] = useState(0);

  const handleDragStart = (substance: Substance) => {
    if (!isPlaying) return;
    setDraggedSubstance(substance);
  };

  const handleDrop = (ph: number) => {
    if (!draggedSubstance || !isPlaying) return;
    
    const targetPH = Math.round(ph);
    const isCorrect = Math.abs(draggedSubstance.ph - targetPH) <= 1;
    
    if (isCorrect && !placedSubstances.find(s => s.id === draggedSubstance.id)) {
      setPlacedSubstances(prev => [...prev, draggedSubstance]);
      setSelectedSubstance(draggedSubstance);
    }
    setDraggedSubstance(null);
  };

  const resetLab = () => {
    setPlacedSubstances([]);
    setSelectedSubstance(null);
    setDraggedSubstance(null);
  };

  // Mystery mode functions
  const checkMysteryGuess = (guessId: string) => {
    const mystery = MYSTERY_SUBSTANCES[currentMystery];
    const isCorrect = guessId === mystery.actualId;
    setMysteryGuess(guessId);
    
    if (isCorrect) {
      setMysteryScore(prev => prev + Math.max(1, 4 - showHint));
    }
    
    setTimeout(() => {
      if (currentMystery < MYSTERY_SUBSTANCES.length - 1) {
        setCurrentMystery(prev => prev + 1);
        setMysteryGuess(null);
        setShowHint(0);
      }
    }, 2000);
  };

  const revealHint = () => {
    if (showHint < 3) setShowHint(prev => prev + 1);
  };

  // Neutralization mode
  const addToBeaker = (substance: Substance) => {
    const change = substance.ph < 7 ? -1 : substance.ph > 7 ? 1 : 0;
    setBeakerPH(prev => Math.max(0, Math.min(14, prev + change)));
  };

  useEffect(() => {
    if (gameMode === 'neutralize') {
      if (Math.abs(beakerPH - targetPH) < 0.5) {
        setNeutralizeScore(prev => prev + 1);
        // New target
        setTargetPH(Math.floor(Math.random() * 14) + 1);
        setBeakerPH(7);
      }
    }
  }, [beakerPH, targetPH, gameMode]);

  const currentMysteryData = MYSTERY_SUBSTANCES[currentMystery];
  const actualMysterySubstance = SUBSTANCES.find(s => s.id === currentMysteryData?.actualId);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Mode Selector */}
      <div className="flex gap-2">
        {[
          { mode: 'explore' as GameMode, label: '🔬 Explore', icon: Beaker },
          { mode: 'mystery' as GameMode, label: '🕵️ Mystery', icon: HelpCircle },
          { mode: 'neutralize' as GameMode, label: '⚖️ Neutralize', icon: Sparkles },
        ].map(({ mode, label }) => (
          <button
            key={mode}
            onClick={() => setGameMode(mode)}
            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
              gameMode === mode
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* EXPLORE MODE */}
      {gameMode === 'explore' && (
        <>
          <h3 className="text-xl font-bold text-emerald-400">🧪 pH Scale Explorer</h3>
          
          {/* pH Scale */}
          <div className="relative w-full max-w-md">
            <div className="flex min-h-16 rounded-xl overflow-hidden border-2 border-slate-600">
              {Array.from({ length: 15 }, (_, i) => (
                <div
                  key={i}
                  className={`flex-1 flex items-end justify-center pb-1 cursor-pointer transition-transform hover:scale-105 ${getPHColor(i)}`}
                  onClick={() => handleDrop(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(i)}
                >
                  <span className="text-xs font-bold text-white/80">{i}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-red-400 font-semibold">← ACIDIC</span>
              <span className="text-green-400 font-semibold">NEUTRAL</span>
              <span className="text-purple-400 font-semibold">BASIC →</span>
            </div>

            <div className="absolute -top-8 left-0 right-0 h-8 flex">
              {placedSubstances.map((substance) => (
                <motion.div
                  key={substance.id}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="absolute text-2xl cursor-pointer"
                  style={{ left: `${(substance.ph / 14) * 100}%`, transform: 'translateX(-50%)' }}
                  onClick={() => setSelectedSubstance(substance)}
                >
                  {substance.emoji}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Selected Substance Info */}
          <AnimatePresence>
            {selectedSubstance && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`bg-gradient-to-r ${getPHGradient(selectedSubstance.ph)} p-4 rounded-xl text-white max-w-sm`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedSubstance.emoji}</span>
                  <div>
                    <h4 className="font-bold text-lg">{selectedSubstance.name}</h4>
                    <p className="text-sm opacity-90">pH: {selectedSubstance.ph}</p>
                    {selectedSubstance.indianContext && (
                      <p className="text-sm opacity-80">🇮🇳 {selectedSubstance.indianContext}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Draggable Substances */}
          <div className="bg-slate-800/50 rounded-xl p-4 w-full max-w-md">
            <p className="text-sm text-slate-400 mb-3 text-center">
              👆 Tap a substance, then tap the pH scale to place it
            </p>
            <div className="grid grid-cols-4 gap-2">
              {SUBSTANCES.map((substance) => {
                const isPlaced = placedSubstances.find(s => s.id === substance.id);
                return (
                  <motion.button
                    key={substance.id}
                    draggable={isPlaying && !isPlaced}
                    onDragStart={() => handleDragStart(substance)}
                    onClick={() => !isPlaced && setDraggedSubstance(substance)}
                    whileHover={{ scale: isPlaced ? 1 : 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                      isPlaced
                        ? 'bg-slate-700/50 opacity-50'
                        : draggedSubstance?.id === substance.id
                        ? 'bg-emerald-600 ring-2 ring-emerald-400'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                    disabled={!!isPlaced || !isPlaying}
                  >
                    <span className="text-xl">{substance.emoji}</span>
                    <span className="text-[10px] text-slate-300 truncate w-full text-center">{substance.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400">
              Placed: {placedSubstances.length}/{SUBSTANCES.length}
            </div>
            <button
              onClick={resetLab}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-200 transition-colors flex items-center gap-2"
             aria-label="Rotate ccw">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
        </>
      )}

      {/* MYSTERY MODE */}
      {gameMode === 'mystery' && (
        <>
          <h3 className="text-xl font-bold text-amber-400">🕵️ Mystery Substance</h3>
          <p className="text-slate-400 text-sm">Identify the substance based on hints!</p>
          
          <div className="text-center mb-2">
            <span className="text-amber-400 font-bold">Score: {mysteryScore}</span>
            <span className="text-slate-500 mx-2">•</span>
            <span className="text-slate-400">{currentMystery + 1}/{MYSTERY_SUBSTANCES.length}</span>
          </div>

          {currentMystery < MYSTERY_SUBSTANCES.length ? (
            <>
              {/* Mystery Box */}
              <motion.div
                className="w-32 min-h-32 bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl flex items-center justify-center text-6xl shadow-xl"
                animate={{ rotateY: mysteryGuess ? 180 : 0 }}
              >
                {mysteryGuess ? actualMysterySubstance?.emoji : '❓'}
              </motion.div>

              {/* Hints */}
              <div className="space-y-2 w-full max-w-sm">
                {currentMysteryData.hints.slice(0, showHint).map((hint, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-700/50 px-4 py-2 rounded-lg text-sm text-slate-300"
                  >
                    💡 Hint {i + 1}: {hint}
                  </motion.div>
                ))}
                {showHint < 3 && !mysteryGuess && (
                  <button
                    onClick={revealHint}
                    className="w-full py-2 bg-amber-600/20 border border-amber-500/30 rounded-lg text-amber-400 text-sm"
                  >
                    Reveal Hint ({3 - showHint} left)
                  </button>
                )}
              </div>

              {/* Guess Options */}
              {!mysteryGuess && (
                <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
                  {['lemon', 'soap', 'milk', 'vinegar', 'baking-soda', 'water'].map(id => {
                    const sub = SUBSTANCES.find(s => s.id === id)!;
                    return (
                      <motion.button
                        key={id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => checkMysteryGuess(id)}
                        className="flex flex-col items-center gap-1 p-3 bg-slate-700 hover:bg-slate-600 rounded-xl"
                      >
                        <span className="text-2xl">{sub.emoji}</span>
                        <span className="text-xs text-slate-300">{sub.name}</span>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Result */}
              <AnimatePresence>
                {mysteryGuess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`px-6 py-3 rounded-xl font-bold ${
                      mysteryGuess === currentMysteryData.actualId
                        ? 'bg-green-600 text-white'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {mysteryGuess === currentMysteryData.actualId
                      ? `🎉 Correct! +${Math.max(1, 4 - showHint)} points`
                      : `❌ It was ${actualMysterySubstance?.name}`}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h4 className="text-xl font-bold text-white">Mystery Complete!</h4>
              <p className="text-amber-400">Final Score: {mysteryScore} points</p>
              <button
                onClick={() => {
                  setCurrentMystery(0);
                  setMysteryScore(0);
                  setMysteryGuess(null);
                  setShowHint(0);
                }}
                className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-xl text-white"
              >
                Play Again
              </button>
            </div>
          )}
        </>
      )}

      {/* NEUTRALIZATION MODE */}
      {gameMode === 'neutralize' && (
        <>
          <h3 className="text-xl font-bold text-blue-400">⚖️ Neutralization Challenge</h3>
          <p className="text-slate-400 text-sm">Add acids or bases to reach the target pH!</p>
          
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Score: <span className="text-blue-400 font-bold">{neutralizeScore}</span></span>
          </div>

          {/* Target and Current */}
          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Target</p>
              <div className={`w-16 min-h-16 rounded-xl ${getPHColor(targetPH)} flex items-center justify-center text-white font-bold text-2xl`}>
                {targetPH}
              </div>
            </div>
            <div className="text-3xl">→</div>
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-1">Current</p>
              <motion.div 
                className={`w-16 min-h-16 rounded-xl ${getPHColor(beakerPH)} flex items-center justify-center text-white font-bold text-2xl`}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
                key={beakerPH}
              >
                {beakerPH}
              </motion.div>
            </div>
          </div>

          {/* Beaker Visual */}
          <div className="relative w-24 min-h-32 border-4 border-slate-500 border-t-0 rounded-b-xl overflow-hidden">
            <motion.div
              className={`absolute bottom-0 left-0 right-0 ${getPHColor(beakerPH)}`}
              animate={{ height: '70%' }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Add substances */}
          <div className="grid grid-cols-4 gap-2">
            {SUBSTANCES.filter(s => s.ph !== 7).slice(0, 8).map(sub => (
              <motion.button
                key={sub.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => addToBeaker(sub)}
                className="flex flex-col items-center p-2 bg-slate-700 hover:bg-slate-600 rounded-xl"
              >
                <span className="text-xl">{sub.emoji}</span>
                <span className="text-[10px] text-slate-400">pH {sub.ph}</span>
              </motion.button>
            ))}
          </div>

          <button
            onClick={() => setBeakerPH(7)}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm text-white"
          >
            Reset Beaker
          </button>
        </>
      )}

      {/* Indian Context */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-3 max-w-sm text-center"
      >
        <p className="text-sm text-emerald-200">
          <span className="font-bold">🇮🇳 Did you know?</span> Amla (Indian Gooseberry) has pH ~2.5, 
          making it one of the most acidic fruits, yet it's incredibly healthy!
        </p>
      </motion.div>
    </div>
  );
}
