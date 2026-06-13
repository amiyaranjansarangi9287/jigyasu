import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Clock, Info } from 'lucide-react';
import { Trans, useTranslation } from "react-i18next";
import ChallengeOverlay, { ChallengeData } from '../../../shared/ui/ChallengeOverlay';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

interface Stage {
  id: string;
  name: string;
  emoji: string;
  duration: string;
  description: string;
  keyEvents: string[];
}

interface LifeCycle {
  id: string;
  name: string;
  nameKey?: string;
  emoji: string;
  color: string;
  bgGradient: string;
  type: 'complete' | 'incomplete';
  description: string;
  stages: Stage[];
  funFacts: string[];
}

const lifeCycles: LifeCycle[] = [
  {
    id: 'butterfly',
    name: 'Butterfly',
    nameKey: 'auto.metamorphosis.butterfly',
    emoji: '🦋',
    color: '#ec4899',
    bgGradient: 'from-pink-950 via-purple-950 to-indigo-950',
    type: 'complete',
    description: 'Complete metamorphosis with 4 distinct stages. One of nature\'s most dramatic transformations — from crawling caterpillar to flying butterfly!',
    stages: [
      {
        id: 'egg', name: 'Egg', emoji: '🥚', duration: '4-10 days',
        description: 'The journey begins! Female butterflies lay eggs on specific host plants that caterpillars will eat.',
        keyEvents: ['Female lays 100-300 eggs', 'Eggs attached to host plant leaves', 'Embryo develops inside', 'Shell provides protection'],
      },
      {
        id: 'caterpillar', name: 'Caterpillar (Larva)', emoji: '🐛', duration: '2-5 weeks',
        description: 'The eating machine! Caterpillars do nothing but eat, growing up to 100x their original size.',
        keyEvents: ['Hatches from egg', 'Eats host plant leaves constantly', 'Molts (sheds skin) 4-5 times', 'Stores energy for transformation', 'Grows dramatically in size'],
      },
      {
        id: 'chrysalis', name: 'Chrysalis (Pupa)', emoji: '🫛', duration: '10-14 days',
        description: 'The magical transformation! Inside the chrysalis, the caterpillar\'s body completely reorganizes into a butterfly.',
        keyEvents: ['Caterpillar attaches to branch', 'Hard protective casing forms', 'Body literally liquifies', 'Cells reorganize into butterfly parts', 'Wings, antennae, legs develop'],
      },
      {
        id: 'butterfly', name: 'Adult Butterfly', emoji: '🦋', duration: '2-6 weeks lifespan',
        description: 'The final form! An adult butterfly emerges, pumps fluid into its wings, and takes flight.',
        keyEvents: ['Emerges from chrysalis', 'Pumps fluid into wings', 'Wings dry and harden', 'Flies, feeds on nectar', 'Mates and lays eggs', 'Cycle repeats!'],
      },
    ],
    funFacts: [
      'Caterpillars have 4,000 muscles (humans have 629!)',
      'Monarch butterflies migrate ~4,800 km',
      'Butterflies taste with their feet',
      'Inside chrysalis, 50+ genes control transformation',
    ],
  },
  {
    id: 'frog',
    name: 'Frog',
    nameKey: 'auto.metamorphosis.frog',
    emoji: '🐸',
    color: '#22c55e',
    bgGradient: 'from-green-950 via-emerald-950 to-teal-950',
    type: 'complete',
    description: 'Amphibian metamorphosis — from aquatic tadpole breathing through gills to terrestrial frog breathing with lungs!',
    stages: [
      {
        id: 'egg', name: 'Eggs (Spawn)', emoji: '🥚', duration: '6-21 days',
        description: 'Frogs lay thousands of eggs in water, often surrounded by protective jelly. Most won\'t survive to adulthood.',
        keyEvents: ['Female lays 1,000-20,000 eggs', 'Eggs laid in water (frogspawn)', 'Jelly coating protects eggs', 'Embryo develops visible movement'],
      },
      {
        id: 'tadpole', name: 'Tadpole', emoji: '🐟', duration: '6-9 weeks',
        description: 'A fully aquatic stage! Tadpoles have tails, gills, and look more like fish than frogs.',
        keyEvents: ['Hatches from egg', 'Breathes through gills', 'Has long swimming tail', 'Eats algae and plant matter', 'No legs initially'],
      },
      {
        id: 'tadpole-legs', name: 'Tadpole with Legs', emoji: '🦵', duration: '2-3 weeks',
        description: 'The transition begins! Back legs appear first, then front legs. Internal organs start changing.',
        keyEvents: ['Back legs grow first', 'Front legs develop', 'Lungs begin forming', 'Diet shifts to insects', 'Tail starts shrinking'],
      },
      {
        id: 'froglet', name: 'Froglet', emoji: '🐸', duration: '2-4 weeks',
        description: 'Almost there! The tail is absorbed, lungs are functional, and the froglet can leave the water.',
        keyEvents: ['Tail fully absorbed (nutrients recycled)', 'Gills replaced by lungs', 'Can breathe air', 'Leaves water for land', 'Eats insects'],
      },
      {
        id: 'frog', name: 'Adult Frog', emoji: '🐸', duration: '10-15 years lifespan',
        description: 'A fully developed amphibian! Lives both on land and in water, returns to water to breed.',
        keyEvents: ['Fully terrestrial capable', 'Can live in water too', 'Carnivorous diet (insects)', 'Returns to water to breed', 'Cycle continues!'],
      },
    ],
    funFacts: [
      'Tadpoles are herbivores; adult frogs are carnivores',
      'The tail is "eaten" by the body for nutrients',
      'Frogs can absorb water through their skin',
      'Some frogs can freeze solid and survive!',
    ],
  },
  {
    id: 'dragonfly',
    name: 'Dragonfly',
    nameKey: 'auto.metamorphosis.dragonfly',
    emoji: '🪰',
    color: '#06b6d4',
    bgGradient: 'from-cyan-950 via-sky-950 to-blue-950',
    type: 'incomplete',
    description: 'Incomplete metamorphosis — no pupal stage! Dragonflies spend most of their lives as aquatic nymphs before becoming aerial hunters.',
    stages: [
      {
        id: 'egg', name: 'Egg', emoji: '🥚', duration: '1-5 weeks',
        description: 'Females lay eggs in or near water. Some species insert eggs into plant stems.',
        keyEvents: ['Eggs laid in/near water', 'Some inserted into plants', 'Hundreds of eggs laid', 'Embryo develops inside'],
      },
      {
        id: 'nymph', name: 'Nymph (Naiad)', emoji: '🦐', duration: '1-5 YEARS',
        description: 'The longest stage! Nymphs are fierce aquatic predators, molting 10-15 times as they grow.',
        keyEvents: ['Lives underwater', 'Fierce predator (eats tadpoles!)', 'Breathes through gills in abdomen', 'Molts 10-15 times', 'Can take years to develop'],
      },
      {
        id: 'emergence', name: 'Emergence', emoji: '✨', duration: '1-3 hours',
        description: 'The dramatic final molt! The nymph climbs out of water and transforms into a flying adult.',
        keyEvents: ['Nymph climbs out of water', 'Skin splits open', 'Adult emerges', 'Wings expand and harden', 'First flight!'],
      },
      {
        id: 'adult', name: 'Adult Dragonfly', emoji: '🪰', duration: '2-8 weeks',
        description: 'Master aerial hunters! Adult dragonflies catch prey mid-flight and can fly in any direction.',
        keyEvents: ['Expert flyer (any direction)', 'Hunts flying insects', 'Catches 95% of targets', 'Mates near water', 'Females lay eggs'],
      },
    ],
    funFacts: [
      'Nymph stage can last 5 years!',
      'Dragonflies catch 95% of prey they chase',
      'They can fly 56 km/h and hover',
      'Existed before dinosaurs (300 million years)',
    ],
  },
];

