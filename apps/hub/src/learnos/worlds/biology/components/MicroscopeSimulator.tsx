import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface Specimen {
  id: string;
  name: string;
  emoji: string;
  category: string;
  description: string;
  funFact: string;
  magnification: string;
  stain: string;
  structures: { name: string; description: string; color: string }[];
  svgContent: (zoom: number) => React.ReactNode;
}

const specimens: Specimen[] = [
  {
    id: 'onion', name: 'Onion Epidermal Cells', emoji: '🧅', category: 'Plant',
    description: 'Rectangular plant cells clearly showing cell walls, nuclei, and vacuoles. Classic first microscope observation.',
    funFact: 'Robert Hooke first observed cells in cork in 1665, but onion cells are easier to see because they form a thin, transparent layer!',
    magnification: '400x', stain: 'Iodine (makes nuclei visible)',
    structures: [
      { name: 'Cell Wall', description: 'Rigid cellulose boundary', color: '#22c55e' },
      { name: 'Nucleus', description: 'Control center, stains dark', color: '#7c3aed' },
      { name: 'Cytoplasm', description: 'Gel-like interior', color: '#86efac' },
      { name: 'Vacuole', description: 'Large, water-filled space', color: '#bfdbfe' },
    ],
    svgContent: (zoom) => (
      <g>
        {/* Onion cells grid */}
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 3 }).map((_, col) => {
            const x = 80 + col * 110 * (zoom / 2);
            const y = 80 + row * 80 * (zoom / 2);
            const w = 100 * (zoom / 2);
            const h = 70 * (zoom / 2);
            return (
              <g key={`${row}-${col}`}>
                <rect x={x} y={y} width={w} height={h} rx="3"
                  fill="#86efac15" stroke="#22c55e" strokeWidth={1.5} />
                {/* Vacuole */}
                <rect x={x + w * 0.1} y={y + h * 0.1} width={w * 0.8} height={h * 0.8} rx="3"
                  fill="#bfdbfe10" stroke="#93c5fd33" strokeWidth="0.5" />
                {/* Nucleus */}
                <ellipse cx={x + w * 0.5} cy={y + h * 0.5}
                  rx={w * 0.15} ry={h * 0.18}
                  fill="#7c3aed44" stroke="#7c3aed" strokeWidth={1} />
                {zoom > 2 && (
                  <ellipse cx={x + w * 0.5} cy={y + h * 0.5}
                    rx={w * 0.05} ry={h * 0.06}
                    fill="#a78bfa" opacity="0.5" />
                )}
              </g>
            );
          })
        )}
      </g>
    ),
  },
  {
    id: 'blood', name: 'Human Blood Smear', emoji: '🩸', category: 'Human',
    description: 'Red blood cells (biconcave discs) and occasional white blood cells visible in a stained blood smear.',
    funFact: 'Red blood cells have NO nucleus — they lose it during development to make more room for hemoglobin! You have about 25 trillion of them.',
    magnification: '1000x (oil immersion)', stain: "Wright's stain (differential)",
    structures: [
      { name: 'Red Blood Cell', description: 'Biconcave disc, carries O₂', color: '#ef4444' },
      { name: 'White Blood Cell', description: 'Larger, lobed nucleus', color: '#7c3aed' },
      { name: 'Platelets', description: 'Tiny fragments for clotting', color: '#f59e0b' },
      { name: 'Plasma', description: 'Liquid medium (background)', color: '#fde68a' },
    ],
    svgContent: (zoom) => {
      const rbcs: { x: number; y: number }[] = [];
      for (let i = 0; i < 25; i++) {
        rbcs.push({ x: 60 + (i % 5) * 80, y: 60 + Math.floor(i / 5) * 75 + (i % 2) * 15 });
      }
      return (
        <g>
          {/* RBCs */}
          {rbcs.map((pos, i) => (
            <g key={i}>
              <circle cx={pos.x} cy={pos.y} r={18 * (zoom / 2)} fill="#ef4444" opacity="0.7" />
              <circle cx={pos.x} cy={pos.y} r={7 * (zoom / 2)} fill="#ef444433" />
              {zoom > 2 && <circle cx={pos.x - 4} cy={pos.y - 4} r={3 * (zoom / 2)} fill="#f87171" opacity="0.4" />}
            </g>
          ))}
          {/* WBC */}
          <circle cx={250} cy={200} r={28 * (zoom / 2)} fill="#ddd6fe55" stroke="#7c3aed" strokeWidth={1.5} />
          <circle cx={250} cy={195} r={12 * (zoom / 2)} fill="#7c3aed66" />
          <circle cx={245} cy={205} r={10 * (zoom / 2)} fill="#7c3aed55" />
          {/* Platelets */}
          {[{ x: 150, y: 150 }, { x: 320, y: 280 }, { x: 180, y: 310 }].map((p, i) => (
            <circle key={`plt-${i}`} cx={p.x} cy={p.y} r={5 * (zoom / 2)} fill="#f59e0b" opacity="0.6" />
          ))}
        </g>
      );
    },
  },
  {
    id: 'leaf', name: 'Leaf Cross-Section', emoji: '🍃', category: 'Plant',
    description: 'A cross-section revealing the internal structure of a leaf: epidermis, palisade mesophyll, spongy mesophyll, and vascular bundles.',
    funFact: 'Leaves are perfectly designed for photosynthesis: the palisade cells are packed with chloroplasts and arranged vertically to maximize light absorption!',
    magnification: '100x', stain: 'Toluidine blue',
    structures: [
      { name: 'Upper Epidermis', description: 'Protective outer layer + cuticle', color: '#22c55e' },
      { name: 'Palisade Mesophyll', description: 'Tall cells packed with chloroplasts', color: '#15803d' },
      { name: 'Spongy Mesophyll', description: 'Loosely packed, air spaces for gas exchange', color: '#86efac' },
      { name: 'Vascular Bundle', description: 'Xylem (water up) & phloem (sugar down)', color: '#dc2626' },
      { name: 'Stomata', description: 'Pores for CO₂/O₂ exchange', color: '#0ea5e9' },
    ],
    svgContent: (zoom) => (
      <g>
        {/* Upper epidermis */}
        <rect x="40" y="60" width="420" height={25 * (zoom / 2)} rx="2" fill="#22c55e33" stroke="#22c55e" strokeWidth="1.5" />
        {/* Cuticle */}
        <rect x="40" y="55" width="420" height={5 * (zoom / 2)} fill="#22c55e55" rx="1" />
        {/* Palisade mesophyll */}
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={`pal-${i}`} x={55 + i * 35} y={60 + 25 * (zoom / 2)} width={20 * (zoom / 2)} height={70 * (zoom / 2)} rx="4" fill="#15803d55" stroke="#15803d88" strokeWidth="1" />
        ))}
        {/* Spongy mesophyll */}
        {Array.from({ length: 20 }).map((_, i) => (
          <ellipse key={`sp-${i}`}
            cx={60 + (i % 7) * 60} cy={60 + 25 * (zoom / 2) + 70 * (zoom / 2) + 20 + (Math.floor(i / 7)) * 30}
            rx={15 + Math.random() * 10} ry={10 + Math.random() * 5}
            fill="#86efac33" stroke="#86efac66" strokeWidth="0.8" />
        ))}
        {/* Vascular bundle */}
        <g>
          <rect x="200" y={60 + 25 * (zoom / 2) + 40} width={40 * (zoom / 2)} height={50 * (zoom / 2)} rx="5" fill="#dc262622" stroke="#dc2626" strokeWidth="1.5" />
          <rect x="205" y={60 + 25 * (zoom / 2) + 45} width={15 * (zoom / 2)} height={40 * (zoom / 2)} rx="3" fill="#3b82f622" stroke="#3b82f6" strokeWidth="1" />
          <rect x={210 + 15 * (zoom / 2)} y={60 + 25 * (zoom / 2) + 50} width={10 * (zoom / 2)} height={30 * (zoom / 2)} rx="2" fill="#f97316" opacity="0.3" />
        </g>
        {/* Lower epidermis */}
        <rect x="40" y={60 + 25 * (zoom / 2) + 120} width="420" height={20 * (zoom / 2)} rx="2" fill="#22c55e22" stroke="#22c55e88" strokeWidth="1" />
        {/* Stomata */}
        {[120, 350].map(sx => (
          <g key={sx}>
            <ellipse cx={sx} cy={60 + 25 * (zoom / 2) + 135} rx="8" ry="4" fill="none" stroke="#0ea5e9" strokeWidth="1.5" />
            <ellipse cx={sx - 6} cy={60 + 25 * (zoom / 2) + 135} rx="5" ry="8" fill="#22c55e44" stroke="#22c55e" strokeWidth="1" />
            <ellipse cx={sx + 6} cy={60 + 25 * (zoom / 2) + 135} rx="5" ry="8" fill="#22c55e44" stroke="#22c55e" strokeWidth="1" />
          </g>
        ))}
      </g>
    ),
  },
  {
    id: 'cheek', name: 'Cheek Epithelial Cells', emoji: '👄', category: 'Human',
    description: 'Flat, irregular animal cells from the inside of your cheek. Shows cell membrane, cytoplasm, and prominent nucleus — no cell wall!',
    funFact: 'You lose about 30,000 to 40,000 dead skin cells every hour! These cheek cells are some of the easiest human cells to collect and observe.',
    magnification: '400x', stain: 'Methylene blue (stains nuclei)',
    structures: [
      { name: 'Cell Membrane', description: 'Thin outer boundary (no wall!)', color: '#f97316' },
      { name: 'Nucleus', description: 'Large, dark-stained center', color: '#1d4ed8' },
      { name: 'Cytoplasm', description: 'Light blue, granular', color: '#93c5fd' },
    ],
    svgContent: (zoom) => (
      <g>
        {Array.from({ length: 8 }).map((_, i) => {
          const cx = 100 + (i % 3) * 130 + Math.random() * 30;
          const cy = 100 + Math.floor(i / 3) * 120 + Math.random() * 20;
          const rx = 50 + Math.random() * 20;
          const ry = 40 + Math.random() * 15;
          return (
            <g key={i}>
              {/* Cell */}
              <ellipse cx={cx} cy={cy} rx={rx * (zoom / 2)} ry={ry * (zoom / 2)}
                fill="#93c5fd0a" stroke="#f9731666" strokeWidth="1.5"
                transform={`rotate(${Math.random() * 30 - 15}, ${cx}, ${cy})`} />
              {/* Nucleus */}
              <ellipse cx={cx} cy={cy}
                rx={rx * 0.25 * (zoom / 2)} ry={ry * 0.3 * (zoom / 2)}
                fill="#1d4ed844" stroke="#1d4ed8" strokeWidth="1" />
              {zoom > 2 && (
                <ellipse cx={cx + 2} cy={cy - 2}
                  rx={rx * 0.08 * (zoom / 2)} ry={ry * 0.1 * (zoom / 2)}
                  fill="#60a5fa" opacity="0.4" />
              )}
            </g>
          );
        })}
      </g>
    ),
  },
];

