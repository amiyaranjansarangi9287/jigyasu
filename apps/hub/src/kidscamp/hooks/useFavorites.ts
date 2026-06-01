// CampCraft - Favorites Hook

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'campcraft-favorites';

function loadFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((activityId: string) => {
    setFavorites(prev => {
      if (prev.includes(activityId)) return prev;
      return [...prev, activityId];
    });
  }, []);

  const removeFavorite = useCallback((activityId: string) => {
    setFavorites(prev => prev.filter(id => id !== activityId));
  }, []);

  const toggleFavorite = useCallback((activityId: string) => {
    setFavorites(prev => {
      if (prev.includes(activityId)) {
        return prev.filter(id => id !== activityId);
      }
      return [...prev, activityId];
    });
  }, []);

  const isFavorite = useCallback((activityId: string): boolean => {
    return favorites.includes(activityId);
  }, [favorites]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    count: favorites.length
  };
}
