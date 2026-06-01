import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Info } from 'lucide-react';

interface BrainRegion {
  id: string;
  name: string;
  emoji: string;
  color: string;
  x: number;
  y: number;
  w: number;
  h: number;
  description: string;
  functions: string[];
  funFact: string;
  damage: string;
}

const regions: BrainRegion[] = [
  { id: 'frontal', name: 'Frontal Lobe', emoji: '🧠', color: '#ef4444', x: 8, y: 10, w: 30, h: 35,
    description: 'The CEO of the brain. Responsible for personality, decision-making, planning, and voluntary movement. It\'s what makes you "you".',
    functions: ['Decision-making & planning', 'Personality & behavior', 'Motor control (voluntary movement)', 'Speech production (Broca\'s area)', 'Working memory & concentration'],
    funFact: 'The frontal lobe doesn\'t fully develop until age 25! This is why teenagers tend to be more impulsive.',
    damage: 'Personality changes, difficulty planning, loss of motor function, speech problems' },
  { id: 'parietal', name: 'Parietal Lobe', emoji: '✋', color: '#f59e0b', x: 35, y: 5, w: 28, h: 30,
    description: 'The sensory processing hub. Integrates touch, temperature, pressure, and pain, and helps you understand spatial relationships.',
    functions: ['Sensory processing (touch, pain, heat)', 'Spatial awareness & navigation', 'Body position sense (proprioception)', 'Mathematical processing', 'Object manipulation'],
    funFact: 'Your parietal lobe creates a "body map" of where all your parts are, even with your eyes closed!',
    damage: 'Numbness, difficulty with spatial awareness, inability to recognize objects by touch' },
  { id: 'temporal', name: 'Temporal Lobe', emoji: '👂', color: '#3b82f6', x: 10, y: 48, w: 30, h: 28,
    description: 'Home to hearing, language comprehension, and memory formation. Contains the hippocampus for memory and amygdala for emotions.',
    functions: ['Hearing & audio processing', 'Language comprehension (Wernicke\'s area)', 'Memory formation (hippocampus)', 'Emotional processing (amygdala)', 'Face recognition'],
    funFact: 'The hippocampus is named after a seahorse because of its shape! London taxi drivers have larger hippocampi from memorizing city maps.',
    damage: 'Hearing problems, difficulty understanding speech, memory loss, emotional instability' },
  { id: 'occipital', name: 'Occipital Lobe', emoji: '👁️', color: '#8b5cf6', x: 65, y: 20, w: 22, h: 30,
    description: 'The visual processing center. Receives raw visual data from the eyes and transforms it into recognizable images, shapes, and colors.',
    functions: ['Visual processing & interpretation', 'Color perception', 'Shape & motion detection', 'Visual memory', 'Depth perception & spatial analysis'],
    funFact: 'Your brain flips the image from your eyes right-side-up! The image hits your retina upside-down.',
    damage: 'Blindness, visual hallucinations, inability to recognize faces or objects, color blindness' },
  { id: 'cerebellum', name: 'Cerebellum', emoji: '🎯', color: '#10b981', x: 62, y: 55, w: 25, h: 25,
    description: '"Little brain" — coordinates all voluntary movements, balance, posture, and motor learning. Contains more neurons than the rest of the brain combined!',
    functions: ['Balance & posture', 'Coordination of movement', 'Motor learning (riding a bike)', 'Fine motor skills', 'Timing & rhythm'],
    funFact: 'The cerebellum has ~69 billion neurons — more than the rest of the brain combined! It\'s only 10% of brain volume.',
    damage: 'Loss of coordination (ataxia), tremors, difficulty with balance, slurred speech' },
  { id: 'brainstem', name: 'Brain Stem', emoji: '💓', color: '#ec4899', x: 45, y: 65, w: 18, h: 28,
    description: 'The bridge between brain and spinal cord. Controls vital automatic functions like breathing, heartbeat, and sleep cycles. Damage is often fatal.',
    functions: ['Breathing regulation', 'Heart rate control', 'Blood pressure regulation', 'Sleep/wake cycles', 'Reflexes (sneezing, swallowing)'],
    funFact: 'Your brainstem keeps you alive by controlling breathing and heartbeat — functions you don\'t consciously think about!',
    damage: 'Can be life-threatening — affects breathing, consciousness, and vital functions' },
  { id: 'hypothalamus', name: 'Hypothalamus', emoji: '🌡️', color: '#f97316', x: 38, y: 48, w: 14, h: 15,
    description: 'The master regulator. Despite being only pea-sized, it controls body temperature, hunger, thirst, sleep, hormones, and the endocrine system.',
    functions: ['Body temperature regulation', 'Hunger & thirst signals', 'Hormone control (pituitary gland)', 'Sleep-wake cycles (circadian rhythm)', 'Emotional responses'],
    funFact: 'The hypothalamus is only about the size of an almond but controls most of your body\'s automatic functions!',
    damage: 'Hormonal imbalances, temperature dysregulation, sleep disorders, appetite problems' },
  { id: 'corpus', name: 'Corpus Callosum', emoji: '🌉', color: '#64748b', x: 30, y: 35, w: 30, h: 10,
    description: 'The bridge between hemispheres. A thick bundle of ~200 million nerve fibers connecting left and right brain, enabling them to communicate.',
    functions: ['Connects left & right hemispheres', 'Transfers sensory & motor info', 'Coordinates bilateral movement', 'Integrates emotional & cognitive processing', '~200 million nerve fibers'],
    funFact: 'When the corpus callosum is severed (split-brain), each hemisphere operates independently — leading to bizarre split-brain phenomena!',
    damage: 'Split-brain syndrome — hemispheres cannot communicate, each may have independent thoughts' },
];

