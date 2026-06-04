// src/worlds/physics/components/Home.tsx
import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BADGE_INFO, getLevelTitle, ALL_MODULE_IDS, type UserProgress } from '../lib/progress';

const modules = [
  // Daily Challenge
  { id: 'daily', title: 'Daily Challenge', emoji: '🎯', color: 'from-yellow-500 to-amber-500', desc: 'New physics puzzle every day!', tag: 'Daily', cat: 'daily', isDaily: true },
  // Mechanics
  { id: 'projectile-motion', title: 'Projectile Motion', emoji: '🎯', color: 'from-blue-500 to-cyan-500', desc: 'Launch angles, velocity, trajectory', tag: 'Simulator', cat: 'mechanics' },
  { id: 'newtons-laws', title: "Newton's Laws", emoji: '🍎', color: 'from-indigo-500 to-blue-500', desc: 'F=ma, action-reaction, inertia', tag: 'Interactive', cat: 'mechanics' },
  { id: 'pendulum-lab', title: 'Pendulum Lab', emoji: '🕰️', color: 'from-violet-500 to-purple-500', desc: 'Period, length, gravity effects', tag: 'Lab', cat: 'mechanics' },
  { id: 'collision-sim', title: 'Collision Simulator', emoji: '💥', color: 'from-red-500 to-orange-500', desc: 'Elastic & inelastic, momentum', tag: 'Simulator', cat: 'mechanics' },
  { id: 'energy-skate', title: 'Energy Skate Park', emoji: '🛹', color: 'from-emerald-500 to-green-500', desc: 'KE, PE, conservation of energy', tag: 'Park', cat: 'mechanics' },
  { id: 'inclined-plane', title: 'Inclined Plane', emoji: '📐', color: 'from-amber-500 to-yellow-500', desc: 'Forces, friction, acceleration', tag: 'Lab', cat: 'mechanics' },
  // Waves & Sound
  { id: 'wave-interference', title: 'Wave Interference', emoji: '🌊', color: 'from-cyan-500 to-blue-500', desc: 'Constructive & destructive', tag: 'Visualizer', cat: 'waves' },
  { id: 'sound-waves', title: 'Sound Waves', emoji: '🔊', color: 'from-pink-500 to-rose-500', desc: 'Frequency, amplitude, pitch', tag: 'Visualizer', cat: 'waves' },
  { id: 'doppler-effect', title: 'Doppler Effect', emoji: '🚑', color: 'from-red-500 to-pink-500', desc: 'Moving sources, frequency shift', tag: 'Simulator', cat: 'waves' },
  { id: 'standing-waves', title: 'Standing Waves', emoji: '〰️', color: 'from-purple-500 to-indigo-500', desc: 'Nodes, antinodes, harmonics', tag: 'Lab', cat: 'waves' },
  { id: 'resonance-lab', title: 'Resonance Lab', emoji: '🔔', color: 'from-amber-500 to-orange-500', desc: 'Natural frequency, amplification', tag: 'Lab', cat: 'waves' },
  // Electricity & Magnetism
  { id: 'circuit-builder', title: 'Circuit Builder', emoji: '💡', color: 'from-yellow-500 to-amber-500', desc: 'Series, parallel, components', tag: 'Builder', cat: 'electricity' },
  { id: 'magnetic-fields', title: 'Magnetic Fields', emoji: '🧲', color: 'from-red-500 to-rose-500', desc: 'Field lines, poles, strength', tag: 'Visualizer', cat: 'electricity' },
  { id: 'ohms-law', title: "Ohm's Law", emoji: '⚡', color: 'from-blue-500 to-indigo-500', desc: 'V=IR, resistance, current', tag: 'Lab', cat: 'electricity' },
  { id: 'em-induction', title: 'EM Induction', emoji: '🔄', color: 'from-green-500 to-emerald-500', desc: 'Faraday, Lenz, generators', tag: 'Simulator', cat: 'electricity' },
  { id: 'motor-generator', title: 'Motor & Generator', emoji: '⚙️', color: 'from-gray-500 to-slate-500', desc: 'AC/DC, conversion, efficiency', tag: 'Simulator', cat: 'electricity' },
  // Thermodynamics
  { id: 'heat-transfer', title: 'Heat Transfer', emoji: '🔥', color: 'from-orange-500 to-red-500', desc: 'Conduction, convection, radiation', tag: 'Simulator', cat: 'thermo' },
  { id: 'gas-laws', title: 'Gas Laws', emoji: '🎈', color: 'from-pink-500 to-fuchsia-500', desc: 'PV=nRT, Boyle, Charles', tag: 'Lab', cat: 'thermo' },
  { id: 'heat-engine', title: 'Heat Engine', emoji: '🚂', color: 'from-amber-500 to-yellow-500', desc: 'Carnot cycle, efficiency', tag: 'Simulator', cat: 'thermo' },
  { id: 'phase-change', title: 'Phase Change', emoji: '🧊', color: 'from-cyan-500 to-blue-500', desc: 'Melting, boiling, sublimation', tag: 'Lab', cat: 'thermo' },
  // Optics
  { id: 'lens-sim', title: 'Lens Simulator', emoji: '🔍', color: 'from-violet-500 to-purple-500', desc: 'Convex, concave, focal length', tag: 'Simulator', cat: 'optics' },
  { id: 'mirror-lab', title: 'Mirror Lab', emoji: '🪞', color: 'from-gray-400 to-slate-500', desc: 'Plane, concave, convex mirrors', tag: 'Lab', cat: 'optics' },
  { id: 'prism-dispersion', title: 'Prism & Dispersion', emoji: '🌈', color: 'from-rose-500 to-pink-500', desc: 'Spectrum, refraction, wavelength', tag: 'Visualizer', cat: 'optics' },
  { id: 'human-eye', title: 'Human Eye', emoji: '👁️', color: 'from-blue-400 to-cyan-500', desc: 'Lens, retina, vision defects', tag: 'Diagram', cat: 'optics' },
  { id: 'interference-patterns', title: 'Interference Patterns', emoji: '🔬', color: 'from-indigo-500 to-violet-500', desc: 'Double-slit, diffraction', tag: 'Lab', cat: 'optics' },
  // Modern Physics
  { id: 'atomic-structure', title: 'Atomic Structure', emoji: '⚛️', color: 'from-cyan-500 to-blue-500', desc: 'Nucleus, electrons, orbitals', tag: '3D', cat: 'modern' },
  { id: 'photoelectric', title: 'Photoelectric Effect', emoji: '☀️', color: 'from-yellow-500 to-amber-500', desc: 'Einstein, photons, work function', tag: 'Lab', cat: 'modern' },
  { id: 'quantum-tunneling', title: 'Quantum Tunneling', emoji: '🌀', color: 'from-purple-500 to-fuchsia-500', desc: 'Barrier penetration, probability', tag: 'Simulator', cat: 'modern' },
  { id: 'nuclear-decay', title: 'Nuclear Decay', emoji: '☢️', color: 'from-green-500 to-lime-500', desc: 'Alpha, beta, gamma, half-life', tag: 'Simulator', cat: 'modern' },
  // Fluid Mechanics
  { id: 'buoyancy-lab', title: 'Buoyancy Lab', emoji: '🚢', color: 'from-blue-500 to-teal-500', desc: 'Archimedes, density, displacement', tag: 'Lab', cat: 'fluids' },
  { id: 'bernoulli', title: "Bernoulli's Principle", emoji: '💨', color: 'from-sky-500 to-blue-500', desc: 'Pressure, velocity, lift', tag: 'Simulator', cat: 'fluids' },
  { id: 'viscosity', title: 'Viscosity', emoji: '🍯', color: 'from-amber-600 to-yellow-600', desc: 'Fluid resistance, flow rate', tag: 'Lab', cat: 'fluids' },
  { id: 'surface-tension', title: 'Surface Tension', emoji: '💧', color: 'from-cyan-400 to-blue-400', desc: 'Capillary action, droplets', tag: 'Lab', cat: 'fluids' },
  // Space & Gravity
  { id: 'orbital-mechanics', title: 'Orbital Mechanics', emoji: '🛰️', color: 'from-indigo-500 to-purple-500', desc: 'Orbits, velocity, escape', tag: 'Simulator', cat: 'space' },
  { id: 'black-hole', title: 'Black Hole', emoji: '🕳️', color: 'from-gray-900 to-purple-900', desc: 'Event horizon, spaghettification', tag: 'Simulator', cat: 'space' },
  { id: 'planetary-motion', title: 'Planetary Motion', emoji: '🪐', color: 'from-amber-500 to-orange-500', desc: "Kepler's laws, elliptical orbits", tag: 'Simulator', cat: 'space' },
  { id: 'gravity-wells', title: 'Gravity Wells', emoji: '🌌', color: 'from-violet-600 to-indigo-600', desc: 'Spacetime curvature, mass', tag: '3D', cat: 'space' },
  // Flagship
  { id: 'particle-accelerator', title: 'Particle Accelerator', emoji: '⚛️', color: 'from-cyan-500 to-blue-600', desc: 'Discover fundamental particles!', tag: '🔥 Flagship', cat: 'flagship', isFlagship: true },
];

