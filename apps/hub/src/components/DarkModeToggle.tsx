/**
 * Dark Mode Toggle Component
 * Smooth theme switching with system preference detection
 */

import { useDarkMode } from '../hooks/useDarkMode';
import { motion } from 'framer-motion';
import { useTranslation } from "react-i18next";

export function DarkModeToggle() {
    const { t } = useTranslation();
  const { theme, isDark, setTheme, toggleDarkMode } = useDarkMode();

  return (
    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-full p-1">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-full transition-all ${
          theme === 'light' || (theme === 'system' && !isDark)
            ? 'bg-white dark:bg-slate-700 shadow-sm'
            : 'hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
        aria-label="Light mode"
        title={t('auto.attr.darkmodetoggle.light_mode')}
      >
        <span className="text-lg">☀️</span>
      </button>
      
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-full transition-all ${
          theme === 'system'
            ? 'bg-white dark:bg-slate-700 shadow-sm'
            : 'hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
        aria-label="System theme"
        title={t('auto.attr.darkmodetoggle.system_theme')}
      >
        <span className="text-lg">💻</span>
      </button>
      
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-full transition-all ${
          theme === 'dark' || (theme === 'system' && isDark)
            ? 'bg-white dark:bg-slate-700 shadow-sm'
            : 'hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
        aria-label="Dark mode"
        title={t('auto.attr.darkmodetoggle.dark_mode')}
      >
        <span className="text-lg">🌙</span>
      </button>
    </div>
  );
}
