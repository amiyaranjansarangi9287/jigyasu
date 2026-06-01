// src/services/SessionService.ts
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import type { Session, AgeGroup, Language, DeviceType, ConnectionType } from '../types/shared';

function detectDeviceType(): DeviceType {
  const w = window.innerWidth;
  return w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop';
}

function detectConnectionType(): ConnectionType {
  if (!navigator.onLine) return 'offline';
  const nav = navigator as Navigator & { connection?: { effectiveType?: string } };
  const t = nav.connection?.effectiveType;
  if (t === '2g') return '2g';
  if (t === '3g') return '3g';
  return '4g';
}

export const SessionService = {
  async startSession(ageGroup: AgeGroup, language: Language): Promise<Session> {
    const session: Session = {
      id: uuidv4(),
      ageGroup,
      startedAt: Date.now(),
      language,
      deviceType: detectDeviceType(),
      connectionType: detectConnectionType(),
      modulesVisited: [],
      eventsCount: 0,
      wonderMoments: 0,
    };
    await db.sessions.add(session);
    return session;
  },

  async endSession(sessionId: string): Promise<void> {
    await db.sessions.update(sessionId, { endedAt: Date.now() });
  },

  async getRecentSessions(limit = 10): Promise<Session[]> {
    return db.sessions
      .orderBy('startedAt')
      .reverse()
      .limit(limit)
      .toArray();
  },

  async cleanupOldSessions(daysOld = 30): Promise<void> {
    const cutoff = Date.now() - daysOld * 24 * 60 * 60 * 1000;
    await db.sessions.where('startedAt').below(cutoff).delete();
  },
};
