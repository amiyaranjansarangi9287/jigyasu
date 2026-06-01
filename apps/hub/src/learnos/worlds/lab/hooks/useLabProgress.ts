// src/worlds/lab/hooks/useLabProgress.ts
import { useState, useCallback, useEffect } from 'react';
import { db } from '@/db';
import type { LabProgress, LabModule, CertificationLevel } from '../types/lab.types';

const PROGRESS_KEY = 'lab-world-progress';

const DEFAULT_PROGRESS: LabProgress = {
  circuitsCompleted: 0, seriesDiscovered: false, parallelDiscovered: false,
  recipesSolved: 0, highestScalingFactor: 1, ecosystemsBuilt: 0, cascadeObserved: false,
  experimentsDone: 0, frictionDiscovered: false, fEqualsMADiscovered: false,
  predictionsCorrect: 0, predictionsTotal: 0, accuracyBadge: false,
  eventsPlaced: 0, timelineCompleted: false,
  certifications: {
    'circuit-builder': null, 'fraction-kitchen': null, 'ecosystem-sandbox': null,
    'force-lab': null, 'weather-station': null, 'timeline-explorer': null,
    'code-story': null, 'multiplication-lab': null, 'buoyancy-lab': null,
    'lever-explorer': null, 'statistics-playground': null, 'human-body': null,
    'panchabhutas': null,
    'states-of-matter': null,
    'gravity': null,
    'water-cycle': null,
    'photosynthesis': null,
    'digestive-system': null,
    'solar-system': null,
    'blood-circulation': null,
    'cell-explorer': null,
    'newtons-laws': null,
    'magnets': null,
    'electricity': null,
    'light-shadows': null,
    'sound-waves': null,
    'float-sink': null,
    'plant-growth': null,
    'day-night': null,
    'moon-phases': null,
    'atoms': null,
    'simple-machines': null,
    'shapes': null,
    'number-line': null,
    'fractions': null,
    'multiplication': null,
    'pi': null,
    'pythagorean': null,
    'senses': null,
    'habitats': null,
    'food-chain': null,
  },
  codeStoriesCompleted: 0, ifThenDiscovered: false, loopsDiscovered: false,
  multiplicationArraysDone: 0, patternsDiscovered: [],
  buoyancyObjectsTested: [], densityConceptGrasped: false,
  leverChallengesCompleted: 0, mechanicalAdvantageFound: false,
  statsDatasets: [], meanMedianModeMastered: false,
  bodySystemsExplored: [], allSystemsExplored: false,
  crossConceptsUnlocked: [],
  crossConceptsFound: 0, lumoInteractions: 0, hintsUsed: 0, wrongAnswersBeforeCorrect: 0,
  totalSessions: 0, totalMinutes: 0, lastSessionAt: 0, updatedAt: 0,
};

