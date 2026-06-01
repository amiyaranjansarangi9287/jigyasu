import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp, Sparkles, BookOpen } from 'lucide-react';
import type { CanvasProps } from '../../types';

interface Element {
  number: number;
  symbol: string;
  name: string;
  category: 'metal' | 'nonmetal' | 'noble' | 'metalloid' | 'alkali' | 'alkaline' | 'transition' | 'halogen';
  mass: number;
  funFact: string;
  indianContext?: string;
  discovery?: string;
  uses?: string[];
}

const ELEMENTS: Element[] = [
  { number: 1, symbol: 'H', name: 'Hydrogen', category: 'nonmetal', mass: 1.008, funFact: 'Lightest element! Makes up 75% of the universe.', uses: ['Rocket fuel', 'Making ammonia', 'Future clean energy'] },
  { number: 2, symbol: 'He', name: 'Helium', category: 'noble', mass: 4.003, funFact: 'Makes your voice squeaky! Never reacts with anything.', uses: ['Balloons', 'MRI machines', 'Diving tanks'] },
  { number: 3, symbol: 'Li', name: 'Lithium', category: 'alkali', mass: 6.941, funFact: 'Lightest metal! Floats on water.', indianContext: 'India has lithium reserves in J&K!', uses: ['Batteries', 'Medicine', 'Glass'] },
  { number: 4, symbol: 'Be', name: 'Beryllium', category: 'alkaline', mass: 9.012, funFact: 'Used in spacecraft windows!', uses: ['X-ray tubes', 'Nuclear reactors'] },
  { number: 6, symbol: 'C', name: 'Carbon', category: 'nonmetal', mass: 12.011, funFact: 'Basis of all life! Both diamond and coal.', indianContext: 'Coal from Jharkhand powers our cities', uses: ['Steel making', 'Diamonds', 'Life itself!'] },
  { number: 7, symbol: 'N', name: 'Nitrogen', category: 'nonmetal', mass: 14.007, funFact: '78% of the air you breathe!', indianContext: 'Used in fertilizers for our farms', uses: ['Fertilizers', 'Food preservation', 'Explosives'] },
  { number: 8, symbol: 'O', name: 'Oxygen', category: 'nonmetal', mass: 15.999, funFact: 'We need this to live! Created by plants.', indianContext: 'Pranayam - the yoga of breath!', uses: ['Breathing', 'Steel making', 'Hospitals'] },
  { number: 10, symbol: 'Ne', name: 'Neon', category: 'noble', mass: 20.180, funFact: 'Glows orange-red in signs!', uses: ['Neon signs', 'Lasers', 'TV tubes'] },
  { number: 11, symbol: 'Na', name: 'Sodium', category: 'alkali', mass: 22.990, funFact: 'Explodes in water! Part of table salt.', indianContext: 'Namak - essential for our food', uses: ['Table salt', 'Street lights', 'Baking soda'] },
  { number: 12, symbol: 'Mg', name: 'Magnesium', category: 'alkaline', mass: 24.305, funFact: 'Burns with brilliant white light!', indianContext: 'Diwali sparklers contain magnesium!', uses: ['Fireworks', 'Airplane parts', 'Antacids'] },
  { number: 13, symbol: 'Al', name: 'Aluminium', category: 'metal', mass: 26.982, funFact: 'Most abundant metal in Earth\'s crust!', indianContext: 'Hindalco is world\'s largest Al producer', uses: ['Foil', 'Cans', 'Airplanes'] },
  { number: 14, symbol: 'Si', name: 'Silicon', category: 'metalloid', mass: 28.086, funFact: 'Powers all our computers!', indianContext: 'Bangalore - India\'s Silicon Valley', uses: ['Computer chips', 'Glass', 'Solar cells'] },
  { number: 17, symbol: 'Cl', name: 'Chlorine', category: 'halogen', mass: 35.453, funFact: 'Purifies swimming pool water!', uses: ['Water treatment', 'PVC plastic', 'Bleach'] },
  { number: 18, symbol: 'Ar', name: 'Argon', category: 'noble', mass: 39.948, funFact: 'Used in light bulbs! 1% of atmosphere.', uses: ['Light bulbs', 'Welding', 'Preserving documents'] },
  { number: 19, symbol: 'K', name: 'Potassium', category: 'alkali', mass: 39.098, funFact: 'Bananas are rich in potassium!', indianContext: 'Kerala bananas are potassium-rich!', uses: ['Fertilizers', 'Soap', 'Glass'] },
  { number: 20, symbol: 'Ca', name: 'Calcium', category: 'alkaline', mass: 40.078, funFact: 'Builds strong bones!', indianContext: 'Drink your doodh for calcium!', uses: ['Bones', 'Cement', 'Chalk'] },
  { number: 26, symbol: 'Fe', name: 'Iron', category: 'transition', mass: 55.845, funFact: 'Earth\'s core is mostly iron!', indianContext: 'Iron Pillar of Delhi - 1600 years rust-free!', uses: ['Steel', 'Hemoglobin', 'Magnets'] },
  { number: 29, symbol: 'Cu', name: 'Copper', category: 'transition', mass: 63.546, funFact: 'Excellent conductor! Turns green over time.', indianContext: 'Copper vessels (tamba) in temples', uses: ['Wiring', 'Coins', 'Pipes'] },
  { number: 30, symbol: 'Zn', name: 'Zinc', category: 'transition', mass: 65.38, funFact: 'Protects iron from rusting!', indianContext: 'Zawar mines - ancient zinc source', uses: ['Galvanizing', 'Batteries', 'Sunscreen'] },
  { number: 47, symbol: 'Ag', name: 'Silver', category: 'transition', mass: 107.87, funFact: 'Best electrical conductor!', indianContext: 'India loves silver jewelry!', uses: ['Jewelry', 'Photography', 'Medicine'] },
  { number: 79, symbol: 'Au', name: 'Gold', category: 'transition', mass: 196.97, funFact: 'Never rusts! Symbol of purity.', indianContext: 'Kolar Gold Fields - 2000+ years!', uses: ['Jewelry', 'Electronics', 'Dentistry'] },
  { number: 82, symbol: 'Pb', name: 'Lead', category: 'metal', mass: 207.2, funFact: 'Very dense! Used in X-ray shields.', uses: ['Batteries', 'Radiation shields'] },
];

