import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, Layers, Sparkles } from 'lucide-react';

interface Organelle {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  funFact: string;
  functions: string[];
  size: string;
  discovered: string;
  cellTypes: ('animal' | 'plant' | 'both')[];
}

const organelles: Organelle[] = [
  {
    id: 'nucleus', name: 'Nucleus', emoji: '🟣',
    color: '#8b5cf6',
    description: 'The command center of the cell, housing DNA organized into chromosomes wrapped around histone proteins. It controls gene expression, cell growth, and reproduction.',
    funFact: 'If you stretched out all the DNA in ONE cell, it would be about 2 meters long! Stretched out from all cells in your body, it would reach the sun and back over 600 times.',
    functions: ['Stores genetic information (DNA)', 'Controls gene expression & cell activities', 'Contains nucleolus for ribosome production', 'Houses 46 chromosomes in humans', 'DNA replication occurs here'],
    size: '5-10 μm diameter',
    discovered: 'Robert Brown, 1831',
    cellTypes: ['both'],
  },
  {
    id: 'mitochondria', name: 'Mitochondria', emoji: '⚡',
    color: '#ef4444',
    description: 'The powerhouse of the cell! These double-membrane organelles convert glucose and oxygen into ATP through cellular respiration, providing energy for all cellular processes.',
    funFact: 'Mitochondria have their own DNA and ribosomes, separate from the cell\'s nucleus! This supports the endosymbiotic theory — they were once free-living bacteria that were engulfed by ancient cells.',
    functions: ['Cellular respiration (Krebs cycle)', 'ATP energy production (36-38 ATP/glucose)', 'Regulates cell metabolism & apoptosis', 'Calcium signaling', 'Heat generation in brown fat'],
    size: '0.5-10 μm long',
    discovered: 'Albert von Kölliker, 1857',
    cellTypes: ['both'],
  },
  {
    id: 'er-rough', name: 'Rough ER', emoji: '📦',
    color: '#3b82f6',
    description: 'An extensive network of folded membranes studded with ribosomes, giving it a "rough" appearance. It is the primary site for protein synthesis and processing.',
    funFact: 'The rough ER is directly connected to the nuclear envelope. Proteins made here are either secreted, placed in the cell membrane, or sent to other organelles.',
    functions: ['Protein synthesis & folding', 'Quality control of proteins', 'Protein modification (glycosylation)', 'Membrane production', 'Connected to nuclear envelope'],
    size: 'Variable, network throughout cell',
    discovered: 'Keith Porter, 1945',
    cellTypes: ['both'],
  },
  {
    id: 'er-smooth', name: 'Smooth ER', emoji: '🫧',
    color: '#06b6d4',
    description: 'A network of tubular membranes without ribosomes. Specializes in lipid synthesis, detoxification, and calcium storage, crucial for many metabolic processes.',
    funFact: 'Liver cells have extensive smooth ER to detoxify alcohol and drugs. The smooth ER can actually double in size when exposed to large amounts of toxins!',
    functions: ['Lipid & steroid synthesis', 'Detoxification of drugs & poisons', 'Calcium ion storage & release', 'Carbohydrate metabolism', 'Sarcoplasmic reticulum in muscle cells'],
    size: 'Variable, tubular network',
    discovered: 'Keith Porter, 1945',
    cellTypes: ['both'],
  },
  {
    id: 'golgi', name: 'Golgi Apparatus', emoji: '📮',
    color: '#f59e0b',
    description: 'The cell\'s post office and processing center. It receives proteins from the ER, modifies, packages, and sorts them into vesicles for delivery to their final destinations.',
    funFact: 'Named after Camillo Golgi who discovered it in 1898 using a silver staining technique. He won the Nobel Prize in 1906! The Golgi has a cis face (receiving) and a trans face (shipping).',
    functions: ['Modifies proteins (adds sugar groups)', 'Packages molecules into vesicles', 'Sorts & ships cellular products', 'Produces lysosomes', 'Cis face receives, trans face ships'],
    size: '1-3 μm, stacked discs',
    discovered: 'Camillo Golgi, 1898',
    cellTypes: ['both'],
  },
  {
    id: 'lysosome', name: 'Lysosome', emoji: '🗑️',
    color: '#10b981',
    description: 'The cell\'s digestive system and recycling center. Contains powerful hydrolytic enzymes that break down waste, foreign materials, and worn-out organelles.',
    funFact: 'Lysosomes maintain a pH of about 4.5-5.0 — much more acidic than the rest of the cell (pH 7.2). If a lysosome ruptures, the enzymes are inactive at the cell\'s neutral pH, preventing self-digestion!',
    functions: ['Intracellular digestion of waste', 'Autophagy (recycling old organelles)', 'Defense against pathogens', 'Contains 50+ hydrolytic enzymes', 'Programmed cell death (apoptosis)'],
    size: '0.1-1.2 μm diameter',
    discovered: 'Christian de Duve, 1955',
    cellTypes: ['animal'],
  },
  {
    id: 'ribosome', name: 'Ribosomes', emoji: '⚙️',
    color: '#a855f7',
    description: 'Molecular machines made of RNA and protein that translate mRNA instructions into polypeptide chains (proteins). Found free in cytoplasm or attached to rough ER.',
    funFact: 'A single cell can contain up to 10 million ribosomes! A ribosome can add about 20 amino acids per second to a growing protein chain. They\'re made of two subunits: 40S and 60S in eukaryotes.',
    functions: ['Translate mRNA into proteins', 'Free ribosomes → cytoplasmic proteins', 'Bound ribosomes → secreted/membrane proteins', 'Composed of rRNA + proteins', 'Two subunits: large & small'],
    size: '20-30 nm diameter',
    discovered: 'George Palade, 1955',
    cellTypes: ['both'],
  },
  {
    id: 'membrane', name: 'Cell Membrane', emoji: '🛡️',
    color: '#f97316',
    description: 'The phospholipid bilayer that forms the cell\'s boundary. This selectively permeable barrier controls molecular traffic via channels, pumps, and receptors embedded within it.',
    funFact: 'The cell membrane is a fluid mosaic — proteins float in the lipid bilayer like icebergs in a sea. It regenerates in about 5 minutes and contains cholesterol for flexibility!',
    functions: ['Selective permeability (gatekeeping)', 'Cell-to-cell signaling via receptors', 'Protection & structural support', 'Endocytosis & exocytosis', 'Phospholipid bilayer + proteins'],
    size: '7-8 nm thick',
    discovered: 'Gorter & Grendel, 1925',
    cellTypes: ['both'],
  },
  {
    id: 'cytoskeleton', name: 'Cytoskeleton', emoji: '🕸️',
    color: '#ec4899',
    description: 'A dynamic network of protein filaments that provides structural support, enables cell movement, and serves as tracks for intracellular transport.',
    funFact: 'The cytoskeleton is not static — it constantly disassembles and reassembles. Microtubules can grow at a rate of 1 μm per minute! It\'s made of microfilaments, intermediate filaments, and microtubules.',
    functions: ['Structural support & cell shape', 'Cell movement & division', 'Intracellular transport highways', 'Anchors organelles in position', '3 types: microfilaments, microtubules, intermediate'],
    size: '7-25 nm diameter filaments',
    discovered: 'Discovered through electron microscopy, 1940s',
    cellTypes: ['both'],
  },
  {
    id: 'centriole', name: 'Centrioles', emoji: '🎯',
    color: '#64748b',
    description: 'Paired cylindrical structures made of microtubules that organize the mitotic spindle during cell division. Each cell has two centrioles at right angles.',
    funFact: 'Centrioles are found in animal cells but NOT in most plant cells! Plant cells divide using a different mechanism. Centrioles also form the base of cilia and flagella.',
    functions: ['Organize mitotic spindle fibers', 'Form centrosome with surrounding material', 'Base of cilia & flagella', 'Cell division organization', 'Found in pairs at 90° angles'],
    size: '0.2 μm diameter, 0.5 μm long',
    discovered: 'Edouard Van Beneden, 1883',
    cellTypes: ['animal'],
  },
  {
    id: 'vacuole', name: 'Central Vacuole', emoji: '💧',
    color: '#0ea5e9',
    description: 'A large membrane-bound compartment in plant cells that stores water, nutrients, and waste products. Maintains turgor pressure crucial for plant structure.',
    funFact: 'The central vacuole can occupy up to 90% of a plant cell\'s volume! When a plant wilts, it\'s because vacuoles have lost water and turgor pressure.',
    functions: ['Water & nutrient storage', 'Maintains turgor pressure', 'Stores pigments (anthocyanins)', 'Waste product storage', 'Can contain defensive toxins'],
    size: 'Up to 90% of cell volume',
    discovered: 'Félix Dujardin, 1835',
    cellTypes: ['plant'],
  },
  {
    id: 'chloroplast', name: 'Chloroplast', emoji: '🌿',
    color: '#22c55e',
    description: 'The site of photosynthesis in plant cells. Double-membrane organelles that convert light energy, CO₂, and water into glucose and oxygen using chlorophyll.',
    funFact: 'Like mitochondria, chloroplasts have their own DNA — supporting endosymbiotic theory. They were once free-living cyanobacteria! Chloroplasts can even move around inside the cell to optimize light absorption.',
    functions: ['Photosynthesis (light & dark reactions)', 'Light energy → chemical energy (glucose)', 'Contains chlorophyll pigment', 'Has own DNA & ribosomes', 'Thylakoids stacked into grana'],
    size: '3-10 μm long',
    discovered: 'Hugo von Mohl, 1837',
    cellTypes: ['plant'],
  },
  {
    id: 'cellwall', name: 'Cell Wall', emoji: '🧱',
    color: '#a3a3a3',
    description: 'A rigid outer layer found in plant cells, made primarily of cellulose. Provides structural support, protection, and helps maintain cell shape beyond what the membrane does.',
    funFact: 'Cellulose in plant cell walls is the most abundant organic molecule on Earth! Wood is basically dried cell walls. The cell wall has tiny holes called plasmodesmata for cell communication.',
    functions: ['Rigid structural support', 'Protection from mechanical damage', 'Prevents excessive water uptake', 'Made of cellulose fibers', 'Plasmodesmata for cell-cell communication'],
    size: '0.1-10 μm thick',
    discovered: 'Robert Hooke, 1665',
    cellTypes: ['plant'],
  },
  {
    id: 'peroxisome', name: 'Peroxisome', emoji: '🧹',
    color: '#f472b6',
    description: 'Small organelles that break down fatty acids and amino acids, and detoxify harmful substances like hydrogen peroxide (H₂O₂) using the enzyme catalase.',
    funFact: 'Peroxisomes can replicate by simply dividing in half, like bacteria! Liver and kidney cells can have up to 500 peroxisomes each for detoxification.',
    functions: ['Break down fatty acids (β-oxidation)', 'Detoxify H₂O₂ via catalase', 'Lipid metabolism', 'Bile acid synthesis in liver', 'Self-replicate by division'],
    size: '0.1-1.0 μm diameter',
    discovered: 'Christian de Duve, 1967',
    cellTypes: ['both'],
  },
];

