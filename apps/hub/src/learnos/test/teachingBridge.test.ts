import { describe, expect, it, vi } from 'vitest';
import {
  getTeachingBridgeStatus,
  requestConceptMap,
  requestHint,
  requestNextActivity,
  type TeachingArtifact,
} from '../services/TeachingBridge';

const artifact: TeachingArtifact = {
  schema: 'bip/teaching_artifact/v1',
  trace_id: 'trace-1',
  answer: 'Gravity pulls objects toward each other.',
  subject: 'Physics',
  language: 'en',
  concept_ids: ['gravity', 'mass', 'orbit'],
  prerequisites: ['force', 'motion'],
  next_activity: {
    type: 'practice',
    prompt: 'Drop two safe objects and compare what you observe.',
  },
};

describe('TeachingBridge', () => {
  it('stays disabled by default and returns a local hint fallback', async () => {
    const fetcher = vi.fn();

    const hint = await requestHint(
      { query: 'Why do things fall?', subject: 'Physics' },
      { enabled: false, fetcher }
    );

    expect(hint.status).toBe('disabled');
    expect(hint.fallback).toBe(true);
    expect(hint.prompt).toContain('Try one small example');
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('reports unconfigured when enabled without an endpoint', async () => {
    const conceptMap = await requestConceptMap(
      { query: 'Explain gravity', subject: 'Physics' },
      { enabled: true }
    );

    expect(conceptMap.status).toBe('unconfigured');
    expect(conceptMap.fallback).toBe(true);
    expect(conceptMap.conceptIds).toEqual([]);
    expect(conceptMap.prerequisites).toEqual([]);
  });

  it('consumes next_activity.prompt as the request_hint result', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => artifact,
    });

    const hint = await requestHint(
      { query: 'Why do planets orbit?', moduleId: 'gravity-wells' },
      { enabled: true, endpoint: 'http://localhost:8000/chat', fetcher }
    );

    expect(hint.status).toBe('enabled');
    expect(hint.fallback).toBe(false);
    expect(hint.prompt).toBe('Drop two safe objects and compare what you observe.');
    expect(hint.traceId).toBe('trace-1');
  });

  it('maps concept_ids and prerequisites for request_concept_map', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => artifact,
    });

    const conceptMap = await requestConceptMap(
      { query: 'Show me the gravity map', subject: 'Physics' },
      { enabled: true, endpoint: 'http://localhost:8000/chat', fetcher }
    );

    expect(conceptMap.conceptIds).toEqual(['gravity', 'mass', 'orbit']);
    expect(conceptMap.prerequisites).toEqual(['force', 'motion']);
    expect(conceptMap.fallback).toBe(false);
  });

  it('returns the artifact next_activity for request_next_activity', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => artifact,
    });

    const next = await requestNextActivity(
      { query: 'What should I do next?', subject: 'Physics' },
      { enabled: true, endpoint: 'http://localhost:8000/chat', fetcher }
    );

    expect(next.status).toBe('enabled');
    expect(next.activity).toEqual({
      type: 'practice',
      prompt: 'Drop two safe objects and compare what you observe.',
    });
  });

  it('rejects unsupported teaching artifact schemas', async () => {
    const fetcher = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ schema: 'unknown' }),
    });

    await expect(
      requestHint(
        { query: 'Explain gravity' },
        { enabled: true, endpoint: 'http://localhost:8000/chat', fetcher }
      )
    ).rejects.toThrow('unsupported schema');
  });

  it('exposes feature status without making a network request', () => {
    expect(getTeachingBridgeStatus({ enabled: false })).toBe('disabled');
    expect(getTeachingBridgeStatus({ enabled: true })).toBe('unconfigured');
    expect(getTeachingBridgeStatus({ enabled: true, endpoint: 'http://localhost:8000/chat' })).toBe(
      'enabled'
    );
  });
});
