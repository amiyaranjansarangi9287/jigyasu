// src/services/sentry.ts
// Sentry error tracking integration

import type { Language, AgeGroup } from '../types/shared';

interface SentryEvent {
  message: string;
  error?: Error;
  tags?: Record<string, string>;
  context?: Record<string, unknown>;
  level?: 'error' | 'warning' | 'info';
}

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN ?? '';
const IS_PRODUCTION = import.meta.env.PROD;

let isInitialized = false;
let eventQueue: SentryEvent[] = [];
// Cached Sentry module reference — set once after dynamic import succeeds.
// Using a cache avoids require() (CommonJS) inside an ESM/Vite module.
let _sentry: typeof import('@sentry/browser') | null = null;

async function initSentry(): Promise<void> {
  if (isInitialized || !SENTRY_DSN) return;

  try {
    const Sentry = await import('@sentry/browser');
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: IS_PRODUCTION ? 'production' : 'development',
      tracesSampleRate: IS_PRODUCTION ? 0.1 : 1.0,
      replaysSessionSampleRate: 0,
      replaysOnErrorSampleRate: IS_PRODUCTION ? 0.5 : 0,
      beforeSend(event) {
        // Strip ALL PII — this is a children's platform.
        if (event.user) {
          delete event.user.email;
          delete event.user.ip_address;
          delete event.user.username;
        }
        return event;
      },
    });
    _sentry = Sentry;
    isInitialized = true;

    // Flush queued events that arrived before init completed.
    for (const evt of eventQueue) {
      captureEvent(evt);
    }
    eventQueue = [];
  } catch {
    // Sentry not installed — degrade gracefully, never crash the app.
    isInitialized = false;
  }
}

function captureEvent({ message, error, tags, context, level = 'error' }: SentryEvent): void {
  if (!isInitialized || !_sentry) {
    if (import.meta.env.DEV) console.error(`[Sentry] ${message}`, error);
    return;
  }

  try {
    _sentry.captureException(error ?? new Error(message), {
      level,
      tags,
      extra: context,
    });
  } catch {
    if (import.meta.env.DEV) console.error(`[Sentry] ${message}`, error);
  }
}

export function setUserData(userId: string, childId?: string, language?: Language, ageGroup?: AgeGroup) {
  if (!isInitialized || !_sentry) return;
  try {
    // Only send an opaque anonymous ID — never IP address, email, or real name.
    // This platform is used by children; DPDP Act and COPPA compliance requires minimal data.
    _sentry.setUser({ id: userId });
    if (childId) _sentry.setTag('childId', childId);
    if (language) _sentry.setTag('language', language);
    if (ageGroup) _sentry.setTag('ageGroup', ageGroup);
  } catch {
    // Ignore — Sentry errors must never affect the learning experience.
  }
}

export function clearUserData() {
  if (!isInitialized || !_sentry) return;
  try {
    _sentry.setUser(null);
  } catch {
    // Ignore
  }
}

export const SentryService = {
  init: initSentry,

  captureError(error: Error, context?: Record<string, unknown>) {
    const event: SentryEvent = {
      message: error.message,
      error,
      context,
      level: 'error',
    };

    if (isInitialized) {
      captureEvent(event);
    } else {
      eventQueue.push(event);
    }
  },

  captureMessage(message: string, level: 'error' | 'warning' | 'info' = 'error') {
    const event: SentryEvent = { message, level };

    if (isInitialized) {
      captureEvent(event);
    } else {
      eventQueue.push(event);
    }
  },

  captureException(error: Error, tags?: Record<string, string>) {
    const event: SentryEvent = {
      message: error.message,
      error,
      tags,
      level: 'error',
    };

    if (isInitialized) {
      captureEvent(event);
    } else {
      eventQueue.push(event);
    }
  },
};
