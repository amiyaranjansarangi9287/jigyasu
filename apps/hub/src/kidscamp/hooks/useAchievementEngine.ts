import { useEffect } from 'react';
import { useActivityStatus, useAchievements, useCampWeekStatus, useFavorites, useSoundEffects } from '../hooks';

export function useAchievementEngine() {
  const { getCompletedCount, getCompletedByPillar, getTotalTime } = useActivityStatus();
  const { count: favoritesCount } = useFavorites();
  const { isUnlocked, unlock } = useAchievements();
  const { getCompletedWeeksCount } = useCampWeekStatus();
  const { playAchievement } = useSoundEffects();

  useEffect(() => {
    const completedCount = getCompletedCount();
    const totalTime = getTotalTime();

    // Milestone achievements
    if (completedCount >= 1 && !isUnlocked('first-activity')) {
      unlock('first-activity');
      playAchievement();
    }
    if (completedCount >= 5 && !isUnlocked('getting-started')) {
      unlock('getting-started');
      playAchievement();
    }
    if (completedCount >= 10 && !isUnlocked('double-digits')) {
      unlock('double-digits');
      playAchievement();
    }
    if (completedCount >= 25 && !isUnlocked('quarter-century')) {
      unlock('quarter-century');
      playAchievement();
    }
    if (completedCount >= 50 && !isUnlocked('super-camper')) {
      unlock('super-camper');
      playAchievement();
    }
    if (completedCount >= 60 && !isUnlocked('camp-legend')) {
      unlock('camp-legend');
      playAchievement();
    }

    // Pillar achievements
    const toyboxCount = getCompletedByPillar('toybox');
    const sciencelabCount = getCompletedByPillar('sciencelab');

    if (toyboxCount >= 1 && !isUnlocked('toybox-starter')) {
      unlock('toybox-starter');
      playAchievement();
    }
    if (toyboxCount >= 10 && !isUnlocked('toybox-master')) {
      unlock('toybox-master');
      playAchievement();
    }
    if (sciencelabCount >= 1 && !isUnlocked('sciencelab-starter')) {
      unlock('sciencelab-starter');
      playAchievement();
    }
    if (sciencelabCount >= 10 && !isUnlocked('sciencelab-master')) {
      unlock('sciencelab-master');
      playAchievement();
    }
    // Renaissance camper
    if (toyboxCount >= 1 && sciencelabCount >= 1 && !isUnlocked('renaissance-camper')) {
      unlock('renaissance-camper');
      playAchievement();
    }

    // Favorites achievement
    if (favoritesCount >= 10 && !isUnlocked('collector')) {
      unlock('collector');
      playAchievement();
    }

    // Marathon maker (5 hours = 18000 seconds)
    if (totalTime >= 18000 && !isUnlocked('marathon-maker')) {
      unlock('marathon-maker');
      playAchievement();
    }

    // Camp week achievements
    const completedWeeks = getCompletedWeeksCount();
    if (completedWeeks >= 1 && !isUnlocked('first-camp-week')) {
      unlock('first-camp-week');
      playAchievement();
    }
    if (completedWeeks >= 4 && !isUnlocked('summer-champion')) {
      unlock('summer-champion');
      playAchievement();
    }
  }, [
    getCompletedCount,
    getTotalTime,
    getCompletedByPillar,
    favoritesCount,
    getCompletedWeeksCount,
    isUnlocked,
    unlock,
    playAchievement
  ]);
}
