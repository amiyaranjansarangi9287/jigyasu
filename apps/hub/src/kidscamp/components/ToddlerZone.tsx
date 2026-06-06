// CampCraft - Toddler Zone (Ages 3-5 Special UI)

import { useState } from 'react';
import { activities, Activity } from '../data/activities.en';
import { useLocalizedActivities } from '../../hooks/useLocalizedData';
import { pillars } from '../data/categories';
import { useTranslation } from 'react-i18next';

interface ToddlerZoneProps {
  onSelectActivity: (activity: Activity) => void;
  onStartActivity: (activity: Activity) => void;
  onExitToddlerZone: () => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  getStatus: (id: string) => 'not-started' | 'in-progress' | 'completed';
}

export default function ToddlerZone({
  onSelectActivity,
  onStartActivity,
  onExitToddlerZone,
  isFavorite,
  onToggleFavorite,
  getStatus
}: ToddlerZoneProps) {
  const { t } = useTranslation();
  const { activities } = useLocalizedActivities();
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null);

  // Filter activities for ages 3-5
  const toddlerActivities = activities.filter(a => 
    a.ageRange === '3-5' || a.ageRange === '3-12' || a.ageRange === '3-8'
  );

  const filteredActivities = selectedPillar
    ? toddlerActivities.filter(a => a.pillar === selectedPillar)
    : toddlerActivities;

  const getPillarCount = (pillarId: string) => {
    return toddlerActivities.filter(a => a.pillar === pillarId).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-purple-50 to-blue-100 dark:from-pink-900/30 dark:via-purple-900/20 dark:to-blue-900/30 toddler-zone pt-[72px]">
      {/* Header */}
      <header className="sticky top-[72px] z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl animate-bounce-slow">🐣</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t('kidscamp.toddler.title', 'Little Explorers')}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('kidscamp.toddler.ages', 'Ages 3-5')}</p>
              </div>
            </div>
            <button
              onClick={onExitToddlerZone}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors font-bold text-lg shadow-sm"
              style={{ minWidth: '140px', minHeight: '48px' }}
             aria-label="Action button">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>{t('kidscamp.toddler.exit_zone', 'Exit Zone')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-3xl p-8 text-center text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-4 left-8 text-5xl animate-float">⭐</div>
            <div className="absolute top-8 right-12 text-4xl animate-float-slow">🌈</div>
            <div className="absolute bottom-4 left-1/4 text-3xl animate-bounce-slow">🎈</div>
            <div className="absolute bottom-8 right-1/4 text-4xl animate-wiggle">🦋</div>

            <h2 className="text-3xl md:text-4xl font-bold mb-3 relative">
              {t('kidscamp.toddler.welcome', 'Welcome, Little Explorer! 👋')}
            </h2>
            <p className="text-xl text-white/90 max-w-xl mx-auto relative">
              {t('kidscamp.toddler.welcome_desc', "Let's make something amazing today! Pick an activity below.")}
            </p>
          </div>
        </div>
      </section>

      {/* Pillar Selection - Big Buttons */}
      <section className="px-4 pb-8">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            {t('kidscamp.toddler.what_to_do', 'What do you want to do? 🤔')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* All button */}
            <button
              onClick={() => setSelectedPillar(null)}
              className={`p-6 rounded-3xl transition-all duration-300 ${
                selectedPillar === null
                  ? 'bg-gradient-to-br from-orange-400 to-pink-500 text-white shadow-xl scale-105'
                  : 'bg-white dark:bg-gray-800 hover:shadow-lg hover:scale-105 border-2 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="text-5xl mb-2">🌟</div>
              <div className={`font-bold text-lg ${selectedPillar === null ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                {t('kidscamp.toddler.all_fun', 'All Fun!')}
              </div>
              <div className={`text-sm ${selectedPillar === null ? 'text-white/80' : 'text-gray-500'}`}>
                {toddlerActivities.length} {t('kidscamp.toddler.activities_count', 'activities')}
              </div>
            </button>

            {/* Pillar buttons */}
            {pillars.map((pillar) => {
              const count = getPillarCount(pillar.id);
              if (count === 0) return null;

              return (
                <button
                  key={pillar.id}
                  onClick={() => setSelectedPillar(pillar.id)}
                  className={`p-6 rounded-3xl transition-all duration-300 ${
                    selectedPillar === pillar.id
                      ? `bg-gradient-to-br ${pillar.gradientFrom} ${pillar.gradientTo} text-white shadow-xl scale-105`
                      : 'bg-white dark:bg-gray-800 hover:shadow-lg hover:scale-105 border-2 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="text-5xl mb-2">{pillar.icon}</div>
                  <div className={`font-bold text-lg ${selectedPillar === pillar.id ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    {t(`pillar_${pillar.id}` as any, pillar.name || '')}
                  </div>
                  <div className={`text-sm ${selectedPillar === pillar.id ? 'text-white/80' : 'text-gray-500'}`}>
                    {count} {t('kidscamp.toddler.activities_count', 'activities')}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Activities Grid - Large Cards */}
      <section className="px-4 pb-16">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {selectedPillar 
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ? `${pillars.find(p => p.id === selectedPillar)?.icon} ${t(`pillar_${selectedPillar}` as any, pillars.find(p => p.id === selectedPillar)?.name || '')} ${t('kidscamp.toddler.activities_suffix', 'Activities')}`
              : t('kidscamp.toddler.all_activities', '🎉 All Activities')}
            <span className="text-gray-400 font-normal ml-2">({filteredActivities.length})</span>
          </h3>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => {
              const pillar = pillars.find(p => p.id === activity.pillar);
              const status = getStatus(activity.id);

              return (
                <div
                  key={activity.id}
                  className="group bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-pink-300 dark:hover:border-pink-600"
                >
                  {/* Image */}
                  <div className="relative min-h-40 overflow-hidden">
                    <img
                      src={activity.image}
                      alt={activity.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = '/images/fallback-placeholder.png';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Status Badge */}
                    {status === 'completed' && (
                      <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-green-500 text-white text-sm font-bold flex items-center gap-1 shadow-lg">
                        <span>✓</span> {t('kidscamp.toddler.done_badge', 'Done!')}
                      </div>
                    )}
                    {status === 'in-progress' && (
                      <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-orange-500 text-white text-sm font-bold shadow-lg">
                        {t('kidscamp.toddler.started_badge', 'Started!')}
                      </div>
                    )}

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(activity.id);
                      }}
                      className={`absolute top-3 right-3 w-12 min-h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                        isFavorite(activity.id)
                          ? 'bg-pink-500 text-white scale-110'
                          : 'bg-white/90 text-gray-400 hover:scale-110'
                      }`}
                    >
                      <svg
                        className="w-7 h-7"
                        fill={isFavorite(activity.id) ? 'currentColor' : 'none'}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>

                    {/* Pillar Icon */}
                    <div className="absolute bottom-3 left-3 w-12 min-h-12 rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center text-2xl shadow-lg">
                      {pillar?.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {activity.name}
                    </h4>

                    {/* Info badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium">
                        Easy
                      </span>
                      <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm">
                        ⏱️ {activity.timeToMake}
                      </span>
                    </div>

                    {/* Parent Help Indicator */}
                    <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 mb-4">
                      <span>👨‍👩‍👧</span>
                      <span>With a grown-up</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => onStartActivity(activity)}
                        className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition-colors ${
                          status === 'completed' 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300' 
                            : 'bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:from-pink-500 hover:to-purple-500 shadow-md'
                        }`}
                      >
                        {status === 'completed' ? (
                          <><span>↺</span> {t('kidscamp.toddler.play_again', 'Play Again')}</>
                        ) : (
                          <><span>▶</span> {t('kidscamp.toddler.play_now', 'Play Now!')}</>
                        )}
                      </button>
                      <button
                        onClick={() => onSelectActivity(activity)}
                        className="py-4 px-6 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 font-bold text-lg"
                      >
                        👀
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                No activities found for this category!
              </p>
              <button
                onClick={() => setSelectedPillar(null)}
                className="mt-4 px-6 py-3 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-colors text-lg"
              >
                Show All Activities
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Fun Footer */}
      <footer className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 py-8 text-center text-white">
        <div className="text-4xl mb-2">🌟 🎨 🧸 🔬 🌿</div>
        <p className="text-xl font-bold">Keep being creative!</p>
        <p className="text-white/80">Made with ❤️ for little makers</p>
      </footer>
    </div>
  );
}