const categories = [
  { id: 'mechanics', title: '⚙️ Mechanics', color: 'from-blue-500 to-cyan-500' },
  { id: 'waves', title: '🌊 Waves & Sound', color: 'from-pink-500 to-rose-500' },
  { id: 'electricity', title: '⚡ Electricity & Magnetism', color: 'from-yellow-500 to-amber-500' },
  { id: 'thermo', title: '🔥 Thermodynamics', color: 'from-orange-500 to-red-500' },
  { id: 'optics', title: '🔍 Optics', color: 'from-violet-500 to-purple-500' },
  { id: 'modern', title: '⚛️ Modern Physics', color: 'from-cyan-500 to-blue-500' },
  { id: 'fluids', title: '💧 Fluid Mechanics', color: 'from-teal-500 to-emerald-500' },
  { id: 'space', title: '🚀 Space & Gravity', color: 'from-indigo-500 to-violet-500' },
];

const floatingEmojis = ['⚛️', '🔬', '🧲', '⚡', '🌊', '🔥', '🚀', '🪐', '💡', '🔭', '🌈', '💧', '🎯', '🕰️', '🔔', '🚢', '💨', '🍯', '🛰️', '🕳️', '🌌', '☢️', '🌀'];

export default function Home({ onNavigate, progress }: { onNavigate: (id: string) => void; progress?: UserProgress }) {
  const { t } = useTranslation();
  const [particles, setParticles] = useState<{ id: number; emoji: string; x: number; delay: number; duration: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const translatedModules = useMemo(() => modules.map(m => ({
    ...m,
    title: t(`physics.modules.${m.id}.title`, m.title),
    desc: t(`physics.modules.${m.id}.desc`, m.desc),
    tag: t(`physics.tags.${m.tag}`, m.tag),
  })), [t]);

  const translatedCategories = useMemo(() => categories.map(c => ({
    ...c,
    title: t(`physics.categories.${c.id}`, c.title),
  })), [t]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i, emoji: floatingEmojis[i % floatingEmojis.length],
        x: 5 + Math.random() * 90, delay: Math.random() * 10, duration: 10 + Math.random() * 15,
      }))
    );
  }, []);

  const newCount = translatedModules.filter(m => !progress?.modulesVisited[m.id]?.visited).length;

  const filteredModules = searchQuery.trim()
    ? translatedModules.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.emoji.includes(searchQuery)
      )
    : null;

  return (
    <div className="min-h-screen bg-gray-950 pt-11">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/15 via-gray-950 to-gray-950" />
        {particles.map(p => (
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
              animate={{ rotateY: [0, 360] }} transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}>⚛️</motion.div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-1">
              {t('physics.title', 'PhysicsVerse').replace('Verse', '')}<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">{t('physics.title', 'PhysicsVerse').includes('Verse') ? 'Verse' : ''}</span>
            </h1>
            <p className="text-sm md:text-base text-gray-400 max-w-md mx-auto mb-1">{t('physics.subtitle', 'Interactive Physics Simulations & Experiments')}</p>
            <p className="text-sm text-cyan-400/80 font-medium tracking-[0.15em] uppercase">
              {t('physics.stats', '{{count}} Modules • 8 Categories • Simulators • Labs • 3D Visualizers', { count: translatedModules.length })}
              {newCount > 0 && <span className="ml-1.5 px-1.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full">{newCount} {t('physics.to_explore', 'TO EXPLORE')}</span>}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Progress Dashboard */}
      {progress && progress.xp > 0 && (
        <div className="max-w-7xl mx-auto px-4 mb-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-gray-900 via-blue-950/30 to-gray-900 rounded-2xl border border-blue-500/20 p-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="text-center">
                <div className="text-sm text-gray-500 uppercase font-bold">{t('physics.dashboard.level', 'Level')}</div>
                <div className="text-2xl font-black text-blue-400">{progress.level}</div>
                <div className="text-sm text-gray-500">{getLevelTitle(progress.level)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 uppercase font-bold">{t('physics.dashboard.xp', 'XP')}</div>
                <div className="text-2xl font-black text-yellow-400">{progress.xp}</div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all" style={{ width: `${(progress.xp % 100)}%` }} />
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 uppercase font-bold">{t('physics.dashboard.explored', 'Explored')}</div>
                <div className="text-2xl font-black text-cyan-400">
                  {Object.values(progress.modulesVisited).filter(m => m.visited).length}<span className="text-sm text-gray-600">/{ALL_MODULE_IDS.length}</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 uppercase font-bold">{t('physics.dashboard.streak', 'Streak')}</div>
                <div className="text-2xl font-black text-orange-400">
                  {progress.streak > 0 ? `${progress.streak}🔥` : '—'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-500 uppercase font-bold">{t('physics.dashboard.badges', 'Badges')}</div>
                <div className="flex justify-center gap-1 mt-1 flex-wrap">
                  {progress.badges.length > 0 ? progress.badges.slice(0, 6).map(b => (
                    <span key={b} className="text-base" title={BADGE_INFO[b]?.name || b}>{BADGE_INFO[b]?.emoji || '🏅'}</span>
                  )) : <span className="text-gray-600 text-sm">{t('physics.keep_exploring', 'Keep exploring!')}</span>}
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
            placeholder={t('physics.search_placeholder', "🔍 Search modules... (try 'wave', 'circuit', 'quantum')")}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-500 hover:text-white" aria-label={t('physics.clear_search', "Clear search")}>✕</button>
          )}
        </div>
      </div>

      {/* Search Results or Module Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-10">
        {filteredModules ? (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-400 mb-3 pl-1">
              {filteredModules.length > 0 ? (filteredModules.length === 1 ? t('physics.found_modules_one', 'Found 1 module') : t('physics.found_modules_other', 'Found {{count}} modules', { count: filteredModules.length })) : t('physics.no_modules', 'No modules found')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5">
              {filteredModules.map((mod) => {
                const isVisited = progress?.modulesVisited[mod.id]?.visited;
                return (
                  <motion.button key={mod.id} layout
                    onClick={() => onNavigate(mod.id)}
                    className="group relative bg-gray-900 border border-gray-800 rounded-xl p-3 text-left hover:border-blue-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5">
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${mod.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    {isVisited && <div className="absolute top-1.5 right-1.5 text-sm">👁️</div>}
                    <div className="text-xl mb-1">{mod.emoji}</div>
                    <h4 className="text-sm font-bold text-white mb-0.5 group-hover:text-blue-400 transition-colors leading-tight">{mod.title}</h4>
                    <p className="text-[9px] text-gray-500 leading-tight line-clamp-2">{mod.desc}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ) : (
        <>
        {translatedCategories.map((cat, catIdx) => {
          const catModules = translatedModules.filter(m => m.cat === cat.id);
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
                  <span className="text-sm text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{catVisited}/{catModules.length} {t('physics.explored', 'explored')}</span>
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
                      className={`group relative bg-gray-900 border rounded-xl p-3 text-left transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 ${isCompleted ? 'border-blue-500/30' : isVisited ? 'border-gray-700' : 'border-gray-800'} hover:border-blue-500/50`}>
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${mod.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                      {(isVisited || isCompleted) && (
                        <div className="absolute top-1.5 right-1.5 text-sm">
                          {isCompleted ? '✅' : '👁️'}
                        </div>
                      )}
                      <div className="flex items-center gap-1 mb-1.5">
                        <span className="px-2 py-0.5 rounded-full text-sm font-bold uppercase tracking-wider bg-gray-800 text-gray-500 group-hover:bg-blue-500/20 group-hover:text-blue-400">{mod.tag}</span>
                      </div>
                      <div className="text-xl mb-1">{mod.emoji}</div>
                      <h4 className="text-sm font-bold text-white mb-0.5 group-hover:text-blue-400 transition-colors leading-tight">{mod.title}</h4>
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
        <p className="text-sm text-gray-600">{t('physics.footer', '⚛️ PhysicsVerse — {{count}} Interactive Physics Modules • React + Tailwind + Canvas', { count: translatedModules.length })}</p>
      </div>
    </div>
  );
}
