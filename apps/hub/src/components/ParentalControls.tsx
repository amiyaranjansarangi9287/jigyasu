import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
          🔐 Set Parental PIN
        </h2>
        <p className="text-slate-600 mb-6">
          This PIN will be required to change parental controls or bypass time limits.
        </p>
        <div className="space-y-4">
          <div>
            <label htmlFor="pin-input" className="block text-sm font-bold text-slate-700 mb-2">
              Enter PIN (4 digits)
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
              Use 4 numbers only
            </p>
          </div>
          <div>
            <label htmlFor="confirm-pin-input" className="block text-sm font-bold text-slate-700 mb-2">
              Confirm PIN
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
            <button
              onClick={() => {
                setShowPinSetup(false);
                setCurrentPin('');
                setConfirmPin('');
              }}
              className="flex-1 bg-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-300 transition"
              aria-label="Cancel PIN setup"
              role="button"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setSettings(prev => ({ ...prev, requirePin: true, pin: currentPin }));
                setShowPinSetup(false);
              }}
              disabled={!currentPin || currentPin !== confirmPin}
              className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Save PIN"
              role="button"
            >
              Save PIN
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-2xl mx-auto" role="region" aria-labelledby="controls-title">
      <h2 id="controls-title" className="text-2xl font-bold text-slate-900 mb-6">
        👨‍👩‍👧 Parental Controls
      </h2>

      <div className="space-y-6">
        {/* Time Limits */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 mb-3">⏰ Daily Time Limit</h3>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="15"
              max="180"
              step={15}
              value={settings.dailyTimeLimit}
              onChange={(e) => setSettings(prev => ({ ...prev, dailyTimeLimit: parseInt(e.target.value) }))}
              className="flex-1"
              aria-label="Daily time limit in minutes"
              aria-valuemin={15}
              aria-valuemax={180}
              aria-valuenow={settings.dailyTimeLimit}
            />
            <span className="text-lg font-bold text-indigo-600 min-w-[80px] text-center">
              {settings.dailyTimeLimit} min
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Learning session will pause after this time. Can be extended with PIN.
          </p>
        </section>

        {/* Allowed Worlds */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 mb-3">🌍 Allowed Learning Worlds</h3>
          <p className="text-sm text-slate-600 mb-4">
            Select which worlds your child can access based on age appropriateness.
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
                <span className="text-sm font-bold text-slate-800 block">{world.name}</span>
                <span className="text-xs text-slate-500">{world.ageRange}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Gamification Controls */}
        <section>
          <h3 className="text-lg font-bold text-slate-800 mb-3">🎮 Gamification Settings</h3>
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
                <span className="font-bold text-slate-800">Enable Gamification</span>
                <p id="gamification-desc" className="text-sm text-slate-600">
                  XP points, levels, and progress tracking
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
                <span className="font-bold text-slate-800">Enable Streaks</span>
                <p id="streaks-desc" className="text-sm text-slate-600">
                  Daily streak tracking and rewards
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
                <span className="font-bold text-slate-800">Enable Badges</span>
                <p id="badges-desc" className="text-sm text-slate-600">
                  Achievement badges and rewards
                </p>
              </div>
            </label>
          </div>
        </section>

        {/* PIN Protection */}
        <section className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-3">🔐 PIN Protection</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-700">
                {settings.requirePin
                  ? 'PIN protection is enabled. Changes require PIN.'
                  : 'Require PIN to change these settings or bypass time limits.'}
              </p>
            </div>
            <button
              onClick={() => settings.requirePin ? setSettings(prev => ({ ...prev, requirePin: false, pin: undefined })) : setShowPinSetup(true)}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                settings.requirePin
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
              aria-label={settings.requirePin ? 'Disable PIN protection' : 'Enable PIN protection'}
              role="button"
            >
              {settings.requirePin ? 'Disable PIN' : 'Set PIN'}
            </button>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={handleSave}
            className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition"
            aria-label="Save parental control settings"
            role="button"
          >
            Save Settings
          </button>
          <button
            onClick={() => setSettings(DEFAULT_SETTINGS)}
            className="px-6 py-3 bg-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-300 transition"
            aria-label="Reset to default settings"
            role="button"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
