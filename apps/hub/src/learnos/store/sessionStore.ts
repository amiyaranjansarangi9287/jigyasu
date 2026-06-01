// src/store/sessionStore.ts
// Anonymous session tracking — no auth, no PII

import { create } from 'zustand';

interface SessionState {
  sessionId: string;
  sessionStartedAt: number;
  lastActiveAt: number;

  recordActivity: () => void;
  resetSession: () => void;
}

function generateSessionId(): string {
  return crypto.randomUUID();
}

function getStoredSessionId(): string {
  try {
    return localStorage.getItem('learnos-session-id') ?? generateSessionId();
  } catch {
    return generateSessionId();
  }
}

function persistSessionId(id: string) {
  try {
    localStorage.setItem('learnos-session-id', id);
  } catch {
    // Ignore
  }
}

export const useSessionStore = create<SessionState>((set) => ({
  sessionId: getStoredSessionId(),
  sessionStartedAt: Date.now(),
  lastActiveAt: Date.now(),

  recordActivity: () => {
    set({ lastActiveAt: Date.now() });
  },

  resetSession: () => {
    const newId = generateSessionId();
    persistSessionId(newId);
    set({
      sessionId: newId,
      sessionStartedAt: Date.now(),
      lastActiveAt: Date.now(),
    });
  },
}));
