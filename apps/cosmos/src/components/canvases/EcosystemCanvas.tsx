import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Bug, Bird, Sun, Droplets } from 'lucide-react';
import { CanvasProps } from '../../types';

interface Organism {
  id: string;
  name: string;
  type: 'producer' | 'consumer' | 'decomposer';
  level: number; // 1 = producer, 2 = primary consumer, etc.
  emoji: string;
  x: number;
  y: number;
  info: string;
  indianContext?: string;
}

interface FoodChainLink {
  from: string;
  to: string;
}

const organisms: Organism[] = [
  // Producers (Level 1)
  { id: 'grass', name: 'Grass', type: 'producer', level: 1, emoji: '🌿', x: 15, y: 75, info: 'Converts sunlight into food through photosynthesis' },
  { id: 'tree', name: 'Banyan Tree', type: 'producer', level: 1, emoji: '🌳', x: 35, y: 70, info: 'India\'s national tree, provides shelter to many animals', indianContext: 'Sacred in Indian culture, some are over 500 years old!' },
  { id: 'algae', name: 'Algae', type: 'producer', level: 1, emoji: '🦠', x: 55, y: 80, info: 'Tiny plants in water that produce oxygen' },
  { id: 'lotus', name: 'Lotus', type: 'producer', level: 1, emoji: '🪷', x: 75, y: 75, info: 'Aquatic plant that grows in ponds', indianContext: 'India\'s national flower, sacred in Hindu and Buddhist traditions' },
  
  // Primary Consumers (Level 2)
  { id: 'grasshopper', name: 'Grasshopper', type: 'consumer', level: 2, emoji: '🦗', x: 20, y: 55, info: 'Eats grass and leaves' },
  { id: 'deer', name: 'Spotted Deer', type: 'consumer', level: 2, emoji: '🦌', x: 40, y: 50, info: 'Herbivore found in Indian forests', indianContext: 'Called "Chital" in Hindi, common in Indian wildlife sanctuaries' },
  { id: 'rabbit', name: 'Rabbit', type: 'consumer', level: 2, emoji: '🐰', x: 60, y: 55, info: 'Eats plants and grass' },
  { id: 'fish', name: 'Rohu Fish', type: 'consumer', level: 2, emoji: '🐟', x: 80, y: 60, info: 'Eats algae and small plants', indianContext: 'Popular freshwater fish in Indian rivers and ponds' },
  
  // Secondary Consumers (Level 3)
  { id: 'frog', name: 'Frog', type: 'consumer', level: 3, emoji: '🐸', x: 25, y: 35, info: 'Eats insects like grasshoppers' },
  { id: 'snake', name: 'King Cobra', type: 'consumer', level: 3, emoji: '🐍', x: 50, y: 30, info: 'Eats frogs, birds, and small mammals', indianContext: 'Revered in Indian culture, featured in Nag Panchami festival' },
  { id: 'owl', name: 'Owl', type: 'consumer', level: 3, emoji: '🦉', x: 70, y: 35, info: 'Nocturnal predator that eats rodents' },
  
  // Tertiary Consumers (Level 4)
  { id: 'tiger', name: 'Bengal Tiger', type: 'consumer', level: 4, emoji: '🐯', x: 45, y: 15, info: 'Apex predator of Indian forests', indianContext: 'India\'s national animal, about 3,000 live in Indian reserves' },
  { id: 'eagle', name: 'Golden Eagle', type: 'consumer', level: 4, emoji: '🦅', x: 65, y: 12, info: 'Top predator that hunts from the sky' },
  
  // Decomposers
  { id: 'mushroom', name: 'Mushroom', type: 'decomposer', level: 0, emoji: '🍄', x: 10, y: 90, info: 'Breaks down dead matter into nutrients' },
  { id: 'bacteria', name: 'Bacteria', type: 'decomposer', level: 0, emoji: '🦠', x: 90, y: 90, info: 'Microscopic decomposers essential for nutrient cycling' },
];

const foodChain: FoodChainLink[] = [
  { from: 'grass', to: 'grasshopper' },
  { from: 'grass', to: 'deer' },
  { from: 'grass', to: 'rabbit' },
  { from: 'tree', to: 'deer' },
  { from: 'algae', to: 'fish' },
  { from: 'lotus', to: 'fish' },
  { from: 'grasshopper', to: 'frog' },
  { from: 'frog', to: 'snake' },
  { from: 'rabbit', to: 'snake' },
  { from: 'rabbit', to: 'owl' },
  { from: 'fish', to: 'eagle' },
  { from: 'deer', to: 'tiger' },
  { from: 'snake', to: 'eagle' },
];

