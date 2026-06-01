import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Microscope, Volume2, VolumeX } from 'lucide-react';
import { getMuted, setMuted } from '../lib/sounds';

const modules = [
  { id: 'home', label: 'Home', emoji: '🏠' },
  { id: 'cell-map', label: 'Cell', emoji: '🗺️' },
  { id: 'dna-visualizer', label: 'DNA', emoji: '🧬' },
  { id: 'meiosis', label: 'Meiosis', emoji: '🔀' },
  { id: 'mitosis', label: 'Mitosis', emoji: '🧪' },
  { id: 'punnett-square', label: 'Punnett', emoji: '🎲' },
  { id: 'crispr', label: 'CRISPR', emoji: '✂️' },
  { id: 'molecule-3d', label: 'Molecules', emoji: '🔬' },
  { id: 'microscope', label: 'Scope', emoji: '🔎' },
  { id: 'brain', label: 'Brain', emoji: '🧠' },
  { id: 'heart', label: 'Heart', emoji: '🫀' },
  { id: 'digestive', label: 'Digest', emoji: '🦷' },
  { id: 'immune-defense', label: 'Immune', emoji: '🛡️' },
  { id: 'respiration', label: 'Resp', emoji: '🔋' },
  { id: 'photosynthesis', label: 'Photo', emoji: '🧫' },
  { id: 'enzyme-lab', label: 'Enzyme', emoji: '⚗️' },
  { id: 'plant-anatomy', label: 'Plant', emoji: '🌻' },
  { id: 'ecosystem', label: 'Eco', emoji: '🌿' },
  { id: 'biomes', label: 'Biomes', emoji: '🏔️' },
  { id: 'carbon-cycle', label: 'Carbon', emoji: '♻️' },
  { id: 'water-cycle', label: 'Water', emoji: '💧' },
  { id: 'climate', label: 'Climate', emoji: '🌡️' },
  { id: 'metamorphosis', label: 'Meta', emoji: '🦋' },
  { id: 'evolution-tree', label: 'Evolve', emoji: '🌳' },
  { id: 'food-chain', label: 'Food', emoji: '🏊' },
  { id: 'microbe-match', label: 'Match', emoji: '🦠' },
  { id: 'body-quiz', label: 'Quiz', emoji: '❤️' },
  { id: 'cell-compare', label: 'CellCmp', emoji: '🔬' },
  { id: 'photo-factory', label: 'Grow', emoji: '🌱' },
  { id: 'genetics-breeding', label: 'Breed', emoji: '🐾' },
];

interface NavbarProps {
  currentModule: string;
  onNavigate: (id: string) => void;
  progress?: { xp: number; level: number; modulesVisited: Record<string, { visited: boolean }> };
}

export default function Navbar({ currentModule, onNavigate, progress }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [soundMuted, setSoundMuted] = useState(getMuted());

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-emerald-500/30">
      <div className="max-w-[1600px] mx-auto px-3 flex items-center justify-between h-11">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm shrink-0">
          <Microscope className="w-4 h-4" />
          <span className="hidden sm:inline">BioVerse</span>
          {progress && (
            <span className="hidden sm:flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 text-[9px] font-bold">
              ⭐ Lv.{progress.level}
            </span>
          )}
        </button>

        {/* Desktop nav - horizontal scroll */}
        <div className="hidden lg:flex items-center gap-px overflow-x-auto max-w-[calc(100%-100px)] scrollbar-hide py-1">
          {modules.filter(m => m.id !== 'home').map(m => (
            <button key={m.id} onClick={() => onNavigate(m.id)}
              className={`px-1.5 py-1 rounded-md text-[10px] font-medium transition-all whitespace-nowrap ${
                currentModule === m.id
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'text-gray-500 hover:bg-gray-800 hover:text-emerald-400'
              }`}>
              <span className="mr-px">{m.emoji}</span>{m.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button onClick={() => { setMuted(!getMuted()); setSoundMuted(!soundMuted); }}
            className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-400 transition-colors"
            title={soundMuted ? 'Unmute sounds' : 'Mute sounds'}>
            {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-gray-300 hover:text-emerald-400">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-gray-900/98 border-b border-emerald-500/20 overflow-hidden">
            <div className="px-3 py-2 grid grid-cols-5 gap-1">
              {modules.map(m => (
                <button key={m.id}
                  onClick={() => { onNavigate(m.id); setMobileOpen(false); }}
                  className={`px-1 py-1.5 rounded-lg text-[9px] font-medium transition-all text-center ${
                    currentModule === m.id ? 'bg-emerald-500 text-white' : 'text-gray-400 bg-gray-800/50 hover:bg-gray-700'
                  }`}>
                  <div className="text-sm">{m.emoji}</div>
                  {m.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
