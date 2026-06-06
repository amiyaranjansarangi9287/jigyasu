import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, Trash2, Lightbulb, Eye } from 'lucide-react';
import type { CanvasProps } from '../../types';

interface Atom {
  id: string;
  symbol: string;
  name: string;
  color: string;
  textColor: string;
  maxBonds: number;
  size: number;
  electrons: number;
}

interface PlacedAtom extends Atom {
  instanceId: string;
  x: number;
  y: number;
}

interface Molecule {
  name: string;
  formula: string;
  atoms: { symbol: string; count: number }[];
  indianContext?: string;
  funFact?: string;
  structure?: 'linear' | 'bent' | 'tetrahedral' | 'trigonal';
}

const ATOMS: Atom[] = [
  { id: 'H', symbol: 'H', name: 'Hydrogen', color: 'bg-white', textColor: 'text-gray-800', maxBonds: 1, size: 32, electrons: 1 },
  { id: 'O', symbol: 'O', name: 'Oxygen', color: 'bg-red-500', textColor: 'text-white', maxBonds: 2, size: 40, electrons: 6 },
  { id: 'C', symbol: 'C', name: 'Carbon', color: 'bg-gray-800', textColor: 'text-white', maxBonds: 4, size: 44, electrons: 4 },
  { id: 'N', symbol: 'N', name: 'Nitrogen', color: 'bg-blue-500', textColor: 'text-white', maxBonds: 3, size: 42, electrons: 5 },
  { id: 'Cl', symbol: 'Cl', name: 'Chlorine', color: 'bg-green-500', textColor: 'text-white', maxBonds: 1, size: 44, electrons: 7 },
  { id: 'S', symbol: 'S', name: 'Sulfur', color: 'bg-yellow-500', textColor: 'text-gray-800', maxBonds: 2, size: 44, electrons: 6 },
];

const MOLECULES: Molecule[] = [
  { name: 'Water', formula: 'H₂O', atoms: [{ symbol: 'H', count: 2 }, { symbol: 'O', count: 1 }], indianContext: 'Paani - essential for life!', funFact: 'Water molecules are bent at 104.5°', structure: 'bent' },
  { name: 'Carbon Dioxide', formula: 'CO₂', atoms: [{ symbol: 'C', count: 1 }, { symbol: 'O', count: 2 }], indianContext: 'What plants breathe in!', funFact: 'A linear molecule', structure: 'linear' },
  { name: 'Oxygen', formula: 'O₂', atoms: [{ symbol: 'O', count: 2 }], indianContext: 'Prana - the breath of life', funFact: 'Double bond between atoms', structure: 'linear' },
  { name: 'Methane', formula: 'CH₄', atoms: [{ symbol: 'C', count: 1 }, { symbol: 'H', count: 4 }], indianContext: 'Gobar gas for cooking!', funFact: 'Tetrahedral shape - 109.5° angles', structure: 'tetrahedral' },
  { name: 'Ammonia', formula: 'NH₃', atoms: [{ symbol: 'N', count: 1 }, { symbol: 'H', count: 3 }], indianContext: 'Used in fertilizers', funFact: 'Trigonal pyramidal shape', structure: 'trigonal' },
  { name: 'Hydrogen Chloride', formula: 'HCl', atoms: [{ symbol: 'H', count: 1 }, { symbol: 'Cl', count: 1 }], indianContext: 'Stomach acid!', structure: 'linear' },
  { name: 'Hydrogen Sulfide', formula: 'H₂S', atoms: [{ symbol: 'H', count: 2 }, { symbol: 'S', count: 1 }], funFact: 'Smells like rotten eggs!', structure: 'bent' },
];

type ViewMode = 'build' | '3d' | 'gallery';

