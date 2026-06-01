import { useState, useMemo } from 'react';
import { Activity } from '../data/activities';
import { PillarId, AgeTier, Difficulty } from '../data/categories';

type SortOption = 'name' | 'difficulty' | 'time' | 'rating' | 'popular';

interface UseActivityFiltersProps {
  activities: Activity[];
  initialPillar?: PillarId | null;
  initialAge?: AgeTier | null;
}

export function useActivityFilters({ activities, initialPillar = null, initialAge = null }: UseActivityFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<PillarId | 'all'>(initialPillar || 'all');
  const [selectedAge, setSelectedAge] = useState<AgeTier | 'all'>(initialAge || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  const filteredActivities = useMemo(() => {
    let result = [...activities];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a =>
        a.name.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query) ||
        a.category.toLowerCase().includes(query)
      );
    }

    // Pillar filter
    if (selectedPillar !== 'all') {
      result = result.filter(a => a.pillar === selectedPillar);
    }

    // Age filter
    if (selectedAge !== 'all') {
      result = result.filter(a => {
        if (a.ageRange === selectedAge) return true;
        if (a.ageRange === '3-12') return true;
        if (a.ageRange === '6-12' && (selectedAge === '6-8' || selectedAge === '9-12')) return true;
        if (a.ageRange === '3-8' && (selectedAge === '3-5' || selectedAge === '6-8')) return true;
        return false;
      });
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      result = result.filter(a => a.difficulty === selectedDifficulty);
    }

    // Sort
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'difficulty': {
        const diffOrder = { Easy: 1, Medium: 2, Hard: 3 };
        result.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
        break;
      }
      case 'time':
        result.sort((a, b) => {
          const getMinutes = (time: string) => {
            const match = time.match(/(\d+)/);
            return match ? parseInt(match[1]) : 999;
          };
          return getMinutes(a.timeToMake) - getMinutes(b.timeToMake);
        });
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return result;
  }, [searchQuery, selectedPillar, selectedAge, selectedDifficulty, sortBy, activities]);

  const activeFilterCount = [
    selectedPillar !== 'all',
    selectedAge !== 'all',
    selectedDifficulty !== 'all'
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedPillar('all');
    setSelectedAge('all');
    setSelectedDifficulty('all');
    setSearchQuery('');
  };

  return {
    filteredActivities,
    searchQuery,
    setSearchQuery,
    selectedPillar,
    setSelectedPillar,
    selectedAge,
    setSelectedAge,
    selectedDifficulty,
    setSelectedDifficulty,
    sortBy,
    setSortBy,
    activeFilterCount,
    clearFilters
  };
}
