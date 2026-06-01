// src/worlds/discovery/hooks/usePeacockSage.ts
import { useState, useCallback, useRef } from 'react';
import { useLearnerStore } from '@/store';
import type { PeacockSageEmotion } from '../types/discovery.types';

export function usePeacockSage() {
  const { language } = useLearnerStore();
  const [visible, setVisible] = useState(false);
  const [emotion, setEmotion] = useState<PeacockSageEmotion>('idle');
  const [message, setMessage] = useState('');
  const lastShownRef = useRef<number>(0);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const COOLDOWN_MS = 30000;

  const peacockName = 'Peacock';
  const canShow = useCallback(() => Date.now() - lastShownRef.current > COOLDOWN_MS, []);

  const show = useCallback((msg: string, peacockEmotion: PeacockSageEmotion = 'questioning') => {
    if (!canShow()) return;
    setMessage(msg); setEmotion(peacockEmotion); setVisible(true); lastShownRef.current = Date.now();
    if (window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(msg); u.lang = language ?? 'en'; u.pitch = 0.85; u.rate = 0.80; u.volume = 0.65; window.speechSynthesis.speak(u); } catch (_) {}
    }
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    dismissTimerRef.current = setTimeout(() => { setVisible(false); setEmotion('idle'); }, 15000);
  }, [canShow, language]);

  return {
    peacockVisible: visible,
    peacockEmotion: emotion,
    peacockMessage: message,
    peacockName,
    show,
    dismiss: () => setVisible(false),
    afterWrongAttempts: (c: number) => { if (c >= 3) show("What is the one variable you have not changed yet?"); },
    afterPause: () => show("What do you know for certain right now?", 'thinking'),
    afterDiscovery: () => show("You reasoned your way to that. Real scientists work exactly like this.", 'celebrating'),
    crossSubjectBridge: (m?: string) => show(m || "Did you notice this connects to something else?"),
    exceptionalPerformance: () => show("You approached that with the rigour of a mathematician.", 'celebrating')
  };
}

export { usePeacockSage as useLumoSage };