export default function MoleculeBuilderCanvas({ isPlaying }: CanvasProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('build');
  const [placedAtoms, setPlacedAtoms] = useState<PlacedAtom[]>([]);
  const [selectedAtom, setSelectedAtom] = useState<Atom | null>(null);
  const [matchedMolecule, setMatchedMolecule] = useState<Molecule | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [rotation3D, setRotation3D] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedGalleryMolecule, setSelectedGalleryMolecule] = useState<Molecule | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Auto-rotate 3D view
  useEffect(() => {
    if (viewMode !== '3d' || !autoRotate || !isPlaying) return;
    
    const interval = setInterval(() => {
      setRotation3D(prev => ({
        x: prev.x,
        y: (prev.y + 1) % 360,
      }));
    }, 50);
    
    return () => clearInterval(interval);
  }, [viewMode, autoRotate, isPlaying]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedAtom || !isPlaying || viewMode !== 'build') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newAtom: PlacedAtom = {
      ...selectedAtom,
      instanceId: `${selectedAtom.id}-${Date.now()}`,
      x,
      y,
    };

    const newPlacedAtoms = [...placedAtoms, newAtom];
    setPlacedAtoms(newPlacedAtoms);
    checkMolecule(newPlacedAtoms);
  };

  const checkMolecule = (atoms: PlacedAtom[]) => {
    const atomCounts: Record<string, number> = {};
    atoms.forEach(a => {
      atomCounts[a.symbol] = (atomCounts[a.symbol] || 0) + 1;
    });

    const matched = MOLECULES.find(mol => {
      if (mol.atoms.length !== Object.keys(atomCounts).length) return false;
      return mol.atoms.every(
        a => atomCounts[a.symbol] === a.count
      );
    });

    setMatchedMolecule(matched || null);
  };

  const removeAtom = (instanceId: string) => {
    if (!isPlaying) return;
    const newAtoms = placedAtoms.filter(a => a.instanceId !== instanceId);
    setPlacedAtoms(newAtoms);
    checkMolecule(newAtoms);
  };

  const clearCanvas = () => {
    setPlacedAtoms([]);
    setMatchedMolecule(null);
  };

  // Render 3D molecule visualization
  const render3DMolecule = (molecule: Molecule) => {
    const centerAtom = ATOMS.find(a => 
      molecule.atoms.find(ma => ma.symbol === a.symbol && ma.count === 1)
    ) || ATOMS[0];
    
    const bondedAtoms = molecule.atoms.filter(ma => 
      ma.symbol !== centerAtom.symbol || ma.count > 1
    );

    const getPosition = (index: number, total: number, radius: number) => {
      const angle = (index / total) * Math.PI * 2;
      const radX = (rotation3D.y * Math.PI) / 180;
      const radY = (rotation3D.x * Math.PI) / 180;
      
      let x = Math.cos(angle) * radius;
      let y = Math.sin(angle) * radius * 0.6;
      let z = Math.sin(angle) * radius * 0.4;

      // Apply rotation
      const x2 = x * Math.cos(radX) - z * Math.sin(radX);
      const z2 = x * Math.sin(radX) + z * Math.cos(radX);
      const y2 = y * Math.cos(radY) - z2 * Math.sin(radY);

      return { x: x2, y: y2, z: z2 };
    };

    let bondIndex = 0;
    const positions: { atom: Atom; pos: { x: number; y: number; z: number } }[] = [];
    
    bondedAtoms.forEach(ba => {
      const atom = ATOMS.find(a => a.symbol === ba.symbol)!;
      for (let i = 0; i < ba.count; i++) {
        const pos = getPosition(bondIndex, 4, 60);
        positions.push({ atom, pos });
        bondIndex++;
      }
    });

    return (
      <div 
        className="relative w-64 min-h-64 mx-auto"
        style={{ perspective: '500px' }}
        onMouseMove={(e) => {
          if (!autoRotate) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 60;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 60;
            setRotation3D({ x: -y, y: x });
          }
        }}
      >
        {/* Bonds */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          {positions.map((p, i) => (
            <motion.line
              key={i}
              x1="50%"
              y1="50%"
              x2={`${50 + p.pos.x / 1.5}%`}
              y2={`${50 + p.pos.y / 1.5}%`}
              stroke="#10B981"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </svg>

        {/* Center atom */}
        <motion.div
          className={`absolute left-1/2 top-1/2 ${centerAtom.color} ${centerAtom.textColor} rounded-full flex items-center justify-center font-bold shadow-xl`}
          style={{
            width: centerAtom.size + 8,
            height: centerAtom.size + 8,
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          {centerAtom.symbol}
        </motion.div>

        {/* Bonded atoms */}
        {positions.map((p, i) => (
          <motion.div
            key={i}
            className={`absolute ${p.atom.color} ${p.atom.textColor} rounded-full flex items-center justify-center font-bold shadow-lg`}
            style={{
              width: p.atom.size,
              height: p.atom.size,
              left: `calc(50% + ${p.pos.x}px)`,
              top: `calc(50% + ${p.pos.y}px)`,
              transform: 'translate(-50%, -50%)',
              zIndex: Math.round(p.pos.z) + 5,
              opacity: 0.7 + (p.pos.z + 60) / 200,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.7 + (p.pos.z + 60) / 200 }}
            transition={{ delay: 0.2 + i * 0.1 }}
          >
            {p.atom.symbol}
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* View Mode Tabs */}
      <div className="flex gap-2">
        {[
          { mode: 'build' as ViewMode, label: '🔧 Build', icon: null },
          { mode: '3d' as ViewMode, label: '🎲 3D View', icon: Eye },
          { mode: 'gallery' as ViewMode, label: '📚 Gallery', icon: null },
        ].map(({ mode, label }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              viewMode === mode
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* BUILD MODE */}
      {viewMode === 'build' && (
        <>
          <h3 className="text-xl font-bold text-emerald-400">⚛️ Molecule Builder</h3>

          {/* Atom Palette */}
          <div className="flex gap-2 flex-wrap justify-center">
            {ATOMS.map(atom => (
              <motion.button
                key={atom.id}
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedAtom(atom)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  selectedAtom?.id === atom.id
                    ? 'bg-emerald-600 ring-2 ring-emerald-400 shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                <div 
                  className={`${atom.color} ${atom.textColor} rounded-full flex items-center justify-center font-bold shadow-lg`}
                  style={{ width: atom.size, height: atom.size }}
                >
                  {atom.symbol}
                </div>
                <span className="text-xs text-slate-300">{atom.name}</span>
                <span className="text-[10px] text-slate-500">Bonds: {atom.maxBonds}</span>
              </motion.button>
            ))}
          </div>

          {/* Building Canvas */}
          <div
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="relative w-full max-w-md min-h-64 bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-600 cursor-crosshair overflow-hidden"
          >
            {placedAtoms.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500 pointer-events-none">
                <p className="text-center px-4">Select an atom above, then click here to place it</p>
              </div>
            )}

            {/* Draw bonds between nearby atoms */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {placedAtoms.map((atom1, i) =>
                placedAtoms.slice(i + 1).map(atom2 => {
                  const distance = Math.sqrt(
                    Math.pow(atom1.x - atom2.x, 2) + Math.pow(atom1.y - atom2.y, 2)
                  );
                  if (distance < 80) {
                    return (
                      <motion.line
                        key={`${atom1.instanceId}-${atom2.instanceId}`}
                        x1={atom1.x}
                        y1={atom1.y}
                        x2={atom2.x}
                        y2={atom2.y}
                        stroke="#10B981"
                        strokeWidth="4"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                      />
                    );
                  }
                  return null;
                })
              )}
            </svg>

            {/* Placed atoms */}
            {placedAtoms.map(atom => (
              <motion.div
                key={atom.instanceId}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.2 }}
                className={`absolute ${atom.color} ${atom.textColor} rounded-full flex items-center justify-center font-bold shadow-lg cursor-pointer`}
                style={{
                  width: atom.size,
                  height: atom.size,
                  left: atom.x,
                  top: atom.y,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  removeAtom(atom.instanceId);
                }}
              >
                {atom.symbol}
              </motion.div>
            ))}
          </div>

          {/* Molecule Match Result */}
          <AnimatePresence>
            {matchedMolecule && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 rounded-xl text-white max-w-sm text-center shadow-xl"
              >
                <h4 className="text-2xl font-bold mb-1">🎉 {matchedMolecule.name}</h4>
                <p className="text-lg font-mono mb-2">{matchedMolecule.formula}</p>
                {matchedMolecule.funFact && (
                  <p className="text-sm opacity-90 mb-1">💡 {matchedMolecule.funFact}</p>
                )}
                {matchedMolecule.indianContext && (
                  <p className="text-sm opacity-80">🇮🇳 {matchedMolecule.indianContext}</p>
                )}
                <button
                  onClick={() => setViewMode('3d')}
                  className="mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold"
                >
                  View in 3D →
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="flex gap-3">
            <button
              onClick={clearCanvas}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-slate-200 transition-colors"
             aria-label="Trash2">
              <Trash2 className="w-4 h-4" /> Clear
            </button>
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm text-white transition-colors"
            >
              <Lightbulb className="w-4 h-4" /> {showHint ? 'Hide' : 'Show'} Hints
            </button>
          </div>

          {/* Hints */}
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-slate-800/50 rounded-xl p-4 w-full max-w-md"
              >
                <h4 className="font-bold text-slate-300 mb-2">🧪 Molecules to Build:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {MOLECULES.slice(0, 6).map(mol => (
                    <div key={mol.formula} className="bg-slate-700/50 p-2 rounded-lg">
                      <span className="font-mono text-emerald-400">{mol.formula}</span>
                      <span className="text-slate-400 text-sm ml-2">{mol.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* 3D VIEW MODE */}
      {viewMode === '3d' && (
        <>
          <h3 className="text-xl font-bold text-emerald-400">🎲 3D Molecule View</h3>
          
          {matchedMolecule ? (
            <>
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                {render3DMolecule(matchedMolecule)}
              </div>

              <div className="text-center">
                <h4 className="text-lg font-bold text-white">{matchedMolecule.name}</h4>
                <p className="text-emerald-400 font-mono">{matchedMolecule.formula}</p>
                {matchedMolecule.structure && (
                  <p className="text-slate-400 text-sm mt-1">Shape: {matchedMolecule.structure}</p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    autoRotate ? 'bg-emerald-600' : 'bg-slate-700'
                  } text-white`}
                >
                  <RotateCw className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} />
                  {autoRotate ? 'Auto-rotating' : 'Manual'}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400 mb-4">Build a molecule first to see it in 3D!</p>
              <button
                onClick={() => setViewMode('build')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white"
              >
                Go to Builder
              </button>
            </div>
          )}
        </>
      )}

      {/* GALLERY MODE */}
      {viewMode === 'gallery' && (
        <>
          <h3 className="text-xl font-bold text-emerald-400">📚 Molecule Gallery</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full max-w-lg">
            {MOLECULES.map(mol => (
              <motion.button
                key={mol.formula}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedGalleryMolecule(
                  selectedGalleryMolecule?.formula === mol.formula ? null : mol
                )}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedGalleryMolecule?.formula === mol.formula
                    ? 'bg-emerald-600/20 border-emerald-500'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }`}
              >
                <p className="text-2xl font-mono text-emerald-400">{mol.formula}</p>
                <p className="text-sm text-slate-300">{mol.name}</p>
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {selectedGalleryMolecule && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-slate-800/80 rounded-2xl p-6 max-w-sm w-full border border-slate-700"
              >
                {render3DMolecule(selectedGalleryMolecule)}
                <div className="text-center mt-4">
                  <h4 className="text-xl font-bold text-white">{selectedGalleryMolecule.name}</h4>
                  <p className="text-emerald-400 font-mono text-lg">{selectedGalleryMolecule.formula}</p>
                  {selectedGalleryMolecule.structure && (
                    <p className="text-slate-400 text-sm">Shape: {selectedGalleryMolecule.structure}</p>
                  )}
                  {selectedGalleryMolecule.funFact && (
                    <p className="text-amber-400 text-sm mt-2">💡 {selectedGalleryMolecule.funFact}</p>
                  )}
                  {selectedGalleryMolecule.indianContext && (
                    <p className="text-emerald-300 text-sm mt-1">🇮🇳 {selectedGalleryMolecule.indianContext}</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Turmeric Fun Fact */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-yellow-900/30 border border-yellow-500/30 rounded-xl p-3 max-w-sm text-center"
      >
        <p className="text-sm text-yellow-200">
          <span className="font-bold">✨ Turmeric Magic:</span> Haldi&apos;s golden color comes from curcumin 
          (C₂₁H₂₀O₆) - that&apos;s 47 atoms working together!
        </p>
      </motion.div>
    </div>
  );
}