type EcosystemType = 'forest' | 'wetland' | 'grassland';

export function EcosystemCanvas({ isPlaying }: CanvasProps) {
  const [selectedOrganism, setSelectedOrganism] = useState<Organism | null>(null);
  const [showFoodChain, setShowFoodChain] = useState(false);
  const [highlightedChain, setHighlightedChain] = useState<string[]>([]);
  const [ecosystem, setEcosystem] = useState<EcosystemType>('forest');
  const [sunIntensity, setSunIntensity] = useState(70);
  const [rainfall, setRainfall] = useState(50);

  // Trace food chain from an organism
  const traceFoodChain = (orgId: string, direction: 'up' | 'down' = 'up'): string[] => {
    const chain: string[] = [orgId];
    const visited = new Set<string>([orgId]);

    const findNext = (currentId: string) => {
      const links = direction === 'up'
        ? foodChain.filter((l) => l.from === currentId)
        : foodChain.filter((l) => l.to === currentId);

      for (const link of links) {
        const nextId = direction === 'up' ? link.to : link.from;
        if (!visited.has(nextId)) {
          visited.add(nextId);
          chain.push(nextId);
          findNext(nextId);
        }
      }
    };

    findNext(orgId);
    return chain;
  };

  const handleOrganismClick = (org: Organism) => {
    setSelectedOrganism(org);
    if (showFoodChain) {
      // Trace chain both up and down
      const upChain = traceFoodChain(org.id, 'up');
      const downChain = traceFoodChain(org.id, 'down');
      setHighlightedChain([...new Set([...downChain, ...upChain])]);
    }
  };

  const getEcosystemGradient = () => {
    switch (ecosystem) {
      case 'forest':
        return 'from-emerald-900 via-green-800 to-green-950';
      case 'wetland':
        return 'from-cyan-900 via-teal-800 to-blue-950';
      case 'grassland':
        return 'from-amber-800 via-yellow-700 to-orange-900';
    }
  };

  const getLevelLabel = (level: number) => {
    switch (level) {
      case 0: return 'Decomposer';
      case 1: return 'Producer';
      case 2: return 'Primary Consumer';
      case 3: return 'Secondary Consumer';
      case 4: return 'Apex Predator';
      default: return '';
    }
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'text-amber-400 bg-amber-500/20';
      case 1: return 'text-emerald-400 bg-emerald-500/20';
      case 2: return 'text-sky-400 bg-sky-500/20';
      case 3: return 'text-orange-400 bg-orange-500/20';
      case 4: return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  return (
    <div className={`relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-b ${getEcosystemGradient()}`}>
      {/* Sun */}
      <motion.div
        className="absolute right-8 top-8"
        animate={{ scale: [1, 1.1, 1], opacity: sunIntensity / 100 }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <div
          className="rounded-full"
          style={{
            width: 50,
            height: 50,
            background: 'radial-gradient(circle, #FFF700 0%, #FFD700 50%, #FF8C00 100%)',
            boxShadow: `0 0 ${sunIntensity}px ${sunIntensity / 2}px rgba(255, 200, 0, 0.4)`,
          }}
        />
      </motion.div>

      {/* Rain effect */}
      {rainfall > 60 && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: Math.floor(rainfall / 3) }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-4 w-0.5 bg-sky-400/40 rounded-full"
              initial={{ y: -20, x: `${Math.random() * 100}%` }}
              animate={{ y: '120%' }}
              transition={{
                duration: 0.4 + Math.random() * 0.3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      {/* Food Chain Lines */}
      {showFoodChain && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {foodChain.map((link, idx) => {
            const from = organisms.find((o) => o.id === link.from);
            const to = organisms.find((o) => o.id === link.to);
            if (!from || !to) return null;

            const isHighlighted =
              highlightedChain.includes(link.from) && highlightedChain.includes(link.to);

            return (
              <motion.line
                key={idx}
                x1={`${from.x}%`}
                y1={`${from.y}%`}
                x2={`${to.x}%`}
                y2={`${to.y}%`}
                stroke={isHighlighted ? '#22c55e' : '#ffffff30'}
                strokeWidth={isHighlighted ? 3 : 1}
                strokeDasharray={isHighlighted ? '0' : '5,5'}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
            );
          })}
        </svg>
      )}

      {/* Organisms */}
      {organisms.map((org) => {
        const isHighlighted = highlightedChain.includes(org.id);
        const isSelected = selectedOrganism?.id === org.id;

        return (
          <motion.button
            key={org.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${org.x}%`, top: `${org.y}%` }}
            animate={isPlaying ? { y: [0, -5, 0] } : {}}
            transition={{ duration: 2 + Math.random(), repeat: Infinity }}
            whileHover={{ scale: 1.3 }}
            onClick={() => handleOrganismClick(org)}
          >
            <div
              className={`text-3xl transition-all ${
                isHighlighted
                  ? 'drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]'
                  : isSelected
                  ? 'drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]'
                  : ''
              }`}
            >
              {org.emoji}
            </div>
          </motion.button>
        );
      })}

      {/* Energy Flow Indicator */}
      <div className="absolute top-4 left-4 rounded-xl bg-black/30 p-3 backdrop-blur">
        <div className="flex items-center gap-2 text-xs text-white">
          <Sun className="h-4 w-4 text-yellow-400" />
          <span>→</span>
          <Leaf className="h-4 w-4 text-green-400" />
          <span>→</span>
          <Bug className="h-4 w-4 text-amber-400" />
          <span>→</span>
          <Bird className="h-4 w-4 text-sky-400" />
        </div>
        <p className="text-xs text-slate-300 mt-1">Energy flows up the food chain</p>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 space-y-2">
        {/* Ecosystem Selector */}
        <div className="flex gap-1 rounded-lg bg-black/30 p-1 backdrop-blur">
          {(['forest', 'wetland', 'grassland'] as const).map((eco) => (
            <button
              key={eco}
              onClick={() => setEcosystem(eco)}
              className={`rounded-md px-3 py-1 text-xs capitalize transition-colors ${
                ecosystem === eco
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {eco === 'forest' ? '🌲' : eco === 'wetland' ? '🏞️' : '🌾'} {eco}
            </button>
          ))}
        </div>

        {/* Environment Controls */}
        <div className="rounded-xl bg-black/30 p-3 backdrop-blur space-y-2">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-yellow-400" />
            <input
              type="range"
              min="20"
              max="100"
              value={sunIntensity}
              onChange={(e) => setSunIntensity(parseInt(e.target.value))}
              className="w-20 accent-yellow-500"
            />
            <span className="text-xs text-white">{sunIntensity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-sky-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={rainfall}
              onChange={(e) => setRainfall(parseInt(e.target.value))}
              className="w-20 accent-sky-500"
            />
            <span className="text-xs text-white">{rainfall}%</span>
          </div>
        </div>
      </div>

      {/* Food Chain Toggle */}
      <button
        onClick={() => {
          setShowFoodChain(!showFoodChain);
          if (!showFoodChain) setHighlightedChain([]);
        }}
        className={`absolute bottom-4 right-4 flex items-center gap-2 rounded-xl px-4 py-2 transition-colors ${
          showFoodChain
            ? 'bg-emerald-500 text-white'
            : 'bg-black/30 text-white hover:bg-black/50 backdrop-blur'
        }`}
      >
        <span>🔗</span>
        <span className="text-sm">Food Chain</span>
      </button>

      {/* Indian Context */}
      <div className="absolute top-4 right-4 rounded-xl bg-amber-500/20 border border-amber-500/30 px-3 py-2 max-w-xs">
        <p className="text-xs text-amber-300">
          🇮🇳 India has 18 biodiversity hotspots and 100+ national parks!
        </p>
      </div>

      {/* Organism Info Panel */}
      <AnimatePresence>
        {selectedOrganism && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-20 left-1/2 -translate-x-1/2 w-80 rounded-2xl bg-slate-800/95 p-4 backdrop-blur border border-slate-700"
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl">{selectedOrganism.emoji}</span>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedOrganism.name}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs ${getLevelColor(selectedOrganism.level)}`}>
                  {getLevelLabel(selectedOrganism.level)}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedOrganism(null);
                  setHighlightedChain([]);
                }}
                className="ml-auto text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="mt-3 text-sm text-slate-300">{selectedOrganism.info}</p>
            {selectedOrganism.indianContext && (
              <div className="mt-2 rounded-lg bg-amber-500/10 p-2">
                <p className="text-xs text-amber-300">🇮🇳 {selectedOrganism.indianContext}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
