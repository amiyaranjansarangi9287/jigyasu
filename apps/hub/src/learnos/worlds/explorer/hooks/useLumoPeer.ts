import { useState, useCallback, useRef } from 'react';
import { useLearnerStore } from '@/store';
import type { PeacockPeerEmotion } from '../types/explorer.types';

export function usePeacockPeer() {
  const { language } = useLearnerStore();
  const [visible, setVisible] = useState(false);
  const [emotion, setEmotion] = useState<PeacockPeerEmotion>('absent');
  const [message, setMessage] = useState('');
  const lastShownRef = useRef<number>(0);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const COOLDOWN_MS = 60000;
  const peacockName = 'Peacock';
  const peacockEnabled = true;

  const canShow = useCallback(() => {
    return Date.now() - lastShownRef.current > COOLDOWN_MS;
  }, []);

  const show = useCallback((msg: string, peacockEmotion: PeacockPeerEmotion = 'sharing') => {
    if (!canShow()) return;

    setMessage(msg);
    setEmotion(peacockEmotion);
    setVisible(true);
    lastShownRef.current = Date.now();

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(msg);
      utterance.lang = language ?? 'en';
      utterance.pitch = 1.0;
      utterance.rate = 0.85;
      utterance.volume = 0.55;
      window.speechSynthesis.speak(utterance);
    }

    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    dismissTimerRef.current = setTimeout(() => {
      setVisible(false);
      setEmotion('absent');
    }, 10000);
  }, [canShow, language]);

  const dismiss = useCallback(() => {
    window.speechSynthesis?.cancel();
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    setVisible(false);
    setEmotion('absent');
  }, []);

  const shareInsight = useCallback((conceptOpener: string) => {
    show(conceptOpener, 'sharing');
  }, [show]);

  const makeConnection = useCallback((connectionMsg: string) => {
    show(connectionMsg, 'connecting');
  }, [show]);

  const poseQuestion = useCallback((question: string) => {
    if (!canShow()) return;
    show(`Something to think about: ${question}`, 'questioning');
  }, [canShow, show]);

  return {
    peacockVisible: visible,
    peacockEmotion: emotion,
    peacockMessage: message,
    peacockName,
    peacockEnabled,
    dismiss,
    shareInsight,
    makeConnection,
    poseQuestion,
  };
}

export { usePeacockPeer as useLumoPeer };
