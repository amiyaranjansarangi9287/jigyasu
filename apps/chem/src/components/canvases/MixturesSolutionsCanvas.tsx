import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CanvasProps } from '../../types';
import { KnowledgeCheck, TakeawayBox } from '../ui';

interface Substance {
  id: string;
  name: string;
  emoji: string;
  behavior: 'dissolves' | 'sinks' | 'floats' | 'mixes';
  color: string;
  indianContext?: string;
}

type Tool = 'filter' | 'magnet' | 'evaporate' | null;

const SUBSTANCES: Substance[] = [
  { id: 'salt', name: 'Salt', emoji: '🧂', behavior: 'dissolves', color: 'rgba(255,255,255,0.3)', indianContext: 'Namak from sea water' },
  { id: 'sugar', name: 'Sugar', emoji: '🍬', behavior: 'dissolves', color: 'rgba(255,255,255,0.2)', indianContext: 'Cheeni for chai' },
  { id: 'sand', name: 'Sand', emoji: '🏖️', behavior: 'sinks', color: 'rgba(194,178,128,0.8)' },
  { id: 'oil', name: 'Oil', emoji: '🫒', behavior: 'floats', color: 'rgba(255,215,0,0.6)', indianContext: 'Sarson ka tel' },
  { id: 'milk', name: 'Milk', emoji: '🥛', behavior: 'mixes', color: 'rgba(255,255,255,0.7)', indianContext: 'Lassi mixing!' },
  { id: 'iron', name: 'Iron Filings', emoji: '🔩', behavior: 'sinks', color: 'rgba(80,80,80,0.9)' },
];

interface BeakerContent {
  substance: Substance;
  layer: 'top' | 'middle' | 'bottom';
}

