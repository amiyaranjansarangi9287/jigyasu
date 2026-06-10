import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, RotateCcw, Zap, Info, CheckCircle2 } from 'lucide-react';
import { Trans, useTranslation } from "react-i18next";
import ChallengeOverlay, { ChallengeData } from '../../../shared/ui/ChallengeOverlay';
import ModuleWrapper from './ModuleWrapper';
import { loadProgress, saveProgress, completeModule, UserProgress } from '../lib/progress';

interface GeneTarget {
  id: string;
  name: string;
  emoji: string;
  originalSequence: string;
  targetSite: string;
  editedSequence: string;
  effect: string;
  application: string;
  realWorld: string;
}

const targets: GeneTarget[] = [
  { id: 'sickle', name: 'Sickle Cell Disease', emoji: '🩸', originalSequence: 'ATG-GTG-CAT-CTG-ACT-CCT-GAG-GAG', targetSite: 'GAG→GTG', editedSequence: 'ATG-GTG-CAT-CTG-ACT-CCT-GTG-GAG', effect: 'Corrects the single nucleotide mutation that causes hemoglobin to form sickle shapes', application: 'Gene therapy to cure sickle cell disease', realWorld: 'Casgevy — the first CRISPR therapy approved by FDA in 2023!' },
  { id: 'hiv', name: 'HIV Resistance', emoji: '🛡️', originalSequence: 'ATG-GAC-TGG-GAC-CCR-AAC-TTC-AGC', targetSite: 'CCR5 gene disruption', editedSequence: 'ATG-GAC-TGG-GAC-___-___-TTC-AGC', effect: 'Disables the CCR5 receptor that HIV uses to enter cells, making them resistant', application: 'Preventing HIV infection', realWorld: 'The "Berlin Patient" was naturally CCR5-negative. ~1% of Europeans have this mutation naturally.' },
  { id: 'muscle', name: 'Muscular Dystrophy', emoji: '💪', originalSequence: 'ATG-CTC-TGG-TAG-AGC-AAT-GCC-TTC', targetSite: 'Exon 51 skip', editedSequence: 'ATG-CTC-TGG-___-AGC-AAT-GCC-TTC', effect: 'Skips the mutated exon to produce a shorter but functional dystrophin protein', application: 'Treating Duchenne muscular dystrophy', realWorld: 'Clinical trials are showing promising results in restoring partial muscle function in DMD patients.' },
  { id: 'crop', name: 'Drought-Resistant Crops', emoji: '🌾', originalSequence: 'ATG-GAT-CCG-AGT-TGC-ACC-GAA-TCG', targetSite: 'ARGOS8 promoter', editedSequence: 'ATG-GAT-CCG-AGT-TGC-ACC*-GAA-TCG', effect: 'Modifies gene expression to increase water-retention ability in plants', application: 'Creating crops that survive droughts', realWorld: 'CRISPR-edited corn by DuPont shows 5+ bushel/acre improvement during drought conditions.' },
  { id: 'malaria', name: 'Malaria-Resistant Mosquitoes', emoji: '🦟', originalSequence: 'ATG-TCC-GAA-CTA-GGC-ATT-AGG-CAT', targetSite: 'Doublesex gene', editedSequence: 'ATG-TCC-GAA-CTA-GGC-___-___-CAT', effect: 'Gene drive makes female mosquitoes infertile, reducing malaria-carrying populations', application: 'Eradicating malaria', realWorld: 'Target Malaria project in Africa is testing this approach. Malaria kills ~600,000 people/year.' },
];

const crisprSteps = [
  { name: 'Design Guide RNA', emoji: '🎯', description: 'Scientists design a guide RNA (gRNA) that matches the target DNA sequence — like a GPS coordinate for the genome.' },
  { name: 'Cas9 Binds DNA', emoji: '🔍', description: 'The Cas9 protein, guided by the gRNA, scans the entire genome searching for the matching sequence.' },
  { name: 'Cut DNA', emoji: '✂️', description: 'When Cas9 finds the target, it creates a precise double-strand break in the DNA at that exact location.' },
  { name: 'Cell Repairs', emoji: '🔧', description: 'The cell\'s natural repair machinery fixes the break. We can either disable the gene (NHEJ) or insert new DNA (HDR).' },
  { name: 'Gene Edited!', emoji: '✅', description: 'The gene is now permanently modified! The edit is passed to all future cell divisions.' },
];

