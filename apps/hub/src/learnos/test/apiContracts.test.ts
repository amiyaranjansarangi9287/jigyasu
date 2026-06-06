// src/test/apiContracts.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import {
  stubAnalyticsBatch,
  stubAnalyticsSummary,
  stubSyncProgress,
  resetStubStore,
  getStubState,
} from '../services/api/stubs';
import type { LearningEvent } from '../types/events';

describe('API Contracts', () => {
  beforeEach(() => {
    resetStubStore();
  });

  describe('POST /api/analytics/batch', () => {
    it('should accept and process batch events', async () => {
      const events: LearningEvent[] = [
        {
          id: 'event-1',
          sessionId: 'session-1',
          ageGroup: 'lab',
          eventType: 'module_opened',
          moduleId: 'number-line',
          language: 'en',
          deviceType: 'desktop',
          connectionType: 'wifi',
          timestamp: Date.now(),
          payload: {},
        },
        {
          id: 'event-2',
          sessionId: 'session-1',
          ageGroup: 'lab',
          eventType: 'concept_completed',
          moduleId: 'number-line',
          language: 'en',
          deviceType: 'desktop',
          connectionType: 'wifi',
          timestamp: Date.now(),
          payload: { correct: true },
        },
      ];

      const response = await stubAnalyticsBatch({ events });

      expect(response.success).toBe(true);
      expect(response.received).toBe(2);
      expect(response.timestamp).toBeGreaterThan(0);
    });

    it('should handle empty batch', async () => {
      const response = await stubAnalyticsBatch({ events: [] });

      expect(response.success).toBe(true);
      expect(response.received).toBe(0);
    });

    it('should track unique sessions', async () => {
      const events: LearningEvent[] = [
        {
          id: 'e1',
          sessionId: 'session-1',
          ageGroup: 'lab',
          eventType: 'module_opened',
          moduleId: 'm1',
          language: 'en',
          deviceType: 'mobile',
          connectionType: 'wifi',
          timestamp: Date.now(),
          payload: {},
        },
        {
          id: 'e2',
          sessionId: 'session-2',
          ageGroup: 'biology',
          eventType: 'module_opened',
          moduleId: 'cell-map',
          language: 'hi',
          deviceType: 'tablet',
          connectionType: '4g',
          timestamp: Date.now(),
          payload: {},
        },
      ];

      await stubAnalyticsBatch({ events });
      const summary = await stubAnalyticsSummary();

      expect(summary.uniqueSessions).toBe(2);
    });

    it('should track module counts', async () => {
      const events: LearningEvent[] = [
        {
          id: 'e1',
          sessionId: 's1',
          ageGroup: 'lab',
          eventType: 'module_opened',
          moduleId: 'number-line',
          language: 'en',
          deviceType: 'desktop',
          connectionType: 'wifi',
          timestamp: Date.now(),
          payload: {},
        },
        {
          id: 'e2',
          sessionId: 's1',
          ageGroup: 'lab',
          eventType: 'module_opened',
          moduleId: 'number-line',
          language: 'en',
          deviceType: 'desktop',
          connectionType: 'wifi',
          timestamp: Date.now(),
          payload: {},
        },
        {
          id: 'e3',
          sessionId: 's1',
          ageGroup: 'lab',
          eventType: 'module_opened',
          moduleId: 'shapes',
          language: 'en',
          deviceType: 'desktop',
          connectionType: 'wifi',
          timestamp: Date.now(),
          payload: {},
        },
      ];

      await stubAnalyticsBatch({ events });
      const summary = await stubAnalyticsSummary();

      expect(summary.topModules[0].moduleId).toBe('number-line');
      expect(summary.topModules[0].count).toBe(2);
      expect(summary.topModules[1].moduleId).toBe('shapes');
      expect(summary.topModules[1].count).toBe(1);
    });

    it('should cap stored events to prevent memory issues', async () => {
      // Create 1100 events
      const events: LearningEvent[] = Array.from({ length: 1100 }, (_, i) => ({
        id: `e${i}`,
        sessionId: `s${i % 10}`,
        ageGroup: 'lab' as const,
        eventType: 'module_opened' as const,
        moduleId: `module-${i % 5}`,
        language: 'en' as const,
        deviceType: 'desktop' as const,
        connectionType: 'wifi' as const,
        timestamp: Date.now(),
        payload: {},
      }));

      await stubAnalyticsBatch({ events });
      const state = getStubState();

      // Should have capped to 500 events
      expect(state.eventCount).toBeLessThanOrEqual(500);
    });
  });

  describe('GET /api/analytics/summary', () => {
    it('should return empty summary when no events', async () => {
      const summary = await stubAnalyticsSummary();

      expect(summary.totalEvents).toBe(0);
      expect(summary.uniqueSessions).toBe(0);
      expect(summary.topModules).toEqual([]);
      expect(summary.dateRange.start).toBeGreaterThan(0);
      expect(summary.dateRange.end).toBeGreaterThan(0);
    });

    it('should return top 10 modules sorted by count', async () => {
      const events: LearningEvent[] = Array.from({ length: 25 }, (_, i) => ({
        id: `e${i}`,
        sessionId: `s${i % 5}`,
        ageGroup: 'lab' as const,
        eventType: 'module_opened' as const,
        moduleId: `module-${i % 15}`,
        language: 'en' as const,
        deviceType: 'desktop' as const,
        connectionType: 'wifi' as const,
        timestamp: Date.now(),
        payload: {},
      }));

      await stubAnalyticsBatch({ events });
      const summary = await stubAnalyticsSummary();

      expect(summary.topModules.length).toBeLessThanOrEqual(10);
      // Verify sorted order
      for (let i = 0; i < summary.topModules.length - 1; i++) {
        expect(summary.topModules[i].count).toBeGreaterThanOrEqual(
          summary.topModules[i + 1].count
        );
      }
    });
  });

  describe('POST /api/sync/progress', () => {
    it('should acknowledge progress sync', async () => {
      const progress = [
        { conceptId: 'fractions', status: 'completed', attemptsCount: 5, timeSpentSeconds: 300 },
        { conceptId: 'decimals', status: 'in_progress', attemptsCount: 2, timeSpentSeconds: 120 },
      ];

      const response = await stubSyncProgress({ progress });

      expect(response.success).toBe(true);
      expect(response.synced).toBe(2);
      expect(response.conflicts).toEqual([]);
    });

    it('should handle empty progress', async () => {
      const response = await stubSyncProgress({ progress: [] });

      expect(response.success).toBe(true);
      expect(response.synced).toBe(0);
    });

    it('should handle null progress', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await stubSyncProgress({ progress: null as any });

      expect(response.success).toBe(true);
      expect(response.synced).toBe(0);
    });
  });

  describe('Stub state management', () => {
    it('should reset store completely', async () => {
      const events: LearningEvent[] = [
        {
          id: 'e1',
          sessionId: 's1',
          ageGroup: 'lab',
          eventType: 'module_opened',
          moduleId: 'm1',
          language: 'en',
          deviceType: 'desktop',
          connectionType: 'wifi',
          timestamp: Date.now(),
          payload: {},
        },
      ];

      await stubAnalyticsBatch({ events });
      expect(getStubState().eventCount).toBe(1);

      resetStubStore();
      expect(getStubState().eventCount).toBe(0);
      expect(getStubState().sessionCount).toBe(0);
      expect(getStubState().moduleCount).toBe(0);
    });
  });
});
