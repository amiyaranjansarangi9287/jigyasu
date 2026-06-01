import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface Atom3D {
  x: number; y: number; z: number;
  element: string; color: string; radius: number;
}

interface Bond3D {
  from: number; to: number;
}

interface MoleculeData {
  name: string;
  formula: string;
  description: string;
  funFact: string;
  atoms: Atom3D[];
  bonds: Bond3D[];
}

const molecules: Record<string, MoleculeData> = {
  water: {
    name: 'Water', formula: 'H₂O',
    description: 'The molecule of life! Water is essential for all known forms of life.',
    funFact: 'Water is the only natural substance found in all three states on Earth.',
    atoms: [
      { x: 0, y: 0, z: 0, element: 'O', color: '#ef4444', radius: 18 },
      { x: -50, y: -40, z: 10, element: 'H', color: '#60a5fa', radius: 12 },
      { x: 50, y: -40, z: -10, element: 'H', color: '#60a5fa', radius: 12 },
    ],
    bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }],
  },
  co2: {
    name: 'Carbon Dioxide', formula: 'CO₂',
    description: 'A greenhouse gas produced by respiration and combustion.',
    funFact: 'Plants convert CO₂ into oxygen through photosynthesis!',
    atoms: [
      { x: 0, y: 0, z: 0, element: 'C', color: '#374151', radius: 16 },
      { x: -60, y: 0, z: 0, element: 'O', color: '#ef4444', radius: 18 },
      { x: 60, y: 0, z: 0, element: 'O', color: '#ef4444', radius: 18 },
    ],
    bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }],
  },
  methane: {
    name: 'Methane', formula: 'CH₄',
    description: 'The simplest hydrocarbon, produced by decomposing organic matter.',
    funFact: 'Cows produce methane during digestion - about 70-120 kg per year!',
    atoms: [
      { x: 0, y: 0, z: 0, element: 'C', color: '#374151', radius: 16 },
      { x: -40, y: -45, z: 30, element: 'H', color: '#60a5fa', radius: 10 },
      { x: 40, y: -45, z: -30, element: 'H', color: '#60a5fa', radius: 10 },
      { x: -40, y: 45, z: -30, element: 'H', color: '#60a5fa', radius: 10 },
      { x: 40, y: 45, z: 30, element: 'H', color: '#60a5fa', radius: 10 },
    ],
    bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }, { from: 0, to: 4 }],
  },
  glucose: {
    name: 'Glucose (simplified)', formula: 'C₆H₁₂O₆',
    description: 'The primary energy source for cells. Essential for cellular respiration.',
    funFact: 'Your brain uses about 120g of glucose per day - that\'s about 60% of your body\'s glucose!',
    atoms: [
      { x: -80, y: 0, z: 0, element: 'C', color: '#374151', radius: 14 },
      { x: -40, y: -35, z: 20, element: 'C', color: '#374151', radius: 14 },
      { x: 0, y: 0, z: -10, element: 'C', color: '#374151', radius: 14 },
      { x: 40, y: -35, z: 20, element: 'C', color: '#374151', radius: 14 },
      { x: 80, y: 0, z: -10, element: 'C', color: '#374151', radius: 14 },
      { x: 40, y: 35, z: 0, element: 'C', color: '#374151', radius: 14 },
      { x: -80, y: -40, z: 10, element: 'O', color: '#ef4444', radius: 12 },
      { x: 0, y: 40, z: 10, element: 'O', color: '#ef4444', radius: 12 },
      { x: 80, y: -40, z: 10, element: 'O', color: '#ef4444', radius: 12 },
      { x: -40, y: 40, z: -20, element: 'O', color: '#ef4444', radius: 12 },
      { x: -80, y: 40, z: -10, element: 'O', color: '#ef4444', radius: 12 },
      { x: 40, y: -70, z: 0, element: 'O', color: '#ef4444', radius: 12 },
    ],
    bonds: [
      { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 },
      { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 0, to: 6 },
      { from: 2, to: 7 }, { from: 4, to: 8 }, { from: 1, to: 9 },
      { from: 0, to: 10 }, { from: 3, to: 11 },
    ],
  },
  ammonia: {
    name: 'Ammonia', formula: 'NH₃',
    description: 'A nitrogen compound important in the nitrogen cycle and protein metabolism.',
    funFact: 'Ammonia has a very strong smell and is used in many cleaning products!',
    atoms: [
      { x: 0, y: 0, z: 0, element: 'N', color: '#3b82f6', radius: 17 },
      { x: -45, y: 40, z: 20, element: 'H', color: '#60a5fa', radius: 10 },
      { x: 45, y: 40, z: 20, element: 'H', color: '#60a5fa', radius: 10 },
      { x: 0, y: -30, z: -40, element: 'H', color: '#60a5fa', radius: 10 },
    ],
    bonds: [{ from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }],
  },
  ethanol: {
    name: 'Ethanol', formula: 'C₂H₅OH',
    description: 'The alcohol in drinks, hand sanitizer, and fuel. Produced by yeast fermentation of sugars.',
    funFact: 'Yeast produces ethanol when it ferments sugar without oxygen — this is how beer, wine, and bread are made!',
    atoms: [
      { x: -35, y: 0, z: 0, element: 'C', color: '#374151', radius: 14 },
      { x: 35, y: 0, z: 0, element: 'C', color: '#374151', radius: 14 },
      { x: 75, y: 0, z: 0, element: 'O', color: '#ef4444', radius: 16 },
      { x: 100, y: -20, z: 10, element: 'H', color: '#60a5fa', radius: 9 },
      { x: -60, y: -30, z: 20, element: 'H', color: '#60a5fa', radius: 9 },
      { x: -60, y: 30, z: -20, element: 'H', color: '#60a5fa', radius: 9 },
      { x: -55, y: 0, z: -30, element: 'H', color: '#60a5fa', radius: 9 },
      { x: 35, y: -35, z: 25, element: 'H', color: '#60a5fa', radius: 9 },
      { x: 35, y: 35, z: -25, element: 'H', color: '#60a5fa', radius: 9 },
    ],
    bonds: [
      { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 },
      { from: 0, to: 4 }, { from: 0, to: 5 }, { from: 0, to: 6 },
      { from: 1, to: 7 }, { from: 1, to: 8 },
    ],
  },
  atp: {
    name: 'ATP (simplified)', formula: 'C₁₀H₁₆N₅O₁₃P₃',
    description: 'Adenosine triphosphate — the universal energy currency of all living cells. Powers nearly every cellular process.',
    funFact: 'Your body produces and recycles about 40 kg of ATP every single day — roughly your own body weight!',
    atoms: [
      // Adenine base (simplified ring)
      { x: -80, y: 0, z: 0, element: 'N', color: '#3b82f6', radius: 12 },
      { x: -55, y: -25, z: 10, element: 'C', color: '#374151', radius: 11 },
      { x: -55, y: 25, z: -10, element: 'N', color: '#3b82f6', radius: 12 },
      // Ribose sugar
      { x: -20, y: 0, z: 0, element: 'C', color: '#374151', radius: 11 },
      { x: -10, y: 20, z: 10, element: 'O', color: '#ef4444', radius: 12 },
      // Phosphate groups (the 3 P's!)
      { x: 20, y: 0, z: 0, element: 'P', color: '#f59e0b', radius: 15 },
      { x: 55, y: 0, z: 0, element: 'P', color: '#f59e0b', radius: 15 },
      { x: 90, y: 0, z: 0, element: 'P', color: '#f59e0b', radius: 15 },
      // Oxygens on phosphates
      { x: 20, y: -25, z: 15, element: 'O', color: '#ef4444', radius: 10 },
      { x: 55, y: -25, z: -15, element: 'O', color: '#ef4444', radius: 10 },
      { x: 90, y: -25, z: 15, element: 'O', color: '#ef4444', radius: 10 },
      { x: 90, y: 25, z: -15, element: 'O', color: '#ef4444', radius: 10 },
    ],
    bonds: [
      { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 0, to: 2 },
      { from: 2, to: 3 }, { from: 3, to: 4 }, { from: 3, to: 5 },
      { from: 5, to: 6 }, { from: 6, to: 7 },
      { from: 5, to: 8 }, { from: 6, to: 9 }, { from: 7, to: 10 }, { from: 7, to: 11 },
    ],
  },
  caffeine: {
    name: 'Caffeine', formula: 'C₈H₁₀N₄O₂',
    description: 'The world\'s most popular psychoactive substance. Blocks adenosine receptors in the brain, preventing drowsiness.',
    funFact: 'Caffeine was evolved by plants as a natural insecticide! It paralyzes and kills insects that try to eat the leaves.',
    atoms: [
      // Double ring system (simplified)
      { x: -30, y: -20, z: 0, element: 'N', color: '#3b82f6', radius: 12 },
      { x: 0, y: -30, z: 10, element: 'C', color: '#374151', radius: 11 },
      { x: 30, y: -20, z: -5, element: 'N', color: '#3b82f6', radius: 12 },
      { x: 30, y: 15, z: 5, element: 'C', color: '#374151', radius: 11 },
      { x: 0, y: 25, z: -10, element: 'N', color: '#3b82f6', radius: 12 },
      { x: -30, y: 15, z: 0, element: 'C', color: '#374151', radius: 11 },
      { x: 55, y: -30, z: 10, element: 'N', color: '#3b82f6', radius: 12 },
      { x: 55, y: 10, z: -5, element: 'C', color: '#374151', radius: 11 },
      // Oxygens
      { x: -55, y: -30, z: 15, element: 'O', color: '#ef4444', radius: 11 },
      { x: -55, y: 25, z: -10, element: 'O', color: '#ef4444', radius: 11 },
      // Methyl groups
      { x: 0, y: -55, z: 20, element: 'C', color: '#374151', radius: 9 },
      { x: 0, y: 50, z: -15, element: 'C', color: '#374151', radius: 9 },
    ],
    bonds: [
      { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 },
      { from: 3, to: 4 }, { from: 4, to: 5 }, { from: 5, to: 0 },
      { from: 2, to: 6 }, { from: 6, to: 7 }, { from: 7, to: 3 },
      { from: 0, to: 8 }, { from: 5, to: 9 },
      { from: 1, to: 10 }, { from: 4, to: 11 },
    ],
  },
};

