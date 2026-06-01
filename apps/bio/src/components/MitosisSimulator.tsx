import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, RotateCcw } from 'lucide-react';

interface Phase {
  id: string;
  name: string;
  emoji: string;
  description: string;
  details: string[];
  color: string;
  quiz?: { q: string; options: string[]; answer: number };
}

const phases: Phase[] = [
  {
    id: 'interphase', name: 'Interphase', emoji: '🟢',
    description: 'The cell grows and DNA replicates in preparation for division. This is the longest phase of the cell cycle (~90%).',
    details: ['Cell grows to full size (G1 phase)', 'DNA is replicated — each chromosome duplicated (S phase)', 'Cell prepares proteins for division (G2 phase)', 'Chromosomes are loose chromatin (not visible)', 'Centrosomes duplicate'],
    color: '#22c55e',
    quiz: { q: 'What happens to DNA during S phase?', options: ['It condenses', 'It replicates', 'It breaks down'], answer: 1 },
  },
  {
    id: 'prophase', name: 'Prophase', emoji: '🔵',
    description: 'Chromosomes condense and become visible. The nuclear envelope begins to break down and spindle fibers form from centrioles.',
    details: ['Chromatin condenses into visible chromosomes', 'Each chromosome = 2 sister chromatids joined at centromere', 'Centrosomes move to opposite poles', 'Spindle fibers (microtubules) begin to form', 'Nuclear envelope starts breaking down', 'Nucleolus disappears'],
    color: '#3b82f6',
    quiz: { q: 'What are sister chromatids joined by?', options: ['Spindle fiber', 'Centromere', 'Nuclear envelope'], answer: 1 },
  },
  {
    id: 'metaphase', name: 'Metaphase', emoji: '🟡',
    description: 'Chromosomes align perfectly along the cell\'s equator (metaphase plate). Spindle fibers attach to centromeres from both poles.',
    details: ['Chromosomes align at the metaphase plate (equator)', 'Spindle fibers attach to centromeres via kinetochores', 'Each chromatid connected to opposite pole', 'Checkpoint: ensures all chromosomes properly attached', 'This ensures equal distribution of DNA'],
    color: '#eab308',
    quiz: { q: 'Where do chromosomes line up?', options: ['At the poles', 'At the metaphase plate', 'In the nucleus'], answer: 1 },
  },
  {
    id: 'anaphase', name: 'Anaphase', emoji: '🟠',
    description: 'The shortest phase! Sister chromatids are pulled apart to opposite poles by shortening spindle fibers. The cell elongates.',
    details: ['Centromeres split — sister chromatids separate', 'Motor proteins walk along microtubules', 'Chromatids pulled to opposite poles', 'Cell elongates as polar microtubules push', 'Each pole now has a complete set of chromosomes', 'Fastest phase of mitosis'],
    color: '#f97316',
  },
  {
    id: 'telophase', name: 'Telophase', emoji: '🔴',
    description: 'Nuclear envelopes reform around each set of chromosomes. Chromosomes decondense back into chromatin. Spindle fibers break down.',
    details: ['Nuclear envelopes reform around each chromosome set', 'Chromosomes decondense back into chromatin', 'Spindle fibers disassemble', 'Nucleoli reappear in each new nucleus', 'Two distinct nuclei now visible', 'Cleavage furrow begins to form'],
    color: '#ef4444',
  },
  {
    id: 'cytokinesis', name: 'Cytokinesis', emoji: '✨',
    description: 'The cytoplasm divides, creating two genetically identical daughter cells! In animal cells, a cleavage furrow pinches the cell in two.',
    details: ['Cleavage furrow deepens (contractile ring of actin)', 'Cytoplasm, organelles divided roughly equally', 'Cell membrane pinches inward', 'Two identical daughter cells produced!', 'Each cell has full set of 46 chromosomes', 'Cells enter G1 of new cell cycle'],
    color: '#a855f7',
    quiz: { q: 'How many cells result from mitosis?', options: ['1', '2 identical cells', '4 unique cells'], answer: 1 },
  },
];

