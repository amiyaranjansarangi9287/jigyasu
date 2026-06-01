import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, GitCompare } from 'lucide-react';

interface Phase {
  id: string;
  name: string;
  division: 1 | 2;
  description: string;
  keyEvents: string[];
  chromosomes: number;
  ploidy: string;
}

const phases: Phase[] = [
  {
    id: 'interphase', name: 'Interphase', division: 1,
    description: 'The cell prepares for division. DNA replicates, forming sister chromatids joined at the centromere. The cell grows and produces proteins.',
    keyEvents: ['DNA replication (S phase)', 'Cell growth (G1 & G2)', 'Centrioles duplicate', 'Chromosomes not yet visible'],
    chromosomes: 46, ploidy: '2n (diploid)',
  },
  {
    id: 'prophase1', name: 'Prophase I', division: 1,
    description: 'Chromosomes condense. Homologous chromosomes pair up (synapsis) and exchange genetic material (crossing over) — creating genetic diversity!',
    keyEvents: ['Chromosomes condense', 'Homologous pairs form (synapsis)', '🔀 CROSSING OVER occurs', 'Nuclear envelope breaks down', 'Spindle fibers form'],
    chromosomes: 46, ploidy: '2n (diploid)',
  },
  {
    id: 'metaphase1', name: 'Metaphase I', division: 1,
    description: 'Homologous chromosome pairs line up at the cell\'s equator. Random orientation of pairs (independent assortment) adds more genetic variation.',
    keyEvents: ['Homologous pairs align at metaphase plate', 'Random orientation (independent assortment)', 'Spindle attached to centromeres', 'Tetrads visible'],
    chromosomes: 46, ploidy: '2n (diploid)',
  },
  {
    id: 'anaphase1', name: 'Anaphase I', division: 1,
    description: 'Homologous chromosomes are pulled apart to opposite poles. Sister chromatids stay together! This is different from mitosis.',
    keyEvents: ['Homologs separate (NOT sister chromatids)', 'Move to opposite poles', 'Cell elongates', 'Genetic recombination locked in'],
    chromosomes: 46, ploidy: '2n → n',
  },
  {
    id: 'telophase1', name: 'Telophase I & Cytokinesis', division: 1,
    description: 'Nuclear envelopes may reform. The cell divides into TWO haploid daughter cells, each with half the original chromosome number.',
    keyEvents: ['Chromosomes reach poles', 'Cytokinesis divides cell', '2 haploid daughter cells', 'Each cell has 23 chromosomes'],
    chromosomes: 23, ploidy: 'n (haploid)',
  },
  {
    id: 'prophase2', name: 'Prophase II', division: 2,
    description: 'A brief phase. Chromosomes condense again, spindle forms. No DNA replication occurs between divisions!',
    keyEvents: ['Chromosomes condense', 'Spindle forms', 'NO DNA replication', 'Nuclear envelope breaks down'],
    chromosomes: 23, ploidy: 'n (haploid)',
  },
  {
    id: 'metaphase2', name: 'Metaphase II', division: 2,
    description: 'Individual chromosomes (not pairs) line up at the metaphase plate. Similar to mitosis but with half the chromosomes.',
    keyEvents: ['Chromosomes align at equator', 'Spindle attached to sister chromatids', 'Looks like mitosis now'],
    chromosomes: 23, ploidy: 'n (haploid)',
  },
  {
    id: 'anaphase2', name: 'Anaphase II', division: 2,
    description: 'Sister chromatids finally separate! Each chromatid is now an individual chromosome moving to opposite poles.',
    keyEvents: ['Sister chromatids separate', 'Individual chromosomes to poles', 'Centromeres split'],
    chromosomes: 23, ploidy: 'n (haploid)',
  },
  {
    id: 'telophase2', name: 'Telophase II & Cytokinesis', division: 2,
    description: 'Four genetically unique haploid cells are produced — gametes (sperm or egg) ready for fertilization!',
    keyEvents: ['Nuclear envelopes reform', 'Cytokinesis in both cells', '4 UNIQUE haploid cells', 'Gametes ready!'],
    chromosomes: 23, ploidy: 'n (haploid)',
  },
];

