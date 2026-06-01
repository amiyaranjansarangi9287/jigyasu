// src/worlds/academy/hooks/useAcademyProgress.ts
import { useState, useCallback, useEffect } from 'react';
import { db } from '@/db';
import type { AcademyProgress, AcademyModule, DepthLevel } from '../types/academy.types';
import { ACADEMY_MODULES } from '../data/academyContent';

const DEFAULT_DEPTH = Object.fromEntries(ACADEMY_MODULES.map(m => [m.id, null])) as Record<AcademyModule, DepthLevel | null>;
const PROGRESS_KEY = 'academy-world-progress';

const DEFAULT: AcademyProgress = {
  unitCircleExplored: false, wavesConnected: false, radiansMastered: false, phaseShiftFound: false,
  optimalAngleDiscovered: false, airResistanceCompared: false, trajectoryEquationFound: false,
  constructiveFound: false, destructiveFound: false, noiseCancellingUnderstood: false, youngDoubleSlitConnected: false,
  slopeAsDerivative: false, minMaxFound: false, positionVelocityAccel: false, chainRuleAttempted: false,
  oxidationStateBalanced: false, halfReactionsUsed: false, batteryChemistryUnderstood: false,
  basePairingMastered: false, mutationEffect: false, proteinSynthesisComplete: false, crisperMentioned: false,
  electrolysisSetupsDone: [], faradayCalculated: false, greenHydrogenUnderstood: false,
  selectionGenerationsRun: 0, tippingPointConceptUnderstood: false, antibioticResistanceConnected: false,
  essayPromptsAttempted: [], counterArgStrengthened: false, structureScoreAvg: 0,
  indicatorsExplored: [], policyDecisionsApplied: [], tradeOffUnderstood: false,
  identitiesProven: [], geometricProofCompleted: false, identitiesUsedInProblems: 0,
  feedbackLoopsFound: [], tippingPointsIdentified: 0, climateDataInterpreted: false,
  depth: DEFAULT_DEPTH, examQuestionsAttempted: 0, examQuestionsCorrect: 0, examBoardsEngaged: [],
  connectionsFound: 0, totalSessions: 0, totalMinutes: 0, lastSessionAt: 0, longestSession: 0, updatedAt: 0,
};

