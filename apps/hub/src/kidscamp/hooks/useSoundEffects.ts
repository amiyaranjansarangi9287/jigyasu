// CampCraft - Sound Effects Hook (Web Audio API)

import { useState, useCallback, useRef, useEffect } from 'react';

const STORAGE_KEY = 'campcraft-sound';

export function useSoundEffects() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored !== 'false';
  });

  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(enabled));
  }, [enabled]);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) => {
    if (!enabled) return;
    
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      
      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback failed:', e);
    }
  }, [enabled, getAudioContext]);

  const playCheck = useCallback(() => {
    playTone(600, 0.1, 'sine', 0.2);
    setTimeout(() => playTone(800, 0.15, 'sine', 0.2), 80);
  }, [playTone]);

  const playUncheck = useCallback(() => {
    playTone(400, 0.1, 'sine', 0.15);
  }, [playTone]);

  const playSuccess = useCallback(() => {
    playTone(523, 0.15, 'sine', 0.25); // C
    setTimeout(() => playTone(659, 0.15, 'sine', 0.25), 100); // E
    setTimeout(() => playTone(784, 0.2, 'sine', 0.25), 200); // G
    setTimeout(() => playTone(1047, 0.3, 'sine', 0.3), 300); // High C
  }, [playTone]);

  const playAchievement = useCallback(() => {
    const notes = [523, 659, 784, 1047, 784, 1047]; // Fanfare
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.2, 'triangle', 0.3), i * 120);
    });
  }, [playTone]);

  const playClick = useCallback(() => {
    playTone(500, 0.05, 'square', 0.1);
  }, [playTone]);

  const playError = useCallback(() => {
    playTone(200, 0.2, 'sawtooth', 0.15);
    setTimeout(() => playTone(180, 0.3, 'sawtooth', 0.15), 150);
  }, [playTone]);

  const toggle = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);

  return {
    enabled,
    setEnabled,
    toggle,
    playCheck,
    playUncheck,
    playSuccess,
    playAchievement,
    playClick,
    playError
  };
}
