import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Info, Heart } from 'lucide-react';
import { Trans, useTranslation } from "react-i18next";
import ChallengeOverlay, { ChallengeData } from '../../../shared/ui/ChallengeOverlay';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

interface HeartPart {
  id: string;
  name: string;
  description: string;
  funFact: string;
  color: string;
}

const heartParts: HeartPart[] = [
  { id: 'ra', name: 'Right Atrium', description: 'Receives deoxygenated blood from the body via the superior and inferior vena cava. Thin-walled chamber that pumps blood to the right ventricle.', funFact: 'The sinoatrial (SA) node, the heart\'s natural pacemaker, is located here!', color: '#3b82f6' },
  { id: 'rv', name: 'Right Ventricle', description: 'Pumps deoxygenated blood to the lungs via the pulmonary artery. Has thinner walls than the left ventricle since it only pumps to nearby lungs.', funFact: 'The right ventricle is shaped like a crescent moon!', color: '#60a5fa' },
  { id: 'la', name: 'Left Atrium', description: 'Receives oxygenated blood from the lungs via the pulmonary veins. Sends this oxygen-rich blood to the left ventricle.', funFact: 'It receives blood from 4 pulmonary veins — 2 from each lung!', color: '#dc2626' },
  { id: 'lv', name: 'Left Ventricle', description: 'The most muscular chamber! Pumps oxygenated blood to the entire body via the aorta. Has walls 3x thicker than the right ventricle.', funFact: 'It generates the most pressure of any heart chamber — about 120 mmHg!', color: '#ef4444' },
  { id: 'aorta', name: 'Aorta', description: 'The largest artery in the body. Carries oxygenated blood from the left ventricle to the rest of the body.', funFact: 'The aorta is about the width of a garden hose (2.5 cm)!', color: '#ef4444' },
  { id: 'pa', name: 'Pulmonary Artery', description: 'The only artery that carries deoxygenated blood! Takes blood from the right ventricle to the lungs for oxygenation.', funFact: 'It\'s called an artery because it carries blood AWAY from the heart, not because of oxygen content!', color: '#3b82f6' },
  { id: 'pv', name: 'Pulmonary Veins', description: 'The only veins that carry oxygenated blood! Return oxygen-rich blood from the lungs to the left atrium.', funFact: 'There are 4 pulmonary veins, but some people naturally have 3 or 5!', color: '#dc2626' },
  { id: 'vc', name: 'Vena Cava', description: 'The two largest veins (superior and inferior) that return deoxygenated blood from the body to the right atrium.', funFact: 'The superior vena cava drains the upper body, inferior drains the lower body!', color: '#3b82f6' },
];



