// CampCraft - Activity Card Component

import { Activity } from '../data/activities';
import { pillars } from '../data/categories';

interface ActivityCardProps {
  activity: Activity;
  onSelect: (activity: Activity) => void;
  onStart: (activity: Activity) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  status: 'not-started' | 'in-progress' | 'completed';
  variant?: 'default' | 'compact' | 'horizontal';
}

export default function ActivityCard({
  activity,
  onSelect,
  onStart,
  isFavorite,
  onToggleFavorite,
  status,
  variant = 'default'
}: ActivityCardProps) {
  const pillar = pillars.find(p => p.id === activity.pillar);

  const difficultyColors = {
    Easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    Hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  };

  const pillarColors = {
    toybox: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    sciencelab: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    artstudio: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    outdoorquest: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  };

  const getStatusBadge = () => {
    if (status === 'completed') {
      return (
        <span className="absolute top-3 left-3 z-10 px-2 py-1 rounded-full bg-green-500 text-white text-xs font-medium flex items-center gap-1 shadow-lg">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          Completed
        </span>
      );
    }
    if (status === 'in-progress') {
      return (
        <span className="absolute top-3 left-3 z-10 px-2 py-1 rounded-full bg-orange-500 text-white text-xs font-medium shadow-lg">
          In Progress
        </span>
      );
    }
    return null;
  };

  const getButtonText = () => {
    if (status === 'completed') return '🔄 Rebuild';
    if (status === 'in-progress') return '▶ Continue';
    return '🚀 Start';
  };

  if (variant === 'horizontal') {
    return (
      <div
        className="group flex gap-4 p-4 rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700"
        onClick={() => onSelect(activity)}
      >
        {/* Image */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
          <img
            src={activity.image}
            alt={activity.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {status !== 'not-started' && (
            <div className={`absolute inset-0 flex items-center justify-center ${status === 'completed' ? 'bg-green-500/80' : 'bg-orange-500/80'}`}>
              {status === 'completed' ? (
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{pillar?.icon}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[activity.difficulty]}`}>
              {activity.difficulty}
            </span>
          </div>
          <h4 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-orange-500 transition-colors">
            {activity.name}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
            {activity.timeToMake} • Ages {activity.ageRange}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(activity.id);
            }}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg
              className={`w-5 h-5 ${isFavorite ? 'text-pink-500 fill-current' : 'text-gray-400'}`}
              fill={isFavorite ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStart(activity);
            }}
            className="btn btn-primary text-sm px-3 py-1.5"
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={() => onSelect(activity)}
        className="group text-left p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{pillar?.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate group-hover:text-orange-500 transition-colors">
              {activity.name}
            </p>
            <p className="text-xs text-gray-500">{activity.difficulty}</p>
          </div>
          {status === 'completed' && (
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </button>
    );
  }

  // Default card variant
  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 hover:-translate-y-1"
      onClick={() => onSelect(activity)}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={activity.image}
          alt={activity.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Status Badge */}
        {getStatusBadge()}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(activity.id);
          }}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 ${
            isFavorite 
              ? 'bg-pink-500 text-white' 
              : 'bg-white/90 dark:bg-gray-900/90 text-gray-400 hover:text-pink-500'
          }`}
        >
          <svg
            className="w-5 h-5"
            fill={isFavorite ? 'currentColor' : 'none'}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Quick Start Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStart(activity);
          }}
          className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity btn btn-primary text-sm px-3 py-1.5"
        >
          {getButtonText()}
        </button>

        {/* Pillar Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${pillarColors[activity.pillar]}`}>
            {pillar?.icon} {pillar?.name}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[activity.difficulty]}`}>
            {activity.difficulty}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {activity.timeToMake}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Ages {activity.ageRange}
          </span>
        </div>

        <h4 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-orange-500 transition-colors line-clamp-1">
          {activity.name}
        </h4>

        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
          {activity.description}
        </p>

        {/* Rating & Reviews */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm">
            <span className="text-yellow-500">★</span>
            <span className="font-medium text-gray-700 dark:text-gray-200">{activity.rating}</span>
            <span className="text-gray-400">({activity.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {activity.steps.length} steps
          </div>
        </div>
      </div>
    </div>
  );
}