const neuronFacts = [
  { title: 'Neuron Speed', value: '268 mph', detail: 'Signals travel at up to 268 mph along myelinated neurons' },
  { title: 'Total Neurons', value: '86 billion', detail: 'The average brain contains ~86 billion neurons' },
  { title: 'Synapses', value: '100 trillion', detail: 'Each neuron connects to ~7,000 others' },
  { title: 'Energy Use', value: '20%', detail: 'Brain uses 20% of body\'s energy despite being only 2% of weight' },
  { title: 'Water Content', value: '73%', detail: 'Your brain is about 73% water' },
  { title: 'Length of Vessels', value: '100K miles', detail: 'Blood vessels in the brain stretch over 100,000 miles' },
];

const neuralParticles = Array.from({ length: 35 }, (_, i) => ({
  left: `${8 + ((i * 17) % 84)}%`,
  top: `${8 + ((i * 29) % 84)}%`,
  size: 2 + ((i * 7) % 20) / 10,
  duration: 2 + ((i * 11) % 40) / 10,
  delay: ((i * 13) % 30) / 10,
}));

const synapticSparks = Array.from({ length: 5 }, (_, i) => ({
  left: `${20 + ((i * 23) % 60)}%`,
  top: `${15 + ((i * 31) % 65)}%`,
  duration: 0.8 + ((i * 9) % 15) / 10,
  delay: i * 1.2,
  repeatDelay: 2 + ((i * 7) % 30) / 10,
}));

