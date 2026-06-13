import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { cn } from '../utils/cn';

interface AudioSettingsProps {
  className?: string;
}

export default function AudioSettings({ className }: AudioSettingsProps) {
  const { t } = useTranslation();
  const { settings, updateSettings, playSound, isNarrationAvailable } = useAudio();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    playSound('pop');
  };

  return (
    <div className={cn("relative", className)}>
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-all",
          "bg-white/80 hover:bg-white shadow-lg hover:shadow-xl",
          "border-2 border-purple-200 hover:border-purple-400"
        )}
        title={t('auto.audiosettings.audio_settings', 'Audio Settings')}
      >
        <span className="text-xl">
          {settings.narrationEnabled || settings.soundEffectsEnabled ? '🔊' : '🔇'}
        </span>
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute right-0 top-12 z-50 bg-white rounded-2xl shadow-2xl p-5 w-72 border border-purple-100">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🎵</span>{t('auto.learning.s786_sound_settings', 'Sound Settings')}</h3>
            
            {/* Voice Narration */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span>🗣️</span>{t('auto.learning.s787_voice_narration', 'Voice Narration')}</label>
                <button
                  onClick={() => {
                    updateSettings({ narrationEnabled: !settings.narrationEnabled });
                    playSound('click');
                  }}
                  disabled={!isNarrationAvailable}
                  className={cn(
                    "w-12 h-7 rounded-full transition-all relative",
                    settings.narrationEnabled ? "bg-purple-500" : "bg-gray-300",
                    !isNarrationAvailable && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all",
                    settings.narrationEnabled ? "right-1" : "left-1"
                  )} />
                </button>
              </div>
              {!isNarrationAvailable && (
                <p className="text-xs text-orange-600">
                  {t('auto.audiosettings.voice_not_available', 'Voice not available in this browser')}
                </p>
              )}
              <p className="text-xs text-gray-500">{t('auto.learning.s788_read_stories_aloud', 'Read stories aloud')}</p>
            </div>

            {/* Sound Effects */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span>✨</span>{t('auto.learning.s789_sound_effects', 'Sound Effects')}</label>
                <button
                  onClick={() => {
                    updateSettings({ soundEffectsEnabled: !settings.soundEffectsEnabled });
                    playSound('click');
                  }}
                  className={cn(
                    "w-12 h-7 rounded-full transition-all relative",
                    settings.soundEffectsEnabled ? "bg-purple-500" : "bg-gray-300"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all",
                    settings.soundEffectsEnabled ? "right-1" : "left-1"
                  )} />
                </button>
              </div>
              <p className="text-xs text-gray-500">{t('auto.learning.s790_button_clicks_and_celebrations', 'Button clicks and celebrations')}</p>
            </div>

            {/* Volume */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                <span>🔉</span>{t('auto.learning.s791_volume', 'Volume')}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.volume}
                onChange={(e) => {
                  updateSettings({ volume: parseFloat(e.target.value) });
                }}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{t('auto.learning.s792_quiet', 'Quiet')}</span>
                <span>{t('auto.learning.s793_loud', 'Loud')}</span>
              </div>
            </div>

            {/* Test Button */}
            <button
              onClick={() => playSound('success')}
              className="w-full py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-all"
            >🎶 Test Sound</button>
          </div>
        </>
      )}
    </div>
  );
}
