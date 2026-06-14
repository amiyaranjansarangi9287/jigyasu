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
      try {
        const lang = i18n.language || 'en';
        const path = `../kidscamp/data/activities.${lang}.json`;
        if (activityModules[path]) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const mod: any = await activityModules[path]();
          const translatedList = mod.default;
          
          if (Array.isArray(translatedList) && translatedList.length === fallbackActivities.length) {
            const merged = fallbackActivities.map((base: any, i: number) => {
              const trans = translatedList[i];
              return {
                ...base,
                // Take translated text
                name: trans.name || base.name,
                description: trans.description || base.description,
                timeToMake: trans.timeToMake || base.timeToMake,
                materials: trans.materials || base.materials,
                steps: trans.steps || base.steps,
                safetyNotes: trans.safetyNotes || base.safetyNotes,
                learningOutcomes: trans.learningOutcomes || base.learningOutcomes,
                
                // Preserve technical fields from base
                id: base.id,
                pillar: base.pillar,
                category: base.category,
                ageRange: base.ageRange,
                difficulty: base.difficulty,
                image: base.image,
                demoMedia: base.demoMedia,
                featured: base.featured,
                rating: base.rating,
                reviewCount: base.reviewCount,
                isPremium: base.isPremium,
                url: base.url
              };
            const filteredMerged = merged.filter((a: any) => a.pillar !== 'outdoorquest' && a.pillar !== 'artstudio');
            setCurrentActivities(filteredMerged as unknown as Activity[]);
          } else {
            const filteredTranslated = translatedList.filter((a: any) => a.pillar !== 'outdoorquest' && a.pillar !== 'artstudio');
            setCurrentActivities(filteredTranslated as unknown as Activity[]);
          }
        } else {
          const filteredFallback = fallbackActivities.filter((a: any) => a.pillar !== 'outdoorquest' && a.pillar !== 'artstudio');
          setCurrentActivities(filteredFallback as unknown as Activity[]);
        }
      } catch {
        const filteredFallback = fallbackActivities.filter((a: any) => a.pillar !== 'outdoorquest' && a.pillar !== 'artstudio');
        setCurrentActivities(filteredFallback as unknown as Activity[]);
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
