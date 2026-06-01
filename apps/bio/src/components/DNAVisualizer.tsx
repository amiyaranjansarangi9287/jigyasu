import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Zap, BookOpen, FlaskConical } from 'lucide-react';

const basePairs = [
  { left: 'A', right: 'T', colorL: '#ef4444', colorR: '#3b82f6' },
  { left: 'T', right: 'A', colorL: '#3b82f6', colorR: '#ef4444' },
  { left: 'G', right: 'C', colorL: '#10b981', colorR: '#f59e0b' },
  { left: 'C', right: 'G', colorL: '#f59e0b', colorR: '#10b981' },
  { left: 'A', right: 'T', colorL: '#ef4444', colorR: '#3b82f6' },
  { left: 'G', right: 'C', colorL: '#10b981', colorR: '#f59e0b' },
  { left: 'T', right: 'A', colorL: '#3b82f6', colorR: '#ef4444' },
  { left: 'C', right: 'G', colorL: '#f59e0b', colorR: '#10b981' },
  { left: 'A', right: 'T', colorL: '#ef4444', colorR: '#3b82f6' },
  { left: 'G', right: 'C', colorL: '#10b981', colorR: '#f59e0b' },
  { left: 'T', right: 'A', colorL: '#3b82f6', colorR: '#ef4444' },
  { left: 'A', right: 'T', colorL: '#ef4444', colorR: '#3b82f6' },
  { left: 'C', right: 'G', colorL: '#f59e0b', colorR: '#10b981' },
  { left: 'G', right: 'C', colorL: '#10b981', colorR: '#f59e0b' },
  { left: 'T', right: 'A', colorL: '#3b82f6', colorR: '#ef4444' },
  { left: 'A', right: 'T', colorL: '#ef4444', colorR: '#3b82f6' },
  { left: 'G', right: 'C', colorL: '#10b981', colorR: '#f59e0b' },
  { left: 'C', right: 'G', colorL: '#f59e0b', colorR: '#10b981' },
];

type ViewMode = 'helix' | 'transcription' | 'codon';

const codonTable: Record<string, { amino: string; abbr: string }> = {
  'AUG': { amino: 'Methionine (START)', abbr: 'Met' },
  'UUU': { amino: 'Phenylalanine', abbr: 'Phe' }, 'UUC': { amino: 'Phenylalanine', abbr: 'Phe' },
  'UUA': { amino: 'Leucine', abbr: 'Leu' }, 'UUG': { amino: 'Leucine', abbr: 'Leu' },
  'UCU': { amino: 'Serine', abbr: 'Ser' }, 'UCC': { amino: 'Serine', abbr: 'Ser' },
  'UAU': { amino: 'Tyrosine', abbr: 'Tyr' }, 'UAC': { amino: 'Tyrosine', abbr: 'Tyr' },
  'UGU': { amino: 'Cysteine', abbr: 'Cys' }, 'UGC': { amino: 'Cysteine', abbr: 'Cys' },
  'UGG': { amino: 'Tryptophan', abbr: 'Trp' },
  'GCU': { amino: 'Alanine', abbr: 'Ala' }, 'GCC': { amino: 'Alanine', abbr: 'Ala' },
  'GAU': { amino: 'Aspartic Acid', abbr: 'Asp' }, 'GAC': { amino: 'Aspartic Acid', abbr: 'Asp' },
  'GGU': { amino: 'Glycine', abbr: 'Gly' }, 'GGC': { amino: 'Glycine', abbr: 'Gly' },
  'CAU': { amino: 'Histidine', abbr: 'His' }, 'CAC': { amino: 'Histidine', abbr: 'His' },
  'AAU': { amino: 'Asparagine', abbr: 'Asn' }, 'AAC': { amino: 'Asparagine', abbr: 'Asn' },
  'UAA': { amino: 'STOP', abbr: '⛔' }, 'UAG': { amino: 'STOP', abbr: '⛔' }, 'UGA': { amino: 'STOP', abbr: '⛔' },
};

