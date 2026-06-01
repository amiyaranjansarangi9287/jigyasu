import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { db } from '../db/schema';
import { LearningService } from '../services/LearningService';
import { useCanvasResize } from '../shared/hooks/useCanvasResize';

// Physics collision math (extracted from CollisionSim.tsx for pure testing)
function calculateElasticCollision(m1: number, m2: number, v1: number, v2: number) {
  const v1f = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
  const v2f = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);
  return { v1f, v2f };
}

function calculateInelasticCollision(m1: number, m2: number, v1: number, v2: number) {
  const vf = (m1 * v1 + m2 * v2) / (m1 + m2);
  return { v1f: vf, v2f: vf };
}

function calculateMomentum(m: number, v: number): number {
  return m * v;
}

function calculateKineticEnergy(m: number, v: number): number {
  return 0.5 * m * v ** 2;
}

function calculateTotalMomentum(m1: number, v1: number, m2: number, v2: number): number {
  return m1 * v1 + m2 * v2;
}

function calculateTotalKE(m1: number, v1: number, m2: number, v2: number): number {
  return 0.5 * m1 * v1 ** 2 + 0.5 * m2 * v2 ** 2;
}

beforeEach(async () => {
  // Clear all tables before each test
  await db.sessions.clear();
  await db.events.clear();
  await db.conceptProgress.clear();
  await db.achievements.clear();
  await db.lumoTriggers.clear();
  await db.wonderGarden.clear();
});

