import { Activity } from '../data/activities.en';
import { useTranslation } from 'react-i18next';

interface Props {
  selectedActivity: Activity;
  setSelectedActivity: (activity: Activity | null) => void;
  handleStartActivity: (activity: Activity) => void;
  getStatus: (id: string) => string;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  playClick: () => void;
}

export default function ActivityModal({
  selectedActivity,
  setSelectedActivity,
  handleStartActivity,
  getStatus,
  isFavorite,
  toggleFavorite,
  playClick
}: Props) {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setSelectedActivity(null)}
      />
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-in">
        <button
          onClick={() => setSelectedActivity(null)}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 z-10"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative h-56 overflow-hidden rounded-t-3xl">
          <img
            src={selectedActivity.image}
            alt={selectedActivity.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/images/fallback-placeholder.png';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          {/* Status Badge */}
          {getStatus(selectedActivity.id) === 'completed' && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-green-500 text-white text-sm font-medium flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              {t('completed', 'Completed')}
            </span>
          )}
          {getStatus(selectedActivity.id) === 'in-progress' && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-orange-500 text-white text-sm font-medium">
              {t('in_progress', 'In Progress')}
            </span>
          )}

          {/* Title overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white mb-1">
              {selectedActivity.name}
            </h2>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <span>★ {selectedActivity.rating}</span>
              <span>•</span>
              <span>{selectedActivity.reviewCount} {t('kidscamp.modal.reviews', 'reviews')}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`badge ${
              selectedActivity.pillar === 'toybox' ? 'badge-toybox' :
              selectedActivity.pillar === 'sciencelab' ? 'badge-sciencelab' :
              selectedActivity.pillar === 'artstudio' ? 'badge-artstudio' : 'badge-outdoorquest'
            }`}>
              {selectedActivity.pillar === 'toybox' ? '🧸' :
               selectedActivity.pillar === 'sciencelab' ? '🔬' :
               selectedActivity.pillar === 'artstudio' ? '🎨' : '🌿'}
              {' '}{t(`pillar_${selectedActivity.pillar}` as any, selectedActivity.pillar)}
            </span>
            <span className={`badge ${
              selectedActivity.difficulty === 'Easy' ? 'badge-easy' :
              selectedActivity.difficulty === 'Medium' ? 'badge-medium' : 'badge-hard'
            }`}>
              {t(`difficulty_${selectedActivity.difficulty.toLowerCase()}` as any, selectedActivity.difficulty)}
            </span>
            <span className="badge bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200">
              ⏱️ {selectedActivity.timeToMake}
            </span>
            <span className="badge bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200">
              👤 {t('ages', 'Ages')} {selectedActivity.ageRange}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {selectedActivity.description}
          </p>

          {/* Materials Preview */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span>📦</span> {t('kidscamp.modal.materials_needed', 'Materials Needed')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedActivity.materials.slice(0, 6).map((material, i) => (
                <span key={i} className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300">
                  {material.name}
                  {material.optional && <span className="text-gray-400 ml-1">{t('kidscamp.modal.opt', '(opt)')}</span>}
                </span>
              ))}
              {selectedActivity.materials.length > 6 && (
                <span className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm text-gray-500">
                  +{selectedActivity.materials.length - 6} {t('kidscamp.modal.more', 'more')}
                </span>
              )}
            </div>
          </div>

          {/* Steps Preview */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span>📋</span> {selectedActivity.steps.length} {t('kidscamp.modal.steps', 'Steps')}
            </h4>
            <div className="space-y-2">
              {selectedActivity.steps.slice(0, 3).map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-bold text-gray-500">
                    {i + 1}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{step.title}</span>
                  <span className="text-sm text-gray-400">{step.duration}</span>
                </div>
              ))}
              {selectedActivity.steps.length > 3 && (
                <p className="text-sm text-gray-500 ml-9">
                  +{selectedActivity.steps.length - 3} {t('kidscamp.modal.more_steps', 'more steps...')}
                </p>
              )}
            </div>
          </div>

          {/* Learning Outcomes */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span>🧠</span> {t('kidscamp.modal.what_you_learn', "What You'll Learn")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedActivity.learningOutcomes.map((outcome, i) => (
                <span key={i} className="px-3 py-1.5 rounded-xl bg-green-100 dark:bg-green-900/30 text-sm text-green-700 dark:text-green-300">
                  ✓ {outcome}
                </span>
              ))}
            </div>
          </div>

          {/* Cross-pillar connections */}
          {selectedActivity.crossPillar && selectedActivity.crossPillar.length > 0 && (
            <div className="mb-6 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <h4 className="font-bold text-purple-800 dark:text-purple-200 mb-2 flex items-center gap-2">
                <span>🔗</span> {t('kidscamp.modal.cross_pillar', 'Cross-Pillar Connection')}
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                {t('kidscamp.modal.cross_pillar_desc', 'This activity connects with other pillars! Complete related activities to unlock the Connector achievement.')}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => handleStartActivity(selectedActivity)}
              className="flex-1 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-colors text-lg py-4"
            >
              {getStatus(selectedActivity.id) === 'completed' ? `🔄 ${t('kidscamp.modal.build_again', 'Build Again')}` :
               getStatus(selectedActivity.id) === 'in-progress' ? `▶ ${t('kidscamp.modal.continue', 'Continue')}` :
               `🚀 ${t('kidscamp.modal.start_activity', 'Start Activity')}`}
            </button>
            <button
              onClick={() => {
                toggleFavorite(selectedActivity.id);
                playClick();
              }}
              className={`btn px-4 ${
                isFavorite(selectedActivity.id)
                  ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 border-2 border-pink-300'
                  : 'btn-secondary'
              }`}
            >
              {isFavorite(selectedActivity.id) ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
