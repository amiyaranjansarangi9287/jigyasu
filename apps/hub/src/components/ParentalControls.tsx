import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormatNumber } from '../hooks/useFormatNumber';
import { Button } from '@jigyasu/ui';
type Props = {
  onSave?: (settings: ParentalSettings) => void;
};

export interface ParentalSettings {
  dailyTimeLimit: number; // minutes
  allowedWorlds: string[];
  enableGamification: boolean;
  enableStreaks: boolean;
  enableBadges: boolean;
  requirePin: boolean;
  pin?: string;
}

const DEFAULT_SETTINGS: ParentalSettings = {
  dailyTimeLimit: 60, // 1 hour default
  allowedWorlds: ['tiny', 'early', 'lab', 'discovery'],
  enableGamification: true,
  enableStreaks: true,
  enableBadges: true,
  requirePin: false,
};

const WORLDS = [
  { id: 'tiny', name: 'Tiny World', emoji: '🧸', ageRange: '2-5' },
  { id: 'early', name: 'Early World', emoji: '🦊', ageRange: '5-8' },
  { id: 'lab', name: 'Lab World', emoji: '🧪', ageRange: '8-10' },
  { id: 'discovery', name: 'Discovery World', emoji: '🌍', ageRange: '10-13' },
  { id: 'academy', name: 'Academy World', emoji: '🎓', ageRange: '13-15' },
  { id: 'explorer', name: 'Explorer World', emoji: '🚀', ageRange: '15+' },
  { id: 'biology', name: 'Biology World', emoji: '🧬', ageRange: '10-18' },
  { id: 'math', name: 'Math Kingdom', emoji: '🧙‍♂️', ageRange: '5-18' },
  { id: 'physics', name: 'Physics World', emoji: '⚛️', ageRange: '10-18' },
];