describe('Dexie CRUD Operations', () => {
  describe('Sessions', () => {
    it('should create and read a session', async () => {
      const session = {
        id: 'test-session-1',
        ageGroup: 'lab' as const,
        startedAt: Date.now(),
        language: 'en' as const,
        deviceType: 'desktop' as const,
        connectionType: 'wifi' as const,
        modulesVisited: [],
        eventsCount: 0,
        wonderMoments: 0,
      };
      await db.sessions.add(session);
      const found = await db.sessions.get('test-session-1');
      expect(found).toBeDefined();
      expect(found?.id).toBe('test-session-1');
      expect(found?.ageGroup).toBe('lab');
    });

    it('should update a session', async () => {
      const session = {
        id: 'test-session-2',
        ageGroup: 'tiny' as const,
        startedAt: Date.now(),
        language: 'hi' as const,
        deviceType: 'mobile' as const,
        connectionType: '4g' as const,
        modulesVisited: ['tap-world'],
        eventsCount: 5,
        wonderMoments: 1,
      };
      await db.sessions.add(session);
      await db.sessions.update('test-session-2', { endedAt: Date.now(), eventsCount: 10 });
      const updated = await db.sessions.get('test-session-2');
      expect(updated?.endedAt).toBeDefined();
      expect(updated?.eventsCount).toBe(10);
    });

    it('should delete a session', async () => {
      await db.sessions.add({
        id: 'test-session-3',
        ageGroup: 'early' as const,
        startedAt: Date.now(),
        language: 'en' as const,
        deviceType: 'tablet' as const,
        connectionType: 'wifi' as const,
        modulesVisited: [],
        eventsCount: 0,
        wonderMoments: 0,
      });
      await db.sessions.delete('test-session-3');
      const found = await db.sessions.get('test-session-3');
      expect(found).toBeUndefined();
    });

    it('should query sessions by index', async () => {
      await db.sessions.bulkAdd([
        { id: 's1', ageGroup: 'lab', startedAt: 1000, language: 'en', deviceType: 'desktop', connectionType: 'wifi', modulesVisited: [], eventsCount: 0, wonderMoments: 0 },
        { id: 's2', ageGroup: 'academy', startedAt: 2000, language: 'hi', deviceType: 'mobile', connectionType: '4g', modulesVisited: [], eventsCount: 0, wonderMoments: 0 },
      ]);
      const all = await db.sessions.toArray();
      expect(all.length).toBe(2);
    });
  });

  describe('Events', () => {
    it('should create and read an event', async () => {
      const event = {
        id: 'evt-1',
        sessionId: 'session-1',
        ageGroup: 'lab' as const,
        eventType: 'module_opened' as const,
        moduleId: 'gravity',
        payload: { duration: 30 },
        timestamp: Date.now(),
        language: 'en' as const,
        deviceType: 'desktop' as const,
        connectionType: 'wifi' as const,
      };
      await db.events.add(event);
      const found = await db.events.get('evt-1');
      expect(found).toBeDefined();
      expect(found?.eventType).toBe('module_opened');
      expect(found?.moduleId).toBe('gravity');
    });

    it('should query events by sessionId', async () => {
      await db.events.bulkAdd([
        { id: 'e1', sessionId: 's1', ageGroup: 'lab', eventType: 'correct_answer', moduleId: 'm1', payload: {}, timestamp: 1000, language: 'en', deviceType: 'desktop', connectionType: 'wifi' },
        { id: 'e2', sessionId: 's1', ageGroup: 'lab', eventType: 'wrong_answer', moduleId: 'm1', payload: {}, timestamp: 2000, language: 'en', deviceType: 'desktop', connectionType: 'wifi' },
        { id: 'e3', sessionId: 's2', ageGroup: 'lab', eventType: 'hint_requested', moduleId: 'm2', payload: {}, timestamp: 3000, language: 'en', deviceType: 'desktop', connectionType: 'wifi' },
      ]);
      const sessionEvents = await db.events.where('sessionId').equals('s1').toArray();
      expect(sessionEvents.length).toBe(2);
    });

    it('should query events by eventType', async () => {
      await db.events.bulkAdd([
        { id: 'e1', sessionId: 's1', ageGroup: 'lab', eventType: 'correct_answer', moduleId: 'm1', payload: {}, timestamp: 1000, language: 'en', deviceType: 'desktop', connectionType: 'wifi' },
        { id: 'e2', sessionId: 's2', ageGroup: 'lab', eventType: 'correct_answer', moduleId: 'm2', payload: {}, timestamp: 2000, language: 'en', deviceType: 'desktop', connectionType: 'wifi' },
        { id: 'e3', sessionId: 's3', ageGroup: 'lab', eventType: 'wrong_answer', moduleId: 'm3', payload: {}, timestamp: 3000, language: 'en', deviceType: 'desktop', connectionType: 'wifi' },
      ]);
      const correctAnswers = await db.events.where('eventType').equals('correct_answer').toArray();
      expect(correctAnswers.length).toBe(2);
    });

    it('should delete events', async () => {
      await db.events.add({
        id: 'e1',
        sessionId: 's1',
        ageGroup: 'lab',
        eventType: 'module_opened',
        moduleId: 'm1',
        payload: {},
        timestamp: Date.now(),
        language: 'en',
        deviceType: 'desktop',
        connectionType: 'wifi',
      });
      await db.events.delete('e1');
      const found = await db.events.get('e1');
      expect(found).toBeUndefined();
    });
  });

  describe('ConceptProgress', () => {
    it('should create and read concept progress', async () => {
      const progress = {
        conceptId: 'gravity',
        ageGroup: 'lab' as const,
        status: 'in_progress' as const,
        attemptsCount: 3,
        hintsUsed: 1,
        wrongAnswers: 2,
        timeSpentSeconds: 120,
        lumoInteractions: 0,
      };
      await db.conceptProgress.add(progress);
      const found = await db.conceptProgress.get('gravity');
      expect(found).toBeDefined();
      expect(found?.status).toBe('in_progress');
      expect(found?.attemptsCount).toBe(3);
    });

    it('should update concept progress', async () => {
      await db.conceptProgress.add({
        conceptId: 'photosynthesis',
        ageGroup: 'lab',
        status: 'in_progress',
        attemptsCount: 1,
        hintsUsed: 0,
        wrongAnswers: 0,
        timeSpentSeconds: 30,
        lumoInteractions: 0,
      });
      await db.conceptProgress.update('photosynthesis', {
        status: 'completed',
        attemptsCount: 5,
        timeSpentSeconds: 300,
      });
      const updated = await db.conceptProgress.get('photosynthesis');
      expect(updated?.status).toBe('completed');
      expect(updated?.attemptsCount).toBe(5);
    });

    it('should query progress by status', async () => {
      await db.conceptProgress.bulkAdd([
        { conceptId: 'c1', ageGroup: 'lab', status: 'completed', attemptsCount: 1, hintsUsed: 0, wrongAnswers: 0, timeSpentSeconds: 60, lumoInteractions: 0 },
        { conceptId: 'c2', ageGroup: 'lab', status: 'in_progress', attemptsCount: 2, hintsUsed: 1, wrongAnswers: 1, timeSpentSeconds: 30, lumoInteractions: 0 },
        { conceptId: 'c3', ageGroup: 'lab', status: 'completed', attemptsCount: 3, hintsUsed: 0, wrongAnswers: 0, timeSpentSeconds: 90, lumoInteractions: 0 },
      ]);
      const completed = await db.conceptProgress.where('status').equals('completed').toArray();
      expect(completed.length).toBe(2);
    });
  });

  describe('Achievements', () => {
    it('should create and read an achievement', async () => {
      const achievement = {
        id: 'ach-1',
        achievementType: 'first_module',
        unlockedAt: Date.now(),
        moduleId: 'gravity',
      };
      await db.achievements.add(achievement);
      const found = await db.achievements.get('ach-1');
      expect(found).toBeDefined();
      expect(found?.achievementType).toBe('first_module');
    });

    it('should list all achievements', async () => {
      await db.achievements.bulkAdd([
        { id: 'a1', achievementType: 'first_module', unlockedAt: 1000, moduleId: 'm1' },
        { id: 'a2', achievementType: 'streak_5', unlockedAt: 2000 },
        { id: 'a3', achievementType: 'master', unlockedAt: 3000, conceptId: 'c1' },
      ]);
      const all = await db.achievements.toArray();
      expect(all.length).toBe(3);
    });
  });

  describe('WonderGarden', () => {
    it('should create and read a wonder garden item', async () => {
      const item = {
        id: 'wg-1',
        childId: 'anonymous',
        itemType: 'flower',
        itemName: 'Rose',
        unlockedAt: Date.now(),
        ageGroup: 'lab' as const,
        moduleId: 'photosynthesis',
      };
      await db.wonderGarden.add(item);
      const found = await db.wonderGarden.get('wg-1');
      expect(found).toBeDefined();
      expect(found?.itemType).toBe('flower');
    });
  });
});

