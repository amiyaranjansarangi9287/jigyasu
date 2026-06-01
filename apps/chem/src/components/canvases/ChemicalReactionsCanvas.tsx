import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CanvasProps } from '../../types';

interface Reactant {
  id: string;
  formula: string;
  name: string;
  emoji: string;
}

interface Reaction {
  id: string;
  reactants: string[];
  products: string[];
  type: 'exothermic' | 'endothermic';
  description: string;
  indianContext?: string;
  energyChange: number; // kJ (negative = exo)
  balanced: string;
}

interface BalanceQuestion {
  id: string;
  unbalanced: string;
  terms: { formula: string; coefficient: number }[];
  hint: string;
}

interface EnergyParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

const REACTANTS: Reactant[] = [
  { id: 'h2', formula: 'H₂', name: 'Hydrogen', emoji: '💨' },
  { id: 'o2', formula: 'O₂', name: 'Oxygen', emoji: '🫧' },
  { id: 'vinegar', formula: 'CH₃COOH', name: 'Vinegar', emoji: '🫗' },
  { id: 'soda', formula: 'NaHCO₃', name: 'Baking Soda', emoji: '🧂' },
  { id: 'c', formula: 'C', name: 'Carbon', emoji: '⬛' },
  { id: 'fe', formula: 'Fe', name: 'Iron', emoji: '🔩' },
  { id: 'mg', formula: 'Mg', name: 'Magnesium', emoji: '✨' },
  { id: 'hcl', formula: 'HCl', name: 'Hydrochloric Acid', emoji: '🧪' },
];

const REACTIONS: Reaction[] = [
  {
    id: 'water', reactants: ['h2', 'o2'], products: ['H₂O'], type: 'exothermic',
    description: 'Hydrogen and oxygen combine explosively to form water!',
    indianContext: 'This powers hydrogen fuel cells - clean energy for the future!',
    energyChange: -286, balanced: '2H₂ + O₂ → 2H₂O',
  },
  {
    id: 'volcano', reactants: ['vinegar', 'soda'], products: ['CO₂', 'H₂O', 'NaCH₃COO'], type: 'exothermic',
    description: 'The classic volcano reaction! Vinegar + Baking soda = Fizzy explosion!',
    indianContext: 'This is why dhokla becomes fluffy - CO₂ bubbles!',
    energyChange: -45, balanced: 'CH₃COOH + NaHCO₃ → NaCH₃COO + H₂O + CO₂',
  },
  {
    id: 'rust', reactants: ['fe', 'o2'], products: ['Fe₂O₃'], type: 'exothermic',
    description: 'Iron slowly reacts with oxygen to form rust.',
    indianContext: 'The Iron Pillar of Delhi has resisted rust for 1600 years!',
    energyChange: -824, balanced: '4Fe + 3O₂ → 2Fe₂O₃',
  },
  {
    id: 'combustion', reactants: ['c', 'o2'], products: ['CO₂'], type: 'exothermic',
    description: 'Carbon burns in oxygen to produce carbon dioxide and heat!',
    indianContext: 'This is what happens in a traditional chulha!',
    energyChange: -394, balanced: 'C + O₂ → CO₂',
  },
  {
    id: 'magnesium', reactants: ['mg', 'hcl'], products: ['MgCl₂', 'H₂↑'], type: 'exothermic',
    description: 'Magnesium dissolves in acid with vigorous bubbling!',
    indianContext: 'Magnesium burns brilliantly in Diwali sparklers!',
    energyChange: -462, balanced: 'Mg + 2HCl → MgCl₂ + H₂',
  },
];

