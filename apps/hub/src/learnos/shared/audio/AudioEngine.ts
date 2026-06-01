// src/shared/audio/AudioEngine.ts

let audioContext: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

export interface ToneConfig {
  frequency: number;
  type: OscillatorType;
  duration: number;       // seconds
  volume: number;         // 0-1
  attack: number;         // seconds
  decay: number;          // seconds
  detune?: number;
}

export const AudioEngine = {
  playTone(config: ToneConfig): void {
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = config.type;
      oscillator.frequency.setValueAtTime(config.frequency, ctx.currentTime);
      if (config.detune) {
        oscillator.detune.setValueAtTime(config.detune, ctx.currentTime);
      }

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        config.volume,
        ctx.currentTime + config.attack
      );
      gainNode.gain.linearRampToValueAtTime(
        0,
        ctx.currentTime + config.duration
      );

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + config.duration + config.decay);
    } catch (e) {
      console.warn('[LearnOS] Audio failed:', e);
    }
  },

  playChord(frequencies: number[], config: Omit<ToneConfig, 'frequency'>): void {
    frequencies.forEach((freq) => {
      AudioEngine.playTone({ ...config, frequency: freq });
    });
  },

  playSuccess(): void {
    AudioEngine.playChord([261, 329, 392, 523], {
      type: 'sine',
      duration: 0.8,
      volume: 0.3,
      attack: 0.05,
      decay: 0.2,
    });
  },

  playError(): void {
    AudioEngine.playTone({
      frequency: 200,
      type: 'sawtooth',
      duration: 0.3,
      volume: 0.2,
      attack: 0.01,
      decay: 0.1,
    });
  },

  playClick(): void {
    AudioEngine.playTone({
      frequency: 800,
      type: 'sine',
      duration: 0.1,
      volume: 0.15,
      attack: 0.005,
      decay: 0.05,
    });
  },

  playPop(): void {
    AudioEngine.playTone({
      frequency: 400,
      type: 'sine',
      duration: 0.15,
      volume: 0.2,
      attack: 0.005,
      decay: 0.1,
    });
  },

  playCelebration(): void {
    const notes = [261, 329, 392, 523, 659];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        AudioEngine.playTone({
          frequency: freq,
          type: 'sine',
          duration: 0.4,
          volume: 0.3,
          attack: 0.05,
          decay: 0.1,
        });
      }, i * 100);
    });
  },

  playWonder(): void {
    const notes = [392, 523, 659, 784];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        AudioEngine.playTone({
          frequency: freq,
          type: 'triangle',
          duration: 0.6,
          volume: 0.25,
          attack: 0.1,
          decay: 0.2,
        });
      }, i * 150);
    });
  },

  playHint(): void {
    AudioEngine.playTone({
      frequency: 523,
      type: 'sine',
      duration: 0.3,
      volume: 0.2,
      attack: 0.02,
      decay: 0.1,
    });
    setTimeout(() => {
      AudioEngine.playTone({
        frequency: 659,
        type: 'sine',
        duration: 0.3,
        volume: 0.2,
        attack: 0.02,
        decay: 0.1,
      });
    }, 100);
  },
};
