// Audio utilities for voice narration and sound effects

// ============================================
// TEXT-TO-SPEECH NARRATION
// ============================================

interface NarrationOptions {
  rate?: number;      // 0.1 to 10, default 1
  pitch?: number;     // 0 to 2, default 1
  volume?: number;    // 0 to 1, default 1
  voice?: string;     // Voice name preference
}

class Narrator {
  private synth: SpeechSynthesis | null = null;
  private isEnabled: boolean = true;
  private defaultOptions: NarrationOptions = {
    rate: 0.9,    // Slightly slower for kids
    pitch: 1.1,   // Slightly higher pitch (friendly)
    volume: 1,
  };

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  isAvailable(): boolean {
    return this.synth !== null;
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  getEnabled(): boolean {
    return this.isEnabled;
  }

  getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  // Get a kid-friendly voice (prefer female, English)
  private getBestVoice(): SpeechSynthesisVoice | null {
    const voices = this.getVoices();
    
    // Preferred voice names (friendly, clear voices)
    const preferredNames = [
      'Samantha', 'Karen', 'Moira', 'Tessa', 'Fiona', // macOS
      'Microsoft Zira', 'Microsoft Eva', 'Google US English', // Windows/Chrome
    ];
    
    // Try to find a preferred voice
    for (const name of preferredNames) {
      const voice = voices.find(v => v.name.includes(name));
      if (voice) return voice;
    }
    
    // Fallback: any English female voice
    const englishVoice = voices.find(v => 
      v.lang.startsWith('en') && v.name.toLowerCase().includes('female')
    );
    if (englishVoice) return englishVoice;
    
    // Fallback: any English voice
    const anyEnglish = voices.find(v => v.lang.startsWith('en'));
    if (anyEnglish) return anyEnglish;
    
    // Last resort: first available
    return voices[0] || null;
  }

  speak(text: string, options?: NarrationOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synth || !this.isEnabled) {
        resolve();
        return;
      }

      // Stop any current speech
      this.stop();

      const opts = { ...this.defaultOptions, ...options };
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.rate = opts.rate || 1;
      utterance.pitch = opts.pitch || 1;
      utterance.volume = opts.volume || 1;
      
      const voice = this.getBestVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onend = () => {
        resolve();
      };

      utterance.onerror = (event) => {
        // Don't reject on 'interrupted' - that's normal when stopping
        if (event.error !== 'interrupted') {
          reject(event);
        } else {
          resolve();
        }
      };

      this.synth.speak(utterance);
    });
  }

  stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  pause(): void {
    if (this.synth) {
      this.synth.pause();
    }
  }

  resume(): void {
    if (this.synth) {
      this.synth.resume();
    }
  }

  isSpeaking(): boolean {
    return this.synth?.speaking || false;
  }
}

// Singleton narrator instance
export const narrator = new Narrator();

// ============================================
// SOUND EFFECTS
// ============================================

type SoundEffect = 
  | 'click'
  | 'success'
  | 'error'
  | 'celebration'
  | 'whoosh'
  | 'pop'
  | 'ding'
  | 'levelUp';

class SoundManager {
  private audioContext: AudioContext | null = null;
  private isEnabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    if (typeof window !== 'undefined') {
      // AudioContext will be created on first user interaction
    }
  }

  private getContext(): AudioContext | null {
    if (!this.audioContext && typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn('AudioContext not available');
      }
    }
    return this.audioContext;
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  getEnabled(): boolean {
    return this.isEnabled;
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  // Generate simple synthesized sounds
  play(effect: SoundEffect): void {
    if (!this.isEnabled) return;
    
    const ctx = this.getContext();
    if (!ctx) return;

    // Resume context if suspended (browser autoplay policy)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    gainNode.gain.value = this.volume * 0.3;

    const now = ctx.currentTime;

    switch (effect) {
      case 'click':
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
        break;

      case 'success':
        oscillator.frequency.setValueAtTime(523, now); // C5
        oscillator.frequency.setValueAtTime(659, now + 0.1); // E5
        oscillator.frequency.setValueAtTime(784, now + 0.2); // G5
        oscillator.type = 'sine';
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        oscillator.start(now);
        oscillator.stop(now + 0.4);
        break;

      case 'error':
        oscillator.frequency.value = 200;
        oscillator.type = 'square';
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;

      case 'celebration':
        // Play multiple notes
        this.playChord([523, 659, 784, 1047], 0.5); // C major chord
        break;

      case 'whoosh':
        oscillator.frequency.setValueAtTime(400, now);
        oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.2);
        oscillator.type = 'sine';
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;

      case 'pop':
        oscillator.frequency.value = 400;
        oscillator.type = 'sine';
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        oscillator.start(now);
        oscillator.stop(now + 0.05);
        break;

      case 'ding':
        oscillator.frequency.value = 880;
        oscillator.type = 'sine';
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
        break;

      case 'levelUp':
        oscillator.frequency.setValueAtTime(440, now);
        oscillator.frequency.setValueAtTime(554, now + 0.1);
        oscillator.frequency.setValueAtTime(659, now + 0.2);
        oscillator.frequency.setValueAtTime(880, now + 0.3);
        oscillator.type = 'sine';
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        oscillator.start(now);
        oscillator.stop(now + 0.5);
        break;
    }
  }

  private playChord(frequencies: number[], duration: number): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.value = freq;
      osc.type = 'sine';
      gain.gain.value = this.volume * 0.15;
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      
      osc.start(now + i * 0.05);
      osc.stop(now + duration);
    });
  }
}

// Singleton sound manager
export const sounds = new SoundManager();

// ============================================
// AUDIO SETTINGS HOOK
// ============================================

export interface AudioSettings {
  narrationEnabled: boolean;
  soundEffectsEnabled: boolean;
  volume: number;
}

export const defaultAudioSettings: AudioSettings = {
  narrationEnabled: true,
  soundEffectsEnabled: true,
  volume: 0.7,
};

export function applyAudioSettings(settings: AudioSettings): void {
  narrator.setEnabled(settings.narrationEnabled);
  sounds.setEnabled(settings.soundEffectsEnabled);
  sounds.setVolume(settings.volume);
}
