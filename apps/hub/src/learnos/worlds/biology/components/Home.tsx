import { motion } from 'framer-motion';
import { useState } from 'react';
import { BADGE_INFO, getLevelTitle, ALL_MODULE_IDS, type UserProgress } from '../lib/progress';

const modules = [
  // Cell Biology
  { id: 'cell-map', title: 'Cell Explorer', emoji: '🗺️', color: 'from-blue-500 to-cyan-500', desc: '14 organelles, plant vs animal', tag: 'Map', cat: 'cell' },
  { id: 'dna-visualizer', title: 'DNA Visualizer', emoji: '🧬', color: 'from-purple-500 to-pink-500', desc: 'Helix, transcription, codons', tag: 'Visualizer', cat: 'cell' },
  { id: 'mitosis', title: 'Mitosis', emoji: '🧪', color: 'from-red-500 to-rose-500', desc: '6 phases of cell division', tag: 'Simulator', cat: 'cell' },
  { id: 'meiosis', title: 'Meiosis', emoji: '🔀', color: 'from-violet-500 to-purple-500', desc: '9 stages, crossing over', tag: 'Simulator', cat: 'cell' },
  { id: 'respiration', title: 'Cell Respiration', emoji: '🔋', color: 'from-yellow-500 to-amber-500', desc: 'Glycolysis → Krebs → ETC', tag: 'Visualizer', cat: 'cell' },
  { id: 'photosynthesis', title: 'Photosynthesis', emoji: '🧫', color: 'from-green-600 to-lime-500', desc: 'Light, water, CO₂ controls', tag: 'Lab', cat: 'cell' },
  // Genetics
  { id: 'punnett-square', title: 'Punnett Square', emoji: '🎲', color: 'from-indigo-500 to-blue-500', desc: '8 traits, offspring predictions', tag: 'Calculator', cat: 'genetics' },
  { id: 'crispr', title: 'CRISPR Editor', emoji: '✂️', color: 'from-red-500 to-orange-500', desc: 'Edit genes, real-world targets', tag: 'Simulator', cat: 'genetics', isNew: true },
  { id: 'evolution-tree', title: 'Evolution Tree', emoji: '🌳', color: 'from-amber-500 to-orange-500', desc: 'Phylogenetic tree of life', tag: 'Map', cat: 'genetics' },
  // Human Body
  { id: 'brain', title: 'Brain Explorer', emoji: '🧠', color: 'from-purple-600 to-indigo-500', desc: '8 regions, neural facts', tag: 'Map', cat: 'body', isNew: true },
  { id: 'heart', title: 'Heart & Blood', emoji: '🫀', color: 'from-red-600 to-pink-500', desc: 'Blood flow animation', tag: '3D', cat: 'body' },
  { id: 'digestive', title: 'Digestive Journey', emoji: '🦷', color: 'from-orange-500 to-yellow-500', desc: '8 organs, follow your food', tag: 'Timeline', cat: 'body', isNew: true },
  { id: 'immune-defense', title: 'Immune Defense', emoji: '🛡️', color: 'from-teal-500 to-cyan-500', desc: 'Tower defense vs pathogens', tag: 'Game', cat: 'body' },
  { id: 'body-quiz', title: 'Body Quiz', emoji: '❤️', color: 'from-pink-500 to-red-500', desc: '10 questions, all systems', tag: 'Quiz', cat: 'body' },
  // Lab & Tools
  { id: 'molecule-3d', title: '3D Molecules', emoji: '🔬', color: 'from-orange-500 to-yellow-500', desc: 'Rotate 5 molecules in 3D', tag: '3D', cat: 'lab' },
  { id: 'microscope', title: 'Microscope', emoji: '🔎', color: 'from-indigo-500 to-violet-500', desc: '4 specimens, zoom & pan', tag: 'Simulator', cat: 'lab' },
  { id: 'enzyme-lab', title: 'Enzyme Lab', emoji: '⚗️', color: 'from-emerald-500 to-teal-500', desc: 'Temp, pH, substrate effects', tag: 'Lab', cat: 'lab', isNew: true },
  // Plant Biology
  { id: 'plant-anatomy', title: 'Plant Anatomy', emoji: '🌻', color: 'from-green-500 to-lime-500', desc: 'Flower, leaf, stem, root', tag: 'Diagram', cat: 'plant', isNew: true },
  // Ecology
  { id: 'ecosystem', title: 'Ecosystem', emoji: '🌿', color: 'from-green-500 to-emerald-500', desc: '17 species, weather events', tag: 'Strategy', cat: 'ecology' },
  { id: 'biomes', title: 'Biomes', emoji: '🏔️', color: 'from-sky-500 to-blue-500', desc: '8 world biomes explored', tag: 'Map', cat: 'ecology' },
  { id: 'carbon-cycle', title: 'Carbon Cycle', emoji: '♻️', color: 'from-gray-500 to-slate-500', desc: 'CO₂ flows, reservoirs, impacts', tag: 'Diagram', cat: 'ecology', isNew: true },
  { id: 'water-cycle', title: 'Water Cycle', emoji: '💧', color: 'from-blue-500 to-cyan-500', desc: 'Control sun, watch the cycle', tag: 'Lab', cat: 'ecology', isNew: true },
  { id: 'climate', title: 'Climate Sim', emoji: '🌡️', color: 'from-orange-600 to-red-500', desc: 'Emissions, sea level, what-if', tag: 'Simulator', cat: 'ecology' },
  { id: 'food-chain', title: 'Food Chain', emoji: '🏊', color: 'from-cyan-500 to-blue-500', desc: '3-level arcade survival', tag: 'Arcade', cat: 'ecology' },
  // Animals
  { id: 'metamorphosis', title: 'Metamorphosis', emoji: '🦋', color: 'from-pink-500 to-purple-500', desc: 'Butterfly, frog, dragonfly', tag: 'Timeline', cat: 'animals' },
  { id: 'microbe-match', title: 'Microbe Match', emoji: '🦠', color: 'from-lime-500 to-green-500', desc: '12 microbes, 3 difficulties', tag: 'Game', cat: 'animals' },
];

