import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CanvasProps } from '../../types';

interface Polymer {
  id: string;
  name: string;
  type: 'natural' | 'synthetic';
  emoji: string;
  description: string;
  indianContext?: string;
}

interface PlasticItem {
  id: string;
  name: string;
  recycleCode: number;
  emoji: string;
}

const POLYMERS: Polymer[] = [
  { id: 'cotton', name: 'Cotton', type: 'natural', emoji: '🧵', description: 'Cellulose fibers from cotton plants', indianContext: 'India is the largest cotton producer!' },
  { id: 'rubber', name: 'Natural Rubber', type: 'natural', emoji: '🌳', description: 'Latex from rubber trees', indianContext: 'Kerala rubber plantations' },
  { id: 'jute', name: 'Jute', type: 'natural', emoji: '🧶', description: 'Natural fiber from jute plants', indianContext: 'Bengal\'s golden fiber!' },
  { id: 'silk', name: 'Silk', type: 'natural', emoji: '🪱', description: 'Protein fiber from silkworms', indianContext: 'Kanchipuram & Banarasi silk' },
  { id: 'nylon', name: 'Nylon', type: 'synthetic', emoji: '🧦', description: 'First synthetic fiber, very strong' },
  { id: 'pet', name: 'PET Plastic', type: 'synthetic', emoji: '🍶', description: 'Used for water bottles' },
  { id: 'polythene', name: 'Polythene', type: 'synthetic', emoji: '🛍️', description: 'Plastic bags, takes 500+ years to decompose!' },
  { id: 'pvc', name: 'PVC', type: 'synthetic', emoji: '🪠', description: 'Used in pipes and cables' },
];

const PLASTICS_FOR_SORTING: PlasticItem[] = [
  { id: 'bottle', name: 'Water Bottle', recycleCode: 1, emoji: '🍶' },
  { id: 'milk', name: 'Milk Jug', recycleCode: 2, emoji: '🥛' },
  { id: 'yogurt', name: 'Yogurt Cup', recycleCode: 5, emoji: '🥄' },
  { id: 'styrofoam', name: 'Styrofoam', recycleCode: 6, emoji: '📦' },
];

const RECYCLE_BINS = [
  { code: 1, label: 'PET', color: 'bg-green-600', recyclable: true },
  { code: 2, label: 'HDPE', color: 'bg-blue-600', recyclable: true },
  { code: 5, label: 'PP', color: 'bg-emerald-600', recyclable: true },
  { code: 6, label: 'PS', color: 'bg-red-600', recyclable: false },
];

