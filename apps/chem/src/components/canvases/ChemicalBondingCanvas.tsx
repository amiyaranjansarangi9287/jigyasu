import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CanvasProps } from '../../types';

interface BondExample {
  id: string;
  name: string;
  formula: string;
  type: 'ionic' | 'covalent';
  atoms: { symbol: string; electrons: number; color: string }[];
  description: string;
  indianContext?: string;
}

const BOND_EXAMPLES: BondExample[] = [
  {
    id: 'nacl',
    name: 'Sodium Chloride',
    formula: 'NaCl',
    type: 'ionic',
    atoms: [
      { symbol: 'Na', electrons: 1, color: 'bg-purple-500' },
      { symbol: 'Cl', electrons: 7, color: 'bg-green-500' },
    ],
    description: 'Sodium gives its 1 electron to Chlorine. Both become stable!',
    indianContext: 'Table salt - namak in every Indian kitchen!',
  },
  {
    id: 'h2o',
    name: 'Water',
    formula: 'H₂O',
    type: 'covalent',
    atoms: [
      { symbol: 'H', electrons: 1, color: 'bg-white' },
      { symbol: 'O', electrons: 6, color: 'bg-red-500' },
      { symbol: 'H', electrons: 1, color: 'bg-white' },
    ],
    description: 'Oxygen shares electrons with two Hydrogen atoms.',
    indianContext: 'Paani - the elixir of life!',
  },
  {
    id: 'co2',
    name: 'Carbon Dioxide',
    formula: 'CO₂',
    type: 'covalent',
    atoms: [
      { symbol: 'O', electrons: 6, color: 'bg-red-500' },
      { symbol: 'C', electrons: 4, color: 'bg-gray-700' },
      { symbol: 'O', electrons: 6, color: 'bg-red-500' },
    ],
    description: 'Carbon shares 2 electrons each with 2 Oxygen atoms (double bonds).',
    indianContext: 'What we breathe out and plants breathe in!',
  },
  {
    id: 'mgcl2',
    name: 'Magnesium Chloride',
    formula: 'MgCl₂',
    type: 'ionic',
    atoms: [
      { symbol: 'Cl', electrons: 7, color: 'bg-green-500' },
      { symbol: 'Mg', electrons: 2, color: 'bg-orange-500' },
      { symbol: 'Cl', electrons: 7, color: 'bg-green-500' },
    ],
    description: 'Magnesium gives 1 electron to each Chlorine atom.',
    indianContext: 'Found in sea water and bittern (nigari)!',
  },
  {
    id: 'ch4',
    name: 'Methane',
    formula: 'CH₄',
    type: 'covalent',
    atoms: [
      { symbol: 'H', electrons: 1, color: 'bg-white' },
      { symbol: 'C', electrons: 4, color: 'bg-gray-700' },
    ],
    description: 'Carbon shares 1 electron with each of 4 Hydrogen atoms.',
    indianContext: 'Main component of gobar gas!',
  },
];

type ViewMode = 'learn' | 'compare' | 'build';

