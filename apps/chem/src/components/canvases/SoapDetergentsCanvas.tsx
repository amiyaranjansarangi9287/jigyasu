import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CanvasProps } from '../../types';
import { KnowledgeCheck, TakeawayBox, ChallengeTask } from '../ui';

type ViewMode = 'micelle' | 'make' | 'compare';

interface SoapIngredient { id: string; name: string; emoji: string; type: 'oil' | 'base' | 'additive'; }

const INGREDIENTS: SoapIngredient[] = [
  { id: 'coconut', name: 'Coconut Oil', emoji: '🥥', type: 'oil' },
  { id: 'olive', name: 'Olive Oil', emoji: '🫒', type: 'oil' },
  { id: 'neem', name: 'Neem Oil', emoji: '🌿', type: 'oil' },
  { id: 'naoh', name: 'NaOH (Lye)', emoji: '⚗️', type: 'base' },
  { id: 'koh', name: 'KOH (Potash)', emoji: '🧪', type: 'base' },
  { id: 'turmeric', name: 'Haldi', emoji: '🟡', type: 'additive' },
  { id: 'sandalwood', name: 'Chandan', emoji: '🪵', type: 'additive' },
  { id: 'rose', name: 'Rose Water', emoji: '🌹', type: 'additive' },
];

export default function SoapDetergentsCanvas({ isPlaying }: CanvasProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('micelle');
  const [showCleaning, setShowCleaning] = useState(false);
  const [cleaningStep, setCleaningStep] = useState(0);
  const [selectedOil, setSelectedOil] = useState<string | null>(null);
  const [selectedBase, setSelectedBase] = useState<string | null>(null);
  const [selectedAdditive, setSelectedAdditive] = useState<string | null>(null);
  const [soapMade, setSoapMade] = useState(false);
  const [waterType, setWaterType] = useState<'soft' | 'hard'>('soft');

  const startCleaning = () => {
    if (!isPlaying) return;
    setShowCleaning(true);
    setCleaningStep(0);
    const interval = setInterval(() => {
      setCleaningStep(prev => {
        if (prev >= 4) { clearInterval(interval); return 4; }
        return prev + 1;
      });
    }, 1500);
  };

  const makeSoap = () => {
    if (selectedOil && selectedBase) setSoapMade(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div className="flex gap-2">
        {([['micelle', '🫧 How Soap Works'], ['make', '🧪 Make Soap'], ['compare', '⚖️ Soap vs Detergent']] as [ViewMode, string][]).map(([m, label]) => (
          <button key={m} onClick={() => setViewMode(m)}
            className={`px-3 py-2 rounded-xl text-sm font-semibold ${viewMode === m ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* MICELLE MODE */}
      {viewMode === 'micelle' && (
        <>
          <h3 className="text-xl font-bold text-cyan-400">🫧 How Soap Cleans</h3>

          {/* Micelle visualization */}
          <div className="relative w-72 h-52 bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
            {/* Water background */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 to-cyan-800/40" />

            {/* Micelle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {/* Oil droplet in center */}
              <motion.div className="w-12 h-12 bg-yellow-500/60 rounded-full flex items-center justify-center z-10 relative"
                animate={{ scale: showCleaning && cleaningStep >= 3 ? [1, 0.8, 0] : 1 }}>
                <span className="text-xs font-bold text-yellow-900">Oil</span>
              </motion.div>

              {/* Soap molecules radiating outward */}
              {Array.from({ length: 10 }).map((_, i) => {
                const angle = (i / 10) * Math.PI * 2;
                const r = showCleaning && cleaningStep >= 2 ? 30 : 40;
                return (
                  <motion.div key={i} className="absolute"
                    animate={{
                      left: Math.cos(angle) * r + 20,
                      top: Math.sin(angle) * r + 20,
                    }}
                    transition={{ type: 'spring' }}>
                    {/* Hydrophilic head (likes water) */}
                    <div className="w-4 h-4 bg-blue-500 rounded-full" />
                    {/* Hydrophobic tail (likes oil) - line toward center */}
                    <div className="w-0.5 h-3 bg-amber-400 mx-auto"
                      style={{ transform: `rotate(${(angle * 180 / Math.PI) + 90}deg)` }} />
                  </motion.div>
                );
              })}
            </div>

            {/* Step labels */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full text-xs text-white">
              {!showCleaning && 'Soap molecule surrounds oil'}
              {showCleaning && cleaningStep === 0 && '1. Dirt/oil on surface'}
              {showCleaning && cleaningStep === 1 && '2. Soap molecules approach'}
              {showCleaning && cleaningStep === 2 && '3. Tails grab oil (micelle forms)'}
              {showCleaning && cleaningStep === 3 && '4. Micelle lifts oil away!'}
              {showCleaning && cleaningStep >= 4 && '5. Rinsed clean! ✨'}
            </div>
          </div>

          <button onClick={startCleaning} disabled={showCleaning && cleaningStep < 4}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 rounded-xl text-white font-bold">
            {showCleaning && cleaningStep >= 4 ? '🔄 Watch Again' : '▶ Show Cleaning Process'}
          </button>

          {/* Legend */}
          <div className="flex gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full" /> Hydrophilic head (water-loving)</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-400 rounded-full" /> Hydrophobic tail (oil-loving)</div>
          </div>
        </>
      )}

      {/* MAKE SOAP MODE */}
      {viewMode === 'make' && (
        <>
          <h3 className="text-xl font-bold text-amber-400">🧪 Saponification — Make Your Soap!</h3>
          <p className="text-slate-400 text-sm">Fat/Oil + Base → Soap + Glycerol</p>

          <div className="grid grid-cols-3 gap-4 w-full max-w-md">
            <div>
              <p className="text-xs text-slate-400 mb-2 text-center">1. Choose Oil</p>
              {INGREDIENTS.filter(i => i.type === 'oil').map(ing => (
                <button key={ing.id} onClick={() => setSelectedOil(ing.id)}
                  className={`w-full mb-1 p-2 rounded-lg text-left text-sm ${selectedOil === ing.id ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                  {ing.emoji} {ing.name}
                </button>
              ))}
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-2 text-center">2. Choose Base</p>
              {INGREDIENTS.filter(i => i.type === 'base').map(ing => (
                <button key={ing.id} onClick={() => setSelectedBase(ing.id)}
                  className={`w-full mb-1 p-2 rounded-lg text-left text-sm ${selectedBase === ing.id ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                  {ing.emoji} {ing.name}
                </button>
              ))}
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-2 text-center">3. Add Extra</p>
              {INGREDIENTS.filter(i => i.type === 'additive').map(ing => (
                <button key={ing.id} onClick={() => setSelectedAdditive(selectedAdditive === ing.id ? null : ing.id)}
                  className={`w-full mb-1 p-2 rounded-lg text-left text-sm ${selectedAdditive === ing.id ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                  {ing.emoji} {ing.name}
                </button>
              ))}
            </div>
          </div>

          <button onClick={makeSoap} disabled={!selectedOil || !selectedBase}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-600 rounded-xl text-white font-bold">
            ⚗️ Mix & Saponify!
          </button>

          <AnimatePresence>
            {soapMade && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-amber-600 to-orange-600 p-4 rounded-xl text-white text-center max-w-sm">
                <span className="text-4xl block mb-2">🧼</span>
                <h4 className="text-xl font-bold mb-1">Your Soap is Ready!</h4>
                <p className="text-sm opacity-90">
                  {INGREDIENTS.find(i => i.id === selectedOil)?.emoji} +{' '}
                  {INGREDIENTS.find(i => i.id === selectedBase)?.emoji}
                  {selectedAdditive && ` + ${INGREDIENTS.find(i => i.id === selectedAdditive)?.emoji}`}
                  {' → 🧼 + Glycerol'}
                </p>
                <p className="text-xs mt-2 opacity-80">
                  {selectedOil === 'neem' ? '🌿 Neem soap has natural antibacterial properties!' :
                   selectedOil === 'coconut' ? '🥥 Coconut oil makes great lathering soap!' :
                   '🫒 Olive oil soap is gentle and moisturizing!'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* COMPARE MODE */}
      {viewMode === 'compare' && (
        <>
          <h3 className="text-xl font-bold text-cyan-400">⚖️ Soap vs Synthetic Detergent</h3>

          {/* Water type toggle */}
          <div className="flex gap-2 mb-2">
            <button onClick={() => setWaterType('soft')} className={`px-4 py-2 rounded-xl text-sm ${waterType === 'soft' ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300'}`}>💧 Soft Water</button>
            <button onClick={() => setWaterType('hard')} className={`px-4 py-2 rounded-xl text-sm ${waterType === 'hard' ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300'}`}>🪨 Hard Water</button>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4">
              <h4 className="font-bold text-emerald-400 mb-3">🧼 Soap</h4>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>✅ Biodegradable</li>
                <li>✅ Natural ingredients</li>
                <li>✅ Gentle on skin</li>
                <li>{waterType === 'hard' ? '❌ Forms scum in hard water' : '✅ Works well in soft water'}</li>
                <li>✅ Ancient recipe (3000+ years)</li>
              </ul>
              {/* Lather visual */}
              <div className={`mt-3 h-8 rounded-lg flex items-center justify-center text-xs ${waterType === 'soft' ? 'bg-white/30 text-white' : 'bg-slate-600 text-slate-400'}`}>
                {waterType === 'soft' ? '🫧🫧🫧 Great lather!' : '😞 Poor lather, scum forms'}
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
              <h4 className="font-bold text-blue-400 mb-3">🧴 Detergent</h4>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>⚠️ Slow to biodegrade</li>
                <li>⚠️ Synthetic chemicals</li>
                <li>⚠️ Can irritate skin</li>
                <li>✅ Works in all water types</li>
                <li>✅ Strong cleaning power</li>
              </ul>
              <div className="mt-3 h-8 rounded-lg flex items-center justify-center text-xs bg-white/30 text-white">
                🫧🫧🫧 Great lather always!
              </div>
            </div>
          </div>

          {waterType === 'hard' && (
            <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-3 max-w-sm">
              <p className="text-xs text-amber-200">
                <strong>Why does soap fail in hard water?</strong> Ca²⁺ and Mg²⁺ ions react with soap to form 
                insoluble scum: 2C₁₇H₃₅COONa + CaCl₂ → (C₁₇H₃₅COO)₂Ca↓ + 2NaCl
              </p>
            </div>
          )}
        </>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-3 max-w-sm text-center">
        <p className="text-sm text-emerald-200">
          <span className="font-bold">🇮🇳 Natural cleansers:</span> Reetha (soapnut) and shikakai have been used 
          as shampoo in India for centuries — natural saponins that foam without chemicals!
        </p>
      </motion.div>

      {/* Knowledge Checks */}
      <KnowledgeCheck
        prompt="Why does soap have both a water-loving and oil-loving end? Every micelle demo needs this understanding."
        options={["So it can dissolve completely in water", "So it grabs oil with one end and water carries it away with the other", "Because soap molecules are just random chains", "To make the water taste better"]}
        correctIndex={1}
        explanation="Soap molecules are amphiphilic — the hydrophobic tail digs into grease, the hydrophilic head stays in water. When you rinse, the entire micelle (oil + soap) is carried away!"
        retryHint="Think about how soap actually removes grease from a plate..."
      />

      <ChallengeTask
        title="Master the Micelle"
        description="Run through these steps to truly understand how soap cleans"
        steps={[
          { label: 'Watch the cleaning animation twice', key: 'watch' },
          { label: 'Make a soap in the "Make Soap" tab', key: 'make' },
          { label: 'Toggle between soft and hard water', key: 'water' },
          { label: 'Explain micelle formation in your own words', key: 'explain' },
        ]}
        completionMessage="You've mastered how soap works! 🧼"
      />

      <TakeawayBox
        title="🧼 Key Takeaways"
        cards={[
          { type: 'key', text: 'Soap molecules have two ends — hydrophilic (water-loving) and hydrophobic (oil-loving).' },
          { type: 'key', text: 'Micelles form when soap tails surround grease droplets, lifting them off surfaces.' },
          { type: 'tip', text: 'Hard water has Ca²⁺/Mg²⁺ that react with soap to form scum — try comparing it!' },
          { type: 'fun', text: 'India has used reetha and shikakai as natural shampoos for centuries — zero chemistry, all nature!' },
        ]}
        indianContext="Mysore Sandal Soap, made from sandalwood oil, has been produced since 1916 — one of India's oldest cosmetic brands!"
      />
    </div>
  );
}