export default function Metamorphosis() {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [showChallenge, setShowChallenge] = useState(true);

  const activeChallenge: ChallengeData = {
    title: t('learnos.biology.metamorphosis_wonder', 'A Curious Question...'),
    prompt: t('learnos.biology.metamorphosis_prompt', "How does a crawling caterpillar transform into a flying butterfly? It's one of nature's greatest magic tricks. Let's observe!"),
    options: [t('learnos.challenge.explore', "Let's explore and find out!")],
    onSuccess: () => {
      setShowChallenge(false);
      const updated = completeModule(progress, 'metamorphosis', 60);
      setProgress(updated);
      saveProgress(updated);
    }
  };

  const [selectedCycle, setSelectedCycle] = useState(lifeCycles[0]);
  const [selectedStage, setSelectedStage] = useState(0);

  const stage = selectedCycle.stages[selectedStage];

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2"><Trans i18nKey="auto.metamorphosis.metamorphosis">🦋 Metamorphosis</Trans></h2>
          <p className="text-gray-400 text-lg"><Trans i18nKey="auto.metamorphosis.watch_organisms_transform_thro">Watch organisms transform through their life cycles!</Trans></p>
        </motion.div>

        {/* Organism selector */}
        <div className="flex justify-center gap-3 mb-6">
          {lifeCycles.map(lc => (
            <button key={lc.id} onClick={() => { setSelectedCycle(lc); setSelectedStage(0); }}
              className={`px-5 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${selectedCycle.id === lc.id ? 'text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
              style={selectedCycle.id === lc.id ? { backgroundColor: lc.color } : {}}>
              <span className="text-2xl">{lc.emoji}</span>
              <span>{t(lc.nameKey || '', lc.name)}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={selectedCycle.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Cycle info */}
            <div className={`bg-gradient-to-br ${selectedCycle.bgGradient} rounded-2xl border border-gray-700 p-5 mb-6`}>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="text-5xl">{selectedCycle.emoji}</div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{t(selectedCycle.nameKey || '', selectedCycle.name)} <Trans i18nKey="auto.metamorphosis.life_cycle">Life Cycle</Trans></h3>
                  <div className="flex gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-sm font-bold uppercase ${selectedCycle.type === 'complete' ? 'bg-purple-500/30 text-purple-300' : 'bg-cyan-500/30 text-cyan-300'}`}>
                      {t(`auto.metamorphosis.type_${selectedCycle.type}`, selectedCycle.type)} <Trans i18nKey="auto.metamorphosis.metamorphosis">Metamorphosis</Trans>
                                                              </span>
                    <span className="px-2 py-0.5 rounded-full text-sm font-bold uppercase bg-gray-500/30 text-gray-300">
                      {selectedCycle.stages.length} <Trans i18nKey="auto.metamorphosis.stages">Stages</Trans>
                                                              </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm">{selectedCycle.description}</p>
            </div>

            {/* Stage timeline */}
            <div className="flex items-center justify-center gap-2 mb-6 overflow-x-auto px-4 py-2">
              {selectedCycle.stages.map((s, i) => (
                <div key={s.id} className="flex items-center">
                  <button onClick={() => setSelectedStage(i)}
                    className={`flex flex-col items-center px-4 py-3 rounded-xl transition-all ${selectedStage === i ? 'bg-white/10 border border-white/20' : 'hover:bg-white/5'}`}>
                    <motion.div
                      className="text-3xl mb-1"
                      animate={selectedStage === i ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1.5 }}>
                      {s.emoji}
                    </motion.div>
                    <div className={`text-sm font-medium ${selectedStage === i ? 'text-white' : 'text-gray-500'}`}>{s.name}</div>
                  </button>
                  {i < selectedCycle.stages.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-gray-600 shrink-0" />
                  )}
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Stage visualization */}
              <div className={`bg-gradient-to-br ${selectedCycle.bgGradient} rounded-2xl border border-gray-700 p-8 flex flex-col items-center justify-center min-h-[300px]`}>
                <motion.div
                  key={stage.id}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-8xl mb-4">
                  {stage.emoji}
                </motion.div>
                <h4 className="text-2xl font-bold text-white mb-2">{stage.name}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span><Trans i18nKey="auto.metamorphosis.duration">Duration:</Trans> {stage.duration}</span>
                </div>
              </div>

              {/* Stage details */}
              <motion.div key={stage.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                <h4 className="text-lg font-bold text-white mb-3">{stage.name}</h4>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">{stage.description}</p>

                <h5 className="text-sm font-bold text-white mb-2 uppercase tracking-wider"><Trans i18nKey="auto.metamorphosis.key_events">Key Events</Trans></h5>
                <ul className="space-y-2 mb-4">
                  {stage.keyEvents.map((event, i) => (
                    <motion.li key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: selectedCycle.color }} />
                      {event}
                    </motion.li>
                  ))}
                </ul>

                {/* Navigation buttons */}
                <div className="flex gap-2">
                  <button onClick={() => setSelectedStage(s => Math.max(0, s - 1))} disabled={selectedStage === 0}
                    className="flex-1 py-2 rounded-lg bg-gray-800 text-gray-400 text-sm font-medium disabled:opacity-30">
                    <Trans i18nKey="auto.metamorphosis.previous">← Previous</Trans>
                                                        </button>
                  <button onClick={() => setSelectedStage(s => Math.min(selectedCycle.stages.length - 1, s + 1))}
                    disabled={selectedStage === selectedCycle.stages.length - 1}
                    className="flex-1 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-30"
                    style={{ backgroundColor: selectedCycle.color }}>
                    <Trans i18nKey="auto.metamorphosis.next">Next →</Trans>
                                                        </button>
                </div>
              </motion.div>
            </div>

            {/* Fun facts */}
            <div className="mt-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/20 p-5">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-purple-400" /> <Trans i18nKey="auto.metamorphosis.amazing_facts_about">Amazing Facts about</Trans> {selectedCycle.name} <Trans i18nKey="auto.metamorphosis.metamorphosis">Metamorphosis</Trans>
                                            </h4>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
                {selectedCycle.funFacts.map((fact, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-black/20 rounded-lg p-3 text-sm text-gray-300">
                    {fact}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
