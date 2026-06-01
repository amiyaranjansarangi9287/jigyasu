/**
 * Dark Mode Hook
 * System preference detection with smooth transitions and theme persistence
 */

import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = 'jigyasu-theme';
const SYSTEM_THEME_KEY = 'jigyasu-system-theme';

export function useDarkMode() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Initialize from localStorage or default to system
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    return savedTheme || 'system';
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Determine actual dark mode state
    const updateDarkMode = () => {
      if (theme === 'dark') {
        setIsDark(true);
        document.documentElement.classList.add('dark');
      } else if (theme === 'light') {
        setIsDark(false);
        document.documentElement.classList.remove('dark');
      } else {
        // System preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(systemPrefersDark);
        if (systemPrefersDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    updateDarkMode();

    // Listen for system theme changes when using system theme
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateDarkMode();
      
      mediaQuery.addEventListener('change', handleChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [theme]);

  const setThemeMode = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  const toggleDarkMode = () => {
    if (theme === 'dark') {
      setThemeMode('light');
    } else if (theme === 'light') {
      setThemeMode('dark');
    } else {
      // If system, toggle to the opposite of current system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeMode(systemPrefersDark ? 'light' : 'dark');
    }
  };

  return {
    theme,
    isDark,
    setTheme: setThemeMode,
    toggleDarkMode,
  };
}
