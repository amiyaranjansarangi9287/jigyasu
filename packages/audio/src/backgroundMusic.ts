/**
 * Background Music Engine — Generates ambient tones via Web Audio API
 *
 * Zero external files, zero cost, no copyright issues.
 * Creates calming ambient pads using oscillators and filters.
 *
 * Extracted from apps/learn into @jigyasu/audio for shared use.
 */

class BackgroundMusic {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private gainNode: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private masterVolume = 0.08; // Very soft — must not compete with narration

  // Ambient chord presets (frequency arrays for different moods)
  private chords: Record<string, number[]> = {
    wonder: [130.81, 164.81, 196.0, 261.63], // C3, E3, G3, C4 — open, curious
    calm: [146.83, 174.61, 220.0, 293.66],   // D3, F3, A3, D4 — peaceful
    nature: [164.81, 196.0, 246.94, 329.63], // E3, G3, B3, E4 — organic, warm
    space: [110.0, 130.81, 164.81, 220.0],   // A2, C3, E3, A3 — vast, deep
  };

  start(mood: 'wonder' | 'calm' | 'nature' | 'space' = 'wonder') {
    if (this.isPlaying) return;

    this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = 0;
    this.gainNode.connect(this.ctx.destination);

    const frequencies = this.chords[mood];

    frequencies.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      const osc2 = this.ctx!.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = freq * 1.002;

      const voiceGain = this.ctx!.createGain();
      voiceGain.gain.value = this.masterVolume / frequencies.length;

      osc.connect(voiceGain);
      osc2.connect(voiceGain);
      voiceGain.connect(this.gainNode!);

      osc.start();
      osc2.start();

      this.oscillators.push(osc, osc2);
    });

    this.gainNode.gain.linearRampToValueAtTime(1, this.ctx.currentTime + 2);
    this.isPlaying = true;
  }

  stop() {
    if (!this.isPlaying || !this.ctx || !this.gainNode) return;

    this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.5);

    setTimeout(() => {
      this.oscillators.forEach((osc) => {
        try {
          osc.stop();
        } catch {}
      });
      this.oscillators = [];
      this.ctx?.close();
      this.ctx = null;
      this.gainNode = null;
      this.isPlaying = false;
    }, 1600);
  }

  pause() {
    if (!this.gainNode || !this.ctx) return;
    this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
  }

  resume() {
    if (!this.gainNode || !this.ctx || !this.isPlaying) return;
    this.gainNode.gain.linearRampToValueAtTime(1, this.ctx.currentTime + 1);
  }

  setVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(0.15, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.linearRampToValueAtTime(
        this.masterVolume * 10,
        this.ctx.currentTime + 0.2
      );
    }
  }

  getIsPlaying() {
    return this.isPlaying;
  }
}

export const backgroundMusic = new BackgroundMusic();