export default function HeartCirculation() {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [showChallenge, setShowChallenge] = useState(true);

  const activeChallenge: ChallengeData = {
    title: t('learnos.biology.heart_wonder', 'A Curious Question...'),
    prompt: t('learnos.biology.heart_prompt', "Your heart beats 100,000 times a day, pumping a river of life throughout your body. Let's explore the pump!"),
    options: [t('learnos.challenge.explore', "Let's explore and find out!")],
    onSuccess: () => {
      setShowChallenge(false);
      const updated = completeModule(progress, 'heart-circulation', 60);
      setProgress(updated);
      saveProgress(updated);
    }
  };

  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedPart, setSelectedPart] = useState<HeartPart | null>(null);
  const [showOxygenated, setShowOxygenated] = useState(true);
  const [showDeoxygenated, setShowDeoxygenated] = useState(true);
  const [heartbeat, setHeartbeat] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => setHeartbeat(h => h + 1), 800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const heartScale = 1 + Math.sin(heartbeat * Math.PI) * 0.03;

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2"><Trans i18nKey="auto.heartcirculation.heart_circulation">🫀 Heart & Circulation</Trans></h2>
          <p className="text-gray-400 text-lg"><Trans i18nKey="auto.heartcirculation.explore_how_blood_flows_throug">Explore how blood flows through the heart and body!</Trans></p>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          <button onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm ${isPlaying ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button onClick={() => setShowOxygenated(!showOxygenated)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm ${showOxygenated ? 'bg-red-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
            <Trans i18nKey="auto.heartcirculation.oxygenated">🔴 Oxygenated</Trans>
                                </button>
          <button onClick={() => setShowDeoxygenated(!showDeoxygenated)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm ${showDeoxygenated ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
            <Trans i18nKey="auto.heartcirculation.deoxygenated">🔵 Deoxygenated</Trans>
                                </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Heart SVG */}
          <div className="lg:col-span-2">
            <div className="relative bg-gradient-to-b from-rose-950/30 via-gray-900 to-gray-950 rounded-2xl border border-red-500/20 p-6 overflow-hidden">
              <svg viewBox="0 0 500 450" className="w-full max-w-lg mx-auto" style={{ transform: `scale(${heartScale})`, transition: 'transform 0.1s' }}>
                {/* Lungs (background) */}
                <ellipse cx="120" cy="180" rx="70" ry="100" fill="#ec489920" stroke="#ec4899" strokeWidth="1" opacity="0.3" />
                <ellipse cx="380" cy="180" rx="70" ry="100" fill="#ec489920" stroke="#ec4899" strokeWidth="1" opacity="0.3" />
                <text x="120" y="180" textAnchor="middle" fontSize="10" fill="#ec4899" opacity="0.5"><Trans i18nKey="auto.heartcirculation.right_lung">Right Lung</Trans></text>
                <text x="380" y="180" textAnchor="middle" fontSize="10" fill="#ec4899" opacity="0.5"><Trans i18nKey="auto.heartcirculation.left_lung">Left Lung</Trans></text>

                {/* Vena Cava */}
                <path d="M250,380 L250,320" stroke="#3b82f6" strokeWidth="16" fill="none" strokeLinecap="round"
                  className="cursor-pointer hover:brightness-125" onClick={() => setSelectedPart(heartParts.find(p => p.id === 'vc')!)} />
                <path d="M250,80 L250,150" stroke="#3b82f6" strokeWidth="14" fill="none" strokeLinecap="round"
                  className="cursor-pointer hover:brightness-125" onClick={() => setSelectedPart(heartParts.find(p => p.id === 'vc')!)} />

                {/* Aorta */}
                <path d="M280,150 Q280,100 320,100 L380,100" stroke="#ef4444" strokeWidth="14" fill="none" strokeLinecap="round"
                  className="cursor-pointer hover:brightness-125" onClick={() => setSelectedPart(heartParts.find(p => p.id === 'aorta')!)} />
                <path d="M380,100 L380,400" stroke="#ef4444" strokeWidth="10" fill="none"
                  className="cursor-pointer hover:brightness-125" onClick={() => setSelectedPart(heartParts.find(p => p.id === 'aorta')!)} />

                {/* Pulmonary Artery */}
                <path d="M220,160 Q200,120 160,140" stroke="#3b82f6" strokeWidth="10" fill="none"
                  className="cursor-pointer hover:brightness-125" onClick={() => setSelectedPart(heartParts.find(p => p.id === 'pa')!)} />

                {/* Pulmonary Veins */}
                <path d="M160,220 Q200,200 240,200" stroke="#ef4444" strokeWidth="8" fill="none"
                  className="cursor-pointer hover:brightness-125" onClick={() => setSelectedPart(heartParts.find(p => p.id === 'pv')!)} />

                {/* Heart Chambers */}
                {/* Right Atrium */}
                <path d="M220,160 L220,220 Q220,240 240,240 L240,200 Q240,160 220,160"
                  fill="#3b82f622" stroke="#3b82f6" strokeWidth="2"
                  className="cursor-pointer hover:brightness-125"
                  onClick={() => setSelectedPart(heartParts.find(p => p.id === 'ra')!)} />
                <text x="230" y="200" textAnchor="middle" fontSize="8" fill="#60a5fa"><Trans i18nKey="auto.heartcirculation.ra">RA</Trans></text>

                {/* Right Ventricle */}
                <path d="M220,245 L200,320 Q200,340 230,340 L260,340 Q260,320 260,280 L240,245 Z"
                  fill="#60a5fa22" stroke="#60a5fa" strokeWidth="2"
                  className="cursor-pointer hover:brightness-125"
                  onClick={() => setSelectedPart(heartParts.find(p => p.id === 'rv')!)} />
                <text x="230" y="300" textAnchor="middle" fontSize="8" fill="#93c5fd"><Trans i18nKey="auto.heartcirculation.rv">RV</Trans></text>

                {/* Left Atrium */}
                <path d="M260,160 L260,220 Q260,240 280,240 L280,200 Q280,160 260,160"
                  fill="#dc262622" stroke="#dc2626" strokeWidth="2"
                  className="cursor-pointer hover:brightness-125"
                  onClick={() => setSelectedPart(heartParts.find(p => p.id === 'la')!)} />
                <text x="270" y="200" textAnchor="middle" fontSize="8" fill="#f87171"><Trans i18nKey="auto.heartcirculation.la">LA</Trans></text>

                {/* Left Ventricle */}
                <path d="M265,245 L260,320 Q260,350 280,350 L300,350 Q320,350 320,320 L300,245 Z"
                  fill="#ef444422" stroke="#ef4444" strokeWidth="3"
                  className="cursor-pointer hover:brightness-125"
                  onClick={() => setSelectedPart(heartParts.find(p => p.id === 'lv')!)} />
                <text x="285" y="300" textAnchor="middle" fontSize="8" fill="#fca5a5"><Trans i18nKey="auto.heartcirculation.lv">LV</Trans></text>

                {/* Septum */}
                <line x1="250" y1="160" x2="250" y2="340" stroke="#9ca3af" strokeWidth="3" strokeDasharray="4" />

                {/* Blood flow arrows */}
                {isPlaying && (
                  <>
                    {/* Body to RA */}
                    {showDeoxygenated && (
                      <motion.circle r="6" fill="#3b82f6"
                        animate={{ offsetDistance: ['0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        style={{ offsetPath: 'path("M250,380 L250,200")' }} />
                    )}
                    {/* RA to RV */}
                    {showDeoxygenated && (
                      <motion.circle r="5" fill="#60a5fa"
                        animate={{ offsetDistance: ['0%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.5 }}
                        style={{ offsetPath: 'path("M230,220 L220,290")' }} />
                    )}
                    {/* RV to Lungs */}
                    {showDeoxygenated && (
                      <motion.circle r="5" fill="#3b82f6"
                        animate={{ offsetDistance: ['0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1 }}
                        style={{ offsetPath: 'path("M215,250 Q190,180 140,180")' }} />
                    )}
                    {/* Lungs to LA */}
                    {showOxygenated && (
                      <motion.circle r="5" fill="#ef4444"
                        animate={{ offsetDistance: ['0%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 0.3 }}
                        style={{ offsetPath: 'path("M160,200 Q200,200 260,200")' }} />
                    )}
                    {/* LA to LV */}
                    {showOxygenated && (
                      <motion.circle r="5" fill="#dc2626"
                        animate={{ offsetDistance: ['0%', '100%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.8 }}
                        style={{ offsetPath: 'path("M270,220 L280,290")' }} />
                    )}
                    {/* LV to Body */}
                    {showOxygenated && (
                      <motion.circle r="6" fill="#ef4444"
                        animate={{ offsetDistance: ['0%', '100%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: 1.2 }}
                        style={{ offsetPath: 'path("M290,260 Q290,120 380,120 L380,400")' }} />
                    )}
                  </>
                )}

                {/* Labels */}
                <text x="250" y="395" textAnchor="middle" fontSize="9" fill="#60a5fa"><Trans i18nKey="auto.heartcirculation.from_body">↑ From Body</Trans></text>
                <text x="395" y="400" textAnchor="start" fontSize="9" fill="#ef4444"><Trans i18nKey="auto.heartcirculation.to_body">To Body ↓</Trans></text>
                <text x="120" y="130" textAnchor="middle" fontSize="9" fill="#60a5fa"><Trans i18nKey="auto.heartcirculation.to_lungs">To Lungs →</Trans></text>
                <text x="120" y="250" textAnchor="middle" fontSize="9" fill="#ef4444"><Trans i18nKey="auto.heartcirculation.from_lungs">← From Lungs</Trans></text>
              </svg>

              {/* Legend */}
              <div className="flex justify-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-gray-400"><Trans i18nKey="auto.heartcirculation.oxygenated_o_rich">Oxygenated (O₂ rich)</Trans></span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-gray-400"><Trans i18nKey="auto.heartcirculation.deoxygenated_co_rich">Deoxygenated (CO₂ rich)</Trans></span>
                </div>
              </div>
            </div>

            {/* Flow diagram */}
            <div className="mt-4 bg-gray-900 rounded-xl border border-gray-800 p-4">
              <h4 className="text-sm font-bold text-white mb-3"><Trans i18nKey="auto.heartcirculation.blood_flow_path">🔄 Blood Flow Path</Trans></h4>
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
                {[
                  { text: 'Body', color: 'blue' },
                  { text: '→', color: 'gray' },
                  { text: 'Vena Cava', color: 'blue' },
                  { text: '→', color: 'gray' },
                  { text: 'Right Atrium', color: 'blue' },
                  { text: '→', color: 'gray' },
                  { text: 'Right Ventricle', color: 'blue' },
                  { text: '→', color: 'gray' },
                  { text: 'Pulmonary Artery', color: 'blue' },
                  { text: '→', color: 'gray' },
                  { text: 'LUNGS', color: 'pink' },
                  { text: '→', color: 'gray' },
                  { text: 'Pulmonary Veins', color: 'red' },
                  { text: '→', color: 'gray' },
                  { text: 'Left Atrium', color: 'red' },
                  { text: '→', color: 'gray' },
                  { text: 'Left Ventricle', color: 'red' },
                  { text: '→', color: 'gray' },
                  { text: 'Aorta', color: 'red' },
                  { text: '→', color: 'gray' },
                  { text: 'Body', color: 'red' },
                ].map((item, i) => (
                  <span key={i} className={`px-1.5 py-0.5 rounded ${
                    item.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                    item.color === 'red' ? 'bg-red-500/20 text-orange-400' :
                    item.color === 'pink' ? 'bg-pink-500/20 text-pink-400 font-bold' :
                    'text-gray-600'
                  }`}>{item.text}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-4">
            {selectedPart ? (
              <motion.div key={selectedPart.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: selectedPart.color + '22', border: `2px solid ${selectedPart.color}` }}>
                    <Heart className="w-5 h-5" style={{ color: selectedPart.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-white">{selectedPart.name}</h3>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">{selectedPart.description}</p>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                  <div className="text-sm text-blue-400 font-bold mb-1 flex items-center gap-1">
                    <Info className="w-3 h-3" /> <Trans i18nKey="auto.heartcirculation.fun_fact">Fun Fact</Trans>
                                                        </div>
                  <p className="text-sm text-gray-300">{selectedPart.funFact}</p>
                </div>
              </motion.div>
            ) : (
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 text-center">
                <div className="text-4xl mb-3">👆</div>
                <h3 className="text-lg font-bold text-white mb-2"><Trans i18nKey="auto.heartcirculation.click_a_part">Click a Part</Trans></h3>
                <p className="text-sm text-gray-400"><Trans i18nKey="auto.heartcirculation.click_on_any_chamber_vessel_or">Click on any chamber, vessel, or valve to learn more about it.</Trans></p>
              </div>
            )}

            {/* Quick Facts */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <h4 className="text-sm font-bold text-white mb-3"><Trans i18nKey="auto.heartcirculation.heart_facts">❤️ Heart Facts</Trans></h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex gap-2"><span className="text-orange-400">•</span> <Trans i18nKey="auto.heartcirculation.beats_100_000_times_per_day">Beats ~100,000 times per day</Trans></li>
                <li className="flex gap-2"><span className="text-orange-400">•</span> <Trans i18nKey="auto.heartcirculation.pumps_2_000_gallons_of_blood_d">Pumps ~2,000 gallons of blood daily</Trans></li>
                <li className="flex gap-2"><span className="text-orange-400">•</span> <Trans i18nKey="auto.heartcirculation.about_the_size_of_your_fist">About the size of your fist</Trans></li>
                <li className="flex gap-2"><span className="text-orange-400">•</span> <Trans i18nKey="auto.heartcirculation.creates_enough_pressure_to_squ">Creates enough pressure to squirt blood 30 feet</Trans></li>
                <li className="flex gap-2"><span className="text-orange-400">•</span> <Trans i18nKey="auto.heartcirculation.has_its_own_electrical_system_">Has its own electrical system (SA & AV nodes)</Trans></li>
                <li className="flex gap-2"><span className="text-orange-400">•</span> <Trans i18nKey="auto.heartcirculation.blood_completes_full_circuit_i">Blood completes full circuit in ~60 seconds</Trans></li>
              </ul>
            </div>

            {/* Parts list */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
              <h4 className="text-sm font-bold text-white mb-2"><Trans i18nKey="auto.heartcirculation.click_to_explore">🔍 Click to Explore</Trans></h4>
              <div className="grid grid-cols-2 gap-1.5">
                {heartParts.map(p => (
                  <button key={p.id} onClick={() => setSelectedPart(p)}
                    className={`text-left px-2 py-1.5 rounded-lg text-sm transition-all ${selectedPart?.id === p.id ? 'bg-gray-700' : 'bg-gray-800/50 hover:bg-gray-800'}`}>
                    <span className="w-2 h-2 rounded-full inline-block mr-1.5" style={{ backgroundColor: p.color }} />
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
