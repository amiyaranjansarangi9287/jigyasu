// src/worlds/tiny/companions/bunny.ts
// Bunny companion for Tap World — hops when happy

export const BUNNY = {
  emoji: '🐇',
  defaultPosition: { x: 0.1, y: 0.9 },
  size: 48,
  idleBounceFreq: 1.5,
  happyBounceHeight: 20,
  celebrationSpinSpeed: 4,
} as const;
