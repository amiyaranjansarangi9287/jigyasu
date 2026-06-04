import { Theme } from '../hooks/useTheme';
import { useTranslation } from 'react-i18next';

interface Props {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  setSettingsOpen: (open: boolean) => void;
}

export default function SettingsModal({
  theme,
  setTheme,
  soundEnabled,
  toggleSound,
  setSettingsOpen
}: Props) {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setSettingsOpen(false)}
      />
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 animate-modal-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('kidscamp.settings.title', 'Settings')}</h2>
          <button
            onClick={() => setSettingsOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Theme */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">{t('kidscamp.settings.theme', 'Theme')}</h4>
          <div className="flex gap-2">
            {(['light', 'dark', 'system'] as const).map((themeOption) => (
              <button
                key={themeOption}
                onClick={() => setTheme(themeOption)}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                  theme === themeOption
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {themeOption === 'light' ? '☀️ ' + t('kidscamp.settings.light', 'Light') : themeOption === 'dark' ? '🌙 ' + t('kidscamp.settings.dark', 'Dark') : '💻 ' + t('kidscamp.settings.system', 'System')}
              </button>
            ))}
          </div>
        </div>

        {/* Sound */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">{t('kidscamp.settings.sound_effects', 'Sound Effects')}</h4>
              <p className="text-sm text-gray-500">{t('kidscamp.settings.sound_desc', 'Play sounds on actions')}</p>
            </div>
            <button
              onClick={toggleSound}
              className={`w-14 h-8 rounded-full transition-colors ${
                soundEnabled ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow transition-transform ${
                  soundEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">CampCraft v1.0 • {t('kidscamp.settings.made_with', 'Made with ❤️ for creative families')}</p>
        </div>
      </div>
    </div>
  );
}
