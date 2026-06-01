// CampCraft - Age Filter Hook

import { useState, useEffect } from 'react';
import { AgeTier } from '../data/categories';

const STORAGE_KEY = 'campcraft-age';

export function useAgeFilter() {
  const [selectedAge, setSelectedAge] = useState<AgeTier | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === '3-5' || stored === '6-8' || stored === '9-12') {
      return stored;
    }
    return null;
  });

  useEffect(() => {
    if (selectedAge) {
      localStorage.setItem(STORAGE_KEY, selectedAge);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [selectedAge]);

  const clearAge = () => setSelectedAge(null);

  return {
    selectedAge,
    setSelectedAge,
    clearAge,
    hasSelectedAge: selectedAge !== null
  };
}
