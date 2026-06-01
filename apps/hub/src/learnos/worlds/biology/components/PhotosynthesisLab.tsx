import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Droplets, Wind, Zap, RotateCcw } from 'lucide-react';

interface LabState {
  lightIntensity: number; // 0-100
  waterLevel: number;
  co2Level: number;
  temperature: number;
  oxygenProduced: number;
  glucoseProduced: number;
  chlorophyllActive: boolean;
}

const stageInfo = [
  {
    id: 'overview',
    title: 'Photosynthesis Overview',
    emoji: '🌿',
    equation: '6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂',
    description: 'Photosynthesis converts light energy, carbon dioxide, and water into glucose (sugar) and oxygen. It occurs in two main stages.',
  },
  {
    id: 'light',
    title: 'Light Reactions',
    emoji: '☀️',
    location: 'Thylakoid membrane',
    description: 'Light energy is captured by chlorophyll and converted into chemical energy (ATP and NADPH). Water molecules are split, releasing oxygen as a byproduct.',
    steps: [
      'Photon hits chlorophyll in Photosystem II',
      'Water is split → 2H⁺ + ½O₂ + 2e⁻',
      'Electrons pass through the electron transport chain',
      'ATP is produced via chemiosmosis',
      'Photosystem I re-energizes electrons',
      'NADP⁺ is reduced to NADPH',
    ],
    inputs: ['Light energy', 'H₂O', 'ADP + Pi', 'NADP⁺'],
    outputs: ['O₂', 'ATP', 'NADPH'],
  },
  {
    id: 'dark',
    title: 'Calvin Cycle (Dark Reactions)',
    emoji: '🔄',
    location: 'Stroma of chloroplast',
    description: 'Uses ATP and NADPH from light reactions to fix CO₂ into glucose. Doesn\'t need light directly but depends on light reaction products.',
    steps: [
      'Carbon fixation: CO₂ + RuBP → 2 molecules of 3-PGA (via RuBisCO)',
      'Reduction: 3-PGA → G3P (uses ATP and NADPH)',
      'Regeneration: G3P → RuBP (uses ATP)',
      'After 3 turns: 1 net G3P molecule produced',
      'Two G3P molecules → 1 glucose (C₆H₁₂O₆)',
    ],
    inputs: ['CO₂', 'ATP', 'NADPH'],
    outputs: ['G3P → Glucose', 'ADP + Pi', 'NADP⁺'],
  },
];

type StageInfo = (typeof stageInfo)[number];

function hasLocation(stage: StageInfo): stage is StageInfo & { location: string } {
  return 'location' in stage;
}

function hasEquation(stage: StageInfo): stage is StageInfo & { equation: string } {
  return 'equation' in stage;
}

function hasSteps(stage: StageInfo): stage is StageInfo & { steps: string[]; inputs: string[]; outputs: string[] } {
  return 'steps' in stage;
}

const lightRays = Array.from({ length: 7 }, (_, i) => ({
  left: `${20 + i * 12}%`,
  height: `${30 + ((i * 7) % 20)}%`,
  duration: 1.5 + ((i * 3) % 10) / 10,
  delay: ((i * 5) % 10) / 10,
}));

