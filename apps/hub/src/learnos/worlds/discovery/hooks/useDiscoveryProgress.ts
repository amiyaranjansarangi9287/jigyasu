// src/worlds/discovery/hooks/useDiscoveryProgress.ts
import { useState, useCallback, useEffect } from 'react';
import { db } from '@/db';
import type { DiscoveryProgress, DiscoveryModule, MasteryLevel } from '../types/discovery.types';
import { DISCOVERY_MODULES } from '../data/discoveryContent';

const DEFAULT_MASTERY = Object.fromEntries(
  DISCOVERY_MODULES.map((m) => [m.id, null])
) as Record<DiscoveryModule, MasteryLevel | null>;

const PROGRESS_KEY = 'discovery-world-progress';

const DEFAULT_PROGRESS: DiscoveryProgress = {
  equationsSolved: 0, substitutionUsed: false, twoVariablesSolved: false,
  organellesPlaced: 0, correctOrganelles: 0, cellTypesCompared: [],
  reactionsBalanced: 0, realReactionsBalanced: [],
  proofsCompleted: 0, pythagorasVisualized: false, circleTheoremsFound: 0,
  graphsInterpreted: 0, slopeDiscovered: false, accelerationFound: false,
  crossesRun: 0, dominanceUnderstood: false, probabilityConnectionMade: false,
  mastery: DEFAULT_MASTERY, connectionsFound: 0, connectionIds: [],
  rabbitHolesEntered: 0, rabbitHoleIds: [],
  unsolvedQuestionsViewed: 0,
  tectonicsInteractions: 0, boundaryTypesFound: [],
  literaryTextsAnalysed: [], devicesIdentified: [],
  economicSimsRun: 0, eventsApplied: [],
  elementsExplored: [], periodicPatternsFound: 0,
  experimentsRun: 0, paradoxesDiscovered: [],
  carbonFlowsTracked: [], humanImpactUnderstood: false,
  numberSystemsConverted: [], binaryUnderstood: false,
  fermiProblemsAttempted: 0, fermiAccuracyScore: 0,
  lumoInteractions: 0, lumoActedOn: 0,
  totalSessions: 0, totalMinutes: 0, lastSessionAt: 0, updatedAt: 0,
};