export default function MixturesSolutionsCanvas({ isPlaying }: CanvasProps) {
  const [beakerContents, setBeakerContents] = useState<BeakerContent[]>([]);
  const [activeTool, setActiveTool] = useState<Tool>(null);
  const [message, setMessage] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);
  const beakerRef = useRef<HTMLDivElement>(null);

  const addSubstance = (substance: Substance) => {
    if (!isPlaying || beakerContents.length >= 4) return;
    
    if (beakerContents.find(c => c.substance.id === substance.id)) return;

    let layer: 'top' | 'middle' | 'bottom' = 'middle';
    if (substance.behavior === 'floats') layer = 'top';
    if (substance.behavior === 'sinks') layer = 'bottom';

    setIsAnimating(true);
    setBeakerContents(prev => [...prev, { substance, layer }]);
    
    const messages: Record<string, string> = {
      dissolves: `${substance.emoji} ${substance.name} dissolves completely!`,
      sinks: `${substance.emoji} ${substance.name} sinks to the bottom!`,
      floats: `${substance.emoji} ${substance.name} floats on top!`,
      mixes: `${substance.emoji} ${substance.name} mixes throughout!`,
    };
    setMessage(messages[substance.behavior]);

    setTimeout(() => setIsAnimating(false), 1000);
  };

  const useTool = (tool: Tool) => {
    if (!isPlaying || beakerContents.length === 0) return;
    
    setActiveTool(tool);
    setIsAnimating(true);

    setTimeout(() => {
      let newContents = [...beakerContents];
      let toolMessage = '';

      switch (tool) {
        case 'filter':
          newContents = newContents.filter(c => c.substance.behavior !== 'sinks');
          toolMessage = '🔬 Filter removed solid particles!';
          break;
        case 'magnet':
          const hadIron = newContents.some(c => c.substance.id === 'iron');
          newContents = newContents.filter(c => c.substance.id !== 'iron');
          toolMessage = hadIron ? '🧲 Magnet attracted iron filings!' : '🧲 No magnetic materials found';
          break;
        case 'evaporate':
          const hadDissolved = newContents.some(c => c.substance.behavior === 'dissolves');
          newContents = newContents.filter(c => c.substance.behavior !== 'dissolves');
          toolMessage = hadDissolved ? '☀️ Water evaporated, leaving behind crystals!' : '☀️ Nothing to evaporate';
          break;
      }

      setBeakerContents(newContents);
      setMessage(toolMessage);
      setActiveTool(null);
      setIsAnimating(false);
    }, 1500);
  };

  const clearBeaker = () => {
    setBeakerContents([]);
    setMessage('');
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const getWaterColor = () => {
    if (beakerContents.length === 0) return 'from-cyan-400/60 to-blue-500/60';
    const hasMilk = beakerContents.some(c => c.substance.id === 'milk');
    if (hasMilk) return 'from-white/70 to-blue-100/70';
    return 'from-cyan-400/70 to-blue-500/70';
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h3 className="text-xl font-bold text-emerald-400">🥛 Mixtures & Solutions</h3>

      {/* Beaker */}
      <div className="relative">
        <div
          ref={beakerRef}
          className="relative w-48 min-h-64 border-4 border-slate-400 border-t-0 rounded-b-3xl bg-slate-900/30 overflow-hidden"
        >
          {/* Water */}
          <motion.div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${getWaterColor()}`}
            initial={{ height: '70%' }}
            animate={{ 
              height: activeTool === 'evaporate' ? '30%' : '70%'
            }}
            transition={{ duration: 1 }}
          />

          {/* Floating layer (oil) */}
          <AnimatePresence>
            {beakerContents
              .filter(c => c.layer === 'top')
              .map(c => (
                <motion.div
                  key={c.substance.id}
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-[25%] left-2 right-2 h-8 rounded-full"
                  style={{ backgroundColor: c.substance.color }}
                />
              ))}
          </AnimatePresence>

          {/* Sinking particles */}
          <AnimatePresence>
            {beakerContents
              .filter(c => c.layer === 'bottom')
              .map(c => (
                <motion.div
                  key={c.substance.id}
                  initial={{ y: -100 }}
                  animate={{ y: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', damping: 10 }}
                  className="absolute bottom-2 left-4 right-4 h-6 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: c.substance.color }}
                >
                  <span className="text-xs">{c.substance.emoji}</span>
                </motion.div>
              ))}
          </AnimatePresence>

          {/* Dissolved particles (subtle animation) */}
          {beakerContents
            .filter(c => c.substance.behavior === 'dissolves')
            .map(c => (
              <motion.div
                key={c.substance.id}
                className="absolute inset-x-4 top-1/3 bottom-4 pointer-events-none"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-xs opacity-60"
                    style={{
                      left: `${(i % 4) * 25}%`,
                      top: `${Math.floor(i / 4) * 50}%`,
                    }}
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
                  >
                    ·
                  </motion.span>
                ))}
              </motion.div>
            ))}

          {/* Evaporation steam */}
          <AnimatePresence>
            {activeTool === 'evaporate' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute -top-8 left-1/2 transform -translate-x-1/2"
              >
                <motion.span
                  className="text-2xl"
                  animate={{ y: [-10, -30], opacity: [1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ♨️
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Beaker label */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-slate-700 px-2 py-1 rounded text-xs text-slate-300">
          500ml
        </div>
      </div>

      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-slate-800 px-4 py-2 rounded-lg text-sm text-slate-200"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Substances */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
        {SUBSTANCES.map(substance => {
          const isAdded = beakerContents.some(c => c.substance.id === substance.id);
          return (
            <motion.button
              key={substance.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addSubstance(substance)}
              disabled={isAdded || !isPlaying || isAnimating}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                isAdded
                  ? 'bg-emerald-800/50 opacity-50'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              <span className="text-2xl">{substance.emoji}</span>
              <span className="text-xs text-slate-300">{substance.name}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Separation Tools */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => useTool('filter')}
          disabled={!isPlaying || isAnimating}
          className="flex flex-col items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white"
        >
          <span>🔬</span>
          <span className="text-xs">Filter</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => useTool('magnet')}
          disabled={!isPlaying || isAnimating}
          className="flex flex-col items-center gap-1 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-xl text-white"
        >
          <span>🧲</span>
          <span className="text-xs">Magnet</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => useTool('evaporate')}
          disabled={!isPlaying || isAnimating}
          className="flex flex-col items-center gap-1 px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-xl text-white"
        >
          <span>☀️</span>
          <span className="text-xs">Evaporate</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearBeaker}
          className="flex flex-col items-center gap-1 px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-xl text-white"
        >
          <span>🗑️</span>
          <span className="text-xs">Clear</span>
        </motion.button>
      </div>

      {/* Indian Context */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-3 max-w-sm text-center"
      >
        <p className="text-sm text-emerald-200">
          <span className="font-bold">🇮🇳 Did you know?</span> Sea salt is made by evaporating sea water in shallow pools 
          along India&apos;s coast - the same separation technique you can try here!
        </p>
      </motion.div>

      {/* Knowledge Check */}
      <KnowledgeCheck
        prompt="Salt dissolves in water. What kind of mixture does it form?"
        options={["A suspension (it settles at the bottom)", "A colloid (it stays suspended)", "A true solution (it completely dissolves)", "An emulsion (it floats on top)"]}
        correctIndex={2}
        explanation="Salt (NaCl) completely dissociates into Na⁺ and Cl⁻ ions in water — this is a true solution. You can't filter it out, only recover it by evaporation (which is how sea salt is made!)"
        retryHint="Think about whether salt needs to be filtered or if it just disappears..."
      />

      <TakeawayBox
        title="🥛 Mixtures - Key Takeaways"
        cards={[
          { type: 'key', text: 'Solutions dissolve completely (salt in water), suspensions settle (sand in water), colloids stay dispersed (milk).' },
          { type: 'key', text: 'Use filtration for solids, magnets for magnetic materials, evaporation for dissolved salts.' },
          { type: 'tip', text: 'Lassi is a colloid — yogurt particles stay suspended but don\'t dissolve. Chai is a solution!' },
          { type: 'fun', text: 'The Konkan coast of India produces salt by evaporating sea water in shallow pans — a 2000-year-old technique!' },
        ]}
        indianContext="India's Sambhar Lake (Rajasthan) is the largest inland salt lake. For centuries, communities have evaporated its water to harvest salt — chemistry at industrial scale!"
      />
    </div>
  );
}
