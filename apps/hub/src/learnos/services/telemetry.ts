// src/services/telemetry.ts
// Privacy-first telemetry — anonymous, no PII
// Uses IndexedDB for queue storage (avoids localStorage 5MB limit)

import { db } from '../db';
import type { LearningEvent } from '../types/events';
import type { PendingTelemetryEvent } from '../db/schema';

const MAX_QUEUE_SIZE = 100; // Cap at 100 events
const MAX_QUEUE_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_RETRY_ATTEMPTS = 3;
const FLUSH_INTERVAL_MS = 30_000; // 30 seconds

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

let flushTimer: ReturnType<typeof setInterval> | null = null;

function getConsent(): boolean {
  try {
    return localStorage.getItem('learnos-consent') === 'accepted';
  } catch {
    return false;
  }
}

/**
 * Add event to pending telemetry queue in IndexedDB
 */
async function enqueueEvent(event: LearningEvent): Promise<void> {
  try {
    // Clean up old events first
    await cleanupOldEvents();

    const pending: PendingTelemetryEvent = {
      id: event.id,
      event,
      createdAt: Date.now(),
      attempts: 0,
    };

    await db.pendingTelemetry.add(pending);

    // Enforce queue size limit
    const count = await db.pendingTelemetry.count();
    if (count > MAX_QUEUE_SIZE) {
      // Remove oldest events
      const oldest = await db.pendingTelemetry
        .orderBy('createdAt')
        .limit(count - MAX_QUEUE_SIZE)
        .toArray();

      await db.pendingTelemetry.bulkDelete(oldest.map(e => e.id));
    }
  } catch (err) {
    console.warn('[Telemetry] Failed to enqueue event:', err);
  }
}

/**
 * Clean up events older than MAX_QUEUE_AGE_MS
 */
async function cleanupOldEvents(): Promise<void> {
  try {
    const cutoff = Date.now() - MAX_QUEUE_AGE_MS;
    const oldEvents = await db.pendingTelemetry
      .where('createdAt')
      .below(cutoff)
      .toArray();

    if (oldEvents.length > 0) {
      await db.pendingTelemetry.bulkDelete(oldEvents.map(e => e.id));
    }
  } catch {
    // Ignore cleanup errors
  }
}

/**
 * Track a learning event
 */
export function trackEvent(event: Omit<LearningEvent, 'id' | 'timestamp'>) {
  if (!getConsent()) return;

  const telemetryEvent: LearningEvent = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    ...event,
  };

  enqueueEvent(telemetryEvent);

  if (navigator.onLine) {
    scheduleFlush();
  }
}

/**
 * Track a module view
 */
export function trackView(moduleId: string, ageGroup: string, language: string) {
  trackEvent({
    sessionId: localStorage.getItem('learnos-session-id') ?? 'anonymous',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ageGroup: ageGroup as any,
    eventType: 'module_opened',
    moduleId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    language: language as any,
    deviceType: detectDeviceType(),
    connectionType: detectConnectionType(),
    payload: {},
  });
}

/**
 * Track world entry
 */
export function trackWorldEntry(worldId: string) {
  trackEvent({
    sessionId: localStorage.getItem('learnos-session-id') ?? 'anonymous',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ageGroup: worldId as any,
    eventType: 'world_entered',
    moduleId: worldId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    language: (localStorage.getItem('learnos-language') ?? 'en') as any,
    deviceType: detectDeviceType(),
    connectionType: detectConnectionType(),
    payload: {},
  });
}

function detectDeviceType() {
  const w = window.innerWidth;
  return w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop';
}

function detectConnectionType() {
  if (!navigator.onLine) return 'offline';
  return 'wifi';
}

/**
 * Flush pending telemetry events to server
 */
async function flushQueue(): Promise<void> {
  try {
    const pending = await db.pendingTelemetry.toArray();
    if (pending.length === 0) return;

    // Filter out events that have exceeded retry attempts
    const retryable = pending.filter(e => e.attempts < MAX_RETRY_ATTEMPTS);
    if (retryable.length === 0) {
      // All events exceeded retries, clear them
      await db.pendingTelemetry.clear();
      return;
    }

    const events = retryable.map(e => e.event);

    const response = await fetch(`${API_BASE}/analytics/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events }),
    });

    if (response.ok) {
      // Remove successfully sent events
      await db.pendingTelemetry.bulkDelete(retryable.map(e => e.id));
    } else {
      // Increment retry attempts for failed events
      for (const event of retryable) {
        await db.pendingTelemetry.update(event.id, {
          attempts: event.attempts + 1,
        });
      }
    }
  } catch {
    // Offline or server error — keep queue
  }
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setInterval(() => {
    if (navigator.onLine && getConsent()) {
      flushQueue();
    }
  }, FLUSH_INTERVAL_MS);
}

scheduleFlush();
window.addEventListener('beforeunload', () => { flushQueue(); });
window.addEventListener('online', () => { flushQueue(); });

export const telemetry = {
  trackEvent,
  trackView,
  trackWorldEntry,
  flushQueue,
};
