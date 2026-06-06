import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, Zap, Info, Eye } from 'lucide-react';

interface Organelle {
  id: string;
  name: string;
  emoji: string;
  color: string;
  animal: boolean;
  plant: boolean;
  description: string;
  process?: string;
  funFact: string;
}

const organelles: Organelle[] = [
  { id: 'nucleus', name: 'Nucleus', emoji: '🟣', color: '#8b5cf6', animal: true, plant: true,
    description: 'Control center housing DNA. Directs all cell activities via gene expression.',
    process: 'DNA → mRNA (transcription) → Protein (translation)',
    funFact: 'Contains 2 meters of DNA packed into 6 micrometers!' },
  { id: 'mitochondria', name: 'Mitochondria', emoji: '⚡', color: '#ef4444', animal: true, plant: true,
    description: 'Powerhouse! Converts glucose + O₂ into ATP energy via cellular respiration.',
    process: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + 36-38 ATP',
    funFact: 'Has its own DNA — was once a free-living bacterium!' },
  { id: 'chloroplast', name: 'Chloroplast', emoji: '🌿', color: '#22c55e', animal: false, plant: true,
    description: 'Site of photosynthesis. Converts light + CO₂ + H₂O into glucose + O₂.',
    process: '6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂',
    funFact: 'Contains chlorophyll which absorbs red and blue light, reflecting green!' },
  { id: 'cellwall', name: 'Cell Wall', emoji: '🧱', color: '#a3a3a3', animal: false, plant: true,
    description: 'Rigid cellulose layer outside the membrane. Provides structural support and protection.',
    funFact: 'Made of cellulose — the most abundant organic molecule on Earth!' },
  { id: 'vacuole', name: 'Central Vacuole', emoji: '💧', color: '#0ea5e9', animal: false, plant: true,
    description: 'Giant water-filled sac (up to 90% of cell). Maintains turgor pressure and stores nutrients.',
    funFact: 'When a plant wilts, the vacuoles have lost water pressure!' },
  { id: 'membrane', name: 'Cell Membrane', emoji: '🛡️', color: '#f97316', animal: true, plant: true,
    description: 'Phospholipid bilayer controlling what enters/exits. Both cells have this!',
    process: 'Selective permeability: small/nonpolar → passes freely; large/charged → needs transport',
    funFact: 'Constantly moving — called the "fluid mosaic model"!' },
  { id: 'er', name: 'ER (Rough & Smooth)', emoji: '📦', color: '#3b82f6', animal: true, plant: true,
    description: 'Rough ER: protein synthesis (has ribosomes). Smooth ER: lipid synthesis, detox.',
    process: 'mRNA → Ribosome on Rough ER → Protein → folds → vesicle → Golgi',
    funFact: 'The ER membrane is directly connected to the nuclear envelope!' },
  { id: 'golgi', name: 'Golgi Apparatus', emoji: '📮', color: '#f59e0b', animal: true, plant: true,
    description: 'The postal service! Modifies, packages, and ships proteins in vesicles.',
    process: 'Receive protein → modify (add sugars) → sort → ship in vesicle',
    funFact: 'Named after Camillo Golgi who won the Nobel Prize in 1906!' },
  { id: 'ribosome', name: 'Ribosomes', emoji: '⚙️', color: '#a855f7', animal: true, plant: true,
    description: 'Tiny protein factories. Read mRNA instructions to build amino acid chains.',
    process: 'mRNA codon → tRNA anticodon → amino acid added → polypeptide chain',
    funFact: 'A cell can have up to 10 million ribosomes!' },
  { id: 'lysosome', name: 'Lysosomes', emoji: '🗑️', color: '#10b981', animal: true, plant: false,
    description: 'Digestive recyclers containing 50+ enzymes. Break down waste and old organelles.',
    funFact: 'pH inside is ~4.5 — like vinegar! Much more acidic than the rest of the cell.' },
  { id: 'centriole', name: 'Centrioles', emoji: '🎯', color: '#64748b', animal: true, plant: false,
    description: 'Organize spindle fibers during cell division. Absent in most plant cells.',
    funFact: 'Found in pairs at right angles — they organize the entire mitotic spindle!' },
  { id: 'cytoskeleton', name: 'Cytoskeleton', emoji: '🕸️', color: '#ec4899', animal: true, plant: true,
    description: 'Network of protein filaments providing shape, movement, and internal transport.',
    funFact: 'Made of 3 types: microfilaments (thin), microtubules (thick), intermediate filaments!' },
];

