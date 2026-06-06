import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

interface CycleNode {
  id: string;
  name: string;
  emoji: string;
  x: number;
  y: number;
  color: string;
  description: string;
  carbonForm: string;
  details: string[];
}

interface CycleFlow {
  from: string;
  to: string;
  process: string;
  emoji: string;
  description: string;
}

const nodes: CycleNode[] = [
  { id: 'atmosphere', name: 'Atmosphere', emoji: '☁️', x: 50, y: 8, color: '#60a5fa',
    description: 'CO₂ in the atmosphere acts as a greenhouse gas, trapping heat. Currently ~420 ppm and rising.',
    carbonForm: 'CO₂ (carbon dioxide gas)', details: ['Contains ~870 gigatons of carbon', 'CO₂ concentration: ~420 ppm', 'Rising ~2 ppm per year', 'Key greenhouse gas'] },
  { id: 'plants', name: 'Plants & Trees', emoji: '🌿', x: 20, y: 35, color: '#22c55e',
    description: 'Plants absorb CO₂ through photosynthesis, converting it into glucose (organic carbon). They are major carbon sinks.',
    carbonForm: 'Glucose (C₆H₁₂O₆)', details: ['Absorb ~120 Gt carbon/year', 'Photosynthesis: CO₂ + H₂O → Glucose + O₂', 'Store carbon in wood, leaves, roots', 'Forests are critical carbon sinks'] },
  { id: 'animals', name: 'Animals', emoji: '🐾', x: 50, y: 40, color: '#f59e0b',
    description: 'Animals obtain carbon by eating plants or other animals. They release CO₂ through cellular respiration.',
    carbonForm: 'Organic compounds (proteins, fats, carbs)', details: ['Obtain carbon by eating', 'Release CO₂ through respiration', 'Carbon in body tissues', 'Part of food chains/webs'] },
  { id: 'ocean', name: 'Oceans', emoji: '🌊', x: 80, y: 35, color: '#3b82f6',
    description: 'Oceans absorb ~25% of human CO₂ emissions. Carbon exists as dissolved CO₂, carbonate ions, and in marine organisms.',
    carbonForm: 'Dissolved CO₂, carbonates, organic C', details: ['Contain ~38,000 Gt carbon', 'Absorb ~2.5 Gt CO₂/year', 'Ocean acidification is a major concern', 'Phytoplankton photosynthesis'] },
  { id: 'soil', name: 'Soil & Decomposers', emoji: '🪱', x: 20, y: 65, color: '#92400e',
    description: 'Soil holds twice as much carbon as the atmosphere. Decomposers break down dead matter, releasing CO₂ and nutrients.',
    carbonForm: 'Organic matter, humus', details: ['Contains ~1,500 Gt carbon', 'Decomposers release CO₂', 'Dead organisms → nutrients', 'Important carbon reservoir'] },
  { id: 'fossil', name: 'Fossil Fuels', emoji: '⛽', x: 50, y: 75, color: '#6b7280',
    description: 'Ancient organic matter buried and compressed over millions of years. Burning them releases stored carbon as CO₂.',
    carbonForm: 'Coal, oil, natural gas (hydrocarbons)', details: ['Formed over millions of years', 'Burning releases ancient carbon', '~9.5 Gt carbon/year from burning', 'Main cause of climate change'] },
  { id: 'volcanoes', name: 'Volcanoes', emoji: '🌋', x: 80, y: 68, color: '#ef4444',
    description: 'Volcanic eruptions release CO₂ from Earth\'s interior. A natural but relatively small source of atmospheric CO₂.',
    carbonForm: 'CO₂ gas from Earth\'s interior', details: ['Release ~0.3 Gt CO₂/year', 'Natural part of cycle', 'Much less than human emissions', 'Long-term geological recycling'] },
];

