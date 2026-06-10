import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Zap, ArrowRight } from 'lucide-react';
import { Trans, useTranslation } from "react-i18next";
import ChallengeOverlay, { ChallengeData } from '../../../shared/ui/ChallengeOverlay';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

interface Stage {
  id: string;
  name: string;
  location: string;
  emoji: string;
  color: string;
  inputs: string[];
  outputs: string[];
  atpProduced: number;
  description: string;
  steps: string[];
}

const stages: Stage[] = [
  {
    id: 'glycolysis',
    name: 'Glycolysis',
    location: 'Cytoplasm',
    emoji: '🍬',
    color: '#f59e0b',
    inputs: ['1 Glucose (C₆H₁₂O₆)', '2 ATP (investment)', '2 NAD⁺'],
    outputs: ['2 Pyruvate', '4 ATP (2 net gain)', '2 NADH'],
    atpProduced: 2,
    description: 'The first stage breaks glucose (6 carbons) into two pyruvate molecules (3 carbons each). Occurs in the cytoplasm and does NOT require oxygen.',
    steps: [
      'Glucose is phosphorylated using 2 ATP',
      'Glucose split into 2 G3P molecules',
      'G3P oxidized, NAD⁺ → NADH',
      'ATP produced via substrate-level phosphorylation',
      'Pyruvate is the final product',
    ],
  },
  {
    id: 'transition',
    name: 'Pyruvate Oxidation',
    location: 'Mitochondrial Matrix',
    emoji: '🚪',
    color: '#8b5cf6',
    inputs: ['2 Pyruvate', '2 NAD⁺', '2 CoA'],
    outputs: ['2 Acetyl-CoA', '2 NADH', '2 CO₂'],
    atpProduced: 0,
    description: 'Pyruvate enters the mitochondria and is converted to Acetyl-CoA. One carbon is released as CO₂. This is the link between glycolysis and the Krebs cycle.',
    steps: [
      'Pyruvate enters mitochondrial matrix',
      'Carboxyl group removed as CO₂',
      'Remaining 2-carbon fragment oxidized',
      'NAD⁺ → NADH',
      'Coenzyme A attached → Acetyl-CoA',
    ],
  },
  {
    id: 'krebs',
    name: 'Krebs Cycle',
    location: 'Mitochondrial Matrix',
    emoji: '🔄',
    color: '#10b981',
    inputs: ['2 Acetyl-CoA', '6 NAD⁺', '2 FAD'],
    outputs: ['4 CO₂', '6 NADH', '2 FADH₂', '2 ATP/GTP'],
    atpProduced: 2,
    description: 'Also called the Citric Acid Cycle. Acetyl-CoA joins with oxaloacetate, going through 8 reactions that harvest electrons for the ETC. Runs TWICE per glucose.',
    steps: [
      'Acetyl-CoA + Oxaloacetate → Citrate',
      'Citrate rearranged to Isocitrate',
      'Isocitrate oxidized → α-Ketoglutarate + CO₂ + NADH',
      'α-Ketoglutarate → Succinyl-CoA + CO₂ + NADH',
      'Substrate-level phosphorylation → ATP/GTP',
      'Succinate → Fumarate + FADH₂',
      'Fumarate → Malate → Oxaloacetate + NADH',
      'Cycle restarts with new Acetyl-CoA',
    ],
  },
  {
    id: 'etc',
    name: 'Electron Transport Chain',
    location: 'Inner Mitochondrial Membrane',
    emoji: '⚡',
    color: '#ef4444',
    inputs: ['10 NADH', '2 FADH₂', 'O₂'],
    outputs: ['~34 ATP', 'H₂O', 'NAD⁺ & FAD recycled'],
    atpProduced: 34,
    description: 'The powerhouse finale! NADH and FADH₂ donate electrons through protein complexes, creating a proton gradient. ATP synthase uses this gradient to produce most of the ATP.',
    steps: [
      'NADH donates electrons to Complex I',
      'Electrons pass through Complexes I → II → III → IV',
      'Energy pumps H⁺ ions into intermembrane space',
      'O₂ accepts electrons, combines with H⁺ → H₂O',
      'H⁺ flows back through ATP synthase',
      'Chemiosmosis: ADP + P → ATP',
      '~34 ATP produced from electron carriers',
    ],
  },
];

