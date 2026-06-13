import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  AudioSettings, 
  defaultAudioSettings, 
  applyAudioSettings,
  narrator,
  sounds 
} from '../utils/audio';

interface AudioContextType {
  settings: AudioSettings;
  updateSettings: (settings: Partial<AudioSettings>) => void;
  speak: (text: string) => Promise<void>;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  playSound: (effect: 'click' | 'success' | 'error' | 'celebration' | 'whoosh' | 'pop' | 'ding' | 'levelUp') => void;
  isNarrationAvailable: boolean;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AudioSettings>(() => {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('audioSettings');
      if (saved) {
        try {
          return { ...defaultAudioSettings, ...JSON.parse(saved) };
        } catch {
          return defaultAudioSettings;
        }
      }
    }
    return defaultAudioSettings;
  });

  const [isSpeaking, setIsSpeaking] = useState(false);

  // Apply settings on mount and when they change
  useEffect(() => {
    applyAudioSettings(settings);
    localStorage.setItem('audioSettings', JSON.stringify(settings));
  }, [settings]);

  // Check speaking status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSpeaking(narrator.isSpeaking());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const updateSettings = (newSettings: Partial<AudioSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const speak = async (text: string) => {
    if (!settings.narrationEnabled) return;
    await narrator.speak(text);
  };

  const stopSpeaking = () => {
    narrator.stop();
  };

  const playSound = (effect: 'click' | 'success' | 'error' | 'celebration' | 'whoosh' | 'pop' | 'ding' | 'levelUp') => {
    sounds.play(effect);
  };

  return (
    <AudioContext.Provider value={{
      settings,
      updateSettings,
      speak,
      stopSpeaking,
      isSpeaking,
      playSound,
      isNarrationAvailable: narrator.isAvailable(),
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}