export function useLabProgress() {
  const [progress, setProgress] = useState<LabProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await db.conceptProgress.get('lab-world-progress');
        if (stored?.payload) setProgress(stored.payload as LabProgress);
        else setProgress({ ...DEFAULT_PROGRESS });
      } catch { setProgress({ ...DEFAULT_PROGRESS }); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const saveProgress = useCallback(async (updated: LabProgress) => {
    try {
      await db.conceptProgress.put({
        childId: PROGRESS_KEY, conceptId: 'lab-world-progress', ageGroup: 'lab',
        status: 'in_progress', attemptsCount: updated.totalSessions, hintsUsed: updated.hintsUsed,
        wrongAnswers: updated.wrongAnswersBeforeCorrect, timeSpentSeconds: Math.floor(updated.totalMinutes * 60),
        lumoInteractions: updated.lumoInteractions, payload: updated,
      } as any);
    } catch (err) { console.warn('[LabWorld] Progress save failed:', err); }
  }, []);

  const updateCertification = useCallback(async (module: LabModule, level: CertificationLevel) => {
    if (!progress) return;
    const current = progress.certifications[module];
    const levelOrder = { explorer: 1, scientist: 2, expert: 3 };
    if (current && levelOrder[current] >= levelOrder[level]) return;
    const updated: LabProgress = { ...progress, certifications: { ...progress.certifications, [module]: level }, updatedAt: Date.now() };
    setProgress(updated); await saveProgress(updated);
  }, [progress, saveProgress]);

  const recordCircuitComplete = useCallback(async (isSeries: boolean, isParallel: boolean) => {
    if (!progress) return;
    const updated: LabProgress = { ...progress, circuitsCompleted: progress.circuitsCompleted + 1, seriesDiscovered: progress.seriesDiscovered || isSeries, parallelDiscovered: progress.parallelDiscovered || isParallel, updatedAt: Date.now() };
    setProgress(updated); await saveProgress(updated);
  }, [progress, saveProgress]);

  const recordRecipeSolved = useCallback(async (factor: number) => {
    if (!progress) return;
    const updated: LabProgress = { ...progress, recipesSolved: progress.recipesSolved + 1, highestScalingFactor: Math.max(progress.highestScalingFactor, factor), updatedAt: Date.now() };
    setProgress(updated); await saveProgress(updated);
  }, [progress, saveProgress]);

  const recordEcosystemEvent = useCallback(async (cascadeObserved: boolean) => {
    if (!progress) return;
    const updated: LabProgress = { ...progress, ecosystemsBuilt: progress.ecosystemsBuilt + 1, cascadeObserved: progress.cascadeObserved || cascadeObserved, updatedAt: Date.now() };
    setProgress(updated); await saveProgress(updated);
  }, [progress, saveProgress]);

  const recordForceExperiment = useCallback(async (frictionFound: boolean, fEqMAFound: boolean) => {
    if (!progress) return;
    const updated: LabProgress = { ...progress, experimentsDone: progress.experimentsDone + 1, frictionDiscovered: progress.frictionDiscovered || frictionFound, fEqualsMADiscovered: progress.fEqualsMADiscovered || fEqMAFound, updatedAt: Date.now() };
    setProgress(updated); await saveProgress(updated);
  }, [progress, saveProgress]);

  const recordWeatherPrediction = useCallback(async (correct: boolean) => {
    if (!progress) return;
    const nc = progress.predictionsCorrect + (correct ? 1 : 0), nt = progress.predictionsTotal + 1;
    const updated: LabProgress = { ...progress, predictionsCorrect: nc, predictionsTotal: nt, accuracyBadge: nt >= 5 && nc / nt >= 0.7, updatedAt: Date.now() };
    setProgress(updated); await saveProgress(updated);
  }, [progress, saveProgress]);

  const recordTimelineEvent = useCallback(async (completed: boolean) => {
    if (!progress) return;
    const updated: LabProgress = { ...progress, eventsPlaced: progress.eventsPlaced + 1, timelineCompleted: progress.timelineCompleted || completed, updatedAt: Date.now() };
    setProgress(updated); await saveProgress(updated);
  }, [progress, saveProgress]);

  const recordCodeStory = useCallback(async (completed: boolean, ifThenUsed: boolean, loopUsed: boolean) => {
    if (!progress) return;
    const u: LabProgress = { ...progress, codeStoriesCompleted: completed ? progress.codeStoriesCompleted + 1 : progress.codeStoriesCompleted, ifThenDiscovered: progress.ifThenDiscovered || ifThenUsed, loopsDiscovered: progress.loopsDiscovered || loopUsed, updatedAt: Date.now() };
    setProgress(u); await saveProgress(u);
  }, [progress, saveProgress]);

  const recordMultiplication = useCallback(async (pattern?: string) => {
    if (!progress) return;
    const u: LabProgress = { ...progress, multiplicationArraysDone: progress.multiplicationArraysDone + 1, patternsDiscovered: pattern && !progress.patternsDiscovered.includes(pattern) ? [...progress.patternsDiscovered, pattern] : progress.patternsDiscovered, updatedAt: Date.now() };
    setProgress(u); await saveProgress(u);
  }, [progress, saveProgress]);

  const recordBuoyancyTest = useCallback(async (objectId: string, densityUnderstood: boolean) => {
    if (!progress) return;
    const u: LabProgress = { ...progress, buoyancyObjectsTested: progress.buoyancyObjectsTested.includes(objectId) ? progress.buoyancyObjectsTested : [...progress.buoyancyObjectsTested, objectId], densityConceptGrasped: progress.densityConceptGrasped || densityUnderstood, updatedAt: Date.now() };
    setProgress(u); await saveProgress(u);
  }, [progress, saveProgress]);

  const recordLeverChallenge = useCallback(async (mechanicalAdv: boolean) => {
    if (!progress) return;
    const u: LabProgress = { ...progress, leverChallengesCompleted: progress.leverChallengesCompleted + 1, mechanicalAdvantageFound: progress.mechanicalAdvantageFound || mechanicalAdv, updatedAt: Date.now() };
    setProgress(u); await saveProgress(u);
  }, [progress, saveProgress]);

  const recordStatsDataset = useCallback(async (datasetId: string, mastered: boolean) => {
    if (!progress) return;
    const u: LabProgress = { ...progress, statsDatasets: progress.statsDatasets.includes(datasetId) ? progress.statsDatasets : [...progress.statsDatasets, datasetId], meanMedianModeMastered: progress.meanMedianModeMastered || mastered, updatedAt: Date.now() };
    setProgress(u); await saveProgress(u);
  }, [progress, saveProgress]);

  const recordBodySystem = useCallback(async (systemId: string) => {
    if (!progress) return;
    const explored = progress.bodySystemsExplored.includes(systemId) ? progress.bodySystemsExplored : [...progress.bodySystemsExplored, systemId];
    const u: LabProgress = { ...progress, bodySystemsExplored: explored, allSystemsExplored: explored.length >= 4, updatedAt: Date.now() };
    setProgress(u); await saveProgress(u);
  }, [progress, saveProgress]);

  const recordCrossConceptUnlocked = useCallback(async (bridgeId: string) => {
    if (!progress || progress.crossConceptsUnlocked.includes(bridgeId)) return;
    const u: LabProgress = { ...progress, crossConceptsFound: progress.crossConceptsFound + 1, crossConceptsUnlocked: [...progress.crossConceptsUnlocked, bridgeId], updatedAt: Date.now() };
    setProgress(u); await saveProgress(u);
  }, [progress, saveProgress]);

  const recordStatesOfMatter = useCallback(async (stateExplored: 'solid' | 'liquid' | 'gas') => {
    if (!progress) return;
    const explored = new Set(progress.bodySystemsExplored);
    explored.add(stateExplored);
    const allExplored = explored.has('solid') && explored.has('liquid') && explored.has('gas');
    const u: LabProgress = { ...progress, bodySystemsExplored: [...explored], allSystemsExplored: allExplored || progress.allSystemsExplored, updatedAt: Date.now() };
    setProgress(u); await saveProgress(u);
  }, [progress, saveProgress]);

  return { progress, loading, updateCertification, recordCircuitComplete, recordRecipeSolved, recordEcosystemEvent, recordForceExperiment, recordWeatherPrediction, recordTimelineEvent, recordCodeStory, recordMultiplication, recordBuoyancyTest, recordLeverChallenge, recordStatsDataset, recordBodySystem, recordCrossConceptUnlocked, recordStatesOfMatter, getCertification: (m: LabModule) => progress?.certifications[m] ?? null, saveProgress };
}
