/**
 * Tests for BIP27-C01 (TeachingBridge cache) and BIP27-C02 (LocalSummaryService).
 */
import { describe, expect, it, beforeEach, vi } from 'vitest';
import {
  clearTeachingBridgeCache,
  requestHintCached,
  requestConceptMapCached,
  type TeachingBridgeHint,
  type TeachingBridgeConceptMap,
} from '../services/TeachingBridge';
import {
  buildLocalSummary,
  generateLocalSummary,
} from '../services/LocalSummaryService';
import type { ConceptProgress } from '../types/shared';

// ---------------------------------------------------------------------------
// BIP27-C01: TeachingBridge cache
// ---------------------------------------------------------------------------

const HINT_RESULT: TeachingBridgeHint = {
  status: 'enabled',
  prompt: 'Consider how planets curve spacetime.',
  traceId: 'trace-cache-1',
  fallback: false,
};

const CONCEPT_MAP_RESULT: TeachingBridgeConceptMap = {
  status: 'enabled',
  conceptIds: ['gravity', 'mass'],
  prerequisites: ['force'],
  traceId: 'trace-cache-2',
  fallback: false,
};

const GRAVITY_REQUEST = {
  query: 'Explain gravity',
  subject: 'Physics',
  moduleId: 'gravity-101',
  learnerLevel: 'intermediate' as const,
  language: 'en',
};

describe('TeachingBridge cache (BIP27-C01)', () => {
  beforeEach(() => {
    clearTeachingBridgeCache();
  });

  it('returns hint on first call and caches it (fetcher called once)', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        schema: 'bip/teaching_artifact/v1',
        answer: HINT_RESULT.prompt,
        trace_id: HINT_RESULT.traceId,
      }),
    });

    const first = await requestHintCached(GRAVITY_REQUEST, {
      enabled: true,
      endpoint: 'http://localhost:8000/chat',
      fetcher,
    });
    const second = await requestHintCached(GRAVITY_REQUEST, {
      enabled: true,
      endpoint: 'http://localhost:8000/chat',
      fetcher,
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(first.prompt).toBe(second.prompt);
    expect(second.fallback).toBe(false);
  });

  it('does not cache fallback responses (fetcher called each time)', async () => {
    const fetcher = vi.fn();

    await requestHintCached(GRAVITY_REQUEST, { enabled: false, fetcher });
    await requestHintCached(GRAVITY_REQUEST, { enabled: false, fetcher });

    expect(fetcher).not.toHaveBeenCalled();
  });

  it('different queries use different cache keys', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        schema: 'bip/teaching_artifact/v1',
        answer: 'answer',
        trace_id: 'trace-1',
      }),
    });

    await requestHintCached(
      { ...GRAVITY_REQUEST, query: 'Explain photosynthesis' },
      { enabled: true, endpoint: 'http://localhost:8000/chat', fetcher }
    );
    await requestHintCached(
      { ...GRAVITY_REQUEST, query: 'Explain gravity' },
      { enabled: true, endpoint: 'http://localhost:8000/chat', fetcher }
    );

    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('clearTeachingBridgeCache forces re-fetch', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        schema: 'bip/teaching_artifact/v1',
        answer: 'answer',
        trace_id: 'trace-1',
      }),
    });

    await requestHintCached(GRAVITY_REQUEST, {
      enabled: true,
      endpoint: 'http://localhost:8000/chat',
      fetcher,
    });
    clearTeachingBridgeCache();
    await requestHintCached(GRAVITY_REQUEST, {
      enabled: true,
      endpoint: 'http://localhost:8000/chat',
      fetcher,
    });

    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('concept map cache works independently of hint cache', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        schema: 'bip/teaching_artifact/v1',
        concept_ids: CONCEPT_MAP_RESULT.conceptIds,
        prerequisites: CONCEPT_MAP_RESULT.prerequisites,
        trace_id: CONCEPT_MAP_RESULT.traceId,
      }),
    });

    const cm1 = await requestConceptMapCached(GRAVITY_REQUEST, {
      enabled: true,
      endpoint: 'http://localhost:8000/chat',
      fetcher,
    });
    const cm2 = await requestConceptMapCached(GRAVITY_REQUEST, {
      enabled: true,
      endpoint: 'http://localhost:8000/chat',
      fetcher,
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(cm1.conceptIds).toEqual(cm2.conceptIds);
    expect(cm2.fallback).toBe(false);
  });

  it('cache key is case-insensitive for query', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        schema: 'bip/teaching_artifact/v1',
        answer: 'answer',
        trace_id: 'trace-1',
      }),
    });

    await requestHintCached(
      { ...GRAVITY_REQUEST, query: 'Explain Gravity' },
      { enabled: true, endpoint: 'http://localhost:8000/chat', fetcher }
    );
    await requestHintCached(
      { ...GRAVITY_REQUEST, query: 'explain gravity' },
      { enabled: true, endpoint: 'http://localhost:8000/chat', fetcher }
    );

    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// BIP27-C02: LocalSummaryService
