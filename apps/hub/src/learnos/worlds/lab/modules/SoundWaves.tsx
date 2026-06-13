// src/worlds/lab/modules/SoundWaves.tsx
// Interactive sound wave simulation with frequency and amplitude control

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { useLearnerStore } from '@/store';
import { LearningService } from '@/services';
import { ParentCorner } from '@/shared/layout/ParentCorner';
import { ROUTES } from '@/constants/routes';
import SoundWavesCanvas from './SoundWavesCanvas';

export default function SoundWaves() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useLearnerStore();
  const [frequency, setFrequency] = useState(1.5);
  const [amplitude, setAmplitude] = useState(0.6);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleFreqChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setFrequency(val);
    LearningService.trackEvent(
      'sound-waves-session',
      'lab',
      language,
      'canvas_interaction',
      'sound-waves',
      { frequency: val, amplitude }
    );
  }, [language, amplitude]);

  const handleAmpChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setAmplitude(val);
    LearningService.trackEvent(
      'sound-waves-session',
      'lab',
      language,
      'canvas_interaction',
      'sound-waves',
      { frequency, amplitude: val }
    );
  }, [language, frequency]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-950 relative">
      <ParentCorner onExit={() => navigate(ROUTES.FAMILY_HOME)} />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔊</div>
          <h1 className="text-3xl font-extrabold text-white">
            {t('lab.soundwaves.title', { defaultValue: 'Sound Waves' })}
          </h1>
          <p className="text-sm text-slate-400 mt-2">{t('lab.modules.SoundWaves.txt_Changefreq', 'Change frequency and amplitude to see how sound travels!')}</p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={togglePlay}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
              isPlaying
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
        </div>

        {/* Canvas */}
        <div className="bg-slate-800/50 rounded-3xl shadow-sm border border-slate-700/50 p-4 mb-6">
          <SoundWavesCanvas frequency={frequency} amplitude={amplitude} isPlaying={isPlaying} />
        </div>

        {/* Sliders */}
        <div className="bg-slate-800/50 rounded-2xl p-6 shadow-sm border border-slate-700/50 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">{t('lab.modules.SoundWaves.spn_FrequencyP', '🎵 Frequency (Pitch)')}</span>
              <span className="text-sm font-medium text-blue-400">{frequency.toFixed(1)} <Trans i18nKey="auto.soundwaves.hz">Hz</Trans></span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={frequency}
              onChange={handleFreqChange}
              className="w-full h-3 rounded-full appearance-none cursor-pointer"
              style={{ background: 'linear-gradient(to right, #3B82F6, #8B5CF6)' }}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">{t('lab.modules.SoundWaves.spn_AmplitudeV', '🔊 Amplitude (Volume)')}</span>
              <span className="text-sm font-medium text-yellow-400">{Math.round(amplitude * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1"
              step="0.1"
              value={amplitude}
              onChange={handleAmpChange}
              className="w-full h-3 rounded-full appearance-none cursor-pointer"
              style={{ background: 'linear-gradient(to right, #F59E0B, #EF4444)' }}
            />
          </div>
        </div>

        {/* Indian context */}
        <div className="mt-6 rounded-2xl p-5 border border-orange-500/20" style={{ background: 'linear-gradient(135deg, rgba(255, 140, 66, 0.08), rgba(212, 75, 31, 0.05))' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">{t('lab.modules.SoundWaves.spn_', '🕉️')}</span>
            <div>
              <h3 className="text-orange-400 font-bold text-sm mb-1"><Trans i18nKey="auto.soundwaves.indian_sound_science">Indian Sound Science</Trans></h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                <Trans i18nKey="auto.soundwaves.ancient_indians_classified_sou">Ancient Indians classified sound into</Trans> <strong><Trans i18nKey="auto.soundwaves.n_da_brahma">Nāda Brahma</Trans></strong> <Trans i18nKey="auto.soundwaves.sound_is_god_the_concept_of">(a philosophical concept meaning sound is the essence of the universe).
                                              The concept of</Trans> <strong><Trans i18nKey="auto.soundwaves.abda">Śabda</Trans></strong> <Trans i18nKey="auto.soundwaves.sound_as_a_form_of_energy_date">(sound) as a form of energy dates back to
                                              the Upanishads (traditionally dated around 800 BCE). Indian musicians explored harmonics and resonance through
                                              practical musical knowledge, distinct from later Western scientific formalisation.</Trans>
                                            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