// Proper SVG cell visualization
function CellSVG({ phaseIndex }: { phaseIndex: number }) {
  const t = Date.now() / 1000;
  const p = phaseIndex;

  return (
    <svg viewBox="0 0 320 280" className="w-full max-w-xs mx-auto">
      <defs>
        <radialGradient id="cellGrad" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#065f46" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#022c22" stopOpacity="0.1" />
        </radialGradient>
        <radialGradient id="nucGrad" cx="45%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.15" />
        </radialGradient>
        <filter id="glow2">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {p < 5 ? (
        /* Single cell phases */
        <g>
          {/* Cell membrane */}
          <ellipse cx="160" cy="140" rx={p === 3 ? 150 : p === 4 ? 148 : 120} ry={p === 3 ? 100 : p === 4 ? 95 : 115}
            fill="url(#cellGrad)" stroke="#10b981" strokeWidth="2.5" opacity="0.8">
            {p === 3 && <animate attributeName="rx" values="120;150;150" dur="1.5s" fill="freeze" />}
          </ellipse>

          {/* Cytoplasm particles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <circle key={`cp-${i}`}
              cx={80 + (i * 37 + Math.sin(t + i) * 8) % 160}
              cy={70 + (i * 23 + Math.cos(t + i) * 6) % 140}
              r="1.5" fill="#10b981" opacity="0.15" />
          ))}

          {/* Interphase: nucleus with chromatin */}
          {p === 0 && (
            <g>
              <ellipse cx="160" cy="140" rx="55" ry="50" fill="url(#nucGrad)" stroke="#8b5cf6" strokeWidth="2" />
              {/* Chromatin threads */}
              {Array.from({ length: 6 }).map((_, i) => (
                <path key={`chr-${i}`}
                  d={`M${130 + i * 10},${115 + i * 8} Q${145 + Math.sin(i) * 15},${130 + i * 5} ${170 - i * 5},${155 - i * 3}`}
                  fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
              ))}
              {/* Nucleolus */}
              <circle cx="155" cy="135" r="10" fill="#6d28d9" opacity="0.4" />
              {/* Centrosome */}
              <circle cx="160" cy="55" r="5" fill="#f59e0b" opacity="0.5" />
              <circle cx="162" cy="57" r="3" fill="#f59e0b" opacity="0.3" />
            </g>
          )}

          {/* Prophase: condensed chromosomes, breaking nucleus */}
          {p === 1 && (
            <g>
              {/* Breaking nuclear envelope */}
              <ellipse cx="160" cy="140" rx="55" ry="50" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="8,6" opacity="0.4" />
              {/* Condensed chromosomes (X shapes) */}
              {[
                { x: 140, y: 120, rot: 20, c: '#ef4444' },
                { x: 175, y: 125, rot: -15, c: '#3b82f6' },
                { x: 150, y: 150, rot: 35, c: '#10b981' },
                { x: 170, y: 155, rot: -25, c: '#f59e0b' },
              ].map((ch, i) => (
                <g key={`ch-${i}`} transform={`translate(${ch.x},${ch.y}) rotate(${ch.rot})`}>
                  <line x1="-8" y1="-10" x2="8" y2="10" stroke={ch.c} strokeWidth="3" strokeLinecap="round" />
                  <line x1="8" y1="-10" x2="-8" y2="10" stroke={ch.c} strokeWidth="3" strokeLinecap="round" />
                  <circle cx="0" cy="0" r="2.5" fill={ch.c} opacity="0.7" />
                </g>
              ))}
              {/* Centrioles at poles */}
              <g filter="url(#glow2)">
                <circle cx="80" cy="60" r="4" fill="#f59e0b" />
                <circle cx="240" cy="220" r="4" fill="#f59e0b" />
              </g>
              {/* Early spindle fibers */}
              {[80, 240].map((cx, pi) => (
                <g key={`sf-${pi}`} opacity="0.2">
                  {[0, 30, -30, 60, -60].map((angle, ai) => {
                    const rad = (angle * Math.PI) / 180;
                    const len = 40;
                    return (
                      <line key={ai} x1={cx} y1={pi === 0 ? 60 : 220}
                        x2={cx + Math.cos(rad + (pi === 0 ? 0.5 : -0.5)) * len}
                        y2={(pi === 0 ? 60 : 220) + Math.sin(rad + (pi === 0 ? 0.8 : -0.8)) * len}
                        stroke="#a78bfa" strokeWidth="0.8" />
                    );
                  })}
                </g>
              ))}
            </g>
          )}

          {/* Metaphase: aligned at center */}
          {p === 2 && (
            <g>
              {/* Metaphase plate line */}
              <line x1="160" y1="55" x2="160" y2="225" stroke="#eab308" strokeWidth="0.5" strokeDasharray="4,4" opacity="0.3" />
              {/* Centrioles */}
              <circle cx="55" cy="140" r="5" fill="#f59e0b" filter="url(#glow2)" />
              <circle cx="265" cy="140" r="5" fill="#f59e0b" filter="url(#glow2)" />
              {/* Spindle fibers from both poles */}
              {[
                { y: 100, c: '#ef4444' }, { y: 125, c: '#3b82f6' },
                { y: 150, c: '#10b981' }, { y: 175, c: '#f59e0b' },
              ].map((ch, i) => (
                <g key={`mch-${i}`}>
                  {/* Spindle fibers */}
                  <line x1="55" y1="140" x2="155" y2={ch.y} stroke="#a78bfa" strokeWidth="0.7" opacity="0.3" />
                  <line x1="265" y1="140" x2="165" y2={ch.y} stroke="#a78bfa" strokeWidth="0.7" opacity="0.3" />
                  {/* Chromosome (X shape) at plate */}
                  <g transform={`translate(160,${ch.y})`}>
                    <line x1="-7" y1="-8" x2="7" y2="8" stroke={ch.c} strokeWidth="3" strokeLinecap="round" />
                    <line x1="7" y1="-8" x2="-7" y2="8" stroke={ch.c} strokeWidth="3" strokeLinecap="round" />
                    <circle cx="0" cy="0" r="2" fill="white" opacity="0.5" />
                  </g>
                </g>
              ))}
            </g>
          )}

          {/* Anaphase: chromatids pulled apart */}
          {p === 3 && (
            <g>
              <circle cx="50" cy="140" r="4" fill="#f59e0b" filter="url(#glow2)" />
              <circle cx="270" cy="140" r="4" fill="#f59e0b" filter="url(#glow2)" />
              {[
                { y: 110, c: '#ef4444' }, { y: 130, c: '#3b82f6' },
                { y: 150, c: '#10b981' }, { y: 170, c: '#f59e0b' },
              ].map((ch, i) => (
                <g key={`ach-${i}`}>
                  {/* Spindle fibers */}
                  <line x1="50" y1="140" x2="90" y2={ch.y} stroke="#a78bfa" strokeWidth="0.6" opacity="0.25" />
                  <line x1="270" y1="140" x2="230" y2={ch.y} stroke="#a78bfa" strokeWidth="0.6" opacity="0.25" />
                  {/* Left chromatid (V shape moving left) */}
                  <g transform={`translate(90,${ch.y})`}>
                    <line x1="-5" y1="-7" x2="2" y2="0" stroke={ch.c} strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="-5" y1="7" x2="2" y2="0" stroke={ch.c} strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                  {/* Right chromatid (V shape moving right) */}
                  <g transform={`translate(230,${ch.y})`}>
                    <line x1="5" y1="-7" x2="-2" y2="0" stroke={ch.c} strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="5" y1="7" x2="-2" y2="0" stroke={ch.c} strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                </g>
              ))}
            </g>
          )}

          {/* Telophase: nuclei reforming, cleavage furrow */}
          {p === 4 && (
            <g>
              {/* Cleavage furrow */}
              <line x1="160" y1="35" x2="160" y2="80" stroke="#10b981" strokeWidth="1.5" opacity="0.4" />
              <line x1="160" y1="200" x2="160" y2="245" stroke="#10b981" strokeWidth="1.5" opacity="0.4" />
              {/* Left nucleus */}
              <ellipse cx="95" cy="140" rx="35" ry="40" fill="url(#nucGrad)" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.6" />
              {/* Right nucleus */}
              <ellipse cx="225" cy="140" rx="35" ry="40" fill="url(#nucGrad)" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.6" />
              {/* Decondensing chromatin */}
              {[95, 225].map((cx, si) => (
                <g key={`tel-${si}`}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <path key={`dc-${si}-${i}`}
                      d={`M${cx - 12 + i * 8},${125 + i * 7} Q${cx + (i % 2 ? 5 : -5)},${135 + i * 4} ${cx + 10 - i * 6},${145 + i * 3}`}
                      fill="none" stroke="#a78bfa" strokeWidth="1.2" opacity="0.35" strokeLinecap="round" />
                  ))}
                </g>
              ))}
            </g>
          )}
        </g>
      ) : (
        /* Cytokinesis: two separate cells */
        <g>
          {/* Left daughter cell */}
          <ellipse cx="100" cy="140" rx="80" ry="95" fill="url(#cellGrad)" stroke="#10b981" strokeWidth="2.5" opacity="0.8" />
          <ellipse cx="100" cy="140" rx="30" ry="28" fill="url(#nucGrad)" stroke="#8b5cf6" strokeWidth="1.5" />
          <circle cx="95" cy="135" r="6" fill="#6d28d9" opacity="0.3" />
          {Array.from({ length: 3 }).map((_, i) => (
            <path key={`lc-${i}`} d={`M${85 + i * 10},${130 + i * 5} Q${95 + i * 3},${140} ${105 - i * 4},${148 - i * 2}`}
              fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
          ))}
          
          {/* Right daughter cell */}
          <ellipse cx="220" cy="140" rx="80" ry="95" fill="url(#cellGrad)" stroke="#10b981" strokeWidth="2.5" opacity="0.8" />
          <ellipse cx="220" cy="140" rx="30" ry="28" fill="url(#nucGrad)" stroke="#8b5cf6" strokeWidth="1.5" />
          <circle cx="215" cy="135" r="6" fill="#6d28d9" opacity="0.3" />
          {Array.from({ length: 3 }).map((_, i) => (
            <path key={`rc-${i}`} d={`M${205 + i * 10},${130 + i * 5} Q${215 + i * 3},${140} ${225 - i * 4},${148 - i * 2}`}
              fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
          ))}

          {/* Dividing line */}
          <text x="160" y="145" textAnchor="middle" fontSize="18" fill="#a855f7" opacity="0.4">⟷</text>
        </g>
      )}

      {/* Phase label */}
      <text x="160" y="272" textAnchor="middle" fontSize="10" fill="#9ca3af" fontWeight="bold">
        {phases[p].name}
      </text>
    </svg>
  );
}