export function useDiscoveryProgress() {
  const [progress, setProgress] = useState<DiscoveryProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await db.conceptProgress.get(PROGRESS_KEY);
        if (stored?.payload) setProgress(stored.payload as DiscoveryProgress);
        else setProgress({ ...DEFAULT_PROGRESS });
      } catch { setProgress({ ...DEFAULT_PROGRESS }); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const saveProgress = useCallback(async (updated: DiscoveryProgress) => {
    try {
      await db.conceptProgress.put({
        conceptId: PROGRESS_KEY, ageGroup: 'discovery',
        status: 'in_progress', attemptsCount: updated.totalSessions,
        payload: updated,
      } as any);
    } catch (err) { console.warn('[Discovery] Progress save failed:', err); }
  }, []);

  const getMastery = useCallback((module: DiscoveryModule): MasteryLevel | null => {
    return progress?.mastery[module] ?? null;
  }, [progress]);

  const updateMastery = useCallback(async (module: DiscoveryModule, level: MasteryLevel) => {
    if (!progress) return;
    const levelOrder = { aware: 1, understand: 2, apply: 3, connect: 4 };
    const current = progress.mastery[module];
    if (current && levelOrder[current] >= levelOrder[level]) return;

    const updated: DiscoveryProgress = {
      ...progress, mastery: { ...progress.mastery, [module]: level }, updatedAt: Date.now(),
    };
    setProgress(updated); await saveProgress(updated);
  }, [progress, saveProgress]);

  const recordRabbitHole = useCallback(async (module: DiscoveryModule) => {
    if (!progress) return;
    const updated: DiscoveryProgress = {
      ...progress, rabbitHolesEntered: progress.rabbitHolesEntered + 1,
      rabbitHoleIds: progress.rabbitHoleIds.includes(module) ? progress.rabbitHoleIds : [...progress.rabbitHoleIds, module],
      updatedAt: Date.now(),
    };
    setProgress(updated); await saveProgress(updated);
  }, [progress, saveProgress]);

  const recordAlgebraSolved = useCallback(async () => {
    if (!progress) return;
    const updated: DiscoveryProgress = { ...progress, equationsSolved: progress.equationsSolved + 1, updatedAt: Date.now() };
    setProgress(updated); await saveProgress(updated);
  }, [progress, saveProgress]);

  const recordCellPlacement = useCallback(async () => {
    if (!progress) return;
    const updated: DiscoveryProgress = { ...progress, organellesPlaced: progress.organellesPlaced + 1, updatedAt: Date.now() };
    setProgress(updated); await saveProgress(updated);
  }, [progress, saveProgress]);

  const recordReactionBalanced = useCallback(async (reactionId: string) => {
    if (!progress) return;
    const updated: DiscoveryProgress = { ...progress, reactionsBalanced: progress.reactionsBalanced + 1, realReactionsBalanced: [...progress.realReactionsBalanced, reactionId], updatedAt: Date.now() };
    setProgress(updated); await saveProgress(updated);
  }, [progress, saveProgress]);

  const recordProofCompleted = useCallback(async (py: boolean, ct: boolean) => {
    if (!progress) return;
    const updated: DiscoveryProgress = { ...progress, proofsCompleted: progress.proofsCompleted + 1, pythagorasVisualized: py || progress.pythagorasVisualized, circleTheoremsFound: ct ? progress.circleTheoremsFound + 1 : progress.circleTheoremsFound, updatedAt: Date.now() };
    setProgress(updated); await saveProgress(updated);
  }, [progress, saveProgress]);

  const recordSpeedGraph = useCallback(async (sl: boolean, acc: boolean) => {
    if (!progress) return;
    const updated: DiscoveryProgress = { ...progress, graphsInterpreted: progress.graphsInterpreted + 1, slopeDiscovered: sl || progress.slopeDiscovered, accelerationFound: acc || progress.accelerationFound, updatedAt: Date.now() };
    setProgress(updated); await saveProgress(updated);
  }, [progress, saveProgress]);

  const recordGeneticsCross = useCallback(async (dom: boolean, prob: boolean) => {
    if (!progress) return;
    const updated: DiscoveryProgress = { ...progress, crossesRun: progress.crossesRun + 1, dominanceUnderstood: dom || progress.dominanceUnderstood, probabilityConnectionMade: prob || progress.probabilityConnectionMade, updatedAt: Date.now() };
    setProgress(updated); await saveProgress(updated);
  }, [progress, saveProgress]);

  const recordTectonics = useCallback(async (boundaryId: string) => {
    if (!progress) return;
    const u = { ...progress, tectonicsInteractions: progress.tectonicsInteractions + 1, boundaryTypesFound: progress.boundaryTypesFound.includes(boundaryId) ? progress.boundaryTypesFound : [...progress.boundaryTypesFound, boundaryId], updatedAt: Date.now() } as DiscoveryProgress;
    setProgress(u); await saveProgress(u);
    if (u.boundaryTypesFound.length >= 4) await updateMastery('plate-tectonics', 'understand');
  }, [progress, saveProgress, updateMastery]);

  const recordLiteraryAnalysis = useCallback(async (textId: string, deviceId: string) => {
    if (!progress) return;
    const u = { ...progress, literaryTextsAnalysed: progress.literaryTextsAnalysed.includes(textId) ? progress.literaryTextsAnalysed : [...progress.literaryTextsAnalysed, textId], devicesIdentified: progress.devicesIdentified.includes(deviceId) ? progress.devicesIdentified : [...progress.devicesIdentified, deviceId], updatedAt: Date.now() } as DiscoveryProgress;
    setProgress(u); await saveProgress(u); await updateMastery('literary-analysis', 'aware');
  }, [progress, saveProgress, updateMastery]);

  const recordEconomicSim = useCallback(async (eventId?: string) => {
    if (!progress) return;
    const u = { ...progress, economicSimsRun: progress.economicSimsRun + 1, eventsApplied: eventId && !progress.eventsApplied.includes(eventId) ? [...progress.eventsApplied, eventId] : progress.eventsApplied, updatedAt: Date.now() } as DiscoveryProgress;
    setProgress(u); await saveProgress(u); await updateMastery('economic-simulation', 'aware');
  }, [progress, saveProgress, updateMastery]);

  const recordElementExplored = useCallback(async (symbol: string) => {
    if (!progress) return;
    const u = { ...progress, elementsExplored: progress.elementsExplored.includes(symbol) ? progress.elementsExplored : [...progress.elementsExplored, symbol], updatedAt: Date.now() } as DiscoveryProgress;
    setProgress(u); await saveProgress(u); await updateMastery('periodic-table', 'aware');
  }, [progress, saveProgress, updateMastery]);

  const recordProbabilityExperiment = useCallback(async (expId: string, paradox?: boolean) => {
    if (!progress) return;
    const u = { ...progress, experimentsRun: progress.experimentsRun + 1, paradoxesDiscovered: paradox && !progress.paradoxesDiscovered.includes(expId) ? [...progress.paradoxesDiscovered, expId] : progress.paradoxesDiscovered, updatedAt: Date.now() } as DiscoveryProgress;
    setProgress(u); await saveProgress(u); await updateMastery('probability-sandbox', 'aware');
  }, [progress, saveProgress, updateMastery]);

  const recordCarbonFlow = useCallback(async (flowId: string, humanImpact?: boolean) => {
    if (!progress) return;
    const u = { ...progress, carbonFlowsTracked: progress.carbonFlowsTracked.includes(flowId) ? progress.carbonFlowsTracked : [...progress.carbonFlowsTracked, flowId], humanImpactUnderstood: progress.humanImpactUnderstood || !!humanImpact, updatedAt: Date.now() } as DiscoveryProgress;
    setProgress(u); await saveProgress(u); await updateMastery('carbon-cycle', 'aware');
  }, [progress, saveProgress, updateMastery]);

  const recordNumberConversion = useCallback(async (sysId: string, binary?: boolean) => {
    if (!progress) return;
    const u = { ...progress, numberSystemsConverted: progress.numberSystemsConverted.includes(sysId) ? progress.numberSystemsConverted : [...progress.numberSystemsConverted, sysId], binaryUnderstood: progress.binaryUnderstood || !!binary, updatedAt: Date.now() } as DiscoveryProgress;
    setProgress(u); await saveProgress(u); await updateMastery('number-systems', 'aware');
  }, [progress, saveProgress, updateMastery]);

  const recordFermiAttempt = useCallback(async (_probId: string, accuracy: number) => {
    if (!progress) return;
    const u = { ...progress, fermiProblemsAttempted: progress.fermiProblemsAttempted + 1, fermiAccuracyScore: Math.round((progress.fermiAccuracyScore * progress.fermiProblemsAttempted + accuracy) / (progress.fermiProblemsAttempted + 1)), updatedAt: Date.now() } as DiscoveryProgress;
    setProgress(u); await saveProgress(u);
    if (u.fermiProblemsAttempted >= 2) await updateMastery('fermi-estimation', 'understand');
  }, [progress, saveProgress, updateMastery]);

  return { progress, loading, getMastery, updateMastery, recordRabbitHole, recordUnsolvedQuestion: async () => {}, recordAlgebraSolved, recordCellPlacement, recordReactionBalanced, recordProofCompleted, recordSpeedGraph, recordGeneticsCross, recordTectonics, recordLiteraryAnalysis, recordEconomicSim, recordElementExplored, recordProbabilityExperiment, recordCarbonFlow, recordNumberConversion, recordFermiAttempt };
}
