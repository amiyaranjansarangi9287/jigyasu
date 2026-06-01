// Shared sound effect engine using Web Audio API — no external assets needed
let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function play(freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.2) {
  try {
    const c = getCtx();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(vol, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    o.connect(g);
    g.connect(c.destination);
    o.start();
    o.stop(c.currentTime + dur);
  } catch {}
}

export function playCorrect() {
  play(523.25, 0.12, 'sine', 0.18);
  setTimeout(() => play(659.25, 0.12, 'sine', 0.18), 80);
  setTimeout(() => play(783.99, 0.18, 'sine', 0.18), 160);
}

export function playWrong() {
  play(200, 0.25, 'sawtooth', 0.1);
  setTimeout(() => play(180, 0.3, 'sawtooth', 0.1), 120);
}

export function playClick() {
  play(800, 0.06, 'sine', 0.08);
}

export function playCelebrate() {
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((n, i) => setTimeout(() => play(n, 0.2, 'sine', 0.15), i * 100));
}

export function playTick() {
  play(1200, 0.03, 'square', 0.04);
}

export function playLevelUp() {
  [440, 554.37, 659.25, 880].forEach((n, i) => setTimeout(() => play(n, 0.15 + i * 0.05, 'triangle', 0.12), i * 120));
}

let soundEnabled = true;
export function isSoundEnabled() { return soundEnabled; }
export function toggleSound() { soundEnabled = !soundEnabled; return soundEnabled; }

// Wrapped versions that check enabled state
export const sfx = {
  correct: () => { if (soundEnabled) playCorrect(); },
  wrong: () => { if (soundEnabled) playWrong(); },
  click: () => { if (soundEnabled) playClick(); },
  celebrate: () => { if (soundEnabled) playCelebrate(); },
  tick: () => { if (soundEnabled) playTick(); },
  levelUp: () => { if (soundEnabled) playLevelUp(); },
};