export default function MitosisSimulator() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setCurrentPhase(p => (p + 1) % phases.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const phase = phases[currentPhase];

  const handlePhaseChange = (newPhase: number) => {
    setCurrentPhase(newPhase);
    setQuizAnswer(null);
    setShowQuiz(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-16 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1">🧪 Mitosis Simulator</h2>
          <p className="text-gray-400 text-sm sm:text-base">Step through cell division phase by phase!</p>
        </motion.div>

        {/* Phase indicator - mobile optimized */}
        <div className="flex justify-center gap-1 mb-6 overflow-x-auto pb-2 px-2 -mx-2">
          {phases.map((p, i) => (
            <button key={p.id} onClick={() => handlePhaseChange(i)}
              className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                i === currentPhase ? 'text-white shadow-lg' : i < currentPhase ? 'bg-gray-800/50 text-gray-500' : 'bg-gray-800/50 text-gray-400'
              }`}
              style={i === currentPhase ? { backgroundColor: p.color, boxShadow: `0 0 15px ${p.color}44` } : {}}>
              <span>{p.emoji}</span>
              <span className="hidden xs:inline sm:inline">{p.name}</span>
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-5 items-start">
          {/* Cell Animation - Enhanced SVG */}
          <div>
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-4 sm:p-6">
              <AnimatePresence mode="wait">
                <motion.div key={phase.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}>
                  <CellSVG phaseIndex={currentPhase} />
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              <div className="flex justify-center gap-2 sm:gap-3 mt-4">
                <button onClick={() => handlePhaseChange(Math.max(0, currentPhase - 1))} disabled={currentPhase === 0}
                  className="p-2 sm:p-2.5 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-30 active:scale-95 transition-transform">
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button onClick={() => setAutoPlay(!autoPlay)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-medium text-xs sm:text-sm flex items-center gap-1.5 active:scale-95 transition-transform ${autoPlay ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                  {autoPlay ? <><Pause className="w-3.5 h-3.5" /> Pause</> : <><Play className="w-3.5 h-3.5" /> Auto Play</>}
                </button>
                <button onClick={() => { handlePhaseChange(0); setAutoPlay(false); }}
                  className="p-2 sm:p-2.5 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 active:scale-95 transition-transform">
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button onClick={() => handlePhaseChange(Math.min(phases.length - 1, currentPhase + 1))}
                  disabled={currentPhase === phases.length - 1}
                  className="p-2 sm:p-2.5 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-30 active:scale-95 transition-transform">
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              <div className="text-center mt-2 text-gray-600 text-[10px] sm:text-xs">Phase {currentPhase + 1} of {phases.length}</div>
            </div>
          </div>

          {/* Phase Info */}
          <motion.div key={phase.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="space-y-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3 mb-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-lg sm:text-xl"
                  style={{ backgroundColor: phase.color + '22', border: `2px solid ${phase.color}` }}>
                  {phase.emoji}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">{phase.name}</h3>
                  <div className="text-[10px] sm:text-xs font-medium" style={{ color: phase.color }}>Stage {currentPhase + 1}</div>
                </div>
              </div>

              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4">{phase.description}</p>

              <h4 className="text-[10px] sm:text-xs font-bold text-white mb-2 uppercase tracking-wider">What's Happening</h4>
              <ul className="space-y-1.5 sm:space-y-2">
                {phase.details.map((detail, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-2 text-[11px] sm:text-sm text-gray-300">
                    <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[8px] sm:text-[10px] font-bold text-white mt-0.5 shrink-0"
                      style={{ backgroundColor: phase.color }}>{i + 1}</span>
                    {detail}
                  </motion.li>
                ))}
              </ul>

              {/* Complete message */}
              {currentPhase === phases.length - 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="mt-4 p-3 rounded-xl bg-gradient-to-r from-purple-900/30 to-emerald-900/30 border border-purple-500/20">
                  <div className="text-sm sm:text-base font-bold text-white mb-1">🎉 Division Complete!</div>
                  <p className="text-gray-300 text-[10px] sm:text-xs">Two identical daughter cells created, each with a complete copy of DNA!</p>
                </motion.div>
              )}
            </div>

            {/* Mini quiz */}
            {phase.quiz && (
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 sm:p-5">
                <button onClick={() => setShowQuiz(!showQuiz)}
                  className="w-full text-left text-xs sm:text-sm font-bold text-yellow-400 flex items-center gap-2">
                  🧩 Quick Check {showQuiz ? '▼' : '▶'}
                </button>
                <AnimatePresence>
                  {showQuiz && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <p className="text-xs sm:text-sm text-gray-300 mt-2 mb-2">{phase.quiz.q}</p>
                      <div className="space-y-1.5">
                        {phase.quiz.options.map((opt, i) => (
                          <button key={i} onClick={() => setQuizAnswer(i)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm transition-all ${
                              quizAnswer === null ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 active:scale-[0.98]' :
                              i === phase.quiz!.answer ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              quizAnswer === i ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              'bg-gray-800/50 text-gray-600'
                            }`}
                            disabled={quizAnswer !== null}>
                            {opt}
                          </button>
                        ))}
                      </div>
                      {quizAnswer !== null && (
                        <div className={`mt-2 text-[10px] sm:text-xs font-bold ${quizAnswer === phase.quiz.answer ? 'text-emerald-400' : 'text-red-400'}`}>
                          {quizAnswer === phase.quiz.answer ? '✅ Correct!' : `❌ The answer is: ${phase.quiz.options[phase.quiz.answer]}`}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