// Animated process visualization
function ProcessAnimation({ organelleId }: { organelleId: string }) {
  if (organelleId === 'mitochondria') {
    return (
      <div className="bg-gray-800/50 rounded-xl p-3 mt-3">
        <div className="text-[10px] text-yellow-400 font-bold mb-2">⚡ Cellular Respiration Process</div>
        <div className="flex items-center justify-center gap-1 text-[10px] flex-wrap">
          {['🍬 Glucose', '→', '🔥 Glycolysis', '→', '🔄 Krebs', '→', '⚡ ETC', '→'].map((s, i) => (
            <motion.span key={i}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.3, repeat: Infinity, duration: 2.4, repeatDelay: 0 }}
              className={s === '→' ? 'text-gray-600' : 'bg-gray-700 px-1.5 py-0.5 rounded text-gray-300'}>
              {s}
            </motion.span>
          ))}
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="bg-yellow-500/20 px-2 py-0.5 rounded text-yellow-400 font-bold">
            38 ATP!
          </motion.span>
        </div>
      </div>
    );
  }
  if (organelleId === 'chloroplast') {
    return (
      <div className="bg-gray-800/50 rounded-xl p-3 mt-3">
        <div className="text-[10px] text-green-400 font-bold mb-2">☀️ Photosynthesis Process</div>
        <div className="flex items-center justify-center gap-1 text-[10px] flex-wrap">
          {['☀️ Light', '+', '💧 H₂O', '+', '💨 CO₂', '→', '🌿 Chlorophyll', '→'].map((s, i) => (
            <motion.span key={i}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.3, repeat: Infinity, duration: 2.4 }}
              className={s === '→' || s === '+' ? 'text-gray-600' : 'bg-gray-700 px-1.5 py-0.5 rounded text-gray-300'}>
              {s}
            </motion.span>
          ))}
          <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}
            className="bg-green-500/20 px-2 py-0.5 rounded text-green-400 font-bold">🍬 Glucose + 🫧 O₂</motion.span>
        </div>
      </div>
    );
  }
  return null;
}