const facts = [
  "Human DNA is 99.9% identical between all people!",
  "DNA stands for Deoxyribonucleic Acid.",
  "A always pairs with T, and G always pairs with C.",
  "If unwound, the DNA in all your cells would stretch to the sun and back 600 times!",
  "Your body produces ~3.8 million cells per second, each needing DNA replication.",
  "DNA was first discovered by Friedrich Miescher in 1869.",
  "The human genome contains about 3 billion base pairs.",
  "Only about 2% of your DNA codes for proteins. The rest was once called 'junk DNA'.",
  "mRNA carries instructions from DNA to ribosomes for protein synthesis.",
  "A codon is a sequence of three nucleotides that codes for a specific amino acid.",
  "Watson and Crick discovered the double helix structure in 1953.",
  "Telomeres at chromosome ends shorten with each cell division — linked to aging!",
];

const dnaToRna = (base: string) => {
  const map: Record<string, string> = { A: 'U', T: 'A', G: 'C', C: 'G' };
  return map[base] || base;
};

export default function DNAVisualizer() {
  const [playing, setPlaying] = useState(true);
  const [time, setTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [factIndex, setFactIndex] = useState(0);
  const [unzipping, setUnzipping] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('helix');
  const [highlightedPair, setHighlightedPair] = useState<number | null>(null);
  const [showMRNA, setShowMRNA] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => setTime(t => t + 0.02 * speed), 16);
    return () => clearInterval(interval);
  }, [playing, speed]);

  useEffect(() => {
    const interval = setInterval(() => setFactIndex(i => (i + 1) % facts.length), 6000);
    return () => clearInterval(interval);
  }, []);

  const reset = useCallback(() => {
    setTime(0);
    setUnzipping(false);
    setShowMRNA(false);
  }, []);

  // Nucleotide counts
  const counts = basePairs.reduce((acc, bp) => {
    acc[bp.left] = (acc[bp.left] || 0) + 1;
    acc[bp.right] = (acc[bp.right] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // mRNA sequence from template strand
  const mRNASequence = basePairs.map(bp => dnaToRna(bp.right));

  // Codons from mRNA
  const codons: string[] = [];
  for (let i = 0; i + 2 < mRNASequence.length; i += 3) {
    codons.push(mRNASequence[i] + mRNASequence[i + 1] + mRNASequence[i + 2]);
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">🧬 DNA Visualizer</h2>
          <p className="text-gray-400 text-lg">Watch the double helix twist, unwind, and transcribe!</p>
        </motion.div>

        {/* View Mode Tabs */}
        <div className="flex justify-center mb-5">
          <div className="flex bg-gray-800 rounded-full p-1 gap-1">
            {([
              { mode: 'helix' as const, label: '🔄 Double Helix', icon: null },
              { mode: 'transcription' as const, label: '📝 Transcription', icon: null },
              { mode: 'codon' as const, label: '🧩 Codon Reader', icon: null },
            ]).map(v => (
              <button key={v.mode} onClick={() => setViewMode(v.mode)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${viewMode === v.mode ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button onClick={() => setPlaying(!playing)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors">
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {playing ? 'Pause' : 'Play'}
          </button>
          <button onClick={reset} className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800 text-gray-300 text-sm font-medium hover:bg-gray-700">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          {viewMode === 'helix' && (
            <button onClick={() => setUnzipping(!unzipping)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${unzipping ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
              <Zap className="w-4 h-4" /> {unzipping ? 'Stop Unzip' : 'Unzip DNA'}
            </button>
          )}
          {viewMode === 'transcription' && (
            <button onClick={() => setShowMRNA(!showMRNA)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${showMRNA ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
              <FlaskConical className="w-4 h-4" /> {showMRNA ? 'Hide mRNA' : 'Show mRNA'}
            </button>
          )}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-800">
            <span className="text-gray-400 text-xs">Speed:</span>
            {[0.5, 1, 2, 3].map(s => (
              <button key={s} onClick={() => setSpeed(s)} className={`px-2 py-0.5 rounded-full text-xs font-bold ${speed === s ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'}`}>
                {s}x
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Visualizer */}
          <div className="lg:col-span-2">
            {viewMode === 'helix' && (
              <div className="relative max-w-md mx-auto">
                <div className="relative h-[650px] overflow-hidden rounded-2xl bg-gradient-to-b from-purple-950/50 via-gray-950 to-blue-950/50 border border-purple-500/20">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <motion.div key={i} className="absolute w-1 h-1 rounded-full bg-purple-400/15"
                      style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                      animate={{ y: [-15, 15], opacity: [0.05, 0.25, 0.05] }}
                      transition={{ repeat: Infinity, duration: 3 + Math.random() * 4, delay: Math.random() * 2 }} />
                  ))}

                  <svg viewBox="0 0 400 650" className="w-full h-full">
                    {basePairs.map((bp, i) => {
                      const y = 25 + i * 34;
                      const phase = time * 2 + i * 0.4;
                      const sinVal = Math.sin(phase);
                      const cosVal = Math.cos(phase);
                      const centerX = 200;
                      const amplitude = 80;
                      const leftX = centerX + sinVal * amplitude;
                      const rightX = centerX - sinVal * amplitude;
                      const leftZ = cosVal;
                      const rightZ = -cosVal;
                      const unzipOffset = unzipping ? Math.min(45, Math.max(0, (time * 30 - i * 3))) : 0;
                      const leftFinalX = leftX - unzipOffset;
                      const rightFinalX = rightX + unzipOffset;
                      const leftOpacity = (leftZ + 1) / 2 * 0.7 + 0.3;
                      const rightOpacity = (rightZ + 1) / 2 * 0.7 + 0.3;
                      const showBond = !unzipping || unzipOffset < 20;
                      const isHighlighted = highlightedPair === i;

                      return (
                        <g key={i} onMouseEnter={() => setHighlightedPair(i)} onMouseLeave={() => setHighlightedPair(null)} className="cursor-pointer">
                          {showBond && (
                            <line x1={leftFinalX} y1={y} x2={rightFinalX} y2={y}
                              stroke={isHighlighted ? '#a78bfa' : 'white'} strokeWidth={isHighlighted ? 2 : 1}
                              strokeDasharray="4,4" opacity={isHighlighted ? 0.6 : 0.3 * (1 - unzipOffset / 20)} />
                          )}
                          {i > 0 && (
                            <>
                              <line
                                x1={centerX + Math.sin(time * 2 + (i - 1) * 0.4) * amplitude - (unzipping ? Math.min(45, Math.max(0, (time * 30 - (i - 1) * 3))) : 0)}
                                y1={25 + (i - 1) * 34} x2={leftFinalX} y2={y}
                                stroke={bp.colorL} strokeWidth="3" opacity={leftOpacity * 0.6} />
                              <line
                                x1={centerX - Math.sin(time * 2 + (i - 1) * 0.4) * amplitude + (unzipping ? Math.min(45, Math.max(0, (time * 30 - (i - 1) * 3))) : 0)}
                                y1={25 + (i - 1) * 34} x2={rightFinalX} y2={y}
                                stroke={bp.colorR} strokeWidth="3" opacity={rightOpacity * 0.6} />
                            </>
                          )}
                          <circle cx={leftFinalX} cy={y} r={leftZ > 0 ? 14 : 10} fill={bp.colorL} opacity={leftOpacity} stroke={isHighlighted ? 'white' : 'none'} strokeWidth="2" />
                          <text x={leftFinalX} y={y + 4} textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" opacity={leftOpacity}>{bp.left}</text>
                          <circle cx={rightFinalX} cy={y} r={rightZ > 0 ? 14 : 10} fill={bp.colorR} opacity={rightOpacity} stroke={isHighlighted ? 'white' : 'none'} strokeWidth="2" />
                          <text x={rightFinalX} y={y + 4} textAnchor="middle" fontSize="10" fontWeight="bold" fill="white" opacity={rightOpacity}>{bp.right}</text>
                        </g>
                      );
                    })}
                  </svg>

                  {highlightedPair !== null && (
                    <div className="absolute top-3 left-3 bg-gray-900/90 backdrop-blur px-3 py-2 rounded-lg border border-purple-500/30 text-xs">
                      <span className="text-purple-400 font-bold">Pair #{highlightedPair + 1}:</span>{' '}
                      <span style={{ color: basePairs[highlightedPair].colorL }}>{basePairs[highlightedPair].left}</span>
                      <span className="text-gray-500"> — </span>
                      <span style={{ color: basePairs[highlightedPair].colorR }}>{basePairs[highlightedPair].right}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {viewMode === 'transcription' && (
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" /> DNA → mRNA Transcription
                </h3>
                <div className="space-y-1 font-mono text-sm overflow-x-auto">
                  {/* DNA Template strand */}
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 text-xs w-24 shrink-0">3' DNA:</span>
                    <div className="flex gap-0.5">
                      {basePairs.map((bp, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm"
                          style={{ backgroundColor: bp.colorR + '22', color: bp.colorR, border: `1px solid ${bp.colorR}44` }}>
                          {bp.right}
                        </motion.div>
                      ))}
                    </div>
                    <span className="text-gray-500 text-xs ml-1">5'</span>
                  </div>

                  {/* Bonds */}
                  <div className="flex items-center gap-1">
                    <span className="w-24 shrink-0" />
                    <div className="flex gap-0.5">
                      {basePairs.map((_, i) => (
                        <div key={i} className="w-8 h-4 flex items-center justify-center text-gray-600 text-[10px]">| |</div>
                      ))}
                    </div>
                  </div>

                  {/* DNA Coding strand */}
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500 text-xs w-24 shrink-0">5' DNA:</span>
                    <div className="flex gap-0.5">
                      {basePairs.map((bp, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm"
                          style={{ backgroundColor: bp.colorL + '22', color: bp.colorL, border: `1px solid ${bp.colorL}44` }}>
                          {bp.left}
                        </motion.div>
                      ))}
                    </div>
                    <span className="text-gray-500 text-xs ml-1">3'</span>
                  </div>

                  {/* Arrow */}
                  <AnimatePresence>
                    {showMRNA && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="flex items-center gap-1 py-2">
                          <span className="w-24 shrink-0" />
                          <div className="text-purple-400 text-xs flex items-center gap-1">
                            ↓ RNA Polymerase transcribes template strand → mRNA
                          </div>
                        </div>

                        {/* mRNA */}
                        <div className="flex items-center gap-1">
                          <span className="text-orange-400 text-xs w-24 shrink-0 font-bold">5' mRNA:</span>
                          <div className="flex gap-0.5">
                            {mRNASequence.map((base, i) => {
                              const colors: Record<string, string> = { A: '#ef4444', U: '#8b5cf6', G: '#10b981', C: '#f59e0b' };
                              return (
                                <motion.div key={i}
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: i * 0.05 }}
                                  className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm border"
                                  style={{ backgroundColor: colors[base] + '22', color: colors[base], borderColor: colors[base] + '44' }}>
                                  {base}
                                </motion.div>
                              );
                            })}
                          </div>
                          <span className="text-gray-500 text-xs ml-1">3'</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-6 bg-gray-800/50 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-white mb-2">📖 How Transcription Works</h4>
                  <ol className="text-xs text-gray-300 space-y-1.5 list-decimal list-inside">
                    <li>RNA Polymerase binds to the <span className="text-purple-400 font-bold">promoter</span> region of DNA</li>
                    <li>The enzyme reads the <span className="text-blue-400 font-bold">template strand</span> (3' → 5')</li>
                    <li>It builds <span className="text-orange-400 font-bold">mRNA</span> using complementary bases (A→U, T→A, G→C, C→G)</li>
                    <li>Note: RNA uses <span className="text-purple-400 font-bold">Uracil (U)</span> instead of Thymine (T)</li>
                    <li>The mRNA travels to ribosomes for <span className="text-emerald-400 font-bold">translation</span></li>
                  </ol>
                </div>
              </div>
            )}

            {viewMode === 'codon' && (
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  🧩 Codon → Amino Acid Reader
                </h3>
                <p className="text-gray-400 text-sm mb-5">Each group of 3 mRNA nucleotides (codon) codes for a specific amino acid:</p>

                <div className="space-y-3">
                  {codons.map((codon, i) => {
                    const result = codonTable[codon];
                    const colors: Record<string, string> = { A: '#ef4444', U: '#8b5cf6', G: '#10b981', C: '#f59e0b' };
                    return (
                      <motion.div key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-3 bg-gray-800/50 rounded-xl p-3">
                        <div className="text-xs text-gray-500 w-6">#{i + 1}</div>
                        <div className="flex gap-1">
                          {codon.split('').map((base, j) => (
                            <div key={j}
                              className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm border-2"
                              style={{ backgroundColor: colors[base] + '15', color: colors[base], borderColor: colors[base] + '40' }}>
                              {base}
                            </div>
                          ))}
                        </div>
                        <div className="text-gray-600">→</div>
                        <div className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium ${
                          result?.amino === 'STOP'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                            : result?.amino.includes('START')
                            ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                            : 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                        }`}>
                          {result ? `${result.abbr} — ${result.amino}` : `${codon} — (lookup)`}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-5 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl p-4 border border-purple-500/20">
                  <h4 className="text-sm font-bold text-white mb-2">🎓 The Genetic Code</h4>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• There are <strong className="text-white">64 possible codons</strong> (4³ combinations)</li>
                    <li>• They code for only <strong className="text-white">20 amino acids</strong> + STOP signals</li>
                    <li>• This means the code is <strong className="text-purple-400">degenerate</strong> — multiple codons can code for the same amino acid</li>
                    <li>• <strong className="text-green-400">AUG</strong> is the universal START codon (also codes for Methionine)</li>
                    <li>• <strong className="text-red-400">UAA, UAG, UGA</strong> are the three STOP codons</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Nucleotide Counter */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <h3 className="text-white font-bold mb-3 text-sm">📊 Nucleotide Count</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { base: 'A', full: 'Adenine', color: '#ef4444' },
                  { base: 'T', full: 'Thymine', color: '#3b82f6' },
                  { base: 'G', full: 'Guanine', color: '#10b981' },
                  { base: 'C', full: 'Cytosine', color: '#f59e0b' },
                ].map(b => (
                  <div key={b.base} className="bg-gray-800/50 rounded-lg p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: b.color }} />
                      <span className="text-white font-bold text-sm">{b.base}</span>
                    </div>
                    <div className="text-lg font-black" style={{ color: b.color }}>{counts[b.base] || 0}</div>
                    <div className="text-[10px] text-gray-500">{b.full}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-center">
                <div className="text-xs text-gray-500">Total base pairs</div>
                <div className="text-xl font-black text-white">{basePairs.length}</div>
              </div>
              <div className="mt-2 text-[10px] text-gray-500 text-center">
                Chargaff's Rule: A=T, G=C ✓
              </div>
            </div>

            {/* Base Pair Legend */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <h3 className="text-white font-bold mb-3 text-sm">🔗 Base Pair Legend</h3>
              <div className="space-y-2">
                {[
                  { base: 'A — T', desc: '2 hydrogen bonds', color1: '#ef4444', color2: '#3b82f6' },
                  { base: 'G ≡ C', desc: '3 hydrogen bonds (stronger)', color1: '#10b981', color2: '#f59e0b' },
                ].map(b => (
                  <div key={b.base} className="flex items-center gap-2 bg-gray-800/30 rounded-lg p-2">
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: b.color1 }} />
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: b.color2 }} />
                    </div>
                    <div>
                      <div className="text-white text-xs font-bold">{b.base}</div>
                      <div className="text-[10px] text-gray-500">{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fun Fact */}
            <AnimatePresence mode="wait">
              <motion.div key={factIndex}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl border border-purple-500/20 p-5">
                <div className="text-purple-400 font-bold text-xs mb-1">💡 Did you know?</div>
                <p className="text-gray-200 text-sm leading-relaxed">{facts[factIndex]}</p>
              </motion.div>
            </AnimatePresence>

            {/* Structure info */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <h3 className="text-white font-bold mb-2 text-sm">🏗️ DNA Structure</h3>
              <ul className="text-xs text-gray-400 space-y-1.5">
                <li className="flex gap-1.5"><span className="text-emerald-400">•</span> Sugar-phosphate backbone</li>
                <li className="flex gap-1.5"><span className="text-emerald-400">•</span> Antiparallel strands (5'→3')</li>
                <li className="flex gap-1.5"><span className="text-emerald-400">•</span> Right-handed double helix</li>
                <li className="flex gap-1.5"><span className="text-emerald-400">•</span> Major & minor grooves</li>
                <li className="flex gap-1.5"><span className="text-emerald-400">•</span> 10 bp per full turn</li>
                <li className="flex gap-1.5"><span className="text-emerald-400">•</span> 3.4 nm per turn</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
