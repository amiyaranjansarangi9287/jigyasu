import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Cloud, Droplets, Info } from 'lucide-react';
import { Trans, useTranslation } from "react-i18next";
import ChallengeOverlay, { ChallengeData } from '../../../shared/ui/ChallengeOverlay';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

interface WaterProcess {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  details: string[];
}

const processes: WaterProcess[] = [
  { id: 'evaporation', name: 'Evaporation', emoji: '☀️', color: '#f59e0b',
    description: 'Sun heats water in oceans, lakes, and rivers, turning liquid water into water vapor (gas). This is the main driver of the water cycle.',
    details: ['Ocean surface = primary source', '~500,000 km³ evaporates/year', 'More heat = more evaporation', 'Sea water leaves salt behind'] },
  { id: 'transpiration', name: 'Transpiration', emoji: '🌿', color: '#22c55e',
    description: 'Plants release water vapor through stomata in their leaves. A large oak tree can transpire 40,000 gallons of water per year!',
    details: ['Water exits through stomata', 'Pulls water up from roots', '10% of atmospheric moisture', 'Drives nutrient transport in plants'] },
  { id: 'condensation', name: 'Condensation', emoji: '☁️', color: '#94a3b8',
    description: 'Water vapor cools as it rises and condenses around dust particles to form tiny water droplets — creating clouds and fog.',
    details: ['Water vapor → liquid droplets', 'Needs nucleation particles (dust)', 'Forms clouds at altitude', 'Releases heat energy (latent heat)'] },
  { id: 'precipitation', name: 'Precipitation', emoji: '🌧️', color: '#3b82f6',
    description: 'When cloud droplets combine and become heavy enough, they fall as rain, snow, sleet, or hail — returning water to Earth\'s surface.',
    details: ['Rain, snow, sleet, hail', '~505,000 km³ falls/year', 'Droplets collide & merge in clouds', 'Most falls back into oceans (78%)'] },
  { id: 'collection', name: 'Collection & Runoff', emoji: '🏔️', color: '#06b6d4',
    description: 'Water flows across land (runoff) into streams, rivers, lakes, and eventually oceans. Some seeps underground into aquifers.',
    details: ['Surface runoff → rivers → ocean', 'Infiltration into groundwater', 'Aquifers store fresh water', 'Glaciers = frozen reservoirs'] },
  { id: 'groundwater', name: 'Groundwater', emoji: '💧', color: '#0ea5e9',
    description: 'Water that seeps underground fills spaces between rock and soil particles. This groundwater feeds wells, springs, and eventually returns to surface water.',
    details: ['Fills underground aquifers', 'Can take 1000s of years to cycle', '30% of freshwater is groundwater', 'Springs bring it back to surface'] },
];

