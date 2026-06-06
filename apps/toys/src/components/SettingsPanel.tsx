type ThemeOption = 'light' | 'dark' | 'system';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeOption;
  onThemeChange: (theme: ThemeOption) => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

export default function SettingsPanel({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  soundEnabled,
  onSoundToggle,
}: SettingsPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md p-6 animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
           aria-label="Action button">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Theme */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            🎨 Appearance
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['light', 'dark', 'system'] as const).map((t) => (
              <button
                key={t}
                onClick={() => onThemeChange(t)}
                className={`py-3 px-4 rounded-xl font-semibold text-sm transition-all ${
                  theme === t
                    ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 ring-2 ring-violet-500'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t === 'light' && '☀️ Light'}
                {t === 'dark' && '🌙 Dark'}
                {t === 'system' && '💻 System'}
              </button>
            ))}
          </div>
        </div>

        {/* Sound */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                🔊 Sound Effects
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Play sounds when completing steps
              </p>
            </div>
            <button
              onClick={onSoundToggle}
              className={`w-14 h-8 rounded-full transition-colors relative ${
                soundEnabled ? 'bg-violet-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
             aria-label="Action button">
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  soundEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="border-t border-gray-100 dark:border-gray-700 pt-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-lg">
              🧸
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">ToyBox</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Version 1.0.0</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            Crafted with ❤️ for makers everywhere
          </p>
        </div>
      </div>
    </div>
  );
}
