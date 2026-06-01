// CampCraft - Theme Hook

import { useState, useEffect, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'campcraft-theme';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;
  
  if (effectiveTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    return stored || 'light';
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }, []);

  return {
    theme,
    setTheme,
    toggleTheme,
    effectiveTheme: theme === 'system' ? getSystemTheme() : theme
  };
}
