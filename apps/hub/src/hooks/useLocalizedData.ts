import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity } from '../kidscamp/data/activities.en';
import { PillarId, AgeRange } from '../kidscamp/data/categories';
import fallbackActivities from '../kidscamp/data/activities.en.json';

const activityModules = import.meta.glob('../kidscamp/data/activities.*.json');

export function useLocalizedActivities() {
  const { i18n } = useTranslation();
  const [currentActivities, setCurrentActivities] = useState<Activity[]>(fallbackActivities as unknown as Activity[]);

  useEffect(() => {
    const loadActivities = async () => {
      const lang = i18n.language || 'en';
      const path = `../kidscamp/data/activities.${lang}.json`;
      if (activityModules[path]) {
        const mod: any = await activityModules[path]();
        setCurrentActivities(mod.default as unknown as Activity[]);
      } else {
        setCurrentActivities(fallbackActivities as unknown as Activity[]);
      }
    };
    loadActivities();
  }, [i18n.language]);

  const getActivitiesByPillar = (pillar: PillarId): Activity[] => {
    return currentActivities.filter(a => a.pillar === pillar);
  };

  const getActivitiesByAge = (age: AgeRange): Activity[] => {
    return currentActivities.filter(a => {
      if (a.ageRange === age) return true;
      if (a.ageRange === '3-12') return true;
      if (a.ageRange === '6-12' && (age === '6-8' || age === '9-12')) return true;
      if (a.ageRange === '3-8' && (age === '3-5' || age === '6-8')) return true;
      return false;
    });
  };

  const getFeaturedActivities = (): Activity[] => {
    return currentActivities.filter(a => a.featured);
  };

  const getActivityById = (id: string | undefined): Activity | undefined => {
    if (!id) return undefined;
    return currentActivities.find(a => a.id === id);
  };

  return {
    activities: currentActivities,
    getActivitiesByPillar,
    getActivitiesByAge,
    getFeaturedActivities,
    getActivityById
  };
}
