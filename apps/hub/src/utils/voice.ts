/**
 * Voice Search & Text-to-Speech Utilities
 * Web Speech API integration for accessibility and hands-free interaction
 */

export interface VoiceSearchOptions {
  onResult: (transcript: string) => void;
  onInterimResult?: (transcript: string) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
  language?: string;
  continuous?: boolean;
}

export interface TTSOptions {
  text: string;
  language?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

/**
 * Voice Search Manager
 */
export class VoiceSearch {
  private recognition: any = null;
  private isListening: boolean = false;
  private options: VoiceSearchOptions;

  constructor(options: VoiceSearchOptions) {
    this.options = {
      language: 'en-IN',
      continuous: false,
      ...options,
    };

    if (this.isSupported()) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.setupRecognition();
    }
  }

  /**
   * Check if voice search is supported
   */
  isSupported(): boolean {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  /**
   * Setup speech recognition
   */
  private setupRecognition(): void {
    this.recognition.lang = this.options.language || 'en-IN';
    this.recognition.continuous = this.options.continuous || false;
    this.recognition.interimResults = true;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.options.onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      
      if (event.results[0].isFinal) {
        this.options.onResult(transcript);
      } else {
        this.options.onInterimResult?.(transcript);
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Voice recognition error:', event.error);
      this.options.onError?.(event.error);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.options.onEnd?.();
    };
  }

  /**
   * Start voice search
   */
  start(): void {
    if (!this.isSupported()) {
      this.options.onError?.('Voice search not supported');
      return;
    }

    if (this.isListening) {
      return;
    }

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      this.options.onError?.('Failed to start voice recognition');
    }
  }

  /**
   * Stop voice search
   */
  stop(): void {
    if (this.isListening && this.recognition) {
      this.recognition.stop();
    }
  }

  /**
   * Check if currently listening
   */
  isActive(): boolean {
    return this.isListening;
  }

  /**
   * Update language
   */
  setLanguage(language: string): void {
    this.options.language = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }
}

/**
 * Text-to-Speech Manager
 */
export class TextToSpeech {
  private synthesis: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;
  private isSpeaking: boolean = false;

  constructor() {
    this.synthesis = window.speechSynthesis;
  }

  /**
   * Check if TTS is supported
   */
  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices();
  }

  /**
   * Get voice for a specific language
   */
  getVoiceForLanguage(language: string): SpeechSynthesisVoice | null {
    const voices = this.getVoices();
    return voices.find((voice) => voice.lang.startsWith(language)) || null;
  }

  /**
   * Speak text
   */
  speak(options: TTSOptions): void {
    if (!this.isSupported()) {
      options.onError?.('Text-to-speech not supported');
      return;
    }

    // Cancel any ongoing speech
    this.stop();

    this.utterance = new SpeechSynthesisUtterance(options.text);
    
    // Set voice for language
    const voice = this.getVoiceForLanguage(options.language || 'en-IN');
    if (voice) {
      this.utterance.voice = voice;
    }

    this.utterance.lang = options.language || 'en-IN';
    this.utterance.rate = options.rate || 1;
    this.utterance.pitch = options.pitch || 1;
    this.utterance.volume = options.volume || 1;

    this.utterance.onstart = () => {
      this.isSpeaking = true;
    };

    this.utterance.onend = () => {
      this.isSpeaking = false;
      options.onEnd?.();
    };

    this.utterance.onerror = (event: any) => {
      console.error('TTS error:', event);
      this.isSpeaking = false;
      options.onError?.(event.error);
    };

    this.synthesis.speak(this.utterance);
  }

  /**
   * Stop speaking
   */
  stop(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    this.isSpeaking = false;
  }

  /**
   * Pause speaking
   */
  pause(): void {
    if (this.synthesis.speaking) {
      this.synthesis.pause();
    }
  }

  /**
   * Resume speaking
   */
  resume(): void {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  /**
   * Check if currently speaking
   */
  isActive(): boolean {
    return this.isSpeaking;
  }
}

/**
 * Voice Accessibility Helper
 * Combines voice search and TTS for hands-free navigation
 */
export class VoiceAccessibility {
  private voiceSearch: VoiceSearch;
  private tts: TextToSpeech;

  constructor() {
    this.tts = new TextToSpeech();
    
    this.voiceSearch = new VoiceSearch({
      onResult: (transcript) => this.handleVoiceCommand(transcript),
      language: 'en-IN',
    });
  }

  /**
   * Handle voice commands
   */
  private handleVoiceCommand(transcript: string): void {
    const command = transcript.toLowerCase();

    // Navigation commands
    if (command.includes('go to') || command.includes('navigate to')) {
      const destination = command.replace(/go to|navigate to/gi, '').trim();
      this.speak(`Navigating to ${destination}`);
      // Implement navigation logic
    }

    // Search commands
    if (command.includes('search for') || command.includes('find')) {
      const query = command.replace(/search for|find/gi, '').trim();
      this.speak(`Searching for ${query}`);
      // Implement search logic
    }

    // Help command
    if (command.includes('help')) {
      this.speak('You can say: go to [page], search for [topic], or read this page');
    }

    // Read page command
    if (command.includes('read') || command.includes('read this')) {
      this.speak('Reading page content');
      // Implement page reading logic
    }
  }

  /**
   * Speak text
   */
  speak(text: string, language?: string): void {
    this.tts.speak({
      text,
      language: language || 'en-IN',
    });
  }

  /**
   * Start voice search
   */
  startListening(): void {
    this.voiceSearch.start();
  }

  /**
   * Stop voice search
   */
  stopListening(): void {
    this.voiceSearch.stop();
  }

  /**
   * Stop all voice interactions
   */
  stopAll(): void {
    this.voiceSearch.stop();
    this.tts.stop();
  }
}

// Singleton instance
export const voiceAccessibility = new VoiceAccessibility();
