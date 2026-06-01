// src/shared/audio/SoundSynthesizer.ts
import { getAudioContext } from './AudioEngine';

export interface SynthNote {
  frequency: number;
  duration: number;
  delay?: number;
  volume?: number;
  type?: OscillatorType;
}

export interface SynthPattern {
  notes: SynthNote[];
  bpm?: number;
}

export const SoundSynthesizer = {
  playNote(note: SynthNote): void {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = note.type ?? 'sine';
      osc.frequency.setValueAtTime(note.frequency, ctx.currentTime);

      const volume = note.volume ?? 0.3;
      const delay = note.delay ?? 0;
      const startTime = ctx.currentTime + delay;

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
      gain.gain.linearRampToValueAtTime(0, startTime + note.duration);

      osc.start(startTime);
      osc.stop(startTime + note.duration + 0.1);
    } catch (e) {
      console.warn('[LearnOS] SoundSynthesizer failed:', e);
    }
  },

  playPattern(pattern: SynthPattern): void {
    const bpm = pattern.bpm ?? 120;
    const beatDuration = 60 / bpm;

    pattern.notes.forEach((note) => {
      this.playNote({
        ...note,
        delay: (note.delay ?? 0) * beatDuration,
        duration: note.duration * beatDuration,
      });
    });
  },

  // Musical scale frequencies
  noteToFrequency(note: string, octave: number = 4): number {
    const notes: Record<string, number> = {
      'C': 0, 'C#': 1, 'Db': 1,
      'D': 2, 'D#': 3, 'Eb': 3,
      'E': 4, 'Fb': 4, 'E#': 5,
      'F': 5, 'F#': 6, 'Gb': 6,
      'G': 7, 'G#': 8, 'Ab': 8,
      'A': 9, 'A#': 10, 'Bb': 10,
      'B': 11, 'Cb': 11, 'B#': 0,
    };
    const semitone = notes[note];
    if (semitone === undefined) return 440;
    return 440 * Math.pow(2, (semitone - 9) / 12 + (octave - 4));
  },

  // Pre-made sound effects
  correctAnswer(): void {
    this.playPattern({
      notes: [
        { frequency: 523, duration: 0.3, delay: 0 },
        { frequency: 659, duration: 0.3, delay: 0.15 },
        { frequency: 784, duration: 0.5, delay: 0.3 },
      ],
    });
  },

  wrongAnswer(): void {
    this.playNote({
      frequency: 200,
      duration: 0.4,
      type: 'sawtooth',
      volume: 0.2,
    });
  },

  levelUp(): void {
    this.playPattern({
      notes: [
        { frequency: 392, duration: 0.2, delay: 0 },
        { frequency: 523, duration: 0.2, delay: 0.1 },
        { frequency: 659, duration: 0.2, delay: 0.2 },
        { frequency: 784, duration: 0.4, delay: 0.3 },
      ],
    });
  },

  discover(): void {
    this.playPattern({
      notes: [
        { frequency: 523, duration: 0.3, delay: 0, type: 'triangle' },
        { frequency: 659, duration: 0.3, delay: 0.2, type: 'triangle' },
        { frequency: 784, duration: 0.3, delay: 0.4, type: 'triangle' },
        { frequency: 1047, duration: 0.6, delay: 0.6, type: 'triangle' },
      ],
    });
  },
};