export default function CellCompare() {
  const [selected, setSelected] = useState<Organelle | null>(null);
  const [viewMode, setViewMode] = useState<'compare' | 'animal' | 'plant'>('compare');
  const [showProcesses, setShowProcesses] = useState(true);

  const animalOrganelles = organelles.filter(o => o.animal);
  const plantOrganelles = organelles.filter(o => o.plant);
  const sharedOrganelles = organelles.filter(o => o.animal && o.plant);
  const animalOnly = organelles.filter(o => o.animal && !o.plant);
  const plantOnly = organelles.filter(o => !o.animal && o.plant);

  return (
    <div className="min-h-screen bg-gray-950 pt-16 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-5">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1">🔬 Cell Structure Explorer</h2>
          <p className="text-gray-400 text-sm">Compare plant vs. animal cells side-by-side!</p>
        </motion.div>

        {/* View mode + toggle */}
        <div className="flex flex-wrap justify-center gap-2 mb-5">
          <div className="flex bg-gray-800 rounded-full p-1">
            {[
              { id: 'compare' as const, label: '⚖️ Compare', icon: ArrowLeftRight },
              { id: 'animal' as const, label: '🐾 Animal', icon: Eye },
              { id: 'plant' as const, label: '🌱 Plant', icon: Eye },
            ].map(v => (
              <button key={v.id} onClick={() => setViewMode(v.id)}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${viewMode === v.id ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                {v.label}
              </button>
            ))}
          </div>
          <button onClick={() => setShowProcesses(!showProcesses)}
            className={`px-3 py-2 rounded-full text-xs font-medium flex items-center gap-1 ${showProcesses ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-gray-800 text-gray-400'}`}>
            <Zap className="w-3 h-3" /> {showProcesses ? 'Processes ON' : 'Processes OFF'}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Main comparison area */}
          <div className="lg:col-span-2">
            {viewMode === 'compare' ? (
              <div className="grid md:grid-cols-2 gap-4">
                {/* Animal Cell */}
                <div className="bg-gradient-to-br from-blue-950/30 to-gray-900 rounded-2xl border border-blue-500/20 p-4">
                  <h3 className="text-sm font-bold text-blue-400 mb-3 flex items-center gap-2">🐾 Animal Cell <span className="text-[10px] text-gray-500 font-normal">({animalOrganelles.length} organelles)</span></h3>
                  <div className="relative aspect-square rounded-xl bg-blue-950/20 border border-blue-500/10 overflow-hidden mb-3">
                    {/* Cell shape - irregular */}
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      <ellipse cx="100" cy="100" rx="85" ry="80" fill="#1e3a5f11" stroke="#3b82f6" strokeWidth="2" />
                      {animalOrganelles.map((o, i) => {
                        const angle = (i / animalOrganelles.length) * Math.PI * 2 - Math.PI / 2;
                        const r = 35 + (i % 3) * 15;
                        const cx = 100 + Math.cos(angle) * r;
                        const cy = 100 + Math.sin(angle) * r;
                        return (
                          <g key={o.id} className="cursor-pointer" onClick={() => setSelected(o)}>
                            <circle cx={cx} cy={cy} r="14" fill={o.color + '22'} stroke={selected?.id === o.id ? o.color : o.color + '55'} strokeWidth={selected?.id === o.id ? 2 : 1} />
                            <text x={cx} y={cy + 1} textAnchor="middle" fontSize="11" dominantBaseline="central">{o.emoji}</text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {animalOrganelles.map(o => (
                      <button key={o.id} onClick={() => setSelected(o)}
                        className={`text-[9px] px-1.5 py-0.5 rounded-full transition-all ${selected?.id === o.id ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-gray-800 text-gray-500 hover:text-white'}`}>
                        {o.emoji} {o.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Plant Cell */}
                <div className="bg-gradient-to-br from-green-950/30 to-gray-900 rounded-2xl border border-green-500/20 p-4">
                  <h3 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">🌱 Plant Cell <span className="text-[10px] text-gray-500 font-normal">({plantOrganelles.length} organelles)</span></h3>
                  <div className="relative aspect-square rounded-xl bg-green-950/20 border border-green-500/10 overflow-hidden mb-3">
                    {/* Cell shape - rectangular */}
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      <rect x="15" y="15" width="170" height="170" rx="8" fill="#05200a11" stroke="#22c55e" strokeWidth="2.5" />
                      <rect x="20" y="20" width="160" height="160" rx="5" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.3" />
                      {/* Central vacuole */}
                      <rect x="50" y="50" width="100" height="100" rx="10" fill="#0ea5e908" stroke="#0ea5e933" strokeWidth="1" />
                      {plantOrganelles.map((o, i) => {
                        const angle = (i / plantOrganelles.length) * Math.PI * 2 - Math.PI / 2;
                        const r = 35 + (i % 3) * 15;
                        const cx = 100 + Math.cos(angle) * r;
                        const cy = 100 + Math.sin(angle) * r;
                        return (
                          <g key={o.id} className="cursor-pointer" onClick={() => setSelected(o)}>
                            <circle cx={cx} cy={cy} r="14" fill={o.color + '22'} stroke={selected?.id === o.id ? o.color : o.color + '55'} strokeWidth={selected?.id === o.id ? 2 : 1} />
                            <text x={cx} y={cy + 1} textAnchor="middle" fontSize="11" dominantBaseline="central">{o.emoji}</text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {plantOrganelles.map(o => (
                      <button key={o.id} onClick={() => setSelected(o)}
                        className={`text-[9px] px-1.5 py-0.5 rounded-full transition-all ${selected?.id === o.id ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-800 text-gray-500 hover:text-white'}`}>
                        {o.emoji} {o.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Single cell view */
              <div className={`bg-gradient-to-br ${viewMode === 'animal' ? 'from-blue-950/30' : 'from-green-950/30'} to-gray-900 rounded-2xl border ${viewMode === 'animal' ? 'border-blue-500/20' : 'border-green-500/20'} p-5`}>
                <h3 className={`text-lg font-bold ${viewMode === 'animal' ? 'text-blue-400' : 'text-green-400'} mb-4`}>
                  {viewMode === 'animal' ? '🐾 Animal Cell' : '🌱 Plant Cell'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(viewMode === 'animal' ? animalOrganelles : plantOrganelles).map(o => (
                    <button key={o.id} onClick={() => setSelected(o)}
                      className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left ${selected?.id === o.id ? `${viewMode === 'animal' ? 'border-blue-500/50 bg-blue-500/10' : 'border-green-500/50 bg-green-500/10'}` : 'border-gray-800 bg-gray-800/30 hover:bg-gray-800/60'}`}>
                      <span className="text-2xl">{o.emoji}</span>
                      <div>
                        <div className="text-xs font-bold text-white">{o.name}</div>
                        <div className="text-[9px] text-gray-500">{o.animal && o.plant ? 'Both cells' : o.plant ? 'Plant only' : 'Animal only'}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Differences summary */}
            <div className="mt-4 bg-gray-900 rounded-xl border border-gray-800 p-4">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-emerald-400" /> Key Differences
              </h4>
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                <div className="bg-blue-500/10 rounded-lg p-2 border border-blue-500/20">
                  <div className="text-blue-400 font-bold mb-1">🐾 Animal Only ({animalOnly.length})</div>
                  {animalOnly.map(o => <div key={o.id} className="text-gray-300">{o.emoji} {o.name}</div>)}
                </div>
                <div className="bg-emerald-500/10 rounded-lg p-2 border border-emerald-500/20">
                  <div className="text-emerald-400 font-bold mb-1">🤝 Both ({sharedOrganelles.length})</div>
                  {sharedOrganelles.map(o => <div key={o.id} className="text-gray-300">{o.emoji} {o.name}</div>)}
                </div>
                <div className="bg-green-500/10 rounded-lg p-2 border border-green-500/20">
                  <div className="text-green-400 font-bold mb-1">🌱 Plant Only ({plantOnly.length})</div>
                  {plantOnly.map(o => <div key={o.id} className="text-gray-300">{o.emoji} {o.name}</div>)}
                </div>
              </div>
            </div>
          </div>

          {/* Info panel */}
          <div>
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div key={selected.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  className="bg-gray-900 rounded-2xl border border-gray-800 p-5 sticky top-16">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 min-h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: selected.color + '22', border: `2px solid ${selected.color}` }}>
                      {selected.emoji}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{selected.name}</h3>
                      <div className="flex gap-1 mt-0.5">
                        {selected.animal && <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full">🐾 Animal</span>}
                        {selected.plant && <span className="text-[9px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">🌱 Plant</span>}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed mb-3">{selected.description}</p>

                  {selected.process && showProcesses && (
                    <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
                      <div className="text-[10px] text-emerald-400 font-bold mb-1">⚙️ Key Process</div>
                      <div className="text-xs text-gray-300 font-mono">{selected.process}</div>
                    </div>
                  )}

                  {showProcesses && <ProcessAnimation organelleId={selected.id} />}

                  <div className="bg-purple-500/10 rounded-lg p-3 mt-3 border border-purple-500/20">
                    <div className="text-[10px] text-purple-400 font-bold flex items-center gap-1 mb-0.5"><Info className="w-3 h-3" /> Fun Fact</div>
                    <p className="text-xs text-gray-300 italic">{selected.funFact}</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-gray-900 rounded-2xl border border-gray-800 p-5 text-center sticky top-16">
                  <div className="text-5xl mb-3">🔬</div>
                  <h3 className="text-lg font-bold text-white mb-2">Select an Organelle</h3>
                  <p className="text-sm text-gray-400">Click any organelle to learn about its structure, function, and processes!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