export default function WaterCycle() {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [showChallenge, setShowChallenge] = useState(true);

  const activeChallenge: ChallengeData = {
    title: t('learnos.biology.water_wonder', 'A Curious Question...'),
    prompt: t('learnos.biology.water_prompt', "The water you drink today might have been a cloud yesterday or snow a thousand years ago. Let's trace the cycle!"),
    options: [t('learnos.challenge.explore', "Let's explore and find out!")],
    onSuccess: () => {
      setShowChallenge(false);
      const updated = completeModule(progress, 'water-cycle', 60);
      setProgress(updated);
      saveProgress(updated);
    }
  };

  const [selectedProcess, setSelectedProcess] = useState<WaterProcess | null>(null);
  const [sunIntensity, setSunIntensity] = useState(60);
  const [raindrops, setRaindrops] = useState<{ id: number; x: number; delay: number }[]>([]);
  const [vapors, setVapors] = useState<{ id: number; x: number; delay: number }[]>([]);

  useEffect(() => {
    setRaindrops(Array.from({ length: Math.floor(sunIntensity / 8) }, (_, i) => ({
      id: i, x: 40 + Math.random() * 35, delay: Math.random() * 3,
    })));
    setVapors(Array.from({ length: Math.floor(sunIntensity / 12) }, (_, i) => ({
      id: i, x: 10 + Math.random() * 40, delay: Math.random() * 4,
    })));
  }, [sunIntensity]);

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2"><Trans i18nKey="auto.watercycle.water_cycle_lab">💧 Water Cycle Lab</Trans></h2>
          <p className="text-gray-400 text-lg"><Trans i18nKey="auto.watercycle.control_the_sun_and_watch_wate">Control the sun and watch water move through the cycle!</Trans></p>
        </motion.div>

        {/* Sun control */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <Sun className="w-5 h-5 text-yellow-400" />
          <span className="text-sm text-gray-400"><Trans i18nKey="auto.watercycle.sun_intensity">Sun Intensity:</Trans></span>
          <input type="range" min="10" max="100" value={sunIntensity} onChange={e => setSunIntensity(Number(e.target.value))}
            className="w-40 h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #f59e0b88 0%, #f59e0b ${sunIntensity}%, #374151 ${sunIntensity}%, #374151 100%)` }} />
          <span className="text-sm font-mono text-yellow-400">{sunIntensity}%</span>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Visualization */}
          <div className="lg:col-span-3">
            <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden border-2 border-blue-500/20">
              {/* Sky gradient */}
              <div className="absolute inset-0" style={{
                background: `linear-gradient(to bottom, 
                  hsl(210, 80%, ${10 + sunIntensity * 0.15}%) 0%, 
                  hsl(200, 60%, ${15 + sunIntensity * 0.2}%) 40%, 
                  hsl(150, 40%, ${10 + sunIntensity * 0.05}%) 65%, 
                  hsl(30, 40%, ${8}%) 80%, 
                  hsl(210, 60%, ${12}%) 100%)`
              }} />

              {/* Sun */}
              <motion.div className="absolute top-4 right-8 z-10"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}>
                <div className="w-14 h-14 rounded-full bg-yellow-400"
                  style={{ boxShadow: `0 0 ${sunIntensity / 2}px ${sunIntensity / 3}px rgba(250,204,21,${sunIntensity / 200})`, opacity: 0.3 + sunIntensity / 150 }} />
              </motion.div>

              {/* Clouds */}
              <motion.div className="absolute top-[15%] left-[35%]"
                animate={{ x: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}>
                <Cloud className="w-20 h-12 text-gray-400/50" />
              </motion.div>
              <motion.div className="absolute top-[20%] left-[55%]"
                animate={{ x: [10, -10, 10] }}
                transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}>
                <Cloud className="w-16 h-10 text-gray-400/40" />
              </motion.div>

              {/* Evaporation arrows (vapor rising) */}
              {vapors.map(v => (
                <motion.div key={`vap-${v.id}`}
                  className="absolute text-sm text-blue-300/40 font-mono"
                  style={{ left: `${v.x}%`, bottom: '35%' }}
                  animate={{ y: [0, -80], opacity: [0.4, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: v.delay, ease: 'easeOut' }}>
                  <Trans i18nKey="auto.watercycle.h_o">↑ H₂O</Trans>
                                      </motion.div>
              ))}

              {/* Rain */}
              {raindrops.map(r => (
                <motion.div key={`rain-${r.id}`}
                  className="absolute"
                  style={{ left: `${r.x}%`, top: '25%' }}
                  animate={{ y: [0, 120], opacity: [0.6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: r.delay, ease: 'easeIn' }}>
                  <Droplets className="w-3 h-3 text-blue-400/60" />
                </motion.div>
              ))}

              {/* Mountain */}
              <div className="absolute bottom-[35%] right-[10%]">
                <div className="w-0 h-0 border-l-[60px] border-r-[60px] border-b-[80px] border-l-transparent border-r-transparent border-b-gray-600/40" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[25px] border-l-transparent border-r-transparent border-b-white/20" />
              </div>

              {/* Land */}
              <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-t from-amber-900/40 to-green-900/20" />

              {/* Trees */}
              <div className="absolute bottom-[33%] left-[15%] text-2xl">🌳</div>
              <div className="absolute bottom-[33%] left-[25%] text-xl">🌲</div>
              <div className="absolute bottom-[33%] left-[20%] text-lg">🌿</div>

              {/* Ocean */}
              <div className="absolute bottom-0 left-0 w-[35%] h-[35%]">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-800/60 to-blue-600/30 rounded-tr-3xl" />
                <motion.div className="absolute top-0 left-0 right-0 h-3 bg-blue-400/20 rounded-tr-3xl"
                  animate={{ scaleX: [1, 1.02, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }} />
              </div>

              {/* River */}
              <svg className="absolute bottom-0 left-0 right-0 h-[35%] w-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M70,10 Q60,30 55,50 Q50,70 40,90 L35,100" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.3" />
              </svg>

              {/* Underground water */}
              <div className="absolute bottom-0 left-0 right-0 h-[10%] bg-gradient-to-t from-blue-900/30 to-transparent" />

              {/* Labels */}
              <div className="absolute top-[12%] left-[12%] text-sm text-blue-300/60 font-bold"><Trans i18nKey="auto.watercycle.evaporation">EVAPORATION ↑</Trans></div>
              <div className="absolute top-[28%] left-[48%] text-sm text-gray-300/60 font-bold"><Trans i18nKey="auto.watercycle.precipitation">PRECIPITATION ↓</Trans></div>
              <div className="absolute bottom-[38%] left-[22%] text-sm text-green-300/60 font-bold"><Trans i18nKey="auto.watercycle.transpiration">TRANSPIRATION</Trans></div>
              <div className="absolute bottom-[12%] right-[15%] text-sm text-cyan-300/60 font-bold"><Trans i18nKey="auto.watercycle.runoff">RUNOFF →</Trans></div>
              <div className="absolute bottom-[3%] left-[45%] text-sm text-blue-300/40 font-bold"><Trans i18nKey="auto.watercycle.groundwater">GROUNDWATER</Trans></div>
            </div>
          </div>

          {/* Process Info */}
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <h3 className="text-sm font-bold text-white mb-3"><Trans i18nKey="auto.watercycle.water_cycle_processes">🔄 Water Cycle Processes</Trans></h3>
              <div className="space-y-1.5">
                {processes.map(p => (
                  <button key={p.id}
                    onClick={() => setSelectedProcess(selectedProcess?.id === p.id ? null : p)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-all text-sm ${selectedProcess?.id === p.id ? 'bg-blue-500/15 border border-blue-500/30' : 'bg-gray-800/50 border border-transparent hover:bg-gray-800'}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{p.emoji}</span>
                      <div>
                        <div className="font-bold text-white">{p.name}</div>
                        {selectedProcess?.id === p.id && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-1.5">
                            <p className="text-gray-400 mb-2">{p.description}</p>
                            <ul className="space-y-0.5">
                              {p.details.map((d, i) => (
                                <li key={i} className="flex items-start gap-1.5 text-gray-500">
                                  <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: p.color }} />{d}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Key numbers */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                <Info className="w-3 h-3 text-blue-400" /> <Trans i18nKey="auto.watercycle.water_distribution">Water Distribution</Trans>
                                            </h4>
              <div className="space-y-1.5 text-[11px]">
                {[
                  { label: 'Oceans (saltwater)', pct: '97.2%', color: '#1d4ed8' },
                  { label: 'Ice caps & glaciers', pct: '2.1%', color: '#93c5fd' },
                  { label: 'Groundwater', pct: '0.6%', color: '#0ea5e9' },
                  { label: 'Lakes & rivers', pct: '0.01%', color: '#06b6d4' },
                  { label: 'Atmosphere', pct: '0.001%', color: '#94a3b8' },
                ].map(w => (
                  <div key={w.label} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: w.color }} />
                    <span className="text-gray-400 flex-1">{w.label}</span>
                    <span className="font-bold text-gray-300">{w.pct}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 bg-blue-500/10 rounded-lg p-2 border border-blue-500/20">
                <p className="text-sm text-blue-300"><Trans i18nKey="auto.watercycle.only_0_61_of_all_water_on_eart">💡 Only 0.61% of all water on Earth is freshwater accessible to humans! The rest is saltwater or locked in ice.</Trans></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