describe('Physics Collision Math', () => {
  describe('Elastic Collisions', () => {
    it('should conserve momentum', () => {
      const m1 = 2, m2 = 3, v1 = 5, v2 = -2;
      const pBefore = calculateTotalMomentum(m1, v1, m2, v2);
      const { v1f, v2f } = calculateElasticCollision(m1, m2, v1, v2);
      const pAfter = calculateTotalMomentum(m1, v1f, m2, v2f);
      expect(pAfter).toBeCloseTo(pBefore, 10);
    });

    it('should conserve kinetic energy', () => {
      const m1 = 2, m2 = 3, v1 = 5, v2 = -2;
      const keBefore = calculateTotalKE(m1, v1, m2, v2);
      const { v1f, v2f } = calculateElasticCollision(m1, m2, v1, v2);
      const keAfter = calculateTotalKE(m1, v1f, m2, v2f);
      expect(keAfter).toBeCloseTo(keBefore, 10);
    });

    it('should handle equal masses (velocity swap)', () => {
      const { v1f, v2f } = calculateElasticCollision(1, 1, 10, 0);
      expect(v1f).toBeCloseTo(0, 10);
      expect(v2f).toBeCloseTo(10, 10);
    });

    it('should handle stationary target', () => {
      const m1 = 1, m2 = 2, v1 = 6, v2 = 0;
      const { v1f, v2f } = calculateElasticCollision(m1, m2, v1, v2);
      expect(v1f).toBeCloseTo(-2, 10);
      expect(v2f).toBeCloseTo(4, 10);
    });

    it('should handle heavy object hitting light object', () => {
      const m1 = 10, m2 = 1, v1 = 5, v2 = 0;
      const { v1f, v2f } = calculateElasticCollision(m1, m2, v1, v2);
      expect(v1f).toBeGreaterThan(4); // Heavy object barely slows
      expect(v2f).toBeGreaterThan(8); // Light object flies fast
    });
  });

  describe('Inelastic Collisions', () => {
    it('should conserve momentum', () => {
      const m1 = 2, m2 = 3, v1 = 5, v2 = -2;
      const pBefore = calculateTotalMomentum(m1, v1, m2, v2);
      const { v1f, v2f } = calculateInelasticCollision(m1, m2, v1, v2);
      const pAfter = calculateTotalMomentum(m1, v1f, m2, v2f);
      expect(pAfter).toBeCloseTo(pBefore, 10);
    });

    it('should lose kinetic energy', () => {
      const m1 = 2, m2 = 3, v1 = 5, v2 = -2;
      const keBefore = calculateTotalKE(m1, v1, m2, v2);
      const { v1f, v2f } = calculateInelasticCollision(m1, m2, v1, v2);
      const keAfter = calculateTotalKE(m1, v1f, m2, v2f);
      expect(keAfter).toBeLessThan(keBefore);
    });

    it('should result in same final velocity for both objects', () => {
      const { v1f, v2f } = calculateInelasticCollision(2, 3, 5, -2);
      expect(v1f).toBeCloseTo(v2f, 10);
    });

    it('should handle equal masses sticking together', () => {
      const { v1f, v2f } = calculateInelasticCollision(1, 1, 10, -10);
      expect(v1f).toBeCloseTo(0, 10);
      expect(v2f).toBeCloseTo(0, 10);
    });
  });

  describe('Momentum and Energy Calculations', () => {
    it('should calculate momentum correctly', () => {
      expect(calculateMomentum(5, 3)).toBe(15);
      expect(calculateMomentum(2, -4)).toBe(-8);
      expect(calculateMomentum(0, 100)).toBe(0);
    });

    it('should calculate kinetic energy correctly', () => {
      expect(calculateKineticEnergy(2, 3)).toBe(9);
      expect(calculateKineticEnergy(1, 0)).toBe(0);
      expect(calculateKineticEnergy(4, 5)).toBe(50);
    });

    it('should handle zero mass', () => {
      expect(calculateMomentum(0, 10)).toBe(0);
      expect(calculateKineticEnergy(0, 10)).toBe(0);
    });
  });
});