export function useAcademyProgress() {
  const [progress, setProgress] = useState<AcademyProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { const s = await db.conceptProgress.get([PROGRESS_KEY, 'academy']); setProgress(s?.payload ? s.payload as AcademyProgress : { ...DEFAULT }); }
      catch { setProgress({ ...DEFAULT }); }
      finally { setLoading(false); }
    })();
  }, []);

  const save = useCallback(async (u: AcademyProgress) => {
    setProgress(u);
    try { await db.conceptProgress.put({ childId: PROGRESS_KEY, conceptId: 'academy-world-progress', ageGroup: 'academy', status: 'in_progress', attemptsCount: u.totalSessions, hintsUsed: 0, wrongAnswers: 0, timeSpentSeconds: Math.floor(u.totalMinutes * 60), lumoInteractions: 0, payload: u } as any); } catch (_) {}
  }, []);

  const updateDepth = useCallback(async (mod: AcademyModule, level: DepthLevel) => {
    if (!progress) return;
    const levels: DepthLevel[] = ['surface', 'mechanism', 'principle', 'frontier'];
    const cur = progress.depth[mod]; if (cur && levels.indexOf(cur) >= levels.indexOf(level)) return;
    save({ ...progress, depth: { ...progress.depth, [mod]: level }, updatedAt: Date.now() });
  }, [progress, save]);

  const getDepth = useCallback((mod: AcademyModule) => progress?.depth[mod] ?? null, [progress]);

  const recordTrigonometry = useCallback(async (uc: boolean, wav: boolean, rad: boolean, ph: boolean) => {
    if (!progress) return;
    save({ ...progress, unitCircleExplored: progress.unitCircleExplored || uc, wavesConnected: progress.wavesConnected || wav, radiansMastered: progress.radiansMastered || rad, phaseShiftFound: progress.phaseShiftFound || ph, updatedAt: Date.now() });
    await updateDepth('trigonometry-circle', wav && rad ? 'principle' : uc ? 'mechanism' : 'surface');
  }, [progress, save, updateDepth]);

  const recordProjectile = useCallback(async (angle: boolean, air: boolean, eq: boolean) => {
    if (!progress) return;
    save({ ...progress, optimalAngleDiscovered: progress.optimalAngleDiscovered || angle, airResistanceCompared: progress.airResistanceCompared || air, trajectoryEquationFound: progress.trajectoryEquationFound || eq, updatedAt: Date.now() });
    await updateDepth('projectile-motion', eq ? 'principle' : angle ? 'mechanism' : 'surface');
  }, [progress, save, updateDepth]);

  const recordWaves = useCallback(async (con: boolean, des: boolean, nc: boolean, ys: boolean) => {
    if (!progress) return;
    save({ ...progress, constructiveFound: progress.constructiveFound || con, destructiveFound: progress.destructiveFound || des, noiseCancellingUnderstood: progress.noiseCancellingUnderstood || nc, youngDoubleSlitConnected: progress.youngDoubleSlitConnected || ys, updatedAt: Date.now() });
    await updateDepth('wave-interference', ys ? 'frontier' : nc ? 'principle' : des ? 'mechanism' : 'surface');
  }, [progress, save, updateDepth]);

  const recordDerivatives = useCallback(async (sl: boolean, mm: boolean, kin: boolean, ch: boolean) => {
    if (!progress) return;
    save({ ...progress, slopeAsDerivative: progress.slopeAsDerivative || sl, minMaxFound: progress.minMaxFound || mm, positionVelocityAccel: progress.positionVelocityAccel || kin, chainRuleAttempted: progress.chainRuleAttempted || ch, updatedAt: Date.now() });
    await updateDepth('derivatives-visual', kin ? 'principle' : mm ? 'mechanism' : 'surface');
  }, [progress, save, updateDepth]);

  const recordRedox = useCallback(async (ox: boolean, hr: boolean, bat: boolean) => {
    if (!progress) return;
    save({ ...progress, oxidationStateBalanced: progress.oxidationStateBalanced || ox, halfReactionsUsed: progress.halfReactionsUsed || hr, batteryChemistryUnderstood: progress.batteryChemistryUnderstood || bat, updatedAt: Date.now() });
    await updateDepth('redox-reactions', bat ? 'principle' : hr ? 'mechanism' : 'surface');
  }, [progress, save, updateDepth]);

  const recordDNA = useCallback(async (bp: boolean, mut: boolean, syn: boolean, cr: boolean) => {
    if (!progress) return;
    save({ ...progress, basePairingMastered: progress.basePairingMastered || bp, mutationEffect: progress.mutationEffect || mut, proteinSynthesisComplete: progress.proteinSynthesisComplete || syn, crisperMentioned: progress.crisperMentioned || cr, updatedAt: Date.now() });
    await updateDepth('dna-synthesis', cr ? 'frontier' : syn ? 'principle' : mut ? 'mechanism' : 'surface');
  }, [progress, save, updateDepth]);

  const recordExamAttempt = useCallback(async (correct: number, total: number, board: string) => {
    if (!progress) return;
    save({ ...progress, examQuestionsAttempted: progress.examQuestionsAttempted + total, examQuestionsCorrect: progress.examQuestionsCorrect + correct, examBoardsEngaged: progress.examBoardsEngaged.includes(board as any) ? progress.examBoardsEngaged : [...progress.examBoardsEngaged, board as any], updatedAt: Date.now() });
  }, [progress, save]);

  const recordElectrolysis = useCallback(async (setupId: string, faraday: boolean, greenH2: boolean) => {
    if (!progress) return;
    const updated = { ...progress, electrolysisSetupsDone: progress.electrolysisSetupsDone.includes(setupId) ? progress.electrolysisSetupsDone : [...progress.electrolysisSetupsDone, setupId], faradayCalculated: progress.faradayCalculated || faraday, greenHydrogenUnderstood: progress.greenHydrogenUnderstood || greenH2, updatedAt: Date.now() };
    await save(updated); await updateDepth('electrolysis', greenH2 ? 'principle' : faraday ? 'mechanism' : 'surface');
  }, [progress, save, updateDepth]);

  const recordNaturalSelection = useCallback(async (generations: number, tipping: boolean, antibiotic: boolean) => {
    if (!progress) return;
    const updated = { ...progress, selectionGenerationsRun: Math.max(progress.selectionGenerationsRun, generations), tippingPointConceptUnderstood: progress.tippingPointConceptUnderstood || tipping, antibioticResistanceConnected: progress.antibioticResistanceConnected || antibiotic, updatedAt: Date.now() };
    await save(updated); await updateDepth('natural-selection', antibiotic ? 'frontier' : tipping ? 'principle' : generations >= 20 ? 'mechanism' : 'surface');
  }, [progress, save, updateDepth]);

  const recordEssay = useCallback(async (promptId: string, counterStrengthened: boolean, structureScore: number) => {
    if (!progress) return;
    const attempts = progress.essayPromptsAttempted.includes(promptId) ? progress.essayPromptsAttempted : [...progress.essayPromptsAttempted, promptId];
    const avg = attempts.length === 1 ? structureScore : (progress.structureScoreAvg * (attempts.length - 1) + structureScore) / attempts.length;
    const updated = { ...progress, essayPromptsAttempted: attempts, counterArgStrengthened: progress.counterArgStrengthened || counterStrengthened, structureScoreAvg: Math.round(avg * 10) / 10, updatedAt: Date.now() };
    await save(updated); await updateDepth('essay-architect', attempts.length >= 3 ? 'principle' : 'mechanism');
  }, [progress, save, updateDepth]);

  const recordEconomics = useCallback(async (indicatorId: string, policyId: string, tradeOff: boolean) => {
    if (!progress) return;
    const updated = { ...progress, indicatorsExplored: progress.indicatorsExplored.includes(indicatorId) ? progress.indicatorsExplored : [...progress.indicatorsExplored, indicatorId], policyDecisionsApplied: progress.policyDecisionsApplied.includes(policyId) ? progress.policyDecisionsApplied : [...progress.policyDecisionsApplied, policyId], tradeOffUnderstood: progress.tradeOffUnderstood || tradeOff, updatedAt: Date.now() };
    await save(updated); await updateDepth('economic-indicators', tradeOff ? 'principle' : 'mechanism');
  }, [progress, save, updateDepth]);

  const recordTrigIdentity = useCallback(async (identityId: string, geometric: boolean, usedInProblem: boolean) => {
    if (!progress) return;
    const updated = { ...progress, identitiesProven: progress.identitiesProven.includes(identityId) ? progress.identitiesProven : [...progress.identitiesProven, identityId], geometricProofCompleted: progress.geometricProofCompleted || geometric, identitiesUsedInProblems: usedInProblem ? progress.identitiesUsedInProblems + 1 : progress.identitiesUsedInProblems, updatedAt: Date.now() };
    await save(updated); await updateDepth('trig-identities', usedInProblem ? 'principle' : geometric ? 'mechanism' : 'surface');
  }, [progress, save, updateDepth]);

  const recordClimate = useCallback(async (feedbackId: string, tippingPoints: number, dataInterpreted: boolean) => {
    if (!progress) return;
    const updated = { ...progress, feedbackLoopsFound: progress.feedbackLoopsFound.includes(feedbackId) ? progress.feedbackLoopsFound : [...progress.feedbackLoopsFound, feedbackId], tippingPointsIdentified: Math.max(progress.tippingPointsIdentified, tippingPoints), climateDataInterpreted: progress.climateDataInterpreted || dataInterpreted, updatedAt: Date.now() };
    await save(updated); await updateDepth('climate-systems', updated.feedbackLoopsFound.length >= 4 ? 'frontier' : dataInterpreted ? 'principle' : 'mechanism');
  }, [progress, save, updateDepth]);

  return { progress, loading, updateDepth, getDepth, recordTrigonometry, recordProjectile, recordWaves, recordDerivatives, recordRedox, recordDNA, recordExamAttempt, recordElectrolysis, recordNaturalSelection, recordEssay, recordEconomics, recordTrigIdentity, recordClimate, save };
}