// ---------------------------------------------------------------------------

function makeProgress(overrides: Partial<ConceptProgress> & { conceptId: string; status: ConceptProgress['status'] }): ConceptProgress {
  return {
    ageGroup: 'lab',
    attemptsCount: 0,
    hintsUsed: 0,
    wrongAnswers: 0,
    timeSpentSeconds: 0,
    lumoInteractions: 0,
    ...overrides,
  };
}

describe('buildLocalSummary (BIP27-C02)', () => {
  it('empty progress returns zero counts', () => {
    const summary = buildLocalSummary([]);
    expect(summary.totalConcepts).toBe(0);
    expect(summary.masteredCount).toBe(0);
    expect(summary.inProgressCount).toBe(0);
    expect(summary.notStartedCount).toBe(0);
    expect(summary.offlineMode).toBe(true);
  });

  it('mastered and completed go into masteredConcepts', () => {
    const progress = [
      makeProgress({ conceptId: 'gravity', status: 'mastered' }),
      makeProgress({ conceptId: 'motion', status: 'completed' }),
      makeProgress({ conceptId: 'force', status: 'in_progress' }),
    ];
    const s = buildLocalSummary(progress);
    expect(s.masteredCount).toBe(2);
    expect(s.masteredConcepts).toContain('gravity');
    expect(s.masteredConcepts).toContain('motion');
    expect(s.inProgressCount).toBe(1);
    expect(s.inProgressConcepts).toContain('force');
  });

  it('not_started goes into notStartedConcepts', () => {
    const progress = [
      makeProgress({ conceptId: 'photosynthesis', status: 'not_started' }),
    ];
    const s = buildLocalSummary(progress);
    expect(s.notStartedCount).toBe(1);
    expect(s.notStartedConcepts).toContain('photosynthesis');
  });

  it('aggregates counters correctly', () => {
    const progress = [
      makeProgress({ conceptId: 'a', status: 'mastered', hintsUsed: 3, timeSpentSeconds: 120, attemptsCount: 5 }),
      makeProgress({ conceptId: 'b', status: 'in_progress', hintsUsed: 1, timeSpentSeconds: 60, attemptsCount: 2 }),
    ];
    const s = buildLocalSummary(progress);
    expect(s.totalHintsUsed).toBe(4);
    expect(s.totalTimeSpentSeconds).toBe(180);
    expect(s.totalAttempts).toBe(7);
  });

  it('offlineMode is always true for buildLocalSummary', () => {
    const s = buildLocalSummary([makeProgress({ conceptId: 'x', status: 'mastered' })]);
    expect(s.offlineMode).toBe(true);
  });
});

