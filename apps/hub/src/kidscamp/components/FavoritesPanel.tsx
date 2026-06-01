import { Activity, activities } from '../data/activities';

interface Props {
  favorites: string[];
  favoritesCount: number;
  handleSelectActivity: (activity: Activity) => void;
  setFavoritesOpen: (open: boolean) => void;
}

export default function FavoritesPanel({
  favorites,
  favoritesCount,
  handleSelectActivity,
  setFavoritesOpen
}: Props) {
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setFavoritesOpen(false)}
      />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl animate-slide-in-mobile">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Favorites ({favoritesCount})
          </h2>
          <button
            onClick={() => setFavoritesOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">💝</div>
              <p className="text-gray-600 dark:text-gray-300">No favorites yet!</p>
              <p className="text-sm text-gray-500">Tap the heart icon on any activity to save it here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {favorites.map((id) => {
                const activity = activities.find(a => a.id === id);
                if (!activity) return null;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      handleSelectActivity(activity);
                      setFavoritesOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    <span className="text-2xl">
                      {activity.pillar === 'toybox' ? '🧸' :
                       activity.pillar === 'sciencelab' ? '🔬' :
                       activity.pillar === 'artstudio' ? '🎨' : '🌿'}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{activity.name}</p>
                      <p className="text-sm text-gray-500">{activity.difficulty} • {activity.timeToMake}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
