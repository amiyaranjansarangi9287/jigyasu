// src/worlds/academy/hooks/usePeacockAncient.ts
import { useState, useCallback, useRef } from 'react';
import { useLearnerStore } from '@/store';
import type { PeacockAncientEmotion } from '../types/academy.types';

const MSGS = {
  discovery: ["Every answer in science opens three new questions.", "You reasoned independently to a conclusion that took humanity centuries."],
  struggle: ["What assumptions are we making when we ask this?", "The best scientists are defined by the quality of their questions."],
  cross: ["The same mathematics appears here and in other fields.", "Science subjects are projections of one reality."],
  exceptional: ["You approached that with the rigour of a research mathematician."],
};

function pick(t: keyof typeof MSGS) { const m = MSGS[t]; return m[Math.floor(Math.random() * m.length)]; }

export function usePeacockAncient() {
  const { language } = useLearnerStore();
  const [visible, setVisible] = useState(false);
  const [emotion, setEmotion] = useState<PeacockAncientEmotion>('absent');
  const [message, setMessage] = useState('');
  const lastRef = useRef(0);

  const peacockName = 'Peacock';
  const canShow = useCallback(() => Date.now() - lastRef.current > 45000, []);

  const show = useCallback((msg: string, emo: PeacockAncientEmotion = 'question') => {
    if (!canShow()) return;
    setMessage(msg); setEmotion(emo); setVisible(true); lastRef.current = Date.now();
    if (window.speechSynthesis) { try { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(msg); u.lang = language ?? 'en'; u.pitch = 0.75; u.rate = 0.75; u.volume = 0.50; window.speechSynthesis.speak(u); } catch (_) {} }
    setTimeout(() => { setVisible(false); setEmotion('absent'); }, 12000);
  }, [canShow, language]);

  return {
    peacockVisible: visible, peacockEmotion: emotion, peacockMessage: message, peacockName,
    show, dismiss: () => setVisible(false),
    afterDeepStruggle: (c: number) => { if (c >= 5) show(pick('struggle'), 'question'); },
    afterProfoundDiscovery: () => show(pick('discovery'), 'profound'),
    crossConceptConnection: (m?: string) => show(m ?? pick('cross'), 'profound'),
    exceptionalPerformance: () => show(pick('exceptional'), 'profound'),
  };
}

export { usePeacockAncient as useLumoAncient };