describe('generateLocalSummary (BIP27-C02)', () => {
  beforeEach(() => {
    clearTeachingBridgeCache();
  });

  it('returns offline-only summary when enrichWithSakha is false', async () => {
    const progress = [
      makeProgress({ conceptId: 'gravity', status: 'mastered' }),
      makeProgress({ conceptId: 'force', status: 'in_progress' }),
    ];
    const summary = await generateLocalSummary(progress, { enrichWithSakha: false });
    expect(summary.sakhaEnrichment).toBeNull();
    expect(summary.offlineMode).toBe(true);
    expect(summary.masteredCount).toBe(1);
  });

  it('returns offline-only summary when bridge is disabled', async () => {
    const progress = [makeProgress({ conceptId: 'mass', status: 'not_started' })];
    const summary = await generateLocalSummary(progress, {
      enrichWithSakha: true,
      bridgeOptions: { enabled: false },
    });
    expect(summary.sakhaEnrichment).toBeNull();
    expect(summary.sakhaStatus).toBe('disabled');
    expect(summary.offlineMode).toBe(true);
  });

  it('enriches with Sakha when bridge is enabled', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        schema: 'bip/teaching_artifact/v1',
        concept_ids: ['related-a', 'related-b'],
        prerequisites: ['prereq-1'],
        trace_id: 'trace-enrich-1',
      }),
    });

    const progress = [
      makeProgress({ conceptId: 'force', status: 'in_progress' }),
    ];
    const summary = await generateLocalSummary(progress, {
      enrichWithSakha: true,
      bridgeOptions: {
        enabled: true,
        endpoint: 'http://localhost:8000/chat',
        fetcher,
      },
    });

    expect(summary.sakhaStatus).toBe('enabled');
    expect(summary.sakhaEnrichment).not.toBeNull();
    expect(summary.sakhaEnrichment!.length).toBe(1);
    expect(summary.sakhaEnrichment![0].conceptId).toBe('force');
    expect(summary.sakhaEnrichment![0].relatedConcepts).toContain('related-a');
    expect(summary.sakhaEnrichment![0].prerequisites).toContain('prereq-1');
  });

  it('no PII in Sakha enrichment request — only conceptId sent', async () => {
    const captured: RequestInit[] = [];
    const fetcher = vi.fn().mockImplementation((url: string, init: RequestInit) => {
      captured.push(init);
      return Promise.resolve({
        ok: true,
        json: async () => ({
          schema: 'bip/teaching_artifact/v1',
          concept_ids: [],
          prerequisites: [],
          trace_id: 'trace-pii-check',
        }),
      });
    });

    await generateLocalSummary(
      [makeProgress({ conceptId: 'gravity', status: 'in_progress' })],
      {
        enrichWithSakha: true,
        bridgeOptions: {
          enabled: true,
          endpoint: 'http://localhost:8000/chat',
          fetcher,
        },
      }
    );

    expect(captured.length).toBeGreaterThan(0);
    const body = JSON.parse(captured[0].body as string);
    // Must NOT contain any learner/child/session PII
    expect(body).not.toHaveProperty('learner_id');
    expect(body).not.toHaveProperty('child_id');
    expect(body).not.toHaveProperty('session_id');
    expect(body).not.toHaveProperty('age_group');
    // Must only contain safe fields
    expect(body).toHaveProperty('message');
    expect(body.message).toBe('gravity');
  });

  it('maxEnrichmentConcepts limits Sakha calls', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        schema: 'bip/teaching_artifact/v1',
        concept_ids: [],
        prerequisites: [],
        trace_id: 'trace-limit',
      }),
    });

    const progress = Array.from({ length: 10 }, (_, i) =>
      makeProgress({ conceptId: `concept-${i}`, status: 'not_started' })
    );

    await generateLocalSummary(progress, {
      enrichWithSakha: true,
      maxEnrichmentConcepts: 3,
      bridgeOptions: {
        enabled: true,
        endpoint: 'http://localhost:8000/chat',
        fetcher,
      },
    });

    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it('bridge unavailable returns offline summary without throwing', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('Network error'));

    const progress = [makeProgress({ conceptId: 'light', status: 'in_progress' })];
    const summary = await generateLocalSummary(progress, {
      enrichWithSakha: true,
      bridgeOptions: {
        enabled: true,
        endpoint: 'http://localhost:8000/chat',
        fetcher,
      },
    });

    // Should succeed with local data, not throw
    expect(summary.totalConcepts).toBe(1);
    expect(summary.inProgressConcepts).toContain('light');
  });
});