export default function MicroscopeSimulator() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [zoom, setZoom] = useState(2);
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [lightsOn, setLightsOn] = useState(true);

  const specimen = specimens[currentSlide];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setViewOffset(prev => ({
      x: prev.x + (e.clientX - lastPos.x) * 0.5,
      y: prev.y + (e.clientY - lastPos.y) * 0.5,
    }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };
  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setLastPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setViewOffset(prev => ({
      x: prev.x + (e.touches[0].clientX - lastPos.x) * 0.5,
      y: prev.y + (e.touches[0].clientY - lastPos.y) * 0.5,
    }));
    setLastPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const resetView = () => { setZoom(2); setViewOffset({ x: 0, y: 0 }); };

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">🔎 Virtual Microscope</h2>
          <p className="text-gray-400 text-lg">Examine real specimens — zoom, pan, and discover!</p>
        </motion.div>

        {/* Slide selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-5">
          {specimens.map((s, i) => (
            <button key={s.id} onClick={() => { setCurrentSlide(i); resetView(); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${currentSlide === i ? 'bg-emerald-500 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
              {s.emoji} {s.name}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Microscope viewport */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Circular viewport */}
              <div
                className="relative w-full aspect-square max-w-[500px] mx-auto rounded-full overflow-hidden border-[6px] border-gray-700 bg-gray-900 cursor-grab active:cursor-grabbing select-none"
                style={{ boxShadow: '0 0 40px rgba(0,0,0,0.5), inset 0 0 60px rgba(0,0,0,0.3)' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => setIsDragging(false)}
              >
                {/* Light background */}
                <div className={`absolute inset-0 transition-colors duration-500 ${lightsOn ? 'bg-gradient-to-br from-gray-100 to-gray-200' : 'bg-gray-950'}`} />

                {lightsOn && (
                  <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full"
                    style={{ transform: `translate(${viewOffset.x}px, ${viewOffset.y}px) scale(${zoom / 2})`, transformOrigin: 'center' }}>
                    <AnimatePresence mode="wait">
                      <motion.g key={specimen.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {specimen.svgContent(zoom)}
                      </motion.g>
                    </AnimatePresence>
                  </svg>
                )}

                {/* Crosshair */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-emerald-500/20" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-emerald-500/20" />
                </div>

                {/* Vignette */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: 'radial-gradient(circle, transparent 55%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,1) 100%)',
                }} />

                {/* Zoom indicator */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur px-2.5 py-1 rounded-full text-sm text-emerald-400 font-mono">
                  {Math.round(zoom * 100)}x
                </div>
              </div>

              {/* Controls below viewport */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <button onClick={() => setCurrentSlide(i => Math.max(0, i - 1))} disabled={currentSlide === 0}
                  className="p-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-30">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => setZoom(z => Math.max(1, z - 0.5))} className="p-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700">
                  <ZoomOut className="w-5 h-5" />
                </button>
                <div className="w-32 flex items-center">
                  <input type="range" min="1" max="4" step="0.25" value={zoom}
                    onChange={e => setZoom(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-700" />
                </div>
                <button onClick={() => setZoom(z => Math.min(4, z + 0.5))} className="p-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700">
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button onClick={resetView} className="p-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700">
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button onClick={() => setLightsOn(!lightsOn)}
                  className={`p-2 rounded-full ${lightsOn ? 'bg-yellow-500 text-white' : 'bg-gray-800 text-gray-300'}`}>
                  <Eye className="w-5 h-5" />
                </button>
                <button onClick={() => setCurrentSlide(i => Math.min(specimens.length - 1, i + 1))} disabled={currentSlide === specimens.length - 1}
                  className="p-2 rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-30">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Info panel */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div key={specimen.id}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">{specimen.emoji}</div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{specimen.name}</h3>
                    <div className="text-sm text-emerald-400 font-medium">{specimen.category} • {specimen.magnification}</div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">{specimen.description}</p>

                <div className="bg-gray-800/50 rounded-lg p-2.5 mb-3">
                  <div className="text-sm text-gray-500 uppercase font-bold">Stain Used</div>
                  <div className="text-sm text-white">{specimen.stain}</div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-3">
                  <div className="text-sm text-blue-400 font-bold mb-1">💡 Fun Fact</div>
                  <div className="text-sm text-gray-300">{specimen.funFact}</div>
                </div>

                <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">Visible Structures</h4>
                <div className="space-y-1.5">
                  {specimen.structures.map(s => (
                    <div key={s.name} className="flex items-start gap-2 bg-gray-800/30 rounded-lg p-2">
                      <div className="w-3 h-3 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: s.color }} />
                      <div>
                        <div className="text-sm font-bold text-white">{s.name}</div>
                        <div className="text-sm text-gray-400">{s.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
              <h4 className="text-sm font-bold text-white mb-2">🔬 Microscope Tips</h4>
              <ul className="text-[11px] text-gray-400 space-y-1">
                <li>• Start at low magnification, then zoom in</li>
                <li>• Drag to move the slide around</li>
                <li>• Toggle the light to see contrast</li>
                <li>• Look for stained structures (darker areas)</li>
                <li>• Compare plant cells (rectangular) vs animal cells (irregular)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
