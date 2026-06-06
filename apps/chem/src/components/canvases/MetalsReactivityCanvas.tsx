import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Droplets, FlaskConical } from 'lucide-react';
import type { CanvasProps } from '../../types';

interface Metal {
  symbol: string;
  name: string;
  reactivity: number; // 1-10
  color: string;
  waterReaction: 'violent' | 'slow' | 'none';
  acidReaction: 'violent' | 'moderate' | 'slow' | 'none';
  facts: string;
  indianContext?: string;
}

const METALS: Metal[] = [
  { 
    symbol: 'K', name: 'Potassium', reactivity: 10, color: 'bg-purple-500',
    waterReaction: 'violent', acidReaction: 'violent',
    facts: 'Explodes in water with a purple flame!',
    indianContext: 'Essential for banana plants - Kerala is famous for bananas!'
  },
  { 
    symbol: 'Na', name: 'Sodium', reactivity: 9, color: 'bg-yellow-500',
    waterReaction: 'violent', acidReaction: 'violent',
    facts: 'Catches fire in water! Stored in kerosene.',
    indianContext: 'Part of common salt (NaCl) - namak!'
  },
  { 
    symbol: 'Ca', name: 'Calcium', reactivity: 7, color: 'bg-orange-400',
    waterReaction: 'slow', acidReaction: 'moderate',
    facts: 'Reacts slowly with water, releasing hydrogen.',
    indianContext: 'Lime (chuna) used in paan is calcium oxide!'
  },
  { 
    symbol: 'Mg', name: 'Magnesium', reactivity: 6, color: 'bg-green-400',
    waterReaction: 'slow', acidReaction: 'moderate',
    facts: 'Burns with a brilliant white light! Used in fireworks.',
    indianContext: 'Diwali sparklers contain magnesium!'
  },
  { 
    symbol: 'Al', name: 'Aluminium', reactivity: 5, color: 'bg-gray-300',
    waterReaction: 'none', acidReaction: 'slow',
    facts: 'Forms protective oxide layer. Light but strong!',
    indianContext: 'Hindalco is a major Indian aluminium producer.'
  },
  { 
    symbol: 'Zn', name: 'Zinc', reactivity: 4, color: 'bg-slate-400',
    waterReaction: 'none', acidReaction: 'moderate',
    facts: 'Coats iron to prevent rusting (galvanization).',
    indianContext: 'Zawar mines in Rajasthan are ancient zinc mines!'
  },
  { 
    symbol: 'Fe', name: 'Iron', reactivity: 3, color: 'bg-amber-700',
    waterReaction: 'none', acidReaction: 'slow',
    facts: 'Most used metal. Rusts in moist air.',
    indianContext: 'India is a top steel producer! Tata Steel leads.'
  },
  { 
    symbol: 'Cu', name: 'Copper', reactivity: 2, color: 'bg-orange-600',
    waterReaction: 'none', acidReaction: 'slow',
    facts: 'Excellent conductor. Turns green over time (patina).',
    indianContext: 'Copper vessels (tamba) are used in temples!'
  },
  { 
    symbol: 'Ag', name: 'Silver', reactivity: 1, color: 'bg-slate-300',
    waterReaction: 'none', acidReaction: 'none',
    facts: 'Best electrical conductor. Tarnishes but doesn\'t rust.',
    indianContext: 'India loves silver jewelry - we\'re top consumers!'
  },
  { 
    symbol: 'Au', name: 'Gold', reactivity: 0, color: 'bg-yellow-400',
    waterReaction: 'none', acidReaction: 'none',
    facts: 'The "noble" metal - doesn\'t react with almost anything!',
    indianContext: 'Kolar Gold Fields mined for 2000+ years!'
  },
];

type TestType = 'water' | 'acid' | 'fire';

