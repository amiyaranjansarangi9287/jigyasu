import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { useCallback, useState, useEffect } from 'react';

export function useFavorites<T extends string | number>(appId: string) {
  const favoritesRecords = useLiveQuery(
    () => db.favorites.where('appId').equals(appId).toArray(),
    [appId]
  );
  
  // Local state for optimistic updates
  const [localFavs, setLocalFavs] = useState<string[]>([]);
  
  // Sync local state when Dexie updates
  useEffect(() => {
    if (favoritesRecords) {
      setLocalFavs(favoritesRecords.map(r => String(r.activityId)));
    }
  }, [favoritesRecords]);

  const toggleFavorite = useCallback(async (activityId: T) => {
    const id = `${appId}:${activityId}`;
    const activityIdStr = String(activityId);
    
    // Optimistic UI update
    setLocalFavs(prev => prev.includes(activityIdStr) ? prev.filter(f => f !== activityIdStr) : [...prev, activityIdStr]);
    
    // DB update
    const existing = await db.favorites.get(id);
    if (existing) {
      await db.favorites.delete(id);
    } else {
      await db.favorites.put({
        id,
        appId,
        activityId: activityIdStr,
        addedAt: Date.now()
      });
    }
  }, [appId]);

  const addFavorite = useCallback(async (activityId: T) => {
    const id = `${appId}:${activityId}`;
    const activityIdStr = String(activityId);
    setLocalFavs(prev => prev.includes(activityIdStr) ? prev : [...prev, activityIdStr]);
    const existing = await db.favorites.get(id);
    if (!existing) {
      await db.favorites.put({
        id,
        appId,
        activityId: activityIdStr,
        addedAt: Date.now()
      });
    }
  }, [appId]);

  const removeFavorite = useCallback(async (activityId: T) => {
    const id = `${appId}:${activityId}`;
    const activityIdStr = String(activityId);
    setLocalFavs(prev => prev.filter(f => f !== activityIdStr));
    await db.favorites.delete(id);
  }, [appId]);

  const isFavorite = useCallback((activityId: T) => {
    return localFavs.includes(String(activityId));
  }, [localFavs]);

  // Consumer can map this to number[] if needed
  const mappedFavorites = localFavs as unknown as T[];

  return {
    favorites: mappedFavorites,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    isFavorite,
    count: localFavs.length
  };
}