export default function ChemicalBondingCanvas({ isPlaying }: CanvasProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('learn');
  const [selectedBond, setSelectedBond] = useState<BondExample>(BOND_EXAMPLES[0]);
  const [showTransfer, setShowTransfer] = useState(false);
  const [buildAtom1, setBuildAtom1] = useState<string>('Na');
  const [buildAtom2, setBuildAtom2] = useState<string>('Cl');

  const triggerAnimation = () => {
    if (!isPlaying) return;
    setShowTransfer(true);
    setTimeout(() => setShowTransfer(false), 2000);
  };

  const ATOMS_FOR_BUILD = [
    { symbol: 'H', name: 'Hydrogen', valence: 1, color: 'bg-white text-black' },
    { symbol: 'O', name: 'Oxygen', valence: 2, color: 'bg-red-500' },
    { symbol: 'C', name: 'Carbon', valence: 4, color: 'bg-gray-700' },
    { symbol: 'N', name: 'Nitrogen', valence: 3, color: 'bg-blue-500' },
    { symbol: 'Na', name: 'Sodium', valence: 1, color: 'bg-purple-500' },
    { symbol: 'Cl', name: 'Chlorine', valence: 1, color: 'bg-green-500' },
    { symbol: 'Mg', name: 'Magnesium', valence: 2, color: 'bg-orange-500' },
    { symbol: 'Ca', name: 'Calcium', valence: 2, color: 'bg-yellow-500' },
  ];

  const getBondType = (a1: string, a2: string): 'ionic' | 'covalent' | 'unknown' => {
    const metals = ['Na', 'Mg', 'Ca', 'K'];
    const nonMetals = ['Cl', 'O', 'N', 'H', 'C'];
    
    const a1IsMetal = metals.includes(a1);
    const a2IsMetal = metals.includes(a2);
    const a1IsNonMetal = nonMetals.includes(a1);
    const a2IsNonMetal = nonMetals.includes(a2);

    if ((a1IsMetal && a2IsNonMetal) || (a1IsNonMetal && a2IsMetal)) {
      return 'ionic';
    }
    if (a1IsNonMetal && a2IsNonMetal) {
      return 'covalent';
    }
    return 'unknown';
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Mode Selector */}
      <div className="flex gap-2">
        {(['learn', 'compare', 'build'] as ViewMode[]).map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              viewMode === mode ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}
          >
            {mode === 'learn' ? '📚 Learn' : mode === 'compare' ? '⚖️ Compare' : '🔧 Build'}
          </button>
        ))}
      </div>

      {/* LEARN MODE */}
      {viewMode === 'learn' && (
        <>
          <h3 className="text-xl font-bold text-emerald-400">🔗 Chemical Bonding</h3>

          {/* Bond Selector */}
          <div className="flex flex-wrap gap-2 justify-center">
            {BOND_EXAMPLES.map(bond => (
              <button
                key={bond.id}
                onClick={() => {
                  setSelectedBond(bond);
                  setShowTransfer(false);
                }}
                className={`px-3 py-2 rounded-xl text-sm transition-all ${
                  selectedBond.id === bond.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {bond.formula}
              </button>
            ))}
          </div>

          {/* Bond Visualization */}
          <div className="relative w-80 h-48 bg-slate-800/50 rounded-2xl border border-slate-700 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedBond.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-4"
              >
                {selectedBond.type === 'ionic' ? (
                  // Ionic bond visualization
                  <>
                    <motion.div
                      className={`w-16 h-16 rounded-full ${selectedBond.atoms[0].color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                      animate={showTransfer ? { x: 20 } : { x: 0 }}
                    >
                      {selectedBond.atoms[0].symbol}
                      {showTransfer && (
                        <motion.span
                          className="absolute -top-2 -right-2 text-lg"
                          initial={{ x: 0 }}
                          animate={{ x: 50 }}
                          transition={{ duration: 0.5 }}
                        >
                          ⚡
                        </motion.span>
                      )}
                    </motion.div>
                    
                    <div className="flex flex-col items-center">
                      <span className="text-slate-400 text-sm">
                        {showTransfer ? 'Electron Transfer!' : 'Ionic Bond'}
                      </span>
                      <motion.div
                        className="w-8 h-1 bg-amber-400 rounded-full my-2"
                        animate={{ scaleX: showTransfer ? 1.5 : 1 }}
                      />
                    </div>

                    <motion.div
                      className={`w-16 h-16 rounded-full ${selectedBond.atoms[1].color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}
                      animate={showTransfer ? { x: -20 } : { x: 0 }}
                    >
                      {selectedBond.atoms[1].symbol}
                    </motion.div>
                  </>
                ) : (
                  // Covalent bond visualization
                  <div className="flex items-center">
                    {selectedBond.atoms.map((atom, i) => (
                      <motion.div key={i} className="flex items-center">
                        <motion.div
                          className={`w-14 h-14 rounded-full ${atom.color} flex items-center justify-center font-bold text-lg shadow-lg ${
                            atom.symbol === 'H' ? 'text-black' : 'text-white'
                          }`}
                          animate={showTransfer ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ delay: i * 0.2 }}
                        >
                          {atom.symbol}
                        </motion.div>
                        {i < selectedBond.atoms.length - 1 && (
                          <motion.div
                            className="w-6 h-1 bg-emerald-400 rounded-full mx-1"
                            animate={showTransfer ? { 
                              backgroundColor: ['#10B981', '#FBBF24', '#10B981']
                            } : {}}
                            transition={{ duration: 1, repeat: showTransfer ? 2 : 0 }}
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Bond type badge */}
            <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${
              selectedBond.type === 'ionic' 
                ? 'bg-amber-600 text-white' 
                : 'bg-cyan-600 text-white'
            }`}>
              {selectedBond.type === 'ionic' ? '⚡ Ionic' : '🤝 Covalent'}
            </div>
          </div>

          {/* Animate Button */}
          <button
            onClick={triggerAnimation}
            className="px-6 py-2 bg-amber-600 hover:bg-amber-500 rounded-xl text-white font-semibold"
          >
            ▶️ Show {selectedBond.type === 'ionic' ? 'Electron Transfer' : 'Electron Sharing'}
          </button>

          {/* Description */}
          <div className="bg-slate-800/50 rounded-xl p-4 max-w-sm">
            <h4 className="font-bold text-white mb-2">{selectedBond.name}</h4>
            <p className="text-sm text-slate-300 mb-2">{selectedBond.description}</p>
            {selectedBond.indianContext && (
              <p className="text-sm text-emerald-400">🇮🇳 {selectedBond.indianContext}</p>
            )}
          </div>
        </>
      )}

      {/* COMPARE MODE */}
      {viewMode === 'compare' && (
        <>
          <h3 className="text-xl font-bold text-emerald-400">⚖️ Ionic vs Covalent</h3>

          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            {/* Ionic */}
            <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-4">
              <h4 className="font-bold text-amber-400 mb-3">⚡ Ionic Bonds</h4>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Electrons are <strong>transferred</strong></li>
                <li>• Metal + Non-metal</li>
                <li>• Forms crystals</li>
                <li>• High melting point</li>
                <li>• Conducts electricity when dissolved</li>
              </ul>
              <div className="mt-3 pt-3 border-t border-amber-500/30">
                <p className="text-xs text-slate-400">Examples:</p>
                <p className="text-sm text-amber-400">NaCl, MgCl₂, CaO</p>
              </div>
            </div>

            {/* Covalent */}
            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-xl p-4">
              <h4 className="font-bold text-cyan-400 mb-3">🤝 Covalent Bonds</h4>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Electrons are <strong>shared</strong></li>
                <li>• Non-metal + Non-metal</li>
                <li>• Forms molecules</li>
                <li>• Lower melting point</li>
                <li>• Usually doesn't conduct</li>
              </ul>
              <div className="mt-3 pt-3 border-t border-cyan-500/30">
                <p className="text-xs text-slate-400">Examples:</p>
                <p className="text-sm text-cyan-400">H₂O, CO₂, CH₄</p>
              </div>
            </div>
          </div>

          {/* Visual Comparison */}
          <div className="flex items-center gap-8 mt-4">
            <div className="text-center">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">Na</div>
                <motion.span
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ➡️
                </motion.span>
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">Cl</div>
              </div>
              <p className="text-xs text-amber-400">Transfer</p>
            </div>

            <div className="text-2xl text-slate-500">vs</div>

            <div className="text-center">
              <div className="flex items-center gap-1 mb-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold text-sm">H</div>
                <motion.div
                  className="w-4 h-1 bg-cyan-400 rounded-full"
                  animate={{ scaleX: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">O</div>
                <motion.div
                  className="w-4 h-1 bg-cyan-400 rounded-full"
                  animate={{ scaleX: [1, 1.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                />
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-bold text-sm">H</div>
              </div>
              <p className="text-xs text-cyan-400">Share</p>
            </div>
          </div>
        </>
      )}

      {/* BUILD MODE */}
      {viewMode === 'build' && (
        <>
          <h3 className="text-xl font-bold text-emerald-400">🔧 Build a Bond</h3>
          <p className="text-slate-400 text-sm">Select two atoms to see what bond they form!</p>

          <div className="flex gap-8 items-center">
            {/* Atom 1 Selector */}
            <div>
              <p className="text-xs text-slate-500 mb-2 text-center">Atom 1</p>
              <div className="grid grid-cols-2 gap-2">
                {ATOMS_FOR_BUILD.slice(0, 4).map(atom => (
                  <button
                    key={atom.symbol}
                    onClick={() => setBuildAtom1(atom.symbol)}
                    className={`w-12 h-12 rounded-full ${atom.color} font-bold transition-all ${
                      buildAtom1 === atom.symbol ? 'ring-2 ring-emerald-400 scale-110' : ''
                    }`}
                  >
                    {atom.symbol}
                  </button>
                ))}
              </div>
            </div>

            {/* Bond indicator */}
            <div className="text-center">
              <div className={`px-4 py-2 rounded-xl font-bold ${
                getBondType(buildAtom1, buildAtom2) === 'ionic'
                  ? 'bg-amber-600 text-white'
                  : getBondType(buildAtom1, buildAtom2) === 'covalent'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-600 text-slate-300'
              }`}>
                {getBondType(buildAtom1, buildAtom2) === 'ionic' && '⚡ Ionic'}
                {getBondType(buildAtom1, buildAtom2) === 'covalent' && '🤝 Covalent'}
                {getBondType(buildAtom1, buildAtom2) === 'unknown' && '❓ Unknown'}
              </div>
            </div>

            {/* Atom 2 Selector */}
            <div>
              <p className="text-xs text-slate-500 mb-2 text-center">Atom 2</p>
              <div className="grid grid-cols-2 gap-2">
                {ATOMS_FOR_BUILD.slice(4).map(atom => (
                  <button
                    key={atom.symbol}
                    onClick={() => setBuildAtom2(atom.symbol)}
                    className={`w-12 h-12 rounded-full ${atom.color} font-bold transition-all ${
                      buildAtom2 === atom.symbol ? 'ring-2 ring-emerald-400 scale-110' : ''
                    }`}
                  >
                    {atom.symbol}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="bg-slate-800/50 rounded-xl p-4 max-w-sm text-center">
            <p className="text-sm text-slate-300">
              {getBondType(buildAtom1, buildAtom2) === 'ionic'
                ? `${buildAtom1} (metal) will transfer electrons to ${buildAtom2} (non-metal), forming an ionic bond!`
                : getBondType(buildAtom1, buildAtom2) === 'covalent'
                ? `${buildAtom1} and ${buildAtom2} will share electrons, forming a covalent bond!`
                : 'Select a metal and a non-metal for ionic, or two non-metals for covalent!'}
            </p>
          </div>
        </>
      )}

      {/* Indian Context */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-3 max-w-sm text-center"
      >
        <p className="text-sm text-emerald-200">
          <span className="font-bold">🇮🇳 Did you know?</span> Diamond and graphite are both pure carbon, 
          but different bonding arrangements make diamond the hardest substance and graphite soft enough for pencils!
        </p>
      </motion.div>
    </div>
  );
}