export default function MetalsReactivityCanvas({ isPlaying }: CanvasProps) {
  const [selectedMetal, setSelectedMetal] = useState<Metal>(METALS[3]);
  const [testType, setTestType] = useState<TestType>('water');
  const [isReacting, setIsReacting] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const runTest = () => {
    if (!isPlaying) return;
    setIsReacting(true);
    setShowResult(false);

    setTimeout(() => {
      setIsReacting(false);
      setShowResult(true);
    }, 2000);
  };

  const getReactionIntensity = (): 'violent' | 'moderate' | 'slow' | 'none' => {
    if (testType === 'water') return selectedMetal.waterReaction;
    if (testType === 'acid') return selectedMetal.acidReaction;
    if (testType === 'fire') {
      if (selectedMetal.reactivity >= 6) return 'violent';
      if (selectedMetal.reactivity >= 3) return 'moderate';
      if (selectedMetal.reactivity >= 1) return 'slow';
      return 'none';
    }
    return 'none';
  };

  const reactionIntensity = getReactionIntensity();

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h3 className="text-xl font-bold text-amber-400">⚔️ Metals & Reactivity</h3>

      {/* Reactivity Series */}
      <div className="w-full max-w-md">
        <p className="text-xs text-slate-500 mb-2 text-center">← More Reactive | Less Reactive →</p>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {METALS.map(metal => (
            <motion.button
              key={metal.symbol}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedMetal(metal);
                setShowResult(false);
              }}
              className={`flex-shrink-0 w-12 min-h-16 rounded-xl flex flex-col items-center justify-center transition-all ${metal.color} ${
                selectedMetal.symbol === metal.symbol 
                  ? 'ring-2 ring-white shadow-lg' 
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <span className={`font-bold text-lg ${
                ['Ag', 'Al', 'Ca', 'Mg'].includes(metal.symbol) ? 'text-gray-800' : 'text-white'
              }`}>
                {metal.symbol}
              </span>
              <span className={`text-[8px] ${
                ['Ag', 'Al', 'Ca', 'Mg'].includes(metal.symbol) ? 'text-gray-600' : 'text-white/70'
              }`}>
                {metal.reactivity}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Test Type Selector */}
      <div className="flex gap-2">
        {[
          { type: 'water' as TestType, label: '💧 Water', icon: Droplets },
          { type: 'acid' as TestType, label: '🧪 Acid', icon: FlaskConical },
          { type: 'fire' as TestType, label: '🔥 Fire', icon: Flame },
        ].map(({ type, label }) => (
          <button
            key={type}
            onClick={() => {
              setTestType(type);
              setShowResult(false);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              testType === type ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Reaction Visualization */}
      <div className="relative w-64 min-h-48 bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
        {/* Container/Beaker */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-28 border-4 border-slate-500 border-t-0 rounded-b-2xl overflow-hidden">
          {/* Liquid */}
          <motion.div
            className={`absolute bottom-0 left-0 right-0 ${
              testType === 'water' ? 'bg-cyan-500/50' : 
              testType === 'acid' ? 'bg-green-500/50' : 'bg-transparent'
            }`}
            animate={{ 
              height: testType === 'fire' ? '0%' : '70%',
            }}
          />

          {/* Fire for fire test */}
          {testType === 'fire' && (
            <motion.div
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
              animate={{ scale: [1, 1.1, 1], y: [0, -2, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <span className="text-4xl">🔥</span>
            </motion.div>
          )}

          {/* Metal sample */}
          <motion.div
            className={`absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded ${selectedMetal.color} flex items-center justify-center font-bold shadow-lg`}
            animate={isReacting ? {
              y: testType === 'fire' ? [0, -5, 0] : [0, 10, 0],
              rotate: reactionIntensity === 'violent' ? [0, 10, -10, 0] : 0,
              scale: reactionIntensity === 'violent' ? [1, 1.2, 1] : 1,
            } : { y: testType === 'fire' ? 20 : -5 }}
            transition={{ duration: 0.3, repeat: isReacting ? Infinity : 0 }}
            style={{ 
              top: testType === 'fire' ? '40%' : '20%',
              color: ['Ag', 'Al', 'Ca', 'Mg'].includes(selectedMetal.symbol) ? '#1f2937' : 'white'
            }}
          >
            {selectedMetal.symbol}
          </motion.div>

          {/* Reaction effects */}
          <AnimatePresence>
            {isReacting && reactionIntensity !== 'none' && (
              <>
                {/* Bubbles for water/acid */}
                {testType !== 'fire' && Array.from({ length: reactionIntensity === 'violent' ? 10 : 5 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: 50, x: Math.random() * 100, opacity: 1 }}
                    animate={{ y: -50, opacity: 0 }}
                    transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
                    className="absolute bottom-0 w-2 h-2 rounded-full bg-white/60"
                  />
                ))}

                {/* Sparks/flames for fire */}
                {testType === 'fire' && (
                  <motion.div
                    className="absolute top-1/4 left-1/2 transform -translate-x-1/2"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.3, repeat: Infinity }}
                  >
                    {reactionIntensity === 'violent' && '💥'}
                    {reactionIntensity === 'moderate' && '✨'}
                    {reactionIntensity === 'slow' && '🔸'}
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Reaction label */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute top-2 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold ${
              reactionIntensity === 'violent' ? 'bg-red-600 text-white' :
              reactionIntensity === 'moderate' ? 'bg-orange-600 text-white' :
              reactionIntensity === 'slow' ? 'bg-yellow-600 text-white' :
              'bg-gray-600 text-white'
            }`}
          >
            {reactionIntensity === 'violent' && '💥 VIOLENT!'}
            {reactionIntensity === 'moderate' && '⚡ Moderate'}
            {reactionIntensity === 'slow' && '🔸 Slow'}
            {reactionIntensity === 'none' && '😴 No Reaction'}
          </motion.div>
        )}
      </div>

      {/* Test Button */}
      <button
        onClick={runTest}
        disabled={isReacting || !isPlaying}
        className="px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-600 rounded-xl text-white font-bold"
      >
        {isReacting ? '⏳ Reacting...' : `🧪 Test ${selectedMetal.name}`}
      </button>

      {/* Metal Info */}
      <div className="bg-slate-800/50 rounded-xl p-4 max-w-sm w-full">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-12 min-h-12 rounded-xl ${selectedMetal.color} flex items-center justify-center font-bold text-xl shadow-lg`}
               style={{ color: ['Ag', 'Al', 'Ca', 'Mg'].includes(selectedMetal.symbol) ? '#1f2937' : 'white' }}>
            {selectedMetal.symbol}
          </div>
          <div>
            <h4 className="font-bold text-white">{selectedMetal.name}</h4>
            <p className="text-xs text-slate-400">Reactivity: {selectedMetal.reactivity}/10</p>
          </div>
        </div>
        <p className="text-sm text-slate-300 mb-2">{selectedMetal.facts}</p>
        {selectedMetal.indianContext && (
          <p className="text-sm text-emerald-400">🇮🇳 {selectedMetal.indianContext}</p>
        )}
      </div>

      {/* Result explanation */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-800/50 rounded-xl p-3 max-w-sm"
          >
            <p className="text-sm text-slate-300">
              {testType === 'water' && reactionIntensity === 'violent' && 
                `${selectedMetal.name} is highly reactive! It releases hydrogen gas violently and may catch fire.`}
              {testType === 'water' && reactionIntensity === 'slow' && 
                `${selectedMetal.name} reacts slowly with water, producing hydrogen bubbles.`}
              {testType === 'water' && reactionIntensity === 'none' && 
                `${selectedMetal.name} doesn't react with water - it's not reactive enough.`}
              {testType === 'acid' && reactionIntensity !== 'none' && 
                `${selectedMetal.name} reacts with acid, releasing hydrogen gas (H₂).`}
              {testType === 'acid' && reactionIntensity === 'none' && 
                `${selectedMetal.name} is a noble metal - it doesn't react even with acids!`}
              {testType === 'fire' && 
                `${selectedMetal.name} ${reactionIntensity === 'violent' ? 'burns brilliantly' : reactionIntensity === 'moderate' ? 'burns steadily' : reactionIntensity === 'slow' ? 'glows' : 'barely reacts'} when heated.`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
