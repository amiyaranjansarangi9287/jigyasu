import { useFavorites as useStorageFavorites } from '@jigyasu/storage';
import { useMemo } from 'react';

export function useFavorites() {
  const { favorites, toggleFavorite, isFavorite, count } = useStorageFavorites<number>('toybox');
  
  // Storage returns string internally, map it back to number for toys UI
  const numberFavorites = useMemo(() => favorites.map(f => Number(f)), [favorites]);
  
  return { 
    favorites: numberFavorites, 
    toggleFavorite, 
    isFavorite,
    count 
  };
}