describe('LearningService', () => {
  describe('trackEvent', () => {
    it('should track an event with all metadata', async () => {
      await LearningService.trackEvent(
        'session-1',
        'lab',
        'en',
        'module_opened',
        'gravity',
        { duration: 30 }
      );
      const events = await db.events.toArray();
      expect(events.length).toBe(1);
      expect(events[0].sessionId).toBe('session-1');
      expect(events[0].moduleId).toBe('gravity');
      expect(events[0].eventType).toBe('module_opened');
      expect(events[0].payload).toEqual({ duration: 30 });
      expect(events[0].language).toBe('en');
    });

    it('should generate unique IDs for each event', async () => {
      await LearningService.trackEvent('s1', 'lab', 'en', 'correct_answer', 'm1');
      await LearningService.trackEvent('s1', 'lab', 'en', 'wrong_answer', 'm1');
      const events = await db.events.toArray();
      expect(events[0].id).not.toBe(events[1].id);
    });

    it('should use current timestamp', async () => {
      const before = Date.now();
      await LearningService.trackEvent('s1', 'lab', 'en', 'session_started', 'home');
      const events = await db.events.toArray();
      expect(events[0].timestamp).toBeGreaterThanOrEqual(before);
    });
  });

  describe('updateProgress', () => {
    it('should create new progress if not exists', async () => {
      await LearningService.updateProgress('gravity', 'lab', {
        attemptsCount: 3,
        hintsUsed: 1,
      });
      const progress = await db.conceptProgress.get('gravity');
      expect(progress).toBeDefined();
      expect(progress?.status).toBe('in_progress');
      expect(progress?.attemptsCount).toBe(3);
      expect(progress?.hintsUsed).toBe(1);
    });

    it('should update existing progress', async () => {
      await LearningService.updateProgress('photosynthesis', 'lab', {
        attemptsCount: 1,
        status: 'in_progress',
      });
      await LearningService.updateProgress('photosynthesis', 'lab', {
        status: 'completed',
        attemptsCount: 5,
      });
      const progress = await db.conceptProgress.get('photosynthesis');
      expect(progress?.status).toBe('completed');
      expect(progress?.attemptsCount).toBe(5);
    });

    it('should preserve existing fields when updating', async () => {
      await LearningService.updateProgress('atoms', 'lab', {
        attemptsCount: 3,
        hintsUsed: 2,
        wrongAnswers: 1,
      });
      await LearningService.updateProgress('atoms', 'lab', {
        status: 'completed',
      });
      const progress = await db.conceptProgress.get('atoms');
      expect(progress?.attemptsCount).toBe(3);
      expect(progress?.hintsUsed).toBe(2);
      expect(progress?.wrongAnswers).toBe(1);
      expect(progress?.status).toBe('completed');
    });
  });

  describe('getProgress', () => {
    it('should return undefined for non-existent concept', async () => {
      const progress = await LearningService.getProgress('nonexistent');
      expect(progress).toBeUndefined();
    });

    it('should return progress for existing concept', async () => {
      await LearningService.updateProgress('gravity', 'lab', { status: 'in_progress' });
      const progress = await LearningService.getProgress('gravity');
      expect(progress).toBeDefined();
      expect(progress?.conceptId).toBe('gravity');
    });
  });

  describe('getAllProgress', () => {
    it('should return empty array when no progress', async () => {
      const all = await LearningService.getAllProgress();
      expect(all).toEqual([]);
    });

    it('should return all progress entries', async () => {
      await LearningService.updateProgress('gravity', 'lab', { status: 'completed' });
      await LearningService.updateProgress('photosynthesis', 'lab', { status: 'in_progress' });
      await LearningService.updateProgress('atoms', 'lab', { status: 'mastered' });
      const all = await LearningService.getAllProgress();
      expect(all.length).toBe(3);
    });
  });

  describe('clearAllProgress', () => {
    it('should clear all data', async () => {
      await LearningService.updateProgress('gravity', 'lab', { status: 'completed' });
      await LearningService.trackEvent('s1', 'lab', 'en', 'module_opened', 'gravity');
      await db.achievements.add({ id: 'a1', achievementType: 'test', unlockedAt: Date.now() });

      await LearningService.clearAllProgress();

      expect(await db.conceptProgress.toArray()).toEqual([]);
      expect(await db.events.toArray()).toEqual([]);
      expect(await db.achievements.toArray()).toEqual([]);
    });
  });
});

describe('Canvas Resize Hook', () => {
  it('should export useCanvasResize function', () => {
    expect(typeof useCanvasResize).toBe('function');
  });

  it('should be a valid React hook', () => {
    // Verify it's a function that can be called (actual hook testing requires render)
    expect(useCanvasResize).toBeDefined();
    expect(useCanvasResize.length).toBe(2); // Should accept 2 parameters
  });
});