export default function CrisprEditor() {
  const { t } = useTranslation();
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [showChallenge, setShowChallenge] = useState(true);
  const [selectedTarget, setSelectedTarget] = useState(targets[0]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isEditing, setIsEditing] = useState(false);
  const [editComplete, setEditComplete] = useState(false);

  const activeChallenge: ChallengeData = {
    title: t('learnos.biology.crispr_wonder', 'A Curious Question...'),
    prompt: t('learnos.biology.crispr_prompt', 'What if we could rewrite the code of life to cure diseases, just like fixing a typo in a book? Welcome to CRISPR! Ready to edit some DNA?'),
    options: [t('learnos.challenge.explore', "Let's explore and find out!")],
    onSuccess: () => {
      setShowChallenge(false);
      const updated = completeModule(progress, 'crispr-editor', 65);
      setProgress(updated);
      saveProgress(updated);
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditComplete(false);
    setCurrentStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= crisprSteps.length) {
        clearInterval(interval);
        setEditComplete(true);
        setIsEditing(false);
      }
      setCurrentStep(step);
    }, 1800);
  };

  const reset = () => {
    setCurrentStep(-1);
    setIsEditing(false);
    setEditComplete(false);
  };

  return (
    <ModuleWrapper moduleId="crispr-editor" progress={progress} setProgress={setProgress} onNavigate={() => {}}>
      {showChallenge && <ChallengeOverlay challenge={activeChallenge} onClose={() => setShowChallenge(false)} />}
      <div className="min-h-screen bg-gray-950 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2"><Trans i18nKey="auto.crispreditor.crispr_gene_editor">✂️ CRISPR Gene Editor</Trans></h2>
          <p className="text-gray-400 text-lg"><Trans i18nKey="auto.crispreditor.simulate_cutting_and_editing_d">Simulate cutting and editing DNA with CRISPR-Cas9!</Trans></p>
        </motion.div>

        {/* Target selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {targets.map(t => (
            <button key={t.id} onClick={() => { setSelectedTarget(t); reset(); }}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${selectedTarget.id === t.id ? 'bg-emerald-500 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
              {t.emoji} {t.name}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* DNA Editing Visualization */}
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <h3 className="text-sm font-bold text-white mb-4">{selectedTarget.emoji} <Trans i18nKey="auto.crispreditor.target">Target:</Trans> {selectedTarget.name}</h3>

              {/* DNA Sequence */}
              <div className="mb-5">
                <div className="text-sm text-gray-500 mb-1 uppercase font-bold">
                  {editComplete ? '✅ Edited DNA Sequence' : '🧬 Original DNA Sequence'}
                </div>
                <div className="flex flex-wrap gap-1 font-mono text-sm">
                  {(editComplete ? selectedTarget.editedSequence : selectedTarget.originalSequence).split('-').map((codon, i) => {
                    const isCutSite = currentStep >= 2 && i >= 5 && i <= 6;
                    const isEdited = editComplete && codon !== selectedTarget.originalSequence.split('-')[i];
                    return (
                      <motion.span key={i}
                        className={`px-2 py-1 rounded ${
                          isEdited ? 'bg-emerald-500/30 text-emerald-400 border border-emerald-500/50' :
                          isCutSite ? 'bg-red-500/30 text-orange-400 border border-red-500/50' :
                          codon === '___' ? 'bg-gray-800 text-gray-600 border border-gray-700' :
                          'bg-gray-800 text-gray-300 border border-gray-700'
                        }`}
                        animate={isCutSite ? { y: [0, -3, 0] } : {}}
                        transition={{ repeat: Infinity, duration: 0.5 }}>
                        {codon}
                      </motion.span>
                    );
                  })}
                </div>
                <div className="text-sm text-gray-600 mt-1"><Trans i18nKey="auto.crispreditor.edit_target">Edit target:</Trans> <span className="text-yellow-400">{selectedTarget.targetSite}</span></div>
              </div>

              {/* CRISPR Steps Animation */}
              <div className="space-y-2 mb-5">
                {crisprSteps.map((step, i) => (
                  <motion.div key={i}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                      currentStep === i ? 'bg-blue-500/15 border border-blue-500/30' :
                      currentStep > i ? 'bg-emerald-500/10 border border-emerald-500/20' :
                      'bg-gray-800/30 border border-transparent'
                    }`}
                    animate={currentStep === i ? { scale: [1, 1.01, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1 }}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
                      currentStep > i ? 'bg-emerald-500 text-white' :
                      currentStep === i ? 'bg-blue-500 text-white animate-pulse' :
                      'bg-gray-800 text-gray-600'
                    }`}>
                      {currentStep > i ? <CheckCircle2 className="w-4 h-4" /> : step.emoji}
                    </div>
                    <div>
                      <div className={`text-sm font-bold ${currentStep >= i ? 'text-white' : 'text-gray-600'}`}>{step.name}</div>
                      {currentStep === i && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                          className="text-sm text-gray-400 mt-0.5">{step.description}</motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Controls */}
              <div className="flex gap-2">
                <button onClick={startEditing} disabled={isEditing}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 ${isEditing ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : editComplete ? 'bg-purple-500 text-white' : 'bg-emerald-500 text-white hover:bg-emerald-600'}`}>
                  {editComplete ? <><RotateCcw className="w-4 h-4" /> <Trans i18nKey="auto.crispreditor.edit_again">Edit Again</Trans></> :
                   isEditing ? <><Scissors className="w-4 h-4 animate-bounce" /> <Trans i18nKey="auto.crispreditor.editing">Editing...</Trans></> :
                   <><Scissors className="w-4 h-4" /> <Trans i18nKey="auto.crispreditor.start_crispr_edit">Start CRISPR Edit</Trans></>}
                </button>
                <button onClick={reset} className="px-4 py-2.5 rounded-xl bg-gray-800 text-gray-300">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div key={selectedTarget.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
                <div className="text-3xl mb-2">{selectedTarget.emoji}</div>
                <h3 className="text-lg font-bold text-white mb-1">{selectedTarget.name}</h3>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">{selectedTarget.effect}</p>

                <div className="bg-blue-500/10 rounded-xl p-3 border border-blue-500/20 mb-3">
                  <div className="text-sm text-blue-400 font-bold flex items-center gap-1 mb-1"><Zap className="w-3 h-3" /> <Trans i18nKey="auto.crispreditor.application">Application</Trans></div>
                  <p className="text-sm text-gray-300">{selectedTarget.application}</p>
                </div>

                <div className="bg-green-500/10 rounded-xl p-3 border border-green-500/20">
                  <div className="text-sm text-green-400 font-bold flex items-center gap-1 mb-1"><Info className="w-3 h-3" /> <Trans i18nKey="auto.crispreditor.real_world">Real World</Trans></div>
                  <p className="text-sm text-gray-300">{selectedTarget.realWorld}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* How CRISPR Works */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <h4 className="text-sm font-bold text-white mb-3"><Trans i18nKey="auto.crispreditor.what_is_crispr">🧬 What is CRISPR?</Trans></h4>
              <div className="text-sm text-gray-300 space-y-2">
                <p><strong className="text-white"><Trans i18nKey="auto.crispreditor.crispr_cas9">CRISPR-Cas9</Trans></strong> <Trans i18nKey="auto.crispreditor.is_a_revolutionary_gene_editin">is a revolutionary gene-editing tool discovered from bacteria's immune system. It lets scientists precisely cut and edit DNA.</Trans></p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-gray-800/50 rounded-lg p-2">
                    <div className="font-bold text-purple-400 text-sm"><Trans i18nKey="auto.crispreditor.crispr">CRISPR</Trans></div>
                    <div className="text-sm text-gray-500"><Trans i18nKey="auto.crispreditor.the_gps_guides_cas9_to_the_rig">The GPS — guides Cas9 to the right spot</Trans></div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-2">
                    <div className="font-bold text-orange-400 text-sm"><Trans i18nKey="auto.crispreditor.cas9">Cas9</Trans></div>
                    <div className="text-sm text-gray-500"><Trans i18nKey="auto.crispreditor.the_scissors_cuts_dna_at_targe">The scissors — cuts DNA at target</Trans></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ethics */}
            <div className="bg-yellow-500/10 rounded-xl border border-yellow-500/20 p-4">
              <div className="text-sm text-yellow-400 font-bold mb-1"><Trans i18nKey="auto.crispreditor.ethical_considerations">⚖️ Ethical Considerations</Trans></div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li><Trans i18nKey="auto.crispreditor.somatic_edits_body_cells_are_t">• Somatic edits (body cells) are temporary; germline edits (eggs/sperm) are inherited</Trans></li>
                <li><Trans i18nKey="auto.crispreditor.editing_human_embryos_is_banne">• Editing human embryos is banned in most countries</Trans></li>
                <li><Trans i18nKey="auto.crispreditor.gene_drives_could_eliminate_sp">• Gene drives could eliminate species — ecological risks</Trans></li>
                <li><Trans i18nKey="auto.crispreditor.designer_babies_raise_equity_a">• "Designer babies" raise equity and consent concerns</Trans></li>
                <li><Trans i18nKey="auto.crispreditor.approved_therapies_treat_serio">• Approved therapies treat serious diseases only</Trans></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ModuleWrapper>
  );
}