const categories = [
  { id: 'cell', title: '🧬 Cell Biology' },
  { id: 'genetics', title: '🎲 Genetics & Evolution' },
  { id: 'body', title: '🫀 Human Body' },
  { id: 'lab', title: '🔬 Lab & Tools' },
  { id: 'plant', title: '🌱 Plant Biology' },
  { id: 'ecology', title: '🌍 Ecology & Climate' },
  { id: 'animals', title: '🦋 Life Cycles & Animals' },
];

const floatingEmojis = ['🧬', '🌿', '🦠', '🔬', '🧪', '🌳', '❤️', '🐟', '🦋', '🍄', '🐙', '🌻', '⚡', '🧫', '🫧', '🦊', '🌡️', '🏔️', '🧠', '✂️', '💧', '♻️', '⚗️'];

const heroParticles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  emoji: floatingEmojis[i % floatingEmojis.length],
  x: 5 + ((i * 37) % 90),
  delay: ((i * 11) % 100) / 10,
  duration: 10 + ((i * 17) % 150) / 10,
}));

export default function Home({ onNavigate, progress }: { onNavigate: (id: string) => void; progress?: UserProgress }) {
  const [searchQuery, setSearchQuery] = useState('');

  const newCount = modules.filter(m => m.isNew).length;

  // Filter modules by search
  const filteredModules = searchQuery.trim()
    ? modules.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.emoji.includes(searchQuery)
      )
    : null; // null means show categories as normal

  return (
    <div className="min-h-screen bg-gray-950 pt-11">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/15 via-gray-950 to-gray-950" />
        <div className="absolute inset-0 opacity-8" style={{ backgroundImage: `url('/images/hero-biology.webp')`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(3px)' }} />
        {heroParticles.map(p => (
          <motion.div key={p.id} className="absolute text-lg opacity-8 pointer-events-none"
            style={{ left: `${p.x}%` }}
            initial={{ y: '110vh', rotate: 0 }}
            animate={{ y: '-10vh', rotate: 360 }}
            transition={{ repeat: Infinity, duration: p.duration, delay: p.delay, ease: 'linear' }}>
            {p.emoji}
          </motion.div>
        ))}
        <div className="relative max-w-7xl mx-auto px-4 pt-10 pb-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.div className="text-4xl md:text-5xl mb-2"
              animate={{ rotateY: [0, 360] }} transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}>🧬</motion.div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-1">
              Bio<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Verse</span>
            </h1>
            <p className="text-sm md:text-base text-gray-400 max-w-md mx-auto mb-1">Your Immersive Biology Learning Universe</p>
            <p className="text-sm text-emerald-400/80 font-medium tracking-[0.15em] uppercase">
              {modules.length} Modules • Maps • 3D • Games • Labs • Simulators
              {newCount > 0 && <span className="ml-1.5 px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full">{newCount} NEW</span>}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Progress Dashboard */}
      {progress && progress.xp > 0 && (
        <div className="max-w-7xl mx-auto px-4 mb-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-gray-900 via-emerald-950/30 to-gray-900 rounded-2xl border border-emerald-500/20 p-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="text-center">
                <div className="text-sm text-gray-500 uppercase font-bold">Level</div>
                <div className="text-2xl font-black text-emerald-400">
                  {progress.level}
                </div>
                <div className="text-sm text-gray-500">{getLevelTitle(progress.level)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 uppercase font-bold">XP</div>
                <div className="text-2xl font-black text-yellow-400">{progress.xp}</div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all" style={{ width: `${(progress.xp % 100)}%` }} />
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 uppercase font-bold">Explored</div>
                <div className="text-2xl font-black text-cyan-400">
                  {Object.values(progress.modulesVisited).filter(m => m.visited).length}<span className="text-sm text-gray-600">/{ALL_MODULE_IDS.length}</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 uppercase font-bold">Streak</div>
                <div className="text-2xl font-black text-orange-400">
                  {progress.streak > 0 ? `${progress.streak}🔥` : '—'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 uppercase font-bold">Badges</div>
                <div className="flex justify-center gap-1 mt-1 flex-wrap">
                  {progress.badges.length > 0 ? progress.badges.slice(0, 6).map(b => (
                    <span key={b} className="text-base" title={BADGE_INFO[b]?.name || b}>{BADGE_INFO[b]?.emoji || '🏅'}</span>
                  )) : <span className="text-gray-600 text-sm">Keep exploring!</span>}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 mb-4">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="🔍 Search modules... (try 'DNA', 'game', 'quiz')"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-500 hover:text-white" aria-label="Clear search">✕</button>
          )}
        </div>
      </div>

      {/* Search Results or Module Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-10">
        {filteredModules ? (
          /* Search results */
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-400 mb-3 pl-1">
              {filteredModules.length > 0 ? `Found ${filteredModules.length} module${filteredModules.length !== 1 ? 's' : ''}` : 'No modules found'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5">
              {filteredModules.map((mod) => {
                const isVisited = progress?.modulesVisited[mod.id]?.visited;
                return (
                  <motion.button key={mod.id} layout
                    onClick={() => onNavigate(mod.id)}
                    className="group relative bg-gray-900 border border-gray-800 rounded-xl p-3 text-left hover:border-emerald-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5">
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${mod.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    {isVisited && <div className="absolute top-1.5 right-1.5 text-sm">👁️</div>}
                    <div className="text-xl mb-1">{mod.emoji}</div>
                    <h4 className="text-sm font-bold text-white mb-0.5 group-hover:text-emerald-400 transition-colors leading-tight">{mod.title}</h4>
                    <p className="text-[9px] text-gray-500 leading-tight line-clamp-2">{mod.desc}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ) : (
        /* Normal category view */
        <>
        {categories.map((cat, catIdx) => {
          const catModules = modules.filter(m => m.cat === cat.id);
          if (catModules.length === 0) return null;
          const catVisited = catModules.filter(m => progress?.modulesVisited[m.id]?.visited).length;
          return (
            <motion.div key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.06 }}
              className="mb-6">
              <div className="flex items-center gap-2 mb-2.5 pl-1">
                <h3 className="text-sm font-bold text-white">{cat.title}</h3>
                {progress && catVisited > 0 && (
                  <span className="text-sm text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{catVisited}/{catModules.length} explored</span>
                )}
              </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5">
                {catModules.map((mod, i) => {
                  const isVisited = progress?.modulesVisited[mod.id]?.visited;
                  const isCompleted = progress?.modulesVisited[mod.id]?.completed;
                  return (
                    <motion.button key={mod.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: catIdx * 0.06 + i * 0.02 }}
                      onClick={() => onNavigate(mod.id)}
                      className={`group relative bg-gray-900 border rounded-xl p-3 text-left transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5 ${isCompleted ? 'border-emerald-500/30' : isVisited ? 'border-gray-700' : 'border-gray-800'} hover:border-emerald-500/50`}>
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${mod.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                      {/* Status indicator */}
                      {(isVisited || isCompleted) && (
                        <div className="absolute top-1.5 right-1.5 text-sm">
                          {isCompleted ? '✅' : '👁️'}
                        </div>
                      )}
                      <div className="flex items-center gap-1 mb-1.5">
                        <span className="px-2 py-0.5 rounded-full text-sm font-bold uppercase tracking-wider bg-gray-800 text-gray-500 group-hover:bg-emerald-500/20 group-hover:text-emerald-400">{mod.tag}</span>
                        {mod.isNew && !isVisited && <span className="px-2 py-0.5 rounded-full text-sm font-bold uppercase bg-yellow-500/20 text-yellow-400 animate-pulse">NEW</span>}
                      </div>
                      <div className="text-xl mb-1">{mod.emoji}</div>
                      <h4 className="text-sm font-bold text-white mb-0.5 group-hover:text-emerald-400 transition-colors leading-tight">{mod.title}</h4>
                    <p className="text-[11px] sm:text-sm text-gray-500 leading-tight line-clamp-2">{mod.desc}</p>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
        </>
        )}
      </div>
      <div className="border-t border-gray-800 py-3 text-center">
        <p className="text-sm text-gray-600">🧬 BioVerse — {modules.length} Interactive Biology Modules • React + Tailwind</p>
      </div>
    </div>
  );
}