export default function PhotosynthesisLab() {
  const [lab, setLab] = useState<LabState>({
    lightIntensity: 50,
    waterLevel: 50,
    co2Level: 50,
    temperature: 25,
    oxygenProduced: 0,
    glucoseProduced: 0,
    chlorophyllActive: false,
  });
  const [activeStage, setActiveStage] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [animatedBubbles, setAnimatedBubbles] = useState<{ id: number; x: number }[]>([]);
  const activeStageInfo = stageInfo[activeStage];

  // Simulation
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setLab(prev => {
        const efficiency = Math.min(prev.lightIntensity, prev.waterLevel, prev.co2Level) / 100;
        const tempFactor = prev.temperature >= 15 && prev.temperature <= 35 ? 1 : prev.temperature >= 10 && prev.temperature <= 40 ? 0.5 : 0.1;
        const rate = efficiency * tempFactor;

        if (rate > 0.1) {
          setAnimatedBubbles(prev => {
            const newBubble = { id: Date.now(), x: 30 + Math.random() * 40 };
            return [...prev.slice(-8), newBubble];
          });
        }

        return {
          ...prev,
          chlorophyllActive: rate > 0.2,
          oxygenProduced: prev.oxygenProduced + rate * 0.8,
          glucoseProduced: prev.glucoseProduced + rate * 0.3,
          waterLevel: Math.max(0, prev.waterLevel - rate * 0.3),
          co2Level: Math.max(0, prev.co2Level - rate * 0.2),
        };
      });
    }, 200);
    return () => clearInterval(interval);
  }, [isRunning]);

  const reset = () => {
    setLab({ lightIntensity: 50, waterLevel: 50, co2Level: 50, temperature: 25, oxygenProduced: 0, glucoseProduced: 0, chlorophyllActive: false });
    setIsRunning(false);
    setAnimatedBubbles([]);
  };

  const efficiency = Math.min(lab.lightIntensity, lab.waterLevel, lab.co2Level) / 100;
  const tempOk = lab.temperature >= 15 && lab.temperature <= 35;

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2">🧫 Photosynthesis Lab</h2>
          <p className="text-gray-400 text-lg">Control light, water & CO₂ to power photosynthesis!</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Leaf Simulator */}
          <div className="lg:col-span-2">
            <div className="relative bg-gradient-to-b from-sky-950/40 via-green-950/30 to-emerald-950/40 rounded-2xl border border-emerald-500/20 p-6 overflow-hidden min-h-[350px]">
              {/* Sun */}
              <motion.div className="absolute top-4 right-6"
                animate={{ scale: [1, 1.1, 1], opacity: lab.lightIntensity / 100 }}
                transition={{ repeat: Infinity, duration: 2 }}>
                <Sun className="w-14 h-14 text-yellow-400" style={{ filter: `drop-shadow(0 0 ${lab.lightIntensity / 5}px #facc15)` }} />
              </motion.div>

              {/* Light rays */}
              {lab.lightIntensity > 20 && lightRays.slice(0, Math.floor(lab.lightIntensity / 15)).map((ray, i) => (
                <motion.div key={i}
                  className="absolute top-0 w-0.5 bg-gradient-to-b from-yellow-400/30 to-transparent"
                  style={{ left: ray.left, height: ray.height }}
                  animate={{ opacity: [0.1, 0.4, 0.1] }}
                  transition={{ repeat: Infinity, duration: ray.duration, delay: ray.delay }} />
              ))}

              {/* Leaf */}
              <div className="relative mx-auto mt-16 mb-8">
                <svg viewBox="0 0 300 200" className="w-full max-w-sm mx-auto">
                  {/* Leaf shape */}
                  <path d="M150,20 Q250,50 260,120 Q250,170 150,180 Q50,170 40,120 Q50,50 150,20Z"
                    fill={lab.chlorophyllActive ? '#16a34a' : '#374151'}
                    stroke={lab.chlorophyllActive ? '#22c55e' : '#6b7280'}
                    strokeWidth="2"
                    opacity={0.8}>
                    {lab.chlorophyllActive && (
                      <animate attributeName="fill" values="#16a34a;#15803d;#16a34a" dur="2s" repeatCount="indefinite" />
                    )}
                  </path>
                  {/* Veins */}
                  <path d="M150,25 L150,175" stroke="#15803d" strokeWidth="2" opacity="0.5" />
                  <path d="M150,60 L100,90" stroke="#15803d" strokeWidth="1.5" opacity="0.4" />
                  <path d="M150,60 L200,90" stroke="#15803d" strokeWidth="1.5" opacity="0.4" />
                  <path d="M150,100 L80,130" stroke="#15803d" strokeWidth="1.5" opacity="0.4" />
                  <path d="M150,100 L220,130" stroke="#15803d" strokeWidth="1.5" opacity="0.4" />
                  <path d="M150,130 L100,155" stroke="#15803d" strokeWidth="1" opacity="0.3" />
                  <path d="M150,130 L200,155" stroke="#15803d" strokeWidth="1" opacity="0.3" />

                  {/* Chloroplasts */}
                  {lab.chlorophyllActive && Array.from({ length: 8 }).map((_, i) => {
                    const cx = 90 + (i % 4) * 45;
                    const cy = 70 + Math.floor(i / 4) * 55;
                    return (
                      <ellipse key={i} cx={cx} cy={cy} rx="12" ry="7" fill="#22c55e" opacity="0.5">
                        <animate attributeName="opacity" values="0.3;0.7;0.3" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
                      </ellipse>
                    );
                  })}

                  {/* Stomata */}
                  <g transform="translate(120, 170)">
                    <ellipse cx="0" cy="0" rx="6" ry="3" fill="none" stroke="#15803d" strokeWidth="1.5" />
                    <text x="0" y="-8" textAnchor="middle" fontSize="7" fill="#9ca3af">CO₂ in</text>
                  </g>
                  <g transform="translate(180, 170)">
                    <ellipse cx="0" cy="0" rx="6" ry="3" fill="none" stroke="#15803d" strokeWidth="1.5" />
                    <text x="0" y="-8" textAnchor="middle" fontSize="7" fill="#9ca3af">O₂ out</text>
                  </g>

                  {/* Water arrows */}
                  <text x="150" y="195" textAnchor="middle" fontSize="8" fill="#38bdf8">↑ H₂O</text>
                </svg>
              </div>

              {/* O₂ Bubbles */}
              {animatedBubbles.map(b => (
                <motion.div key={b.id}
                  initial={{ bottom: '30%', left: `${b.x}%`, opacity: 0.8, scale: 0.5 }}
                  animate={{ bottom: '90%', opacity: 0, scale: 1.5 }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                  className="absolute w-3 h-3 rounded-full bg-blue-400/30 border border-blue-400/50"
                  onAnimationComplete={() => setAnimatedBubbles(prev => prev.filter(p => p.id !== b.id))} />
              ))}

              {/* Production meters */}
              <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                <div className="flex-1 bg-gray-900/80 backdrop-blur rounded-lg p-2">
                  <div className="text-sm text-blue-400 font-bold">O₂ Produced</div>
                  <div className="text-lg font-black text-blue-300">{lab.oxygenProduced.toFixed(1)} ml</div>
                </div>
                <div className="flex-1 bg-gray-900/80 backdrop-blur rounded-lg p-2">
                  <div className="text-sm text-amber-400 font-bold">Glucose Made</div>
                  <div className="text-lg font-black text-amber-300">{lab.glucoseProduced.toFixed(1)} mg</div>
                </div>
                <div className="flex-1 bg-gray-900/80 backdrop-blur rounded-lg p-2">
                  <div className="text-sm text-emerald-400 font-bold">Efficiency</div>
                  <div className={`text-lg font-black ${efficiency > 0.5 ? 'text-emerald-300' : efficiency > 0.2 ? 'text-yellow-300' : 'text-red-300'}`}>
                    {(efficiency * (tempOk ? 100 : 50)).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              {[
                { label: 'Light', icon: Sun, value: lab.lightIntensity, key: 'lightIntensity' as const, color: '#facc15', unit: '%' },
                { label: 'Water', icon: Droplets, value: lab.waterLevel, key: 'waterLevel' as const, color: '#38bdf8', unit: '%' },
                { label: 'CO₂', icon: Wind, value: lab.co2Level, key: 'co2Level' as const, color: '#a3a3a3', unit: '%' },
                { label: 'Temp', icon: Zap, value: lab.temperature, key: 'temperature' as const, color: '#f97316', unit: '°C' },
              ].map(ctrl => (
                <div key={ctrl.label} className="bg-gray-900 rounded-xl border border-gray-800 p-3">
                  <div className="flex items-center gap-1.5 mb-2">
                    <ctrl.icon className="w-4 h-4" style={{ color: ctrl.color }} />
                    <span className="text-sm font-bold text-gray-300">{ctrl.label}</span>
                    <span className="ml-auto text-sm font-mono" style={{ color: ctrl.color }}>
                      {ctrl.key === 'temperature' ? `${ctrl.value}${ctrl.unit}` : `${ctrl.value}${ctrl.unit}`}
                    </span>
                  </div>
                  <input type="range"
                    min={ctrl.key === 'temperature' ? 0 : 0}
                    max={ctrl.key === 'temperature' ? 50 : 100}
                    value={ctrl.value}
                    onChange={e => setLab(prev => ({ ...prev, [ctrl.key]: Number(e.target.value) }))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{ background: `linear-gradient(to right, ${ctrl.color}66 0%, ${ctrl.color}66 ${ctrl.key === 'temperature' ? ctrl.value * 2 : ctrl.value}%, #374151 ${ctrl.key === 'temperature' ? ctrl.value * 2 : ctrl.value}%, #374151 100%)` }}
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={() => setIsRunning(!isRunning)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 ${isRunning ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                {isRunning ? '⏸ Pause Experiment' : '▶️ Run Experiment'}
              </button>
              <button onClick={reset} className="px-5 py-2.5 rounded-xl bg-gray-800 text-gray-300 text-sm font-bold hover:bg-gray-700">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Warnings */}
            {isRunning && (
              <div className="mt-3 space-y-1">
                {lab.waterLevel < 10 && <div className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-1.5 border border-red-500/20">⚠️ Water level critically low! Photosynthesis slowing down.</div>}
                {lab.co2Level < 10 && <div className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-1.5 border border-red-500/20">⚠️ CO₂ depleted! Calvin cycle cannot fix carbon.</div>}
                {!tempOk && <div className="text-sm text-orange-400 bg-orange-500/10 rounded-lg px-3 py-1.5 border border-orange-500/20">⚠️ Temperature outside optimal range (15-35°C). Enzymes less efficient.</div>}
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="space-y-4">
            {/* Stage Tabs */}
            <div className="flex gap-1 bg-gray-800 rounded-xl p-1">
              {stageInfo.map((s, i) => (
                <button key={s.id} onClick={() => setActiveStage(i)}
                  className={`flex-1 px-2 py-2 rounded-lg text-sm font-medium transition-all ${activeStage === i ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'}`}>
                  {s.emoji}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeStage}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
                <div className="text-2xl mb-2">{activeStageInfo.emoji}</div>
                <h3 className="text-lg font-bold text-white mb-1">{activeStageInfo.title}</h3>
                {hasLocation(activeStageInfo) && (
                  <div className="text-sm text-emerald-400 font-medium mb-2">📍 {(stageInfo[activeStage] as any).location}</div>
                )}
                {hasEquation(activeStageInfo) && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 mb-3 text-center">
                    <div className="text-sm text-emerald-400 font-mono font-bold">{activeStageInfo.equation}</div>
                  </div>
                )}
                <p className="text-gray-300 text-sm leading-relaxed mb-3">{activeStageInfo.description}</p>

                {hasSteps(activeStageInfo) && (
                  <>
                    <h4 className="text-sm font-bold text-white mb-2">Steps:</h4>
                    <ol className="space-y-1.5">
                      {activeStageInfo.steps.map((step, i) => (
                        <motion.li key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-2 text-[11px] text-gray-300">
                          <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                          {step}
                        </motion.li>
                      ))}
                    </ol>

                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="bg-blue-500/10 rounded-lg p-2 border border-blue-500/20">
                        <div className="text-sm text-blue-400 font-bold mb-1">Inputs →</div>
                        {activeStageInfo.inputs.map((inp) => (
                          <div key={inp} className="text-sm text-gray-300">• {inp}</div>
                        ))}
                      </div>
                      <div className="bg-green-500/10 rounded-lg p-2 border border-green-500/20">
                        <div className="text-sm text-green-400 font-bold mb-1">→ Outputs</div>
                        {activeStageInfo.outputs.map((out) => (
                          <div key={out} className="text-sm text-gray-300">• {out}</div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Quick facts */}
            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-2xl border border-green-500/20 p-4">
              <div className="text-sm font-bold text-emerald-400 mb-2">🌍 Why It Matters</div>
              <ul className="text-[11px] text-gray-300 space-y-1">
                <li>• Photosynthesis produces ALL the oxygen we breathe</li>
                <li>• It's the base of almost every food chain on Earth</li>
                <li>• Plants fix ~120 billion tons of carbon per year</li>
                <li>• Algae produce more O₂ than all land plants combined</li>
                <li>• Without it, Earth would have no free oxygen</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