const SCIENTISTS = [
  { name: 'C.V. Raman', achievement: 'Raman Effect - light scattering', emoji: '🔬', year: '1930 Nobel Prize' },
  { name: 'Jagadish Chandra Bose', achievement: 'Plants have feelings!', emoji: '🌱', year: '1858-1937' },
  { name: 'Meghnad Saha', achievement: 'Saha Equation - star spectra', emoji: '⭐', year: '1893-1956' },
  { name: 'Prafulla Chandra Ray', achievement: 'Father of Indian Chemistry', emoji: '⚗️', year: '1861-1944' },
];

const CATEGORY_CONFIG = {
  metal: { color: 'bg-blue-600 hover:bg-blue-500', label: 'Metal', textColor: 'text-blue-400' },
  nonmetal: { color: 'bg-green-600 hover:bg-green-500', label: 'Non-metal', textColor: 'text-green-400' },
  noble: { color: 'bg-purple-600 hover:bg-purple-500', label: 'Noble Gas', textColor: 'text-purple-400' },
  metalloid: { color: 'bg-amber-600 hover:bg-amber-500', label: 'Metalloid', textColor: 'text-amber-400' },
  alkali: { color: 'bg-red-600 hover:bg-red-500', label: 'Alkali Metal', textColor: 'text-red-400' },
  alkaline: { color: 'bg-orange-600 hover:bg-orange-500', label: 'Alkaline Earth', textColor: 'text-orange-400' },
  transition: { color: 'bg-cyan-600 hover:bg-cyan-500', label: 'Transition Metal', textColor: 'text-cyan-400' },
  halogen: { color: 'bg-teal-600 hover:bg-teal-500', label: 'Halogen', textColor: 'text-teal-400' },
};

