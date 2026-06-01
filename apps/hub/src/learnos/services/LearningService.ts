// src/services/LearningService.ts
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import type { LearningEvent, LearningEventType } from '../types/events';
import type {
  AgeGroup,
  Language,
  DeviceType,
  ConnectionType,
  ConceptProgress,
} from '../types/shared';

function detectDeviceType(): DeviceType {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function detectConnectionType(): ConnectionType {
  const nav = navigator as Navigator & {
    connection?: { effectiveType?: string };
  };
  const conn = nav.connection?.effectiveType;
  if (!navigator.onLine) return 'offline';
  if (conn === '2g') return '2g';
  if (conn === '3g') return '3g';
  if (conn === '4g') return '4g';
  return 'wifi';
}

export const LearningService = {
  async trackEvent(
    sessionId: string,
    ageGroup: AgeGroup,
    language: Language,
    eventType: LearningEventType,
    moduleId: string,
    payload: Record<string, unknown> = {}
  ): Promise<void> {
    const event: LearningEvent = {
      id: uuidv4(),
      sessionId,
      ageGroup,
      eventType,
      moduleId,
      payload,
      timestamp: Date.now(),
      language,
      deviceType: detectDeviceType(),
      connectionType: detectConnectionType(),
    };
    await db.events.add(event);
  },

  async getProgress(
    conceptId: string
  ): Promise<ConceptProgress | undefined> {
    return db.conceptProgress.get(conceptId);
  },

  async updateProgress(
    conceptId: string,
    ageGroup: AgeGroup,
    updates: Partial<ConceptProgress>
  ): Promise<void> {
    const existing = await db.conceptProgress.get(conceptId);
    if (existing) {
      await db.conceptProgress.update(conceptId, updates);
    } else {
      await db.conceptProgress.add({
        conceptId,
        ageGroup,
        status: 'in_progress',
        attemptsCount: 0,
        hintsUsed: 0,
        wrongAnswers: 0,
        timeSpentSeconds: 0,
        lumoInteractions: 0,
        ...updates,
      });
    }
  },

  async getAllProgress(): Promise<ConceptProgress[]> {
    return db.conceptProgress.toArray();
  },

  async clearAllProgress(): Promise<void> {
    await db.conceptProgress.clear();
    await db.events.clear();
    await db.sessions.clear();
    await db.achievements.clear();
    await db.lumoTriggers.clear();
    await db.wonderGarden.clear();
  },
};
