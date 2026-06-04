// CampCraft - Featured Activities Section

import { Activity } from '../data/activities.en';
import { pillars } from '../data/categories';
import { useReveal } from '../hooks/useReveal';
import { useLocalizedActivities } from '../../hooks/useLocalizedData';
import { useTranslation } from 'react-i18next';

interface FeaturedActivitiesProps {
  onSelectActivity: (activity: Activity) => void;
  onStartActivity: (activity: Activity) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  getStatus: (id: string) => 'not-started' | 'in-progress' | 'completed';
}

export default function FeaturedActivities({
  onSelectActivity,
  onStartActivity,
  isFavorite,
  onToggleFavorite,
  getStatus
}: FeaturedActivitiesProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();
  const { getFeaturedActivities } = useLocalizedActivities();
  const { t } = useTranslation();
  const featured = getFeaturedActivities().slice(0, 4);

  const getPillar = (pillarId: string) => pillars.find(p => p.id === pillarId);

  const getStatusBadge = (activityId: string) => {
    const status = getStatus(activityId);
    if (status === 'completed') {
      return (
        <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-green-500 text-white text-sm font-medium flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>{t('kidscamp.featured.built', 'Built')}</span>
      );
    }
    if (status === 'in-progress') {
      return (
        <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-orange-500 text-white text-sm font-medium">{t('kidscamp.featured.in_progress', 'In Progress')}</span>
      );
    }
    return null;
  };

  const getButtonText = (activityId: string) => {
    const status = getStatus(activityId);
    if (status === 'completed') return t('kidscamp.featured.build_again', '🔄 Build Again');
    if (status === 'in-progress') return t('kidscamp.featured.continue', '▶ Continue');
    return t('kidscamp.featured.start_building', '🔨 Start Building');
  };

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div
          ref={ref}
          className={`text-center mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900/30 dark:to-pink-900/30 rounded-full px-4 py-2 mb-4">
            <span>⭐</span>
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">{t('kidscamp.featured.staff_picks', 'Staff Picks')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('kidscamp.featured.title', 'Featured Activities')}</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">{t('kidscamp.featured.desc', 'Our most popular projects loved by families everywhere')}</p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Large Featured Card */}
          {featured[0] && (
            <div
              className={`lg:col-span-2 lg:row-span-2 group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="relative h-64 lg:h-full min-h-[300px] overflow-hidden">
                <img
                  src={featured[0].image}
                  alt={featured[0].name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {getStatusBadge(featured[0].id)}
                
                {/* Favorite button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(featured[0].id);
                  }}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-900/90 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <svg
                    className={`w-5 h-5 ${isFavorite(featured[0].id) ? 'text-pink-500 fill-current' : 'text-gray-400'}`}
                    fill={isFavorite(featured[0].id) ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`badge badge-${featured[0].pillar}`}>
                      {getPillar(featured[0].pillar)?.icon} {getPillar(featured[0].pillar)?.name}
                    </span>
                    <span className={`badge badge-${featured[0].difficulty.toLowerCase()}`}>
                      {featured[0].difficulty}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    {featured[0].name}
                  </h3>
                  <p className="text-white/80 text-sm lg:text-base mb-4 line-clamp-2">
                    {featured[0].description}
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => onStartActivity(featured[0])}
                      className="btn btn-primary"
                    >
                      {getButtonText(featured[0].id)}
                    </button>
                    <button
                      onClick={() => onSelectActivity(featured[0])}
                      className="btn bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30"
                    >{t('kidscamp.featured.view_details', 'View Details')}</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Smaller cards */}
          {featured.slice(1).map((activity, index) => (
            <div
              key={activity.id}
              onClick={() => onSelectActivity(activity)}
              className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer hover:-translate-y-1 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${(index + 1) * 100}ms` }}
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {getStatusBadge(activity.id)}

                {/* Favorite button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(activity.id);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 dark:bg-gray-900/90 flex items-center justify-center shadow hover:scale-110 transition-transform"
                >
                  <svg
                    className={`w-4 h-4 ${isFavorite(activity.id) ? 'text-pink-500 fill-current' : 'text-gray-400'}`}
                    fill={isFavorite(activity.id) ? 'currentColor' : 'none'}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getPillar(activity.pillar)?.icon}</span>
                  <span className={`badge badge-${activity.difficulty.toLowerCase()}`}>
                    {activity.difficulty}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.timeToMake}
                  </span>
                </div>
                
                <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-orange-500 transition-colors">
                  {activity.name}
                </h4>
                
                <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                  <span className="text-yellow-500">★</span>
                  <span>{activity.rating}</span>
                  <span>({activity.reviewCount})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