type ViewMode = 'table' | 'trends' | 'scientists' | 'quiz';

export default function PeriodicTableCanvas({ isPlaying }: CanvasProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightCategory, setHighlightCategory] = useState<string | null>(null);
  const [quizElement, setQuizElement] = useState<Element | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);

  const filteredElements = ELEMENTS.filter(el =>
    el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    el.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleElementClick = (element: Element) => {
    if (!isPlaying) return;
    setSelectedElement(element);
  };

  const startQuiz = () => {
    const randomElement = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
    setQuizElement(randomElement);
    setQuizAnswered(false);
  };

  const checkQuizAnswer = (symbol: string) => {
    if (!quizElement || quizAnswered) return;
    setQuizAnswered(true);
    if (symbol === quizElement.symbol) {
      setQuizScore(prev => prev + 1);
    }
    setTimeout(startQuiz, 1500);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* View Mode Tabs */}
      <div className="flex gap-2 flex-wrap justify-center">
        {[
          { mode: 'table' as ViewMode, label: '📊 Table', icon: null },
          { mode: 'trends' as ViewMode, label: '📈 Trends', icon: TrendingUp },
          { mode: 'scientists' as ViewMode, label: '👨‍🔬 Scientists', icon: BookOpen },
          { mode: 'quiz' as ViewMode, label: '🎯 Quiz', icon: Sparkles },
        ].map(({ mode, label }) => (
          <button
            key={mode}
            onClick={() => {
              setViewMode(mode);
              if (mode === 'quiz') startQuiz();
            }}
            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
              viewMode === mode
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* TABLE MODE */}
      {viewMode === 'table' && (
        <>
          <h3 className="text-xl font-bold text-emerald-400">🔬 Periodic Table Explorer</h3>

          {/* Search */}
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search elements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category Legend */}
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(CATEGORY_CONFIG).slice(0, 4).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setHighlightCategory(highlightCategory === key ? null : key)}
                className={`px-2 py-1 rounded text-xs transition-all ${
                  highlightCategory === key ? config.color + ' text-white' : 'bg-slate-700 ' + config.textColor
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>

          {/* Mini Periodic Table */}
          <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 w-full max-w-md">
            {filteredElements.map((element, index) => {
              const config = CATEGORY_CONFIG[element.category];
              const isHighlighted = !highlightCategory || element.category === highlightCategory;
              
              return (
                <motion.button
                  key={element.symbol}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: isHighlighted ? 1 : 0.3, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ scale: 1.15, zIndex: 10 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleElementClick(element)}
                  className={`relative p-2 rounded-lg ${config.color} text-white transition-all ${
                    selectedElement?.symbol === element.symbol ? 'ring-2 ring-white shadow-lg' : ''
                  }`}
                >
                  <span className="absolute top-0.5 left-1 text-[8px] opacity-70">{element.number}</span>
                  <span className="text-lg font-bold">{element.symbol}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Element Info Card */}
          <AnimatePresence>
            {selectedElement && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-sm bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden"
              >
                <div className={`${CATEGORY_CONFIG[selectedElement.category].color} p-4`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-sm opacity-70">#{selectedElement.number}</span>
                      <h4 className="text-3xl font-bold">{selectedElement.symbol}</h4>
                      <p className="text-lg">{selectedElement.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-70">Mass</p>
                      <p className="font-mono">{selectedElement.mass}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <p className="text-slate-300 text-sm">{selectedElement.funFact}</p>
                  {selectedElement.indianContext && (
                    <p className="text-emerald-400 text-sm">🇮🇳 {selectedElement.indianContext}</p>
                  )}
                  {selectedElement.uses && (
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Uses:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedElement.uses.map(use => (
                          <span key={use} className="px-2 py-0.5 bg-slate-700 rounded-full text-xs text-slate-300">
                            {use}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* TRENDS MODE */}
      {viewMode === 'trends' && (
        <>
          <h3 className="text-xl font-bold text-emerald-400">📈 Periodic Trends</h3>
          
          <div className="space-y-4 w-full max-w-md">
            {/* Atomic Size Trend */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h4 className="font-bold text-cyan-400 mb-2">Atomic Size →</h4>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-cyan-600" />
                <div className="flex-1 h-2 bg-gradient-to-r from-cyan-600 to-cyan-300 rounded-full" />
                <div className="w-10 h-10 rounded-full bg-cyan-300" />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Increases left to right (within period), decreases top to bottom (within group)
              </p>
            </div>

            {/* Electronegativity Trend */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h4 className="font-bold text-amber-400 mb-2">Electronegativity ↗</h4>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Low</span>
                <div className="flex-1 h-2 bg-gradient-to-r from-slate-600 via-amber-500 to-red-500 rounded-full" />
                <span className="text-sm text-red-400">High</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Fluorine (F) is most electronegative. Increases towards top-right.
              </p>
            </div>

            {/* Metallic Character */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h4 className="font-bold text-blue-400 mb-2">Metallic Character ↙</h4>
              <div className="grid grid-cols-4 gap-1">
                {['🔵', '🔵', '🟡', '🟢'].map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="h-8 rounded flex items-center justify-center text-lg"
                  >
                    {c}
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>🔵 Metals</span>
                <span>🟡 Metalloids</span>
                <span>🟢 Non-metals</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* SCIENTISTS MODE */}
      {viewMode === 'scientists' && (
        <>
          <h3 className="text-xl font-bold text-amber-400">🇮🇳 Indian Scientists</h3>
          
          <div className="w-full max-w-md space-y-3">
            {SCIENTISTS.map((scientist, i) => (
              <motion.div
                key={scientist.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="bg-slate-800 p-4 rounded-xl border border-amber-500/30 hover:border-amber-500/60 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <motion.span 
                    className="text-4xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  >
                    {scientist.emoji}
                  </motion.span>
                  <div className="flex-1">
                    <h5 className="font-bold text-white">{scientist.name}</h5>
                    <p className="text-sm text-amber-400">{scientist.achievement}</p>
                    <p className="text-xs text-slate-500">{scientist.year}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* QUIZ MODE */}
      {viewMode === 'quiz' && (
        <>
          <h3 className="text-xl font-bold text-purple-400">🎯 Element Quiz</h3>
          <p className="text-slate-400">Score: <span className="text-purple-400 font-bold">{quizScore}</span></p>
          
          {quizElement && (
            <motion.div
              key={quizElement.symbol}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-slate-800/50 p-6 rounded-2xl border border-slate-700"
            >
              <p className="text-slate-400 mb-2">What element is this?</p>
              <p className="text-lg text-white mb-1">Atomic Number: <span className="text-emerald-400 font-bold">{quizElement.number}</span></p>
              <p className="text-sm text-slate-400 mb-4">{quizElement.funFact}</p>
              
              <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
                {[quizElement, ...ELEMENTS.filter(e => e.symbol !== quizElement.symbol).sort(() => Math.random() - 0.5).slice(0, 3)]
                  .sort(() => Math.random() - 0.5)
                  .map(el => (
                    <motion.button
                      key={el.symbol}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => checkQuizAnswer(el.symbol)}
                      disabled={quizAnswered}
                      className={`p-3 rounded-xl font-bold transition-all ${
                        quizAnswered
                          ? el.symbol === quizElement.symbol
                            ? 'bg-green-600 text-white'
                            : 'bg-slate-700 text-slate-400'
                          : 'bg-slate-700 hover:bg-slate-600 text-white'
                      }`}
                    >
                      {el.symbol} - {el.name}
                    </motion.button>
                  ))}
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Fun Fact */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-3 max-w-sm text-center"
      >
        <p className="text-sm text-emerald-200">
          <span className="font-bold">✨ Amazing:</span> Your body contains about 60% oxygen, 18% carbon, 
          10% hydrogen, and traces of iron, calcium, and more!
        </p>
      </motion.div>
    </div>
  );
}
