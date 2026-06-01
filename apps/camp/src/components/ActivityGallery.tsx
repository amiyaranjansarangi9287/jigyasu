// CampCraft - Activity Gallery with Filters

import { useState, useMemo } from 'react';
import { activities, Activity } from '../data/activities';
import { pillars, ageTiers, PillarId, AgeTier, Difficulty } from '../data/categories';
import ActivityCard from './ActivityCard';
import { useReveal } from '../hooks/useReveal';

interface ActivityGalleryProps {
  onSelectActivity: (activity: Activity) => void;
  onStartActivity: (activity: Activity) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  getStatus: (id: string) => 'not-started' | 'in-progress' | 'completed';
  initialPillar?: PillarId | null;
  initialAge?: AgeTier | null;
}

type SortOption = 'name' | 'difficulty' | 'time' | 'rating' | 'popular';
type ViewMode = 'grid' | 'list';

export default function ActivityGallery({
  onSelectActivity,
  onStartActivity,
  isFavorite,
  onToggleFavorite,
  getStatus,
  initialPillar = null,
  initialAge = null
}: ActivityGalleryProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<PillarId | 'all'>(initialPillar || 'all');
  const [selectedAge, setSelectedAge] = useState<AgeTier | 'all'>(initialAge || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Update filters when initial props change
  useState(() => {
    if (initialPillar) setSelectedPillar(initialPillar);
    if (initialAge) setSelectedAge(initialAge);
  });

  // Filter and sort activities
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
      case 'difficulty':
        const diffOrder = { Easy: 1, Medium: 2, Hard: 3 };
        result.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
        break;
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
  }, [searchQuery, selectedPillar, selectedAge, selectedDifficulty, sortBy]);

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

  return (
    <section className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div
          ref={ref}
          className={`text-center mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            All Activities
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Explore {activities.length} hands-on projects across science, art, building, and outdoor adventures
          </p>
        </div>

        {/* Quick Filter Pills - Always visible */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
          {pillars.map((pillar) => (
            <button
              key={pillar.id}
              onClick={() => setSelectedPillar(selectedPillar === pillar.id ? 'all' : pillar.id as PillarId)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full font-medium transition-all ${
                selectedPillar === pillar.id
                  ? `bg-gradient-to-r ${pillar.gradientFrom} ${pillar.gradientTo} text-white shadow-md`
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{pillar.icon}</span>
              <span className="text-sm">{pillar.name}</span>
            </button>
          ))}
        </div>

        {/* Search & Filters Bar */}
        <div className="mb-6 space-y-4">
          {/* Top Row: Search + View Toggle */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/30 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Filter Toggle + View Mode */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                  showFilters || activeFilterCount > 0
                    ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20 text-orange-600'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:border-gray-300'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-fade-in-down">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Pillar Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pillar
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedPillar('all')}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedPillar === 'all'
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      All
                    </button>
                    {pillars.map((pillar) => (
                      <button
                        key={pillar.id}
                        onClick={() => setSelectedPillar(pillar.id as PillarId)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${
                          selectedPillar === pillar.id
                            ? `bg-gradient-to-r ${pillar.gradientFrom} ${pillar.gradientTo} text-white`
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {pillar.icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Age Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Age Group
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedAge('all')}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedAge === 'all'
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      All
                    </button>
                    {ageTiers.map((tier) => (
                      <button
                        key={tier.id}
                        onClick={() => setSelectedAge(tier.id as AgeTier)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          selectedAge === tier.id
                            ? `bg-gradient-to-r ${tier.color} text-white`
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {tier.icon} {tier.id}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setSelectedDifficulty(diff === 'all' ? 'all' : diff as Difficulty)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          selectedDifficulty === diff
                            ? diff === 'Easy' ? 'bg-emerald-500 text-white'
                              : diff === 'Medium' ? 'bg-amber-500 text-white'
                              : diff === 'Hard' ? 'bg-red-500 text-white'
                              : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {diff === 'all' ? 'All' : diff}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:border-orange-400 outline-none"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="difficulty">Difficulty</option>
                    <option value="time">Quickest First</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {activeFilterCount > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Showing <span className="font-medium text-gray-900 dark:text-white">{filteredActivities.length}</span> activities
          </p>
          {activeFilterCount > 0 && !showFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Activities Grid/List */}
        {filteredActivities.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No activities found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Try adjusting your filters or search terms
            </p>
            <button onClick={clearFilters} className="btn btn-primary">
              Clear All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredActivities.map((activity, index) => (
              <div
                key={activity.id}
                className={`transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${Math.min(index * 50, 500)}ms` }}
              >
                <ActivityCard
                  activity={activity}
                  onSelect={onSelectActivity}
                  onStart={onStartActivity}
                  isFavorite={isFavorite(activity.id)}
                  onToggleFavorite={onToggleFavorite}
                  status={getStatus(activity.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity, index) => (
              <div
                key={activity.id}
                className={`transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${Math.min(index * 30, 300)}ms` }}
              >
                <ActivityCard
                  activity={activity}
                  onSelect={onSelectActivity}
                  onStart={onStartActivity}
                  isFavorite={isFavorite(activity.id)}
                  onToggleFavorite={onToggleFavorite}
                  status={getStatus(activity.id)}
                  variant="horizontal"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