export default function BrainExplorer() {
  const [selected, setSelected] = useState<BrainRegion | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [showNeuronAnim] = useState(true);

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">🧠 Brain Explorer</h2>
          <p className="text-gray-400 text-lg">Click on any brain region to discover its functions!</p>
        </motion.div>

        {/* Neuron facts ticker */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {neuronFacts.map(f => (
            <div key={f.title} className="shrink-0 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 min-w-[150px]">
              <div className="text-sm text-gray-500 uppercase font-bold">{f.title}</div>
              <div className="text-lg font-black text-emerald-400">{f.value}</div>
              <div className="text-sm text-gray-500">{f.detail}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Brain Map */}
          <div className="lg:col-span-3">
            <div className="relative w-full aspect-[4/3] max-w-[600px] mx-auto rounded-2xl overflow-hidden border-2 border-purple-500/20 bg-gradient-to-br from-indigo-950 via-gray-900 to-purple-950">
              {/* Neural network background */}
              {showNeuronAnim && neuralParticles.map((particle, i) => (
                <motion.div key={i}
                  className="absolute rounded-full bg-purple-400/10"
                  style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size }}
                  animate={{ opacity: [0.05, 0.3, 0.05], scale: [1, 2, 1] }}
                  transition={{ repeat: Infinity, duration: particle.duration, delay: particle.delay }}
                />
              ))}

              {/* Synaptic sparks */}
              {showNeuronAnim && synapticSparks.map((spark, i) => (
                <motion.div key={`spark-${i}`}
                  className="absolute w-1 h-1 rounded-full bg-yellow-400"
                  style={{ left: spark.left, top: spark.top }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                  transition={{ repeat: Infinity, duration: spark.duration, delay: spark.delay, repeatDelay: spark.repeatDelay }}
                />
              ))}

              {/* Brain regions (clickable) */}
              {regions.map(r => {
                const isActive = hovered === r.id || selected?.id === r.id;
                return (
                  <motion.button key={r.id}
                    className="absolute rounded-xl cursor-pointer z-10 flex flex-col items-center justify-center text-center"
                    style={{
                      left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%`,
                      backgroundColor: isActive ? `${r.color}33` : `${r.color}11`,
                      border: `2px solid ${isActive ? r.color : r.color + '44'}`,
                      boxShadow: isActive ? `0 0 25px ${r.color}33, inset 0 0 15px ${r.color}11` : 'none',
                    }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onMouseEnter={() => setHovered(r.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => setSelected(r)}
                  >
                    <span className="text-lg md:text-xl">{r.emoji}</span>
                    <span className="text-[8px] md:text-sm font-bold text-white/80 mt-0.5 leading-tight px-1">{r.name}</span>
                  </motion.button>
                );
              })}

              {/* Hover tooltip */}
              <AnimatePresence>
                {hovered && !selected && (
                  <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur px-4 py-2 rounded-xl border border-purple-500/30 z-20 pointer-events-none">
                    <div className="flex items-center gap-2 text-sm text-white">
                      <Zap className="w-4 h-4 text-purple-400" />
                      Click to explore <strong>{regions.find(r => r.id === hovered)?.name}</strong>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Region buttons below */}
            <div className="flex flex-wrap justify-center gap-1.5 mt-4">
              {regions.map(r => (
                <button key={r.id} onClick={() => setSelected(r)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border ${
                    selected?.id === r.id
                      ? 'text-white' : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:text-white'
                  }`}
                  style={selected?.id === r.id ? { backgroundColor: r.color + '44', borderColor: r.color } : {}}>
                  {r.emoji} {r.name}
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
                  className="bg-gray-900 rounded-2xl border border-gray-800 p-5 sticky top-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: selected.color + '22', border: `2px solid ${selected.color}` }}>
                      {selected.emoji}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{selected.name}</h3>
                    </div>
                  </div>
                  <div className="w-14 h-1 rounded-full mb-3" style={{ backgroundColor: selected.color }} />
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">{selected.description}</p>

                  <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Key Functions</h4>
                  <ul className="space-y-1.5 mb-4">
                    {selected.functions.map((f, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="w-1.5 h-1.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: selected.color }} />
                        {f}
                      </motion.li>
                    ))}
                  </ul>

                  <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 rounded-xl p-3 mb-3 border border-purple-500/20">
                    <div className="flex items-center gap-1.5 text-purple-400 font-bold text-sm mb-1">
                      <Info className="w-3 h-3" /> Fun Fact
                    </div>
                    <p className="text-gray-300 text-sm italic">{selected.funFact}</p>
                  </div>

                  <div className="bg-red-500/10 rounded-xl p-3 border border-red-500/20">
                    <div className="text-sm text-red-400 font-bold mb-1">⚠️ If Damaged</div>
                    <p className="text-sm text-gray-300">{selected.damage}</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-gray-900 rounded-2xl border border-gray-800 p-5 text-center sticky top-20">
                  <div className="text-5xl mb-3">🧠</div>
                  <h3 className="text-lg font-bold text-white mb-2">Select a Region</h3>
                  <p className="text-gray-400 text-sm mb-4">Click any region on the brain map to learn about its functions.</p>
                  <div className="bg-gray-800/30 rounded-xl p-3 text-left">
                    <h4 className="text-sm font-bold text-gray-400 mb-2">💡 Quick Facts</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• The brain weighs about 3 pounds (1.4 kg)</li>
                      <li>• It generates about 20 watts of power</li>
                      <li>• Left hemisphere ≠ "logical" / Right ≠ "creative" (it's a myth!)</li>
                      <li>• You don't use only 10% — you use all of it</li>
                    </ul>
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