export default function ParentalControls({ onSave }: Props) {
  const { t } = useTranslation();
  const formatNumber = useFormatNumber();
  const [settings, setSettings] = useState<ParentalSettings>(DEFAULT_SETTINGS);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleWorldToggle = (worldId: string) => {
    setSettings(prev => ({
      ...prev,
      allowedWorlds: prev.allowedWorlds.includes(worldId)
        ? prev.allowedWorlds.filter(id => id !== worldId)
        : [...prev.allowedWorlds, worldId],
    }));
  };

  const handleSave = () => {
    if (settings.requirePin && (!currentPin || currentPin !== confirmPin)) {
      alert('PINs must match and cannot be empty');
      return;
    }
    if (settings.requirePin) {
      settings.pin = currentPin;
    }
    if (onSave) {
      onSave(settings);
    }
  };

  if (showPinSetup) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-2xl mx-auto" role="dialog" aria-labelledby="pin-title">
        <h2 id="pin-title" className="text-2xl font-bold text-slate-900 mb-4">
          🔐 {t('set_parental_pin', 'Set Parental PIN')}
        </h2>
        <p className="text-slate-600 mb-6">
          {t('pin_description', 'This PIN will be required to change parental controls or bypass time limits.')}
        </p>
        <div className="space-y-4">
          <div>
            <label htmlFor="pin-input" className="block text-sm font-bold text-slate-700 mb-2">
              {t('enter_pin', 'Enter PIN (4 digits)')}
            </label>
            <input
              id="pin-input"
              type="password"
              maxLength={4}
              pattern="[0-9]{4}"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-lg tracking-widest text-center"
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              aria-describedby="pin-desc"
            />
            <p id="pin-desc" className="text-xs text-slate-500 mt-1">
              {t('use_4_numbers', 'Use 4 numbers only')}
            </p>
          </div>
          <div>
            <label htmlFor="confirm-pin-input" className="block text-sm font-bold text-slate-700 mb-2">
              {t('confirm_pin', 'Confirm PIN')}
            </label>
            <input
              id="confirm-pin-input"
              type="password"
              maxLength={4}
              pattern="[0-9]{4}"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-lg tracking-widest text-center"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setShowPinSetup(false);
                setCurrentPin('');
                setConfirmPin('');
              }}
              variant="muted"
              className="flex-1"
              aria-label={t('cancel_pin_setup', 'Cancel PIN setup')}
            >
              {t('cancel', 'Cancel')}
            </Button>
            <Button
              onClick={() => {
                setSettings(prev => ({ ...prev, requirePin: true, pin: currentPin }));
                setShowPinSetup(false);
              }}
              disabled={!currentPin || currentPin !== confirmPin}
              variant="indigo"
              className="flex-1"
              aria-label={t('save_pin', 'Save PIN')}
            >
              {t('save_pin', 'Save PIN')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-2xl mx-auto" role="region" aria-labelledby="controls-title">
      <h2 id="controls-title" className="text-2xl font-bold text-slate-900 mb-6">
        👨‍👩‍👧 {t('parental_controls_title', 'Parental Controls')}
      </h2>

      <div className="space-y-6">
        {/* Time Limits */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 mb-3">⏰ {t('daily_time_limit', 'Daily Time Limit')}</h3>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="15"
              max="180"
              step={15}
              value={settings.dailyTimeLimit}
              onChange={(e) => setSettings(prev => ({ ...prev, dailyTimeLimit: parseInt(e.target.value) }))}
              className="flex-1"
              aria-label={t('daily_time_limit_minutes', 'Daily time limit in minutes')}
              aria-valuemin={15}
              aria-valuemax={180}
              aria-valuenow={settings.dailyTimeLimit}
            />
            <span className="text-lg font-bold text-indigo-600 min-w-[80px] text-center">
              {formatNumber(settings.dailyTimeLimit)} {t('min', 'min')}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            {t('time_limit_desc', 'Learning session will pause after this time. Can be extended with PIN.')}
          </p>
        </section>

        {/* Allowed Worlds */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 mb-3">🌍 {t('allowed_learning_worlds', 'Allowed Learning Worlds')}</h3>
          <p className="text-sm text-slate-600 mb-4">
            {t('allowed_worlds_desc', 'Select which worlds your child can access based on age appropriateness.')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {WORLDS.map(world => (
              <button
                key={world.id}
                onClick={() => handleWorldToggle(world.id)}
                className={`p-4 rounded-xl border-2 transition ${
                  settings.allowedWorlds.includes(world.id)
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
                aria-pressed={settings.allowedWorlds.includes(world.id)}
                role="button"
              >
                <span className="text-2xl block mb-1" aria-hidden="true">{world.emoji}</span>
                <span className="text-sm font-bold text-slate-800 block">{t(`world_${world.id}`, world.name)}</span>
                <span className="text-xs text-slate-500">{world.ageRange}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Gamification Controls */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 mb-3">🎮 {t('gamification_settings', 'Gamification Settings')}</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableGamification}
                onChange={(e) => setSettings(prev => ({ ...prev, enableGamification: e.target.checked }))}
                className="w-5 h-5 rounded"
                aria-describedby="gamification-desc"
              />
              <div>
                <span className="font-bold text-slate-800">{t('enable_gamification', 'Enable Gamification')}</span>
                <p id="gamification-desc" className="text-sm text-slate-600">
                  {t('gamification_desc', 'XP points, levels, and progress tracking')}
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableStreaks}
                onChange={(e) => setSettings(prev => ({ ...prev, enableStreaks: e.target.checked }))}
                className="w-5 h-5 rounded"
                disabled={!settings.enableGamification}
                aria-describedby="streaks-desc"
              />
              <div>
                <span className="font-bold text-slate-800">{t('enable_streaks', 'Enable Streaks')}</span>
                <p id="streaks-desc" className="text-sm text-slate-600">
                  {t('streaks_desc', 'Daily streak tracking and rewards')}
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableBadges}
                onChange={(e) => setSettings(prev => ({ ...prev, enableBadges: e.target.checked }))}
                className="w-5 h-5 rounded"
                disabled={!settings.enableGamification}
                aria-describedby="badges-desc"
              />
              <div>
                <span className="font-bold text-slate-800">{t('enable_badges', 'Enable Badges')}</span>
                <p id="badges-desc" className="text-sm text-slate-600">
                  {t('badges_desc', 'Achievement badges and rewards')}
                </p>
              </div>
            </label>
          </div>
        </section>

        {/* PIN Protection */}
        <section className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-3">🔐 {t('pin_protection', 'PIN Protection')}</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-700">
                {settings.requirePin
                  ? t('pin_enabled_desc', 'PIN protection is enabled. Changes require PIN.')
                  : t('pin_disabled_desc', 'Require PIN to change these settings or bypass time limits.')}
              </p>
            </div>
            <Button
              onClick={() => settings.requirePin ? setSettings(prev => ({ ...prev, requirePin: false, pin: undefined })) : setShowPinSetup(true)}
              variant={settings.requirePin ? 'danger' : 'indigo'}
              size="sm"
              aria-label={settings.requirePin ? t('disable_pin_protection', 'Disable PIN protection') : t('enable_pin_protection', 'Enable PIN protection')}
            >
              {settings.requirePin ? t('disable_pin', 'Disable PIN') : t('set_pin', 'Set PIN')}
            </Button>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <Button
            onClick={handleSave}
            variant="indigo"
            className="flex-1"
            aria-label={t('save_parental_settings', 'Save parental control settings')}
          >
            {t('save_settings', 'Save Settings')}
          </Button>
          <Button
            onClick={() => setSettings(DEFAULT_SETTINGS)}
            variant="muted"
            aria-label={t('reset_default_settings', 'Reset to default settings')}
          >
            {t('reset_to_default', 'Reset to Default')}
          </Button>
        </div>
      </div>
    </div>
  );
}
