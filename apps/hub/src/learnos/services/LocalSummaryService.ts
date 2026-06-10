/**
 * LocalSummaryService — BIP27-C02: Teacher/Parent Local Summary
 *
 * Generates a privacy-safe, offline-capable progress summary for teachers and
 * parents. No child PII (name, ID, session ID, raw events) leaves this service.
 *
 * Privacy guarantees:
 *   - Input: ConceptProgress[] from local IndexedDB — contains only conceptId,
 *     ageGroup (bucketed), status, and aggregate counters (no child name/ID).
 *   - Output summary: contains only aggregated statistics and concept IDs.
 *   - Sakha enrichment (optional): only sends conceptIds to AIH, never session
 *     or learner state. Disabled by default; requires bridge to be enabled.
 *   - Policy: no raw child data is sent to AIH unless policy permits it.
 *
 * BIP27-C02 acceptance criteria:
 *   - Parent/teacher view is useful offline (always returns a local summary).
 *   - No raw child data is sent to AIH unless explicitly enabled by policy.
 */

import type { ConceptProgress } from '../types/shared';
import {
  requestConceptMapCached,
  getTeachingBridgeStatus,
  type TeachingBridgeConceptMap,
  type TeachingBridgeClientOptions,
  type TeachingBridgeFeatureStatus,
} from './TeachingBridge';

// ---------------------------------------------------------------------------
// Output types
// ---------------------------------------------------------------------------

export interface ConceptEnrichment {
  conceptId: string;
  relatedConcepts: string[];
  prerequisites: string[];
  traceId?: string;
}

export interface LocalProgressSummary {
  /** Aggregate counts — no PII. */
  totalConcepts: number;
  masteredCount: number;
  inProgressCount: number;
  notStartedCount: number;
  /** Concept IDs only (not learner names or IDs). */
  masteredConcepts: string[];    // status: 'mastered' | 'completed'
  inProgressConcepts: string[];  // status: 'in_progress'
  notStartedConcepts: string[];  // status: 'not_started'
  /** Aggregate performance counters. */
  totalHintsUsed: number;
  totalTimeSpentSeconds: number;
  totalAttempts: number;
  /** Sakha enrichment (optional, null when bridge disabled or offline). */
  sakhaEnrichment: ConceptEnrichment[] | null;
  sakhaStatus: TeachingBridgeFeatureStatus;
  /** True when produced without any network call. */
  offlineMode: boolean;
}

export interface LocalSummaryOptions {
  /** If true, attempt to enrich struggling concepts via Sakha. Default: false. */
  enrichWithSakha?: boolean;
  /** Bridge options (endpoint, enabled). Defaults to env-configured bridge. */
  bridgeOptions?: TeachingBridgeClientOptions;
  /** Max number of struggling concepts to enrich. Default: 5. */
  maxEnrichmentConcepts?: number;
  /** Subject hint for enrichment queries. */
  subject?: string;
  /** Language for enrichment queries. Default: 'en'. */
  language?: string;
}

// ---------------------------------------------------------------------------
// Core summary builder
// ---------------------------------------------------------------------------

/**
 * Build a privacy-safe local progress summary from ConceptProgress records.
 * Works fully offline — no network calls, no PII in output.
 */
export function buildLocalSummary(progress: ConceptProgress[]): Omit<LocalProgressSummary, 'sakhaEnrichment' | 'sakhaStatus'> {
  const mastered: string[] = [];
  const inProgress: string[] = [];
  const notStarted: string[] = [];
  let totalHints = 0;
  let totalTime = 0;
  let totalAttempts = 0;

  for (const p of progress) {
    totalHints += p.hintsUsed ?? 0;
    totalTime += p.timeSpentSeconds ?? 0;
    totalAttempts += p.attemptsCount ?? 0;

    if (p.status === 'mastered' || p.status === 'completed') {
      mastered.push(p.conceptId);
    } else if (p.status === 'not_started') {
      notStarted.push(p.conceptId);
    } else {
      inProgress.push(p.conceptId);
    }
  }

  return {
    totalConcepts: progress.length,
    masteredCount: mastered.length,
    inProgressCount: inProgress.length,
    notStartedCount: notStarted.length,
    masteredConcepts: mastered,
    inProgressConcepts: inProgress,
    notStartedConcepts: notStarted,
    totalHintsUsed: totalHints,
    totalTimeSpentSeconds: totalTime,
    totalAttempts,
    offlineMode: true,
  };
}

/**
 * Enrich struggling concepts with Sakha concept maps.
 * Only sends conceptId (string) to AIH — no learner state, no PII.
 */
async function enrichConcepts(
  conceptIds: string[],
  options: LocalSummaryOptions
): Promise<ConceptEnrichment[]> {
  const enrichments: ConceptEnrichment[] = [];
  const limit = options.maxEnrichmentConcepts ?? 5;
  const toEnrich = conceptIds.slice(0, limit);

  for (const conceptId of toEnrich) {
    try {
      const map: TeachingBridgeConceptMap = await requestConceptMapCached(
        {
          query: conceptId,
          subject: options.subject,
          language: options.language ?? 'en',
        },
        options.bridgeOptions
      );
      if (!map.fallback) {
        enrichments.push({
          conceptId,
          relatedConcepts: map.conceptIds,
          prerequisites: map.prerequisites,
          traceId: map.traceId,
        });
      }
    } catch {
      // Single enrichment failure should not break the full summary
    }
  }

  return enrichments;
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

/**
 * Generate a full local progress summary, optionally enriched with Sakha.
 *
 * Privacy contract:
 *   - `progress` input must come from local IndexedDB (LearningService.getAllProgress()).
 *   - Only conceptIds are sent to Sakha — never session, learner, or event data.
 *   - Enrichment is skipped when bridge is disabled or unavailable.
 */
export async function generateLocalSummary(
  progress: ConceptProgress[],
  options: LocalSummaryOptions = {}
): Promise<LocalProgressSummary> {
  const base = buildLocalSummary(progress);

  const bridgeStatus = getTeachingBridgeStatus(options.bridgeOptions ?? {});

  if (!options.enrichWithSakha || bridgeStatus !== 'enabled') {
    return {
      ...base,
      sakhaEnrichment: null,
      sakhaStatus: bridgeStatus,
      offlineMode: bridgeStatus !== 'enabled',
    };
  }

  const conceptsToEnrich = [
    ...base.notStartedConcepts,
    ...base.inProgressConcepts,
  ];

  let enrichment: ConceptEnrichment[] | null = null;
  let offlineMode = false;

  try {
    enrichment = await enrichConcepts(conceptsToEnrich, options);
    offlineMode = enrichment.length === 0;
  } catch {
    offlineMode = true;
  }

  return {
    ...base,
    sakhaEnrichment: enrichment,
    sakhaStatus: bridgeStatus,
    offlineMode,
  };
}
