// Lightweight sound effects using Web Audio API (no audio files needed!)

let audioCtx: AudioContext | null = null;
let isMuted = false;

function getCtx(): AudioContext | null {
  try {
    if (!audioCtx) audioCtx = new AudioContext();
    return audioCtx;
  } catch { return null; }
}

export function setMuted(m: boolean) { isMuted = m; }
export function getMuted() { return isMuted; }

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.12) {
  if (isMuted) return;
  const ctx = getCtx();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch { /* silent fail */ }
}

// === Game Sound Effects ===

export function playCorrect() {
  playTone(523, 0.1, 'sine', 0.1);
  setTimeout(() => playTone(659, 0.1, 'sine', 0.1), 80);
  setTimeout(() => playTone(784, 0.15, 'sine', 0.1), 160);
}

export function playWrong() {
  playTone(200, 0.15, 'square', 0.08);
  setTimeout(() => playTone(160, 0.2, 'square', 0.06), 120);
}

export function playClick() {
  playTone(800, 0.05, 'sine', 0.06);
}

export function playCollect() {
  playTone(880, 0.08, 'sine', 0.08);
  setTimeout(() => playTone(1100, 0.1, 'sine', 0.08), 60);
}

export function playHit() {
  playTone(150, 0.15, 'sawtooth', 0.1);
}

export function playLevelUp() {
  [523, 659, 784, 1047].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.15, 'sine', 0.1), i * 100);
  });
}

export function playMatch() {
  playTone(600, 0.08, 'sine', 0.08);
  setTimeout(() => playTone(800, 0.12, 'sine', 0.08), 80);
}

export function playGameOver() {
  [400, 350, 300, 250].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'sine', 0.1), i * 150);
  });
}

export function playVictory() {
  [523, 659, 784, 1047, 784, 1047].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.12, 'triangle', 0.1), i * 80);
  });
}

export function playPlace() {
  playTone(440, 0.08, 'sine', 0.06);
  setTimeout(() => playTone(660, 0.06, 'sine', 0.06), 50);
}

export function playBubble() {
  playTone(1200 + Math.random() * 400, 0.08, 'sine', 0.04);
}
