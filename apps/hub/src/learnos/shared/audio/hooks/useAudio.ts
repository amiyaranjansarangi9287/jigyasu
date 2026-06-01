// src/shared/audio/hooks/useAudio.ts
import { useCallback } from 'react';
import { useSettingsStore } from '@/store';
import { AudioEngine, type ToneConfig } from '../AudioEngine';
import { SoundSynthesizer } from '../SoundSynthesizer';

export function useAudio() {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);

  const playSuccess = useCallback(() => {
    if (soundEnabled) AudioEngine.playSuccess();
  }, [soundEnabled]);

  const playError = useCallback(() => {
    if (soundEnabled) AudioEngine.playError();
  }, [soundEnabled]);

  const playClick = useCallback(() => {
    if (soundEnabled) AudioEngine.playClick();
  }, [soundEnabled]);

  const playPop = useCallback(() => {
    if (soundEnabled) AudioEngine.playPop();
  }, [soundEnabled]);

  const playCelebration = useCallback(() => {
    if (soundEnabled) AudioEngine.playCelebration();
  }, [soundEnabled]);

  const playWonder = useCallback(() => {
    if (soundEnabled) AudioEngine.playWonder();
  }, [soundEnabled]);

  const playHint = useCallback(() => {
    if (soundEnabled) AudioEngine.playHint();
  }, [soundEnabled]);

  const playTone = useCallback((config: ToneConfig) => {
    if (soundEnabled) AudioEngine.playTone(config);
  }, [soundEnabled]);

  const playChord = useCallback((frequencies: number[], config: Omit<ToneConfig, 'frequency'>) => {
    if (soundEnabled) AudioEngine.playChord(frequencies, config);
  }, [soundEnabled]);

  const playCorrectAnswer = useCallback(() => {
    if (soundEnabled) SoundSynthesizer.correctAnswer();
  }, [soundEnabled]);

  const playWrongAnswer = useCallback(() => {
    if (soundEnabled) SoundSynthesizer.wrongAnswer();
  }, [soundEnabled]);

  const playLevelUp = useCallback(() => {
    if (soundEnabled) SoundSynthesizer.levelUp();
  }, [soundEnabled]);

  const playDiscover = useCallback(() => {
    if (soundEnabled) SoundSynthesizer.discover();
  }, [soundEnabled]);

  return {
    soundEnabled,
    playSuccess,
    playError,
    playClick,
    playPop,
    playCelebration,
    playWonder,
    playHint,
    playTone,
    playChord,
    playCorrectAnswer,
    playWrongAnswer,
    playLevelUp,
    playDiscover,
  };
}