const BALANCE_QUESTIONS: BalanceQuestion[] = [
  { id: 'b1', unbalanced: '_H₂ + _O₂ → _H₂O', terms: [{ formula: 'H₂', coefficient: 2 }, { formula: 'O₂', coefficient: 1 }, { formula: 'H₂O', coefficient: 2 }], hint: 'Count hydrogen: 4 on left needs 4 on right' },
  { id: 'b2', unbalanced: '_Fe + _O₂ → _Fe₂O₃', terms: [{ formula: 'Fe', coefficient: 4 }, { formula: 'O₂', coefficient: 3 }, { formula: 'Fe₂O₃', coefficient: 2 }], hint: 'Start with iron, then balance oxygen' },
  { id: 'b3', unbalanced: '_N₂ + _H₂ → _NH₃', terms: [{ formula: 'N₂', coefficient: 1 }, { formula: 'H₂', coefficient: 3 }, { formula: 'NH₃', coefficient: 2 }], hint: 'Each N₂ gives 2 nitrogen atoms' },
  { id: 'b4', unbalanced: '_Mg + _HCl → _MgCl₂ + _H₂', terms: [{ formula: 'Mg', coefficient: 1 }, { formula: 'HCl', coefficient: 2 }, { formula: 'MgCl₂', coefficient: 1 }, { formula: 'H₂', coefficient: 1 }], hint: 'MgCl₂ needs 2 chlorines' },
  { id: 'b5', unbalanced: '_CH₄ + _O₂ → _CO₂ + _H₂O', terms: [{ formula: 'CH₄', coefficient: 1 }, { formula: 'O₂', coefficient: 2 }, { formula: 'CO₂', coefficient: 1 }, { formula: 'H₂O', coefficient: 2 }], hint: 'Count carbons first, then hydrogens, then oxygens' },
];

type ViewMode = 'react' | 'balance' | 'energy';