const flows: CycleFlow[] = [
  { from: 'atmosphere', to: 'plants', process: 'Photosynthesis', emoji: '☀️', description: 'Plants absorb CO₂ and use sunlight to create glucose + O₂' },
  { from: 'atmosphere', to: 'ocean', process: 'Ocean Absorption', emoji: '💨', description: 'CO₂ dissolves into ocean surface waters' },
  { from: 'plants', to: 'atmosphere', process: 'Plant Respiration', emoji: '🌬️', description: 'Plants also respire, releasing some CO₂ back' },
  { from: 'plants', to: 'animals', process: 'Consumption', emoji: '🍽️', description: 'Animals eat plants, acquiring carbon compounds' },
  { from: 'plants', to: 'soil', process: 'Decomposition', emoji: '🍂', description: 'Dead plant matter falls to soil, broken down by decomposers' },
  { from: 'animals', to: 'atmosphere', process: 'Animal Respiration', emoji: '😤', description: 'Animals exhale CO₂ as waste product of respiration' },
  { from: 'animals', to: 'soil', process: 'Death & Decay', emoji: '💀', description: 'Dead animals are decomposed, returning carbon to soil' },
  { from: 'soil', to: 'atmosphere', process: 'Decomposer Respiration', emoji: '🦠', description: 'Bacteria and fungi release CO₂ as they break down matter' },
  { from: 'soil', to: 'fossil', process: 'Burial (millions of years)', emoji: '⏳', description: 'Over geological time, some organic matter becomes fossil fuels' },
  { from: 'fossil', to: 'atmosphere', process: 'Combustion 🏭', emoji: '🔥', description: 'Burning fossil fuels releases stored carbon as CO₂ (human activity)' },
  { from: 'volcanoes', to: 'atmosphere', process: 'Eruptions', emoji: '💥', description: 'Volcanic activity releases CO₂ from deep within the Earth' },
  { from: 'ocean', to: 'atmosphere', process: 'Outgassing', emoji: '🫧', description: 'Warm ocean waters release dissolved CO₂ back to atmosphere' },
];

const co2Particles = Array.from({ length: 8 }, (_, i) => ({
  left: `${15 + ((i * 23) % 70)}%`,
  top: `${5 + ((i * 11) % 20)}%`,
  duration: 3 + ((i * 7) % 30) / 10,
  delay: ((i * 5) % 30) / 10,
}));

