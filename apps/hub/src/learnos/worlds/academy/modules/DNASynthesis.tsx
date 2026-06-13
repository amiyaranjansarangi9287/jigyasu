// src/worlds/academy/modules/DNASynthesis.tsx
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import AcademyShell from '../AcademyShell';
import { useLumoAncient } from '../hooks/useLumoAncient';
import { useAcademyProgress } from '../hooks/useAcademyProgress';
import { Trans } from "react-i18next";
import { useTranslation } from 'react-i18next';

const SCENARIOS = [
  { id: 'normal', name: 'Normal Haemoglobin', template: 'TAC-CAC-GTT-GAA', mrna: 'AUG-GUG-CAA-CUU', protein: 'Met-Val-Gln-Leu', mutation: 'none', effect: '', medical: '' },
  { id: 'sickle', name: 'Sickle Cell Mutation', template: 'TAC-CAC-GTT-GAA', mrna: 'AUG-GUG-CAA-CUU', protein: 'Met-Val-Gln-Leu → changed', mutation: 'substitution', effect: 'One base change → entire protein shape changes', medical: 'Sickle cell disease affects millions in India. One base change in haemoglobin.' },
  { id: 'silent', name: 'Silent Mutation', template: 'TAC-CAC-GTT-GAA', mrna: 'AUG-GUG-CAA-CUU', protein: 'Met-Val-Gln-Leu (unchanged)', mutation: 'substitution', effect: 'No change — multiple codons code for the same amino acid', medical: 'Most mutations have no effect — genetic redundancy protects us.' },
  { id: 'nonsense', name: 'Nonsense (Stop Codon)', template: 'TAC-CAC-GTT-GAA', mrna: 'AUG-GUG-UAA', protein: 'Met-Val-STOP', mutation: 'substitution', effect: 'Premature stop → truncated protein', medical: 'Cystic fibrosis, muscular dystrophy — premature stop codons.' },
];

const BASE_PAIRS: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G' };
const BASE_COLORS: Record<string, string> = { A: '#EF4444', T: '#3B82F6', G: '#22C55E', C: '#F59E0B', U: '#8B5CF6' };

export default function DNASynthesis() {
  const { t } = useTranslation();
  const lumo = useLumoAncient();
  const { recordDNA } = useAcademyProgress();
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [mutationsExplored, setMutationsExplored] = useState<string[]>([]);
  const scenario = SCENARIOS[scenarioIdx];

  const handleExplore = useCallback(async (idx: number) => {
    setScenarioIdx(idx);
    const s = SCENARIOS[idx];
    const isMutation = s.mutation !== 'none';
    if (isMutation && !mutationsExplored.includes(s.id)) {
      setMutationsExplored(p => [...p, s.id]);
    }
    const allMutations = mutationsExplored.length >= 2 || (isMutation && mutationsExplored.length >= 1);
    await recordDNA(true, isMutation, true, allMutations);
    if (allMutations) lumo.afterProfoundDiscovery();
  }, [mutationsExplored, recordDNA, lumo]);

  return (
    <AcademyShell module="dna-synthesis">
      <div className="flex-1 flex flex-col p-5 bg-slate-950 pb-24">
        {/* Scenario selector */}
        <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
          {SCENARIOS.map((s, i) => (
            <button key={s.id} onClick={() => handleExplore(i)}
              className={`flex-shrink-0 px-3 py-2 rounded-full text-sm font-bold min-h-[40px] ${scenarioIdx === i ? 'bg-red-700 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
              {s.mutation !== 'none' ? '⚠️' : '✓'} {s.name}
            </button>
          ))}
        </div>

        {/* DNA helix visual */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 mb-4 overflow-hidden" style={{ height: '120px' }}>
          <div className="w-full h-full flex items-center justify-center gap-1">
            {scenario.template.replace(/-/g, '').split('').map((base, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: BASE_COLORS[base] }}>{base}</div>
                <div className="w-px h-3 bg-slate-600" />
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: BASE_COLORS[BASE_PAIRS[base]] }}>{BASE_PAIRS[base]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Synthesis details */}
        <div className="space-y-3 mb-4">
          <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
            <p className="text-slate-400 text-sm font-bold mb-1"><Trans i18nKey="auto.dnasynthesis.template_dna_3_5">Template DNA (3' → 5')</Trans></p>
            <p className="text-white font-mono text-sm">{scenario.template}</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
            <p className="text-purple-400 text-sm font-bold mb-1"><Trans i18nKey="auto.dnasynthesis.mrna_5_3">mRNA (5' → 3')</Trans></p>
            <p className="text-white font-mono text-sm">{scenario.mrna}</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
            <p className="text-amber-400 text-sm font-bold mb-1"><Trans i18nKey="auto.dnasynthesis.protein">Protein</Trans></p>
            <p className="text-white font-mono text-sm">{scenario.protein}</p>
          </div>
        </div>

        {/* Mutation info */}
        {scenario.mutation !== 'none' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-red-950/30 rounded-2xl p-4 border border-red-900/30 mb-4">
            <p className="text-red-400 text-sm font-bold uppercase mb-1"><Trans i18nKey="auto.dnasynthesis.mutation">Mutation:</Trans> {scenario.mutation}</p>
            <p className="text-slate-300 text-sm leading-relaxed">{scenario.effect}</p>
            {scenario.medical && <p className="text-amber-400 text-sm font-medium mt-2">🇮🇳 {scenario.medical}</p>}
          </motion.div>
        )}

        {/* CRISPR mention */}
        {mutationsExplored.length >= 2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-950/30 rounded-2xl p-4 border border-indigo-900/30">
            <p className="text-indigo-400 text-sm font-bold uppercase mb-1"><Trans i18nKey="auto.dnasynthesis.crispr_gene_editing">🧬 CRISPR Gene Editing</Trans></p>
            <p className="text-slate-300 text-sm leading-relaxed"><Trans i18nKey="auto.dnasynthesis.scientists_can_now_target_and_">Scientists can now target and fix specific bases. CRISPR is as precise as find-and-replace in a document — but for DNA.</Trans></p>
          </motion.div>
        )}

        {/* Base pairing reference */}
        <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-800 mt-4">
          <p className="text-slate-500 text-sm font-bold uppercase mb-2"><Trans i18nKey="auto.dnasynthesis.base_pairing_rules">Base Pairing Rules</Trans></p>
          <div className="flex justify-center gap-4">
            <div className="text-center"><span className="text-sm" style={{ color: BASE_COLORS.A }}><Trans i18nKey="auto.dnasynthesis.a">A</Trans></span><span className="text-slate-600 text-sm"> ↔ </span><span className="text-sm" style={{ color: BASE_COLORS.T }}><Trans i18nKey="auto.dnasynthesis.t">T</Trans></span></div>
            <div className="text-center"><span className="text-sm" style={{ color: BASE_COLORS.G }}><Trans i18nKey="auto.dnasynthesis.g">G</Trans></span><span className="text-slate-600 text-sm"> ↔ </span><span className="text-sm" style={{ color: BASE_COLORS.C }}><Trans i18nKey="auto.dnasynthesis.c">C</Trans></span></div>
            <div className="text-center text-slate-500 text-sm"><Trans i18nKey="auto.dnasynthesis.dna_a_t_rna_a_u">DNA: A↔T | RNA: A↔U</Trans></div>
          </div>
        </div>
      </div>
    </AcademyShell>
  );
}