export default function Molecule3D() {
  const [currentMol, setCurrentMol] = useState<string>('water');
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const mol = molecules[currentMol];

  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setRotation(r => ({ x: r.x + 0.3, y: r.y + 0.5 }));
    }, 30);
    return () => clearInterval(interval);
  }, [autoRotate]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setAutoRotate(false);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    setRotation(r => ({ x: r.x + dy * 0.5, y: r.y + dx * 0.5 }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setAutoRotate(false);
    setIsDragging(true);
    const touch = e.touches[0];
    lastPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const dx = touch.clientX - lastPos.current.x;
    const dy = touch.clientY - lastPos.current.y;
    setRotation(r => ({ x: r.x + dy * 0.5, y: r.y + dx * 0.5 }));
    lastPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const rotatePoint = (atom: Atom3D) => {
    const radX = (rotation.x * Math.PI) / 180;
    const radY = (rotation.y * Math.PI) / 180;

    let { x, y, z } = atom;

    // Rotate around Y
    const x1 = x * Math.cos(radY) - z * Math.sin(radY);
    const z1 = x * Math.sin(radY) + z * Math.cos(radY);

    // Rotate around X
    const y1 = y * Math.cos(radX) - z1 * Math.sin(radX);
    const z2 = y * Math.sin(radX) + z1 * Math.cos(radX);

    const scale = 300 / (300 + z2) * zoom;

    return { screenX: x1 * scale + 200, screenY: y1 * scale + 200, z: z2, scale };
  };

  const projected = mol.atoms.map(a => ({ ...rotatePoint(a), ...a }));

  // Sort by z for proper rendering
  const sortedAtoms = projected.map((a, i) => ({ ...a, idx: i })).sort((a, b) => a.z - b.z);

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">🔬 3D Molecule Viewer</h2>
          <p className="text-gray-400 text-lg">Drag to rotate • Explore molecular structures!</p>
        </motion.div>

        {/* Molecule selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {Object.entries(molecules).map(([key, m]) => (
            <button
              key={key}
              onClick={() => { setCurrentMol(key); setAutoRotate(true); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                currentMol === key
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {m.formula} {m.name}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* 3D Viewer */}
          <div className="md:col-span-2">
            <div
              ref={canvasRef}
              className="relative w-full aspect-square max-w-[400px] mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500/20 bg-gradient-to-br from-gray-900 to-gray-950 cursor-grab active:cursor-grabbing select-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => setIsDragging(false)}
            >
              {/* Grid background */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }} />

              <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* Bonds */}
                {mol.bonds.map((bond, i) => {
                  const from = projected[bond.from];
                  const to = projected[bond.to];
                  return (
                    <line
                      key={`bond-${i}`}
                      x1={from.screenX} y1={from.screenY}
                      x2={to.screenX} y2={to.screenY}
                      stroke="#6b7280"
                      strokeWidth={3 * zoom}
                      opacity={0.6}
                    />
                  );
                })}

                {/* Atoms */}
                {sortedAtoms.map((atom) => (
                  <g key={atom.idx}>
                    {/* Shadow / glow */}
                    <circle
                      cx={atom.screenX}
                      cy={atom.screenY}
                      r={atom.radius * atom.scale + 4}
                      fill={atom.color}
                      opacity={0.15}
                    />
                    {/* Main atom */}
                    <circle
                      cx={atom.screenX}
                      cy={atom.screenY}
                      r={atom.radius * atom.scale}
                      fill={atom.color}
                      stroke="white"
                      strokeWidth={1}
                      strokeOpacity={0.3}
                    />
                    {/* Highlight */}
                    <circle
                      cx={atom.screenX - atom.radius * atom.scale * 0.2}
                      cy={atom.screenY - atom.radius * atom.scale * 0.2}
                      r={atom.radius * atom.scale * 0.3}
                      fill="white"
                      opacity={0.3}
                    />
                    {/* Label */}
                    <text
                      x={atom.screenX}
                      y={atom.screenY + 4}
                      textAnchor="middle"
                      fontSize={11 * atom.scale}
                      fontWeight="bold"
                      fill="white"
                    >
                      {atom.element}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Rotation hint */}
              {autoRotate && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-gray-900/80 backdrop-blur px-3 py-1 rounded-full text-sm text-gray-400">
                  🖱️ Drag to manually rotate
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-3 mt-4">
              <button onClick={() => setAutoRotate(!autoRotate)} className={`px-4 py-2 rounded-full text-sm font-medium ${autoRotate ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-300'}`}>
                {autoRotate ? '⏸ Stop Spin' : '▶️ Auto Spin'}
              </button>
              <button onClick={() => setZoom(z => Math.min(2, z + 0.2))} className="p-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700">
                <ZoomIn className="w-5 h-5" />
              </button>
              <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="p-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700">
                <ZoomOut className="w-5 h-5" />
              </button>
              <button onClick={() => { setRotation({ x: 0, y: 0 }); setAutoRotate(true); setZoom(1); }} className="p-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700">
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Info */}
          <div>
            <motion.div key={currentMol} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-gray-900 rounded-2xl border border-gray-800 p-6 sticky top-24">
              <div className="text-4xl mb-3">⚛️</div>
              <h3 className="text-2xl font-bold text-white">{mol.name}</h3>
              <div className="text-emerald-400 font-mono text-lg mb-3">{mol.formula}</div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">{mol.description}</p>
              
              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-4 mb-4 border border-blue-500/20">
                <div className="text-blue-400 font-bold text-sm mb-1">💡 Fun Fact</div>
                <p className="text-gray-300 text-sm italic">{mol.funFact}</p>
              </div>

              <h4 className="text-sm font-bold text-white mb-2">Atom Legend</h4>
              <div className="space-y-2">
                {Array.from(new Set(mol.atoms.map(a => a.element))).map(el => {
                  const atom = mol.atoms.find(a => a.element === el)!;
                  const names: Record<string, string> = { H: 'Hydrogen', O: 'Oxygen', C: 'Carbon', N: 'Nitrogen' };
                  return (
                    <div key={el} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full border-2 border-white/20" style={{ backgroundColor: atom.color }} />
                      <span className="text-gray-300 text-sm">{names[el] || el} ({el})</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