export default function CellularRespiration() {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [showChallenge, setShowChallenge] = useState(true);
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalATP, setTotalATP] = useState(0);
  const [showingStep, setShowingStep] = useState(0);

  const activeChallenge: ChallengeData = {
    title: t('learnos.biology.respiration_wonder', 'A Curious Question...'),
    prompt: t('learnos.biology.respiration_prompt', 'How does your body get the energy to run, jump, and think? It turns the food you eat into a molecule called ATP, the fuel of life! Let\'s see how it\'s made.'),
    options: [t('learnos.challenge.explore', "Let's explore and find out!")],
    onSuccess: () => {
      setShowChallenge(false);
      const updated = completeModule(progress, 'cellular-respiration', 80);
      setProgress(updated);
      saveProgress(updated);
    }
  };

  const stage = stages[currentStage];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setShowingStep(s => {
        if (s >= stage.steps.length - 1) {
          // Move to next stage
          setTimeout(() => {
            setCurrentStage(c => {
              if (c < stages.length - 1) {
                setTotalATP(t => t + stages[c].atpProduced);
                return c + 1;
              }
              setIsPlaying(false);
              setTotalATP(t => t + stages[c].atpProduced);
              return c;
            });
            setShowingStep(0);
          }, 1000);
          return s;
        }
        return s + 1;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [isPlaying, stage.steps.length]);

  const reset = () => {
    setCurrentStage(0);
    setTotalATP(0);
    setShowingStep(0);
    setIsPlaying(false);
  };

  const sumATP = stages.reduce((sum, s) => sum + s.atpProduced, 0);

  return (
    <ModuleWrapper moduleId="cellular-respiration" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      {showChallenge && <ChallengeOverlay challenge={activeChallenge} onClose={() => setShowChallenge(false)} />}
      <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2"><Trans i18nKey="auto.cellularrespiration.cellular_respiration">🔋 Cellular Respiration</Trans></h2>
          <p className="text-gray-400 text-lg"><Trans i18nKey="auto.cellularrespiration.c_h_o_6o_6co_6h_o">C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O +</Trans> <span className="text-yellow-400 font-bold"><Trans i18nKey="auto.cellularrespiration.38_atp">~38 ATP</Trans></span></p>
        </motion.div>

        {/* ATP Counter */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-yellow-900/40 to-amber-900/40 rounded-2xl border border-yellow-500/30 px-8 py-4 flex items-center gap-4">
            <Zap className="w-8 h-8 text-yellow-400" />
            <div>
              <div className="text-sm text-yellow-400/70 uppercase font-bold"><Trans i18nKey="auto.cellularrespiration.total_atp_produced">Total ATP Produced</Trans></div>
              <div className="text-4xl font-black text-yellow-400">{currentStage === stages.length - 1 && !isPlaying ? sumATP : totalATP}</div>
            </div>
            <div className="text-2xl text-gray-600">/</div>
            <div className="text-2xl text-gray-500">{sumATP}</div>
          </div>
        </div>

        {/* Stage selector */}
        <div className="flex justify-center gap-2 mb-6">
          {stages.map((s, i) => (
            <button key={s.id} onClick={() => { setCurrentStage(i); setShowingStep(0); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${currentStage === i ? 'text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
              style={currentStage === i ? { backgroundColor: s.color } : {}}>
              <span>{s.emoji}</span>
              <span className="hidden sm:inline">{s.name}</span>
              <span className="text-sm opacity-70">+{s.atpProduced}</span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div key={stage.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {/* Stage header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: stage.color + '22', border: `2px solid ${stage.color}` }}>
                      {stage.emoji}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{stage.name}</h3>
                      <div className="text-sm text-gray-500">📍 {stage.location}</div>
                    </div>
                    <div className="ml-auto flex items-center gap-2 bg-yellow-500/20 rounded-full px-3 py-1">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-bold">{stage.atpProduced} <Trans i18nKey="auto.cellularrespiration.atp">ATP</Trans></span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed mb-5">{stage.description}</p>

                  {/* Inputs → Outputs */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="bg-blue-500/10 rounded-xl p-3 border border-blue-500/20">
                      <div className="text-sm text-blue-400 font-bold mb-2"><Trans i18nKey="auto.cellularrespiration.inputs">INPUTS →</Trans></div>
                      {stage.inputs.map(i => <div key={i} className="text-sm text-gray-300 mb-1">• {i}</div>)}
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                        style={{ backgroundColor: stage.color + '22', border: `2px solid ${stage.color}` }}>
                        <ArrowRight className="w-6 h-6" style={{ color: stage.color }} />
                      </div>
                    </div>
                    <div className="bg-green-500/10 rounded-xl p-3 border border-green-500/20">
                      <div className="text-sm text-green-400 font-bold mb-2"><Trans i18nKey="auto.cellularrespiration.outputs">→ OUTPUTS</Trans></div>
                      {stage.outputs.map(o => <div key={o} className="text-sm text-gray-300 mb-1">• {o}</div>)}
                    </div>
                  </div>

                  {/* Animated steps */}
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-3 uppercase font-bold"><Trans i18nKey="auto.cellularrespiration.step_by_step_process">Step-by-step Process</Trans></div>
                    <div className="space-y-2">
                      {stage.steps.map((step, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0.3 }}
                          animate={{ opacity: isPlaying ? (i <= showingStep ? 1 : 0.3) : 1 }}
                          className={`flex items-center gap-2 text-sm ${i <= showingStep || !isPlaying ? 'text-gray-200' : 'text-gray-600'}`}>
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${i <= showingStep || !isPlaying ? 'text-white' : 'bg-gray-700 text-gray-500'}`}
                            style={i <= showingStep || !isPlaying ? { backgroundColor: stage.color } : {}}>
                            {i + 1}
                          </div>
                          {step}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-3 mt-4">
              <button onClick={() => setIsPlaying(!isPlaying)}
                className={`px-5 py-2.5 rounded-full font-medium flex items-center gap-2 ${isPlaying ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause' : 'Animate'}
              </button>
              <button onClick={reset} className="px-5 py-2.5 rounded-full font-medium bg-gray-800 text-gray-300">
                <Trans i18nKey="auto.cellularrespiration.reset">Reset</Trans>
                                            </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Overview */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <h4 className="text-sm font-bold text-white mb-3"><Trans i18nKey="auto.cellularrespiration.atp_summary">📊 ATP Summary</Trans></h4>
              <div className="space-y-2">
                {stages.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: s.color + '22' }}>
                      {s.emoji}
                    </div>
                    <span className="flex-1 text-sm text-gray-400">{s.name}</span>
                    <span className={`text-sm font-bold ${currentStage >= i ? 'text-yellow-400' : 'text-gray-600'}`}>+{s.atpProduced}</span>
                  </div>
                ))}
                <div className="border-t border-gray-800 pt-2 mt-2 flex justify-between">
                  <span className="text-sm font-bold text-white"><Trans i18nKey="auto.cellularrespiration.total">Total</Trans></span>
                  <span className="text-sm font-black text-yellow-400">{sumATP} <Trans i18nKey="auto.cellularrespiration.atp">ATP</Trans></span>
                </div>
              </div>
            </div>

            {/* Key equation */}
            <div className="bg-gradient-to-br from-emerald-900/30 to-cyan-900/30 rounded-xl p-4 border border-emerald-500/20">
              <div className="text-sm text-emerald-400 font-bold mb-2"><Trans i18nKey="auto.cellularrespiration.overall_equation">📝 Overall Equation</Trans></div>
              <div className="text-sm text-white font-mono bg-black/30 rounded-lg p-3">
                <Trans i18nKey="auto.cellularrespiration.c_h_o_6o">C₆H₁₂O₆ + 6O₂ →</Trans><br/>
                <Trans i18nKey="auto.cellularrespiration.6co_6h_o_atp">6CO₂ + 6H₂O + ATP</Trans>
                                            </div>
            </div>

            {/* Fun facts */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <h4 className="text-sm font-bold text-white mb-3"><Trans i18nKey="auto.cellularrespiration.energy_facts">⚡ Energy Facts</Trans></h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex gap-2"><span className="text-yellow-400">•</span> <Trans i18nKey="auto.cellularrespiration.your_body_makes_40kg_of_atp_pe">Your body makes ~40kg of ATP per day</Trans></li>
                <li className="flex gap-2"><span className="text-yellow-400">•</span> <Trans i18nKey="auto.cellularrespiration.brain_uses_20_of_body_s_atp">Brain uses 20% of body's ATP</Trans></li>
                <li className="flex gap-2"><span className="text-yellow-400">•</span> <Trans i18nKey="auto.cellularrespiration.90_of_atp_comes_from_the_etc">90% of ATP comes from the ETC</Trans></li>
                <li className="flex gap-2"><span className="text-yellow-400">•</span> <Trans i18nKey="auto.cellularrespiration.without_o_only_glycolysis_work">Without O₂, only glycolysis works (2 ATP)</Trans></li>
                <li className="flex gap-2"><span className="text-yellow-400">•</span> <Trans i18nKey="auto.cellularrespiration.atp_is_recycled_500_times_day">ATP is recycled ~500 times/day</Trans></li>
              </ul>
            </div>

            {/* Fermentation note */}
            <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
              <div className="text-sm text-orange-400 font-bold mb-1"><Trans i18nKey="auto.cellularrespiration.without_oxygen">🍺 Without Oxygen?</Trans></div>
              <p className="text-sm text-gray-300">
                <strong><Trans i18nKey="auto.cellularrespiration.fermentation">Fermentation</Trans></strong> <Trans i18nKey="auto.cellularrespiration.occurs_only_glycolysis_runs_pr">occurs! Only glycolysis runs, producing just 2 ATP. In animals → lactic acid (muscle burn). In yeast → ethanol + CO₂ (bread & beer!).</Trans>
                                            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ModuleWrapper>
  );
}
