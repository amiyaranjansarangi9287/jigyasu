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

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GestureWrapper from '../../components/GestureWrapper';
import { HeartBurst as HeartButton } from '../../components/MicroInteractions';

export default React.memo(function ActivityCard({
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
        <span className="absolute top-3 left-3 z-10 px-2 py-1 rounded-full bg-green-500 text-white text-sm font-medium flex items-center gap-1 shadow-lg">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          Completed
        </span>
      );
    }
    if (status === 'in-progress') {
      return (
        <span className="absolute top-3 left-3 z-10 px-2 py-1 rounded-full bg-orange-500 text-white text-sm font-medium shadow-lg">
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

  const contextMenu = (
    <>
      <button 
        className="w-full text-left px-4 py-3 hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-2 rounded-xl transition-colors"
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(activity.id); }}
      >
        <span className={isFavorite ? 'text-pink-500' : 'text-slate-400'}>♥</span> {isFavorite ? 'Remove Favorite' : 'Save to Favorites'}
      </button>
      <button 
        className="w-full text-left px-4 py-3 hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-2 rounded-xl transition-colors"
        onClick={(e) => { e.stopPropagation(); onStart(activity); }}
      >
        🚀 {getButtonText()}
      </button>
    </>
  );

  if (variant === 'horizontal') {
    return (
      <GestureWrapper contextMenu={contextMenu} className="w-full">
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
            onError={(e) => {
              e.currentTarget.src = '/images/fallback-placeholder.png';
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{pillar?.icon}</span>
            <span className={`px-2 py-0.5 rounded-full text-sm font-medium ${difficultyColors[activity.difficulty]}`}>
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
          <HeartButton 
            isFavorite={isFavorite} 
            onToggle={(e) => {
              e.stopPropagation();
              onToggleFavorite(activity.id);
            }} 
            className={`p-2 rounded-full transition-colors ${isFavorite ? 'text-pink-500' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          />
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
      </GestureWrapper>
    );
  }

  if (variant === 'compact') {
    return (
      <GestureWrapper contextMenu={contextMenu} className="w-full">
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
            <p className="text-sm text-gray-500">{activity.difficulty}</p>
          </div>
          {status === 'completed' && (
            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        </button>
      </GestureWrapper>
    );
  }

  // Default card variant
  return (
    <GestureWrapper contextMenu={contextMenu} className="w-full">
      <div
        className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 hover:-translate-y-1"
        onClick={() => onSelect(activity)}
      >
      {/* Image */}
      <div className="relative h-40 overflow-hidden aspect-[16/10]">
        <img
          src={activity.image}
          alt={activity.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/images/fallback-placeholder.png';
          }}
        />
        {/* Status Badge */}
        {getStatusBadge()}

        <HeartButton 
          isFavorite={isFavorite} 
          onToggle={(e) => {
            e.stopPropagation();
            onToggleFavorite(activity.id);
          }} 
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full shadow-lg transition-all hover:scale-110 bg-white/90 dark:bg-gray-900/90 ${isFavorite ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'}`}
        />

        {/* Quick Start Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStart(activity);
          }}
          className="absolute bottom-3 right-3 z-10 btn btn-primary text-sm px-3 py-1.5 shadow-lg"
        >
          {getButtonText()}
        </button>

        {/* Pillar Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className={`px-2.5 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${pillarColors[activity.pillar]}`}>
            {pillar?.icon} {pillar?.name}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 rounded-full text-sm font-medium ${difficultyColors[activity.difficulty]}`}>
            {activity.difficulty}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {activity.timeToMake}
          </span>
          <span className="text-sm text-gray-400 dark:text-gray-500">
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
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {activity.steps.length} steps
          </div>
        </div>
      </div>
      </div>
    </GestureWrapper>
  );
});