export default function CarbonCycle() {
  const [selectedNode, setSelectedNode] = useState<CycleNode | null>(null);
  const [selectedFlow, setSelectedFlow] = useState<CycleFlow | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">♻️ Carbon Cycle</h2>
          <p className="text-gray-400 text-lg">How carbon moves through atmosphere, land, ocean, and life</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Interactive Diagram */}
          <div className="lg:col-span-3">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-emerald-500/20 bg-gradient-to-b from-sky-950/50 via-green-950/30 to-amber-950/40">
              {/* Background layers */}
              <div className="absolute top-0 left-0 right-0 h-[25%] bg-gradient-to-b from-sky-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-t from-amber-900/20 to-transparent" />

              {/* Flow arrows (animated) */}
              {flows.map((flow, i) => {
                const fromNode = nodes.find(n => n.id === flow.from)!;
                const toNode = nodes.find(n => n.id === flow.to)!;
                const isHumanCause = flow.process.includes('Combustion');
                return (
                  <motion.div key={i}
                    className="absolute cursor-pointer z-10"
                    style={{
                      left: `${(fromNode.x + toNode.x) / 2}%`,
                      top: `${(fromNode.y + toNode.y) / 2}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    whileHover={{ scale: 1.3 }}
                    onClick={() => { setSelectedFlow(flow); setSelectedNode(null); }}
                  >
                    <motion.div
                      className={`text-sm px-1.5 py-0.5 rounded-full ${isHumanCause ? 'bg-red-500/30 border border-red-500/50' : 'bg-gray-800/80 border border-gray-700/50'}`}
                      animate={isHumanCause ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      {flow.emoji}
                    </motion.div>
                  </motion.div>
                );
              })}

              {/* Nodes */}
              {nodes.map(node => {
                const isActive = hovered === node.id || selectedNode?.id === node.id;
                return (
                  <motion.button key={node.id}
                    className="absolute z-20 flex flex-col items-center cursor-pointer"
                    style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => setHovered(node.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => { setSelectedNode(node); setSelectedFlow(null); }}
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl transition-all ${isActive ? 'ring-2' : ''}`}
                      style={{ backgroundColor: node.color + '22', border: `2px solid ${isActive ? node.color : node.color + '55'}`, boxShadow: isActive ? `0 0 20px ${node.color}33` : 'none'}}>
                      {node.emoji}
                    </div>
                    <span className={`text-[9px] font-bold mt-1 px-1.5 py-0.5 rounded ${isActive ? 'bg-gray-900 text-white' : 'text-gray-400'}`}>
                      {node.name}
                    </span>
                  </motion.button>
                );
              })}

              {/* CO₂ particles */}
              {co2Particles.map((particle, i) => (
                <motion.div key={i}
                  className="absolute text-sm text-blue-300/30 font-mono pointer-events-none"
                  style={{ left: particle.left, top: particle.top }}
                  animate={{ y: [-5, 5, -5], x: [-3, 3, -3], opacity: [0.15, 0.35, 0.15] }}
                  transition={{ repeat: Infinity, duration: particle.duration, delay: particle.delay }}>
                  CO₂
                </motion.div>
              ))}
            </div>

            {/* Flow list */}
            <div className="mt-4 bg-gray-900 rounded-xl border border-gray-800 p-4 max-h-[220px] overflow-y-auto">
              <h4 className="text-sm font-bold text-white mb-2">🔄 Carbon Flows (click to learn)</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {flows.map((f, i) => {
                  const isHuman = f.process.includes('Combustion');
                  return (
                    <button key={i} onClick={() => { setSelectedFlow(f); setSelectedNode(null); }}
                      className={`text-left px-2 py-1.5 rounded-lg text-sm transition-all ${selectedFlow === f ? 'bg-emerald-500/20 border border-emerald-500/30' : isHuman ? 'bg-red-500/10 border border-red-500/20 hover:bg-red-500/20' : 'bg-gray-800/50 border border-transparent hover:bg-gray-800'}`}>
                      <span className="mr-1">{f.emoji}</span>
                      <span className="text-gray-300">{f.process}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div key={`node-${selectedNode.id}`}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: selectedNode.color + '22', border: `2px solid ${selectedNode.color}` }}>
                      {selectedNode.emoji}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{selectedNode.name}</h3>
                      <div className="text-sm font-mono text-gray-500">{selectedNode.carbonForm}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed mb-3">{selectedNode.description}</p>
                  <ul className="space-y-1">
                    {selectedNode.details.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: selectedNode.color }} />{d}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ) : selectedFlow ? (
                <motion.div key={`flow-${selectedFlow.process}`}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
                  <div className="text-3xl mb-2">{selectedFlow.emoji}</div>
                  <h3 className="text-lg font-bold text-white mb-1">{selectedFlow.process}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <span>{nodes.find(n => n.id === selectedFlow.from)?.emoji} {nodes.find(n => n.id === selectedFlow.from)?.name}</span>
                    <span>→</span>
                    <span>{nodes.find(n => n.id === selectedFlow.to)?.emoji} {nodes.find(n => n.id === selectedFlow.to)?.name}</span>
                  </div>
                  <p className="text-sm text-gray-300">{selectedFlow.description}</p>
                  {selectedFlow.process.includes('Combustion') && (
                    <div className="mt-3 bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                      <div className="text-sm text-orange-400 font-bold">⚠️ Human Impact</div>
                      <p className="text-sm text-gray-300 mt-1">This is the primary driver of climate change. We burn fossil fuels at ~9.5 Gt carbon/year, far exceeding natural carbon cycling.</p>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-gray-900 rounded-2xl border border-gray-800 p-5 text-center">
                  <div className="text-5xl mb-3">♻️</div>
                  <h3 className="text-lg font-bold text-white mb-2">Explore the Cycle</h3>
                  <p className="text-sm text-gray-400">Click on any reservoir (node) or flow arrow to learn how carbon moves through the Earth system.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Key numbers */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-400" /> Carbon Budget
              </h4>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'Atmosphere', value: '870 Gt', color: '#60a5fa' },
                  { label: 'Oceans', value: '38,000 Gt', color: '#3b82f6' },
                  { label: 'Soil', value: '1,500 Gt', color: '#92400e' },
                  { label: 'Fossil Fuels', value: '10,000 Gt', color: '#6b7280' },
                  { label: 'Living Biomass', value: '550 Gt', color: '#22c55e' },
                  { label: 'Human Emissions/yr', value: '~9.5 Gt ⚠️', color: '#ef4444' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-400 flex-1">{item.label}</span>
                    <span className="font-bold text-gray-300">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
