import { useCallback, useRef, useState, useEffect } from 'react';

const STORAGE_KEY = 'toybox-sound-enabled';

// Simple audio synthesis for satisfying sounds
function createAudioContext() {
  return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
}

export function useSoundEffects() {
  const [enabled, setEnabledState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === null ? true : stored === 'true';
    } catch {
      return true;
    }
  });

  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(enabled));
    } catch {
      // ignore
    }
  }, [enabled]);

  const getContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = createAudioContext();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) => {
    if (!enabled) return;
    try {
      const ctx = getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch {
      // Audio not supported
    }
  }, [enabled, getContext]);

  const playCheck = useCallback(() => {
    playTone(880, 0.1, 'sine', 0.2);
    setTimeout(() => playTone(1100, 0.15, 'sine', 0.2), 80);
  }, [playTone]);

  const playUncheck = useCallback(() => {
    playTone(600, 0.1, 'sine', 0.15);
  }, [playTone]);

  const playSuccess = useCallback(() => {
    playTone(523, 0.1, 'sine', 0.2); // C
    setTimeout(() => playTone(659, 0.1, 'sine', 0.2), 100); // E
    setTimeout(() => playTone(784, 0.15, 'sine', 0.2), 200); // G
    setTimeout(() => playTone(1047, 0.3, 'sine', 0.25), 300); // High C
  }, [playTone]);

  const playAchievement = useCallback(() => {
    // Fanfare!
    playTone(523, 0.12, 'triangle', 0.3);
    setTimeout(() => playTone(659, 0.12, 'triangle', 0.3), 120);
    setTimeout(() => playTone(784, 0.12, 'triangle', 0.3), 240);
    setTimeout(() => playTone(1047, 0.25, 'triangle', 0.35), 400);
    setTimeout(() => playTone(784, 0.12, 'triangle', 0.3), 550);
    setTimeout(() => playTone(1047, 0.4, 'triangle', 0.35), 670);
  }, [playTone]);

  const playClick = useCallback(() => {
    playTone(800, 0.05, 'square', 0.08);
  }, [playTone]);

  const playError = useCallback(() => {
    playTone(200, 0.15, 'sawtooth', 0.15);
    setTimeout(() => playTone(180, 0.2, 'sawtooth', 0.12), 150);
  }, [playTone]);

  const setEnabled = useCallback((value: boolean) => {
    setEnabledState(value);
    if (value) {
      // Play a quick sound to confirm
      setTimeout(() => playTone(660, 0.1, 'sine', 0.15), 50);
    }
  }, [playTone]);

  const toggleEnabled = useCallback(() => {
    setEnabled(!enabled);
  }, [enabled, setEnabled]);

  return {
    enabled,
    setEnabled,
    toggleEnabled,
    playCheck,
    playUncheck,
    playSuccess,
    playAchievement,
    playClick,
    playError,
  };
}