// SVG cell rendering components
function CellSVG({ cellType, organellePositions, selectedId, hoveredId, onHover, onSelect }: {
  cellType: 'animal' | 'plant';
  organellePositions: { org: Organelle; cx: number; cy: number; rx: number; ry: number }[];
  selectedId: string | null;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (org: Organelle) => void;
}) {
  const isPlant = cellType === 'plant';

  return (
    <svg viewBox="0 0 600 600" className="w-full h-full">
      <defs>
        <radialGradient id="cellGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={isPlant ? '#065f46' : '#064e3b'} stopOpacity="0.4" />
          <stop offset="80%" stopColor={isPlant ? '#022c22' : '#0f172a'} stopOpacity="0.2" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="nucleusGrad" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.2" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Cell wall (plant) */}
      {isPlant && (
        <rect x="20" y="20" width="560" height="560" rx="30" ry="30"
          fill="none" stroke="#a3a3a3" strokeWidth="8" strokeDasharray="0" opacity="0.4" />
      )}

      {/* Cell membrane */}
      {isPlant ? (
        <rect x="35" y="35" width="530" height="530" rx="22" ry="22"
          fill="url(#cellGlow)" stroke="#10b981" strokeWidth="2.5" opacity="0.7" />
      ) : (
        <ellipse cx="300" cy="300" rx="265" ry="255"
          fill="url(#cellGlow)" stroke="#10b981" strokeWidth="2.5" opacity="0.7" />
      )}

      {/* ER network background */}
      <path d="M180,200 Q220,180 260,210 Q300,240 340,200 Q380,160 420,200 Q440,220 420,260"
        fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.15" />
      <path d="M150,350 Q190,320 230,350 Q270,380 310,340 Q350,300 390,340"
        fill="none" stroke="#06b6d4" strokeWidth="2" opacity="0.12" />

      {/* Cytoskeleton lines */}
      {[0, 60, 120, 180, 240, 300].map(angle => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line key={angle}
            x1={300 + Math.cos(rad) * 40} y1={300 + Math.sin(rad) * 40}
            x2={300 + Math.cos(rad) * 220} y2={300 + Math.sin(rad) * 210}
            stroke="#ec4899" strokeWidth="0.5" opacity="0.15" strokeDasharray="8,12"
          />
        );
      })}

      {/* Organelles */}
      {organellePositions.map(({ org, cx, cy, rx, ry }) => {
        const isHovered = hoveredId === org.id;
        const isSelected = selectedId === org.id;
        const active = isHovered || isSelected;

        return (
          <g key={org.id}
            onMouseEnter={() => onHover(org.id)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onSelect(org)}
            className="cursor-pointer"
            filter={active ? 'url(#glow)' : undefined}
          >
            {/* Glow ring */}
            <ellipse cx={cx} cy={cy} rx={rx + 6} ry={ry + 6}
              fill="none" stroke={org.color}
              strokeWidth={active ? 2 : 0}
              opacity={active ? 0.5 : 0}
            >
              {active && (
                <animate attributeName="opacity" values="0.3;0.7;0.3" dur="1.5s" repeatCount="indefinite" />
              )}
            </ellipse>

            {/* Body */}
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
              fill={org.color + '22'}
              stroke={org.color}
              strokeWidth={active ? 2.5 : 1.5}
              opacity={active ? 1 : 0.7}
            />

            {/* Highlight */}
            <ellipse cx={cx - rx * 0.2} cy={cy - ry * 0.25} rx={rx * 0.4} ry={ry * 0.3}
              fill="white" opacity="0.05" />

            {/* Emoji */}
            <text x={cx} y={cy - 2} textAnchor="middle" fontSize="18" dominantBaseline="central">
              {org.emoji}
            </text>
            {/* Name label */}
            <text x={cx} y={cy + 18} textAnchor="middle" fontSize="8" fontWeight="bold"
              fill="white" opacity={active ? 1 : 0.6}>
              {org.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function CellExplorer() {
  const [selected, setSelected] = useState<Organelle | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [cellType, setCellType] = useState<'animal' | 'plant'>('animal');
  const [discoveredCount, setDiscoveredCount] = useState<Set<string>>(new Set());

  const handleSelect = (org: Organelle) => {
    setSelected(org);
    setDiscoveredCount(prev => new Set(prev).add(org.id));
  };

  const filteredOrganelles = useMemo(() =>
    organelles.filter(o => o.cellTypes.includes(cellType) || o.cellTypes.includes('both')),
    [cellType]
  );

  const organellePositions = useMemo(() => {
    const isPlant = cellType === 'plant';
    const layouts: Record<string, { cx: number; cy: number; rx: number; ry: number }> = {
      nucleus:      { cx: 300, cy: 280, rx: 55, ry: 50 },
      mitochondria: { cx: 430, cy: 200, rx: 35, ry: 18 },
      'er-rough':   { cx: 410, cy: 340, rx: 40, ry: 25 },
      'er-smooth':  { cx: 170, cy: 370, rx: 38, ry: 22 },
      golgi:        { cx: 200, cy: 210, rx: 35, ry: 28 },
      lysosome:     { cx: 460, cy: 420, rx: 22, ry: 22 },
      ribosome:     { cx: 330, cy: 430, rx: 18, ry: 18 },
      membrane:     { cx: 110, cy: 480, rx: 35, ry: 18 },
      cytoskeleton: { cx: 160, cy: 150, rx: 28, ry: 22 },
      centriole:    { cx: 400, cy: 140, rx: 22, ry: 22 },
      peroxisome:   { cx: 460, cy: 290, rx: 18, ry: 18 },
      vacuole:      isPlant ? { cx: 300, cy: 300, rx: 90, ry: 80 } : { cx: 0, cy: 0, rx: 0, ry: 0 },
      chloroplast:  { cx: 200, cy: 450, rx: 35, ry: 20 },
      cellwall:     { cx: 500, cy: 480, rx: 30, ry: 18 },
    };
    return filteredOrganelles.map(org => ({
      org,
      ...(layouts[org.id] || { cx: 300, cy: 300, rx: 20, ry: 20 }),
    })).filter(p => p.rx > 0);
  }, [cellType, filteredOrganelles]);

  const totalOrganelles = organelles.length;

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">🗺️ Interactive Cell Explorer</h2>
          <p className="text-gray-400 text-lg">Navigate inside a living cell — click organelles to discover their secrets!</p>
        </motion.div>

        {/* Toggle + Progress */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
          <div className="flex bg-gray-800 rounded-full p-1">
            <button onClick={() => { setCellType('animal'); setSelected(null); }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${cellType === 'animal' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
              🐾 Animal Cell
            </button>
            <button onClick={() => { setCellType('plant'); setSelected(null); }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${cellType === 'plant' ? 'bg-green-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
              🌱 Plant Cell
            </button>
          </div>
          <div className="flex items-center gap-2 bg-gray-800/50 rounded-full px-4 py-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">Discovered: <strong className="text-yellow-400">{discoveredCount.size}</strong>/{totalOrganelles}</span>
            <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all" style={{ width: `${(discoveredCount.size / totalOrganelles) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Cell Map */}
          <div className="lg:col-span-3 relative">
            <div className="relative w-full aspect-square max-w-[620px] mx-auto rounded-3xl overflow-hidden border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-950 via-teal-950 to-cyan-950">
              {/* Animated cytoplasm particles */}
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div key={i}
                  className="absolute rounded-full bg-emerald-400/10"
                  style={{ left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 80}%`, width: 1 + Math.random() * 3, height: 1 + Math.random() * 3 }}
                  animate={{ opacity: [0.05, 0.25, 0.05], scale: [1, 1.8, 1], x: [0, (Math.random() - 0.5) * 20], y: [0, (Math.random() - 0.5) * 20] }}
                  transition={{ repeat: Infinity, duration: 3 + Math.random() * 5, delay: Math.random() * 3 }}
                />
              ))}
              <CellSVG
                cellType={cellType}
                organellePositions={organellePositions}
                selectedId={selected?.id || null}
                hoveredId={hovered}
                onHover={setHovered}
                onSelect={handleSelect}
              />

              {/* Hover tooltip */}
              <AnimatePresence>
                {hovered && !selected && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur px-4 py-2 rounded-xl border border-emerald-500/30 z-20 pointer-events-none">
                    <div className="flex items-center gap-2 text-sm text-white">
                      <Layers className="w-4 h-4 text-emerald-400" />
                      Click to explore <strong>{organelles.find(o => o.id === hovered)?.name}</strong>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Mini legend */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {filteredOrganelles.map(o => (
                <button key={o.id} onClick={() => handleSelect(o)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border ${selected?.id === o.id ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : discoveredCount.has(o.id) ? 'border-gray-700 bg-gray-800/50 text-gray-300' : 'border-gray-800 bg-gray-900 text-gray-500'}`}>
                  <span>{o.emoji}</span> {o.name}
                  {discoveredCount.has(o.id) && <span className="text-yellow-400 text-[9px]">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div key={selected.id}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-gray-900 rounded-2xl border border-gray-800 p-6 sticky top-24">
                  <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-4xl">{selected.emoji}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{selected.name}</h3>
                      <div className="flex gap-2 mt-1">
                        {selected.cellTypes.map(t => (
                          <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-gray-800 text-gray-400">
                            {t === 'both' ? '🐾🌱 Both' : t === 'animal' ? '🐾 Animal' : '🌱 Plant'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="w-16 h-1 rounded-full mb-4" style={{ backgroundColor: selected.color }} />
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">{selected.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-800/50 rounded-lg p-2.5">
                      <div className="text-[10px] text-gray-500 uppercase font-bold">Size</div>
                      <div className="text-xs text-white font-medium">{selected.size}</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-2.5">
                      <div className="text-[10px] text-gray-500 uppercase font-bold">Discovered</div>
                      <div className="text-xs text-white font-medium">{selected.discovered}</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-900/20 to-cyan-900/20 rounded-xl p-4 mb-4 border border-emerald-500/20">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm mb-1.5">
                      <Info className="w-4 h-4" /> Fun Fact
                    </div>
                    <p className="text-gray-300 text-xs italic leading-relaxed">{selected.funFact}</p>
                  </div>

                  <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider">Key Functions</h4>
                  <ul className="space-y-1.5">
                    {selected.functions.map((f, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-2 text-xs text-gray-300">
                        <span className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: selected.color }} />
                        {f}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-gray-900 rounded-2xl border border-gray-800 p-6 text-center sticky top-24">
                  <div className="text-6xl mb-4">🔬</div>
                  <h3 className="text-xl font-bold text-white mb-2">Select an Organelle</h3>
                  <p className="text-gray-400 text-sm mb-4">Click on any part of the cell map or the labels below to learn about its structure and function.</p>
                  <div className="text-left bg-gray-800/30 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">💡 Did You Know?</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {cellType === 'animal'
                        ? 'Animal cells lack a cell wall, chloroplasts, and large central vacuole. They have centrioles which most plant cells don\'t!'
                        : 'Plant cells have a rigid cell wall, chloroplasts for photosynthesis, and a large central vacuole. They lack centrioles and lysosomes!'}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