function CellVisualization({ phaseIndex }: { phaseIndex: number }) {
  const phase = phases[phaseIndex];

  // Visual representation
  const getVisual = () => {
    if (phaseIndex === 0) return ( // Interphase
      <div className="relative w-48 h-48 mx-auto">
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/50 bg-blue-500/10" />
        <div className="absolute inset-12 rounded-full border-2 border-purple-500 bg-purple-500/20 flex items-center justify-center">
          <span className="text-2xl">🧬</span>
        </div>
        <div className="absolute top-1/4 right-1/4 text-sm text-gray-400">DNA replicating</div>
      </div>
    );
    if (phaseIndex === 1) return ( // Prophase I
      <div className="relative w-48 h-48 mx-auto">
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/50 bg-blue-500/10" />
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-0.5">
          <motion.div className="text-lg" animate={{ rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1 }}>╋</motion.div>
          <motion.div className="text-lg text-red-400" animate={{ rotate: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 1 }}>╋</motion.div>
        </div>
        <div className="absolute top-16 left-10 flex gap-0.5">
          <div className="text-lg text-blue-400">╋</div>
          <div className="text-lg text-cyan-400">╋</div>
        </div>
        <div className="absolute bottom-12 right-10 text-sm text-yellow-400 bg-yellow-500/20 px-1 rounded">Crossing Over!</div>
      </div>
    );
    if (phaseIndex === 2) return ( // Metaphase I
      <div className="relative w-48 h-48 mx-auto">
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/50 bg-blue-500/10" />
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-500/30" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2">
          <div className="flex justify-center gap-1"><span className="text-sm">╋╋</span><span className="text-sm text-red-400">╋╋</span></div>
          <div className="flex justify-center gap-1"><span className="text-sm text-blue-400">╋╋</span><span className="text-sm text-green-400">╋╋</span></div>
        </div>
      </div>
    );
    if (phaseIndex === 3) return ( // Anaphase I
      <div className="relative w-48 h-48 mx-auto">
        <div className="absolute inset-0 rounded-[40%] border-2 border-blue-500/50 bg-blue-500/10" style={{ transform: 'scaleX(1.3)' }} />
        <motion.div className="absolute top-1/4 left-4" animate={{ x: [-10, 10] }} transition={{ repeat: Infinity, duration: 1.5, repeatType: 'reverse' }}>
          <div className="text-sm">╋╋</div>
          <div className="text-sm text-blue-400">╋╋</div>
        </motion.div>
        <motion.div className="absolute top-1/4 right-4" animate={{ x: [10, -10] }} transition={{ repeat: Infinity, duration: 1.5, repeatType: 'reverse' }}>
          <div className="text-sm text-red-400">╋╋</div>
          <div className="text-sm text-green-400">╋╋</div>
        </motion.div>
      </div>
    );
    if (phaseIndex === 4) return ( // Telophase I
      <div className="relative w-48 h-32 mx-auto flex justify-center gap-4">
        <div className="w-20 h-20 rounded-full border-2 border-blue-500/50 bg-blue-500/10 flex items-center justify-center text-sm">n=23</div>
        <div className="w-20 h-20 rounded-full border-2 border-pink-500/50 bg-pink-500/10 flex items-center justify-center text-sm">n=23</div>
      </div>
    );
    if (phaseIndex >= 5 && phaseIndex <= 7) return ( // Meiosis II phases
      <div className="relative w-48 h-32 mx-auto flex justify-center gap-4">
        <div className="w-20 h-20 rounded-full border-2 border-blue-500/50 bg-blue-500/10 flex items-center justify-center">
          <span className="text-lg">{phaseIndex === 7 ? '↔️' : '╋'}</span>
        </div>
        <div className="w-20 h-20 rounded-full border-2 border-pink-500/50 bg-pink-500/10 flex items-center justify-center">
          <span className="text-lg">{phaseIndex === 7 ? '↔️' : '╋'}</span>
        </div>
      </div>
    );
    // Telophase II - 4 cells
    return (
      <div className="relative w-56 mx-auto grid grid-cols-2 gap-2 place-items-center">
        {['🟦', '🟪', '🟩', '🟧'].map((c, i) => (
          <motion.div key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="w-16 h-16 rounded-full border-2 border-gray-600 bg-gray-800/50 flex items-center justify-center text-2xl">
            {c}
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-8 min-h-[280px] flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div key={phase.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {getVisual()}
        </motion.div>
      </AnimatePresence>
      <div className="mt-6 text-center">
        <div className={`inline-block px-2 py-0.5 rounded-full text-sm font-bold ${phase.division === 1 ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
          Meiosis {phase.division}
        </div>
        <div className="text-sm text-gray-400 mt-1">Chromosomes: {phase.chromosomes} | {phase.ploidy}</div>
      </div>
    </div>
  );
}

export default function MeiosisSimulator() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrentPhase(p => (p + 1) % phases.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const phase = phases[currentPhase];

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">🔀 Meiosis Simulator</h2>
          <p className="text-gray-400 text-lg">From 1 cell to 4 unique gametes — sexual reproduction's foundation!</p>
        </motion.div>

        {/* Phase indicator */}
        <div className="flex justify-center gap-0.5 mb-6 overflow-x-auto px-4 py-2">
          {phases.map((p, i) => (
            <button key={p.id} onClick={() => setCurrentPhase(i)}
              className={`px-2 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap border ${
                i === currentPhase
                  ? p.division === 1 ? 'bg-blue-500 text-white border-blue-500' : 'bg-purple-500 text-white border-purple-500'
                  : p.division === 1 ? 'border-blue-500/30 text-blue-400/60 hover:bg-blue-500/10' : 'border-purple-500/30 text-purple-400/60 hover:bg-purple-500/10'
              }`}>
              {p.name.replace(' I', ' Ⅰ').replace(' II', ' Ⅱ')}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Visualization */}
          <div>
            <CellVisualization phaseIndex={currentPhase} />

            {/* Controls */}
            <div className="flex justify-center gap-3 mt-4">
              <button onClick={() => setCurrentPhase(p => Math.max(0, p - 1))} disabled={currentPhase === 0}
                className="p-2.5 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-30">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => setAutoPlay(!autoPlay)}
                className={`px-5 py-2.5 rounded-full font-medium text-sm flex items-center gap-2 ${autoPlay ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                {autoPlay ? <><Pause className="w-4 h-4" /> Stop</> : <><Play className="w-4 h-4" /> Auto Play</>}
              </button>
              <button onClick={() => setCurrentPhase(p => Math.min(phases.length - 1, p + 1))} disabled={currentPhase === phases.length - 1}
                className="p-2.5 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-30">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Phase info */}
          <motion.div key={phase.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${phase.division === 1 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`}>
                {phase.division}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{phase.name}</h3>
                <div className="text-sm text-gray-500">Stage {currentPhase + 1} of {phases.length}</div>
              </div>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mb-4">{phase.description}</p>

            <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Key Events</h4>
            <ul className="space-y-1.5 mb-4">
              {phase.keyEvents.map((event, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-start gap-2 text-sm ${event.includes('CROSSING OVER') || event.includes('4 UNIQUE') ? 'text-yellow-400 font-bold' : 'text-gray-300'}`}>
                  <span className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${phase.division === 1 ? 'bg-blue-500' : 'bg-purple-500'}`} />
                  {event}
                </motion.li>
              ))}
            </ul>

            {/* Result preview for final phase */}
            {currentPhase === phases.length - 1 && (
              <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-xl p-4 border border-green-500/20">
                <div className="text-green-400 font-bold text-sm mb-1">🎉 Result: 4 Unique Gametes!</div>
                <p className="text-sm text-gray-300">Each gamete is genetically unique due to crossing over and independent assortment — the basis of genetic diversity!</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Comparison toggle */}
        <div className="mt-6">
          <button onClick={() => setShowComparison(!showComparison)}
            className="flex items-center gap-2 mx-auto px-4 py-2 rounded-full bg-gray-800 text-gray-300 text-sm font-medium hover:bg-gray-700">
            <GitCompare className="w-4 h-4" /> {showComparison ? 'Hide' : 'Show'} Mitosis vs Meiosis Comparison
          </button>

          <AnimatePresence>
            {showComparison && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden">
                <div className="mt-4 bg-gray-900 rounded-xl border border-gray-800 p-5">
                  <h3 className="text-lg font-bold text-white mb-4 text-center">⚖️ Mitosis vs Meiosis</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                      <h4 className="font-bold text-blue-400 mb-2">🔄 Mitosis</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• <strong>1 division</strong> → 2 identical cells</li>
                        <li>• Daughter cells are <strong>diploid (2n)</strong></li>
                        <li>• Purpose: <strong>Growth & repair</strong></li>
                        <li>• <strong>No crossing over</strong></li>
                        <li>• Occurs in <strong>somatic cells</strong></li>
                        <li>• Produces <strong>clones</strong></li>
                      </ul>
                    </div>
                    <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
                      <h4 className="font-bold text-purple-400 mb-2">🔀 Meiosis</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• <strong>2 divisions</strong> → 4 unique cells</li>
                        <li>• Daughter cells are <strong>haploid (n)</strong></li>
                        <li>• Purpose: <strong>Sexual reproduction</strong></li>
                        <li>• <strong>Crossing over</strong> creates variation</li>
                        <li>• Occurs in <strong>germ cells</strong></li>
                        <li>• Produces <strong>gametes (sperm/egg)</strong></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
