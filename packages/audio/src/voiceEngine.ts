/**
 * Voice Engine — Smart voice selection and tuning for calm, clear narration
 *
 * Optimized for Chrome's built-in voices (Google US English, Google UK English)
 * Falls back gracefully to any available English voice.
 *
 * Extracted from apps/learn into @jigyasu/audio for shared use across all apps.
 */

export interface VoiceConfig {
  rate: number;
  pitch: number;
  volume: number;
  voice: SpeechSynthesisVoice | null;
}

export interface NarrationStep {
  text: string;
  delay?: number;
  emphasis?: string[]; // words to emphasize
}

export interface VoiceState {
  isPlaying: boolean;
  isPaused: boolean;
  currentSentenceIndex: number;
  totalSentences: number;
  waveform: number[];
  availableVoices: SpeechSynthesisVoice[];
  selectedVoiceName: string;
}

const DEFAULT_CONFIG: VoiceConfig = {
  rate: 0.85,   // Conversational, like a good teacher
  pitch: 0.9,   // Slightly deeper, warmer
  volume: 0.75, // Soft but clear
  voice: null,
};

// Chrome's best voices in priority order
const PREFERRED_VOICES = [
  'Google US English',
  'Google UK English Female',
  'Google UK English Male',
  'Microsoft Zira',
  'Microsoft David',
  'Microsoft Hazel',
];

class VoiceEngine {
  private config: VoiceConfig = { ...DEFAULT_CONFIG };
  private state: VoiceState = {
    isPlaying: false,
    isPaused: false,
    currentSentenceIndex: -1,
    totalSentences: 0,
    waveform: new Array(20).fill(0),
    availableVoices: [],
    selectedVoiceName: 'Default',
  };
  private targetLanguage: string = 'en'; // Default to English
  private onStateChange: ((state: VoiceState) => void) | null = null;
  private onSentenceChange: ((index: number) => void) | null = null;
  private onComplete: (() => void) | null = null;
  private utterance: SpeechSynthesisUtterance | null = null;
  private waveInterval: number | null = null;
  private currentTexts: string[] = [];

  constructor() {
    this.loadVoices();
    if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  public setLanguage(lang: string) {
    this.targetLanguage = lang;
    this.loadVoices(); // Reload voices with new language preference
  }

  private loadVoices() {
    if (typeof speechSynthesis === 'undefined') return;
    const voices = speechSynthesis.getVoices();
    if (voices.length === 0) return;

    this.state.availableVoices = voices;

    // Filter by the target language (e.g., 'en', 'hi', 'or', 'ta', 'es', 'fr')
    let matchedVoices = voices.filter((v) => v.lang.toLowerCase().startsWith(this.targetLanguage.toLowerCase()));
    
    // Fallback to English if the requested language isn't installed on the device
    if (matchedVoices.length === 0) {
      console.warn(`No voices found for ${this.targetLanguage}, falling back to English`);
      matchedVoices = voices.filter((v) => v.lang.startsWith('en'));
    }

    // Try to find a premium Google or Microsoft voice
    for (const preferred of PREFERRED_VOICES) {
      const found = matchedVoices.find((v) => v.name.includes(preferred) || v.name === preferred);
      if (found) {
        this.config.voice = found;
        this.state.selectedVoiceName = found.name;
        this.emitState();
        return;
      }
    }

    // Otherwise, pick the first available voice for that language
    if (matchedVoices.length > 0) {
      // Prefer Google TTS if available for other languages (e.g., "Google हिन्दी")
      const googleVoice = matchedVoices.find(v => v.name.includes('Google'));
      this.config.voice = googleVoice || matchedVoices[0];
      this.state.selectedVoiceName = this.config.voice.name;
      this.emitState();
    }
  }

  setOnStateChange(callback: (state: VoiceState) => void) {
    this.onStateChange = callback;
  }

  setOnSentenceChange(callback: (index: number) => void) {
    this.onSentenceChange = callback;
  }

  setOnComplete(callback: () => void) {
    this.onComplete = callback;
  }

  private emitState() {
    this.onStateChange?.({ ...this.state });
  }

  speak(steps: NarrationStep[]) {
    this.stop();

    this.currentTexts = steps.map((s) => s.text);
    this.state.totalSentences = steps.length;
    this.state.currentSentenceIndex = 0;
    this.state.isPlaying = true;
    this.state.isPaused = false;
    this.startWaveform();
    this.emitState();

    this.speakStep(0, steps);
  }

  private speakStep(index: number, steps: NarrationStep[]) {
    if (index >= steps.length) {
      this.finish();
      return;
    }

    this.state.currentSentenceIndex = index;
    this.onSentenceChange?.(index);
    this.emitState();

    const step = steps[index];
    const utterance = new SpeechSynthesisUtterance(step.text);

    utterance.rate = this.config.rate;
    utterance.pitch = this.config.pitch;
    utterance.volume = this.config.volume;

    if (this.config.voice) {
      utterance.voice = this.config.voice;
    }

    if (this.state.selectedVoiceName.includes('Google')) {
      utterance.rate = Math.min(this.config.rate, 0.88);
    }

    utterance.onend = () => {
      if (this.state.isPlaying && !this.state.isPaused) {
        setTimeout(() => {
          this.speakStep(index + 1, steps);
        }, step.delay || 400);
      }
    };

    utterance.onerror = () => {
      if (this.state.isPlaying) {
        setTimeout(() => {
          this.speakStep(index + 1, steps);
        }, 200);
      }
    };

    this.utterance = utterance;
    speechSynthesis.speak(utterance);
  }

  pause() {
    if (this.state.isPlaying && !this.state.isPaused) {
      speechSynthesis.pause();
      this.state.isPaused = true;
      this.stopWaveform();
      this.emitState();
    }
  }

  resume() {
    if (this.state.isPaused) {
      speechSynthesis.resume();
      this.state.isPaused = false;
      this.startWaveform();
      this.emitState();
    }
  }

  stop() {
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.cancel();
    }
    this.state.isPlaying = false;
    this.state.isPaused = false;
    this.state.currentSentenceIndex = -1;
    this.stopWaveform();
    this.state.waveform = new Array(20).fill(0);
    this.emitState();
  }

  private finish() {
    this.state.isPlaying = false;
    this.state.isPaused = false;
    this.state.currentSentenceIndex = -1;
    this.stopWaveform();
    this.state.waveform = new Array(20).fill(0);
    this.emitState();
    this.onComplete?.();
  }

  private startWaveform() {
    if (this.waveInterval) return;

    this.waveInterval = window.setInterval(() => {
      if (this.state.isPaused) return;
      this.state.waveform = this.state.waveform.map(() => Math.random() * 0.7 + 0.15);
      this.emitState();
    }, 80);
  }

  private stopWaveform() {
    if (this.waveInterval) {
      clearInterval(this.waveInterval);
      this.waveInterval = null;
    }
  }

  setRate(rate: number) {
    this.config.rate = Math.max(0.5, Math.min(1.5, rate));
  }

  setPitch(pitch: number) {
    this.config.pitch = Math.max(0.5, Math.min(2, pitch));
  }

  setVolume(volume: number) {
    this.config.volume = Math.max(0.1, Math.min(1, volume));
  }

  getState() {
    return { ...this.state };
  }

  getAvailableVoices() {
    return this.state.availableVoices.filter((v) => v.lang.toLowerCase().startsWith(this.targetLanguage.toLowerCase()));
  }
}

// Singleton instance
export const voiceEngine = new VoiceEngine();
