// src/db/schema.ts
// Anonymous IndexedDB schema — no user identity, just local progress

import Dexie, { type Table } from 'dexie';
import type {
  Session,
  ConceptProgress,
  Achievement,
  LumoTrigger,
  WonderGardenItem,
} from '../types/shared';
import type { LearningEvent } from '../types/events';

export interface PendingTelemetryEvent {
  id: string;
  event: LearningEvent;
  createdAt: number;
  attempts: number;
}

export class LearnOSDatabase extends Dexie {
  sessions!: Table<Session>;
  events!: Table<LearningEvent>;
  conceptProgress!: Table<ConceptProgress>;
  achievements!: Table<Achievement>;
  lumoTriggers!: Table<LumoTrigger>;
  wonderGarden!: Table<WonderGardenItem>;
  pendingTelemetry!: Table<PendingTelemetryEvent>;

  constructor() {
    super('LearnOSDB');

    // Version 1: Original schema (families/children) — removed during anonymous pivot
    this.version(1).stores({
      families: 'id',
      children: 'id, familyId, ageGroup',
      sessions: 'id, startedAt',
      events: 'id, sessionId, eventType, timestamp',
      conceptProgress: 'conceptId, status',
      achievements: 'id, achievementType, unlockedAt',
      lumoTriggers: '++id, type, triggeredAt',
      wonderGarden: 'id, unlockedAt',
    });

    // Version 2: Anonymous pivot — removed families/children tables
    this.version(2).stores({
      sessions: 'id, startedAt',
      events: 'id, sessionId, eventType, timestamp',
      conceptProgress: 'conceptId, status',
      achievements: 'id, achievementType, unlockedAt',
      lumoTriggers: '++id, type, triggeredAt',
      wonderGarden: 'id, unlockedAt',
    }).upgrade(async (tx) => {
      // Clear orphaned data from removed tables
      await tx.table('families').clear();
      await tx.table('children').clear();
    });

    // Version 3: Add module-level progress tracking + pending telemetry queue
    this.version(3).stores({
      sessions: 'id, startedAt',
      events: 'id, sessionId, eventType, timestamp, moduleId',
      conceptProgress: 'conceptId, status, lastAccessedAt',
      achievements: 'id, achievementType, unlockedAt',
      lumoTriggers: '++id, type, triggeredAt',
      wonderGarden: 'id, unlockedAt',
      pendingTelemetry: 'id, createdAt, attempts',
    }).upgrade(async (tx) => {
      // Migrate events to include moduleId index
      const events = await tx.table('events').toArray();
      for (const evt of events) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!evt.moduleId && (evt as any).conceptId) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await tx.table('events').update(evt.id, { moduleId: (evt as any).conceptId });
        }
      }
    });
  }
}

export const db = new LearnOSDatabase();
