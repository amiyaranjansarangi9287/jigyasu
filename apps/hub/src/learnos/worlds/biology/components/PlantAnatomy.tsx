import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';
import { Trans, useTranslation } from "react-i18next";
import ChallengeOverlay, { ChallengeData } from '../../../shared/ui/ChallengeOverlay';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

interface PlantPart {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  structures: { name: string; function: string }[];
  funFact: string;
}

const sections = [
  { id: 'flower', label: '🌸 Flower', desc: 'Reproductive organ' },
  { id: 'leaf', label: '🍃 Leaf', desc: 'Photosynthesis factory' },
  { id: 'stem', label: '🌿 Stem', desc: 'Transport highway' },
  { id: 'root', label: '🌱 Root', desc: 'Anchor & absorb' },
];

const parts: Record<string, PlantPart> = {
  flower: {
    id: 'flower', name: 'Flower', emoji: '🌸', color: '#ec4899',
    description: 'The reproductive organ of flowering plants (angiosperms). Flowers attract pollinators and produce seeds for the next generation.',
    structures: [
      { name: 'Petals', function: 'Colorful modified leaves that attract pollinators with color, scent, and nectar guides' },
      { name: 'Sepals', function: 'Green leaf-like structures that protect the flower bud before it opens' },
      { name: 'Stamen (♂)', function: 'Male part — anther produces pollen (containing sperm), filament supports it' },
      { name: 'Pistil/Carpel (♀)', function: 'Female part — stigma catches pollen, style connects to ovary, ovary contains ovules' },
      { name: 'Ovary', function: 'Contains ovules (eggs). After fertilization, becomes the fruit; ovules become seeds' },
      { name: 'Nectary', function: 'Produces sweet nectar to attract pollinators like bees and butterflies' },
    ],
    funFact: 'The world\'s largest flower (Rafflesia arnoldii) is 3 feet wide and smells like rotting meat to attract fly pollinators!',
  },
  leaf: {
    id: 'leaf', name: 'Leaf', emoji: '🍃', color: '#22c55e',
    description: 'The primary site of photosynthesis. Leaves are designed to maximize light absorption and gas exchange while minimizing water loss.',
    structures: [
      { name: 'Cuticle', function: 'Waxy waterproof layer on top surface — prevents water loss' },
      { name: 'Upper Epidermis', function: 'Transparent protective layer — lets light through to photosynthetic cells' },
      { name: 'Palisade Mesophyll', function: 'Tightly packed cells FULL of chloroplasts — main photosynthesis site' },
      { name: 'Spongy Mesophyll', function: 'Loosely packed with air spaces for gas exchange (CO₂, O₂)' },
      { name: 'Stomata (Guard Cells)', function: 'Tiny pores on lower surface — open/close to control gas exchange and water loss' },
      { name: 'Vascular Bundle (Veins)', function: 'Xylem brings water up, phloem carries sugars down — the leaf\'s plumbing' },
    ],
    funFact: 'A single large oak tree can have 200,000 leaves with a combined surface area of 1/2 acre! Fall colors appear when chlorophyll breaks down.',
  },
  stem: {
    id: 'stem', name: 'Stem', emoji: '🌿', color: '#10b981',
    description: 'The plant\'s transport highway and structural support. Contains two types of vascular tissue running in bundles throughout.',
    structures: [
      { name: 'Epidermis', function: 'Outer protective layer, may have a waxy cuticle in woody plants → bark' },
      { name: 'Xylem', function: 'Transports water & minerals UP from roots. Dead cells form hollow tubes. One-way only!' },
      { name: 'Phloem', function: 'Transports sugars (from photosynthesis) both UP and DOWN. Living cells (sieve tubes)' },
      { name: 'Cambium', function: 'Growth layer between xylem & phloem — produces new vascular tissue (secondary growth)' },
      { name: 'Cortex', function: 'Storage tissue between epidermis and vascular bundles, may store starch' },
      { name: 'Pith', function: 'Central storage tissue, may become hollow in older stems' },
    ],
    funFact: 'Xylem transports water using transpiration pull — no energy required! Water climbs 100+ meters in giant redwoods through capillary action and cohesion.',
  },
  root: {
    id: 'root', name: 'Root', emoji: '🌱', color: '#92400e',
    description: 'Anchors the plant and absorbs water and minerals from the soil. The root system can be as large as the above-ground plant!',
    structures: [
      { name: 'Root Cap', function: 'Protects the growing tip as it pushes through soil — constantly replaced' },
      { name: 'Root Hairs', function: 'Tiny extensions that massively increase surface area for water absorption' },
      { name: 'Epidermis', function: 'Outer layer of cells — root hairs are extensions of epidermal cells' },
      { name: 'Cortex', function: 'Storage tissue and pathway for water moving inward to the vascular cylinder' },
      { name: 'Endodermis (Casparian Strip)', function: 'Selective barrier forcing water through cells — controls what enters the xylem' },
      { name: 'Vascular Cylinder', function: 'Central core containing xylem and phloem — connects to stem vascular system' },
    ],
    funFact: 'A single rye plant can grow 14 billion root hairs with a total length of 6,200 miles! Mycorrhizal fungi extend roots by 100-1000x.',
  },
};

