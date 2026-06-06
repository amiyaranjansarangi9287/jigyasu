import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CanvasProps } from '../../types';
import { KnowledgeCheck, TakeawayBox } from '../ui';

interface AtomConfig {
  protons: number;
  neutrons: number;
  electrons: number;
  name: string;
  symbol: string;
}

const ELEMENTS: AtomConfig[] = [
  { protons: 1, neutrons: 0, electrons: 1, name: 'Hydrogen', symbol: 'H' },
  { protons: 2, neutrons: 2, electrons: 2, name: 'Helium', symbol: 'He' },
  { protons: 3, neutrons: 4, electrons: 3, name: 'Lithium', symbol: 'Li' },
  { protons: 4, neutrons: 5, electrons: 4, name: 'Beryllium', symbol: 'Be' },
  { protons: 5, neutrons: 6, electrons: 5, name: 'Boron', symbol: 'B' },
  { protons: 6, neutrons: 6, electrons: 6, name: 'Carbon', symbol: 'C' },
  { protons: 7, neutrons: 7, electrons: 7, name: 'Nitrogen', symbol: 'N' },
  { protons: 8, neutrons: 8, electrons: 8, name: 'Oxygen', symbol: 'O' },
  { protons: 9, neutrons: 10, electrons: 9, name: 'Fluorine', symbol: 'F' },
  { protons: 10, neutrons: 10, electrons: 10, name: 'Neon', symbol: 'Ne' },
  { protons: 11, neutrons: 12, electrons: 11, name: 'Sodium', symbol: 'Na' },
  { protons: 12, neutrons: 12, electrons: 12, name: 'Magnesium', symbol: 'Mg' },
];

type Mode = 'build' | 'explore' | 'quiz';

