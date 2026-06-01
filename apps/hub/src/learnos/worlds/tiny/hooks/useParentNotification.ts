// src/worlds/tiny/hooks/useParentNotification.ts

import { useCallback } from 'react';
import type { TinyProgress } from '../types/tiny.types';
import { PARENT_NOTIFICATIONS } from '../data/tinyContent';

export function useParentNotification() {
  const generateSessionSummary = useCallback((
    progress: TinyProgress,
    sessionMinutes: number
  ): string[] => {
    const notifications: string[] = [];

    if (progress.animalsDiscovered.length > 0) {
      const lastAnimal = progress.animalsDiscovered[progress.animalsDiscovered.length - 1];
      notifications.push(PARENT_NOTIFICATIONS.animal_discovered(lastAnimal));
    }
    if (progress.colorsMixed.length >= 3) {
      notifications.push(PARENT_NOTIFICATIONS.all_colors_mixed());
    }
    if (progress.shapesMatched.length >= 4) {
      notifications.push(PARENT_NOTIFICATIONS.all_shapes_matched());
    }
    if (progress.groupPerformanceCount > 0) {
      notifications.push(PARENT_NOTIFICATIONS.orchestra_complete());
    }
    if (progress.nightDiscovered) {
      notifications.push(PARENT_NOTIFICATIONS.night_discovered());
    }
    if (progress.farmCompleted) {
      notifications.push(PARENT_NOTIFICATIONS.farm_complete());
    }
    if (sessionMinutes >= 2) {
      notifications.push(PARENT_NOTIFICATIONS.great_session(sessionMinutes));
    }

    return notifications;
  }, []);

  return { generateSessionSummary };
}