export default function ChemicalReactionsCanvas({ isPlaying }: CanvasProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('react');
  const [selectedReactants, setSelectedReactants] = useState<string[]>([]);
  const [activeReaction, setActiveReaction] = useState<Reaction | null>(null);
  const [isReacting, setIsReacting] = useState(false);
  const [showProducts, setShowProducts] = useState(false);

  // Balancer state
  const [currentBQ, setCurrentBQ] = useState(0);
  const [userCoeffs, setUserCoeffs] = useState<number[]>([1, 1, 1, 1]);
  const [balanceResult, setBalanceResult] = useState<'correct' | 'wrong' | null>(null);
  const [balanceScore, setBalanceScore] = useState(0);

  // Energy diagram particles
  const [energyParticles, setEnergyParticles] = useState<EnergyParticle[]>([]);
  const animRef = useRef<number | null>(null);
  const particleIdRef = useRef(0);

  // Energy particle animation
  const animateParticles = useCallback(() => {
    setEnergyParticles(prev =>
      prev
        .map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.1,
          life: p.life - 1,
          size: p.size * 0.98,
        }))
        .filter(p => p.life > 0)
    );
    animRef.current = requestAnimationFrame(animateParticles);
  }, []);

  useEffect(() => {
    if (isReacting && isPlaying) {
      animRef.current = requestAnimationFrame(animateParticles);
    }
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [isReacting, isPlaying, animateParticles]);

  const spawnParticles = (type: 'exothermic' | 'endothermic') => {
    const newParticles: EnergyParticle[] = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: particleIdRef.current++,
        x: 150 + (Math.random() - 0.5) * 60,
        y: type === 'exothermic' ? 100 : 80,
        vx: (Math.random() - 0.5) * 6,
        vy: type === 'exothermic' ? -(Math.random() * 4 + 2) : (Math.random() * 2 + 1),
        life: 40 + Math.random() * 30,
        color: type === 'exothermic'
          ? ['#f97316', '#ef4444', '#fbbf24', '#f43f5e'][Math.floor(Math.random() * 4)]
          : ['#06b6d4', '#3b82f6', '#8b5cf6', '#a855f7'][Math.floor(Math.random() * 4)],
        size: 3 + Math.random() * 5,
      });
    }
    setEnergyParticles(prev => [...prev, ...newParticles]);
  };

  const toggleReactant = (id: string) => {
    if (!isPlaying || isReacting) return;
    setSelectedReactants(prev => {
      if (prev.includes(id)) return prev.filter(r => r !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
    setActiveReaction(null);
    setShowProducts(false);
  };

  const checkReaction = () => {
    if (selectedReactants.length < 2 || !isPlaying) return;

    const matchedReaction = REACTIONS.find(r => {
      const sortedSelected = [...selectedReactants].sort();
      const sortedRequired = [...r.reactants].sort();
      return JSON.stringify(sortedSelected) === JSON.stringify(sortedRequired);
    });

    if (matchedReaction) {
      setIsReacting(true);
      setActiveReaction(matchedReaction);
      spawnParticles(matchedReaction.type);

      setTimeout(() => {
        setShowProducts(true);
        setIsReacting(false);
      }, 2500);
    }
  };

  const reset = () => {
    setSelectedReactants([]);
    setActiveReaction(null);
    setShowProducts(false);
    setEnergyParticles([]);
  };

  // Balancer logic
  const balanceQuestion = BALANCE_QUESTIONS[currentBQ];

  const updateCoeff = (index: number, delta: number) => {
    setUserCoeffs(prev => {
      const next = [...prev];
      next[index] = Math.max(1, Math.min(6, next[index] + delta));
      return next;
    });
    setBalanceResult(null);
  };

  const checkBalance = () => {
    const correct = balanceQuestion.terms.every((t, i) => userCoeffs[i] === t.coefficient);
    setBalanceResult(correct ? 'correct' : 'wrong');
    if (correct) setBalanceScore(prev => prev + 1);
  };

  const nextBalanceQuestion = () => {
    setCurrentBQ(prev => (prev + 1) % BALANCE_QUESTIONS.length);
    setUserCoeffs([1, 1, 1, 1]);
    setBalanceResult(null);
  };

  const getReactantData = (id: string) => REACTANTS.find(r => r.id === id);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Mode Tabs */}
      <div className="flex gap-2">
        {[
          { mode: 'react' as ViewMode, label: '💥 React' },
          { mode: 'balance' as ViewMode, label: '⚖️ Balance' },
          { mode: 'energy' as ViewMode, label: '📊 Energy' },
        ].map(({ mode, label }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              viewMode === mode ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* REACT MODE */}
      {viewMode === 'react' && (
        <>
          <h3 className="text-xl font-bold text-emerald-400">💥 Chemical Reactions</h3>

          {/* Reaction Zone */}
          <div className="relative w-full max-w-md h-52 bg-slate-800/50 rounded-2xl border-2 border-slate-600 overflow-hidden">
            {/* Energy particles */}
            {energyParticles.map(p => (
              <div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: p.x,
                  top: p.y,
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  opacity: p.life / 60,
                  filter: 'blur(1px)',
                }}
              />
            ))}

            {/* Background flash */}
            <AnimatePresence>
              {isReacting && activeReaction && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.6, 0.2, 0.5, 0] }}
                  transition={{ duration: 2 }}
                  className={`absolute inset-0 ${
                    activeReaction.type === 'exothermic'
                      ? 'bg-gradient-radial from-orange-500/40 to-transparent'
                      : 'bg-gradient-radial from-blue-500/40 to-transparent'
                  }`}
                />
              )}
            </AnimatePresence>

            <div className="relative z-10 h-full flex items-center justify-center gap-3 px-4">
              {/* Reactant 1 */}
              <div className="w-20 h-20 rounded-xl bg-slate-700/80 flex flex-col items-center justify-center backdrop-blur-sm">
                {selectedReactants[0] ? (
                  <motion.div animate={{ scale: isReacting ? [1, 0] : 1 }} transition={{ duration: 1.5 }} className="text-center">
                    <span className="text-2xl">{getReactantData(selectedReactants[0])?.emoji}</span>
                    <p className="text-xs text-slate-300 font-mono">{getReactantData(selectedReactants[0])?.formula}</p>
                  </motion.div>
                ) : (
                  <span className="text-slate-500 text-xs text-center">Pick<br/>reactant</span>
                )}
              </div>

              <span className="text-2xl text-slate-400 font-bold">+</span>

              {/* Reactant 2 */}
              <div className="w-20 h-20 rounded-xl bg-slate-700/80 flex flex-col items-center justify-center backdrop-blur-sm">
                {selectedReactants[1] ? (
                  <motion.div animate={{ scale: isReacting ? [1, 0] : 1 }} transition={{ duration: 1.5 }} className="text-center">
                    <span className="text-2xl">{getReactantData(selectedReactants[1])?.emoji}</span>
                    <p className="text-xs text-slate-300 font-mono">{getReactantData(selectedReactants[1])?.formula}</p>
                  </motion.div>
                ) : (
                  <span className="text-slate-500 text-xs text-center">Pick<br/>reactant</span>
                )}
              </div>

              <motion.span className="text-2xl text-emerald-400" animate={isReacting ? { x: [0, 10, 0], scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.4, repeat: isReacting ? 6 : 0 }}>
                →
              </motion.span>

              {/* Products */}
              <div className="w-28 min-h-[80px] rounded-xl bg-slate-700/80 flex flex-col items-center justify-center p-2 backdrop-blur-sm">
                <AnimatePresence>
                  {showProducts && activeReaction ? (
                    <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} className="text-center">
                      {activeReaction.products.map((product, i) => (
                        <motion.p key={product} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} className="text-sm text-emerald-400 font-mono">
                          {product}
                        </motion.p>
                      ))}
                    </motion.div>
                  ) : (
                    <span className="text-slate-500 text-xs">Products</span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Reaction Info */}
          <AnimatePresence>
            {activeReaction && showProducts && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`p-4 rounded-xl max-w-sm text-center text-white ${activeReaction.type === 'exothermic' ? 'bg-gradient-to-r from-orange-600 to-red-600' : 'bg-gradient-to-r from-blue-600 to-cyan-600'}`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-2xl">{activeReaction.type === 'exothermic' ? '🔥' : '❄️'}</span>
                  <span className="font-bold">{activeReaction.type === 'exothermic' ? 'Exothermic' : 'Endothermic'} ({activeReaction.energyChange} kJ)</span>
                </div>
                <p className="text-sm font-mono mb-2 bg-white/10 rounded-lg px-3 py-1">{activeReaction.balanced}</p>
                <p className="text-sm opacity-90">{activeReaction.description}</p>
                {activeReaction.indianContext && <p className="text-sm mt-2 opacity-80">🇮🇳 {activeReaction.indianContext}</p>}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reactant Selection */}
          <div className="grid grid-cols-4 gap-2 w-full max-w-sm">
            {REACTANTS.map(reactant => (
              <motion.button key={reactant.id} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} onClick={() => toggleReactant(reactant.id)} disabled={isReacting}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${selectedReactants.includes(reactant.id) ? 'bg-emerald-600 ring-2 ring-emerald-400' : 'bg-slate-700 hover:bg-slate-600'}`}>
                <span className="text-xl">{reactant.emoji}</span>
                <span className="text-[10px] text-slate-300 font-mono">{reactant.formula}</span>
              </motion.button>
            ))}
          </div>

          <div className="flex gap-3">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={checkReaction} disabled={selectedReactants.length < 2 || isReacting || !isPlaying} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 disabled:opacity-50 rounded-xl text-white font-bold">
              ⚗️ React!
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={reset} className="px-4 py-3 bg-slate-600 hover:bg-slate-500 rounded-xl text-white">
              🔄 Reset
            </motion.button>
          </div>
        </>
      )}

      {/* BALANCE MODE */}
      {viewMode === 'balance' && (
        <>
          <h3 className="text-xl font-bold text-amber-400">⚖️ Balance the Equation</h3>
          <p className="text-slate-400 text-sm">Adjust coefficients so atoms are equal on both sides!</p>
          <p className="text-amber-400 font-bold">Score: {balanceScore}</p>

          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 w-full max-w-md">
            {/* Equation display */}
            <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
              {balanceQuestion.terms.map((term, i) => {
                const isProduct = i >= balanceQuestion.terms.length - (balanceQuestion.terms.length === 4 ? 2 : 1);
                const showArrow = !isProduct && i === (balanceQuestion.terms.length === 4 ? 1 : balanceQuestion.terms.length === 3 ? 1 : 0);
                const showPlus = i > 0 && ((isProduct && i > balanceQuestion.terms.length - (balanceQuestion.terms.length === 4 ? 2 : 1)) || (!isProduct && i > 0 && i < (balanceQuestion.terms.length === 4 ? 2 : balanceQuestion.terms.length === 3 ? 2 : 1)));

                return (
                  <div key={i} className="flex items-center gap-2">
                    {showPlus && <span className="text-slate-400 text-lg font-bold">+</span>}
                    {showArrow && <span className="text-emerald-400 text-xl mx-2">→</span>}
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateCoeff(i, -1)} className="w-7 h-7 bg-slate-700 hover:bg-slate-600 rounded text-white font-bold text-lg">−</button>
                        <motion.span key={userCoeffs[i]} initial={{ scale: 1.3 }} animate={{ scale: 1 }}
                          className={`w-8 h-8 flex items-center justify-center rounded font-bold text-lg ${
                            balanceResult === 'correct' ? 'bg-green-600' :
                            balanceResult === 'wrong' && userCoeffs[i] !== term.coefficient ? 'bg-red-600' :
                            'bg-slate-600'
                          } text-white`}>
                          {userCoeffs[i]}
                        </motion.span>
                        <button onClick={() => updateCoeff(i, 1)} className="w-7 h-7 bg-slate-700 hover:bg-slate-600 rounded text-white font-bold text-lg">+</button>
                      </div>
                      <span className="text-white font-mono text-sm mt-1">{term.formula}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hint */}
            <p className="text-xs text-slate-500 text-center mb-4">💡 {balanceQuestion.hint}</p>

            {/* Result */}
            <AnimatePresence>
              {balanceResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`text-center p-3 rounded-xl mb-4 ${balanceResult === 'correct' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
                  {balanceResult === 'correct' ? '🎉 Perfectly balanced!' : '❌ Not balanced yet. Check atom counts!'}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 justify-center">
              <button onClick={checkBalance} disabled={balanceResult === 'correct'} className="px-6 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-600 rounded-xl text-white font-bold">
                Check Balance
              </button>
              {balanceResult === 'correct' && (
                <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} onClick={nextBalanceQuestion} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-bold">
                  Next →
                </motion.button>
              )}
            </div>
          </div>
        </>
      )}

      {/* ENERGY MODE */}
      {viewMode === 'energy' && (
        <>
          <h3 className="text-xl font-bold text-cyan-400">📊 Energy in Reactions</h3>

          <div className="w-full max-w-md space-y-4">
            {/* Energy Diagram */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h4 className="text-sm text-slate-400 mb-4 text-center">Tap a reaction to see its energy profile</h4>

              <div className="relative h-44 border-l-2 border-b-2 border-slate-600 ml-8">
                {/* Y axis label */}
                <span className="absolute -left-8 top-1/2 transform -rotate-90 text-xs text-slate-500 whitespace-nowrap">Energy (kJ)</span>

                {/* Energy bars */}
                <div className="flex items-end justify-around h-full px-4 pb-1">
                  {REACTIONS.slice(0, 5).map(reaction => {
                    const barHeight = Math.min(90, Math.abs(reaction.energyChange) / 10);
                    return (
                      <motion.button
                        key={reaction.id}
                        onClick={() => {
                          setActiveReaction(reaction);
                          setShowProducts(true);
                        }}
                        whileHover={{ scale: 1.1 }}
                        className="flex flex-col items-center gap-1"
                      >
                        <span className="text-xs text-slate-500">{reaction.energyChange}kJ</span>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${barHeight}%` }}
                          transition={{ duration: 0.5 }}
                          className={`w-8 rounded-t ${
                            reaction.type === 'exothermic'
                              ? 'bg-gradient-to-t from-orange-600 to-red-500'
                              : 'bg-gradient-to-t from-blue-600 to-cyan-500'
                          }`}
                        />
                        <span className="text-[10px] text-slate-400 w-10 text-center truncate">
                          {reaction.products[0]}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Exo vs Endo Comparison */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-orange-900/20 border border-orange-500/30 rounded-xl p-3">
                <h5 className="font-bold text-orange-400 mb-2">🔥 Exothermic</h5>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li>• Releases energy</li>
                  <li>• Feels hot</li>
                  <li>• Products lower energy</li>
                  <li>• E.g., burning, rusting</li>
                </ul>
              </div>
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-3">
                <h5 className="font-bold text-blue-400 mb-2">❄️ Endothermic</h5>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li>• Absorbs energy</li>
                  <li>• Feels cold</li>
                  <li>• Products higher energy</li>
                  <li>• E.g., photosynthesis</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Indian context footer */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-amber-900/30 border border-amber-500/30 rounded-xl p-3 max-w-sm text-center">
        <p className="text-sm text-amber-200">
          <span className="font-bold">💡 Try:</span> Magnesium + HCl for a vigorous reaction, or balance the methane combustion equation!
        </p>
      </motion.div>
    </div>
  );
}