export default function PolymersPlasticsCanvas({ isPlaying }: CanvasProps) {
  const [chainLength, setChainLength] = useState(3);
  const [activeTab, setActiveTab] = useState<'build' | 'compare' | 'recycle'>('build');
  const [sortedItems, setSortedItems] = useState<Record<string, number>>({});
  const [score, setScore] = useState(0);

  const addMonomer = () => {
    if (!isPlaying) return;
    setChainLength(prev => Math.min(prev + 1, 12));
  };

  const removeMonomer = () => {
    if (!isPlaying) return;
    setChainLength(prev => Math.max(prev - 1, 1));
  };

  const handleDrop = (itemId: string, binCode: number) => {
    if (!isPlaying) return;
    
    const item = PLASTICS_FOR_SORTING.find(p => p.id === itemId);
    if (!item || sortedItems[itemId] !== undefined) return;

    const isCorrect = item.recycleCode === binCode;
    setSortedItems(prev => ({ ...prev, [itemId]: binCode }));
    
    if (isCorrect) {
      setScore(prev => prev + 25);
    }
  };

  const resetRecycling = () => {
    setSortedItems({});
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h3 className="text-xl font-bold text-emerald-400">🧵 Polymers & Plastics</h3>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['build', 'compare', 'recycle'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === tab
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {tab === 'build' && '🔗 Build'}
            {tab === 'compare' && '⚖️ Compare'}
            {tab === 'recycle' && '♻️ Recycle'}
          </button>
        ))}
      </div>

      {/* Build Tab */}
      {activeTab === 'build' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-md space-y-4"
        >
          <div className="bg-slate-800/50 rounded-xl p-4">
            <h4 className="text-sm text-slate-400 mb-3 text-center">
              Add monomers to build your polymer chain!
            </h4>
            
            {/* Chain visualization */}
            <div className="flex items-center justify-center gap-1 flex-wrap py-4 min-h-[80px]">
              {Array.from({ length: chainLength }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                    M{i + 1}
                  </div>
                  {i < chainLength - 1 && (
                    <div className="w-4 h-1 bg-purple-400" />
                  )}
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-300 mb-2">
                Chain length: <span className="font-bold text-emerald-400">{chainLength}</span> monomers
              </p>
              <p className="text-xs text-slate-500">
                {chainLength < 5 ? 'Short chain - weak material' :
                 chainLength < 8 ? 'Medium chain - getting stronger!' :
                 'Long chain - strong polymer! 💪'}
              </p>
            </div>

            <div className="flex justify-center gap-3 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={removeMonomer}
                disabled={chainLength <= 1}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-slate-600 disabled:opacity-50 rounded-lg text-white"
              >
                ➖ Remove
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={addMonomer}
                disabled={chainLength >= 12}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 disabled:opacity-50 rounded-lg text-white"
              >
                ➕ Add Monomer
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Compare Tab */}
      {activeTab === 'compare' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-md space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            {/* Natural */}
            <div>
              <h4 className="text-center text-green-400 font-bold mb-2">🌿 Natural</h4>
              <div className="space-y-2">
                {POLYMERS.filter(p => p.type === 'natural').map(polymer => (
                  <motion.div
                    key={polymer.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-green-900/30 border border-green-500/30 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{polymer.emoji}</span>
                      <div>
                        <p className="text-sm font-bold text-white">{polymer.name}</p>
                        <p className="text-xs text-slate-400">{polymer.description}</p>
                        {polymer.indianContext && (
                          <p className="text-xs text-green-400 mt-1">🇮🇳 {polymer.indianContext}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Synthetic */}
            <div>
              <h4 className="text-center text-amber-400 font-bold mb-2">🏭 Synthetic</h4>
              <div className="space-y-2">
                {POLYMERS.filter(p => p.type === 'synthetic').map(polymer => (
                  <motion.div
                    key={polymer.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-amber-900/30 border border-amber-500/30 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{polymer.emoji}</span>
                      <div>
                        <p className="text-sm font-bold text-white">{polymer.name}</p>
                        <p className="text-xs text-slate-400">{polymer.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recycle Tab */}
      {activeTab === 'recycle' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-md space-y-4"
        >
          <div className="text-center">
            <p className="text-sm text-slate-400">Sort plastics into the correct bins!</p>
            <p className="text-lg font-bold text-emerald-400">Score: {score}/100</p>
          </div>

          {/* Plastics to sort */}
          <div className="flex flex-wrap gap-2 justify-center min-h-[60px]">
            {PLASTICS_FOR_SORTING.filter(p => sortedItems[p.id] === undefined).map(plastic => (
              <motion.button
                key={plastic.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1 p-2 bg-slate-700 rounded-lg"
              >
                <span className="text-2xl">{plastic.emoji}</span>
                <span className="text-xs text-slate-300">{plastic.name}</span>
                <span className="text-xs text-slate-500">♻️ {plastic.recycleCode}</span>
              </motion.button>
            ))}
          </div>

          {/* Recycle bins */}
          <div className="grid grid-cols-4 gap-2">
            {RECYCLE_BINS.map(bin => (
              <motion.button
                key={bin.code}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  const unsorted = PLASTICS_FOR_SORTING.find(p => sortedItems[p.id] === undefined);
                  if (unsorted) handleDrop(unsorted.id, bin.code);
                }}
                className={`${bin.color} rounded-xl p-3 text-white flex flex-col items-center`}
              >
                <span className="text-2xl">🗑️</span>
                <span className="text-xs font-bold">{bin.label}</span>
                <span className="text-xs">#{bin.code}</span>
              </motion.button>
            ))}
          </div>

          {/* Sorted items feedback */}
          <AnimatePresence>
            {Object.keys(sortedItems).length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-slate-800/50 rounded-lg p-3"
              >
                <div className="flex flex-wrap gap-2 justify-center">
                  {Object.entries(sortedItems).map(([itemId, binCode]) => {
                    const item = PLASTICS_FOR_SORTING.find(p => p.id === itemId);
                    const isCorrect = item?.recycleCode === binCode;
                    return (
                      <div
                        key={itemId}
                        className={`px-2 py-1 rounded text-xs ${
                          isCorrect ? 'bg-green-600' : 'bg-red-600'
                        }`}
                      >
                        {item?.emoji} {isCorrect ? '✓' : '✗'}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={resetRecycling}
            className="w-full py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm text-white"
          >
            🔄 Reset Game
          </button>
        </motion.div>
      )}

      {/* Indian Context */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-3 max-w-sm text-center"
      >
        <p className="text-sm text-emerald-200">
          <span className="font-bold">🇮🇳 Did you know?</span> India produces over 25,000 tonnes of plastic 
          waste daily. Choosing natural polymers like jute and cotton helps our environment!
        </p>
      </motion.div>
    </div>
  );
}