const rootHairs = Array.from({ length: 12 }, (_, i) => {
  const dir = i % 2 === 0 ? 1 : -1;
  const y = 120 + i * 16;
  return {
    y,
    dir,
    x2: 200 + dir * (50 + ((i * 7) % 30)),
    y2: y + ((i % 5) - 2) * 2,
  };
});

export default function PlantAnatomy() {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [showChallenge, setShowChallenge] = useState(true);

  const activeChallenge: ChallengeData = {
    title: t('learnos.biology.plant_anatomy_wonder', 'A Curious Question...'),
    prompt: t('learnos.biology.plant_anatomy_prompt', "Plants don't have hearts or lungs, so how do they drink water and breathe? Let's dissect a plant and see inside!"),
    options: [t('learnos.challenge.explore', "Let's explore and find out!")],
    onSuccess: () => {
      setShowChallenge(false);
      const updated = completeModule(progress, 'plant-anatomy', 60);
      setProgress(updated);
      saveProgress(updated);
    }
  };

  const [selectedSection, setSelectedSection] = useState('flower');
  const [highlightedStructure, setHighlightedStructure] = useState<number | null>(null);

  const part = parts[selectedSection];

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2"><Trans i18nKey="auto.plantanatomy.plant_anatomy">🌻 Plant Anatomy</Trans></h2>
          <p className="text-gray-400 text-lg"><Trans i18nKey="auto.plantanatomy.explore_the_structures_of_flow">Explore the structures of flowers, leaves, stems, and roots!</Trans></p>
        </motion.div>

        {/* Section selector */}
        <div className="flex justify-center gap-3 mb-6">
          {sections.map(s => (
            <button key={s.id} onClick={() => { setSelectedSection(s.id); setHighlightedStructure(null); }}
              className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${selectedSection === s.id ? 'bg-emerald-500 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
              <div className="text-2xl mb-0.5">{s.label.split(' ')[0]}</div>
              <div className="text-sm">{s.desc}</div>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={selectedSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Visualization */}
              <div className="rounded-2xl border-2 p-8 flex flex-col items-center justify-center min-h-[400px]"
                style={{ borderColor: part.color + '33', background: `linear-gradient(135deg, ${part.color}08, transparent)` }}>
                {/* Plant SVG cross-section */}
                <svg viewBox="0 0 400 400" className="w-full max-w-sm">
                  {selectedSection === 'flower' && (
                    <g>
                      {/* Stem */}
                      <rect x="192" y="280" width="16" height="120" fill="#22c55e" rx="4" opacity="0.6" />
                      {/* Sepals */}
                      {[-30, 30, -60, 60].map((angle, i) => (
                        <ellipse key={`sepal-${i}`} cx="200" cy="280" rx="20" ry="45" fill="#22c55e" opacity={highlightedStructure === 1 ? 0.8 : 0.3}
                          transform={`rotate(${angle}, 200, 280)`} className="cursor-pointer" onClick={() => setHighlightedStructure(1)} />
                      ))}
                      {/* Petals */}
                      {[0, 72, 144, 216, 288].map((angle, i) => (
                        <ellipse key={`petal-${i}`} cx="200" cy="210" rx="35" ry="65" fill={part.color} opacity={highlightedStructure === 0 ? 0.7 : 0.35}
                          transform={`rotate(${angle}, 200, 260)`} className="cursor-pointer" onClick={() => setHighlightedStructure(0)} />
                      ))}
                      {/* Pistil */}
                      <rect x="195" y="200" width="10" height="70" fill="#22c55e" rx="3" opacity={highlightedStructure === 3 ? 0.9 : 0.5}
                        className="cursor-pointer" onClick={() => setHighlightedStructure(3)} />
                      <circle cx="200" cy="195" r="10" fill="#22c55e" opacity={highlightedStructure === 3 ? 0.9 : 0.5}
                        className="cursor-pointer" onClick={() => setHighlightedStructure(3)} />
                      {/* Stamens */}
                      {[-25, 25, -15, 15].map((offset, i) => (
                        <g key={`stamen-${i}`} className="cursor-pointer" onClick={() => setHighlightedStructure(2)}>
                          <line x1={200 + offset} y1="270" x2={200 + offset * 1.8} y2="210" stroke="#f59e0b" strokeWidth="2" opacity={highlightedStructure === 2 ? 0.9 : 0.4} />
                          <circle cx={200 + offset * 1.8} cy="208" r="6" fill="#f59e0b" opacity={highlightedStructure === 2 ? 0.9 : 0.5} />
                        </g>
                      ))}
                      {/* Ovary */}
                      <ellipse cx="200" cy="280" rx="15" ry="10" fill="#a855f7" opacity={highlightedStructure === 4 ? 0.8 : 0.4}
                        className="cursor-pointer" onClick={() => setHighlightedStructure(4)} />
                    </g>
                  )}
                  {selectedSection === 'leaf' && (
                    <g>
                      {/* Leaf cross section layers */}
                      <rect x="40" y="80" width="320" height="15" rx="3" fill="#22c55e55" stroke="#22c55e" strokeWidth="1.5" className="cursor-pointer" onClick={() => setHighlightedStructure(0)} opacity={highlightedStructure === 0 ? 1 : 0.6} />
                      <text x="200" y="75" textAnchor="middle" fontSize="10" fill="#9ca3af"><Trans i18nKey="auto.plantanatomy.cuticle">Cuticle</Trans></text>
                      <rect x="40" y="100" width="320" height="20" rx="2" fill="#22c55e33" stroke="#22c55e88" strokeWidth="1" className="cursor-pointer" onClick={() => setHighlightedStructure(1)} opacity={highlightedStructure === 1 ? 1 : 0.6} />
                      <text x="370" y="115" fontSize="9" fill="#9ca3af"><Trans i18nKey="auto.plantanatomy.epidermis">Epidermis</Trans></text>
                      {/* Palisade */}
                      {Array.from({ length: 14 }).map((_, i) => (
                        <rect key={`pal-${i}`} x={50 + i * 23} y="125" width="14" height="70" rx="4" fill="#15803d55" stroke="#15803d88" strokeWidth="1"
                          className="cursor-pointer" onClick={() => setHighlightedStructure(2)} opacity={highlightedStructure === 2 ? 0.9 : 0.5} />
                      ))}
                      <text x="370" y="160" fontSize="9" fill="#9ca3af"><Trans i18nKey="auto.plantanatomy.palisade">Palisade</Trans></text>
                      {/* Spongy */}
                      {Array.from({ length: 18 }).map((_, i) => (
                        <ellipse key={`sp-${i}`} cx={55 + (i % 7) * 48} cy={215 + Math.floor(i / 7) * 25 + (i % 3) * 8} rx={12 + (i % 3) * 4} ry={8 + (i % 2) * 4}
                          fill="#86efac33" stroke="#86efac55" strokeWidth="0.8"
                          className="cursor-pointer" onClick={() => setHighlightedStructure(3)} opacity={highlightedStructure === 3 ? 0.9 : 0.5} />
                      ))}
                      <text x="370" y="230" fontSize="9" fill="#9ca3af"><Trans i18nKey="auto.plantanatomy.spongy">Spongy</Trans></text>
                      {/* Vascular bundle */}
                      <rect x="180" y="140" width="40" height="80" rx="5" fill="#dc262622" stroke="#dc2626" strokeWidth="1.5"
                        className="cursor-pointer" onClick={() => setHighlightedStructure(5)} opacity={highlightedStructure === 5 ? 1 : 0.6} />
                      {/* Lower epidermis */}
                      <rect x="40" y="270" width="320" height="15" rx="2" fill="#22c55e22" stroke="#22c55e66" strokeWidth="1"
                        className="cursor-pointer" onClick={() => setHighlightedStructure(4)} opacity={highlightedStructure === 4 ? 1 : 0.6} />
                      {/* Stomata */}
                      {[120, 280].map(sx => (
                        <g key={sx} className="cursor-pointer" onClick={() => setHighlightedStructure(4)}>
                          <ellipse cx={sx} cy="290" rx="8" ry="4" fill="none" stroke="#0ea5e9" strokeWidth="1.5" opacity={highlightedStructure === 4 ? 1 : 0.5} />
                        </g>
                      ))}
                      <text x="200" y="310" textAnchor="middle" fontSize="9" fill="#0ea5e9"><Trans i18nKey="auto.plantanatomy.stomata">Stomata</Trans></text>
                    </g>
                  )}
                  {selectedSection === 'stem' && (
                    <g>
                      <circle cx="200" cy="200" r="150" fill="#22c55e11" stroke="#22c55e" strokeWidth="2" className="cursor-pointer" onClick={() => setHighlightedStructure(0)} opacity={highlightedStructure === 0 ? 1 : 0.5} />
                      <text x="200" y="55" textAnchor="middle" fontSize="10" fill="#9ca3af"><Trans i18nKey="auto.plantanatomy.epidermis">Epidermis</Trans></text>
                      <circle cx="200" cy="200" r="120" fill="#86efac11" stroke="#86efac55" strokeWidth="1" className="cursor-pointer" onClick={() => setHighlightedStructure(4)} opacity={highlightedStructure === 4 ? 1 : 0.4} />
                      <text x="330" y="200" fontSize="9" fill="#9ca3af"><Trans i18nKey="auto.plantanatomy.cortex">Cortex</Trans></text>
                      {/* Vascular bundles */}
                      {[0, 60, 120, 180, 240, 300].map(angle => {
                        const r = 80;
                        const cx = 200 + Math.cos((angle * Math.PI) / 180) * r;
                        const cy = 200 + Math.sin((angle * Math.PI) / 180) * r;
                        return (
                          <g key={angle}>
                            <circle cx={cx} cy={cy} r="18" fill="#3b82f622" stroke="#3b82f6" strokeWidth="1.5"
                              className="cursor-pointer" onClick={() => setHighlightedStructure(1)} opacity={highlightedStructure === 1 ? 1 : 0.5} />
                            <circle cx={cx - 5} cy={cy} r="6" fill="#ef444444" className="cursor-pointer" onClick={() => setHighlightedStructure(2)} opacity={highlightedStructure === 2 ? 1 : 0.5} />
                            <circle cx={cx + 5} cy={cy} r="5" fill="#22c55e44" className="cursor-pointer" onClick={() => setHighlightedStructure(3)} opacity={highlightedStructure === 3 ? 1 : 0.5} />
                          </g>
                        );
                      })}
                      <circle cx="200" cy="200" r="30" fill="#f5f5f511" stroke="#a3a3a333" strokeWidth="1" className="cursor-pointer" onClick={() => setHighlightedStructure(5)} />
                      <text x="200" y="205" textAnchor="middle" fontSize="9" fill="#9ca3af"><Trans i18nKey="auto.plantanatomy.pith">Pith</Trans></text>
                    </g>
                  )}
                  {selectedSection === 'root' && (
                    <g>
                      <rect x="175" y="20" width="50" height="320" rx="20" fill="#92400e22" stroke="#92400e" strokeWidth="2" />
                      {/* Root hairs */}
                      {rootHairs.map((hair, i) => {
                        return (
                          <line key={i} x1={200 + hair.dir * 25} y1={hair.y} x2={hair.x2} y2={hair.y2}
                            stroke="#92400e" strokeWidth="1" opacity={highlightedStructure === 1 ? 0.8 : 0.3}
                            className="cursor-pointer" onClick={() => setHighlightedStructure(1)} />
                        );
                      })}
                      <text x="310" y="180" fontSize="9" fill="#9ca3af"><Trans i18nKey="auto.plantanatomy.root_hairs">Root Hairs</Trans></text>
                      {/* Root cap */}
                      <ellipse cx="200" cy="345" rx="28" ry="15" fill="#92400e44" stroke="#92400e" strokeWidth="1.5"
                        className="cursor-pointer" onClick={() => setHighlightedStructure(0)} opacity={highlightedStructure === 0 ? 0.9 : 0.4} />
                      <text x="200" y="375" textAnchor="middle" fontSize="9" fill="#9ca3af"><Trans i18nKey="auto.plantanatomy.root_cap">Root Cap</Trans></text>
                      {/* Vascular core */}
                      <rect x="192" y="60" width="16" height="260" rx="5" fill="#3b82f622" stroke="#3b82f6" strokeWidth="1"
                        className="cursor-pointer" onClick={() => setHighlightedStructure(5)} opacity={highlightedStructure === 5 ? 0.8 : 0.3} />
                    </g>
                  )}
                </svg>
              </div>

              {/* Info Panel */}
              <div className="space-y-4">
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-4xl">{part.emoji}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{part.name}</h3>
                      <div className="text-sm text-gray-500"><Trans i18nKey="auto.plantanatomy.click_structures_in_the_diagra">Click structures in the diagram to highlight</Trans></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed mb-4">{part.description}</p>

                  <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider"><Trans i18nKey="auto.plantanatomy.internal_structures">Internal Structures</Trans></h4>
                  <div className="space-y-2">
                    {part.structures.map((s, i) => (
                      <motion.button key={i}
                        onClick={() => setHighlightedStructure(highlightedStructure === i ? null : i)}
                        className={`w-full text-left p-2.5 rounded-xl transition-all text-sm ${highlightedStructure === i ? 'bg-emerald-500/15 border border-emerald-500/30' : 'bg-gray-800/50 border border-transparent hover:bg-gray-800'}`}>
                        <div className="font-bold text-white mb-0.5 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: part.color }} />{s.name}
                        </div>
                        <div className="text-gray-400 pl-3.5">{s.function}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-xl p-4 border border-green-500/20">
                  <div className="flex items-center gap-1.5 text-green-400 font-bold text-sm mb-1">
                    <Info className="w-3 h-3" /> <Trans i18nKey="auto.plantanatomy.fun_fact">Fun Fact</Trans>
                                                        </div>
                  <p className="text-sm text-gray-300 italic">{part.funFact}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