export default function AtomicStructureCanvas({ isPlaying }: CanvasProps) {
  const [mode, setMode] = useState<Mode>('explore');
  const [protons, setProtons] = useState(1);
  const [neutrons, setNeutrons] = useState(0);
  const [electrons, setElectrons] = useState(1);
  const [selectedElement, setSelectedElement] = useState<AtomConfig | null>(ELEMENTS[0]);
  const [quizTarget, setQuizTarget] = useState<AtomConfig | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const animationRef = useRef<number | null>(null);
  const [rotation, setRotation] = useState(0);

  // Animation for electron orbits
  useEffect(() => {
    if (!isPlaying) return;
    
    const animate = () => {
      setRotation(prev => (prev + 1) % 360);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying]);

  // Check if build matches an element
  useEffect(() => {
    if (mode === 'build') {
      const match = ELEMENTS.find(
        e => e.protons === protons && e.neutrons === neutrons && e.electrons === electrons
      );
      setSelectedElement(match || null);
    }
  }, [protons, neutrons, electrons, mode]);

  // Quiz mode
  useEffect(() => {
    if (mode === 'quiz' && !quizTarget) {
      setQuizTarget(ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)]);
    }
  }, [mode, quizTarget]);

  const checkQuizAnswer = () => {
    if (!quizTarget) return;
    
    if (protons === quizTarget.protons && 
        neutrons === quizTarget.neutrons && 
        electrons === quizTarget.electrons) {
      setQuizScore(prev => prev + 1);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setQuizTarget(ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)]);
        setProtons(1);
        setNeutrons(0);
        setElectrons(1);
      }, 1500);
    }
  };

  const getElectronShells = (count: number): number[] => {
    const shells: number[] = [];
    let remaining = count;
    const maxPerShell = [2, 8, 8, 18];
    
    for (const max of maxPerShell) {
      if (remaining <= 0) break;
      const inShell = Math.min(remaining, max);
      shells.push(inShell);
      remaining -= inShell;
    }
    
    return shells;
  };

  const displayElement = mode === 'explore' ? selectedElement : 
    (mode === 'build' ? selectedElement : quizTarget);
  const shells = getElectronShells(mode === 'explore' ? (selectedElement?.electrons || 0) : electrons);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Mode Selector */}
      <div className="flex gap-2">
        {(['explore', 'build', 'quiz'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              if (m === 'explore') setSelectedElement(ELEMENTS[0]);
              if (m === 'quiz') setQuizTarget(null);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              mode === m ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}
          >
            {m === 'explore' ? '🔭 Explore' : m === 'build' ? '🔧 Build' : '🎯 Quiz'}
          </button>
        ))}
      </div>

      {mode === 'quiz' && (
        <div className="text-center">
          <p className="text-amber-400 font-bold">Build: {quizTarget?.name} ({quizTarget?.symbol})</p>
          <p className="text-slate-400 text-sm">Score: {quizScore}</p>
        </div>
      )}

      {/* Atom Visualization */}
      <div className="relative w-72 h-72">
        {/* Electron shells/orbits */}
        {shells.map((_, shellIndex) => (
          <motion.div
            key={shellIndex}
            className="absolute rounded-full border border-slate-600/50"
            style={{
              width: `${(shellIndex + 1) * 80 + 40}px`,
              height: `${(shellIndex + 1) * 80 + 40}px`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}

        {/* Nucleus */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 min-h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/30"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-center">
            <p className="text-white text-xs font-bold">{mode === 'explore' ? selectedElement?.protons : protons}p</p>
            <p className="text-white/70 text-xs">{mode === 'explore' ? selectedElement?.neutrons : neutrons}n</p>
          </div>
        </motion.div>

        {/* Electrons */}
        {shells.map((electronsInShell, shellIndex) => {
          const radius = (shellIndex + 1) * 40 + 20;
          return Array.from({ length: electronsInShell }).map((_, eIndex) => {
            const angle = (rotation + (eIndex * 360) / electronsInShell) * (Math.PI / 180);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            return (
              <motion.div
                key={`${shellIndex}-${eIndex}`}
                className="absolute w-4 h-4 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
              />
            );
          });
        })}

        {/* Element symbol */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 text-center">
          {displayElement ? (
            <>
              <p className="text-3xl font-bold text-white">{displayElement.symbol}</p>
              <p className="text-sm text-slate-400">{displayElement.name}</p>
            </>
          ) : mode === 'build' && (
            <p className="text-sm text-amber-400">Unknown Element</p>
          )}
        </div>
      </div>

      {/* Controls */}
      {mode === 'explore' ? (
        <div className="grid grid-cols-4 gap-2 max-w-md">
          {ELEMENTS.map(elem => (
            <motion.button
              key={elem.symbol}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedElement(elem)}
              className={`p-2 rounded-xl text-center transition-all ${
                selectedElement?.symbol === elem.symbol
                  ? 'bg-emerald-600 ring-2 ring-emerald-400'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              <p className="text-lg font-bold text-white">{elem.symbol}</p>
              <p className="text-[10px] text-slate-400">{elem.name}</p>
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="space-y-3 w-full max-w-sm">
          {/* Protons */}
          <div className="flex items-center gap-3">
            <span className="w-20 text-red-400 font-semibold">Protons</span>
            <button
              onClick={() => setProtons(Math.max(1, protons - 1))}
              className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
            >-</button>
            <span className="w-8 text-center text-white font-bold">{protons}</span>
            <button
              onClick={() => setProtons(Math.min(12, protons + 1))}
              className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
            >+</button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(protons, 6) }).map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-red-500" />
              ))}
              {protons > 6 && <span className="text-red-400 text-xs">+{protons - 6}</span>}
            </div>
          </div>

          {/* Neutrons */}
          <div className="flex items-center gap-3">
            <span className="w-20 text-gray-400 font-semibold">Neutrons</span>
            <button
              onClick={() => setNeutrons(Math.max(0, neutrons - 1))}
              className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
            >-</button>
            <span className="w-8 text-center text-white font-bold">{neutrons}</span>
            <button
              onClick={() => setNeutrons(Math.min(14, neutrons + 1))}
              className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
            >+</button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(neutrons, 6) }).map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-gray-500" />
              ))}
              {neutrons > 6 && <span className="text-gray-400 text-xs">+{neutrons - 6}</span>}
            </div>
          </div>

          {/* Electrons */}
          <div className="flex items-center gap-3">
            <span className="w-20 text-blue-400 font-semibold">Electrons</span>
            <button
              onClick={() => setElectrons(Math.max(0, electrons - 1))}
              className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
            >-</button>
            <span className="w-8 text-center text-white font-bold">{electrons}</span>
            <button
              onClick={() => setElectrons(Math.min(12, electrons + 1))}
              className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
            >+</button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(electrons, 6) }).map((_, i) => (
                <div key={i} className="w-3 h-3 rounded-full bg-blue-400" />
              ))}
              {electrons > 6 && <span className="text-blue-400 text-xs">+{electrons - 6}</span>}
            </div>
          </div>

          {mode === 'quiz' && (
            <button
              onClick={checkQuizAnswer}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-bold"
            >
              Check Answer
            </button>
          )}
        </div>
      )}

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-green-600 px-6 py-3 rounded-xl text-white font-bold"
          >
            🎉 Correct! +1 Point
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Panel */}
      {mode === 'explore' && selectedElement && (
        <div className="bg-slate-800/50 rounded-xl p-4 max-w-sm">
          <h4 className="font-bold text-white mb-2">{selectedElement.name} Facts</h4>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="bg-red-600/20 p-2 rounded-lg">
              <p className="text-red-400 font-bold">{selectedElement.protons}</p>
              <p className="text-xs text-slate-400">Protons</p>
            </div>
            <div className="bg-gray-600/20 p-2 rounded-lg">
              <p className="text-gray-400 font-bold">{selectedElement.neutrons}</p>
              <p className="text-xs text-slate-400">Neutrons</p>
            </div>
            <div className="bg-blue-600/20 p-2 rounded-lg">
              <p className="text-blue-400 font-bold">{selectedElement.electrons}</p>
              <p className="text-xs text-slate-400">Electrons</p>
            </div>
          </div>
        </div>
      )}

      {/* Indian Context */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-3 max-w-sm text-center"
      >
        <p className="text-sm text-emerald-200">
          <span className="font-bold">🇮🇳 Homi Bhabha</span> founded India's atomic energy program. 
          The Bhabha Atomic Research Centre (BARC) continues his legacy of peaceful nuclear science!
        </p>
      </motion.div>

      <KnowledgeCheck
        prompt="An atom of Carbon has 6 protons. How many electrons does a neutral Carbon atom have?"
        options={["0 (electrons are optional)", "6 (same as protons)", "12 (always double)", "It depends on the temperature"]}
        correctIndex={1}
        explanation="In a neutral atom, the number of electrons equals the number of protons. Carbon has 6 protons, so it must have 6 electrons to balance the charge. The first shell holds 2, and the second shell holds the remaining 4."
        retryHint="Remember: neutral means no overall charge. If +6 from protons, how many - are needed?"
      />

      <TakeawayBox
        title="⚡ Atomic Structure - Key Takeaways"
        cards={[
          { type: 'key', text: 'Protons (positive) and neutrons (neutral) live in the nucleus. Electrons (negative) orbit in shells around it.' },
          { type: 'key', text: 'Number of protons = Identity of the element. Change protons → change element!' },
          { type: 'tip', text: 'Electrons fill shells in order: 1st shell holds 2, 2nd holds 8. The outermost shell determines reactivity.' },
          { type: 'fun', text: 'Homi Bhabha\'s BARC in Mumbai uses India\'s first nuclear reactor, Apsara, since 1956!' },
        ]}
        indianContext="India's nuclear program, started by Homi Bhabha, is among the most advanced in Asia. India even has a nuclear-powered submarine!"
      />
    </div>
  );
}
