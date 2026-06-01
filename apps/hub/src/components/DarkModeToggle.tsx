/**
 * Dark Mode Toggle Component
 * Smooth theme switching with system preference detection
 */

import { useDarkMode } from '../hooks/useDarkMode';
import { motion } from 'framer-motion';

export function DarkModeToggle() {
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
        title="Light mode"
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
        title="System theme"
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
        title="Dark mode"
      >
        <span className="text-lg">🌙</span>
      </button>
    </div>
  );
}
