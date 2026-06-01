// src/worlds/lab/hooks/useJigyasuGuide.ts
import { useState, useCallback, useRef } from 'react';
import { useLearnerStore } from '@/store';
import type { JigyasuGuideEmotion, LabModule } from '../types/lab.types';

const GUIDE_MESSAGES = {
  after_mistake: ["What if you changed just one variable?", "Interesting result. What do you think caused that?"],
  stuck: ["What do you know for certain right now?", "Try breaking it into smaller parts."],
  after_discovery: ["You worked that out yourself. That is exactly how scientists think."],
  cross_concept: ["Does this connect to something you've learned before?"],
};

function getRandomMessage(type: keyof typeof GUIDE_MESSAGES): string {
  const messages = GUIDE_MESSAGES[type];
  return messages[Math.floor(Math.random() * messages.length)];
}

export function useJigyasuGuide(_currentModule: LabModule) {
  const { language } = useLearnerStore();
  const [visible, setVisible] = useState(false);
  const [emotion, setEmotion] = useState<JigyasuGuideEmotion>('idle');
  const [message, setMessage] = useState('');
  const lastShownRef = useRef<number>(0);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const COOLDOWN_MS = 30000;

  const guideName = 'Guide';
  const canShow = useCallback(() => Date.now() - lastShownRef.current > COOLDOWN_MS, []);

  const show = useCallback((msg: string, guideEmotion: JigyasuGuideEmotion = 'speaking') => {
    if (!canShow()) return;
    setMessage(msg); setEmotion('appearing'); setVisible(true); lastShownRef.current = Date.now();
    setTimeout(() => setEmotion(guideEmotion), 400);
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(msg);
      utterance.lang = language ?? 'en';
      utterance.pitch = 0.9; utterance.rate = 0.85; utterance.volume = 0.7;
      utterance.onend = () => setEmotion('curious');
      window.speechSynthesis.speak(utterance);
    }
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    dismissTimerRef.current = setTimeout(() => { setEmotion('departing'); setTimeout(() => setVisible(false), 600); }, 15000);
  }, [canShow, language]);

  const dismiss = useCallback(() => {
    window.speechSynthesis?.cancel();
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    setEmotion('departing'); setTimeout(() => { setVisible(false); setEmotion('idle'); }, 400);
  }, []);

  return { guideVisible: visible, guideEmotion: emotion, guideMessage: message, guideName, show, dismiss, showAfterMistake: () => show(getRandomMessage('after_mistake'), 'curious'), showAfterDiscovery: () => show(getRandomMessage('after_discovery'), 'celebrating'), showHint: () => show(getRandomMessage('stuck'), 'thinking') };
}

export { useJigyasuGuide as useLumoOwl };
