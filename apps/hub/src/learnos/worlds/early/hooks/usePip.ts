// src/worlds/early/hooks/usePip.ts

import { useState, useCallback, useRef } from 'react';
import { useLearnerStore } from '@/store';
import type { PipEmotion } from '../types/early.types';

const PIP_MESSAGES = {
  success: [
    "YOU DID IT! That was amazing!",
    "Wow! You figured it out!",
    "Brilliant! I knew you could do it!",
    "That's SO cool! You're incredible!",
    "Hoo hoo! You're a superstar!",
  ],
  stuck: [
    "Hmm... what if we try something different?",
    "Interesting! What do you notice about the pattern?",
    "Ooh! What happens if you move that one?",
    "I'm thinking... maybe start from the beginning?",
    "You're SO close! Try one small change!",
  ],
  encouragement: [
    "Keep going! You're doing great!",
    "Ooh! I can't wait to see what you do next!",
    "This is exciting! What do you think?",
    "I believe in you! You've got this!",
    "Every try teaches us something new!",
  ],
  greeting: [
    "Oh! You're back! I missed you!",
    "Today is going to be amazing!",
    "Ooh! What shall we discover today?",
    "Ready for an adventure?",
    "Hello hello hello! Let's explore!",
  ],
  mistake: [
    "Ooh! Interesting result! What happened?",
    "Hmm! Something unexpected! Let's try again!",
    "That's actually really interesting! What if...?",
    "Whoa! Not quite right, but great try!",
    "Ooh! Science is like that sometimes! Try again!",
  ],
};

function getRandomMessage(type: keyof typeof PIP_MESSAGES): string {
  const messages = PIP_MESSAGES[type];
  return messages[Math.floor(Math.random() * messages.length)];
}

export function usePip() {
  const { language } = useLearnerStore();
  const soundEnabled = true;
  const [emotion, setEmotion] = useState<PipEmotion>('idle');
  const [speaking, setSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [muted, setMuted] = useState(false);
  const [visible, setVisible] = useState(false);
  const emotionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastShownRef = useRef<number>(0);
  const COOLDOWN_MS = 20000;

  const canShow = useCallback(() => Date.now() - lastShownRef.current > COOLDOWN_MS, []);

  const speak = useCallback((message: string, emotionType: PipEmotion = 'excited') => {
    setCurrentMessage(message);
    setEmotion(emotionType);
    setVisible(true);
    lastShownRef.current = Date.now();

    if (emotionTimerRef.current) clearTimeout(emotionTimerRef.current);

    if (muted || !soundEnabled) {
      emotionTimerRef.current = setTimeout(() => { setVisible(false); setEmotion('idle'); }, 4000);
      return;
    }

    try {
      window.speechSynthesis?.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = language ?? 'en';
      utterance.pitch = 1.3;
      utterance.rate = 0.95;
      utterance.volume = 0.85;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => {
        setSpeaking(false);
        if (emotionTimerRef.current) clearTimeout(emotionTimerRef.current);
        emotionTimerRef.current = setTimeout(() => { setVisible(false); setEmotion('idle'); }, 2000);
      };
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis?.speak(utterance);
    } catch (_) {
      emotionTimerRef.current = setTimeout(() => { setVisible(false); setEmotion('idle'); }, 4000);
    }
  }, [muted, soundEnabled, language]);

  const celebrate = useCallback(() => { if (canShow()) speak(getRandomMessage('success'), 'celebrating'); }, [canShow, speak]);
  const encourage = useCallback(() => { if (canShow()) speak(getRandomMessage('encouragement'), 'encouraging'); }, [canShow, speak]);
  const reactToMistake = useCallback(() => { if (canShow()) speak(getRandomMessage('mistake'), 'curious'); }, [canShow, speak]);
  const giveHint = useCallback(() => { if (canShow()) speak(getRandomMessage('stuck'), 'thinking'); }, [canShow, speak]);
  const greet = useCallback(() => { speak(getRandomMessage('greeting'), 'excited'); }, [speak]);
  const sayCustom = useCallback((message: string, pipEmotion: PipEmotion = 'excited') => { if (canShow()) speak(message, pipEmotion); }, [canShow, speak]);
  const dismiss = useCallback(() => { try { window.speechSynthesis?.cancel(); } catch (_) {} setSpeaking(false); setVisible(false); setEmotion('idle'); }, []);
  const toggleMute = useCallback(() => { setMuted((p) => !p); if (!muted) { try { window.speechSynthesis?.cancel(); } catch (_) {} setSpeaking(false); } }, [muted]);

  return {
    emotion, speaking, currentMessage, muted, visible,
    pipName: 'Pip',
    celebrate, encourage, reactToMistake, giveHint, greet, sayCustom, dismiss, toggleMute, setEmotion,
  };
}
